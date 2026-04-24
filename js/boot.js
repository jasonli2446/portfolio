// Intro screen — asks for camera permission, then fades to desktop

export function initBoot(onComplete) {
  const screen = document.getElementById('boot-screen');
  if (!screen) { onComplete(false); return; }

  const enableBtn = document.getElementById('boot-enable-camera');
  const skipBtn = document.getElementById('boot-skip-camera');

  function fadeOut(enableCamera) {
    screen.style.opacity = '0';
    setTimeout(() => {
      screen.style.display = 'none';
      onComplete(enableCamera);
    }, 500);
  }

  enableBtn.addEventListener('click', () => fadeOut(true));
  skipBtn.addEventListener('click', () => fadeOut(false));
}
