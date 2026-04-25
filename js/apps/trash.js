import { windows, showWindow } from '../windows.js';
import { showTesseract } from '../tesseract.js';

// Items that live in the trash — shown as icons inside the window
const trashedItems = [
  { id: '???', label: '???', svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', action: () => showTesseract() },
];

// Desktop icons that were dragged to trash
export const trashedDesktopIcons = [];

export function addToTrash(iconData) {
  // iconData = { label, svg, el } — el is the DOM element to hide
  if (!trashedDesktopIcons.find(i => i.label === iconData.label)) {
    trashedDesktopIcons.push(iconData);
    if (iconData.el) iconData.el.style.display = 'none';
  }
}

export function removeFromTrash(label) {
  const idx = trashedDesktopIcons.findIndex(i => i.label === label);
  if (idx !== -1) {
    const item = trashedDesktopIcons.splice(idx, 1)[0];
    if (item.el) item.el.style.display = '';
  }
}

function buildTrashContent() {
  const hidden = windows.filter(w => w.state === 'hidden' && w.id !== 'trash');

  let html = '<div class="trash-icon-grid">';

  // Special items (???)
  for (const item of trashedItems) {
    html += `<div class="trash-icon-item" data-type="special" data-id="${item.id}">
      <div class="trash-icon-img">${item.svg}</div>
      <div class="trash-icon-label">${item.label}</div>
    </div>`;
  }

  // Hidden windows
  for (let i = 0; i < hidden.length; i++) {
    const title = hidden[i].titlebar.querySelector('.window-title').textContent;
    html += `<div class="trash-icon-item" data-type="window" data-idx="${i}">
      <div class="trash-icon-img"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></div>
      <div class="trash-icon-label">${title}</div>
    </div>`;
  }

  // Trashed desktop icons
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

function getHiddenWindows() {
  return windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
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

    // Double-click to restore/open
    container.addEventListener('dblclick', (e) => {
      const item = e.target.closest('.trash-icon-item');
      if (!item) return;
      e.stopPropagation();

      const type = item.dataset.type;
      if (type === 'window') {
        const idx = parseInt(item.dataset.idx);
        const hidden = getHiddenWindows();
        if (hidden[idx]) { showWindow(hidden[idx]); setTimeout(refresh, 50); }
      } else if (type === 'special') {
        const id = item.dataset.id;
        const special = trashedItems.find(s => s.id === id);
        if (special && special.action) special.action();
      } else if (type === 'desktop') {
        removeFromTrash(item.dataset.label);
        setTimeout(refresh, 50);
      }
    });

    refresh();

    // Refresh on focus
    let timer = null;
    win.element.addEventListener('pointerdown', () => {
      clearTimeout(timer);
      timer = setTimeout(refresh, 100);
    });
  },
};
