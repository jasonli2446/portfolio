import {
  FaceLandmarker,
  FilesetResolver,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
import { EYE_DIST, SMOOTH, SMOOTH_Z, SENS_X, SENS_Y, BASE_FACE_W, BASE_PERSPECTIVE } from './config.js';

let sEyeX = 0, sEyeY = 0, sEyeZ = EYE_DIST;
let faceLandmarker = null;
let lastVideoTime  = -1;
let tracking       = false;

const statusEl = document.getElementById('status');
const debugEl  = document.getElementById('debug');
const videoEl  = document.getElementById('webcam');
const roomEl   = document.getElementById('room');

export async function initTracking() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });

    statusEl.textContent = 'Starting webcam...';
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
    });
    videoEl.srcObject = stream;
    await videoEl.play();

    statusEl.textContent = 'Move your head around!';
    setTimeout(() => (statusEl.style.opacity = '0'), 3000);
    tracking = true;
  } catch (err) {
    console.error('Tracking init failed:', err);
    statusEl.textContent = 'No face tracking — drag windows with your mouse!';
    statusEl.style.background = 'rgba(60, 60, 120, 0.7)';
    setTimeout(() => (statusEl.style.opacity = '0'), 4000);
    document.getElementById('webcam-container').style.display = 'none';
  }
}

export function detectFace() {
  if (!faceLandmarker || !tracking || videoEl.readyState < 2) return;
  if (videoEl.currentTime === lastVideoTime) return;
  lastVideoTime = videoEl.currentTime;

  const results = faceLandmarker.detectForVideo(videoEl, performance.now());
  if (!results.faceLandmarks?.length) return;

  const lm = results.faceLandmarks[0];
  const nose      = lm[4];
  const leftFace  = lm[234];
  const rightFace = lm[454];
  const faceW     = Math.hypot(leftFace.x - rightFace.x, leftFace.y - rightFace.y);

  const rawX = (0.5 - nose.x) * SENS_X;
  const rawY = (0.5 - nose.y) * SENS_Y;
  const rawZ = Math.max(2, Math.min(12, (BASE_FACE_W / Math.max(faceW, 0.04)) * EYE_DIST));

  sEyeX += (rawX - sEyeX) * SMOOTH;
  sEyeY += (rawY - sEyeY) * SMOOTH;
  sEyeZ += (rawZ - sEyeZ) * SMOOTH_Z;

  debugEl.textContent = `eye  x:${sEyeX.toFixed(2)}  y:${sEyeY.toFixed(2)}  z:${sEyeZ.toFixed(2)}`;
}

export function updatePerspective() {
  // Map face position to perspective-origin (percentage)
  // sEyeX: -1..1 → 100%..0%  (move left = look from left = origin shifts right)
  const pctX = 50 - sEyeX * 50;
  const pctY = 50 + sEyeY * 50;

  // Map distance to perspective value (closer = smaller perspective = more extreme)
  const perspective = (sEyeZ / EYE_DIST) * BASE_PERSPECTIVE;

  roomEl.style.perspective = perspective + 'px';
  roomEl.style.perspectiveOrigin = `${pctX}% ${pctY}%`;
}
