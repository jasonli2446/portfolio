export const windows = [];

let draggedWin = null;

// Cached inverse matrices — rebuilt on drag start and wall switch
const invMatrixCache = new WeakMap();

/**
 * Build the full screen→wall-local inverse matrix for a given wall.
 * Replicates the CSS 3D pipeline analytically then inverts.
 */
function buildInverseMatrix(wallEl) {
  const room = document.getElementById('room');
  const roomStyle = getComputedStyle(room);
  const perspective = parseFloat(roomStyle.perspective);

  const poStyle = roomStyle.perspectiveOrigin;
  const poParts = poStyle.split(' ');
  const poX = parseFloat(poParts[0]);
  const poY = parseFloat(poParts[1]);

  // perspective(p) relative to perspective-origin
  const perspMatrix = new DOMMatrix();
  perspMatrix.m34 = -1 / perspective;
  const toPO = new DOMMatrix().translateSelf(poX, poY, 0);
  const fromPO = new DOMMatrix().translateSelf(-poX, -poY, 0);
  const fullPersp = toPO.multiply(perspMatrix).multiply(fromPO);

  // Element offset in parent
  const elOffset = new DOMMatrix().translateSelf(wallEl.offsetLeft, wallEl.offsetTop, 0);

  // Transform-origin
  const toStyle = getComputedStyle(wallEl).transformOrigin;
  const toParts = toStyle.split(' ');
  const toX = parseFloat(toParts[0]);
  const toY = parseFloat(toParts[1]);
  const toZ = toParts[2] ? parseFloat(toParts[2]) : 0;

  // Element's CSS transform
  const rawTransform = getComputedStyle(wallEl).transform;
  const elTransform = rawTransform && rawTransform !== 'none'
    ? new DOMMatrix(rawTransform)
    : new DOMMatrix();

  const toOrigin = new DOMMatrix().translateSelf(toX, toY, toZ);
  const fromOrigin = new DOMMatrix().translateSelf(-toX, -toY, -toZ);

  const wallToScreen = fullPersp
    .multiply(elOffset)
    .multiply(toOrigin)
    .multiply(elTransform)
    .multiply(fromOrigin);

  return wallToScreen.inverse();
}

function getInverseMatrix(wallEl) {
  let cached = invMatrixCache.get(wallEl);
  if (!cached) {
    cached = buildInverseMatrix(wallEl);
    invMatrixCache.set(wallEl, cached);
  }
  return cached;
}

function invalidateMatrixCache() {
  // Clear all cached matrices (call on drag start, wall switch, resize)
  invMatrixCache.delete(document.querySelector('.wall-back'));
  invMatrixCache.delete(document.querySelector('.wall-left'));
  invMatrixCache.delete(document.querySelector('.wall-right'));
  invMatrixCache.delete(document.querySelector('.wall-floor'));
  invMatrixCache.delete(document.querySelector('.wall-ceiling'));
}

/**
 * Unproject screen point to wall-local coordinates.
 */
function screenToWallLocal(invMatrix, sx, sy) {
  const p = invMatrix.transformPoint(new DOMPoint(sx, sy, 0, 1));
  if (Math.abs(p.w) < 1e-10) return null;
  return { x: p.x / p.w, y: p.y / p.w };
}

/**
 * Find which wall the screen point is over.
 * Uses elementsFromPoint but with pointer-events toggling
 * only on the dragged window (not visibility, avoiding reflow).
 */
function wallUnderPoint(sx, sy, skipEl) {
  if (skipEl) skipEl.style.pointerEvents = 'none';
  const els = document.elementsFromPoint(sx, sy);
  if (skipEl) skipEl.style.pointerEvents = '';
  for (const el of els) {
    if (el.classList.contains('wall')) return el;
  }
  return null;
}

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

    // Rebuild matrix cache at drag start
    invalidateMatrixCache();

    // Compute grab offset in wall-local coords
    const invMatrix = getInverseMatrix(parentWall);
    const localPos = screenToWallLocal(invMatrix, e.clientX, e.clientY);
    if (localPos) {
      draggedWin._grabOffsetX = localPos.x - (parseFloat(el.style.left) || 0);
      draggedWin._grabOffsetY = localPos.y - (parseFloat(el.style.top) || 0);
    } else {
      draggedWin._grabOffsetX = 0;
      draggedWin._grabOffsetY = 0;
    }

    // Store current position for smoothing
    draggedWin._currentLeft = parseFloat(el.style.left) || 0;
    draggedWin._currentTop  = parseFloat(el.style.top) || 0;

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

const DRAG_LERP = 0.45;  // 0 = no movement, 1 = instant (no smoothing)

// Drag move
document.addEventListener('pointermove', (e) => {
  if (!draggedWin) return;

  const el = draggedWin.element;
  let wall = draggedWin.parentWall;

  // Detect wall under pointer (toggle pointerEvents on window, not visibility)
  const hitWall = wallUnderPoint(e.clientX, e.clientY, el);

  if (hitWall && hitWall !== wall) {
    // Reparent the window to the new wall
    hitWall.appendChild(el);
    draggedWin.parentWall = hitWall;
    wall = hitWall;

    // Recompute grab offset for new wall
    invalidateMatrixCache();
    const invMatrix = getInverseMatrix(wall);
    const localPos = screenToWallLocal(invMatrix, e.clientX, e.clientY);
    if (localPos) {
      draggedWin._grabOffsetX = localPos.x - draggedWin._currentLeft;
      draggedWin._grabOffsetY = localPos.y - draggedWin._currentTop;
    }
  }

  // Unproject screen position to wall-local coords
  const invMatrix = getInverseMatrix(wall);
  const localPos = screenToWallLocal(invMatrix, e.clientX, e.clientY);
  if (!localPos) return;

  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;
  const margin = 10;

  const targetLeft = Math.max(margin, Math.min(pw - ew - margin,
    localPos.x - draggedWin._grabOffsetX));
  const targetTop = Math.max(margin, Math.min(ph - eh - margin,
    localPos.y - draggedWin._grabOffsetY));

  // Lerp toward target for smooth movement
  draggedWin._currentLeft += (targetLeft - draggedWin._currentLeft) * DRAG_LERP;
  draggedWin._currentTop  += (targetTop  - draggedWin._currentTop)  * DRAG_LERP;

  el.style.left = draggedWin._currentLeft + 'px';
  el.style.top  = draggedWin._currentTop  + 'px';
});

// Drag end
document.addEventListener('pointerup', () => {
  if (!draggedWin) return;
  // Snap to final target position
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});

// Invalidate cache on resize (perspective-origin changes)
window.addEventListener('resize', invalidateMatrixCache);
