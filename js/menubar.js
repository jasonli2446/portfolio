// macOS-style menu bar on the back wall

let trackingModule = null;
let cameraOn = false;

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
      <button class="menubar-toggle" id="menubar-camera" title="Toggle head tracking">
        <span id="camera-icon">📷</span>
      </button>
      <span class="menubar-item" id="menubar-time"></span>
    </div>
  `;

  document.getElementById('menubar-camera').addEventListener('click', toggleCamera);
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
  const el = document.getElementById('menubar-app');
  if (el) el.textContent = name;
}

export function setTrackingModule(mod) {
  trackingModule = mod;
}

export function setCameraState(on) {
  cameraOn = on;
  updateCameraIcon();
}

function updateCameraIcon() {
  const icon = document.getElementById('camera-icon');
  const btn = document.getElementById('menubar-camera');
  if (!icon || !btn) return;
  icon.textContent = cameraOn ? '📷' : '📷';
  btn.classList.toggle('menubar-toggle-off', !cameraOn);
  btn.title = cameraOn ? 'Head tracking ON — click to disable' : 'Head tracking OFF — click to enable';
}

async function toggleCamera() {
  if (!trackingModule) {
    // First time enabling — need to load and init tracking
    trackingModule = await import('./tracking.js');
    await trackingModule.initTracking();
    if (trackingModule.isTracking()) {
      cameraOn = true;
    }
  } else if (cameraOn) {
    trackingModule.setEnabled(false);
    cameraOn = false;
  } else {
    trackingModule.setEnabled(true);
    cameraOn = true;
  }
  updateCameraIcon();
}
