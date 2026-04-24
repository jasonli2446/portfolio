// Lo-fi music player using Web Audio API synthesis
// Generates ambient lo-fi beats procedurally — no external files needed

let audioCtx = null;
let isPlaying = false;
let nodes = [];
let beatInterval = null;

const tracks = [
  { title: 'Late Night Commits', artist: 'Ambient Lo-fi', bpm: 72 },
  { title: 'Debug Mode',         artist: 'Chill Beats',   bpm: 80 },
  { title: 'Merge Conflict',     artist: 'Synth Waves',   bpm: 68 },
];
let currentTrack = 0;

// Chord progressions (lo-fi jazz)
const chords = [
  [261.63, 329.63, 392.00], // Cmaj
  [220.00, 277.18, 329.63], // Am
  [246.94, 311.13, 369.99], // Bm
  [196.00, 246.94, 293.66], // G
];

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playChord(freqs, time, duration) {
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(0.03, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  for (const freq of freqs) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    // Slight detune for warmth
    osc.detune.setValueAtTime((Math.random() - 0.5) * 20, time);

    // Low-pass filter for lo-fi warmth
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 400, time);

    osc.connect(filter);
    filter.connect(gain);
    osc.start(time);
    osc.stop(time + duration);
    nodes.push(osc);
  }
}

function playKick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
  gain.gain.setValueAtTime(0.08, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  osc.start(time);
  osc.stop(time + 0.2);
  nodes.push(osc);
}

function playHihat(time) {
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(8000, time);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.02, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  source.start(time);
  nodes.push(source);
}

function scheduleBar() {
  if (!isPlaying || !audioCtx) return;
  const track = tracks[currentTrack];
  const beatDur = 60 / track.bpm;
  const now = audioCtx.currentTime;

  // Pick a chord
  const chord = chords[Math.floor(Math.random() * chords.length)];
  playChord(chord, now, beatDur * 4);

  // Drums pattern (simple boom-bap)
  playKick(now);
  playHihat(now + beatDur * 0.5);
  playKick(now + beatDur * 1);
  playHihat(now + beatDur * 1.5);
  playKick(now + beatDur * 2);
  playHihat(now + beatDur * 2.5);
  playHihat(now + beatDur * 3);
  playHihat(now + beatDur * 3.5);

  beatInterval = setTimeout(scheduleBar, beatDur * 4 * 1000);
}

function startPlayback() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  isPlaying = true;
  scheduleBar();
}

function stopPlayback() {
  isPlaying = false;
  if (beatInterval) { clearTimeout(beatInterval); beatInterval = null; }
  // Close audio context to stop all scheduled sounds
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
  nodes = [];
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
}

export default {
  id: 'nowplaying',
  title: 'Now Playing',
  icon: '🎵',
  width: 300,
  height: 180,
  wall: 'left',
  openOnStart: true,
  offsetX: 0,
  offsetY: 130,
  content: () =>
    `<div class="np">
       <div class="np-art">🎧</div>
       <div class="np-info">
         <div class="np-track" id="np-track">${tracks[currentTrack].title}</div>
         <div class="np-artist" id="np-artist">${tracks[currentTrack].artist}</div>
         <div class="np-controls">
           <button class="np-btn" id="np-prev">⏮</button>
           <button class="np-btn np-btn-play" id="np-play">▶</button>
           <button class="np-btn" id="np-next">⏭</button>
         </div>
         <div class="np-hint">Procedural lo-fi · Web Audio API</div>
       </div>
     </div>`,
  init: (win) => {
    const playBtn = win.element.querySelector('#np-play');
    const prevBtn = win.element.querySelector('#np-prev');
    const nextBtn = win.element.querySelector('#np-next');
    const trackEl = win.element.querySelector('#np-track');
    const artistEl = win.element.querySelector('#np-artist');

    function updateDisplay() {
      trackEl.textContent = tracks[currentTrack].title;
      artistEl.textContent = tracks[currentTrack].artist;
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        stopPlayback();
        playBtn.textContent = '▶';
      } else {
        startPlayback();
        playBtn.textContent = '⏸';
      }
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevTrack();
      updateDisplay();
      if (isPlaying) { stopPlayback(); startPlayback(); }
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextTrack();
      updateDisplay();
      if (isPlaying) { stopPlayback(); startPlayback(); }
    });
  },
  destroy: () => {
    stopPlayback();
  },
};
