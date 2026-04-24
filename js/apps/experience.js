const jobs = [
  { role: '[Role Title]', company: '[Company]', dates: 'Jan 2026 – Present', bullets: ['[Bullet point 1]', '[Bullet point 2]'] },
  { role: '[Role Title]', company: '[Company]', dates: 'May – Dec 2025', bullets: ['[Bullet point 1]', '[Bullet point 2]'] },
  { role: '[Role Title]', company: '[Company]', dates: 'Jan 2025 – Present', bullets: ['[Bullet point 1]'] },
  { role: '[Role Title]', company: '[Company]', dates: 'Jan – May 2025', bullets: ['[Bullet point 1]'] },
];

function renderJob(j) {
  const bullets = j.bullets.map(b => `<li>${b}</li>`).join('');
  return `<div class="exp-item">
    <div class="exp-dot"></div>
    <div class="exp-body">
      <div class="exp-role">${j.role}</div>
      <div class="exp-company">${j.company} <span class="exp-dates">${j.dates}</span></div>
      <ul class="exp-bullets">${bullets}</ul>
    </div>
  </div>`;
}

export default {
  id: 'experience',
  title: 'Experience',
  icon: '💼',
  width: 500,
  height: 400,
  wall: 'left',
  openOnStart: true,
  offsetX: 0,
  offsetY: -50,
  content: () =>
    `<div class="exp-timeline">${jobs.map(renderJob).join('')}</div>`,
};
