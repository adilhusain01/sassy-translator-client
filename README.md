# Sassy

A Chrome extension (Manifest V3) that rewrites any selected text with attitude, using Google Gemini. Select text on a page, right-click, choose **Make it Sassy**, and the result appears in an overlay on the page.

Built with React 19, Vite 7 and Tailwind CSS 4. See `GUMROAD.md` for the product description and `INSTRUCTIONS.txt` for the end-user guide.

## Getting started

### Prerequisites

- Node.js 20+ and npm
- Google Chrome (or another Chromium browser)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Install

```bash
git clone https://github.com/adilhusain01/sassy-translator-client.git
cd sassy-translator-client
npm install
```

### Configuration

You enter the Gemini API key in the extension popup, and it's saved in `chrome.storage.sync`. No `.env` is needed to build. `.env.example` is only there for parity with the local setup.

### Build and load the extension

```bash
npm run build
```

This writes the unpacked extension to `dist/` (`manifest.json`, `popup.js`, `content.js`, `service-worker.js`, icons and `src/popup/popup.html`).

1. Open `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select the `dist/` folder
4. Open the Sassy popup, paste your Gemini API key, pick a sass level and save

After you change the code, run `npm run build` again and click the reload icon on the extension card.

### Other scripts

```bash
npm run dev       # Vite dev server (popup UI only; the extension APIs need the built version)
npm run lint
```

## Project structure

```
public/manifest.json         MV3 manifest (copied into dist/)
public/icons/                extension icons
src/popup/                   popup UI (React)
src/content/content.js       content script, renders the overlay
src/background/service-worker.js  context menu + Gemini calls
src/utils/api.js             Gemini API helper
docs/product/                packaged release (dist build, logo, license, instructions) as sold on Gumroad
```
