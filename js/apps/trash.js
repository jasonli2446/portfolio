import { windows, showWindow } from '../windows.js';

function buildTrashHTML() {
  const hidden = windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
  if (hidden.length === 0) {
    return `<div class="trash-empty">
      <div class="trash-empty-icon">🗑️</div>
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
  icon: '🗑️',
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
