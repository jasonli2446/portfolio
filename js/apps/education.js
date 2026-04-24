export default {
  id: 'education',
  title: 'Transcript',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"></path></svg>',
  width: 500,
  height: 560,
  wall: 'back',
  openOnStart: false,
  content: () => `
    <div class="transcript">
      <div class="transcript-header">
        <img class="transcript-logo-img" src="public/CWRU_Acronym-logo-brand.avif" alt="CWRU" style="width:48px; height:48px; border-radius:8px; object-fit:contain;">
        <div class="transcript-school">
          <div class="transcript-uni">Case Western Reserve University</div>
          <div class="transcript-sub">Office of the University Registrar · Cleveland, OH</div>
        </div>
      </div>
      <div class="transcript-divider"></div>

      <div class="transcript-section">
        <div class="transcript-section-title">Student Information</div>
        <div class="transcript-row"><span class="transcript-label">Name</span><span class="transcript-val">Jason Li</span></div>
        <div class="transcript-row"><span class="transcript-label">Enrollment</span><span class="transcript-val">Aug 2023 – May 2027</span></div>
        <div class="transcript-row"><span class="transcript-label">Major</span><span class="transcript-val">B.S. Computer Science & Computer Engineering</span></div>
        <div class="transcript-row"><span class="transcript-label">Minor</span><span class="transcript-val">Economics, Mathematics</span></div>
        <div class="transcript-row"><span class="transcript-label">GPA</span><span class="transcript-val transcript-gpa">4.0 / 4.0</span></div>
      </div>

      <div class="transcript-section">
        <div class="transcript-section-title">Honors & Awards</div>
        <div class="transcript-honor">Dean's Honors List <span class="transcript-note">Every semester</span></div>
        <div class="transcript-honor">Tau Beta Pi Engineering Honor Society</div>
        <div class="transcript-honor">Case Alumni Foundation Junior-Senior Scholarship <span class="transcript-note">2025</span></div>
        <div class="transcript-honor">Frank L. Merat Prize <span class="transcript-note">2025</span></div>
        <div class="transcript-honor">Tuition Exchange Scholarship <span class="transcript-note">2023</span></div>
      </div>

      <div class="transcript-section">
        <div class="transcript-section-title">Notable Coursework</div>
        <div class="transcript-course"><span>CSDS 340</span><span>Intro to Machine Learning</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 391</span><span>Intro to Artificial Intelligence</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 325</span><span>Computer Networks</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 344</span><span>Computer Security</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 393</span><span>Software Engineering</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 338</span><span>Computer Architecture</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 338</span><span>Operating Systems</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 341</span><span>Database Systems</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 233</span><span>Data Structures</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 310</span><span>Algorithms</span><span class="transcript-grade">A</span></div>
      </div>

      <div class="transcript-footer">
        <a href="public/JasonLiTranscript.pdf" target="_blank" class="transcript-link">View Official Transcript (PDF)</a>
      </div>
    </div>
  `,
};
