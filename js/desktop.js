// Desktop icons on the back wall — app launchers, links, and fun extras

const icons = [
  // Portfolio apps (trigger dock launch)
  { id: 'about',      emoji: '👤', label: 'About Me',    type: 'app' },
  { id: 'projects',   emoji: '📂', label: 'Projects',    type: 'app' },
  { id: 'experience', emoji: '💼', label: 'Experience',  type: 'app' },
  { id: 'skills',     emoji: '⚙️', label: 'Settings',    type: 'app' },

  // External links
  { emoji: '🐙', label: 'GitHub',   type: 'link', href: 'https://github.com/jasonli2446' },
  { emoji: '🔗', label: 'LinkedIn', type: 'link', href: 'https://linkedin.com/in/jasonli2446' },
  { emoji: '📄', label: 'Resume',   type: 'link', href: '#' },

  // Fun extras
  { emoji: '🗑️', label: 'Trash',    type: 'none' },
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
      <div class="desktop-icon-img">${icon.emoji}</div>
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
