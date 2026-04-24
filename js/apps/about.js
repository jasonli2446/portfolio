export default {
  id: 'about',
  title: 'About Me',
  icon: '👤',
  width: 420,
  height: 340,
  wall: 'back',
  openOnStart: true,
  content: () =>
    `<div class="about">
       <div class="about-header">
         <div class="about-avatar">JL</div>
         <div class="about-intro">
           <h1 class="about-name">Jason Li</h1>
           <p class="about-title">[Your title here]</p>
         </div>
       </div>
       <p class="about-bio">[Your bio — 2-3 sentences about what you do, what excites you, and what you're working on.]</p>
       <div class="about-links">
         <a href="https://github.com/jasonli2446" target="_blank" class="about-link">
           <span class="about-link-icon">GH</span> GitHub
         </a>
         <a href="https://linkedin.com/in/jasonli2446" target="_blank" class="about-link">
           <span class="about-link-icon">in</span> LinkedIn
         </a>
         <a href="mailto:jasonli2446@gmail.com" class="about-link">
           <span class="about-link-icon">@</span> Email
         </a>
       </div>
     </div>`,
};
