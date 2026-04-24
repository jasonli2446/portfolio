const projectData = [
  { title: 'Project One', desc: '[Description placeholder]', tags: ['React', 'Node.js'], link: '#' },
  { title: 'Project Two', desc: '[Description placeholder]', tags: ['Python', 'PyTorch'], link: '#' },
  { title: 'Project Three', desc: '[Description placeholder]', tags: ['Unity', 'C#'], link: '#' },
  { title: 'Project Four', desc: '[Description placeholder]', tags: ['Next.js', 'AWS'], link: '#' },
  { title: 'Project Five', desc: '[Description placeholder]', tags: ['TypeScript', 'AI'], link: '#' },
  { title: 'Project Six', desc: '[Description placeholder]', tags: ['Full Stack'], link: '#' },
];

function renderFolder(p, index) {
  return `<div class="fm-folder" data-index="${index}">
    <div class="fm-folder-icon">📁</div>
    <div class="fm-folder-name">${p.title}</div>
  </div>`;
}

function renderDetail(p) {
  const tags = p.tags.map(t => `<span class="fm-detail-tag">${t}</span>`).join('');
  return `<div class="fm-detail">
    <h3 class="fm-detail-title">${p.title}</h3>
    <p class="fm-detail-desc">${p.desc}</p>
    <div class="fm-detail-tags">${tags}</div>
    <a href="${p.link}" target="_blank" class="fm-detail-link">Open →</a>
  </div>`;
}

function init(win) {
  const folders = win.element.querySelectorAll('.fm-folder');
  let currentlyExpanded = null;
  let currentDetail = null;

  folders.forEach((folder) => {
    folder.addEventListener('click', () => {
      const index = parseInt(folder.dataset.index);
      const project = projectData[index];

      // If clicking the same folder, close it
      if (currentlyExpanded === folder) {
        folder.classList.remove('selected');
        if (currentDetail) {
          currentDetail.remove();
          currentDetail = null;
        }
        currentlyExpanded = null;
        return;
      }

      // Remove previous selection
      if (currentlyExpanded) {
        currentlyExpanded.classList.remove('selected');
      }
      if (currentDetail) {
        currentDetail.remove();
      }

      // Add new selection
      folder.classList.add('selected');
      currentlyExpanded = folder;

      // Create and insert detail card
      const detail = document.createElement('div');
      detail.innerHTML = renderDetail(project);
      currentDetail = detail.firstElementChild;

      const grid = win.element.querySelector('.fm-grid');
      grid.parentNode.insertBefore(currentDetail, grid.nextSibling);
    });
  });
}

export default {
  id: 'projects',
  title: 'Projects',
  icon: '📂',
  width: 580,
  height: 480,
  wall: 'back',
  openOnStart: true,
  offsetX: 200,
  offsetY: -20,
  content: () =>
    `<div class="fm-toolbar">
      <div class="fm-breadcrumb">~/projects/</div>
    </div>
    <div class="fm-grid">${projectData.map(renderFolder).join('')}</div>`,
  init,
};
