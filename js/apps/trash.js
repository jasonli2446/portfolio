import { windows, showWindow } from '../windows.js';
import { showTesseract } from '../tesseract.js';

// Trash contains both hidden windows AND special items
// Special items are things that start in Trash or get dragged in

const specialItems = [
  { id: '???', label: '???', svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', action: () => showTesseract() },
];

// Track which desktop icons have been trashed
export const trashedIcons = new Set();

export function trashIcon(iconLabel) {
  trashedIcons.add(iconLabel);
}

export function untrashIcon(iconLabel) {
  trashedIcons.delete(iconLabel);
}

function buildTrashHTML() {
  const hidden = windows.filter(w => w.state === 'hidden' && w.id !== 'trash');

  const windowItems = hidden.map((w, i) => {
    const title = w.titlebar.querySelector('.window-title').textContent;
    return `<div class="trash-item" data-type="window" data-idx="${i}">
       <span class="trash-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"></rect></svg></span>
       <span class="trash-item-name">${title}</span>
     </div>`;
  });

  const specialHTML = specialItems.map(item =>
    `<div class="trash-item" data-type="special" data-id="${item.id}">
       <span class="trash-item-icon">${item.svg}</span>
       <span class="trash-item-name">${item.label}</span>
     </div>`
  );

  const trashedIconHTML = [...trashedIcons].map(label =>
    `<div class="trash-item" data-type="icon" data-label="${label}">
       <span class="trash-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg></span>
       <span class="trash-item-name">${label}</span>
     </div>`
  );

  const all = [...specialHTML, ...windowItems, ...trashedIconHTML];

  if (all.length === 0) {
    return `<div class="trash-empty">
      <div class="trash-empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></div>
      <div class="trash-empty-text">Trash is empty</div>
    </div>`;
  }

  return `<div class="trash-list">
    <div class="trash-hint">Double-click to restore or open</div>
    ${all.join('')}
  </div>`;
}

function getHiddenWindows() {
  return windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
}

export default {
  id: 'trash',
  title: 'Trash',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
  width: 320,
  height: 300,
  wall: 'back',
  openOnStart: false,
  content: () => `<div class="trash-container"></div>`,
  init: (win) => {
    const container = win.element.querySelector('.trash-container');

    function refresh() {
      container.innerHTML = buildTrashHTML();
    }

    // Event delegation — double-click to restore/open
    container.addEventListener('dblclick', (e) => {
      const item = e.target.closest('.trash-item');
      if (!item) return;
      e.stopPropagation();

      const type = item.dataset.type;

      if (type === 'window') {
        const idx = parseInt(item.dataset.idx);
        const hidden = getHiddenWindows();
        if (hidden[idx]) {
          showWindow(hidden[idx]);
          setTimeout(refresh, 50);
        }
      } else if (type === 'special') {
        const id = item.dataset.id;
        const special = specialItems.find(s => s.id === id);
        if (special && special.action) special.action();
      } else if (type === 'icon') {
        // Restore icon to desktop
        untrashIcon(item.dataset.label);
        setTimeout(refresh, 50);
      }
    });

    refresh();

    // Refresh on focus (debounced)
    let timer = null;
    win.element.addEventListener('pointerdown', () => {
      clearTimeout(timer);
      timer = setTimeout(refresh, 100);
    });
  },
};
