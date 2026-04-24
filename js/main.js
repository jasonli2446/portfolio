import { DEPTH, BASE_PERSPECTIVE } from './config.js';
import { createWindow, centerWindow, onWindowStateChange } from './windows.js';
import { apps } from './apps/index.js';
import { registerApp, setAppWindow, updateIndicators, handleDockClick } from './dock.js';
import { initDesktop, setDockClickHandler } from './desktop.js';

// Sync dock indicators whenever any window state changes
onWindowStateChange(updateIndicators);

// Set CSS custom property for wall depth
const room = document.getElementById('room');
room.style.setProperty('--depth', DEPTH + 'px');
room.style.perspective = BASE_PERSPECTIVE + 'px';

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

// Desktop icons
setDockClickHandler(handleDockClick);
initDesktop();

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
