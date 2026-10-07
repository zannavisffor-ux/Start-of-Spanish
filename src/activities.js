import { createRound } from './bilingual.js';
import { vocabulary as bilingualCategories } from './vocabulary.js';
import { scenes } from './life.js';
import { renderLife } from './daily.js';
import { books } from './books.js';
import { readingList } from './reading-list.js';
const base=import.meta.env.BASE_URL;
let round=null,solved=false,lastGameRoute='';
const escape = s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function renderActivity(app,art,speak){
 if(renderLife(app,art,speak))return true;
 const [,route,id,raw]=location.hash.replace(/^#/,'').split('/');
 if(!['books','reading','book','game','gallery'].includes(route))return false;
 const header=title=>`<div class="shell"><header class="header"><a class="home-button" href="#">⌂ 首页 · Inicio</a><h1 class="activity-title">${title}</h1></header><main class="activity">`;
 const status='<p id="speech-status" class="speech-status" role="status">点一下，听一听 · Toca y escucha</p>';
 if(route==='reading'){
 app.innerHTML=header('西班牙语绘本')+`<p class="reading-intro">和 Mimi 一起读 · Cuentos para compartir</p><div class="reading-grid">${readingList.map(b=>`<article class="reading-card"><div class="reading-icon">${art(b.icon)}</div>${b.recommended?'<span class="reading-badge">推荐先读</span>':''}<h2 lang="es">${b.title}</h2><h3>${b.zh}</h3><p>${b.description}</p><small>来源：${b.source}</small><div class="reading-buttons">${b.unavailable?'<span class="unavailable-pdf">原 PDF 暂不可用</span>':`<a class="primary" href="${b.pdf}" target="_blank" rel="noopener noreferrer" aria-label="阅读 PDF：${b.zh}（新标签页）">阅读 PDF ↗</a>`}${b.sourceURL?`<a class="secondary" href="${b.sourceURL}" target="_blank" rel="noopener noreferrer">查看 CDC 来源 ↗</a>`:''}${b.web?`<a class="secondary" href="${b.web}" target="_blank" rel="noopener noreferrer" aria-label="在线阅读：${b.zh}（新标签页）">在线阅读 ↗</a>`:''}</div></article>`).join('')}</div><p class="reading-note">阅读链接会在新标签页打开。</p><a class="gallery-link" href="#/books">也来读一读本站互动小绘本 →</a></main></div>`;return true;
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
 app.innerHTML=header(`${c.name} · ${c.zh}`)+`<a class="back-link" href="#/category/${c.id}">← 返回分类 · Volver</a>${status}<div class="sound-grid">${c.words.map((w,i)=>`<button class="sound-tile" data-index="${i}" aria-label="朗读 ${escape(w.label)}"><span class="tile-picture">${art(w.picture)}</span><strong lang="es">${w.label}</strong><small>${w.zh}</small></button>`).join('')}</div></main></div>`;
 document.querySelectorAll('.sound-tile').forEach(el=>el.onclick=()=>speak(c.words[Number(el.dataset.index)].label));return true;
 }
 if(route==='game'){
 if(!id){
  lastGameRoute='';
  app.innerHTML=header('听一听，找一找 · Escucha y busca')+`<div class="scene-grid">${bilingualCategories.map(c=>`<a class="scene-link" href="#/game/${c.id}/2">${art(c.icon)}<h2 lang="es">${c.name}</h2><small>${c.zh}</small></a>`).join('')}<a class="scene-link" href="#/game/frases/2">${art('🖐️')}<h2 lang="es">Frases</h2><small>生活短句</small></a></div></main></div>`;return true;
 }
 const optionCount=raw==='3'?3:2;
 const c=bilingualCategories.find(c=>c.id===id);
 if(!c && id!=='frases'){location.hash='/game';return true;}
 let words=c?.words;
 if(id==='frases')words=scenes.flatMap(s=>s.phrases).filter((p,i,all)=>all.findIndex(w=>w.picture===p.picture)===i).map(p=>({...p,word:p.es,label:p.es}));
 if(!round||lastGameRoute!==location.hash){round=createRound(words,null,Math.random,optionCount);solved=false;lastGameRoute=location.hash;}
 app.innerHTML=header(`${c?c.name+' · '+c.zh:'Frases · 生活短句'}`)+`<a class="back-link" href="#/game">← 返回游戏 · Volver</a><div class="picture-levels"><a href="#/game/${id}/2" aria-current="${optionCount===2?'page':'false'}">两张图 · Dos</a><a href="#/game/${id}/3" aria-current="${optionCount===3?'page':'false'}">三张图 · Tres</a></div><div class="game-prompt"><button id="question-listen" class="primary">♫ 重听 · Escuchar</button></div>${status}<div class="game-grid">${round.options.map((w,i)=>`<button class="game-option" data-index="${i}" aria-label="选择图片 ${i+1}" ${solved?'disabled':''}>${art(w.picture)}</button>`).join('')}</div><p id="game-feedback" class="game-feedback" role="status">${solved?`¡Muy bien! 真棒！<br><span lang="es">${round.target.label}</span> · ${round.target.zh}`:''}</p><button id="next-round" class="primary" ${solved?'':'hidden'}>下一题 · Siguiente →</button></main></div>`;
 document.querySelector('#question-listen').onclick=()=>speak(round.target.label);
 document.querySelectorAll('.game-option').forEach(el=>el.onclick=()=>{
 if(round.options[Number(el.dataset.index)].word===round.target.word){solved=true;renderActivity(app,art,speak);speak('¡Muy bien!');}
 else {document.querySelector('#game-feedback').textContent='再试一次 · ¡Prueba otra vez!';el.classList.add('try-again');}
 });
 document.querySelector('#next-round').onclick=()=>{round=createRound(words,round.target.word,Math.random,optionCount);solved=false;renderActivity(app,art,speak);};
 return true;
 }
}
