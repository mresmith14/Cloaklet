(function() {
  'use strict';
  
  const personas = {
    random: () => ({
      userAgent: randomUserAgent(),
      platform: randomPlatform(),
      hardwareConcurrency: Math.floor(Math.random() * 8) + 2,
      deviceMemory: [2, 4, 8][Math.floor(Math.random() * 3)],
      maxTouchPoints: Math.random() > 0.5 ? 0 : 5
    }),
    mobile: () => ({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      platform: 'iPhone',
      hardwareConcurrency: 6,
      deviceMemory: 4,
      maxTouchPoints: 5
    }),
    laptop: () => ({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
      platform: 'Win32',
      hardwareConcurrency: 2,
      deviceMemory: 4,
      maxTouchPoints: 0
    }),
    privacy: () => ({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0',
      platform: 'Win32',
      hardwareConcurrency: 4,
      deviceMemory: 8,
      maxTouchPoints: 0
    }),
    desktop: () => ({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'Win32',
      hardwareConcurrency: 8,
      deviceMemory: 8,
      maxTouchPoints: 0
    })
  };
  
  function randomUserAgent() {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }
  
  function randomPlatform() {
    const platforms = ['Win32', 'MacIntel', 'Linux x86_64'];
    return platforms[Math.floor(Math.random() * platforms.length)];
  }
  
  function getPersonaConfig() {
    const stored = localStorage.getItem('shadowProfilePersona') || 'random';
    return personas[stored] ? personas[stored]() : personas.random();
  }
  
  chrome.storage.local.get(['currentPersona', 'protectionEnabled'], (data) => {
    const personaType = data.currentPersona || 'random';
    const enabled = data.protectionEnabled !== false;
    
    if (!enabled) return;
    
    localStorage.setItem('shadowProfilePersona', personaType);
    const config = getPersonaConfig();
    
    Object.defineProperty(navigator, 'userAgent', {
      get: () => config.userAgent
    });
    
    Object.defineProperty(navigator, 'platform', {
      get: () => config.platform
    });
    
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => config.hardwareConcurrency
    });
    
    if (navigator.deviceMemory !== undefined) {
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => config.deviceMemory
      });
    }
    
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => config.maxTouchPoints
    });
  });
  
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function() {
    window.postMessage({ type: 'FINGERPRINT_DETECTED', technique: 'canvas' }, '*');
    const noise = Math.random() * 0.001;
    const ctx = this.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, this.width, this.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = Math.min(255, imageData.data[i] + noise * 255);
      }
      ctx.putImageData(imageData, 0, 0);
    }
    return originalToDataURL.apply(this, arguments);
  };
  
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type) {
    if (type === 'webgl' || type === 'webgl2') {
      window.postMessage({ type: 'FINGERPRINT_DETECTED', technique: 'webgl' }, '*');
    }
    return originalGetContext.apply(this, arguments);
  };
  
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    const OriginalAudioContext = AudioContext;
    window.AudioContext = function() {
      window.postMessage({ type: 'FINGERPRINT_DETECTED', technique: 'audio' }, '*');
      return new OriginalAudioContext();
    };
  }
  
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function() {
    const style = originalGetComputedStyle.apply(this, arguments);
    const fontFamily = style.fontFamily;
    if (fontFamily && fontFamily.length > 50) {
      window.postMessage({ type: 'FINGERPRINT_DETECTED', technique: 'font' }, '*');
    }
    return style;
  };
})();