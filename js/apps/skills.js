const categories = [
  { id: 'languages', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>', label: 'Languages', items: ['Python', 'Go', 'Swift', 'C++', 'Java', 'C#', 'TypeScript', 'SQL'] },
  { id: 'frameworks', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>', label: 'Frameworks', items: ['React', 'Next.js', 'React Native', 'PyTorch', 'Express', 'Tailwind', 'FastAPI'] },
  { id: 'tools', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>', label: 'Tools', items: ['AWS', 'Terraform', 'Docker', 'Git', 'Firebase', 'Supabase', 'Snowflake', 'Postman'] },
  { id: 'contact', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>', label: 'Contact', links: [
    { text: 'jasonli2446@gmail.com', href: 'mailto:jasonli2446@gmail.com' },
    { text: 'GitHub', href: 'https://github.com/jasonli2446' },
    { text: 'LinkedIn', href: 'https://linkedin.com/in/jasonli2446' },
  ]},
  { id: 'resume', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>', label: 'Resume', download: true },
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
      <a href="public/resume.pdf" class="settings-download">Download Resume (PDF)</a>
    </div>`;
  }
  return '';
}

export default {
  id: 'skills',
  title: 'Settings',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>',
  width: 440,
  height: 480,
  wall: 'right',
  openOnStart: false,
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
