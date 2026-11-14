EVA AI — Android-installable PWA prototype

WHAT THIS IS
A browser-based interactive 3D character demo. It can be hosted as a PWA and added to an Android Home Screen from Chrome.

WHAT WORKS
- 3D placeholder character rendered with Three.js
- Text commands and buttons: idle, wave, walk, turn, sit, stand
- Responsive mobile UI
- Basic service worker cache

WHAT DOES NOT WORK YET
- No Gemini or other AI brain
- No microphone / speech recognition
- No spoken voice output
- No real human-grade photorealistic model
- No full skeletal animation; current movements are simple demo poses
- Three.js is loaded from a CDN, so the 3D engine needs internet access

HOW TO RUN
1. Extract this ZIP.
2. Host the contents on an HTTPS static host (for example GitHub Pages or another static web host).
3. Open the HTTPS site in Chrome on Android.
4. Chrome menu (⋮) > Add to Home screen / Install app.

IMPORTANT
Opening index.html directly from the file manager is not enough for PWA installation. Service workers and installability require HTTPS or localhost.
