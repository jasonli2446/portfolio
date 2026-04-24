// macOS-style menu bar on the back wall with functional dropdowns

let trackingModule = null;
let cameraOn = false;
let _onTrackingLoaded = null;
let activeDropdown = null;

export function onTrackingLoaded(fn) { _onTrackingLoaded = fn; }

const menus = {
  'File': [
    { label: 'New Note', action: () => launchApp('notes') },
    { separator: true },
    { label: 'Close Window', shortcut: '⌘W', action: () => closeActiveWindow() },
  ],
  'Edit': [
    { label: 'Undo', shortcut: '⌘Z', disabled: true },
    { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
    { separator: true },
    { label: 'Cut', shortcut: '⌘X', disabled: true },
    { label: 'Copy', shortcut: '⌘C', disabled: true },
    { label: 'Paste', shortcut: '⌘V', disabled: true },
  ],
  'View': [
    { label: 'Toggle Fullscreen', action: () => fullscreenActiveWindow() },
    { label: 'Reset Perspective', action: () => resetPerspective() },
    { separator: true },
    { label: 'Show All Windows', action: () => showAllWindows() },
  ],
  'Help': [
    { label: 'About This OS', action: () => showAboutOS() },
    { label: 'Keyboard Shortcuts', action: () => showShortcuts() },
    { separator: true },
    { label: 'View Source ↗', action: () => window.open('https://github.com/jasonli2446/3d-os', '_blank') },
  ],
};

// These get wired up from main.js
let _launchApp = null;
let _closeActive = null;
let _fullscreenActive = null;
let _showAll = null;

export function setMenuActions({ launchApp, closeActive, fullscreenActive, showAll }) {
  _launchApp = launchApp;
  _closeActive = closeActive;
  _fullscreenActive = fullscreenActive;
  _showAll = showAll;
}

function launchApp(id) { if (_launchApp) _launchApp(id); }
function closeActiveWindow() { if (_closeActive) _closeActive(); }
function fullscreenActiveWindow() { if (_fullscreenActive) _fullscreenActive(); }
function showAllWindows() { if (_showAll) _showAll(); }

function resetPerspective() {
  const room = document.getElementById('room');
  room.style.perspectiveOrigin = '50% 50%';
}

function showAboutOS() {
  const overlay = document.createElement('div');
  overlay.className = 'about-os-overlay';
  overlay.innerHTML = `
    <div class="about-os-box">
      <div class="about-os-icon">🖥️</div>
      <div class="about-os-title">3D OS</div>
      <div class="about-os-version">Version 1.0</div>
      <div class="about-os-desc">A spatial portfolio by Jason Li</div>
      <div class="about-os-tech">Pure CSS 3D • MediaPipe • Vanilla JS</div>
      <button class="about-os-close">OK</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.about-os-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function showShortcuts() {
  const overlay = document.createElement('div');
  overlay.className = 'about-os-overlay';
  overlay.innerHTML = `
    <div class="about-os-box" style="text-align:left; max-width:340px;">
      <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:12px;">Keyboard Shortcuts</div>
      <div class="shortcut-row"><span>Drag titlebar</span><span class="shortcut-key">Move window</span></div>
      <div class="shortcut-row"><span>Double-click titlebar</span><span class="shortcut-key">Fullscreen</span></div>
      <div class="shortcut-row"><span>─ button</span><span class="shortcut-key">Minimize</span></div>
      <div class="shortcut-row"><span>✕ button</span><span class="shortcut-key">Close (hide)</span></div>
      <div class="shortcut-row"><span>Bottom-right corner</span><span class="shortcut-key">Resize</span></div>
      <div class="shortcut-row"><span>Double-click icon</span><span class="shortcut-key">Open app</span></div>
      <div class="shortcut-row"><span>Right-click desktop</span><span class="shortcut-key">Context menu</span></div>
      <div class="shortcut-row"><span>Hover bottom edge</span><span class="shortcut-key">Show dock</span></div>
      <button class="about-os-close" style="margin-top:16px; width:100%;">Got it</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.about-os-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

export function initMenubar() {
  const bar = document.getElementById('menubar');
  if (!bar) return;

  const menuItems = Object.keys(menus).map(name =>
    `<span class="menubar-item menubar-menu" data-menu="${name}">${name}</span>`
  ).join('');

  bar.innerHTML = `
    <div class="menubar-left">
      <span class="menubar-logo">🍎</span>
      <span class="menubar-app" id="menubar-app">Finder</span>
      ${menuItems}
    </div>
    <div class="menubar-right">
      <button class="menubar-toggle" id="menubar-camera" title="Toggle head tracking">
        <span id="camera-icon">📷</span>
      </button>
      <span class="menubar-item" id="menubar-time"></span>
    </div>
  `;

  // Wire up menu dropdowns
  bar.querySelectorAll('.menubar-menu').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = item.dataset.menu;
      if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
      else showDropdown(item, name);
    });
  });

  // Close dropdown on click anywhere
  document.addEventListener('click', () => {
    if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
  });

  document.getElementById('menubar-camera').addEventListener('click', toggleCamera);
  updateCameraIcon();
  updateTime();
}

function showDropdown(anchor, menuName) {
  const items = menus[menuName];
  if (!items) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'menubar-dropdown';

  for (const item of items) {
    if (item.separator) {
      dropdown.innerHTML += '<div class="ctx-separator"></div>';
      continue;
    }
    const disabled = item.disabled ? ' ctx-disabled' : '';
    const shortcut = item.shortcut ? `<span class="menu-shortcut">${item.shortcut}</span>` : '';
    const el = document.createElement('div');
    el.className = `ctx-item${disabled}`;
    el.innerHTML = `<span>${item.label}</span>${shortcut}`;
    if (item.action && !item.disabled) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        item.action();
        dropdown.remove();
        activeDropdown = null;
      });
    }
    dropdown.appendChild(el);
  }

  // Position below the menu item
  const rect = anchor.getBoundingClientRect();
  dropdown.style.left = rect.left + 'px';
  dropdown.style.top = rect.bottom + 'px';
  document.body.appendChild(dropdown);
  activeDropdown = dropdown;
}

function updateTime() {
  const el = document.getElementById('menubar-time');
  if (!el) return;
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  el.textContent = `${day}  ${time}`;
  requestAnimationFrame(updateTime);
}

export function setFocusedApp(name) {
  const el = document.getElementById('menubar-app');
  if (el) el.textContent = name;
}

export function setTrackingModule(mod) { trackingModule = mod; }

export function setCameraState(on) {
  cameraOn = on;
  updateCameraIcon();
}

function updateCameraIcon() {
  const icon = document.getElementById('camera-icon');
  const btn = document.getElementById('menubar-camera');
  if (!icon || !btn) return;
  icon.textContent = cameraOn ? '📷 ON' : '📷 OFF';
  btn.classList.toggle('menubar-toggle-off', !cameraOn);
}

async function toggleCamera() {
  if (!trackingModule) {
    trackingModule = await import('./tracking.js');
    await trackingModule.initTracking();
    if (trackingModule.isTracking()) {
      cameraOn = true;
      if (_onTrackingLoaded) _onTrackingLoaded(trackingModule);
    }
  } else if (cameraOn) {
    trackingModule.stopTracking();
    cameraOn = false;
  } else {
    await trackingModule.initTracking();
    if (trackingModule.isTracking()) {
      cameraOn = true;
    }
  }
  updateCameraIcon();
}
