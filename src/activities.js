import { createRound } from './bilingual.js';
import { vocabulary as bilingualCategories } from './vocabulary.js';
import { scenes } from './life.js';
import { renderLife } from './daily.js';
import { books } from './books.js';
import { readingList } from './reading-list.js';
const base=import.meta.env.BASE_URL;
let round=null,mode='listen',solved=false,optionCount=2,gameCategory='vehiculos',gameType='words';
const escape = s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function renderActivity(app,art,speak){
 if(renderLife(app,art,speak))return true;
 const [,route,id,raw]=location.hash.replace(/^#/,'').split('/');
 if(!['books','reading','book','game','gallery'].includes(route))return false;
 const header=title=>`<div class="shell"><header class="header"><a class="home-button" href="#">⌂ 首页</a><h1 class="activity-title">${title}</h1></header><main class="activity">`;
 const status='<p id="speech-status" class="speech-status" role="status">点喇叭，听西班牙语</p>';
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
 app.innerHTML=header(`${c.zh} · 选图听音`)+`<a class="back-link" href="#/${c.id}/0">← 一张一张学</a>${status}<div class="sound-grid">${c.words.map((w,i)=>`<button class="sound-tile" data-index="${i}" aria-label="朗读 ${escape(w.label)}"><span class="tile-picture">${art(w.picture)}</span><strong lang="es">${w.label}</strong></button>`).join('')}</div></main></div>`;
 document.querySelectorAll('.sound-tile').forEach(el=>el.onclick=()=>speak(c.words[Number(el.dataset.index)].label));return true;
 }
 if(route==='game'){
 const c=bilingualCategories.find(c=>c.id===gameCategory)||bilingualCategories[0];
 let words=c.words;
 if(gameType==='phrases')words=scenes.flatMap(s=>s.phrases).filter((p,i,all)=>all.findIndex(w=>w.picture===p.picture)===i).map(p=>({...p,word:p.es,label:p.es}));
 if(!round)round=createRound(words,null,Math.random,optionCount);
 const question=gameType==='words'?`Busca ${round.target.label}.`:round.target.label;
 app.innerHTML=header('听一听，找一找')+`<div class="game-prompt"><button id="question-listen" class="primary">♫ 听一听 · 重播</button></div>${status}<div class="game-grid">${round.options.map((w,i)=>`<button class="game-option" data-index="${i}" aria-label="选择图片 ${i+1}" ${solved?'disabled':''}>${art(w.picture)}</button>`).join('')}</div><p id="game-feedback" class="game-feedback" role="status">${solved?'¡Muy bien! 真棒！':''}</p><button id="next-round" class="primary" ${solved?'':'hidden'}>下一题 →</button><details class="mimi game-settings"><summary>家长区 · 设置与出题</summary><label>练习内容 <select id="game-type"><option value="words" ${gameType==='words'?'selected':''}>词汇</option><option value="phrases" ${gameType==='phrases'?'selected':''}>生活短句</option></select></label><label>分类 <select id="game-category">${bilingualCategories.map(c=>`<option value="${c.id}" ${gameCategory===c.id?'selected':''}>${c.zh}</option>`).join('')}</select></label><label>图片数量 <select id="game-count"><option value="2" ${optionCount===2?'selected':''}>两张 · 入门</option><option value="3" ${optionCount===3?'selected':''}>三张 · 进阶</option></select></label><p lang="es">${question}</p><p>${round.target.zh}</p><p>大人可以读上面的西语，让孩子找图。短句图片是场景提示，请结合动作帮助理解。</p></details></main></div>`;
 document.querySelector('#question-listen').onclick=()=>speak(round.target.label);
 document.querySelectorAll('.game-option').forEach(el=>el.onclick=()=>{
 if(round.options[Number(el.dataset.index)].word===round.target.word){solved=true;renderActivity(app,art,speak);speak('¡Muy bien!');}
 else {document.querySelector('#game-feedback').textContent='再找一找，你可以的 · ¡Prueba otra vez!';el.classList.add('try-again');}
 });
 document.querySelector('#next-round').onclick=()=>{round=createRound(words,round.target.word,Math.random,optionCount);solved=false;renderActivity(app,art,speak);};
 for(const key of ['type','category','count'])document.querySelector(`#game-${key}`).onchange=e=>{if(key==='type')gameType=e.target.value;if(key==='category')gameCategory=e.target.value;if(key==='count')optionCount=Number(e.target.value);round=null;solved=false;renderActivity(app,art,speak);};
 return true;
 }
}
