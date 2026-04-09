let protectionEnabled = true;

function updateStats() {
  chrome.storage.local.get(['stats', 'currentPersona', 'protectionEnabled'], (data) => {
    const stats = data.stats || { fingerprints: 0, sites: 0, canvas: 0, webgl: 0, audio: 0, font: 0 };
    
    document.getElementById('fingerprintAttempts').textContent = stats.fingerprints;
    document.getElementById('sitesVisited').textContent = stats.sites;
    document.getElementById('canvasCount').textContent = stats.canvas;
    document.getElementById('webglCount').textContent = stats.webgl;
    document.getElementById('audioCount').textContent = stats.audio;
    document.getElementById('fontCount').textContent = stats.font;
    
    if (data.currentPersona) {
      document.getElementById('personaSelect').value = data.currentPersona;
    }
    
    protectionEnabled = data.protectionEnabled !== false;
    updateProtectionUI();
  });
}

function updateProtectionUI() {
  const btn = document.getElementById('toggleProtection');
  const statusDot = document.querySelector('.dot');
  const statusText = document.querySelector('.status span:last-child');
  
  if (protectionEnabled) {
    btn.textContent = 'Disable Protection';
    btn.classList.remove('disabled');
    statusDot.classList.add('active');
    statusText.textContent = 'Active';
  } else {
    btn.textContent = 'Enable Protection';
    btn.classList.add('disabled');
    statusDot.classList.remove('active');
    statusText.textContent = 'Disabled';
  }
}

function getCurrentTabInfo() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      chrome.storage.local.get(['siteProfiles'], (data) => {
        const profiles = data.siteProfiles || {};
        const profile = profiles[url.hostname];
        
        if (profile) {
          document.getElementById('profileInfo').innerHTML = `
            <strong>${url.hostname}</strong><br>
            Attempts: ${profile.attempts || 0}<br>
            Last seen: ${profile.techniques ? profile.techniques.join(', ') : 'None'}
          `;
        } else {
          document.getElementById('profileInfo').textContent = `No tracking detected on ${url.hostname}`;
        }
      });
    }
  });
}

document.getElementById('personaSelect').addEventListener('change', (e) => {
  const persona = e.target.value;
  chrome.storage.local.set({ currentPersona: persona });
  chrome.runtime.sendMessage({ action: 'personaChanged', persona: persona });
});

document.getElementById('resetStats').addEventListener('click', () => {
  chrome.storage.local.set({
    stats: { fingerprints: 0, sites: 0, canvas: 0, webgl: 0, audio: 0, font: 0 },
    siteProfiles: {}
  });
  updateStats();
  getCurrentTabInfo();
});

document.getElementById('toggleProtection').addEventListener('click', () => {
  protectionEnabled = !protectionEnabled;
  chrome.storage.local.set({ protectionEnabled: protectionEnabled });
  chrome.runtime.sendMessage({ action: 'toggleProtection', enabled: protectionEnabled });
  updateProtectionUI();
});

updateStats();
getCurrentTabInfo();

setInterval(updateStats, 2000);