import { bilingualCategories } from './bilingual.js';
const female=new Set('bicicleta,moto,ambulancia,furgoneta,canoa,vaca,oveja,jirafa,tortuga,mariposa,abeja,leche,pasta,sopa,pizza,galleta,tarta,zanahoria,patata,manzana,pera,naranja,fresa,uva,sandía,cereza,piña,mano,oreja,nariz,boca,lengua,cabeza,pierna,casa,puerta,ventana,cama,silla,lámpara,bañera,ducha,escoba,cesta,llave,televisión,cuchara,camiseta,gorra,bufanda,mochila,mamá,niña,abuela,familia,hermana,amiga,médica,profesora,luna,estrella,nube,lluvia,nieve,flor,hoja,montaña,tierra,concha,excavadora,grúa,hormigonera,pala,pelota,muñeca'.split(','));
const pluralFemale=new Set(['botas','gafas','sandalias']);const pluralMale=new Set(['calcetines','zapatos','guantes','bloques']);
function article(word){return pluralFemale.has(word)?'las':pluralMale.has(word)?'los':female.has(word)?'la':'el';}
const actions=['Estoy corriendo.','Estoy caminando.','Tengo sueño.','Quiero comer.','Quiero beber.','Estoy saltando.','Estoy bailando.','Estoy cantando.','Quiero leer.','Quiero dibujar.','Quiero nadar.','Quiero jugar.','Estoy aplaudiendo.','¡Hola!','Quiero un abrazo.','Estoy riendo.','Estoy llorando.','Voy a lavarme.','Estoy escuchando.','Estoy mirando.'];
const actionZh=['我在跑步。','我在走路。','我困了。','我想吃东西。','我想喝东西。','我在跳。','我在跳舞。','我在唱歌。','我想读书。','我想画画。','我想游泳。','我想玩。','我在拍手。','你好！','我想要一个拥抱。','我在笑。','我在哭。','我要洗漱。','我在听。','我在看。'];
export const vocabulary=bilingualCategories.map(c=>({...c,words:c.words.map((w,i)=>{
 const label=['colores','acciones'].includes(c.id)?w.word:`${article(w.word)} ${w.word}`;
 let sentence=w.sentence, sentenceZh=w.sentenceZh;
 if(!sentence){if(c.id==='acciones'){sentence=actions[i];sentenceZh=actionZh[i];}else if(c.id==='colores'){sentence=`Es de color ${w.word}.`;sentenceZh=`它是${w.zh}的。`;}else{sentence=`Mira ${label}.`;sentenceZh=`看看${w.zh}。`;}}
 if(w.word==='coche'){sentence='El coche es rojo.';sentenceZh='小汽车是红色的。';}
 return {...w,label,sentence,sentenceZh,tip:w.tip||`指着图片说 ${label}，再读短句，等待孩子用词、手势或动作回应。`};
})}));
const construction=[['excavadora','挖掘机','La excavadora cava.','挖掘机在挖土。'],['grúa','起重机','La grúa levanta la carga.','起重机吊起货物。'],['camión volquete','自卸卡车','El camión lleva arena.','卡车运沙子。'],['hormigonera','混凝土搅拌车','La hormigonera gira.','搅拌车在转动。'],['bulldozer','推土机','El bulldozer empuja la tierra.','推土机推土。'],['rodillo','压路机','El rodillo alisa el suelo.','压路机压平地面。']].map(([word,zh,sentence,sentenceZh],i)=>({word,zh,label:`${article(word)} ${word}`,sentence,sentenceZh,picture:`/construction/${i+1}.svg`,tip:'和孩子模仿这辆工程车的动作，再说出它的名字。'}));
vocabulary.find(c=>c.id==='vehiculos').words.push(...construction);
vocabulary.push({id:'obras',name:'En las obras',zh:'工程车',icon:'🚜',color:'#fff0d6',words:construction});
vocabulary.push({id:'juguetes',name:'Juguetes',zh:'玩具',icon:'🧸',color:'#edeafa',words:[['oso de peluche','玩具熊','🧸'],['pelota','球','⚽'],['muñeca','娃娃','🪆'],['robot','机器人','🤖'],['bloques','积木','🧱'],['puzle','拼图','🧩'],['coche de juguete','玩具车','🚗'],['globo','气球','🎈']].map(([word,zh,picture])=>({word,zh,picture,label:`${article(word)} ${word}`,sentence:`Quiero ${article(word)} ${word}.`,sentenceZh:`我想要${zh}。`,tip:'把网站里的图片和家里的玩具对应起来，给孩子留出回应的时间。'}))});
export function getVocabularySelection(hash){const [id,raw]=hash.replace(/^#\/?/,'').split('/');const category=vocabulary.find(c=>c.id===id);if(!category)return null;return {category,index:Math.max(0,Math.min(Number.isInteger(Number(raw))?Number(raw):0,category.words.length-1))};}
