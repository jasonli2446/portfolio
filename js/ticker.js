// Awards ticker on the ceiling wall

const awards = [
  "Dean's Honors List — Every Semester",
  "Tau Beta Pi Engineering Honor Society",
  "GPA: 4.0 / 4.0",
  "Case Alumni Foundation Scholarship 2025",
  "Frank L. Merat Prize 2025",
  "Tuition Exchange Scholarship 2023",
  "B.S. Computer Science & Computer Engineering",
  "Economics & Mathematics Minor",
  "Technical Lead @ CWRU xLab",
  "Incoming SWE Intern @ KKR",
  "1,000+ CampusGuessr Players",
];

export function initTicker() {
  const container = document.getElementById('awards-ticker');
  if (!container) return;

  // Double the content for seamless loop
  const text = awards.join('  ·  ');
  container.innerHTML = `
    <div class="ticker-track">
      <span class="ticker-content">${text}  ·  ${text}  ·  </span>
    </div>
  `;
}
