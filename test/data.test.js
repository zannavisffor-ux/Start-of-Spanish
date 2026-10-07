import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
import { categories,imagePath,getSelection } from '../src/data.js';
test('all eleven categories contain 15–25 words with local illustrations',()=>{
 assert.equal(categories.length,11);assert.equal(new Set(categories.map(c=>c.id)).size,11);
 for(const c of categories){assert.ok(c.words.length>=15&&c.words.length<=25);assert.equal(new Set(c.words.map(w=>w.word)).size,c.words.length);for(const p of [c.icon,...c.words.map(w=>w.picture)]){if(p.startsWith('#'))continue;const path='public'+imagePath(p);assert.ok(existsSync(path),path);assert.match(readFileSync(path,'utf8'),/<svg/);}}
 console.log(`${categories.reduce((n,c)=>n+c.words.length,0)} words validated`);
});
test('navigation handles bookmarks and malformed routes',()=>{
 assert.equal(getSelection('#'),null);assert.equal(getSelection('#/unknown/0'),null);
 assert.equal(getSelection('#/vehiculos/19').index,19);
 assert.equal(getSelection('#/vehiculos/999').index,19);
 assert.equal(getSelection('#/vehiculos/-1').index,0);
 assert.equal(getSelection('#/vehiculos/no').index,0);
});

import { bilingualCategories, createRound, shuffle } from '../src/bilingual.js';
import { books } from '../src/books.js';
test('all translations and vehicle sentences are complete',()=>{for(const c of bilingualCategories)for(const w of c.words){assert.ok(w.zh);if(c.id==='vehiculos'){assert.ok(w.sentence);assert.ok(w.sentenceZh);assert.ok(w.tip);}}});
test('books have local art and attribution',()=>{assert.equal(books.length,2);for(const b of books){assert.ok(b.credits);assert.ok(b.license);assert.ok(existsSync('public/'+b.cover));for(const p of b.pages){assert.ok(p.es);assert.ok(p.zh);assert.ok(existsSync('public/'+p.image));}}});
test('game rounds have four unique options, exactly one answer and no immediate repeated target',()=>{const words=bilingualCategories[0].words;let previous=null;for(let i=0;i<100;i++){const r=createRound(words,previous);assert.equal(r.options.length,4);assert.equal(new Set(r.options.map(w=>w.word)).size,4);assert.equal(r.options.filter(w=>w.word===r.target.word).length,1);assert.notEqual(r.target.word,previous);previous=r.target.word;}assert.deepEqual([...shuffle(words)].sort((a,b)=>a.word.localeCompare(b.word)),[...words].sort((a,b)=>a.word.localeCompare(b.word)));});

import { vocabulary } from '../src/vocabulary.js';
import { scenes,themes } from '../src/life.js';
test('expanded vocabulary has articles, bilingual sentences and local pictures',()=>{for(const c of vocabulary)for(const w of c.words){assert.ok(w.label);assert.ok(w.sentence);assert.ok(w.sentenceZh);assert.ok(w.zh);if(!['colores','acciones'].includes(c.id))assert.match(w.label,/^(el|la|los|las) /);if(w.picture.startsWith('/'))assert.ok(existsSync('public'+w.picture));else if(!w.picture.startsWith('#'))assert.ok(existsSync('public'+imagePath(w.picture)));}assert.equal(vocabulary[0].words.length,26);});
test('daily scenes are usable and two/three picture rounds have exactly one answer',()=>{assert.equal(scenes.length,7);for(const s of scenes){assert.ok(s.phrases.length>=4&&s.phrases.length<=6);for(const p of s.phrases){assert.ok(p.es);assert.ok(p.zh);assert.ok(['adult','child'].includes(p.role));assert.ok(existsSync('public'+imagePath(p.picture)));}}assert.ok(themes.every(t=>t.words.length>=3&&t.words.length<=5&&t.activity));for(const count of [2,3]){const r=createRound(vocabulary[0].words,null,Math.random,count);assert.equal(r.options.length,count);assert.equal(r.options.filter(w=>w.word===r.target.word).length,1);}});

test('Spanish articles and varied bilingual example sentences are accurate for known cases',()=>{
 const get=(id,word)=>vocabulary.find(c=>c.id===id).words.find(w=>w.word===word);
 for(const [id,word,label] of [['comida','carne','la carne'],['comida','agua','el agua'],['ropa','gafas','las gafas'],['ropa','pijama','el pijama'],['casa','lámpara','la lámpara'],['cuerpo','mano','la mano']])assert.equal(get(id,word).label,label);
 assert.equal(get('comida','carne').sentence,'Quiero un poco de carne.');assert.equal(get('comida','carne').sentenceZh,'我想吃一点肉。');
 for(const c of vocabulary)for(const w of c.words){assert.ok(w.sentenceZh);assert.ok(!/^Mira\b/.test(w.sentence),w.word);}
 assert.equal(get('animales','perro').sentence,'El perro corre.');assert.equal(get('ropa','abrigo').sentence,'Ponte el abrigo.');
});
