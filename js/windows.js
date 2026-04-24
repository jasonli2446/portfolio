// ── Public API ────────────────────────────────────────────
// createWindow(title, widthPx, heightPx, contentHTML, wallEl) → win
// centerWindow(win, offsetX?, offsetY?)
// win = { element, titlebar, content, parentWall }

export const windows = [];

// ── Drag state ────────────────────────────────────────────
let draggedWin = null;
let dragGrabX = 0, dragGrabY = 0;
let lastScreenX = 0, lastScreenY = 0;  // fallback for degenerate unproject

// ── Forward matrix cache ──────────────────────────────────
const fwdCache = new WeakMap();

function buildForwardMatrix(wallEl) {
  const room = document.getElementById('room');
  const roomStyle = getComputedStyle(room);
  const perspective = parseFloat(roomStyle.perspective);
  const [poXStr, poYStr] = roomStyle.perspectiveOrigin.split(' ');
  const poX = parseFloat(poXStr);
  const poY = parseFloat(poYStr);

  const perspM = new DOMMatrix();
  perspM.m34 = -1 / perspective;
  const fullPersp = new DOMMatrix().translateSelf(poX, poY, 0)
    .multiplySelf(perspM)
    .translateSelf(-poX, -poY, 0);

  const offset = new DOMMatrix().translateSelf(wallEl.offsetLeft, wallEl.offsetTop, 0);
  const toParts = getComputedStyle(wallEl).transformOrigin.split(' ');
  const toX = parseFloat(toParts[0]);
  const toY = parseFloat(toParts[1]);
  const toZ = toParts.length > 2 ? parseFloat(toParts[2]) : 0;

  const raw = getComputedStyle(wallEl).transform;
  const elT = (raw && raw !== 'none') ? new DOMMatrix(raw) : new DOMMatrix();

  return fullPersp
    .multiplySelf(offset)
    .translateSelf(toX, toY, toZ)
    .multiplySelf(elT)
    .translateSelf(-toX, -toY, -toZ);
}

function getFwd(wallEl) {
  let m = fwdCache.get(wallEl);
  if (!m) { m = buildForwardMatrix(wallEl); fwdCache.set(wallEl, m); }
  return m;
}

function invalidateCache() {
  document.querySelectorAll('.wall').forEach(w => fwdCache.delete(w));
}

// ── Screen → wall-local unprojection (Cramer's rule) ─────

function screenToLocal(fwd, sx, sy) {
  const A = fwd.m11 - sx * fwd.m14;
  const B = fwd.m21 - sx * fwd.m24;
  const C = fwd.m12 - sy * fwd.m14;
  const D = fwd.m22 - sy * fwd.m24;
  const E = sx * fwd.m44 - fwd.m41;
  const F = sy * fwd.m44 - fwd.m42;
  const det = A * D - B * C;
  if (Math.abs(det) < 1e-6) return null;
  const x = (E * D - B * F) / det;
  const y = (A * F - E * C) / det;
  // Reject wildly out-of-range results (teleport protection)
  if (Math.abs(x) > 10000 || Math.abs(y) > 10000) return null;
  return { x, y };
}

// ── Wall helpers ──────────────────────────────────────────

function getWall(name) { return document.querySelector('.wall-' + name); }

function wallName(el) {
  if (!el) return null;
  for (const n of ['back', 'left', 'right', 'floor', 'ceiling'])
    if (el.classList.contains('wall-' + n)) return n;
  return null;
}

function wallUnderPoint(sx, sy, skipEl) {
  if (skipEl) skipEl.style.pointerEvents = 'none';
  const els = document.elementsFromPoint(sx, sy);
  if (skipEl) skipEl.style.pointerEvents = '';
  for (const el of els) if (el.classList.contains('wall')) return el;
  return null;
}

// ── Wall adjacency ────────────────────────────────────────
// When unfolding two walls flat, these functions map (left, top)
// on wall A to the corresponding (left, top) on wall B such that
// the shared edge lines up perfectly.
//
// Convention: the "right" edge of the back wall meets the "left"
// edge of the right wall (when looking at the inside of the box).

