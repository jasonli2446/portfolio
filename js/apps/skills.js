const skillGroups = [
  { label: 'Languages', items: ['Python', 'TypeScript', 'Java', 'C++', 'C#', 'SQL'] },
  { label: 'Frameworks', items: ['React', 'Next.js', 'PyTorch', 'Express', 'Tailwind'] },
  { label: 'Tools', items: ['AWS', 'Docker', 'Git', 'Firebase', 'Supabase'] },
];

function renderGroup(g) {
  const badges = g.items.map(i => `<span class="skill-badge">${i}</span>`).join('');
  return `<div class="skill-group">
    <div class="skill-label">${g.label}</div>
    <div class="skill-badges">${badges}</div>
  </div>`;
}

export default {
  id: 'skills',
  title: 'Skills & Contact',
  icon: '⚡',
  width: 380,
  height: 420,
  wall: 'right',
  openOnStart: true,
  content: () =>
    `<div class="skills-contact">
       <div class="skills-section">
         ${skillGroups.map(renderGroup).join('')}
       </div>
       <hr class="skills-divider">
       <div class="contact-section">
         <a href="mailto:jasonli2446@gmail.com" class="contact-link">📧 jasonli2446@gmail.com</a>
         <a href="https://github.com/jasonli2446" target="_blank" class="contact-link">💻 GitHub</a>
         <a href="https://linkedin.com/in/jasonli2446" target="_blank" class="contact-link">🔗 LinkedIn</a>
       </div>
       <hr class="skills-divider">
       <a href="#" class="resume-btn">📄 Download Resume</a>
     </div>`,
};
