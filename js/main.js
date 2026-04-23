import { DEPTH, BASE_PERSPECTIVE } from './config.js';
import { initTracking, detectFace, updatePerspective } from './tracking.js';
import { initApps } from './apps.js';

// Set CSS custom property for wall depth
const room = document.getElementById('room');
room.style.setProperty('--depth', DEPTH + 'px');
room.style.perspective = BASE_PERSPECTIVE + 'px';

// Create app windows
initApps();

// Render loop — just face tracking, CSS handles the 3D
function animate() {
  requestAnimationFrame(animate);
  detectFace();
  updatePerspective();
}
animate();

// Start face tracking
initTracking();
