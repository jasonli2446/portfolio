import { DEPTH, BASE_PERSPECTIVE } from './config.js';
import { createWindow, centerWindow, onWindowStateChange } from './windows.js';
import { apps } from './apps/index.js';
import { registerApp, setAppWindow, updateIndicators, handleDockClick } from './dock.js';
import { initDesktop, setDockClickHandler } from './desktop.js';
import { initMenubar, setFocusedApp } from './menubar.js';
import { initContextMenu } from './contextmenu.js';
import { initParticles } from './particles.js';
import { initBoot } from './boot.js';

// Set CSS custom property for wall depth
const room = document.getElementById('room');
room.style.setProperty('--depth', DEPTH + 'px');
room.style.perspective = BASE_PERSPECTIVE + 'px';

// Hide room during boot
room.style.opacity = '0';

// Boot sequence → then reveal desktop
initBoot(() => {
  room.style.transition = 'opacity 0.5s ease';
  room.style.opacity = '1';
});

// Sync dock indicators + menu bar app name on window state change
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
initContextMenu();
initParticles();

// Lazy-load face tracking after initial paint
let detectFace = () => {};
let updatePerspective = () => {};

requestAnimationFrame(() => {
  import('./tracking.js').then((tracking) => {
    detectFace = tracking.detectFace;
    updatePerspective = tracking.updatePerspective;
    tracking.initTracking();
  });
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  detectFace();
  updatePerspective();
}
animate();
