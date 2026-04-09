let stats = { fingerprints: 0, sites: 0, canvas: 0, webgl: 0, audio: 0, font: 0 };
let siteProfiles = {};
let visitedSites = new Set();

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    stats: stats,
    currentPersona: 'random',
    protectionEnabled: true,
    siteProfiles: {}
  });
});

chrome.storage.local.get(['stats', 'siteProfiles'], (data) => {
  if (data.stats) stats = data.stats;
  if (data.siteProfiles) siteProfiles = data.siteProfiles;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fingerprintDetected') {
    stats.fingerprints++;
    
    if (message.technique === 'canvas') stats.canvas++;
    else if (message.technique === 'webgl') stats.webgl++;
    else if (message.technique === 'audio') stats.audio++;
    else if (message.technique === 'font') stats.font++;
    
    if (sender.tab && sender.tab.url) {
      const url = new URL(sender.tab.url);
      const hostname = url.hostname;
      
      if (!visitedSites.has(hostname)) {
        visitedSites.add(hostname);
        stats.sites++;
      }
      
      if (!siteProfiles[hostname]) {
        siteProfiles[hostname] = { attempts: 0, techniques: [] };
      }
      siteProfiles[hostname].attempts++;
      if (!siteProfiles[hostname].techniques.includes(message.technique)) {
        siteProfiles[hostname].techniques.push(message.technique);
      }
    }
    
    chrome.storage.local.set({ stats: stats, siteProfiles: siteProfiles });
  } else if (message.action === 'personaChanged') {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.reload(tab.id);
      });
    });
  } else if (message.action === 'toggleProtection') {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.reload(tab.id);
      });
    });
  }
  
  return true;
});