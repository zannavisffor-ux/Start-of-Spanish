import { readingList } from '../src/reading-list.js';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run=promisify(execFile);
await Promise.all(readingList.flatMap(b=>[['PDF',b.pdf],...(b.web?[['网页',b.web]]:[])].map(async([kind,url])=>{
 try {
  const {stdout}=await run('curl',['--location','--silent','--show-error','--max-time','25','--output','/dev/null','--write-out','%{http_code} %{content_type}',url]);
  const code=Number(stdout.split(' ')[0]);const ok=code>=200&&code<300&&(kind!=='PDF'||stdout.includes('application/pdf'));
  console.log(`::${ok?'notice':'warning'} title=Reading link::${b.title} ${kind}: ${stdout} ${url}`);
 }catch(e){console.log(`::warning title=Reading link::${b.title} ${kind}: connectivity check failed (${e.code}) ${url}`);}
})));
