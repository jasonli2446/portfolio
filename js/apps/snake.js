// Snake app — launches the full-room 3D snake game
// This is just the app descriptor; the actual game is in js/snake.js

import { startSnake } from '../snake.js';

let launched = false;

export default {
  id: 'snake',
  title: 'Snake',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-4 4 8 2-4h4"></path><circle cx="20" cy="12" r="2"></circle></svg>',
  width: 300,
  height: 200,
  wall: 'back',
  showInDock: false,
  openOnStart: false,
  content: () => `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:12px;">
      <div style="font-size:48px;">🐍</div>
      <div style="font-size:16px; font-weight:600; color:#fff;">3D Snake</div>
      <div style="font-size:12px; color:rgba(255,255,255,0.4); text-align:center;">
        The entire room becomes the game arena.<br>
        Snake wraps across all 5 walls.
      </div>
      <button class="snake-launch-btn" style="margin-top:8px; padding:8px 24px; background:rgba(100,200,150,0.2); border:1px solid rgba(100,200,150,0.3); border-radius:8px; color:rgba(100,220,150,0.9); font-size:14px; cursor:pointer;">
        Start Game
      </button>
    </div>
  `,
  init: (win) => {
    const btn = win.element.querySelector('.snake-launch-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (launched) return;
        launched = true;
        // Hide all windows
        import('../windows.js').then(({ windows, hideWindow }) => {
          // Don't actually hide — the canvas overlays cover everything
          startSnake(() => { launched = false; });
        });
      });
    }
  },
};
