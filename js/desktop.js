// Desktop icons on the back wall — app launchers, links, and fun extras

const icons = [
  // Portfolio apps (trigger dock launch)
  { id: 'about',      emoji: '👤', label: 'About Me',    type: 'app' },
  { id: 'projects',   emoji: '📂', label: 'Projects',    type: 'app' },
  { id: 'experience', emoji: '💼', label: 'Experience',  type: 'app' },
  { id: 'skills',     emoji: '⚙️', label: 'Settings',    type: 'app' },

  // External links (inline SVG logos)
  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`, label: 'GitHub', type: 'link', href: 'https://github.com/jasonli2446' },
  { svg: `<svg viewBox="0 0 24 24" fill="#0A66C2" width="36" height="36"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`, label: 'LinkedIn', type: 'link', href: 'https://linkedin.com/in/jasonli2446' },
  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`, label: 'Email', type: 'link', href: 'mailto:jasonli2446@gmail.com' },
  { emoji: '📄', label: 'Resume', type: 'link', href: 'public/resume.pdf' },

  // Fun extras
  { id: 'trash', emoji: '🗑️', label: 'Trash', type: 'app' },
  { emoji: '📖', label: 'README',   type: 'readme' },
  { emoji: '🤫', label: '???',      type: 'secret' },
];

let dockClickHandler = null;

export function setDockClickHandler(fn) {
  dockClickHandler = fn;
}

export function initDesktop() {
  const container = document.getElementById('desktop-icons');
  if (!container) return;

  for (const icon of icons) {
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.innerHTML = `
      <div class="desktop-icon-img">${icon.svg || icon.emoji}</div>
      <div class="desktop-icon-label">${icon.label}</div>
    `;

    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      handleIconClick(icon);
    });

    container.appendChild(el);
  }
}

function handleIconClick(icon) {
  if (icon.type === 'app' && dockClickHandler) {
    dockClickHandler(icon.id);
  } else if (icon.type === 'link' && icon.href) {
    window.open(icon.href, '_blank');
  } else if (icon.type === 'readme') {
    showReadme();
  } else if (icon.type === 'secret') {
    showSecret();
  }
}

function showReadme() {
  // Launch notes app with README content
  if (dockClickHandler) {
    dockClickHandler('notes');
    // After a tick, replace notes content
    setTimeout(() => {
      const textarea = document.querySelector('.notes-textarea');
      if (textarea) {
        textarea.value =
`# README.md

Welcome to Jason Li's 3D Portfolio OS!

## Controls
- Drag windows by their title bar
- Double-click title bar to fullscreen
- Resize from the bottom-right corner
- Move your head for parallax (needs webcam)

## Built With
- Pure CSS 3D (perspective + perspective-origin)
- MediaPipe Face Tracking
- Vanilla JS, no frameworks

## Source
github.com/jasonli2446/3d-os`;
      }
    }, 100);
  }
}

function showSecret() {
  if (dockClickHandler) {
    dockClickHandler('notes');
    setTimeout(() => {
      const textarea = document.querySelector('.notes-textarea');
      if (textarea) {
        textarea.value =
`🤫 You found the secret!

Thanks for exploring. Here are some hidden things:

1. Try moving your head side to side
   (if you allowed camera access)
2. Drag a window to the edge of a wall
   — it splits across both surfaces
3. The clock is real-time
4. The terminal types itself out

Built with love and way too many
hours debugging CSS 3D transforms.

- Jason`;
      }
    }, 100);
  }
}
