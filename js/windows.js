export const windows = [];

let draggedWin = null;
let dragGrabX = 0, dragGrabY = 0;

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

function screenToLocal(fwd, sx, sy) {
  const A = fwd.m11 - sx * fwd.m14;
  const B = fwd.m21 - sx * fwd.m24;
  const C = fwd.m12 - sy * fwd.m14;
  const D = fwd.m22 - sy * fwd.m24;
  const E = sx * fwd.m44 - fwd.m41;
  const F = sy * fwd.m44 - fwd.m42;
  const det = A * D - B * C;
  if (Math.abs(det) < 1e-10) return null;
  return { x: (E * D - B * F) / det, y: (A * F - E * C) / det };
}

// ── Wall helpers ──────────────────────────────────────────

function getWall(name) { return document.querySelector('.wall-' + name); }

function wallName(el) {
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
// Maps (wallName, edge) → { wall element, coordinate transform }
// The transform converts (left, top) on the source wall to
// (left, top) on the neighbor wall, producing a continuous position
// as if the two walls were unfolded flat.

function getNeighbor(wName, edge) {
  const L = getWall('left'), R = getWall('right');
  const B = getWall('back'), F = getWall('floor'), C = getWall('ceiling');
  const map = {
    'back:left':      { wall: L, pos: (l, t) => ({ left: L.offsetWidth + l,  top: t }) },
    'back:right':     { wall: R, pos: (l, t) => ({ left: l - B.offsetWidth,  top: t }) },
    'back:top':       { wall: C, pos: (l, t) => ({ left: l, top: C.offsetHeight + t }) },
    'back:bottom':    { wall: F, pos: (l, t) => ({ left: l, top: t - B.offsetHeight }) },
    'left:right':     { wall: B, pos: (l, t) => ({ left: l - L.offsetWidth,  top: t }) },
    'right:left':     { wall: B, pos: (l, t) => ({ left: B.offsetWidth + l,  top: t }) },
    'floor:top':      { wall: B, pos: (l, t) => ({ left: l, top: B.offsetHeight + t }) },
    'ceiling:bottom': { wall: B, pos: (l, t) => ({ left: l, top: t - C.offsetHeight }) },
  };
  return map[wName + ':' + edge] || null;
}

function findEdgeToWall(fromName, toEl) {
  for (const edge of ['left', 'right', 'top', 'bottom']) {
    const nbr = getNeighbor(fromName, edge);
    if (nbr && nbr.wall === toEl) return { edge, ...nbr };
  }
  return null;
}

// ── Clone management ──────────────────────────────────────
// Clones are visual-only copies of the window, placed on adjacent
// walls to show the portion that overflows past the current wall's edge.

const activeClones = new Map(); // neighbor wall el → clone el

function updateClones(win) {
  const el = win.element;
  const wall = win.parentWall;
  const wn = wallName(wall);
  if (!wn) return;

  const wl = parseFloat(el.style.left) || 0;
  const wt = parseFloat(el.style.top) || 0;
  const ww = el.offsetWidth;
  const wh = el.offsetHeight;
  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;

  // How much the window extends past each wall edge
  const over = {
    left:   Math.max(0, -wl),
    right:  Math.max(0, (wl + ww) - pw),
    top:    Math.max(0, -wt),
    bottom: Math.max(0, (wt + wh) - ph),
  };

  // Clip the main window to show only what's within this wall
  if (over.left || over.right || over.top || over.bottom) {
    el.style.clipPath = `inset(${over.top}px ${over.right}px ${over.bottom}px ${over.left}px)`;
  } else {
    el.style.clipPath = '';
  }

  const needed = new Set();

  for (const [edge, amount] of Object.entries(over)) {
    if (amount <= 0) continue;
    const nbr = getNeighbor(wn, edge);
    if (!nbr) continue;

    needed.add(nbr.wall);

    // Create clone if it doesn't exist
    let clone = activeClones.get(nbr.wall);
    if (!clone) {
      clone = el.cloneNode(true);
      clone.classList.add('window-clone');
      clone.style.pointerEvents = 'none';
      clone.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
      nbr.wall.appendChild(clone);
      activeClones.set(nbr.wall, clone);
    }

    // Position clone using the adjacency coordinate mapping
    const cpos = nbr.pos(wl, wt);
    clone.style.left   = cpos.left + 'px';
    clone.style.top    = cpos.top + 'px';
    clone.style.width  = ww + 'px';
    clone.style.height = wh + 'px';

    // Clip clone: show only the overflow strip
    let ct = 0, cr = 0, cb = 0, cl = 0;
    if (edge === 'left')   cr = ww - amount;
    if (edge === 'right')  cl = ww - amount;
    if (edge === 'top')    cb = wh - amount;
    if (edge === 'bottom') ct = wh - amount;

    // Also clip to neighbor wall bounds (handles corner overflow)
    const nw = nbr.wall.offsetWidth, nh = nbr.wall.offsetHeight;
    cl = Math.max(cl, Math.max(0, -cpos.left));
    ct = Math.max(ct, Math.max(0, -cpos.top));
    cr = Math.max(cr, Math.max(0, (cpos.left + ww) - nw));
    cb = Math.max(cb, Math.max(0, (cpos.top + wh) - nh));

    clone.style.clipPath = `inset(${ct}px ${cr}px ${cb}px ${cl}px)`;
  }

  // Remove clones for edges no longer overflowing
  for (const [wall, clone] of activeClones) {
    if (!needed.has(wall)) {
      clone.remove();
      activeClones.delete(wall);
    }
  }
}

function removeAllClones() {
  for (const [, clone] of activeClones) clone.remove();
  activeClones.clear();
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

  const win = { element: el, titlebar, content, parentWall };
  windows.push(win);

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    el.remove();
    const idx = windows.indexOf(win);
    if (idx !== -1) windows.splice(idx, 1);
  });

  titlebar.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    draggedWin = win;

    invalidateCache();

    const fwd = getFwd(parentWall);
    const local = screenToLocal(fwd, e.clientX, e.clientY);
    if (local) {
      dragGrabX = local.x - (parseFloat(el.style.left) || 0);
      dragGrabY = local.y - (parseFloat(el.style.top)  || 0);
    } else {
      dragGrabX = el.offsetWidth / 2;
      dragGrabY = 19;
    }

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

  // Detect if cursor crossed to a neighboring wall
  const hitWall = wallUnderPoint(e.clientX, e.clientY, el);
  if (hitWall && hitWall !== wall) {
    const edgeInfo = findEdgeToWall(wallName(wall), hitWall);
    if (edgeInfo) {
      const oldLeft = parseFloat(el.style.left) || 0;
      const oldTop  = parseFloat(el.style.top)  || 0;
      const newPos = edgeInfo.pos(oldLeft, oldTop);

      // Reparent to new wall
      removeAllClones();
      el.style.clipPath = '';
      hitWall.appendChild(el);
      el.style.left = newPos.left + 'px';
      el.style.top  = newPos.top + 'px';
      draggedWin.parentWall = hitWall;
      wall = hitWall;

      // Recompute grab offset so window doesn't jump
      const fwd = getFwd(wall);
      const local = screenToLocal(fwd, e.clientX, e.clientY);
      if (local) {
        dragGrabX = local.x - newPos.left;
        dragGrabY = local.y - newPos.top;
      }
    }
  }

  // Compute raw position — NO clamping, overflow handled by clones
  const fwd = getFwd(wall);
  const local = screenToLocal(fwd, e.clientX, e.clientY);
  if (!local) return;

  el.style.left = (local.x - dragGrabX) + 'px';
  el.style.top  = (local.y - dragGrabY) + 'px';

  // Update clips and clones
  updateClones(draggedWin);
});

// ── Drag end ─────────────────────────────────────────────

document.addEventListener('pointerup', () => {
  if (!draggedWin) return;

  // Clamp window to wall bounds and clean up
  const el = draggedWin.element;
  const wall = draggedWin.parentWall;
  const pw = wall.offsetWidth, ph = wall.offsetHeight;
  const ew = el.offsetWidth, eh = el.offsetHeight;
  const margin = 10;
  const left = parseFloat(el.style.left) || 0;
  const top  = parseFloat(el.style.top)  || 0;

  el.style.left = Math.max(margin, Math.min(pw - ew - margin, left)) + 'px';
  el.style.top  = Math.max(margin, Math.min(ph - eh - margin, top))  + 'px';
  el.style.clipPath = '';

  removeAllClones();
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});

window.addEventListener('resize', invalidateCache);
