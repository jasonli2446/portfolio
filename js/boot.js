// Boot/loading animation — shows briefly then fades to reveal desktop

export function initBoot(onComplete) {
  const screen = document.getElementById('boot-screen');
  if (!screen) { onComplete(); return; }

  const fill = screen.querySelector('.boot-bar-fill');

  // Animate the progress bar over 1.5s
  let start = null;
  function animate(ts) {
    if (!start) start = ts;
    const progress = Math.min(1, (ts - start) / 1500);
    fill.style.width = (progress * 100) + '%';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Fade out boot screen
      screen.style.opacity = '0';
      setTimeout(() => {
        screen.style.display = 'none';
        onComplete();
      }, 500);
    }
  }
  requestAnimationFrame(animate);
}
