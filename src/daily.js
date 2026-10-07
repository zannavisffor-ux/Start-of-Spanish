import { scenes,themes,dayNumber } from './life.js';
import { shuffle } from './bilingual.js';
import { vocabulary } from './vocabulary.js';
let themeIndex=dayNumber()%themes.length,step=0;
export function renderLife(app,art,speak){
 const [,route,id,raw]=location.hash.replace(/^#/,'').split('/');
 if(!['scenes','scene','today'].includes(route))return false;
 const header=title=>`<div class="shell"><header class="header"><a class="home-button" href="#">⌂ 首页</a><h1 class="activity-title">${title}</h1></header><main class="activity life-activity">`;
 const status='<p id="speech-status" class="speech-status" role="status">♫ 点一下，听一听</p>';
 if(route==='scenes'){
 app.innerHTML=header('生活场景 · Cada día')+`<div class="scene-grid">${scenes.map(s=>`<a href="#/scene/${s.id}/0" class="scene-link">${art(s.icon)}<h2 lang="es">${s.title}</h2><small>${s.zh}</small></a>`).join('')}</div></main></div>`;return true;
 }
 if(route==='scene'){
 const scene=scenes.find(s=>s.id===id);if(!scene){location.hash='/scenes';return true;}
 const i=Math.max(0,Math.min(Number(raw)||0,scene.phrases.length-1)),p=scene.phrases[i];
 app.innerHTML=header(scene.title)+`<a class="back-link" href="#/scenes">← 所有场景</a><button class="word-card phrase-card" aria-label="朗读 ${p.es}">${art(p.picture,'word-art')}<span class="word" lang="es">${p.es}</span><span class="listen">♫ 听一听</span></button>${status}<nav class="word-navigation"><button id="previous" ${i===0?'disabled':''}>← 上一句</button><span>${i+1} / ${scene.phrases.length}</span><button id="next" ${i===scene.phrases.length-1?'disabled':''}>下一句 →</button></nav><details class="mimi"><summary>家长区 · Mimi</summary><p>${scene.zh} · ${p.role==='child'?'孩子可以说':'大人可以说'}</p><p>${p.es} · ${p.zh}</p><p>在真实场景中说一句，配合动作，等待孩子回应，不要求完整跟读。</p></details></main></div>`;
 document.querySelector('.word-card').onclick=()=>speak(p.es);
 document.querySelector('#previous').onclick=()=>location.hash=`/scene/${id}/${i-1}`;
 document.querySelector('#next').onclick=()=>location.hash=`/scene/${id}/${i+1}`;return true;
 }
 const theme=themes[themeIndex];
 const words=theme.words.map(word=>vocabulary.flatMap(c=>c.words).find(w=>w.word===word)).filter(Boolean);
 const prompt=step<words.length?words[step]:step===words.length?{picture:theme.picture,label:theme.sentence}:null;
 const target=words.find(w=>w.picture===theme.picture)||words[0];
 const choices=shuffle([target,words.find(w=>w.picture!==target.picture)]);
 app.innerHTML=header('今天一起说')+`<p class="daily-tag" lang="es">${theme.title}</p>${prompt?`<button class="word-card phrase-card" id="daily-speak">${art(prompt.picture,'word-art')}<span class="word" lang="es">${prompt.label}</span><span class="listen">♫ 听一听</span></button>${status}<button class="primary daily-next" id="daily-next">${step<words.length-1?'下一张 →':step===words.length-1?'一起说一句 →':'找一找 →'}</button>`:step===words.length+1?`<button class="primary daily-next" id="daily-speak">♫ 听一听，找一找</button>${status}<div class="game-grid">${choices.map((w,i)=>`<button class="game-option" data-choice="${i}" aria-label="选择图片 ${i+1}">${art(w.picture)}</button>`).join('')}</div><p class="game-feedback" id="daily-feedback" role="status"></p>`:`<div class="screen-break">${art(theme.picture)}<h2>一起去玩吧！</h2><p lang="es">¡Vamos a jugar!</p><p>接下来和 Mimi 离开屏幕，找实物一起说。</p></div><button class="primary daily-next" id="repeat-day">再玩一次 ↻</button>`}<details class="mimi daily-parent"><summary>家长区 · 今天的陪玩任务</summary><label>换个主题 <select id="daily-theme">${themes.map((t,i)=>`<option value="${i}" ${i===themeIndex?'selected':''}>${t.zh}</option>`).join('')}</select></label><p>复习：${words.map(w=>`${w.label}（${w.zh}）`).join('、')}</p><p>今天一起说：${theme.sentence} · ${theme.sentenceZh}</p><p>找图话术：${theme.instruction} · ${theme.instructionZh}</p><p>${theme.activity}</p><p>三位孩子可以轮流：Es tu turno（轮到你了），Ahora te toca a ti（现在轮到你）。接受手势和单词，不催促、不比较。</p><button id="parent-repeat" class="secondary">重复今天的任务</button></details></main></div>`;
 document.querySelector('#daily-theme').onchange=e=>{themeIndex=Number(e.target.value);step=0;renderLife(app,art,speak);};
 document.querySelector('#parent-repeat').onclick=()=>{step=0;renderLife(app,art,speak);};
 document.querySelector('#daily-speak')?.addEventListener('click',()=>speak(prompt?prompt.label:theme.instruction));
 document.querySelector('#daily-next')?.addEventListener('click',()=>{step++;renderLife(app,art,speak);window.scrollTo(0,0);});
 document.querySelector('#repeat-day')?.addEventListener('click',()=>{step=0;renderLife(app,art,speak);});
 document.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{if(choices[Number(el.dataset.choice)].word===target.word){step++;renderLife(app,art,speak);}else document.querySelector('#daily-feedback').textContent='再找一找 · ¡Prueba otra vez!';});
 return true;
}
