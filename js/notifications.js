// Notification center — click the clock in the menu bar to toggle

const notifications = [
  { icon: 'git', title: 'Pushed to main', body: '3d-os: "Big feature batch"', time: 'Just now' },
  { icon: 'star', title: 'New star on CampusGuessr', body: 'Repository reached 1 star', time: '2h ago' },
  { icon: 'user', title: '1,000th CampusGuessr player', body: 'Milestone reached!', time: '1d ago' },
  { icon: 'merge', title: 'Merged PR #42', body: 'Thrifty: Add real-time messaging', time: '2d ago' },
  { icon: 'award', title: 'Dean\'s Honors List', body: 'Spring 2026 semester', time: '1w ago' },
  { icon: 'rocket', title: 'Deployed FireCommand', body: 'Palantir challenge submission', time: '2w ago' },
];

const iconMap = {
  git: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(100,200,150,0.8)" stroke-width="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,200,60,0.8)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(100,160,255,0.8)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  merge: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(160,100,255,0.8)" stroke-width="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>',
  award: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,60,0.8)" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
  rocket: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(100,200,255,0.8)" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>',
};

let panel = null;
let isOpen = false;

export function initNotifications() {
  // Wire to the clock in the menu bar
  const timeEl = document.getElementById('menubar-time');
  if (timeEl) {
    timeEl.style.cursor = 'pointer';
    timeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
  }

  document.addEventListener('click', () => {
    if (isOpen) close();
  });
}

function toggle() {
  if (isOpen) close();
  else open();
}

function open() {
  if (isOpen) return;
  isOpen = true;

  panel = document.createElement('div');
  panel.className = 'notif-panel';
  panel.innerHTML = `
    <div class="notif-header">Notifications</div>
    ${notifications.map(n => `
      <div class="notif-item">
        <div class="notif-icon">${iconMap[n.icon] || ''}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-desc">${n.body}</div>
        </div>
        <div class="notif-time">${n.time}</div>
      </div>
    `).join('')}
  `;
  panel.addEventListener('click', (e) => e.stopPropagation());
  document.querySelector('.wall-back').appendChild(panel);

  // Animate in
  requestAnimationFrame(() => panel.classList.add('notif-panel-open'));
}

function close() {
  if (!isOpen || !panel) return;
  panel.classList.remove('notif-panel-open');
  setTimeout(() => { if (panel) { panel.remove(); panel = null; } }, 200);
  isOpen = false;
}
