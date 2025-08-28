# Shorts Shield — Chrome/Arc Extension

Blocks `youtube.com/shorts/...` and redirects to a customizable focus page.

## How it works
- A background service worker listens for navigations to `youtube.com/shorts/*` and redirects the tab to `blocked.html` inside the extension.
- The focus page shows your custom headline, message, and a list of useful links.
- Config can come from:
  1) `config.json` bundled in the extension (good for open-source defaults), and
  2) `chrome.storage.sync` edited via the Options page (good for personal tweaks).
- Extras: quick buttons to open the video as a normal watch page, open anyway, or snooze the blocker for a while.

## Install (Arc/Chrome)
1. Download and unzip the archive.
2. In Arc/Chrome: open `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the unzipped `shorts-shield` folder.
5. Visit any `https://www.youtube.com/shorts/...` link to see it in action.

## Customize
- Open the extension's **Options** page to set:
  - Headline, subtitle, message
  - JSON array of links: `[{"title": "...", "url": "https://..."}, ...]`
- Or edit `config.json` in the folder before loading unpacked.

## Notes
- No external requests, no tracking.
- Works in Arc because it uses Chromium's extension APIs.