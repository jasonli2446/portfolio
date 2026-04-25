// ── Public API ────────────────────────────────────────────
// resolveWall(name)          — 'back' → DOM element
// createWindow(descriptor)   — create + place on wall + return win
// centerWindow(win, ox, oy)  — center on wall
// focusWindow(win)           — z-index + glow
// minimizeWindow(win)        — hide, clear clones
// restoreWindow(win)         — show at last position
// fullscreenWindow(win)      — fill wall
// hideWindow(win)            — close = hide
// showWindow(win)            — dock reopen
//
// win = { id, element, titlebar, content, parentWall, state, ... }
// state: 'normal' | 'minimized' | 'fullscreen' | 'hidden'

import { IS_MOBILE } from './config.js';

export const windows = [];

// Callback fired whenever a window's state changes (for dock sync)
let _onStateChange = null;
export function onWindowStateChange(fn) { _onStateChange = fn; }
export function getFocusedWindow() { return focusedWin; }
function notifyStateChange() { if (_onStateChange) _onStateChange(); }

// ── Drag state ────────────────────────────────────────────
let draggedWin = null;
let dragGrabX = 0, dragGrabY = 0;
let lastScreenX = 0, lastScreenY = 0;

// ── Resize state ──────────────────────────────────────────
let resizingWin = null;
let resizeStartW = 0, resizeStartH = 0;
let resizeStartSX = 0, resizeStartSY = 0;
let resizeStartLocal = null;

// ── Focus z-ordering (per-wall) ───────────────────────────
let focusedWin = null;
const wallZCounters = new Map();

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

export function getFwd(wallEl) {
  let m = fwdCache.get(wallEl);
  if (!m) { m = buildForwardMatrix(wallEl); fwdCache.set(wallEl, m); }
  return m;
}

export function invalidateCache() {
  document.querySelectorAll('.wall').forEach(w => fwdCache.delete(w));
}

// ── Screen → wall-local unprojection (Cramer's rule) ─────

export function screenToLocal(fwd, sx, sy) {
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
  if (Math.abs(x) > 10000 || Math.abs(y) > 10000) return null;
  return { x, y };
}

// ── Wall helpers ──────────────────────────────────────────

export function resolveWall(name) {
  return document.querySelector('.wall-' + name);
}

