
// content.js
(function() {
  if (window !== window.top) return;
  function isShortsPath(p){ return typeof p === "string" && p.startsWith("/shorts/"); }
  function blocked(original) { return chrome.runtime.getURL(`blocked.html?u=${encodeURIComponent(original || location.href)}`); }

  async function enabled() {
    const { disabledUntil = 0 } = await chrome.storage.sync.get({ disabledUntil: 0 });
    return Date.now() >= disabledUntil;
  }

  async function guard() {
    try {
      if (!isShortsPath(location.pathname)) return;
      if (!(await enabled())) return;
      location.replace(blocked(location.href));
    } catch {}
  }

  guard();
  const _ps = history.pushState, _rs = history.replaceState;
  history.pushState = function(...a){ const r=_ps.apply(this,a); guard(); return r; };
  history.replaceState = function(...a){ const r=_rs.apply(this,a); guard(); return r; };
  window.addEventListener("popstate", guard);
  let last = location.href;
  setInterval(()=>{ if (location.href!==last){ last=location.href; guard(); } }, 700);
})();
