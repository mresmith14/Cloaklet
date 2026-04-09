const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data.type && event.data.type === 'FINGERPRINT_DETECTED') {
    chrome.runtime.sendMessage({
      action: 'fingerprintDetected',
      technique: event.data.technique
    });
  }
});