import { DEPTH, BASE_PERSPECTIVE } from './config.js';
import { createWindow, centerWindow, onWindowStateChange } from './windows.js';
import { apps } from './apps/index.js';
import { registerApp, setAppWindow, updateIndicators, handleDockClick } from './dock.js';
import { initDesktop, setDockClickHandler } from './desktop.js';
import { initMenubar, setTrackingModule, setCameraState, onTrackingLoaded } from './menubar.js';
import { initContextMenu } from './contextmenu.js';
import { initParticles } from './particles.js';
import { initBoot } from './boot.js';

// Set CSS custom property for wall depth
const room = document.getElementById('room');
room.style.setProperty('--depth', DEPTH + 'px');
room.style.perspective = BASE_PERSPECTIVE + 'px';

// Hide room during intro
room.style.opacity = '0';

// Shared tracking module reference — used by both boot flow and menu bar toggle
let trackingMod = null;

// Boot → intro screen → camera choice → reveal desktop
initBoot(async (enableCamera) => {
  // Fade in the room
  room.style.transition = 'opacity 0.5s ease';
  room.style.opacity = '1';

  // Load tracking if user chose to enable camera
  if (enableCamera) {
    try {
      trackingMod = await import('./tracking.js');
      await trackingMod.initTracking();
      if (trackingMod.isTracking()) {
        setTrackingModule(trackingMod);
        setCameraState(true);
      }
    } catch (e) {
      console.error('Tracking failed:', e);
    }
  }
});

// Sync dock indicators on window state change
onWindowStateChange(updateIndicators);

// Register all apps in dock, open those marked openOnStart
for (const app of apps) {
  registerApp(app);

  if (app.openOnStart) {
    const win = createWindow(app);
    centerWindow(win, app.offsetX || 0, app.offsetY || 0);
    setAppWindow(app.id, win);
  }
}
updateIndicators();

// Desktop icons + menu bar + context menu + particles
setDockClickHandler(handleDockClick);
initDesktop();
initMenubar();
onTrackingLoaded((mod) => { trackingMod = mod; });
initContextMenu();
initParticles();

// Render loop — calls tracking module directly if loaded
function animate() {
  requestAnimationFrame(animate);
  if (trackingMod) {
    trackingMod.detectFace();
    trackingMod.updatePerspective();
  }
}
animate();