export function wallName(el) {
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

function getNeighbor(wName, edge) {
  const L = resolveWall('left'), R = resolveWall('right');
  const B = resolveWall('back'), F = resolveWall('floor'), C = resolveWall('ceiling');

  const map = {
    'back:left':      { wall: L, pos: (l, t) => ({ left: L.offsetWidth + l, top: t }) },
    'back:right':     { wall: R, pos: (l, t) => ({ left: l - B.offsetWidth, top: t }) },
    'back:top':       { wall: C, pos: (l, t) => ({ left: l, top: C.offsetHeight + t }) },
    'back:bottom':    { wall: F, pos: (l, t) => ({ left: l, top: t - B.offsetHeight }) },
    'left:right':     { wall: B, pos: (l, t) => ({ left: l - L.offsetWidth, top: t }) },
    'right:left':     { wall: B, pos: (l, t) => ({ left: B.offsetWidth + l, top: t }) },
    'floor:top':      { wall: B, pos: (l, t) => ({ left: l, top: B.offsetHeight + t }) },
    'ceiling:bottom': { wall: B, pos: (l, t) => ({ left: l, top: t - C.offsetHeight }) },
  };

  return map[wName + ':' + edge] || null;
}

export function findEdgeToWall(fromName, toEl) {
  if (!fromName || !toEl) return null;
  for (const edge of ['left', 'right', 'top', 'bottom']) {
    const nbr = getNeighbor(fromName, edge);
    if (nbr && nbr.wall === toEl) return { edge, ...nbr };
  }
  return null;
}

// ── Per-window clone management ───────────────────────────

function updateClones(win) {
  if (win.state !== 'normal') return;
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

  const over = {
    left:   Math.max(0, -wl),
    right:  Math.max(0, (wl + ww) - pw),
    top:    Math.max(0, -wt),
    bottom: Math.max(0, (wt + wh) - ph),
  };

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
      clone.style.clipPath = '';
      clone.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));

      // Clone content is non-interactive, but titlebar and resize handle redirect to real window
      clone.querySelector('.window-content').style.pointerEvents = 'none';

      // Titlebar on clone triggers drag on real window
      const cloneTitlebar = clone.querySelector('.window-titlebar');
      if (cloneTitlebar) {
        cloneTitlebar.addEventListener('pointerdown', (e) => {
          if (win.state !== 'normal') return;
          if (e.target.closest('.window-btn')) return;
          e.stopPropagation();
          e.preventDefault();

          // Clear clones first so the real window is fully visible,
          // then start the drag from the real window's wall
          clearClones(win);
          draggedWin = win;
          invalidateCache();

          // Use center of titlebar as grab offset (can't unproject from clone's wall)
          dragGrabX = el.offsetWidth / 2;
          dragGrabY = win.titlebar.offsetHeight / 2;

          lastScreenX = e.clientX;
          lastScreenY = e.clientY;
          win.content.style.pointerEvents = 'none';
          // Capture on document since clone is now removed
          focusWindow(win);
        });
      }

      // Resize handle on clone triggers resize on real window
      const cloneResize = clone.querySelector('.window-resize-handle');
      if (cloneResize) {
        cloneResize.addEventListener('pointerdown', (e) => {
          if (win.state !== 'normal') return;
          e.stopPropagation();
          e.preventDefault();

          // Clear clones so resize operates on real window only
          clearClones(win);
          resizingWin = win;
          resizeStartW = el.offsetWidth;
          resizeStartH = el.offsetHeight;
          resizeStartSX = e.clientX;
          resizeStartSY = e.clientY;
          invalidateCache();
          resizeStartLocal = null; // use screen-space fallback
          win.content.style.pointerEvents = 'none';
          focusWindow(win);
        });
      }

      // Close/minimize buttons on clone work on real window
      const cloneClose = clone.querySelector('.window-btn-close');
      if (cloneClose) cloneClose.addEventListener('click', (e) => { e.stopPropagation(); hideWindow(win); });
      const cloneMin = clone.querySelector('.window-btn-minimize');
      if (cloneMin) cloneMin.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(win); });

      nbr.wall.appendChild(clone);
      win._clones.set(nbrKey, clone);
    }

    const cpos = nbr.pos(wl, wt);
    clone.style.left   = cpos.left + 'px';
    clone.style.top    = cpos.top + 'px';
    clone.style.width  = ww + 'px';
    clone.style.height = wh + 'px';

    let ct = 0, cr = 0, cb = 0, cl = 0;
    if (edge === 'left')   cr = ww - amount;
    if (edge === 'right')  cl = ww - amount;
    if (edge === 'top')    cb = wh - amount;
    if (edge === 'bottom') ct = wh - amount;

    const nw = nbr.wall.offsetWidth, nh = nbr.wall.offsetHeight;
    if (cpos.left < 0)            cl = Math.max(cl, -cpos.left);
    if (cpos.top < 0)             ct = Math.max(ct, -cpos.top);
    if (cpos.left + ww > nw)      cr = Math.max(cr, cpos.left + ww - nw);
    if (cpos.top + wh > nh)       cb = Math.max(cb, cpos.top + wh - nh);

    clone.style.clipPath = `inset(${ct}px ${cr}px ${cb}px ${cl}px)`;
  }

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

// ── Window state management ──────────────────────────────

export function focusWindow(win) {
  if (!win || win.state === 'hidden') return;

  // Remove glow from previous
  if (focusedWin && focusedWin !== win) {
    focusedWin.element.classList.remove('window-focused');
  }

  // Per-wall z-counter
  const wn = wallName(win.parentWall) || 'default';
  const z = (wallZCounters.get(wn) || 0) + 1;
  wallZCounters.set(wn, z);
  win.element.style.zIndex = z;
  win.element.classList.add('window-focused');
  focusedWin = win;
}

export function minimizeWindow(win) {
  if (!win || win.state === 'minimized' || win.state === 'hidden') return;

  // If fullscreen, save fullscreen state so restore goes back to normal
  if (win.state === 'fullscreen') {
    _exitFullscreen(win);
  }

  clearClones(win);

  // Minimize animation
  const el = win.element;
  el.classList.add('window-closing');
  el.addEventListener('animationend', () => {
    el.classList.remove('window-closing');
    el.style.display = 'none';
  }, { once: true });

  win.state = 'minimized';
  notifyStateChange();
}

