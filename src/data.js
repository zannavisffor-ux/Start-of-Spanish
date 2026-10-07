// Each entry: Spanish word | illustration. Add new categories here.
const definitions = [
 ['vehiculos','车辆','Vehículos','🚗','#e3f2ff','coche|🚗,autobús|🚌,camión|🚚,tren|🚆,bicicleta|🚲,moto|🏍️,avión|✈️,barco|🚢,helicóptero|🚁,ambulancia|🚑,camión de bomberos|🚒,coche de policía|🚓,taxi|🚕,tractor|🚜,cohete|🚀,patinete|🛴,furgoneta|🚐,velero|⛵,canoa|🛶,teleférico|🚠'],
 ['animales','动物','Animales','🐶','#fff0df','perro|🐶,gato|🐱,conejo|🐰,oso|🐻,panda|🐼,león|🦁,tigre|🐯,vaca|🐮,cerdo|🐷,caballo|🐴,oveja|🐑,mono|🐵,elefante|🐘,jirafa|🦒,pato|🦆,pollo|🐥,pez|🐟,tortuga|🐢,mariposa|🦋,abeja|🐝'],
 ['comida','食物','Comida','🍞','#fff4db','pan|🍞,leche|🥛,huevo|🥚,queso|🧀,arroz|🍚,pasta|🍝,sopa|🍲,pizza|🍕,helado|🍦,galleta|🍪,tarta|🎂,agua|💧,zanahoria|🥕,patata|🥔,maíz|🌽,tomate|🍅,brócoli|🥦,pepino|🥒,carne|🥩,pescado|🐟'],
 ['frutas','水果','Frutas','🍓','#ffe8ed','manzana|🍎,pera|🍐,plátano|🍌,naranja|🍊,limón|🍋,fresa|🍓,uva|🍇,sandía|🍉,melón|🍈,melocotón|🍑,cereza|🍒,piña|🍍,kiwi|🥝,mango|🥭,coco|🥥,arándano|🫐'],
 ['cuerpo','身体','El cuerpo','🖐️','#eeeaff','mano|🖐️,pie|🦶,ojo|👁️,oreja|👂,nariz|👃,boca|👄,lengua|👅,diente|🦷,cabeza|👤,brazo|💪,pierna|🦵,corazón|🫀,pulgar|👍,dedo|☝️,pelo|🦱'],
 ['casa','家里','La casa','🏠','#e7f4ec','casa|🏠,puerta|🚪,ventana|🪟,cama|🛏️,sofá|🛋️,silla|🪑,lámpara|💡,bañera|🛁,ducha|🚿,inodoro|🚽,espejo|🪞,escoba|🧹,jabón|🧼,cesta|🧺,llave|🔑,reloj|🕒,televisión|📺,teléfono|☎️,cuchara|🥄,plato|🍽️'],
 ['ropa','衣服','La ropa','👕','#e6f4fa','camiseta|👕,pantalón|👖,vestido|👗,abrigo|🧥,calcetines|🧦,zapatos|👞,botas|👢,gorra|🧢,sombrero|👒,bufanda|🧣,guantes|🧤,mochila|🎒,gafas|👓,bañador|🩱,pijama|👕,sandalias|🩴'],
 ['colores','颜色','Colores','🎨','#fff1e4','rojo|#ed5a5a,azul|#488ee8,amarillo|#f5ce45,verde|#63b97a,naranja|#f59d4c,rosa|#ef91b3,morado|#a179d1,blanco|#ffffff,negro|#303342,gris|#a7aab4,marrón|#a27855,beige|#e7d3b0,turquesa|#53c6bd,lila|#c4a5e4,dorado|#d7af37'],
 ['acciones','动作','Acciones','🏃','#ffebdf','correr|🏃,caminar|🚶,dormir|😴,comer|🍽️,beber|🥤,saltar|🤾,bailar|💃,cantar|🎤,leer|📖,dibujar|🖍️,nadar|🏊,jugar|🧸,aplaudir|👏,saludar|👋,abrazar|🫂,reír|😄,llorar|😢,lavarse|🧼,escuchar|👂,mirar|👀'],
 ['personas','人物','Personas','👪','#f3eaff','mamá|👩,papá|👨,bebé|👶,niña|👧,niño|👦,abuela|👵,abuelo|👴,familia|👪,hermana|👧,hermano|👦,amiga|👧,amigo|👦,médica|👩‍⚕️,bombero|👨‍🚒,policía|👮,profesora|👩‍🏫'],
 ['naturaleza','自然','Naturaleza','🌳','#e6f3e3','sol|☀️,luna|🌙,estrella|⭐,nube|☁️,lluvia|🌧️,nieve|❄️,arcoíris|🌈,árbol|🌳,flor|🌸,hoja|🍃,montaña|⛰️,mar|🌊,fuego|🔥,piedra|🪨,concha|🐚,bosque|🌲,volcán|🌋,tierra|🌍']
];
export const imagePath = emoji => '/images/' + [...emoji].map(c=>c.codePointAt(0).toString(16)).filter(c=>emoji.includes('‍') || c!=='fe0f').join('-') + '.svg';
export const categories = definitions.map(([id,zh,name,icon,color,entries]) => ({id,zh,name,icon,color,words:entries.split(',').map(entry=>{const [word,picture]=entry.split('|');return {word,picture};})}));
export function getSelection(hash) {
 const [id,index] = hash.replace(/^#\/?/,'').split('/');
 const category = categories.find(c=>c.id===id);
 if (!category) return null;
 const parsed = Number(index ?? 0);
 return {category,index:Number.isInteger(parsed) ? Math.max(0,Math.min(parsed,category.words.length-1)) : 0};
}
