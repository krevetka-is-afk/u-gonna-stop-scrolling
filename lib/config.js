
export const DEFAULTS = {
  headline: "Ради твоего блага",
  subtitle: "Эта короткая вертикалка — не то, зачем ты сюда пришёл.",
  message: "Сохраняй фокус и возвращайся к важному.",
  links: [
    { "title": "Курсовая — план работ", "url": "https://example.com/plan" },
    { "title": "Лекции по Python (плейлист)", "url": "https://www.youtube.com/playlist?list=PLXXXX" },
    { "title": "Документация Chrome Extensions", "url": "https://developer.chrome.com/docs/extensions" }
  ]
};

export async function loadConfig(preferStored=false){
  const stored = await chrome.storage.sync.get(['headline','subtitle','message','links']);
  const hasStored = Object.values(stored).some(v => v != null && v !== "");
  if (preferStored && hasStored) return { ...DEFAULTS, ...stored };
  try {
    const res = await fetch(chrome.runtime.getURL('config.json'));
    if (res.ok) {
      const json = await res.json();
      return { ...DEFAULTS, ...json, ...(hasStored ? stored : {}) };
    }
  } catch {}
  return { ...DEFAULTS, ...(hasStored ? stored : {}) };
}

export async function saveConfig(cfg){
  await chrome.storage.sync.set({ headline: cfg.headline, subtitle: cfg.subtitle, message: cfg.message, links: cfg.links });
}
