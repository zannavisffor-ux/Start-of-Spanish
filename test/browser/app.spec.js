import { test,expect } from '@playwright/test';
test('home, every category, complete navigation and local pictures',async({page})=>{
 await page.goto('./');
 await expect(page.locator('.category')).toHaveCount(12);
 await expect(page.locator('.vehicle-feature')).toContainText('Vehículos');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const routes=await page.locator('.vehicle-feature,.category').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
 for(const route of routes){await page.goto('./'+route);await page.locator('.mode-card').first().click();await expect(page.locator('.word-card')).toBeVisible();await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.goto('./#/vehiculos/0');await page.reload();await expect(page.locator('.word')).toHaveText('el coche');await expect(page.locator('#previous')).toBeDisabled();
 await page.locator('#next').click();await expect(page.locator('.word')).toHaveText('el autobús');await page.keyboard.press('ArrowLeft');await expect(page.locator('.word')).toHaveText('el coche');
 await page.goto('./#/vehiculos/25');await expect(page.locator('#next')).toBeDisabled();await page.locator('.finish').click();await expect(page.locator('.vehicle-feature')).toBeVisible();
});
test('whole card requests Spanish speech and unsupported devices get feedback',async({page})=>{
 await page.addInitScript(()=>{window.testSpeech=[];window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'es-ES',name:'Spanish'}],addEventListener(){},cancel(){},speak(u){window.testSpeech.push({text:u.text,lang:u.lang,voice:u.voice.lang});u.onstart();u.onend();}}});});
 await page.goto('./#/vehiculos/0');await page.locator('.word-card').click();
 expect(await page.evaluate(()=>window.testSpeech)).toEqual([{text:'el coche',lang:'es-ES',voice:'es-ES'}]);
 await page.locator('#next').click();await page.locator('.listen').click();expect((await page.evaluate(()=>window.testSpeech)).at(-1).text).toBe('el autobús');
});

test('unsupported speech shows a helpful message',async({page})=>{await page.addInitScript(()=>Object.defineProperty(window,'speechSynthesis',{value:undefined}));await page.goto('./#/vehiculos/0');await page.locator('.word-card').click();await expect(page.locator('#speech-status')).toContainText('不支持朗读');});

test('bilingual sentences, separate speech, gallery and shuffled category rounds',async({page})=>{
 await page.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){},speak(u){window.spoken.push(u.text);}}});});
 await page.goto('./#/vehiculos/0');await expect(page.locator('.word-zh')).toHaveText('小汽车');await expect(page.locator('.sentence-zh')).toHaveText('小汽车是红色的。');await expect(page.locator('.mimi')).toHaveCount(0);await expect(page.locator('.gallery-link')).toHaveCount(0);await page.locator('#sentence-listen').click();await page.locator('.word-card').click();expect(await page.evaluate(()=>window.spoken)).toEqual(['El coche es rojo.','el coche']);
 await page.locator('.home-button').click();await page.locator('a[href="#/gallery/vehiculos"]').click();await expect(page.locator('.sound-tile')).toHaveCount(26);await page.locator('.sound-tile').nth(1).click();expect((await page.evaluate(()=>window.spoken)).at(-1)).toBe('el autobús');
 await page.goto('./');await page.locator('.vehicle-feature').click();await page.locator('.mode-card').first().click();const first=await page.locator('.word').textContent();const seen=[];for(let i=0;i<26;i++){seen.push(await page.locator('.word').textContent());if(i<25){await page.locator('#next').click();await expect(page.locator('.counter')).toHaveText(`${i+2} / 26`);}}
 expect(new Set(seen).size).toBe(26);await page.goto('./');await page.locator('.vehicle-feature').click();await page.locator('.mode-card').first().click();await expect(page.locator('.word')).not.toHaveText(first);
});

