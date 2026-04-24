// Desktop icons on the back wall — draggable, selectable

const icons = [
  // Trash first (top-left)
  { id: 'trash', svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>', label: 'Trash', type: 'app' },

  { id: 'about',      svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', label: 'About Me',    type: 'app' },
  { id: 'projects',   svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>', label: 'Projects',    type: 'app' },
  { id: 'experience', svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>', label: 'Experience',  type: 'app' },
  { id: 'skills',     svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>', label: 'Settings',    type: 'app' },

  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`, label: 'GitHub', type: 'link', href: 'https://github.com/jasonli2446' },
  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`, label: 'LinkedIn', type: 'link', href: 'https://linkedin.com/in/jasonli2446' },
  { svg: `<svg viewBox="0 0 24 24" fill="white" width="36" height="36"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`, label: 'Email', type: 'link', href: 'mailto:jasonli2446@gmail.com' },
  { svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>', label: 'Resume', type: 'link', href: 'public/resume.pdf' },

  { svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>', label: 'README',   type: 'readme' },
  { svg: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>', label: '???',      type: 'secret' },
];

const ICON_W = 80;
const ICON_H = 76;
const COLS = 2;
const START_X = 24;
const START_Y = 52;
const GAP = 8;

let dockClickHandler = null;
let iconElements = [];
let selectedIcons = new Set();
let draggingIcons = false;
let dragStartX = 0, dragStartY = 0;
let selectionBox = null;
let selStartX = 0, selStartY = 0;

export function setDockClickHandler(fn) {
  dockClickHandler = fn;
}

export function initDesktop() {
  const container = document.getElementById('desktop-icons');
  if (!container) return;

  // Position icons in a grid
  icons.forEach((icon, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = START_X + col * (ICON_W + GAP);
    const y = START_Y + row * (ICON_H + GAP);

    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.innerHTML = `
      <div class="desktop-icon-img">${icon.svg}</div>
      <div class="desktop-icon-label">${icon.label}</div>
    `;

    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      handleIconClick(icon);
    });

    // Single click to select
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();

      if (!e.shiftKey && !selectedIcons.has(el)) {
        clearSelection();
      }
      selectIcon(el);

      // Start drag
      draggingIcons = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    container.appendChild(el);
    iconElements.push({ el, icon, startX: 0, startY: 0 });
  });

  // Selection rectangle on back wall (pointerdown on empty space)
  const backWall = document.querySelector('.wall-back');
  backWall.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.desktop-icon') || e.target.closest('.window') ||
        e.target.closest('#dock') || e.target.closest('#menubar')) return;

    clearSelection();

    // Start selection rectangle
    selStartX = e.clientX;
    selStartY = e.clientY;

    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-rect';
    selectionBox.style.left = e.clientX + 'px';
    selectionBox.style.top = e.clientY + 'px';
    document.body.appendChild(selectionBox);
  });

  // Pointermove: drag icons or draw selection
  document.addEventListener('pointermove', (e) => {
    if (draggingIcons && selectedIcons.size > 0) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      for (const { el } of iconElements) {
        if (!selectedIcons.has(el)) continue;
        const left = parseFloat(el.style.left) || 0;
        const top = parseFloat(el.style.top) || 0;
        el.style.left = (left + dx) + 'px';
        el.style.top = (top + dy) + 'px';
      }
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      return;
    }

    if (selectionBox) {
      const x = Math.min(selStartX, e.clientX);
      const y = Math.min(selStartY, e.clientY);
      const w = Math.abs(e.clientX - selStartX);
      const h = Math.abs(e.clientY - selStartY);
      selectionBox.style.left = x + 'px';
      selectionBox.style.top = y + 'px';
      selectionBox.style.width = w + 'px';
      selectionBox.style.height = h + 'px';

      // Select icons that intersect the rectangle
      const rect = { x, y, w, h };
      for (const { el } of iconElements) {
        const ir = el.getBoundingClientRect();
        if (rectsOverlap(rect, { x: ir.left, y: ir.top, w: ir.width, h: ir.height })) {
          selectIcon(el);
        } else {
          deselectIcon(el);
        }
      }
    }
  });

  document.addEventListener('pointerup', () => {
    draggingIcons = false;
    if (selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
  });
}

function selectIcon(el) {
  selectedIcons.add(el);
  el.classList.add('desktop-icon-selected');
}

function deselectIcon(el) {
  selectedIcons.delete(el);
  el.classList.remove('desktop-icon-selected');
}

function clearSelection() {
  for (const el of selectedIcons) {
    el.classList.remove('desktop-icon-selected');
  }
  selectedIcons.clear();
}

function rectsOverlap(a, b) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
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
  if (dockClickHandler) {
    dockClickHandler('notes');
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
  // Matrix rain easter egg
  const overlay = document.createElement('div');
  overlay.className = 'about-os-overlay';
  overlay.style.background = 'rgba(0,0,0,0.9)';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
  overlay.appendChild(canvas);

  const msg = document.createElement('div');
  msg.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; z-index:1; opacity:0; transition:opacity 1s;';
  msg.innerHTML = `
    <div style="font-size:24px; color:#4ade80; font-family:monospace; margin-bottom:12px;">You found the secret.</div>
    <div style="font-size:14px; color:rgba(255,255,255,0.5); line-height:1.8;">
      This entire portfolio is a 3D room.<br>
      Built with vanilla JS. No frameworks.<br>
      The music is procedurally generated.<br>
      The face tracking is real.<br><br>
      <span style="color:rgba(255,255,255,0.3);">Thanks for exploring. — Jason</span>
    </div>
    <button class="about-os-close" style="margin-top:20px;">Close</button>
  `;
  overlay.appendChild(msg);

  document.body.appendChild(overlay);

  // Matrix rain on canvas
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 14);
  const drops = new Array(cols).fill(0);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

  let rafId;
  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4ade80';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 14, drops[i] * 14);
      if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    rafId = requestAnimationFrame(drawMatrix);
  }
  drawMatrix();

  // Show message after 2 seconds
  setTimeout(() => { msg.style.opacity = '1'; }, 2000);

  // Close
  const closeBtn = msg.querySelector('.about-os-close');
  const close = () => { cancelAnimationFrame(rafId); overlay.remove(); };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}
