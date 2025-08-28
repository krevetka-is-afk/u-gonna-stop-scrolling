
import { loadConfig } from './lib/config.js';

function qp(name){ const u=new URL(location.href); return u.searchParams.get(name); }

function renderLinks(el, links){
  el.innerHTML = '';
  if (!Array.isArray(links) || links.length===0){
    el.innerHTML = '<p class="muted">Список пуст. Добавьте ссылки в настройках.</p>'; return;
  }
  const ul = document.createElement('ul');
  links.forEach(item=>{
    const li=document.createElement('li');
    const a=document.createElement('a'); a.href=item.url; a.target="_blank"; a.rel="noopener"; a.textContent=item.title||item.url;
    li.appendChild(a); ul.appendChild(li);
  });
  el.appendChild(ul);
}

async function init(){
  const originalUrl = qp('u') || '';
  const cfg = await loadConfig(true);
  document.getElementById('headline').textContent = cfg.headline || 'Ради твоего блага';
  document.getElementById('sub').textContent = cfg.subtitle || 'Эта короткая вертикалка — не то, зачем ты сюда пришёл.';
  document.getElementById('message').textContent = cfg.message || 'Сохраняй фокус и возвращайся к важному.';
  renderLinks(document.getElementById('links'), cfg.links);

  document.getElementById('openWatch').addEventListener('click', ()=> chrome.runtime.sendMessage({ type:'OPEN_WATCH', originalUrl }));
  document.getElementById('openAnyway').addEventListener('click', ()=> chrome.runtime.sendMessage({ type:'OPEN_ANYWAY', originalUrl }));
  document.getElementById('snoozeBtn').addEventListener('click', async ()=>{
    const minutes = parseInt(document.getElementById('snoozeMins').value || '15', 10);
    await chrome.runtime.sendMessage({ type:'SNOOZE', minutes }); window.close();
  });
  document.getElementById('clearSnoozeBtn').addEventListener('click', async ()=>{
    await chrome.runtime.sendMessage({ type:'CLEAR_SNOOZE' });
  });
}
init();
