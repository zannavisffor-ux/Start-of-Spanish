import { bilingualCategories, createRound } from './bilingual.js';
import { books } from './books.js';
import { readingList } from './reading-list.js';
const base=import.meta.env.BASE_URL;
let round=null,mode='listen',solved=false;
const escape = s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function renderActivity(app,art,speak){
 const [,route,id,raw]=location.hash.replace(/^#/,'').split('/');
 if(!['books','reading','book','game','gallery'].includes(route))return false;
 const header=title=>`<div class="shell"><header class="header"><a class="home-button" href="#">⌂ 首页</a><h1 class="activity-title">${title}</h1></header><main class="activity">`;
 const status='<p id="speech-status" class="speech-status" role="status">点喇叭，听西班牙语</p>';
 if(route==='reading'){
 app.innerHTML=header('西班牙语绘本')+`<p class="reading-intro">和 Mimi 一起读 · Cuentos para compartir</p><div class="reading-grid">${readingList.map(b=>`<article class="reading-card"><div class="reading-icon">${art(b.icon)}</div>${b.recommended?'<span class="reading-badge">推荐先读</span>':''}<h2 lang="es">${b.title}</h2><h3>${b.zh}</h3><p>${b.description}</p><small>来源：${b.source}</small><div class="reading-buttons"><a class="primary" href="${b.pdf}" target="_blank" rel="noopener noreferrer" aria-label="阅读 PDF：${b.zh}（新标签页）">阅读 PDF ↗</a>${b.web?`<a class="secondary" href="${b.web}" target="_blank" rel="noopener noreferrer" aria-label="在线阅读：${b.zh}（新标签页）">在线阅读 ↗</a>`:''}</div></article>`).join('')}</div><p class="reading-note">阅读链接会在新标签页打开。</p><a class="gallery-link" href="#/books">也来读一读本站互动小绘本 →</a></main></div>`;return true;
 }
 if(route==='books'){
 app.innerHTML=header('小绘本 · Cuentos')+`<a class="gallery-link" href="#/reading">西班牙语绘本 · 阅读 PDF →</a><div class="book-grid">${books.map(b=>`<a class="book-cover" href="#/book/${b.id}/0"><img src="${base}${b.cover}" alt="${b.zh}"><h2 lang="es">${b.title}</h2><p>${b.zh}</p><small>${b.pages.length} 页 · 中西双语</small></a>`).join('')}</div></main></div>`;return true;
 }
 if(route==='book'){
 const b=books.find(b=>b.id===id);if(!b){location.hash='/books';return true;}
 const i=Math.max(0,Math.min(Number(raw)||0,b.pages.length-1)),p=b.pages[i];
 app.innerHTML=header(b.zh)+`<a class="back-link" href="#/books">← 所有绘本</a><div class="story-page"><img src="${base}${p.image}" alt="${p.zh}"><h2 lang="es">${p.es}</h2><p>${p.zh}</p><button class="primary" id="story-listen">♫ 听故事</button></div>${status}<nav class="word-navigation"><button id="previous" ${i===0?'disabled':''}>← 上一页</button><span>${i+1} / ${b.pages.length}</span><button id="next" ${i===b.pages.length-1?'disabled':''}>下一页 →</button></nav>${i===b.pages.length-1?'<a class="finish" href="#/books">读完啦！再选一本 ↗</a>':''}<details class="mimi"><summary>作者与授权 · Créditos</summary><p>${b.credits}</p>${b.source?`<a href="${b.source}" target="_blank" rel="noopener">原作品来源</a> · `:''}<a href="${b.license}" target="_blank" rel="noopener">CC BY 4.0</a></details></main></div>`;
 document.querySelector('#story-listen').onclick=()=>speak(p.es);
 document.querySelector('#previous').onclick=()=>location.hash=`/book/${id}/${i-1}`;
 document.querySelector('#next').onclick=()=>location.hash=`/book/${id}/${i+1}`;return true;
 }
 if(route==='gallery'){
 const c=bilingualCategories.find(c=>c.id===id);if(!c){location.hash='';return true;}
 app.innerHTML=header(`${c.zh} · 选图听音`)+`<a class="back-link" href="#/${c.id}/0">← 一张一张学</a>${status}<div class="sound-grid">${c.words.map((w,i)=>`<button class="sound-tile" data-index="${i}" aria-label="朗读 ${escape(w.word)}"><span class="tile-picture">${art(w.picture)}</span><strong lang="es">${w.word}</strong><small>${w.zh}</small></button>`).join('')}</div></main></div>`;
 document.querySelectorAll('.sound-tile').forEach(el=>el.onclick=()=>speak(c.words[Number(el.dataset.index)].word));return true;
 }
 if(route==='game'){
 const words=bilingualCategories[0].words;
 if(!round)round=createRound(words);
 const question=`¿Dónde está ${round.target.word==='moto'||round.target.word==='bicicleta'||round.target.word==='ambulancia'||round.target.word==='furgoneta'||round.target.word==='canoa'?'la':'el'} ${round.target.word}?`;
 app.innerHTML=header('找一找 · Busca')+`<div class="mode-controls"><button data-mode="listen" aria-pressed="${mode==='listen'}">♫ 听音找图</button><button data-mode="mimi" aria-pressed="${mode==='mimi'}">Mimi 出题</button></div><div class="game-prompt"><h2>${mode==='listen'?'听一听，找一找':'听 Mimi 说，找一找'}</h2>${mode==='listen'?'<button id="question-listen" class="primary">♫ 再听一次</button>':''}<details class="mimi"><summary>Mimi 看这里</summary><p lang="es">${question}</p><p>${round.target.zh}在哪里？</p></details></div>${status}<div class="game-grid">${round.options.map((w,i)=>`<button class="game-option" data-index="${i}" aria-label="选择图片 ${i+1}" ${solved?'disabled':''}>${art(w.picture)}</button>`).join('')}</div><p id="game-feedback" class="game-feedback" role="status">${solved?`¡Muy bien! 真棒！ ${round.target.word} · ${round.target.zh}`:''}</p><button id="next-round" class="primary" ${solved?'':'hidden'}>下一题 →</button></main></div>`;
 document.querySelectorAll('[data-mode]').forEach(el=>el.onclick=()=>{mode=el.dataset.mode;renderActivity(app,art,speak);});
 const listen=document.querySelector('#question-listen');if(listen)listen.onclick=()=>speak(round.target.word);
 document.querySelectorAll('.game-option').forEach(el=>el.onclick=()=>{
 if(round.options[Number(el.dataset.index)].word===round.target.word){solved=true;renderActivity(app,art,speak);speak('¡Muy bien!');}
 else {document.querySelector('#game-feedback').textContent='再找一找，你可以的 · ¡Prueba otra vez!';el.classList.add('try-again');}
 });
 document.querySelector('#next-round').onclick=()=>{round=createRound(words,round.target.word);solved=false;renderActivity(app,art,speak);};return true;
 }
}
