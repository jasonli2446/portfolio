import { showTesseract } from './tesseract.js';
import { screenToLocal, getFwd, invalidateCache, wallName, findEdgeToWall } from './windows.js';
import { updateElementClones, clearElementClones } from './clones.js';
import { IS_MOBILE } from './config.js';

// Desktop icons on the back wall — draggable, selectable

const icons = [
  // README first (top-left)
  { id: 'notes',       svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>', label: 'README', type: 'app' },
  { id: 'trash', svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>', label: 'Trash', type: 'app' },

  { id: 'about',      svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', label: 'About Me',    type: 'app' },
  { id: 'projects',   svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>', label: 'Projects',    type: 'app' },
  { id: 'experience', svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>', label: 'Experience',  type: 'app' },
  { id: 'education',  svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"></path></svg>', label: 'Transcript', type: 'app' },
  { id: 'skills',     svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>', label: 'Settings',    type: 'app' },

  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`, label: 'GitHub', type: 'link', href: 'https://github.com/jasonli2446' },
  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`, label: 'LinkedIn', type: 'link', href: 'https://linkedin.com/in/jasonli2446' },
  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`, label: 'Email', type: 'link', href: 'mailto:jasonli2446@gmail.com' },
  { svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>', label: 'Resume', type: 'link', href: 'public/resume.pdf' },

  // Utility apps
  { id: 'clock',       svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', label: 'Clock', type: 'app' },
  { id: 'nowplaying',  svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>', label: 'Music', type: 'app' },
  { id: 'calculator',  svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line></svg>', label: 'Calculator', type: 'app' },
  { id: 'sysmonitor',  svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><polyline points="6 10 9 7 12 10 15 7 18 10"></polyline></svg>', label: 'Monitor', type: 'app' },
  { id: 'stickies',    svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path><polyline points="16 3 16 8 21 8"></polyline></svg>', label: 'Stickies', type: 'app' },

  { svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-4 4 8 2-4h4"></path><circle cx="20" cy="12" r="2"></circle></svg>', label: 'Snake', type: 'snake' },

  // Fun
  { svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', label: '???', type: 'secret' },
];

const ICON_W = 80;
const ICON_H = 76;
const COLS = 3;
const START_X = 24;
const START_Y = 52;
const GAP = 8;

let dockClickHandler = null;
let iconElements = [];
let selectedIcons = new Set();
let draggingIcons = false;
let dragPrimaryEl = null; // the icon that was clicked to start the drag
let lastDragScreenX = 0, lastDragScreenY = 0;
let iconGrabOffsets = new Map(); // el → { grabX, grabY }
let selectionBox = null;
let selStartX = 0, selStartY = 0;
// Mobile tap detection
let tapStartX = 0, tapStartY = 0;
let tapIcon = null;

export function setDockClickHandler(fn) {
  dockClickHandler = fn;
}

// Icons to hide on mobile (already open on side walls or not useful)
const MOBILE_HIDDEN = new Set(['trash', 'clock', 'nowplaying', 'calculator', 'sysmonitor', 'stickies']);

export function initDesktop() {
  const container = document.getElementById('desktop-icons');
  if (!container) return;

  // On mobile, move icons to the floor wall
  if (IS_MOBILE) {
    const floor = document.querySelector('.wall-floor');
    if (floor) floor.appendChild(container);
  }

  // Filter icons on mobile — 12 essentials for a 4×3 grid
  const visibleIcons = IS_MOBILE ? icons.filter(ic => !MOBILE_HIDDEN.has(ic.id)) : icons;

  // Grid layout — 3 cols on mobile floor (4 rows × 3 cols), 3 cols on desktop
  const cols = IS_MOBILE ? 3 : COLS;
  const iconW = IS_MOBILE ? 72 : ICON_W;
  const iconH = IS_MOBILE ? 70 : ICON_H;
  const gap = IS_MOBILE ? 10 : GAP;
  // Center the grid on mobile floor
  const gridW = cols * iconW + (cols - 1) * gap;
  const floorW = IS_MOBILE ? (document.querySelector('.wall-floor')?.offsetWidth || 390) : 0;
  const rows = IS_MOBILE ? Math.ceil(visibleIcons.length / cols) : 0;
  const gridH = rows * iconH + (rows - 1) * gap;
  const floorH = IS_MOBILE ? (document.querySelector('.wall-floor')?.offsetHeight || 400) : 0;
  const startX = IS_MOBILE ? Math.floor((floorW - gridW) / 2) : START_X;
  const startY = IS_MOBILE ? Math.floor((floorH - gridH) / 2) : START_Y;

  // Position icons in a grid
  visibleIcons.forEach((icon, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (iconW + gap);
    const y = startY + row * (iconH + gap);

    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.innerHTML = `
      <div class="desktop-icon-img">${icon.svg}</div>
      <div class="desktop-icon-label">${icon.label}</div>
    `;

    // Desktop: double-click to open
    if (!IS_MOBILE) {
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        handleIconClick(icon);
      });
    }

    // Single click to select + start drag
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();

      if (!e.shiftKey && !selectedIcons.has(el)) {
        clearSelection();
      }
      selectIcon(el);

      // Mobile: just track tap position, no drag
      if (IS_MOBILE) {
        tapStartX = e.clientX;
        tapStartY = e.clientY;
        tapIcon = icon;
        return;
      }

      // Start drag — track primary icon and compute grab offset for it only
      draggingIcons = true;
      dragPrimaryEl = el;
      lastDragScreenX = e.clientX;
      lastDragScreenY = e.clientY;
      invalidateCache();

      const wall = el.parentElement.closest('.wall') || el.parentElement;
      const fwd = getFwd(wall);
      const local = screenToLocal(fwd, e.clientX, e.clientY);
      if (local) {
        iconGrabOffsets.set(el, {
          grabX: local.x - (parseFloat(el.style.left) || 0),
          grabY: local.y - (parseFloat(el.style.top) || 0),
        });
      } else {
        // Fallback for side walls where unprojection may fail
        iconGrabOffsets.set(el, { grabX: 40, grabY: 38 });
      }
    });

    container.appendChild(el);
    iconElements.push({ el, icon, _clones: new Map() });
  });

  // Selection rectangle on ANY wall (pointerdown on empty space) — desktop only
  document.querySelectorAll('.wall').forEach(wall => {
    wall.addEventListener('pointerdown', (e) => {
      if (IS_MOBILE) return;
      if (e.target.closest('.desktop-icon') || e.target.closest('.window') ||
          e.target.closest('#dock') || e.target.closest('#menubar')) return;

      clearSelection();

      // Start selection rectangle
      selStartX = e.clientX;
      selStartY = e.clientY;

      selectionBox = document.createElement('div');
      selectionBox.className = 'selection-rect';
      selectionBox.style.left = e.clientX + 'px';
    selectionBox.style.top = e.clientY + 'px';
    document.body.appendChild(selectionBox);
    });
  });

  // Pointermove: drag icons or draw selection
  document.addEventListener('pointermove', (e) => {
    if (draggingIcons && selectedIcons.size > 0 && dragPrimaryEl) {
      const screenDX = e.clientX - lastDragScreenX;
      const screenDY = e.clientY - lastDragScreenY;
      lastDragScreenX = e.clientX;
      lastDragScreenY = e.clientY;

      // 1. Compute wall-local delta from primary icon
      const primaryWall = dragPrimaryEl.parentElement.closest('.wall') || dragPrimaryEl.parentElement;
      const fwdP = getFwd(primaryWall);
      const localP = screenToLocal(fwdP, e.clientX, e.clientY);
      const grabP = iconGrabOffsets.get(dragPrimaryEl);

      let deltaLeft, deltaTop;
      if (localP && grabP) {
        const newPrimaryLeft = localP.x - grabP.grabX;
        const newPrimaryTop  = localP.y - grabP.grabY;
        deltaLeft = newPrimaryLeft - (parseFloat(dragPrimaryEl.style.left) || 0);
        deltaTop  = newPrimaryTop  - (parseFloat(dragPrimaryEl.style.top)  || 0);
      } else {
        // Fallback: screen-space delta (when unprojection fails on side walls)
        deltaLeft = screenDX;
        deltaTop  = screenDY;
      }

      // 2. Apply same wall-local delta to ALL selected icons
      for (const entry of iconElements) {
        if (!selectedIcons.has(entry.el)) continue;
        const el = entry.el;
        const curLeft = parseFloat(el.style.left) || 0;
        const curTop  = parseFloat(el.style.top)  || 0;
        el.style.left = (curLeft + deltaLeft) + 'px';
        el.style.top  = (curTop + deltaTop) + 'px';

        // 3. Check if this icon's center has crossed its wall boundary
        const wall = el.parentElement.closest('.wall') || el.parentElement;
        const left = parseFloat(el.style.left) || 0;
        const top  = parseFloat(el.style.top)  || 0;
        const pw = wall.offsetWidth;
        const ph = wall.offsetHeight;
        const cx = left + 40; // icon center X (icon is 80px wide)
        const cy = top + 38;  // icon center Y

        let transitionEdge = null;
        if (cx < 0)   transitionEdge = 'left';
        if (cx > pw)  transitionEdge = 'right';
        if (cy < 0)   transitionEdge = 'top';
        if (cy > ph)  transitionEdge = 'bottom';

        if (transitionEdge) {
          // Find which wall the icon's center is now over
          el.style.pointerEvents = 'none';
          const iconRect = el.getBoundingClientRect();
          const iconCX = iconRect.left + iconRect.width / 2;
          const iconCY = iconRect.top + iconRect.height / 2;
          const hits = document.elementsFromPoint(iconCX, iconCY);
          el.style.pointerEvents = '';
          let targetWall = null;
          for (const h of hits) {
            if (h.classList.contains('wall') && h !== wall) { targetWall = h; break; }
          }

          if (targetWall) {
            const edgeInfo = findEdgeToWall(wallName(wall), targetWall);
            if (edgeInfo) {
              const oldLeft = parseFloat(el.style.left) || 0;
              const oldTop  = parseFloat(el.style.top)  || 0;
              const newPos = edgeInfo.pos(oldLeft, oldTop);
              clearElementClones(el, entry._clones);
              targetWall.appendChild(el);
              el.style.left = newPos.left + 'px';
              el.style.top  = newPos.top + 'px';
              invalidateCache();

              // Recompute grab offset if this is the primary
              if (el === dragPrimaryEl) {
                const fwd = getFwd(targetWall);
                const local = screenToLocal(fwd, e.clientX, e.clientY);
                if (local) {
                  iconGrabOffsets.set(el, {
                    grabX: local.x - newPos.left,
                    grabY: local.y - newPos.top,
                  });
                }
              }
            }
          }
        }

        // 4. Update clones for wall-edge overflow
        const curWall = el.parentElement.closest('.wall') || el.parentElement;
        updateElementClones(el, curWall, entry._clones);
      }
      return;
    }

    if (selectionBox) {
      const x = Math.min(selStartX, e.clientX);
      const y = Math.min(selStartY, e.clientY);
      const w = Math.abs(e.clientX - selStartX);
      const h = Math.abs(e.clientY - selStartY);
      selectionBox.style.left = x + 'px';
      selectionBox.style.top = y + 'px';
      selectionBox.style.width = w + 'px';
      selectionBox.style.height = h + 'px';

      // Select icons that intersect the rectangle
      const rect = { x, y, w, h };
      for (const { el } of iconElements) {
        const ir = el.getBoundingClientRect();
        if (rectsOverlap(rect, { x: ir.left, y: ir.top, w: ir.width, h: ir.height })) {
          selectIcon(el);
        } else {
          deselectIcon(el);
        }
      }
    }
  });

  document.addEventListener('pointerup', (e) => {
    // Mobile: detect tap → open icon
    if (IS_MOBILE && tapIcon) {
      handleIconClick(tapIcon);
      tapIcon = null;
    }

    if (draggingIcons) {
      // On drop: clamp icons to wall bounds and clear clones
      for (const entry of iconElements) {
        if (!selectedIcons.has(entry.el)) continue;
        const wall = entry.el.parentElement.closest('.wall') || entry.el.parentElement;
        const pw = wall.offsetWidth, ph = wall.offsetHeight;
        const left = parseFloat(entry.el.style.left) || 0;
        const top = parseFloat(entry.el.style.top) || 0;
        entry.el.style.left = Math.max(4, Math.min(pw - 84, left)) + 'px';
        entry.el.style.top  = Math.max(4, Math.min(ph - 80, top)) + 'px';
        clearElementClones(entry.el, entry._clones);
        entry.el.style.clipPath = '';
      }
    }
    draggingIcons = false;
    dragPrimaryEl = null;
    if (selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
  });
}

function selectIcon(el) {
  selectedIcons.add(el);
  el.classList.add('desktop-icon-selected');
}

function deselectIcon(el) {
  selectedIcons.delete(el);
  el.classList.remove('desktop-icon-selected');
  // Clean up any clones for this icon
  const entry = iconElements.find(e => e.el === el);
  if (entry) { clearElementClones(el, entry._clones); el.style.clipPath = ''; }
}

function clearSelection() {
  for (const el of selectedIcons) {
    el.classList.remove('desktop-icon-selected');
    const entry = iconElements.find(e => e.el === el);
    if (entry) { clearElementClones(el, entry._clones); el.style.clipPath = ''; }
  }
  selectedIcons.clear();
}

function rectsOverlap(a, b) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

function handleIconClick(icon) {
  if (icon.type === 'app' && dockClickHandler) {
    dockClickHandler(icon.id);
  } else if (icon.type === 'link' && icon.href) {
    window.open(icon.href, '_blank');
  } else if (icon.type === 'readme') {
    showReadme();
  } else if (icon.type === 'secret') {
    showTesseract();
  } else if (icon.type === 'snake') {
    import('./snake.js').then(({ startSnake }) => startSnake());
  }
}

function showReadme() {
  if (dockClickHandler) {
    dockClickHandler('notes');
    setTimeout(() => {
      const textarea = document.querySelector('.notes-textarea');
      if (textarea) {
        textarea.value =
`# README.md

Welcome to Jason Li's 3D Portfolio OS!

## Controls
- Drag windows by their title bar
- Double-click title bar to fullscreen
- Resize from the bottom-right corner
- Move your head for parallax (needs webcam)

## Built With
- Pure CSS 3D (perspective + perspective-origin)
- MediaPipe Face Tracking
- Vanilla JS, no frameworks

## Source
github.com/jasonli2446/3d-os`;
      }
    }, 100);
  }
}

// showSecret is now showTesseract from tesseract.js
