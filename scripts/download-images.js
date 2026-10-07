import { categories, imagePath } from '../src/data.js';
import { mkdir, access } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const run = promisify(execFile);
await mkdir('public/images',{recursive:true});
const icons = [...new Set(categories.flatMap(c=>[c.icon,...c.words.map(w=>w.picture)]).filter(p=>!p.startsWith('#')))];
let cursor=0;
await Promise.all(Array.from({length:8},async()=>{while(cursor<icons.length){const icon=icons[cursor++];const path='public'+imagePath(icon);try{await access(path);continue;}catch{}
await run('curl',['--fail','--silent','--show-error','--retry','2','--max-time','30','https://raw.githubusercontent.com/jdecked/twemoji/v16.0.1/assets/svg/'+path.split('/').pop(),'-o',path]);}}));
console.log(`Verified ${icons.length} local illustration assets.`);