function getNeighbor(wName, edge) {
  const L = getWall('left'),  R = getWall('right');
  const B = getWall('back'),  F = getWall('floor'), C = getWall('ceiling');

  const map = {
    // Back wall edges
    'back:left':      { wall: L, pos: (l, t) => ({ left: L.offsetWidth + l, top: t }) },
    'back:right':     { wall: R, pos: (l, t) => ({ left: l - B.offsetWidth, top: t }) },
    'back:top':       { wall: C, pos: (l, t) => ({ left: l, top: C.offsetHeight + t }) },
    'back:bottom':    { wall: F, pos: (l, t) => ({ left: l, top: t - B.offsetHeight }) },

    // Left wall: right edge meets back wall left edge
    'left:right':     { wall: B, pos: (l, t) => ({ left: l - L.offsetWidth, top: t }) },
    'left:top':       { wall: C, pos: (l, t) => ({ left: -t, top: C.offsetHeight - l }) },
    'left:bottom':    { wall: F, pos: (l, t) => ({ left: -t, top: l }) },

    // Right wall: left edge meets back wall right edge
    'right:left':     { wall: B, pos: (l, t) => ({ left: B.offsetWidth + l, top: t }) },
    'right:top':      { wall: C, pos: (l, t) => ({ left: B.offsetWidth + t, top: l }) },
    'right:bottom':   { wall: F, pos: (l, t) => ({ left: B.offsetWidth + t, top: F.offsetHeight - l }) },

    // Floor: top edge meets back wall bottom edge
    'floor:top':      { wall: B, pos: (l, t) => ({ left: l, top: B.offsetHeight + t }) },
    'floor:left':     { wall: L, pos: (l, t) => ({ left: -t, top: l }) },
    'floor:right':    { wall: R, pos: (l, t) => ({ left: t, top: l }) },

    // Ceiling: bottom edge meets back wall top edge
    'ceiling:bottom': { wall: B, pos: (l, t) => ({ left: l, top: t - C.offsetHeight }) },
    'ceiling:left':   { wall: L, pos: (l, t) => ({ left: t, top: l }) },
    'ceiling:right':  { wall: R, pos: (l, t) => ({ left: -t, top: l }) },
  };

  return map[wName + ':' + edge] || null;
}

function findEdgeToWall(fromName, toEl) {
  if (!fromName || !toEl) return null;
  for (const edge of ['left', 'right', 'top', 'bottom']) {
    const nbr = getNeighbor(fromName, edge);
    if (nbr && nbr.wall === toEl) return { edge, ...nbr };
  }
  return null;
}

// ── Per-window clone management ───────────────────────────
// Each window tracks its own clones so multi-window drag works.

function updateClones(win) {
  const el = win.element;
  const wall = win.parentWall;
  const wn = wallName(wall);
  if (!wn) { clearClones(win); return; }

  if (!win._clones) win._clones = new Map();

  const wl = parseFloat(el.style.left) || 0;
  const wt = parseFloat(el.style.top) || 0;
  const ww = el.offsetWidth;
  const wh = el.offsetHeight;
  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;

  // How much extends past each edge
  const over = {
    left:   Math.max(0, -wl),
    right:  Math.max(0, (wl + ww) - pw),
    top:    Math.max(0, -wt),
    bottom: Math.max(0, (wt + wh) - ph),
  };

  // Clip the main window to the wall bounds
  const hasOverflow = over.left || over.right || over.top || over.bottom;
  el.style.clipPath = hasOverflow
    ? `inset(${over.top}px ${over.right}px ${over.bottom}px ${over.left}px)`
    : '';

  const needed = new Set();

  for (const [edge, amount] of Object.entries(over)) {
    if (amount <= 0) continue;
    const nbr = getNeighbor(wn, edge);
    if (!nbr) continue;

    const nbrKey = wallName(nbr.wall) + ':' + edge;
    needed.add(nbrKey);

    let clone = win._clones.get(nbrKey);
    if (!clone) {
      clone = el.cloneNode(true);
      clone.classList.add('window-clone');
      clone.style.pointerEvents = 'none';
      clone.style.clipPath = '';
      clone.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
      nbr.wall.appendChild(clone);
      win._clones.set(nbrKey, clone);
    } else {
      // Update clone content to match current window state
      // (just update size — content is static during drag)
    }

    // Position clone on neighbor wall
    const cpos = nbr.pos(wl, wt);
    clone.style.left   = cpos.left + 'px';
    clone.style.top    = cpos.top + 'px';
    clone.style.width  = ww + 'px';
    clone.style.height = wh + 'px';

    // Clip clone: show only the overflow strip for this edge
    let ct = 0, cr = 0, cb = 0, cl = 0;
    if (edge === 'left')   cr = ww - amount;
    if (edge === 'right')  cl = ww - amount;
    if (edge === 'top')    cb = wh - amount;
    if (edge === 'bottom') ct = wh - amount;

    // Additionally clip to neighbor wall bounds
    const nw = nbr.wall.offsetWidth, nh = nbr.wall.offsetHeight;
    if (cpos.left < 0)            cl = Math.max(cl, -cpos.left);
    if (cpos.top < 0)             ct = Math.max(ct, -cpos.top);
    if (cpos.left + ww > nw)      cr = Math.max(cr, cpos.left + ww - nw);
    if (cpos.top + wh > nh)       cb = Math.max(cb, cpos.top + wh - nh);

    clone.style.clipPath = `inset(${ct}px ${cr}px ${cb}px ${cl}px)`;
  }

  // Remove clones no longer needed
  for (const [key, clone] of win._clones) {
    if (!needed.has(key)) {
      clone.remove();
      win._clones.delete(key);
    }
  }
}

function clearClones(win) {
  if (!win._clones) return;
  for (const [, clone] of win._clones) clone.remove();
  win._clones.clear();
  win.element.style.clipPath = '';
}

// ── Window creation ──────────────────────────────────────