export function restoreWindow(win) {
  if (!win) return;

  win.element.style.display = '';
  win.element.classList.add('window-opening');
  win.element.addEventListener('animationend', () => win.element.classList.remove('window-opening'), { once: true });
  win.state = 'normal';
  focusWindow(win);
  notifyStateChange();
}

export function fullscreenWindow(win) {
  if (!win || win.state === 'hidden') return;

  if (win.state === 'fullscreen') {
    // Toggle off
    _exitFullscreen(win);
    return;
  }

  // Save geometry before going fullscreen
  const el = win.element;
  win._saved = {
    left: el.style.left,
    top: el.style.top,
    width: el.style.width,
    height: el.style.height,
  };

  clearClones(win);

  // Add transition class, then expand
  el.classList.add('fullscreen');
  // Force layout so the transition animates from current position
  el.offsetHeight;

  // On the back wall, leave room for menu bar (32px) and dock area
  const isBackWall = wallName(win.parentWall) === 'back';
  const topOffset = isBackWall ? 32 : 0;
  const bottomOffset = isBackWall ? 80 : 0;

  el.style.left = '0px';
  el.style.top = topOffset + 'px';
  el.style.width = win.parentWall.offsetWidth + 'px';
  el.style.height = (win.parentWall.offsetHeight - topOffset - bottomOffset) + 'px';

  win.state = 'fullscreen';
  focusWindow(win);
}

function _exitFullscreen(win) {
  const el = win.element;
  if (win._saved) {
    el.style.left   = win._saved.left;
    el.style.top    = win._saved.top;
    el.style.width  = win._saved.width;
    el.style.height = win._saved.height;
  }

  // Remove transition class after animation completes
  const onEnd = () => {
    el.classList.remove('fullscreen');
    el.removeEventListener('transitionend', onEnd);
    // Re-enable clones at restored position
    updateClones(win);
  };
  el.addEventListener('transitionend', onEnd);

  win.state = 'normal';
}

export function hideWindow(win) {
  if (!win || win.state === 'hidden') return;

  if (win.state === 'fullscreen') _exitFullscreen(win);
  clearClones(win);

  // Close animation
  const el = win.element;
  el.classList.add('window-closing');
  el.addEventListener('animationend', () => {
    el.classList.remove('window-closing');
    el.style.display = 'none';
  }, { once: true });

  win.state = 'hidden';

  if (focusedWin === win) {
    el.classList.remove('window-focused');
    focusedWin = null;
  }
  notifyStateChange();
}

export function showWindow(win) {
  if (!win || win.state !== 'hidden') return;

  win.element.style.display = '';
  win.element.classList.add('window-opening');
  win.element.addEventListener('animationend', () => win.element.classList.remove('window-opening'), { once: true });
  win.state = 'normal';
  focusWindow(win);
  updateClones(win);
  notifyStateChange();
}

// ── Window creation ──────────────────────────────────────

