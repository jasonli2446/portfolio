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

/**
 * Build the wall's 3D transform WITHOUT perspective applied.
 * This is the transform from wall-local space to #box space.
 * Used to position windows inside #box during wall transitions.
 */
function buildWall3DTransform(wallEl) {
  const offset = new DOMMatrix().translateSelf(wallEl.offsetLeft, wallEl.offsetTop, 0);

  const toParts = getComputedStyle(wallEl).transformOrigin.split(' ');
  const toX = parseFloat(toParts[0]);
  const toY = parseFloat(toParts[1]);
  const toZ = toParts.length > 2 ? parseFloat(toParts[2]) : 0;

  const raw = getComputedStyle(wallEl).transform;
  const elT = (raw && raw !== 'none') ? new DOMMatrix(raw) : new DOMMatrix();

  return offset
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

// ── Wall transition animation state ─────────────────────
const TRANSITION_MS = 200;
let transitioning = false;
let transitionStart = 0;
let transitionFromMatrix = null;
let transitionToMatrix = null;
let transitionToWall = null;

function startTransition(win, oldWall, newWall) {
  const el = win.element;
  const box = document.getElementById('box');

  // Current window position on old wall
  const winLeft = parseFloat(el.style.left) || 0;
  const winTop  = parseFloat(el.style.top)  || 0;

  // Compute the 3D matrix for the window at its current position on the old wall
  const oldWall3D = buildWall3DTransform(oldWall);
  transitionFromMatrix = oldWall3D.translateSelf(winLeft, winTop, 0);

  // Move window to #box (the preserve-3d container)
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.transform = transitionFromMatrix.toString();
  box.appendChild(el);

  transitioning = true;
  transitionStart = performance.now();
  transitionToWall = newWall;
  transitionWinLeft = winLeft;
  transitionWinTop = winTop;

  win.parentWall = newWall;
}

function updateTransition(win, sx, sy) {
  const el = win.element;
  const now = performance.now();
  const t = Math.min(1, (now - transitionStart) / TRANSITION_MS);

  // Compute target position on the new wall
  const fwd = getFwd(transitionToWall);
  const local = screenToLocal(fwd, sx, sy);
  if (!local) return;

  const pw = transitionToWall.offsetWidth;
  const ph = transitionToWall.offsetHeight;
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;
  const margin = 10;
  const targetLeft = Math.max(margin, Math.min(pw - ew - margin, local.x - dragGrabX));
  const targetTop  = Math.max(margin, Math.min(ph - eh - margin, local.y - dragGrabY));

  // Target 3D matrix on new wall
  transitionToMatrix = buildWall3DTransform(transitionToWall)
    .translateSelf(targetLeft, targetTop, 0);

  // Interpolate matrices
  const interp = interpolateMatrix(transitionFromMatrix, transitionToMatrix, easeOut(t));
  el.style.transform = interp.toString();

  // Transition complete — reparent to actual wall
  if (t >= 1) {
    transitioning = false;
    el.style.transform = '';
    el.style.left = targetLeft + 'px';
    el.style.top  = targetTop + 'px';
    transitionToWall.appendChild(el);

    // Recompute grab offset on new wall
    dragGrabX = el.offsetWidth / 2;
    dragGrabY = 19;
  }
}

function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Linearly interpolate each element of two 4x4 DOMMatrix objects.
 * Works for smooth transitions because the wall rotations are always
 * 90° around a single axis — component-wise lerp is well-behaved.
 */
function interpolateMatrix(a, b, t) {
  const r = new DOMMatrix();
  for (const key of [
    'm11','m12','m13','m14',
    'm21','m22','m23','m24',
    'm31','m32','m33','m34',
    'm41','m42','m43','m44',
  ]) {
    r[key] = a[key] + (b[key] - a[key]) * t;
  }
  return r;
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
    transitioning = false;

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

  // During transition animation, keep interpolating
  if (transitioning) {
    updateTransition(draggedWin, e.clientX, e.clientY);
    return;
  }

  let wall = draggedWin.parentWall;

  // Detect wall under cursor
  const hitWall = wallUnderPoint(e.clientX, e.clientY, el);

  if (hitWall && hitWall !== wall) {
    // Start animated transition to new wall
    startTransition(draggedWin, wall, hitWall);
    updateTransition(draggedWin, e.clientX, e.clientY);
    return;
  }

  // Normal drag on current wall
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

  // If mid-transition, finish it immediately
  if (transitioning) {
    const el = draggedWin.element;
    const wall = draggedWin.parentWall;
    el.style.transform = '';
    wall.appendChild(el);

    // Place at center of wall as fallback
    const pw = wall.offsetWidth;
    const ph = wall.offsetHeight;
    const ew = el.offsetWidth;
    const eh = el.offsetHeight;
    el.style.left = ((pw - ew) / 2) + 'px';
    el.style.top  = ((ph - eh) / 2) + 'px';
    transitioning = false;
  }

  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});

window.addEventListener('resize', invalidateCache);
