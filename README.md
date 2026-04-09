# Cloaklet 🕶️

**Dynamic browser fingerprint protection with privacy personas**

Cloaklet is a Chrome extension that helps protect your online identity by detecting and disrupting browser fingerprinting techniques. Instead of simply blocking trackers, Cloaklet subtly alters the signals websites use to identify you, making your browser harder to track across the web.

---

## ✨ Features

### 🧬 Fingerprint Mutation

Cloaklet modifies fingerprinting surfaces such as:

* Canvas
* WebGL
* AudioContext
* Navigator properties

Each website sees a slightly different, consistent version of your browser profile, reducing cross-site tracking.

---

### 🕵️ Tracking Detection

Cloaklet monitors pages for fingerprinting behavior and alerts you when:

* Advanced fingerprinting techniques are detected
* Multiple tracking methods are used together
* Suspicious scripts attempt to profile your device

---

### 🪞 Shadow Profile Dashboard

See how trackers might perceive you:

* Estimated fingerprint uniqueness
* Stability across sessions
* Detection logs per website

---

### 🎭 Privacy Persona Mode

Choose how you appear online:

* Mobile device
* Older hardware profile
* Generic privacy browser

Each persona creates a consistent identity per site while remaining different across sites.

---

### ⚙️ Smart Noise Injection (Optional)

Cloaklet can introduce subtle variations in:

* Timing patterns
* Interaction signals

This helps reduce the reliability of behavioral tracking.

---

## 🔒 Privacy First

* No data collection
* No external servers
* No accounts
* All processing happens locally in your browser

---

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mresmith14/Cloaklet.git
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode**

4. Click **Load unpacked** and select the project folder

---

## 🧪 Tech Overview

* Chrome Extension (Manifest V3)
* Content scripts for API interception
* Background service worker for coordination
* Local storage via `chrome.storage.local`

---

## ⚠️ Notes

* Some websites (banking, authentication, CAPTCHA-heavy pages) may behave differently with fingerprint mutation enabled.
* Persona consistency is maintained per domain to reduce breakage.

---

## 🛣️ Roadmap

* [ ] Per-site persona customization
* [ ] Advanced fingerprint simulation engine
* [ ] Exportable tracking reports
* [ ] UI improvements for dashboard insights

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📜 License

MIT License