export function createWindow(descriptor) {
  // Accept either new descriptor format or legacy positional args
  let title, widthPx, heightPx, contentHTML, parentWall, appId, initFn, destroyFn;

  if (typeof descriptor === 'object' && descriptor.id) {
    // New app descriptor format
    appId = descriptor.id;
    title = descriptor.title;
    widthPx = descriptor.width;
    heightPx = descriptor.height;
    contentHTML = typeof descriptor.content === 'function' ? descriptor.content() : descriptor.content;
    parentWall = typeof descriptor.wall === 'string' ? resolveWall(descriptor.wall) : descriptor.wall;
    initFn = descriptor.init;
    destroyFn = descriptor.destroy;
  } else {
    // Legacy: createWindow(title, width, height, html, wallEl)
    title = arguments[0];
    widthPx = arguments[1];
    heightPx = arguments[2];
    contentHTML = arguments[3];
    parentWall = arguments[4];
  }

  // On mobile, clamp window size to fit within wall bounds
  if (IS_MOBILE && parentWall) {
    widthPx = Math.min(widthPx, parentWall.offsetWidth - 20);
    heightPx = Math.min(heightPx, parentWall.offsetHeight - 120);
  }

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

  const minimizeBtn = document.createElement('button');
  minimizeBtn.className = 'window-btn window-btn-minimize';
  minimizeBtn.innerHTML = '&#x2500;';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'window-btn window-btn-close';
  closeBtn.innerHTML = '&#x2715;';

  controls.appendChild(minimizeBtn);
  controls.appendChild(closeBtn);
  titlebar.appendChild(titleEl);
  titlebar.appendChild(controls);

  const content = document.createElement('div');
  content.className = 'window-content';
  content.innerHTML = contentHTML;

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'window-resize-handle';

  el.appendChild(titlebar);
  el.appendChild(content);
  el.appendChild(resizeHandle);
  parentWall.appendChild(el);

  // Open animation
  el.classList.add('window-opening');
  el.addEventListener('animationend', () => el.classList.remove('window-opening'), { once: true });

  const win = {
    id: appId || null,
    element: el,
    titlebar,
    content,
    parentWall,
    state: 'normal',
    _clones: new Map(),
    _saved: null,
    _destroy: destroyFn || null,
  };
  windows.push(win);

  // ── Close = hide ──
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideWindow(win);
  });

  // ── Minimize ──
  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    minimizeWindow(win);
  });

  // ── Focus on click anywhere ──
  el.addEventListener('pointerdown', () => {
    focusWindow(win);
  });

  // ── Fullscreen on double-click titlebar ──
  titlebar.addEventListener('dblclick', (e) => {
    if (e.target.closest('.window-btn')) return;
    e.stopPropagation();
    e.preventDefault();
    fullscreenWindow(win);
  });

  // ── Drag ──
  if (IS_MOBILE) titlebar.style.touchAction = 'none';
  titlebar.addEventListener('pointerdown', (e) => {
    if (win.state === 'minimized' || win.state === 'hidden') return;
    if (e.target.closest('.window-btn')) return;

    // If fullscreen, just animate the exit — don't start drag
    if (win.state === 'fullscreen') {
      e.stopPropagation();
      e.preventDefault();
      _exitFullscreen(win);
      return;
    }

    e.stopPropagation();
    e.preventDefault();
    draggedWin = win;
    el.classList.add('window-dragging');

    invalidateCache();

    const fwd = getFwd(win.parentWall);
    const local = screenToLocal(fwd, e.clientX, e.clientY);
    if (local) {
      dragGrabX = local.x - (parseFloat(el.style.left) || 0);
      dragGrabY = local.y - (parseFloat(el.style.top)  || 0);
    } else {
      dragGrabX = el.offsetWidth / 2;
      dragGrabY = titlebar.offsetHeight / 2;
    }

    lastScreenX = e.clientX;
    lastScreenY = e.clientY;

    content.style.pointerEvents = 'none';
    // Skip pointer capture on mobile — causes stuck drags inside 3D transforms
    if (!IS_MOBILE) titlebar.setPointerCapture(e.pointerId);

    focusWindow(win);
  });

  // ── Resize (disabled on mobile) ──
  resizeHandle.addEventListener('pointerdown', (e) => {
    if (IS_MOBILE) return;
    if (win.state !== 'normal') return;
    e.stopPropagation();
    e.preventDefault();

    resizingWin = win;
    resizeStartW = el.offsetWidth;
    resizeStartH = el.offsetHeight;
    resizeStartSX = e.clientX;
    resizeStartSY = e.clientY;

    invalidateCache();
    const fwd = getFwd(win.parentWall);
    resizeStartLocal = screenToLocal(fwd, e.clientX, e.clientY);

    content.style.pointerEvents = 'none';
    resizeHandle.setPointerCapture(e.pointerId);
    focusWindow(win);
  });

  // Run app init
  if (initFn) initFn(win);

  return win;
}

export function centerWindow(win, offsetX = 0, offsetY = 0) {
  const el = win.element;
  const wall = win.parentWall;
  const pw = wall.offsetWidth;
  const ph = wall.offsetHeight;
  const margin = 10;

  // Cap window size to fit within wall
  let ew = el.offsetWidth;
  let eh = el.offsetHeight;
  if (ew > pw - margin * 2) {
    el.style.width = (pw - margin * 2) + 'px';
    ew = pw - margin * 2;
  }
  if (eh > ph - margin * 2) {
    el.style.height = (ph - margin * 2) + 'px';
    eh = ph - margin * 2;
  }

  // Center with offset, then clamp to wall bounds
  let left = (pw - ew) / 2 + offsetX;
  let top  = (ph - eh) / 2 + offsetY;
  left = Math.max(margin, Math.min(pw - ew - margin, left));
  top  = Math.max(margin, Math.min(ph - eh - margin, top));
  el.style.left = left + 'px';
  el.style.top  = top + 'px';
}

