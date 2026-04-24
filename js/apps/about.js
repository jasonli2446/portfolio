export default {
  id: 'about',
  title: 'About Me',
  icon: '👤',
  width: 480,
  height: 540,
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
         <span class="info-value">10,000+ lines of production code shipped</span>
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
         Building production AI systems and full-stack applications at the intersection of software engineering and machine learning. Currently a Technical Lead at CWRU xLab and undergraduate researcher at EINSTEIN Lab, with internship experience at KKR, 1848 Ventures, and Eaton. Passionate about creating elegant tools that make complex ideas accessible.
       </div>
       <div class="info-separator"></div>
       <div class="info-links">
         <a href="https://github.com/jasonli2446" target="_blank" class="info-link"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub</a>
         <a href="https://linkedin.com/in/jasonli2446" target="_blank" class="info-link"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn</a>
         <a href="mailto:jasonli2446@gmail.com" class="info-link"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Email</a>
       </div>
     </div>`,
  init: (win) => {
    // Set today's date in "Modified" field
    const modifiedEl = win.element.querySelector('#modified-date');
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
    const disclosure = win.element.querySelector('#info-disclosure');
    const bio = win.element.querySelector('#info-bio');
    const arrow = win.element.querySelector('.disclosure-arrow');

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
