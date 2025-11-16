// background.js
// Minimal background service worker for MV3.
// Currently not required, but needed by the manifest.
// Keep this file in the extension root.

self.addEventListener('install', (event) => {
  // no-op
});
// background.js (Manifest V2)
console.log("Background service running (MV2)...");
