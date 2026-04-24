const projectData = [
  { title: 'Project One', desc: '[Description placeholder]', tags: ['React', 'Node.js'], link: '#' },
  { title: 'Project Two', desc: '[Description placeholder]', tags: ['Python', 'PyTorch'], link: '#' },
  { title: 'Project Three', desc: '[Description placeholder]', tags: ['Unity', 'C#'], link: '#' },
  { title: 'Project Four', desc: '[Description placeholder]', tags: ['Next.js', 'AWS'], link: '#' },
  { title: 'Project Five', desc: '[Description placeholder]', tags: ['TypeScript', 'AI'], link: '#' },
  { title: 'Project Six', desc: '[Description placeholder]', tags: ['Full Stack'], link: '#' },
];

function renderCard(p) {
  const tags = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
  return `<a href="${p.link}" target="_blank" class="project-card">
    <h3 class="project-card-title">${p.title}</h3>
    <p class="project-card-desc">${p.desc}</p>
    <div class="project-tags">${tags}</div>
  </a>`;
}

export default {
  id: 'projects',
  title: 'Projects',
  icon: '📂',
  width: 520,
  height: 400,
  wall: 'back',
  openOnStart: true,
  offsetX: 200,
  offsetY: -20,
  content: () =>
    `<div class="projects-grid">${projectData.map(renderCard).join('')}</div>`,
};
