import { categories } from './data.js';
const translations = [
'小汽车,公交车,卡车,火车,自行车,摩托车,飞机,轮船,直升机,救护车,消防车,警车,出租车,拖拉机,火箭,滑板车,面包车,帆船,独木舟,缆车',
'狗,猫,兔子,熊,熊猫,狮子,老虎,奶牛,猪,马,绵羊,猴子,大象,长颈鹿,鸭子,小鸡,鱼,乌龟,蝴蝶,蜜蜂',
'面包,牛奶,鸡蛋,奶酪,米饭,意大利面,汤,披萨,冰淇淋,饼干,蛋糕,水,胡萝卜,土豆,玉米,番茄,西兰花,黄瓜,肉,鱼肉',
'苹果,梨,香蕉,橙子,柠檬,草莓,葡萄,西瓜,甜瓜,桃子,樱桃,菠萝,猕猴桃,芒果,椰子,蓝莓',
'手,脚,眼睛,耳朵,鼻子,嘴巴,舌头,牙齿,头,手臂,腿,心脏,拇指,手指,头发',
'房子,门,窗户,床,沙发,椅子,灯,浴缸,淋浴,马桶,镜子,扫帚,肥皂,篮子,钥匙,时钟,电视,电话,勺子,盘子',
'短袖上衣,裤子,连衣裙,外套,袜子,鞋子,靴子,鸭舌帽,帽子,围巾,手套,背包,眼镜,泳衣,睡衣,凉鞋',
'红色,蓝色,黄色,绿色,橙色,粉色,紫色,白色,黑色,灰色,棕色,米色,青绿色,淡紫色,金色',
'跑步,走路,睡觉,吃东西,喝东西,跳跃,跳舞,唱歌,读书,画画,游泳,玩耍,拍手,打招呼,拥抱,笑,哭,洗漱,听,看',
'妈妈,爸爸,宝宝,女孩,男孩,奶奶或外婆,爷爷或外公,家人,姐妹,兄弟,女性朋友,男性朋友,女医生,消防员,警察,女老师',
'太阳,月亮,星星,云,雨,雪,彩虹,树,花,叶子,山,海,火,石头,贝壳,森林,火山,地球'
];
const sentences = [
['El coche va.','小汽车开动了。'],['El autobús es grande.','公交车很大。'],['Mira el camión.','看这辆卡车。'],['El tren va por la vía.','火车沿着轨道行驶。'],['Voy en bicicleta.','我骑自行车。'],['Mira la moto.','看这辆摩托车。'],['El avión vuela.','飞机飞起来了。'],['El barco va por el mar.','轮船在海上航行。'],['El helicóptero vuela.','直升机飞起来了。'],['Viene una ambulancia.','一辆救护车来了。'],['Mira el camión de bomberos.','看这辆消防车。'],['Viene un coche de policía.','一辆警车来了。'],['Vamos en taxi.','我们坐出租车吧。'],['El tractor va despacio.','拖拉机慢慢地开。'],['El cohete sube.','火箭升起来了。'],['Voy en patinete.','我滑滑板车。'],['Mira la furgoneta.','看这辆面包车。'],['El velero tiene una vela.','帆船有一面帆。'],['La canoa va por el río.','独木舟在河上划行。'],['El teleférico sube.','缆车升上去了。']
];
export const bilingualCategories = categories.map((c,i)=>({...c,words:c.words.map((w,j)=>({...w,zh:translations[i].split(',')[j],...(i===0?{sentence:sentences[j][0],sentenceZh:sentences[j][1],tip:`指着图片，和孩子一起说 ${w.word}（${translations[i].split(',')[j]}），再读短句，让孩子用声音或动作回应。`}:{})}))}));
export function shuffle(items,random=Math.random){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function createRound(words,previous=null,random=Math.random){const pool=words.filter(w=>w.word!==previous);const target=pool[Math.floor(random()*pool.length)];const others=shuffle(words.filter(w=>w.word!==target.word),random).slice(0,3);return {target,options:shuffle([target,...others],random)};}
