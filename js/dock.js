import {
  windows, createWindow, centerWindow,
  focusWindow, minimizeWindow, restoreWindow, showWindow,
} from './windows.js';

const dockEl = document.getElementById('dock');
const dockItems = new Map(); // appId → { iconEl, app, win, permanent }

// Separator between permanent and temporary dock items
let separator = null;

export function registerApp(app) {
  const permanent = app.showInDock !== false;
  const entry = { iconEl: null, app, win: null, permanent };

  if (permanent) {
    const item = createDockIcon(app);
    dockEl.appendChild(item);
    entry.iconEl = item;
  }

  dockItems.set(app.id, entry);
}

function createDockIcon(app) {
  const item = document.createElement('button');
  item.className = 'dock-item';
  item.innerHTML = `<span class="dock-icon">${app.icon}</span><span class="dock-tooltip">${app.title}</span>`;
  item.addEventListener('click', () => handleDockClick(app.id));
  return item;
}

export function setAppWindow(appId, win) {
  const entry = dockItems.get(appId);
  if (entry) entry.win = win;
  updateIndicators();
}

export function handleDockClick(appId) {
  const entry = dockItems.get(appId);
  if (!entry) return;

  let win = entry.win;

  if (!win || !windows.includes(win)) {
    win = createWindow({ ...entry.app, wall: 'back' });
    centerWindow(win);
    entry.win = win;
    focusWindow(win);
  } else if (win.state === 'hidden') {
    showWindow(win);
  } else if (win.state === 'minimized') {
    restoreWindow(win);
  } else {
    minimizeWindow(win);
  }

  updateIndicators();
}

export function updateIndicators() {
  for (const [, entry] of dockItems) {
    const { win, permanent } = entry;
    const isOpen = win && win.state !== 'hidden' && windows.includes(win);

    if (permanent) {
      // Permanent icons: just toggle active dot
      if (entry.iconEl) {
        entry.iconEl.classList.toggle('dock-item-active', isOpen);
      }
    } else {
      // Temporary icons: add when open, remove when closed
      if (isOpen && !entry.iconEl) {
        // Ensure separator exists
        if (!separator) {
          separator = document.createElement('div');
          separator.className = 'dock-separator';
          dockEl.appendChild(separator);
        }
        const item = createDockIcon(entry.app);
        item.classList.add('dock-item-active', 'dock-item-temp');
        dockEl.appendChild(item);
        entry.iconEl = item;
      } else if (!isOpen && entry.iconEl) {
        entry.iconEl.remove();
        entry.iconEl = null;
      } else if (isOpen && entry.iconEl) {
        entry.iconEl.classList.add('dock-item-active');
      }
    }
  }

  // Remove separator if no temp items
  const hasTemp = [...dockItems.values()].some(e => !e.permanent && e.iconEl);
  if (!hasTemp && separator) {
    separator.remove();
    separator = null;
  }
}
