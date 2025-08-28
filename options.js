
import { loadConfig, DEFAULTS, saveConfig } from './lib/config.js';
const $ = (s)=>document.querySelector(s);
const pretty = (o)=>{ try{return JSON.stringify(o,null,2);}catch{return "[]";} };

async function init(){
  const cfg = await loadConfig(true);
  $('#headline').value = cfg.headline || '';
  $('#subtitle').value = cfg.subtitle || '';
  $('#message').value = cfg.message || '';
  $('#links').value = pretty(cfg.links || []);

  $('#form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    let links = [];
    try { links = JSON.parse($('#links').value || "[]"); if (!Array.isArray(links)) throw new Error("Links must be an array"); }
    catch(err){ alert("Ошибка JSON: " + err.message); return; }
    await saveConfig({ headline: $('#headline').value.trim(), subtitle: $('#subtitle').value.trim(), message: $('#message').value.trim(), links });
    alert("Сохранено");
  });

  $('#reset').addEventListener('click', async ()=>{
    await chrome.storage.sync.clear();
    const fresh = await loadConfig(false);
    $('#headline').value = fresh.headline || '';
    $('#subtitle').value = fresh.subtitle || '';
    $('#message').value = fresh.message || '';
    $('#links').value = pretty(fresh.links || []);
  });

  $('#export').addEventListener('click', async ()=>{
    const toExport = await loadConfig(true);
    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='shorts-shield-config.json'; a.click(); URL.revokeObjectURL(url);
  });
}
init();
