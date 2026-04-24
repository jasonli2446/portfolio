import {
  windows, createWindow, centerWindow,
  focusWindow, minimizeWindow, restoreWindow, showWindow,
} from './windows.js';

const dockEl = document.getElementById('dock');
const dockItems = new Map(); // appId → { iconEl, app, win }

export function registerApp(app) {
  const item = document.createElement('button');
  item.className = 'dock-item';
  item.title = app.title;
  item.innerHTML = `<span class="dock-icon">${app.icon}</span>`;

  const entry = { iconEl: item, app, win: null };
  dockItems.set(app.id, entry);

  item.addEventListener('click', () => handleDockClick(app.id));
  dockEl.appendChild(item);
}

export function setAppWindow(appId, win) {
  const entry = dockItems.get(appId);
  if (entry) entry.win = win;
  updateIndicators();
}

function handleDockClick(appId) {
  const entry = dockItems.get(appId);
  if (!entry) return;

  let win = entry.win;

  if (!win || !windows.includes(win)) {
    // App not open — launch it
    win = createWindow(entry.app);
    centerWindow(win);
    entry.win = win;
    focusWindow(win);
  } else if (win.state === 'hidden') {
    showWindow(win);
  } else if (win.state === 'minimized') {
    restoreWindow(win);
  } else {
    // Open and visible — toggle minimize
    minimizeWindow(win);
  }

  updateIndicators();
}

export function updateIndicators() {
  for (const [, entry] of dockItems) {
    const { iconEl, win } = entry;
    if (win && win.state !== 'hidden' && windows.includes(win)) {
      iconEl.classList.add('dock-item-active');
    } else {
      iconEl.classList.remove('dock-item-active');
    }
  }
}
