let rafId = null;

export default {
  id: 'clock',
  title: 'Clock',
  icon: '🕐',
  width: 300,
  height: 230,
  wall: 'left',
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
