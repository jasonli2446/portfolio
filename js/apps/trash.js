import { windows, showWindow } from '../windows.js';
import { showTesseract } from '../tesseract.js';

const trashedItems = [
  { id: '???', label: '???', svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', action: () => showTesseract() },
];

export const trashedDesktopIcons = [];

export function addToTrash(iconData) {
  if (!trashedDesktopIcons.find(i => i.label === iconData.label)) {
    trashedDesktopIcons.push(iconData);
    if (iconData.el) iconData.el.style.display = 'none';
    // Trigger refresh if trash is open
    if (activeRefresh) activeRefresh();
  }
}

export function removeFromTrash(label) {
  const idx = trashedDesktopIcons.findIndex(i => i.label === label);
  if (idx !== -1) {
    const item = trashedDesktopIcons.splice(idx, 1)[0];
    if (item.el) item.el.style.display = '';
    if (activeRefresh) activeRefresh();
  }
}

let activeRefresh = null;
let dockClickFn = null;

export function setTrashDockClick(fn) { dockClickFn = fn; }

function getHiddenWindows() {
  return windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
}

function buildTrashContent() {
  const hidden = getHiddenWindows();
  let html = '<div class="trash-icon-grid">';

  for (const item of trashedItems) {
    html += `<div class="trash-icon-item" data-type="special" data-id="${item.id}">
      <div class="trash-icon-img">${item.svg}</div>
      <div class="trash-icon-label">${item.label}</div>
    </div>`;
  }

  for (let i = 0; i < hidden.length; i++) {
    const title = hidden[i].titlebar.querySelector('.window-title').textContent;
    html += `<div class="trash-icon-item" data-type="window" data-idx="${i}">
      <div class="trash-icon-img"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div>
      <div class="trash-icon-label">${title}</div>
    </div>`;
  }

  for (const item of trashedDesktopIcons) {
    html += `<div class="trash-icon-item" data-type="desktop" data-label="${item.label}">
      <div class="trash-icon-img">${item.svg || '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>'}</div>
      <div class="trash-icon-label">${item.label}</div>
    </div>`;
  }

  html += '</div>';

  const total = trashedItems.length + hidden.length + trashedDesktopIcons.length;
  if (total === 0) {
    return `<div class="trash-empty">
      <div class="trash-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div>
      <div class="trash-empty-text">Trash is empty</div>
    </div>`;
  }
  return html;
}

export default {
  id: 'trash',
  title: 'Trash',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
  width: 340,
  height: 320,
  wall: 'back',
  openOnStart: false,
  content: () => `<div class="trash-container"></div>`,
  init: (win) => {
    const container = win.element.querySelector('.trash-container');

    function refresh() {
      container.innerHTML = buildTrashContent();
    }
    activeRefresh = refresh;

    // Double-click to open/restore
    container.addEventListener('dblclick', (e) => {
      const item = e.target.closest('.trash-icon-item');
      if (!item) return;
      e.stopPropagation();

      const type = item.dataset.type;
      if (type === 'window') {
        const hidden = getHiddenWindows();
        const idx = parseInt(item.dataset.idx);
        if (hidden[idx]) { showWindow(hidden[idx]); refresh(); }
      } else if (type === 'special') {
        const special = trashedItems.find(s => s.id === item.dataset.id);
        if (special && special.action) special.action();
      } else if (type === 'desktop') {
        const label = item.dataset.label;
        // Restore and open
        removeFromTrash(label);
        if (dockClickFn) {
          const trashed = trashedDesktopIcons.find(i => i.label === label);
          const iconEntry = trashed?.iconEntry;
          if (iconEntry?.icon?.id && dockClickFn) dockClickFn(iconEntry.icon.id);
        }
        refresh();
      }
    });

    // Drag items out of trash — click and drag to restore
    let dragItem = null;
    let dragGhost = null;

    container.addEventListener('pointerdown', (e) => {
      const item = e.target.closest('.trash-icon-item');
      if (!item) return;
      if (item.dataset.type !== 'desktop' && item.dataset.type !== 'window') return;

      dragItem = item;
      // Create ghost element that follows cursor
      dragGhost = item.cloneNode(true);
      dragGhost.style.cssText = 'position:fixed; z-index:9999; pointer-events:none; opacity:0.7;';
      dragGhost.style.left = e.clientX - 40 + 'px';
      dragGhost.style.top = e.clientY - 38 + 'px';
      document.body.appendChild(dragGhost);
    });

    document.addEventListener('pointermove', (e) => {
      if (!dragGhost) return;
      dragGhost.style.left = e.clientX - 40 + 'px';
      dragGhost.style.top = e.clientY - 38 + 'px';
    });

    document.addEventListener('pointerup', (e) => {
      if (!dragGhost || !dragItem) return;
      dragGhost.remove();
      dragGhost = null;

      // Check if dropped outside the trash window
      const winRect = win.element.getBoundingClientRect();
      if (e.clientX < winRect.left || e.clientX > winRect.right ||
          e.clientY < winRect.top || e.clientY > winRect.bottom) {
        const type = dragItem.dataset.type;
        if (type === 'desktop') {
          removeFromTrash(dragItem.dataset.label);
        } else if (type === 'window') {
          const hidden = getHiddenWindows();
          const idx = parseInt(dragItem.dataset.idx);
          if (hidden[idx]) showWindow(hidden[idx]);
        }
        refresh();
      }
      dragItem = null;
    });

    refresh();

    // Refresh on focus
    win.element.addEventListener('pointerdown', () => {
      requestAnimationFrame(refresh);
    });
  },
};