export function createWindow(title, widthPx, heightPx, contentHTML, parentWall) {
  const el = document.createElement('div');
  el.className = 'window';
  el.style.width  = widthPx + 'px';
  el.style.height = heightPx + 'px';

  const titlebar = document.createElement('div');
  titlebar.className = 'window-titlebar';

  const titleEl = document.createElement('div');
  titleEl.className = 'window-title';
  titleEl.textContent = title;

  const controls = document.createElement('div');
  controls.className = 'window-controls';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'window-btn window-btn-close';
  closeBtn.innerHTML = '&#x2715;';

  controls.appendChild(closeBtn);
  titlebar.appendChild(titleEl);
  titlebar.appendChild(controls);

  const content = document.createElement('div');
  content.className = 'window-content';
  content.innerHTML = contentHTML;

  el.appendChild(titlebar);
  el.appendChild(content);
  parentWall.appendChild(el);

  const win = { element: el, titlebar, content, parentWall, _clones: new Map() };
  windows.push(win);

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearClones(win);
    el.remove();
    const idx = windows.indexOf(win);
    if (idx !== -1) windows.splice(idx, 1);
  });

  titlebar.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    draggedWin = win;

    invalidateCache();

    const fwd = getFwd(win.parentWall);
    const local = screenToLocal(fwd, e.clientX, e.clientY);
    if (local) {
      dragGrabX = local.x - (parseFloat(el.style.left) || 0);
      dragGrabY = local.y - (parseFloat(el.style.top)  || 0);
    } else {
      dragGrabX = el.offsetWidth / 2;
      dragGrabY = el.querySelector('.window-titlebar').offsetHeight / 2;
    }

    lastScreenX = e.clientX;
    lastScreenY = e.clientY;

    content.style.pointerEvents = 'none';
    titlebar.setPointerCapture(e.pointerId);
  });

  return win;
}

export function centerWindow(win, offsetX = 0, offsetY = 0) {
  const wall = win.parentWall;
  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;
  const ew = win.element.offsetWidth;
  const eh = win.element.offsetHeight;
  win.element.style.left = ((pw - ew) / 2 + offsetX) + 'px';
  win.element.style.top  = ((ph - eh) / 2 + offsetY) + 'px';
}

// ── Drag move ────────────────────────────────────────────

document.addEventListener('pointermove', (e) => {
  if (!draggedWin) return;

  const el = draggedWin.element;
  let wall = draggedWin.parentWall;

  // Detect wall under cursor (skip the window element itself)
  const hitWall = wallUnderPoint(e.clientX, e.clientY, el);

  if (hitWall && hitWall !== wall) {
    const fromName = wallName(wall);
    const edgeInfo = findEdgeToWall(fromName, hitWall);
    if (edgeInfo) {
      const oldLeft = parseFloat(el.style.left) || 0;
      const oldTop  = parseFloat(el.style.top)  || 0;
      const newPos = edgeInfo.pos(oldLeft, oldTop);

      // Reparent to new wall
      clearClones(draggedWin);
      hitWall.appendChild(el);
      el.style.left = newPos.left + 'px';
      el.style.top  = newPos.top + 'px';
      draggedWin.parentWall = hitWall;
      wall = hitWall;

      // Recompute grab offset on new wall
      const fwd = getFwd(wall);
      const local = screenToLocal(fwd, e.clientX, e.clientY);
      if (local) {
        dragGrabX = local.x - newPos.left;
        dragGrabY = local.y - newPos.top;
      }
      // If screenToLocal fails here, keep the old grab offset —
      // it's close enough and better than a wild guess
    }
  }

  // Unproject screen position to wall-local coords
  const fwd = getFwd(wall);
  const local = screenToLocal(fwd, e.clientX, e.clientY);

  if (local) {
    el.style.left = (local.x - dragGrabX) + 'px';
    el.style.top  = (local.y - dragGrabY) + 'px';
  } else {
    // Fallback: use screen-space delta (imperfect on side walls
    // but prevents freezing and teleporting)
    const dx = e.clientX - lastScreenX;
    const dy = e.clientY - lastScreenY;
    el.style.left = ((parseFloat(el.style.left) || 0) + dx) + 'px';
    el.style.top  = ((parseFloat(el.style.top)  || 0) + dy) + 'px';
  }

  lastScreenX = e.clientX;
  lastScreenY = e.clientY;

  // Update clip-path and clones for overflow
  updateClones(draggedWin);
});

// ── Drag end ─────────────────────────────────────────────

document.addEventListener('pointerup', () => {
  if (!draggedWin) return;

  const el = draggedWin.element;
  const wall = draggedWin.parentWall;
  const pw = wall.offsetWidth, ph = wall.offsetHeight;
  const ew = el.offsetWidth, eh = el.offsetHeight;
  const left = parseFloat(el.style.left) || 0;
  const top  = parseFloat(el.style.top)  || 0;

  // Clamp to wall with dynamic margin (handles windows larger than wall)
  const mx = Math.max(0, Math.min(10, (pw - ew) / 2));
  const my = Math.max(0, Math.min(10, (ph - eh) / 2));
  el.style.left = Math.max(mx, Math.min(pw - ew - mx, left)) + 'px';
  el.style.top  = Math.max(my, Math.min(ph - eh - my, top))  + 'px';

  clearClones(draggedWin);
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});

window.addEventListener('resize', invalidateCache);
