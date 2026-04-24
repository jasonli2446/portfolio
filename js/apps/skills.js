const categories = [
  { id: 'languages', icon: '🔤', label: 'Languages', items: ['Python', 'TypeScript', 'Java', 'C++', 'C#', 'SQL'] },
  { id: 'frameworks', icon: '⚙️', label: 'Frameworks', items: ['React', 'Next.js', 'PyTorch', 'Express', 'Tailwind'] },
  { id: 'tools', icon: '🛠', label: 'Tools', items: ['AWS', 'Docker', 'Git', 'Firebase', 'Supabase'] },
  { id: 'contact', icon: '📧', label: 'Contact', links: [
    { text: 'jasonli2446@gmail.com', href: 'mailto:jasonli2446@gmail.com' },
    { text: 'GitHub', href: 'https://github.com/jasonli2446' },
    { text: 'LinkedIn', href: 'https://linkedin.com/in/jasonli2446' },
  ]},
  { id: 'resume', icon: '📄', label: 'Resume', download: true },
];

function renderCategoryIcon(cat) {
  return `<button class="settings-icon" data-cat="${cat.id}">
    <span class="settings-icon-emoji">${cat.icon}</span>
    <span class="settings-icon-label">${cat.label}</span>
  </button>`;
}

function renderCategoryContent(cat) {
  if (cat.items) {
    const badges = cat.items.map(i => `<span class="settings-badge">${i}</span>`).join('');
    return `<div class="settings-content" data-content="${cat.id}">
      <div class="settings-content-header">${cat.icon} ${cat.label}</div>
      <div class="settings-badges">${badges}</div>
    </div>`;
  }
  if (cat.links) {
    const links = cat.links.map(l =>
      `<a href="${l.href}" target="${l.href.startsWith('mailto') ? '' : '_blank'}" class="settings-row">
        <span class="settings-row-label">${l.text}</span>
        <span class="settings-row-chevron">→</span>
      </a>`
    ).join('');
    return `<div class="settings-content" data-content="${cat.id}">
      <div class="settings-content-header">${cat.icon} ${cat.label}</div>
      ${links}
    </div>`;
  }
  if (cat.download) {
    return `<div class="settings-content" data-content="${cat.id}">
      <div class="settings-content-header">${cat.icon} ${cat.label}</div>
      <a href="#" class="settings-download">⬇ Download Resume (PDF)</a>
    </div>`;
  }
  return '';
}

export default {
  id: 'skills',
  title: 'Settings',
  icon: '⚙️',
  width: 440,
  height: 480,
  wall: 'right',
  openOnStart: true,
  content: () =>
    `<div class="settings-panel">
       <div class="settings-grid">${categories.map(renderCategoryIcon).join('')}</div>
       <div class="settings-detail">${categories.map(renderCategoryContent).join('')}</div>
     </div>`,
  init: (win) => {
    const icons = win.element.querySelectorAll('.settings-icon');
    const contents = win.element.querySelectorAll('.settings-content');
    let activeId = null;

    icons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const catId = icon.dataset.cat;

        // Toggle: clicking same category hides it
        if (activeId === catId) {
          contents.forEach(c => c.style.display = 'none');
          icons.forEach(i => i.classList.remove('active'));
          activeId = null;
          return;
        }

        // Show selected, hide others
        contents.forEach(c => {
          c.style.display = c.dataset.content === catId ? 'block' : 'none';
        });
        icons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        activeId = catId;
      });
    });

    // Initially hide all content
    contents.forEach(c => c.style.display = 'none');
  },
};
