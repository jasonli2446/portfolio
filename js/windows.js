export const windows = [];

let draggedWin = null;
let dragStartX = 0, dragStartY = 0;
let winStartLeft = 0, winStartTop = 0;
let wallMatrix = null;

/**
 * Get the accumulated CSS 3D transform matrix from a wall element
 * all the way up to the viewport, then invert it so we can project
 * screen-space deltas back into wall-local pixel deltas.
 */
function getWallInverseMatrix(wallEl) {
  // Walk up from the wall to the perspective container (#room)
  // and accumulate the full transform chain.
  // CSS getComputedStyle().transform gives the resolved matrix for each element.
  const matrices = [];
  let el = wallEl;
  while (el && el !== document.documentElement) {
    const style = getComputedStyle(el);
    const t = style.transform;
    if (t && t !== 'none') {
      matrices.push(new DOMMatrix(t));
    }
    el = el.parentElement;
  }

  // Multiply in reverse order (outermost first) to get the full transform
  let full = new DOMMatrix();
  for (let i = matrices.length - 1; i >= 0; i--) {
    full = full.multiply(matrices[i]);
  }
  return full.inverse();
}

/**
 * Convert a screen-space delta (dx, dy) to wall-local delta
 * using the wall's inverse transform matrix.
 */
function screenDeltaToWallLocal(invMatrix, screenDX, screenDY) {
  // Transform two points: origin and origin+delta
  // The difference gives us the wall-local delta
  const p0 = invMatrix.transformPoint(new DOMPoint(0, 0, 0));
  const p1 = invMatrix.transformPoint(new DOMPoint(screenDX, screenDY, 0));
  return { dx: p1.x - p0.x, dy: p1.y - p0.y };
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
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    winStartLeft = parseInt(el.style.left) || 0;
    winStartTop  = parseInt(el.style.top)  || 0;
    wallMatrix = getWallInverseMatrix(parentWall);
    content.style.pointerEvents = 'none';
    titlebar.setPointerCapture(e.pointerId);
    console.log('[drag] pointerdown', title, 'at', e.clientX, e.clientY, 'winPos', winStartLeft, winStartTop);
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
  if (!draggedWin || !wallMatrix) return;

  const screenDX = e.clientX - dragStartX;
  const screenDY = e.clientY - dragStartY;

  const local = screenDeltaToWallLocal(wallMatrix, screenDX, screenDY);

  console.log('[drag] move screenΔ', screenDX.toFixed(0), screenDY.toFixed(0),
    '→ localΔ', local.dx.toFixed(1), local.dy.toFixed(1));

  const el = draggedWin.element;
  const wall = draggedWin.parentWall;
  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;
  const ew = el.offsetWidth;
  const eh = el.offsetHeight;
  const margin = 10;

  const newLeft = Math.max(margin, Math.min(pw - ew - margin, winStartLeft + local.dx));
  const newTop  = Math.max(margin, Math.min(ph - eh - margin, winStartTop  + local.dy));

  el.style.left = newLeft + 'px';
  el.style.top  = newTop  + 'px';
});

// Drag end
document.addEventListener('pointerup', () => {
  if (!draggedWin) return;
  console.log('[drag] pointerup');
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
  wallMatrix = null;
});
