export default {
  id: 'education',
  title: 'Transcript',
  icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"></path></svg>',
  width: 480,
  height: 520,
  wall: 'back',
  openOnStart: false,
  content: () => `
    <div class="transcript">
      <div class="transcript-header">
        <div class="transcript-logo">CWRU</div>
        <div class="transcript-school">
          <div class="transcript-uni">Case Western Reserve University</div>
          <div class="transcript-sub">Office of the University Registrar</div>
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
        <div class="transcript-course"><span>CSDS 337</span><span>Compiler Design</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 340</span><span>Machine Learning</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 341</span><span>Database Systems</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>CSDS 395</span><span>Senior Project</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>ECSE 373</span><span>Embedded Systems</span><span class="transcript-grade">A</span></div>
        <div class="transcript-course"><span>MATH 224</span><span>Linear Algebra</span><span class="transcript-grade">A</span></div>
      </div>

      <div class="transcript-footer">
        This is an unofficial transcript for portfolio purposes only.
      </div>
    </div>
  `,
};
