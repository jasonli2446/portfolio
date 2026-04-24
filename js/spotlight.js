// Spotlight search — Cmd+Space to open

let isOpen = false;
let overlay = null;
let dockClickFn = null;

const searchItems = [
  // Apps
  { type: 'app', id: 'about', name: 'About Me', desc: 'Get Info — who I am' },
  { type: 'app', id: 'projects', name: 'Projects', desc: 'File manager — my work' },
  { type: 'app', id: 'experience', name: 'Experience', desc: 'Terminal — resume' },
  { type: 'app', id: 'skills', name: 'Settings', desc: 'Skills, contact, resume' },
  { type: 'app', id: 'education', name: 'Transcript', desc: 'Education & honors' },
  { type: 'app', id: 'notes', name: 'README', desc: 'Notes & intro guide' },
  { type: 'app', id: 'clock', name: 'Clock', desc: 'Live time' },
  { type: 'app', id: 'nowplaying', name: 'Now Playing', desc: 'Lo-fi music player' },
  { type: 'app', id: 'stickies', name: 'Stickies', desc: 'Sticky notes' },
  { type: 'app', id: 'calculator', name: 'Calculator', desc: 'Calculator app' },
  { type: 'app', id: 'trash', name: 'Trash', desc: 'Closed windows' },

  // Projects (searchable)
  { type: 'link', name: 'FireCommand', desc: 'Palantir wildfire platform', url: 'https://github.com/jasonli2446/firecommand', tags: 'next.js deck.gl' },
  { type: 'link', name: 'Thrifty', desc: 'Campus marketplace', url: 'https://github.com/jasonli2446/Thrifty', tags: 'react native supabase stripe' },
  { type: 'link', name: 'CampusGuessr', desc: 'CWRU GeoGuessr game', url: 'https://github.com/jasonli2446/campusguessr', tags: 'next.js supabase' },
  { type: 'link', name: 'KV Cache Research', desc: 'Transformer compression', url: 'https://github.com/jasonli2446/kv-cache-research', tags: 'python pytorch' },

  // Links
  { type: 'link', name: 'GitHub', desc: 'github.com/jasonli2446', url: 'https://github.com/jasonli2446' },
  { type: 'link', name: 'LinkedIn', desc: 'linkedin.com/in/jasonli2446', url: 'https://linkedin.com/in/jasonli2446' },
  { type: 'link', name: 'Resume', desc: 'Download PDF', url: 'public/resume.pdf' },
  { type: 'link', name: 'Email', desc: 'jasonli2446@gmail.com', url: 'mailto:jasonli2446@gmail.com' },
];

export function initSpotlight(dockClick) {
  dockClickFn = dockClick;

  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K (works on all platforms, doesn't conflict with OS)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggle();
    }
    // Also / key when not typing in an input
    if (e.key === '/' && !e.target.closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Escape' && isOpen) close();
  });

  // Search icon in menu bar (added dynamically)
  const menuRight = document.querySelector('.menubar-right');
  if (menuRight) {
    const searchBtn = document.createElement('button');
    searchBtn.className = 'menubar-search';
    searchBtn.title = 'Search (Ctrl+K or /)';
    searchBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    searchBtn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    menuRight.insertBefore(searchBtn, menuRight.firstChild);
  }
}

function toggle() {
  if (isOpen) close();
  else open();
}

function open() {
  if (isOpen) return;
  isOpen = true;

  overlay = document.createElement('div');
  overlay.className = 'spotlight-overlay';
  overlay.innerHTML = `
    <div class="spotlight-box">
      <div class="spotlight-input-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" class="spotlight-input" id="spotlight-input" placeholder="Search apps, projects, links..." autocomplete="off" spellcheck="false">
      </div>
      <div class="spotlight-results" id="spotlight-results"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#spotlight-input');
  const results = overlay.querySelector('#spotlight-results');
  input.focus();

  // Show all items initially
  renderResults(results, searchItems.slice(0, 8));

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) {
      renderResults(results, searchItems.slice(0, 8));
      return;
    }
    const filtered = searchItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      (item.tags && item.tags.includes(q))
    );
    renderResults(results, filtered.slice(0, 8));
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = results.querySelector('.spotlight-item');
      if (first) first.click();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

function renderResults(container, items) {
  container.innerHTML = items.map(item => `
    <div class="spotlight-item" data-type="${item.type}" data-id="${item.id || ''}" data-url="${item.url || ''}">
      <div class="spotlight-item-name">${item.name}</div>
      <div class="spotlight-item-desc">${item.desc}</div>
    </div>
  `).join('');

  container.querySelectorAll('.spotlight-item').forEach(el => {
    el.addEventListener('click', () => {
      const type = el.dataset.type;
      if (type === 'app' && dockClickFn) {
        dockClickFn(el.dataset.id);
      } else if (type === 'link' && el.dataset.url) {
        window.open(el.dataset.url, '_blank');
      }
      close();
    });
  });
}

function close() {
  if (!isOpen || !overlay) return;
  overlay.remove();
  overlay = null;
  isOpen = false;
}
