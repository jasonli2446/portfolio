import {
  FaceLandmarker,
  FilesetResolver,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
import { EYE_DIST, SMOOTH, SMOOTH_Z, SENS_X, SENS_Y, BASE_FACE_W, TRACKING_PERSPECTIVE } from './config.js';

let sEyeX = 0, sEyeY = 0, sEyeZ = EYE_DIST;
let faceLandmarker = null;
let lastVideoTime  = -1;
let tracking       = false;
let enabled        = true;

const videoEl  = document.getElementById('webcam');
const roomEl   = document.getElementById('room');

export async function initTracking() {
  try {
    // Only init the model once
    if (!faceLandmarker) {
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
    }

    // (Re-)request camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
    });
    videoEl.srcObject = stream;
    await videoEl.play();
    tracking = true;
    enabled = true;
  } catch (err) {
    console.error('Tracking init failed:', err);
    tracking = false;
  }
}

export function stopTracking() {
  tracking = false;
  enabled = false;
  if (videoEl.srcObject) {
    videoEl.srcObject.getTracks().forEach(t => t.stop());
    videoEl.srcObject = null;
  }
  // Reset perspective to center
  sEyeX = 0; sEyeY = 0; sEyeZ = EYE_DIST;
}

export function setEnabled(val) {
  enabled = val;
  if (!val) {
    // Smoothly return to center
    sEyeX = 0; sEyeY = 0; sEyeZ = EYE_DIST;
  }
}

export function isTracking() {
  return tracking && enabled;
}

export function detectFace() {
  if (!faceLandmarker || !tracking || !enabled || videoEl.readyState < 2) return;
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
}

export function updatePerspective() {
  const pctX = 50 + sEyeX * 50;
  const pctY = 50 - sEyeY * 50;
  // Use fixed perspective — only X/Y parallax, no zoom from Z distance
  const perspective = TRACKING_PERSPECTIVE;

  roomEl.style.perspective = perspective + 'px';
  roomEl.style.perspectiveOrigin = `${pctX}% ${pctY}%`;
}
