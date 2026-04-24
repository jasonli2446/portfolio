export const windows = [];

let draggedWin = null;
let dragGrabX = 0, dragGrabY = 0;

// ── Forward matrix cache (wall-local → screen) ──────────
const fwdCache = new WeakMap();

function buildForwardMatrix(wallEl) {
  const room = document.getElementById('room');
  const roomStyle = getComputedStyle(room);
  const perspective = parseFloat(roomStyle.perspective);
  const [poXStr, poYStr] = roomStyle.perspectiveOrigin.split(' ');
  const poX = parseFloat(poXStr);
  const poY = parseFloat(poYStr);

  // CSS perspective relative to perspective-origin
  const perspM = new DOMMatrix();
  perspM.m34 = -1 / perspective;
  const fullPersp = new DOMMatrix().translateSelf(poX, poY, 0)
    .multiplySelf(perspM)
    .translateSelf(-poX, -poY, 0);

  // Element's position in parent
  const offset = new DOMMatrix().translateSelf(wallEl.offsetLeft, wallEl.offsetTop, 0);

  // Transform-origin
  const toParts = getComputedStyle(wallEl).transformOrigin.split(' ');
  const toX = parseFloat(toParts[0]);
  const toY = parseFloat(toParts[1]);
  const toZ = toParts.length > 2 ? parseFloat(toParts[2]) : 0;

  // Element's own CSS transform
  const raw = getComputedStyle(wallEl).transform;
  const elT = (raw && raw !== 'none') ? new DOMMatrix(raw) : new DOMMatrix();

  // Full chain: persp * offset * toOrigin * transform * fromOrigin
  return fullPersp
    .multiplySelf(offset)
    .translateSelf(toX, toY, toZ)
    .multiplySelf(elT)
    .translateSelf(-toX, -toY, -toZ);
}

function getFwd(wallEl) {
  let m = fwdCache.get(wallEl);
  if (!m) {
    m = buildForwardMatrix(wallEl);
    fwdCache.set(wallEl, m);
  }
  return m;
}

function invalidateCache() {
  document.querySelectorAll('.wall').forEach(w => fwdCache.delete(w));
}

/**
 * Unproject screen point (sx, sy) to wall-local (x, y).
 *
 * The forward matrix M maps wall-local (x, y, 0, 1) to homogeneous screen:
 *   hx = m11·x + m21·y + m41
 *   hy = m12·x + m22·y + m42
 *   hw = m14·x + m24·y + m44
 *   screen_x = hx/hw,  screen_y = hy/hw
 *
 * Rearranging gives a 2×2 system solved by Cramer's rule.
 * This correctly handles perspective — no matrix inversion needed.
 */
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

function wallUnderPoint(sx, sy, skipEl) {
  if (skipEl) skipEl.style.pointerEvents = 'none';
  const els = document.elementsFromPoint(sx, sy);
  if (skipEl) skipEl.style.pointerEvents = '';
  for (const el of els) {
    if (el.classList.contains('wall')) return el;
  }
  return null;
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
      dragGrabY = 19; // half titlebar height
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

  // Detect wall under cursor
  const hitWall = wallUnderPoint(e.clientX, e.clientY, el);

  if (hitWall && hitWall !== wall) {
    // Reparent window to new wall
    hitWall.appendChild(el);
    draggedWin.parentWall = hitWall;
    wall = hitWall;

    // Recompute grab offset: center window under cursor on new wall
    dragGrabX = el.offsetWidth / 2;
    dragGrabY = 19;
  }

  const fwd = getFwd(wall);
  const local = screenToLocal(fwd, e.clientX, e.clientY);
  if (!local) return;

  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;
  const margin = 10;

  const rawLeft = local.x - dragGrabX;
  const rawTop  = local.y - dragGrabY;

  el.style.left = Math.max(margin, Math.min(pw - ew - margin, rawLeft)) + 'px';
  el.style.top  = Math.max(margin, Math.min(ph - eh - margin, rawTop))  + 'px';
});

// ── Drag end ─────────────────────────────────────────────

document.addEventListener('pointerup', () => {
  if (!draggedWin) return;
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});

window.addEventListener('resize', invalidateCache);
