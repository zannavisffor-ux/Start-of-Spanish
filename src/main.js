import './style.css';
import { imagePath } from './data.js';
import { vocabulary as categories, getVocabularySelection as getSelection } from './vocabulary.js';
import { shuffle } from './bilingual.js';
import { renderActivity } from './activities.js';
const categoryOrders = new Map();
let lastRenderedRoute='';
const app = document.querySelector('#app');
const speaker = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
const art = (picture,cls='') => picture.startsWith('/') ? `<img class="${cls}" src="${import.meta.env.BASE_URL}${picture.slice(1)}" alt="" draggable="false">` : picture.startsWith('#') ? `<span class="swatch ${cls}" style="background:${picture}"></span>` : `<img class="${cls}" src="${import.meta.env.BASE_URL}${imagePath(picture).slice(1)}" alt="" draggable="false">`;
let voiceList=[];
const synth=window.speechSynthesis;
function refreshVoices(){voiceList=synth?.getVoices() ?? [];}
refreshVoices();
synth?.addEventListener('voiceschanged',refreshVoices);
function stop(){synth?.cancel();}
function speak(word){
 const status=document.querySelector('#speech-status');
 if(!synth || !window.SpeechSynthesisUtterance){status.textContent='此浏览器不支持朗读，请使用 Safari 或 Chrome。';return;}
 stop();refreshVoices();
 const utterance=new SpeechSynthesisUtterance(word);
 utterance.lang='es-ES';utterance.rate=0.8;utterance.pitch=1;
 utterance.voice=voiceList.find(v=>v.lang.replace('_','-').toLowerCase()==='es-es') ?? voiceList.find(v=>/^es[-_]/i.test(v.lang)) ?? null;
 const card=document.querySelector('.word-card');
 utterance.onstart=()=>{card?.classList.add('speaking');status.textContent='正在朗读… · Escuchando…';};
 utterance.onend=()=>{card?.classList.remove('speaking');status.textContent='再听一次 · Otra vez';};
 utterance.onerror=e=>{card?.classList.remove('speaking');if(!['canceled','interrupted'].includes(e.error))status.textContent='朗读暂不可用，请检查设备的西班牙语语音设置。';};
 synth.speak(utterance);
}
function render(){
 stop();
 const previousRoute=lastRenderedRoute;lastRenderedRoute=location.hash;
 const [,route,id]=location.hash.replace(/^#/,'').split('/');
 if(route==='category'){
  const c=categories.find(c=>c.id===id);if(!c){location.hash='';return;}
  if(previousRoute!==location.hash || !categoryOrders.has(id)){const order=shuffle(c.words),previous=categoryOrders.get(id);if(previous&&order[0].word===previous[0].word)order.push(order.shift());categoryOrders.set(id,order);}
  app.innerHTML=`<div class="shell"><header class="header"><a class="home-button" href="#">⌂ 首页 · Inicio</a><h1 class="activity-title"><span lang="es">${c.name}</span> · ${c.zh}</h1></header><main class="activity category-menu"><div class="menu-illustration">${art(c.icon)}</div><div class="learning-modes"><a href="#/${id}/0" class="mode-card"><span>▣</span><strong>一张一张学</strong><small lang="es">Aprender con tarjetas</small></a><a href="#/gallery/${id}" class="mode-card"><span>▦</span><strong>选图听音</strong><small lang="es">Elige y escucha</small></a></div></main></div>`;return;
 }
 if(renderActivity(app,art,speak))return;const selection=getSelection(location.hash);
 if(!selection){
 app.innerHTML=`<div class="shell"><header class="header"><a class="brand" href="#" aria-label="首页"><span class="brand-sun">✳</span> Hola<span class="brand-dot">.</span></a><span class="header-note">我的西语小世界</span></header><main><div class="welcome"><span class="eyebrow">HOLA, PEQUEÑO EXPLORADOR</span><h1>小小世界，大大发现<span>✦</span></h1><p>点一点，听听西班牙语 · Toca y escucha</p></div><a class="vehicle-feature" href="#/category/vehiculos"><div class="feature-copy"><span class="feature-badge">一起出发吧！ · ¡Vamos!</span><h2 lang="es">Vehículos</h2><p>车辆</p><span class="go"><span class="button-copy">开始探索<small lang="es">Explorar</small></span><span>→</span></span></div><div class="vehicle-scene"><span class="scene-cloud cloud-one"></span><span class="scene-cloud cloud-two"></span>${art('🚗','hero-car')}${art('🚌','hero-bus')}<span class="road"></span></div></a><div class="quick-grid"><a href="#/scenes" class="extra-link">🖐️ 生活场景 <span lang="es">Cada día</span></a><a href="#/game" class="extra-link">🔎 听一听，找一找 <span lang="es">Escucha y busca</span></a><a href="#/today" class="extra-link">☀️ 今天一起说 <span lang="es">Hablamos juntos</span></a></div><div class="section-heading"><h2>今天想认识什么？</h2><span lang="es">¿Qué descubrimos hoy?</span></div><div class="category-grid">${categories.slice(1).map(c=>`<a class="category" href="#/category/${c.id}" style="--tile:${c.color}"><div class="category-art">${art(c.icon)}</div><h3 lang="es">${c.name}</h3><p>${c.zh}</p><span class="category-arrow">↗</span></a>`).join('')}</div><div class="extras-grid"><a href="#/reading" class="extra-link">📚 西班牙语绘本 <span lang="es">Libros en español</span></a><a href="#/books" class="extra-link">📖 小绘本 <span lang="es">Cuentos</span></a></div></main><footer>每一次好奇，都是新的开始 <span>✦</span></footer></div>`;

 return;
 }
 const {index}=selection;const category=categories.find(c=>c.id===selection.category.id);const entry=(categoryOrders.get(category.id)||category.words)[index];
 app.innerHTML=`<div class="shell learning" style="--tile:${category.color}"><header class="header"><a class="home-button" href="#/category/${category.id}" aria-label="返回分类"><span>←</span> 返回 · Volver</a><span class="lesson-category" lang="es">${category.name} <small>${category.zh}</small></span><span class="counter">${index+1} / ${category.words.length}</span></header><main class="lesson"><div class="progress" aria-label="学习进度"><span style="width:${(index+1)/category.words.length*100}%"></span></div><button class="word-card" aria-label="朗读 ${entry.label}" lang="es">${art(entry.picture,'word-art')}<span class="word">${entry.label}</span><span class="word-zh" lang="zh-CN">${entry.zh}</span><span class="listen">${speaker}<span>听一听 · Escuchar</span></span></button>${entry.sentence?`<section class="sentence-panel"><p lang="es">${entry.sentence}</p><p class="sentence-zh">${entry.sentenceZh}</p><button class="primary" id="sentence-listen">♫ 听句子 · Frase</button></section>`:''}<p id="speech-status" class="speech-status" role="status">点图片听发音 · Toca y escucha</p><nav class="word-navigation" aria-label="词卡导航"><button id="previous" ${index===0?'disabled':''} aria-label="上一张">← <span>上一张<small lang="es">Anterior</small></span></button><span class="nav-decoration">✦</span><button id="next" ${index===category.words.length-1?'disabled':''} aria-label="下一张"><span>下一张<small lang="es">Siguiente</small></span> →</button></nav>${index===category.words.length-1?'<a class="finish" href="#">看完啦！再选一个分类 ↗</a>':''}</main></div>`;
 document.querySelector('#sentence-listen')?.addEventListener('click',()=>speak(entry.sentence));
 document.querySelector('.word-card').addEventListener('click',()=>speak(entry.label));
 document.querySelector('#previous').addEventListener('click',()=>navigate(-1));
 document.querySelector('#next').addEventListener('click',()=>navigate(1));
}
function navigate(delta){const s=getSelection(location.hash);if(!s)return;const i=s.index+delta;if(i>=0&&i<s.category.words.length)location.hash=`/${s.category.id}/${i}`;}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
window.addEventListener('keydown',e=>{if(e.target.closest('button,a,input,select,summary'))return;if(e.key==='ArrowLeft')navigate(-1);if(e.key==='ArrowRight')navigate(1);});
window.addEventListener('pagehide',stop);
render();
