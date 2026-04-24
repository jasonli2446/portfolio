let rafId = null;

export default {
  id: 'clock',
  title: 'Clock',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  width: 300,
  height: 230,
  wall: 'left',
  showInDock: false,
  openOnStart: true,
  offsetX: 0,
  offsetY: -120,
  content: () =>
    `<div class="clock-face">
       <div class="clock-time" id="clock-time">--:--</div>
       <div class="clock-seconds" id="clock-seconds">00</div>
       <div class="clock-date" id="clock-date">---</div>
     </div>`,
  init: (win) => {
    const timeEl = win.content.querySelector('#clock-time');
    const secEl  = win.content.querySelector('#clock-seconds');
    const dateEl = win.content.querySelector('#clock-date');

    function tick() {
      const now = new Date();
      timeEl.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      secEl.textContent  = String(now.getSeconds()).padStart(2, '0');
      dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      rafId = requestAnimationFrame(tick);
    }
    tick();
  },
  destroy: () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  },
};
