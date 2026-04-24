const projectData = [
  {
    title: 'FireCommand',
    desc: 'Real-time wildfire incident command platform built for Palantir\'s hiring challenge. Live NASA satellite fire detection, AI tactical analysis, and deck.gl visualization.',
    tags: ['Next.js', 'deck.gl', 'Zustand', 'NASA API'],
    link: 'https://github.com/jasonli2446/firecommand'
  },
  {
    title: 'Thrifty',
    desc: 'Campus peer-to-peer clothing marketplace with Stripe payments, real-time messaging, and verified .edu authentication.',
    tags: ['React Native', 'Supabase', 'Stripe', 'Expo'],
    link: 'https://github.com/jasonli2446/Thrifty'
  },
  {
    title: 'CampusGuessr',
    desc: 'GeoGuessr-inspired game for CWRU played by 1,000+ students. 360° locations, leaderboards, real-time multiplayer, 300+ spots.',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    link: 'https://github.com/jasonli2446/campusguessr'
  },
  {
    title: 'KV Cache Research',
    desc: 'SVD-based KV cache compression for LLaMA transformers achieving 87.5% memory savings. 2-GPU distributed system with HPC deployment.',
    tags: ['Python', 'PyTorch', 'SLURM', 'HPC'],
    link: 'https://github.com/jasonli2446/kv-cache-research'
  },
  {
    title: 'AI Avatar Kiosk',
    desc: 'Permanent interactive AI exhibit at CWRU Weatherhead School. Real-time avatar conversations via WebRTC with SSO authentication.',
    tags: ['Next.js', 'HeyGen', 'WebRTC', 'AWS'],
    link: 'https://github.com/jasonli2446/ai-avatar-kiosk'
  },
  {
    title: 'Dealer Tire CAS',
    desc: 'Enterprise conversational AI helping account managers generate customer summaries through AI-guided interviews with voice I/O.',
    tags: ['Next.js', 'OpenAI', 'Pinecone', 'Supabase'],
    link: '#'
  },
  {
    title: 'LinkedIn Zip',
    desc: 'Recreation of LinkedIn\'s Zip puzzle game. Hamiltonian path algorithm for puzzle generation with smooth touch gestures.',
    tags: ['React Native', 'TypeScript', 'Algorithms'],
    link: 'https://github.com/jasonli2446/linkedin-zip'
  },
  {
    title: 'BrickdUp',
    desc: 'Real-time puzzle platformer built in Unity with player-placeable tiles and progressive difficulty. Published on itch.io.',
    tags: ['Unity', 'C#', 'Game Dev'],
    link: 'https://github.com/jasonli2446/BrickdUp'
  },
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
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
  width: 620,
  height: 520,
  wall: 'back',
  openOnStart: false,
  offsetX: 200,
  offsetY: -20,
  content: () =>
    `<div class="fm-toolbar">
      <div class="fm-breadcrumb">~/projects/</div>
    </div>
    <div class="fm-grid">${projectData.map(renderFolder).join('')}</div>`,
  init,
};
