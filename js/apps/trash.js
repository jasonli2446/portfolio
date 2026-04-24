import { windows, showWindow } from '../windows.js';

function buildTrashContent() {
  const hidden = windows.filter(w => w.state === 'hidden' && w.id !== 'trash');
  if (hidden.length === 0) {
    return `<div class="trash-empty">
      <div class="trash-empty-icon">🗑️</div>
      <div class="trash-empty-text">Trash is empty</div>
      <div class="trash-empty-sub">Close some windows and they'll appear here</div>
    </div>`;
  }
  const items = hidden.map(w =>
    `<div class="trash-item" data-win-id="${w.id}">
       <span class="trash-item-name">${w.titlebar.querySelector('.window-title').textContent}</span>
       <button class="trash-item-restore">Restore</button>
     </div>`
  ).join('');
  return `<div class="trash-list">${items}</div>`;
}

export default {
  id: 'trash',
  title: 'Trash',
  icon: '🗑️',
  width: 320,
  height: 280,
  wall: 'back',
  openOnStart: false,
  content: () => `<div class="trash-container">${buildTrashContent()}</div>`,
  init: (win) => {
    function refresh() {
      const container = win.element.querySelector('.trash-container');
      if (container) container.innerHTML = buildTrashContent();
      wireButtons();
    }

    function wireButtons() {
      const btns = win.element.querySelectorAll('.trash-item-restore');
      btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.parentElement.dataset.winId;
          const target = windows.find(w => w.id === id && w.state === 'hidden');
          if (target) {
            showWindow(target);
            refresh();
          }
        });
      });
    }

    wireButtons();

    // Refresh the list whenever the window becomes visible (focused)
    const observer = new MutationObserver(() => {
      if (win.element.style.display !== 'none') refresh();
    });
    observer.observe(win.element, { attributes: true, attributeFilter: ['style'] });
    win._trashObserver = observer;
  },
  destroy: (win) => {
    if (win._trashObserver) win._trashObserver.disconnect();
  },
};
