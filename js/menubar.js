// macOS-style menu bar on the back wall

let focusedAppName = 'Finder';

export function initMenubar() {
  const bar = document.getElementById('menubar');
  if (!bar) return;

  bar.innerHTML = `
    <div class="menubar-left">
      <span class="menubar-logo">🍎</span>
      <span class="menubar-app" id="menubar-app">Finder</span>
      <span class="menubar-item">File</span>
      <span class="menubar-item">Edit</span>
      <span class="menubar-item">View</span>
      <span class="menubar-item">Help</span>
    </div>
    <div class="menubar-right">
      <span class="menubar-item" id="menubar-time"></span>
    </div>
  `;

  updateTime();
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
  focusedAppName = name;
  const el = document.getElementById('menubar-app');
  if (el) el.textContent = name;
}
