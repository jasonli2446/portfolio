const defaultNotes = [
  { color: '#2a1f4e', text: 'TODO: sleep more', rotate: -2 },
  { color: '#1f2a4e', text: 'push to main, not prod\n— famous last words', rotate: 1.5 },
  { color: '#2a1f3e', text: 'idea: what if the\nportfolio was a 3D room?', rotate: -1 },
  { color: '#1f3a2e', text: '"it works on my machine"\n    — me, every time', rotate: 2.5 },
];

const colors = ['#2a1f4e', '#1f2a4e', '#2a1f3e', '#1f3a2e', '#3a1f2a', '#1f2a3a'];

export default {
  id: 'stickies',
  title: 'Stickies',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path><polyline points="16 3 16 8 21 8"></polyline></svg>',
  width: 280,
  height: 340,
  wall: 'right',
  openOnStart: true,
  offsetX: 0,
  offsetY: -20,
  content: () => `<div class="stickies-container">
    <div class="stickies-grid" id="stickies-grid"></div>
    <button class="stickies-add" id="stickies-add">+ New Note</button>
  </div>`,
  init: (win) => {
    const grid = win.element.querySelector('#stickies-grid');
    const addBtn = win.element.querySelector('#stickies-add');

    function createSticky(text, color, rotate) {
      const note = document.createElement('div');
      note.className = 'sticky-note';
      note.style.background = color;
      note.style.transform = `rotate(${rotate}deg)`;
      note.innerHTML = `<div class="sticky-text" contenteditable="true">${text}</div>
        <button class="sticky-delete">×</button>`;

      note.querySelector('.sticky-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        note.remove();
      });

      grid.appendChild(note);
    }

    // Create default stickies
    for (const n of defaultNotes) {
      createSticky(n.text, n.color, n.rotate);
    }

    // Add new sticky
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotate = (Math.random() - 0.5) * 5;
      createSticky('New note...', color, rotate);
    });
  },
};
