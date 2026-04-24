const projectData = [
  {
    title: 'FireCommand',
    desc: 'Real-time wildfire incident command platform built for Palantir\'s hiring challenge. Live NASA satellite fire detection, AI tactical analysis, and deck.gl visualization.',
    tags: ['Next.js', 'deck.gl', 'Zustand', 'NASA API'],
    link: 'https://github.com/jasonli2446/firecommand',
    files: ['README.md', 'src/', 'package.json', 'public/', 'next.config.ts'],
  },
  {
    title: 'Thrifty',
    desc: 'Campus peer-to-peer clothing marketplace with Stripe payments, real-time messaging, and verified .edu authentication.',
    tags: ['React Native', 'Supabase', 'Stripe', 'Expo'],
    link: 'https://github.com/jasonli2446/Thrifty',
    files: ['README.md', 'app/', 'components/', 'supabase/', 'package.json'],
  },
  {
    title: 'CampusGuessr',
    desc: 'GeoGuessr-inspired game for CWRU played by 1,000+ students. 360 locations, leaderboards, real-time multiplayer, 300+ spots.',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    link: 'https://github.com/jasonli2446/campusguessr',
    files: ['README.md', 'src/', 'public/', 'supabase/', 'next.config.js'],
  },
  {
    title: 'KV Cache Research',
    desc: 'SVD-based KV cache compression for LLaMA transformers achieving 87.5% memory savings. 2-GPU distributed system with HPC deployment.',
    tags: ['Python', 'PyTorch', 'SLURM', 'HPC'],
    link: 'https://github.com/jasonli2446/kv-cache-research',
    files: ['README.md', 'compress.py', 'evaluate.py', 'models/', 'scripts/'],
  },
  {
    title: 'Arguably',
    desc: 'AI-powered debate platform for structured argumentation. Real-time argument mapping and evidence evaluation.',
    tags: ['Next.js', 'TypeScript', 'AI'],
    link: 'https://github.com/jasonli2446/arguably',
    files: ['README.md', 'src/', 'package.json', 'prisma/'],
  },
  {
    title: 'AI Benchmarking',
    desc: 'Full-stack platform used by 5 paying clients to evaluate AI adoption and maturity across organizations.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    link: '#',
    files: ['README.md', 'src/', 'drizzle/', 'package.json'],
  },
  {
    title: 'Doan Brook',
    desc: 'Citizen science photo tracker for ecological restoration. GPS-validated uploads, AI content screening, face blurring.',
    tags: ['Next.js', 'Supabase', 'Google Vision', 'Resend'],
    link: 'https://github.com/jasonli2446/doan-brook',
    files: ['README.md', 'src/', 'supabase/', 'public/'],
  },
  {
    title: 'AI Avatar Kiosk',
    desc: 'Permanent interactive AI exhibit at CWRU Weatherhead School. Real-time avatar conversations via WebRTC with SSO authentication.',
    tags: ['Next.js', 'HeyGen', 'WebRTC', 'AWS'],
    link: 'https://github.com/jasonli2446/ai-avatar-kiosk',
    files: ['README.md', 'src/', 'public/', 'next.config.js'],
  },
  {
    title: 'Dealer Tire CAS',
    desc: 'Enterprise conversational AI helping account managers generate customer summaries through AI-guided interviews with voice I/O.',
    tags: ['Next.js', 'OpenAI', 'Pinecone', 'Supabase'],
    link: '#',
    files: ['README.md', 'src/', 'supabase/', 'vercel.json'],
  },
  {
    title: 'LinkedIn Zip',
    desc: 'Recreation of LinkedIn\'s Zip puzzle game. Hamiltonian path algorithm for puzzle generation with smooth touch gestures.',
    tags: ['React Native', 'TypeScript', 'Algorithms'],
    link: 'https://github.com/jasonli2446/linkedin-zip',
    files: ['README.md', 'App.tsx', 'src/', 'ios/'],
  },
  {
    title: 'BrickdUp',
    desc: 'Real-time puzzle platformer built in Unity with player-placeable tiles and progressive difficulty. Published on itch.io.',
    tags: ['Unity', 'C#', 'Game Dev'],
    link: 'https://github.com/jasonli2446/BrickdUp',
    files: ['README.md', 'Assets/', 'Scenes/', 'Scripts/'],
  },
];

const folderSvg = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';

const fileSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
const dirSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(100,180,255,0.6)" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>';

function renderGrid() {
  const folders = projectData.map((p, i) =>
    `<div class="fm-folder" data-index="${i}">
      <div class="fm-folder-icon">${folderSvg}</div>
      <div class="fm-folder-name">${p.title}</div>
    </div>`
  ).join('');

  return `<div class="fm-toolbar">
    <div class="fm-breadcrumb">~/projects/</div>
  </div>
  <div class="fm-grid">${folders}</div>`;
}

function renderTerminalView(p) {
  const fileList = p.files.map(f => {
    const isDir = f.endsWith('/');
    const icon = isDir ? dirSvg : fileSvg;
    const color = isDir ? 'color:rgba(100,180,255,0.8);' : 'color:rgba(255,255,255,0.6);';
    return `<span style="${color} display:inline-flex; align-items:center; gap:3px; margin-right:12px;">${icon}${f}</span>`;
  }).join('');

  const tags = p.tags.map(t => `<span class="fm-detail-tag">${t}</span>`).join('');
  const linkLine = p.link !== '#'
    ? `\n<span class="term-prompt">$ open github</span>\n<a href="${p.link}" target="_blank" style="color:rgba(100,180,255,0.8); text-decoration:none;">  Opening ${p.link}</a>`
    : '';

  return `<div class="fm-toolbar">
    <button class="fm-back" id="fm-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg> ~/projects/</button>
  </div>
  <div class="fm-terminal">
    <div class="term-output">
<span class="term-prompt">~/projects/${p.title} $ ls</span>
<div style="margin:6px 0 12px; display:flex; flex-wrap:wrap;">${fileList}</div>
<span class="term-prompt">~/projects/${p.title} $ cat README.md</span>
<div style="margin:8px 0; color:rgba(255,255,255,0.7); line-height:1.6;">${p.desc}</div>
<div style="margin:8px 0;">${tags}</div>${linkLine}
<div style="margin-top:8px;"><span class="term-prompt">~/projects/${p.title} $ </span><span class="term-cursor">_</span></div>
    </div>
  </div>`;
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
  content: () => `<div class="fm-container" id="fm-container">${renderGrid()}</div>`,
  init: (win) => {
    const container = win.element.querySelector('#fm-container');

    function showGrid() {
      container.innerHTML = renderGrid();
      container.querySelectorAll('.fm-folder').forEach(folder => {
        folder.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          const idx = parseInt(folder.dataset.index);
          showDetail(projectData[idx]);
        });
      });
    }

    function showDetail(project) {
      container.innerHTML = renderTerminalView(project);
      container.querySelector('#fm-back').addEventListener('click', (e) => {
        e.stopPropagation();
        showGrid();
      });
    }

    // Wire initial grid
    container.querySelectorAll('.fm-folder').forEach(folder => {
      folder.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const idx = parseInt(folder.dataset.index);
        showDetail(projectData[idx]);
      });
    });
  },
};