test('both books can be read to completion with attribution and no overflow',async({page})=>{
 await page.goto('./#/books');await expect(page.locator('.book-cover')).toHaveCount(2);
 const links=await page.locator('.book-cover').evaluateAll(els=>els.map(e=>e.getAttribute('href')));
 for(const link of links){
  const count=link.includes('/doing/')?8:6;
  await page.goto('./'+link);await expect(page.locator('#previous')).toBeDisabled();
  for(let i=0;i<count;i++){
   await expect(page.locator('.word-navigation > span')).toHaveText(`${i+1} / ${count}`);
   await expect.poll(()=>page.locator('.story-page img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(i<count-1){await page.locator('#next').click();await expect(page.locator('.word-navigation > span')).toHaveText(`${i+2} / ${count}`);}
  }
  await expect(page.locator('#next')).toBeDisabled();await expect(page.locator('.finish')).toBeVisible();
  await page.locator('.mimi summary').click();await expect(page.locator('.mimi')).toContainText('CC BY 4.0');
 }
});

test('game repeats audio, allows retry, supports two/three pictures and all categories',async({page})=>{
 await page.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){},speak(u){window.spoken.push(u.text);}}});});
 await page.goto('./#/game/vehiculos/2');await expect(page.locator('.game-option')).toHaveCount(2);
 await page.locator('a[href="#/game/vehiculos/3"]').click();
 await expect(page.locator('.game-option')).toHaveCount(3);await page.locator('#question-listen').click();const target=(await page.evaluate(()=>window.spoken)).at(-1);
 await page.locator('#question-listen').click();expect((await page.evaluate(()=>window.spoken)).at(-1)).toBe(target);
 const imgs=await page.locator('.game-option img').evaluateAll(els=>els.map(e=>e.getAttribute('src')));expect(new Set(imgs).size).toBe(3);
 const {vocabulary}=await import('../../src/vocabulary.js');const {imagePath}=await import('../../src/data.js');const w=vocabulary[0].words.find(w=>w.label===target);const path=w.picture.startsWith('/')?w.picture:imagePath(w.picture);const correct=imgs.findIndex(src=>src.endsWith(path));expect(correct).toBeGreaterThanOrEqual(0);
 await page.locator('.game-option').nth((correct+1)%3).click();await expect(page.locator('#game-feedback')).toContainText('再试一次');await expect(page.locator('#next-round')).toBeHidden();
 await page.locator('.game-option').nth(correct).click();await expect(page.locator('#game-feedback')).toContainText('真棒');await page.locator('#next-round').click();await page.locator('#question-listen').click();expect((await page.evaluate(()=>window.spoken)).at(-1)).not.toBe(target);
 await page.goto('./#/game/animales/3');await expect(page.locator('.game-option')).toHaveCount(3);await page.goto('./#/game/frases/3');await expect(page.locator('.game-option')).toHaveCount(3);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Spanish reading list has ordered books, recommendations and safe external links',async({page})=>{
 await page.goto('./');await page.locator('a[href="#/reading"]').click();await expect(page.locator('.reading-card')).toHaveCount(4);await expect(page.locator('.reading-card h2')).toHaveText(['¿Dónde está Osito?','¡Un día muy ajetreado!','Un hermoso día','Soy maravilloso']);await expect(page.locator('.reading-badge')).toHaveCount(2);
 await expect(page.locator('.reading-card').nth(0)).toContainText('推荐先读');await expect(page.locator('.reading-card').nth(1)).toContainText('推荐先读');await expect(page.locator('.reading-buttons a')).toHaveCount(6);
 for(const link of await page.locator('.reading-buttons a').all()){await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','noopener noreferrer');expect(new URL(await link.getAttribute('href')).protocol).toBe('https:');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('.reading-card').first()).toContainText('CDC');await expect(page.locator('.reading-card').nth(1)).toContainText('Ririro／Book Dash');
});

test('life scenes provide separated parent explanations and daily activities can repeat',async({page})=>{
 await page.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){},speak(u){window.spoken.push(u.text);}}});});
 await page.goto('./#/scenes');await expect(page.locator('.scene-link')).toHaveCount(8);
 await page.locator('a[href="#/scene/comer/0"]').click();await page.locator('.word-card').click();expect((await page.evaluate(()=>window.spoken)).at(-1)).toBe('Quiero agua.');await expect(page.locator('.word-zh')).toHaveText('我想喝水。');await expect(page.locator('.mimi')).toHaveCount(0);await page.locator('#next').click();await expect(page.locator('.word')).toHaveText('Quiero más.');
 await page.goto('./#/today/themes');await page.locator('a[href="#/today/0"]').click();
 await expect(page.locator('.word')).toHaveText('el coche');
 for(let i=0;i<4;i++){await page.locator('#daily-next').click();await expect(page.locator('.word')).toHaveText(['el autobús','el camión','la bicicleta','Quiero el coche.'][i]);}
 await page.locator('#daily-next').click();await expect(page.locator('.game-option')).toHaveCount(2);
 const options=await page.locator('.game-option img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));const correct=options.findIndex(s=>s.endsWith('/1f697.svg'));await page.locator('.game-option').nth(correct).click();await expect(page.locator('.screen-break')).toContainText('关掉屏幕');
 await page.locator('#repeat-day').click();await expect(page.locator('.word')).toHaveText('el coche');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('greetings are bilingual and every phrase is spoken in Spanish',async({page})=>{
 await page.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){},speak(u){window.spoken.push(u.text);}}});});
 const {scenes}=await import('../../src/life.js');const greetings=scenes.find(s=>s.id==='saludos');
 await page.goto('./#/scenes');await page.locator('a[href="#/scene/saludos/0"]').click();await expect(page.locator('#previous')).toBeDisabled();
 for(let i=0;i<greetings.phrases.length;i++){
  const p=greetings.phrases[i];await expect(page.locator('.word')).toHaveText(p.es);await expect(page.locator('.word-zh')).toHaveText(p.zh);
  await page.locator('.word-card').click();expect((await page.evaluate(()=>window.spoken)).at(-1)).toBe(p.es);
  if(i<greetings.phrases.length-1){await page.locator('#next').click();await expect(page.locator('.word-navigation > span')).toHaveText(`${i+2} / 11`);}
 }
 await expect(page.locator('#next')).toBeDisabled();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
