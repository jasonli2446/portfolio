const notes = [
  { color: '#2a1f4e', text: 'TODO: sleep more 😴', rotate: -2 },
  { color: '#1f2a4e', text: 'push to main, not prod\n— famous last words', rotate: 1.5 },
  { color: '#2a1f3e', text: '💡 idea: what if the\nportfolio was a 3D room?', rotate: -1 },
  { color: '#1f3a2e', text: '"it works on my machine"\n    — me, every time', rotate: 2.5 },
];

export default {
  id: 'stickies',
  title: 'Stickies',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path><polyline points="16 3 16 8 21 8"></polyline></svg>',
  width: 260,
  height: 320,
  wall: 'right',
  openOnStart: true,
  offsetX: 0,
  offsetY: -20,
  content: () => {
    const cards = notes.map(n =>
      `<div class="sticky-note" style="background:${n.color}; transform:rotate(${n.rotate}deg);">
         <div class="sticky-text">${n.text}</div>
       </div>`
    ).join('');
    return `<div class="stickies-grid">${cards}</div>`;
  },
};
