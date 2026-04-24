// Right-click context menu on the back wall

export function initContextMenu() {
  const menu = document.getElementById('context-menu');
  if (!menu) return;

  // Show on right-click on back wall
  document.querySelector('.wall-back').addEventListener('contextmenu', (e) => {
    // Don't show if right-clicking a window or dock
    if (e.target.closest('.window') || e.target.closest('#dock') || e.target.closest('#menubar')) return;

    e.preventDefault();

    menu.innerHTML = `
      <div class="ctx-item" data-action="about-os">About This OS</div>
      <div class="ctx-separator"></div>
      <div class="ctx-item" data-action="refresh">Refresh</div>
      <div class="ctx-item ctx-disabled">Change Wallpaper</div>
      <div class="ctx-separator"></div>
      <div class="ctx-item" data-action="source">View Source ↗</div>
    `;

    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.display = 'block';

    menu.querySelectorAll('.ctx-item:not(.ctx-disabled)').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        if (action === 'refresh') location.reload();
        if (action === 'source') window.open('https://github.com/jasonli2446/3d-os', '_blank');
        if (action === 'about-os') showAboutOS();
        menu.style.display = 'none';
      }, { once: true });
    });
  });

  // Hide on click anywhere
  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });
}

function showAboutOS() {
  // Create a temporary alert-like overlay
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
