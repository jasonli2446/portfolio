export const windows = [];

let draggedWin = null;

/**
 * Build the full screen→wall-local projection for a given wall.
 *
 * CSS 3D pipeline:
 *   1. Translate to transform-origin
 *   2. Apply the element's transform (rotateY, translateZ, etc.)
 *   3. Translate back from transform-origin
 *   4. Translate by element's offset (top/left within parent)
 *   5. Apply perspective from the parent container
 *
 * We replicate this, then invert to go screen→local.
 */
function getScreenToLocal(wallEl) {
  const room = document.getElementById('room');
  const perspective = parseFloat(getComputedStyle(room).perspective);
  // perspective-origin (defaults to 50% 50%)
  const poStyle = getComputedStyle(room).perspectiveOrigin;
  const poParts = poStyle.split(' ');
  const poX = parseFloat(poParts[0]);  // already in px from computed
  const poY = parseFloat(poParts[1]);

  // The CSS perspective matrix:
  //   perspective(p) translates to a matrix where m34 = -1/p
  //   but it's applied relative to perspective-origin, so:
  //   translate(poX, poY) * perspective(p) * translate(-poX, -poY)
  const perspMatrix = new DOMMatrix();
  perspMatrix.m34 = -1 / perspective;

  const toPO = new DOMMatrix().translateSelf(poX, poY, 0);
  const fromPO = new DOMMatrix().translateSelf(-poX, -poY, 0);
  const fullPersp = toPO.multiply(perspMatrix).multiply(fromPO);

  // Element's offset in the parent (its CSS top/left position)
  const offsetLeft = wallEl.offsetLeft;
  const offsetTop  = wallEl.offsetTop;
  const elOffset = new DOMMatrix().translateSelf(offsetLeft, offsetTop, 0);

  // Transform-origin (resolved in px by computed style)
  const toStyle = getComputedStyle(wallEl).transformOrigin;
  const toParts = toStyle.split(' ');
  const toX = parseFloat(toParts[0]);
  const toY = parseFloat(toParts[1]);
  const toZ = toParts[2] ? parseFloat(toParts[2]) : 0;

  // The element's own CSS transform
  const rawTransform = getComputedStyle(wallEl).transform;
  const elTransform = rawTransform && rawTransform !== 'none'
    ? new DOMMatrix(rawTransform)
    : new DOMMatrix();

  // Full chain: perspective * offset * toOrigin * transform * fromOrigin
  const toOrigin = new DOMMatrix().translateSelf(toX, toY, toZ);
  const fromOrigin = new DOMMatrix().translateSelf(-toX, -toY, -toZ);

  const wallToScreen = fullPersp
    .multiply(elOffset)
    .multiply(toOrigin)
    .multiply(elTransform)
    .multiply(fromOrigin);

  return wallToScreen.inverse();
}

/**
 * Given a screen point (clientX, clientY), unproject to
 * wall-local (x, y) coordinates using the inverse matrix.
 *
 * Screen points are 2D but represent a ray from the viewer
 * through the screen. We need the intersection with the wall plane.
 *
 * For a perspective projection, a screen pixel (sx, sy) corresponds
 * to the 3D point (sx, sy, 0) in the #room's coordinate space.
 * We transform this through the inverse to get wall-local coords.
 */
function screenToWallLocal(invMatrix, sx, sy) {
  // The screen point is at z=0 in room-space, w=1
  const p = invMatrix.transformPoint(new DOMPoint(sx, sy, 0, 1));
  // Perspective divide
  if (Math.abs(p.w) < 1e-10) return null;
  return { x: p.x / p.w, y: p.y / p.w };
}

/**
 * Find which wall element is under the given screen point.
 */
function wallUnderPoint(sx, sy) {
  const els = document.elementsFromPoint(sx, sy);
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


    // Compute grab offset in wall-local coords
    const invMatrix = getScreenToLocal(parentWall);
    const localPos = screenToWallLocal(invMatrix, e.clientX, e.clientY);
    if (localPos) {
      draggedWin._grabOffsetX = localPos.x - (parseInt(el.style.left) || 0);
      draggedWin._grabOffsetY = localPos.y - (parseInt(el.style.top) || 0);
    } else {
      draggedWin._grabOffsetX = 0;
      draggedWin._grabOffsetY = 0;
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

// Drag move
document.addEventListener('pointermove', (e) => {
  if (!draggedWin) return;

  const el = draggedWin.element;
  let wall = draggedWin.parentWall;

  // Check if pointer has moved to a different wall
  // Temporarily hide the window so elementsFromPoint hits the wall
  el.style.visibility = 'hidden';
  const hitWall = wallUnderPoint(e.clientX, e.clientY);
  el.style.visibility = '';

  if (hitWall && hitWall !== wall) {
    // Reparent the window to the new wall
    hitWall.appendChild(el);
    draggedWin.parentWall = hitWall;
    wall = hitWall;
  }

  // Unproject screen position to wall-local coords
  const invMatrix = getScreenToLocal(wall);
  const localPos = screenToWallLocal(invMatrix, e.clientX, e.clientY);
  if (!localPos) return;

  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;
  const margin = 10;

  const newLeft = localPos.x - draggedWin._grabOffsetX;
  const newTop  = localPos.y - draggedWin._grabOffsetY;

  el.style.left = Math.max(margin, Math.min(pw - ew - margin, newLeft)) + 'px';
  el.style.top  = Math.max(margin, Math.min(ph - eh - margin, newTop))  + 'px';
});

// Drag end
document.addEventListener('pointerup', () => {
  if (!draggedWin) return;
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});
