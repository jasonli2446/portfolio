// Generic clone system for elements on walls
// Used by both windows (with interactive clones) and icons (visual only)

import { wallName, resolveWall } from './windows.js';

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

/**
 * Update visual clones for an element that may overflow its wall.
 * @param {HTMLElement} el - The element
 * @param {HTMLElement} wall - The wall it's on
 * @param {Map} cloneMap - Map to track clones (keyed by nbrKey)
 * @param {Object} opts - { interactive: false } for simple visual clones
 */
export function updateElementClones(el, wall, cloneMap, opts = {}) {
  const wn = wallName(wall);
  if (!wn) { clearElementClones(el, cloneMap); return; }

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

    let clone = cloneMap.get(nbrKey);
    if (!clone) {
      clone = el.cloneNode(true);
      clone.classList.add('element-clone');
      clone.style.clipPath = '';
      clone.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));

      // Clone redirects interactions to the real element
      clone.addEventListener('dblclick', (ev) => {
        ev.stopPropagation();
        el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      });
      clone.addEventListener('pointerdown', (ev) => {
        ev.stopPropagation();
        el.dispatchEvent(new PointerEvent('pointerdown', {
          clientX: ev.clientX, clientY: ev.clientY,
          pointerId: ev.pointerId, bubbles: true,
        }));
      });

      nbr.wall.appendChild(clone);
      cloneMap.set(nbrKey, clone);
    }

    const cpos = nbr.pos(wl, wt);
    clone.style.left   = cpos.left + 'px';
    clone.style.top    = cpos.top + 'px';
    clone.style.width  = ww + 'px';
    clone.style.height = wh + 'px';

    // Clip clone to show only overflow strip
    let ct = 0, cr = 0, cb = 0, cl = 0;
    if (edge === 'left')   cr = ww - amount;
    if (edge === 'right')  cl = ww - amount;
    if (edge === 'top')    cb = wh - amount;
    if (edge === 'bottom') ct = wh - amount;

    const nw = nbr.wall.offsetWidth, nh = nbr.wall.offsetHeight;
    if (cpos.left < 0)       cl = Math.max(cl, -cpos.left);
    if (cpos.top < 0)        ct = Math.max(ct, -cpos.top);
    if (cpos.left + ww > nw) cr = Math.max(cr, cpos.left + ww - nw);
    if (cpos.top + wh > nh)  cb = Math.max(cb, cpos.top + wh - nh);

    clone.style.clipPath = `inset(${ct}px ${cr}px ${cb}px ${cl}px)`;
  }

  // Remove clones no longer needed
  for (const [key, clone] of cloneMap) {
    if (!needed.has(key)) {
      clone.remove();
      cloneMap.delete(key);
    }
  }
}

export function clearElementClones(el, cloneMap) {
  for (const [, clone] of cloneMap) clone.remove();
  cloneMap.clear();
  el.style.clipPath = '';
}
