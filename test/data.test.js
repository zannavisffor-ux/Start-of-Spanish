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