// ── Drag move ────────────────────────────────────────────

document.addEventListener('pointermove', (e) => {
  // ── Resize move ──
  if (resizingWin) {
    const el = resizingWin.element;
    const wall = resizingWin.parentWall;
    const fwd = getFwd(wall);
    const local = screenToLocal(fwd, e.clientX, e.clientY);

    if (local && resizeStartLocal) {
      const dxLocal = local.x - resizeStartLocal.x;
      const dyLocal = local.y - resizeStartLocal.y;
      const newW = Math.max(200, resizeStartW + dxLocal);
      const newH = Math.max(120, resizeStartH + dyLocal);
      el.style.width  = newW + 'px';
      el.style.height = newH + 'px';
    } else {
      // Fallback: screen-space
      const dx = e.clientX - resizeStartSX;
      const dy = e.clientY - resizeStartSY;
      el.style.width  = Math.max(200, resizeStartW + dx) + 'px';
      el.style.height = Math.max(120, resizeStartH + dy) + 'px';
    }
    updateClones(resizingWin);
    return;
  }

  if (!draggedWin) return;

  const el = draggedWin.element;
  let wall = draggedWin.parentWall;

  const hitWall = wallUnderPoint(e.clientX, e.clientY, el);

  if (hitWall && hitWall !== wall) {
    const fromName = wallName(wall);
    const edgeInfo = findEdgeToWall(fromName, hitWall);
    if (edgeInfo) {
      const oldLeft = parseFloat(el.style.left) || 0;
      const oldTop  = parseFloat(el.style.top)  || 0;
      const newPos = edgeInfo.pos(oldLeft, oldTop);

      clearClones(draggedWin);
      hitWall.appendChild(el);
      el.style.left = newPos.left + 'px';
      el.style.top  = newPos.top + 'px';
      draggedWin.parentWall = hitWall;
      wall = hitWall;

      const fwd = getFwd(wall);
      const local = screenToLocal(fwd, e.clientX, e.clientY);
      if (local) {
        dragGrabX = local.x - newPos.left;
        dragGrabY = local.y - newPos.top;
      }
    }
  }

  const fwd = getFwd(wall);
  const local = screenToLocal(fwd, e.clientX, e.clientY);

  let newLeft, newTop;
  if (local) {
    newLeft = local.x - dragGrabX;
    newTop  = local.y - dragGrabY;
  } else {
    const dx = e.clientX - lastScreenX;
    const dy = e.clientY - lastScreenY;
    newLeft = (parseFloat(el.style.left) || 0) + dx;
    newTop  = (parseFloat(el.style.top)  || 0) + dy;
  }

  const wn = wallName(wall);
  const ph = wall.offsetHeight, pw = wall.offsetWidth;
  const ew = el.offsetWidth, eh = el.offsetHeight;
  const margin = 10;
  if (wn === 'left' || wn === 'right') {
    newTop = Math.max(margin, Math.min(ph - eh - margin, newTop));
  } else if (wn === 'floor' || wn === 'ceiling') {
    newLeft = Math.max(margin, Math.min(pw - ew - margin, newLeft));
  }
  // On back wall, keep titlebar visible (don't let it go above menu bar or below dock)
  if (wn === 'back') {
    newTop = Math.max(34, newTop);  // below menu bar
    newTop = Math.min(ph - 40, newTop);  // keep titlebar visible at bottom
  }

  el.style.left = newLeft + 'px';
  el.style.top  = newTop + 'px';

  lastScreenX = e.clientX;
  lastScreenY = e.clientY;

  updateClones(draggedWin);
});

// ── Drag end ─────────────────────────────────────────────

document.addEventListener('pointerup', () => {
  if (resizingWin) {
    resizingWin.content.style.pointerEvents = '';
    updateClones(resizingWin);
    resizingWin = null;
    resizeStartLocal = null;
    return;
  }
  if (!draggedWin) return;
  draggedWin.element.classList.remove('window-dragging');
  draggedWin.content.style.pointerEvents = '';
  draggedWin = null;
});

window.addEventListener('resize', invalidateCache);
