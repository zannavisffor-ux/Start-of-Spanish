import { test,expect } from '@playwright/test';
test('home, every category, complete navigation and local pictures',async({page})=>{
 await page.goto('./');
 await expect(page.locator('.category')).toHaveCount(10);
 await expect(page.locator('.vehicle-feature')).toContainText('Vehículos');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const routes=await page.locator('.vehicle-feature,.category').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
 for(const route of routes){await page.goto('./'+route);await expect(page.locator('.word-card')).toBeVisible();expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.goto('./#/vehiculos/0');await expect(page.locator('.word')).toHaveText('coche');await expect(page.locator('#previous')).toBeDisabled();
 await page.locator('#next').click();await expect(page.locator('.word')).toHaveText('autobús');await page.keyboard.press('ArrowLeft');await expect(page.locator('.word')).toHaveText('coche');
 await page.goto('./#/vehiculos/19');await expect(page.locator('#next')).toBeDisabled();await page.locator('.finish').click();await expect(page.locator('.vehicle-feature')).toBeVisible();
});
test('whole card requests Spanish speech and unsupported devices get feedback',async({page})=>{
 await page.addInitScript(()=>{window.testSpeech=[];window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'es-ES',name:'Spanish'}],addEventListener(){},cancel(){},speak(u){window.testSpeech.push({text:u.text,lang:u.lang,voice:u.voice.lang});u.onstart();u.onend();}}});});
 await page.goto('./#/vehiculos/0');await page.locator('.word-card').click();
 expect(await page.evaluate(()=>window.testSpeech)).toEqual([{text:'coche',lang:'es-ES',voice:'es-ES'}]);
 await page.locator('#next').click();await page.locator('.listen').click();expect((await page.evaluate(()=>window.testSpeech)).at(-1).text).toBe('autobús');
});

test('unsupported speech shows a helpful message',async({page})=>{await page.addInitScript(()=>Object.defineProperty(window,'speechSynthesis',{value:undefined}));await page.goto('./#/vehiculos/0');await page.locator('.word-card').click();await expect(page.locator('#speech-status')).toContainText('不支持朗读');});

test('bilingual sentences, separate speech, gallery and shuffled category rounds',async({page})=>{
 await page.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){},speak(u){window.spoken.push(u.text);}}});});
 await page.goto('./#/vehiculos/0');await expect(page.locator('.word-zh')).toHaveText('小汽车');await expect(page.locator('.mimi')).not.toHaveAttribute('open','');await page.locator('#sentence-listen').click();await page.locator('.word-card').click();expect(await page.evaluate(()=>window.spoken)).toEqual(['El coche va.','coche']);
 await page.locator('.gallery-link').click();await expect(page.locator('.sound-tile')).toHaveCount(20);await page.locator('.sound-tile').nth(1).click();expect((await page.evaluate(()=>window.spoken)).at(-1)).toBe('autobús');
 await page.locator('.home-button').click();await page.locator('.vehicle-feature').click();const first=await page.locator('.word').textContent();const seen=[];for(let i=0;i<20;i++){seen.push(await page.locator('.word').textContent());if(i<19){await page.locator('#next').click();await expect(page.locator('.counter')).toHaveText(`${i+2} / 20`);}}
 expect(new Set(seen).size).toBe(20);await page.locator('.home-button').click();await page.locator('.vehicle-feature').click();await expect(page.locator('.word')).not.toHaveText(first);
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

test('game repeat speech, retry, success, next round and Mimi mode',async({page})=>{
 await page.addInitScript(()=>{window.spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],addEventListener(){},cancel(){},speak(u){window.spoken.push(u.text);}}});});
 await page.goto('./#/game');await expect(page.locator('.game-option')).toHaveCount(4);await page.locator('#question-listen').click();const target=(await page.evaluate(()=>window.spoken)).at(-1);await page.locator('#question-listen').click();expect((await page.evaluate(()=>window.spoken)).at(-1)).toBe(target);
 const imgs=await page.locator('.game-option img').evaluateAll(els=>els.map(e=>e.getAttribute('src')));expect(new Set(imgs).size).toBe(4);
 const data=await import('../../src/bilingual.js');const {imagePath}=await import('../../src/data.js');const path=imagePath(data.bilingualCategories[0].words.find(w=>w.word===target).picture);const correct=imgs.findIndex(src=>src.endsWith(path));expect(correct).toBeGreaterThanOrEqual(0);
 await page.locator('.game-option').nth((correct+1)%4).click();await expect(page.locator('#game-feedback')).toContainText('再找一找');await expect(page.locator('#next-round')).toBeHidden();await page.locator('.game-option').nth(correct).click();await expect(page.locator('#game-feedback')).toContainText('真棒');await page.locator('#next-round').click();await page.locator('#question-listen').click();expect((await page.evaluate(()=>window.spoken)).at(-1)).not.toBe(target);
 await page.locator('[data-mode="mimi"]').click();await expect(page.locator('#question-listen')).toHaveCount(0);await expect(page.locator('.mimi')).not.toHaveAttribute('open','');await page.locator('.mimi summary').click();await expect(page.locator('.mimi p').first()).toContainText('¿Dónde está');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Spanish reading list has ordered books, recommendations and safe external links',async({page})=>{
 await page.goto('./');await page.locator('a[href="#/reading"]').click();await expect(page.locator('.reading-card')).toHaveCount(4);await expect(page.locator('.reading-card h2')).toHaveText(['¿Dónde está Osito?','¡Un día muy ajetreado!','Un hermoso día','Soy maravilloso']);await expect(page.locator('.reading-badge')).toHaveCount(2);
 await expect(page.locator('.reading-card').nth(0)).toContainText('推荐先读');await expect(page.locator('.reading-card').nth(1)).toContainText('推荐先读');await expect(page.locator('.reading-buttons a')).toHaveCount(6);
 for(const link of await page.locator('.reading-buttons a').all()){await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','noopener noreferrer');expect(new URL(await link.getAttribute('href')).protocol).toBe('https:');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('.reading-card').first()).toContainText('CDC');await expect(page.locator('.reading-card').nth(1)).toContainText('Ririro／Book Dash');
});
