export function register() {
  if (!navigator.serviceWorker) { // Are SWs supported?
    return;
  }

  navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' })
    .then(registration => {
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed, but waiting');
        if (registration.waiting) {
          registration.waiting.postMessage({ action: 'skipWaiting' });
        }
      } else if (registration.active) {
        console.log('Service worker active');
      }

      registration.addEventListener('updatefound', () => { //This is fired whenever registration.installing gets a new worker
        console.log("SW update found", registration, navigator.serviceWorker.controller);
        if (registration.installing) {
          registration.installing.postMessage({ action: 'skipWaiting' });
        }
      });
    });
}