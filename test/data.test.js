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
