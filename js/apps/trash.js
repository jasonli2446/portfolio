import { windows, showWindow } from '../windows.js';

function buildTrashHTML() {
  const hidden = windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
  if (hidden.length === 0) {
    return `<div class="trash-empty">
      <div class="trash-empty-icon"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></div>
      <div class="trash-empty-text">Trash is empty</div>
      <div class="trash-empty-sub">Close some windows and they'll appear here</div>
    </div>`;
  }
  // Use array index as identifier since w.id can be null
  const items = hidden.map((w, i) => {
    const title = w.titlebar.querySelector('.window-title').textContent;
    return `<div class="trash-item" data-trash-idx="${i}">
       <span class="trash-item-name">${title}</span>
       <button class="trash-item-restore">Restore</button>
     </div>`;
  }).join('');
  return `<div class="trash-list">${items}</div>`;
}

function getHiddenWindows() {
  return windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
}

export default {
  id: 'trash',
  title: 'Trash',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
  width: 320,
  height: 280,
  wall: 'back',
  openOnStart: false,
  content: () => `<div class="trash-container"></div>`,
  init: (win) => {
    const container = win.element.querySelector('.trash-container');

    function refresh() {
      container.innerHTML = buildTrashHTML();
      // Wire restore buttons
      container.querySelectorAll('.trash-item-restore').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.parentElement.dataset.trashIdx);
          const hidden = getHiddenWindows();
          if (hidden[idx]) {
            showWindow(hidden[idx]);
            refresh();
          }
        });
      });
    }

    // Refresh immediately on open
    refresh();

    // Refresh whenever the trash window gets focus
    win.element.addEventListener('pointerdown', refresh);
  },
};
