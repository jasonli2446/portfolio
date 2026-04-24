let progressInterval = null;

export default {
  id: 'nowplaying',
  title: 'Now Playing',
  icon: '🎵',
  width: 280,
  height: 160,
  wall: 'left',
  openOnStart: true,
  offsetX: 0,
  offsetY: 120,
  content: () =>
    `<div class="np">
       <div class="np-art">🎧</div>
       <div class="np-info">
         <div class="np-track">Building 3D Portfolio OS</div>
         <div class="np-artist">Jason Li — Side Projects</div>
         <div class="np-bar">
           <div class="np-bar-fill" id="np-fill"></div>
         </div>
         <div class="np-time">
           <span id="np-elapsed">2:47</span>
           <span id="np-total">∞</span>
         </div>
       </div>
     </div>`,
  init: (win) => {
    const fill = win.element.querySelector('#np-fill');
    const elapsed = win.element.querySelector('#np-elapsed');
    let seconds = 167; // start at 2:47
    progressInterval = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60);
      const s = String(seconds % 60).padStart(2, '0');
      elapsed.textContent = `${m}:${s}`;
      // Loop the progress bar every 4 minutes
      fill.style.width = ((seconds % 240) / 240 * 100) + '%';
    }, 1000);
  },
  destroy: () => {
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
  },
};
