export const books = [
{id:'doing',title:'¿Qué estás haciendo?',zh:'你在做什么？',cover:'stories/doing/01.jpg',credits:'文字：Nina Orange；插画：Wiehan de Jager；西语译者：dohliam。中文：本网站新译。原西语及插画保留，增加中文与互动朗读。',source:'https://github.com/global-asp/global-asp/blob/65c924ee281dd470ecefe3acc23cb27426db5cfc/es/0008_qué-estás-haciendo.md',license:'https://creativecommons.org/licenses/by/4.0/',pages:[
['Estoy cantando.','我在唱歌。'],['Está despidiéndose.','她在挥手告别。'],['Estoy aplaudiendo.','我在拍手。'],['Está estirándose.','她在伸展身体。'],['Está llamando.','他在呼喊。'],['Estoy respondiendo.','我在回应。'],['Está escuchando.','她在听。'],['¿Qué estás haciendo?','你在做什么？']
].map(([es,zh],i)=>({es,zh,image:`stories/doing/${String(i+2).padStart(2,'0')}.jpg`}))},
{id:'car',title:'¡Vamos, coche!',zh:'小汽车出发',cover:'stories/car/1.svg',credits:'本网站原创故事及车辆场景插画，由 Codex 制作；中西语未经过真人母语者审校。',license:'https://creativecommons.org/licenses/by/4.0/',pages:[
['El coche sale de casa.','小汽车从家里出发。'],['El coche ve un autobús. ¡Hola!','小汽车看见公交车。你好！'],['El coche ve un tren. ¡Hola!','小汽车看见火车。你好！'],['El coche ve un tractor. ¡Hola!','小汽车看见拖拉机。你好！'],['El coche llega al parque.','小汽车来到公园。'],['El coche vuelve a casa. ¡Buenas noches!','小汽车回家了。晚安！']
].map(([es,zh],i)=>({es,zh,image:`stories/car/${i+1}.svg`}))}
];
