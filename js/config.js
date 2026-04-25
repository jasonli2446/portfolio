// Mobile detection (static — evaluated once at load)
export const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;

// Room depth in CSS pixels
export const DEPTH = 300;
export const MOBILE_DEPTH = 400;

// Face tracking
export const EYE_DIST    = 5;
export const SMOOTH      = 0.15;
export const SMOOTH_Z    = 0.06;
export const SENS_X      = 1.5;
export const SENS_Y      = 2.5;
export const BASE_FACE_W = 0.15;

// Default perspective (px) — used when camera is off
export const BASE_PERSPECTIVE = 800;
// Tracking perspective (px) — used when camera is on (lower = more zoomed in)
export const TRACKING_PERSPECTIVE = 800;
