
// background.js
const SHORTS_HOSTS = new Set(["www.youtube.com", "m.youtube.com", "youtube.com", "youtu.be"]);
const SHORTS_PATH_PREFIX = "/shorts/";

function isShortsUrl(url) {
  try { const u = new URL(url); return SHORTS_HOSTS.has(u.hostname) && u.pathname.startsWith(SHORTS_PATH_PREFIX); }
  catch { return false; }
}

function toWatchUrl(shortsUrl) {
  try {
    const u = new URL(shortsUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("shorts");
    const id = idx >= 0 ? parts[idx + 1] : null;
    if (id) { const watch = new URL("https://www.youtube.com/watch"); watch.searchParams.set("v", id); return watch.toString(); }
  } catch {}
  return shortsUrl;
}

async function shouldBlock() {
  const { disabledUntil = 0 } = await chrome.storage.sync.get({ disabledUntil: 0 });
  return Date.now() >= disabledUntil;
}

async function redirectTab(tabId, url) {
  const redirectUrl = chrome.runtime.getURL(`blocked.html?u=${encodeURIComponent(url)}`);
  try { await chrome.tabs.update(tabId, { url: redirectUrl }); } catch {}
}

function onNav(details) {
  if (details.frameId !== 0) return;
  const url = details.url;
  if (!isShortsUrl(url)) return;
  (async () => { if (await shouldBlock()) await redirectTab(details.tabId, url); })();
}

chrome.webNavigation.onBeforeNavigate.addListener(onNav, {
  url: [{ hostSuffix: "youtube.com", pathPrefix: "/shorts/" }, { hostEquals: "youtu.be", pathPrefix: "/shorts/" }]
});
chrome.webNavigation.onHistoryStateUpdated.addListener(onNav, {
  url: [{ hostSuffix: "youtube.com", pathPrefix: "/shorts/" }]
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg?.type === "OPEN_WATCH" && msg?.originalUrl && sender?.tab?.id) {
      const watchUrl = toWatchUrl(msg.originalUrl);
      try { await chrome.tabs.update(sender.tab.id, { url: watchUrl }); } catch {}
      sendResponse({ ok: true }); return;
    }
    if (msg?.type === "OPEN_ANYWAY" && msg?.originalUrl && sender?.tab?.id) {
      try { await chrome.tabs.update(sender.tab.id, { url: msg.originalUrl }); } catch {}
      sendResponse({ ok: true }); return;
    }
    if (msg?.type === "SNOOZE" && typeof msg.minutes === "number") {
      const until = Date.now() + Math.max(1, msg.minutes) * 60 * 1000;
      await chrome.storage.sync.set({ disabledUntil: until });
      sendResponse({ ok: true, disabledUntil: until }); return;
    }
    if (msg?.type === "CLEAR_SNOOZE") {
      await chrome.storage.sync.set({ disabledUntil: 0 });
      sendResponse({ ok: true }); return;
    }
  })();
  return true;
});
