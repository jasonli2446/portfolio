import { DEPTH, MOBILE_DEPTH, BASE_PERSPECTIVE, IS_MOBILE } from './config.js';
import { createWindow, centerWindow, onWindowStateChange, windows as winList, getFocusedWindow, hideWindow, fullscreenWindow, showWindow } from './windows.js';
import { apps } from './apps/index.js';
import { registerApp, setAppWindow, updateIndicators, handleDockClick } from './dock.js';
import { initDesktop, setDockClickHandler } from './desktop.js';
import { initMenubar, setTrackingModule, setCameraState, onTrackingLoaded, setMenuActions } from './menubar.js';
import { initContextMenu } from './contextmenu.js';
import { initParticles } from './particles.js';
import { initBoot } from './boot.js';
// ticker removed
import { initSpotlight } from './spotlight.js';
import { initNotifications } from './notifications.js';

// Set CSS custom property for wall depth
const room = document.getElementById('room');
const activeDepth = IS_MOBILE ? MOBILE_DEPTH : DEPTH;
room.style.setProperty('--depth', activeDepth + 'px');
room.style.perspective = BASE_PERSPECTIVE + 'px';
// On mobile, shift view down so the floor (icons) is more visible
if (IS_MOBILE) room.style.perspectiveOrigin = '50% 35%';

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

// Wire trash dock click handler
import { setTrashDockClick, setCreateDesktopIcon } from './apps/trash.js';
import { createDesktopIcon } from './desktop.js';
setTrashDockClick(handleDockClick);
setCreateDesktopIcon(createDesktopIcon);

// Desktop icons + menu bar + context menu + particles
setDockClickHandler(handleDockClick);
initDesktop();
initMenubar();
onTrackingLoaded((mod) => { trackingMod = mod; });

// Wire menu bar actions
setMenuActions({
  launchApp: handleDockClick,
  closeActive: () => { const w = getFocusedWindow(); if (w) hideWindow(w); },
  fullscreenActive: () => { const w = getFocusedWindow(); if (w) fullscreenWindow(w); },
  showAll: () => { winList.forEach(w => { if (w.state === 'hidden' || w.state === 'minimized') showWindow(w); }); },
});
initContextMenu();
initParticles();
initSpotlight(handleDockClick);
initNotifications();

// Render loop — calls tracking module directly if loaded
function animate() {
  requestAnimationFrame(animate);
  if (trackingMod) {
    trackingMod.detectFace();
    trackingMod.updatePerspective();
  }
}
animate();
