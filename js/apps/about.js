export default {
  id: 'about',
  title: 'About Me',
  icon: '👤',
  width: 420,
  height: 500,
  wall: 'back',
  openOnStart: true,
  offsetX: -280,
  offsetY: -40,
  content: () =>
    `<div class="about">
       <div class="info-icon">
         <div class="about-avatar">JL</div>
         <h1 class="about-name">Jason Li</h1>
       </div>
       <div class="info-separator"></div>
       <div class="info-row">
         <span class="info-label">Kind:</span>
         <span class="info-value">Full Stack Engineer & Researcher</span>
       </div>
       <div class="info-row">
         <span class="info-label">Size:</span>
         <span class="info-value">1,000+ lines of code shipped</span>
       </div>
       <div class="info-row">
         <span class="info-label">Where:</span>
         <span class="info-value">Case Western Reserve University</span>
       </div>
       <div class="info-row">
         <span class="info-label">Created:</span>
         <span class="info-value">2004</span>
       </div>
       <div class="info-row">
         <span class="info-label">Modified:</span>
         <span class="info-value" id="modified-date">—</span>
       </div>
       <div class="info-separator"></div>
       <div class="info-disclosure" id="info-disclosure">
         <span class="disclosure-arrow">▶</span> More Info
       </div>
       <div class="info-bio" id="info-bio">
         I'm passionate about building elegant software that bridges design and engineering. Currently exploring the intersection of 3D graphics, systems programming, and web technologies. I love creating tools that make complex ideas accessible and delightful to use.
       </div>
       <div class="info-separator"></div>
       <div class="info-links">
         <a href="https://github.com/jasonli2446" target="_blank" class="info-link">GitHub</a>
         <a href="https://linkedin.com/in/jasonli2446" target="_blank" class="info-link">LinkedIn</a>
         <a href="mailto:jasonli2446@gmail.com" class="info-link">Email</a>
       </div>
     </div>`,
  init: (win) => {
    // Set today's date in "Modified" field
    const modifiedEl = win.querySelector('#modified-date');
    if (modifiedEl) {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      modifiedEl.textContent = dateStr;
    }

    // Wire up collapsible section toggle
    const disclosure = win.querySelector('#info-disclosure');
    const bio = win.querySelector('#info-bio');
    const arrow = win.querySelector('.disclosure-arrow');

    if (disclosure && bio && arrow) {
      disclosure.addEventListener('click', () => {
        const isHidden = bio.style.display === 'none' || !bio.style.display;
        if (isHidden) {
          bio.style.display = 'block';
          arrow.textContent = '▼';
        } else {
          bio.style.display = 'none';
          arrow.textContent = '▶';
        }
      });
      // Initially hide bio
      bio.style.display = 'none';
    }
  }
};
