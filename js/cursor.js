// Subtle cursor indicator that changes color based on which wall plane you're hovering

export function initCursor() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  const colors = {
    'wall-back':    'rgba(140, 120, 255, 0.5)',
    'wall-left':    'rgba(80, 160, 255, 0.5)',
    'wall-right':   'rgba(180, 80, 255, 0.5)',
    'wall-floor':   'rgba(60, 200, 255, 0.5)',
    'wall-ceiling': 'rgba(120, 60, 200, 0.4)',
  };

  let lastWall = '';

  document.addEventListener('pointermove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';

    // Find which wall we're over
    const els = document.elementsFromPoint(e.clientX, e.clientY);
    let wallClass = '';
    for (const el of els) {
      if (el.classList.contains('wall')) {
        for (const cls of el.classList) {
          if (cls.startsWith('wall-')) { wallClass = cls; break; }
        }
        break;
      }
    }

    if (wallClass !== lastWall) {
      lastWall = wallClass;
      if (wallClass && wallClass !== 'wall-back') {
        dot.style.background = colors[wallClass] || 'rgba(140, 120, 255, 0.3)';
        dot.style.opacity = '1';
        dot.style.width = '6px';
        dot.style.height = '6px';
      } else {
        dot.style.opacity = '0';
      }
    }
  });
}
