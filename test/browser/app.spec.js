import { test,expect } from '@playwright/test';
test('home, every category, complete navigation and local pictures',async({page})=>{
 await page.goto('./');
 await expect(page.locator('.category')).toHaveCount(10);
 await expect(page.locator('.vehicle-feature')).toContainText('Vehículos');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const routes=await page.locator('main a').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
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
