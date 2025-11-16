&lt;!-- GitHub README --&gt;
# 📋➡️📄 Copy → File (TXT / PDF) – Firefox Edition  
A zero-config **Firefox-only** browser extension that grabs whatever is on your clipboard and lets you download it instantly as `.txt` or `.pdf`.  
No servers, no tracking, no bloat—just two clicks and your text is a file.

---

## 🚀 Install from source (Firefox 109+)

### Step-by-step (even if you’ve never side-loaded an extension)

1. **Get the code**  
   - Click the green **“Code”** button above → **“Download ZIP”**  
   - OR use git:  
     ```bash
     git clone https://github.com/YOUR_USERNAME/copy-to-file.git
     cd copy-to-file
     ```

2. **Unzip** (if you downloaded the ZIP) and remember the folder location.

3. **Open Firefox Add-on Debugging**  
   - Address bar → type  
     ```
     about:debugging#/runtime/this-firefox
     ```
   - Click **“Load Temporary Add-on…”**

4. **Select the manifest**  
   - In the file picker, choose **any file inside the extension folder** (e.g. `manifest.json`)  
   - Firefox will validate and load the add-on immediately  
   - You’ll see the new tile and the 🪄 icon in your toolbar—done!

5. **Pin it** (recommended)  
   - Click the puzzle-piece icon → hit the 📌 pin next to “Copy → File”.

&gt; ⚠️ Temporary install lasts until you restart Firefox.  
&gt; For permanent install we’ll publish to AMO soon—star the repo to get notified!

---

## 🎯 Usage
1. Copy any text (Ctrl-C, Cmd-C, right-click → Copy, etc.)  
2. Click the extension icon  
3. Hit **“Load clipboard”** (or just start typing a custom name)  
4. Press **Download .txt** or **Download .pdf**  
   - PDF opens in a new print-tab so you can choose “Save to PDF” or send to a real printer.

---

## 🤝 Contribute – let’s make it better together

### 0. Prerequisites
- GitHub account (free)  
- Git installed on your machine (or use GitHub.dev web editor)  
- Firefox 109 or newer for testing

### 1. Fork & clone
```bash
# 1. Fork the repo on GitHub (click “Fork” button)
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/copy-to-file.git
cd copy-to-file
