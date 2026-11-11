'use strict';

const systemIcons = {
  folder: '<path d="M3 12a3 3 0 0 1 3-3h12l5 5h18a3 3 0 0 1 3 3v22H3z" fill="#dc8d21" stroke="#9c6011"/><path d="M4 19h41l-5 20H4z" fill="#ffc957" stroke="#a9731f"/><path d="M5 20h39M6 25h34" stroke="#fff0a8" stroke-width="2"/><path d="M7 13h10l4 4H7z" fill="#ffe181"/>',
  computer: '<path d="M4 7h35v27H4z" fill="#dce5ee" stroke="#3f618d" stroke-width="2" stroke-linejoin="round"/><path d="M8 11h27v19H8z" fill="#2356a1" stroke="#34507b"/><path d="M10 12h24v10L10 29z" fill="#73c5fa"/><path d="M20 34h7v6h10v4H9v-4h11z" fill="#a2b8ce" stroke="#54769a" stroke-linejoin="round"/><circle cx="35.5" cy="31.5" r="1" fill="#85d861"/>',
  person: '<rect x="5" y="4" width="38" height="40" rx="7" fill="#c9e3ff" stroke="#436eab" stroke-width="2"/><circle cx="24" cy="17" r="7" fill="#f8bd8b" stroke="#a66b44"/><path d="M12 38v-3a12 12 0 1 1 24 0v3z" fill="#437ecb" stroke="#27538e"/><path d="M9 9h10" stroke="#fff" stroke-width="2"/>',
  mail: '<rect x="3" y="10" width="42" height="29" rx="4" fill="#e6eff9" stroke="#406897" stroke-width="2"/><path d="m4 35 14-13m26 13L31 22" stroke="#7195c0" stroke-width="2"/><path d="m4 14 18 14c1 1 3 1 4 0l18-14" fill="#c7def8" stroke="#416da4" stroke-width="2"/><path d="M7 12h33" stroke="#fff" stroke-width="2"/>',
  web: '<circle cx="24" cy="24" r="19" fill="#4aade8" stroke="#204f94" stroke-width="2"/><ellipse cx="24" cy="24" rx="9" ry="18" fill="none" stroke="#d8f4ff" stroke-width="2"/><path d="M6 24h36M10 15h28m-28 18h28" stroke="#d8f4ff" stroke-width="2"/>'
};
const sys = {
  welcome:{name:'Welcome',icon:'computer',note:'Portfolio desktop'},
  projects:{name:'My Projects',icon:'folder',note:PROJECTS.length+' projects'},
  about:{name:'About Me',icon:'person',note:'About Yazan Fattal'},
  contact:{name:'Contact',icon:'mail',note:'Eindhoven, Netherlands'}
};
const all = new Map(PROJECTS.map(p=>[p.id,p]));
const states = new Map();
const el = id=>document.getElementById(id);
const workspace = el('workspace');
const layer = el('windows');
const tasks = el('tasks');
const start = el('start');
const menu = el('start-menu');
const isMobile = ()=>matchMedia('(max-width: 700px)').matches;
let active = null, nextZ = 0, restoreList = [];

function h(tag, cls, value) {
  const node=document.createElement(tag);
  if(cls) node.className=cls;
  if(value !== undefined) node.textContent=value;
  return node;
}
function icon(key) {
  const node=h('span','icon');
  node.setAttribute('aria-hidden','true');
  if(systemIcons[key]){
    node.innerHTML='<svg viewBox="0 0 48 48" focusable="false">'+systemIcons[key]+'</svg>';
  } else if(/\.(png|jpe?g|svg)$/i.test(key)){
    node.classList.add('icon-logo');
    const img=h('img'); img.alt=''; img.src='assets/'+key; node.append(img);
  } else {
    node.classList.add('icon-emoji'); node.textContent=key;
  }
  return node;
}
function openButton(label,key,primary=false,withIcon=null){
  const node=h('button','xp-button'+(primary?' primary':''));
  node.type='button'; node.dataset.open=key;
  if(withIcon) node.append(icon(withIcon));
  node.append(document.createTextNode(label)); return node;
}
function link(label,url,primary=false) {
  const node=h('a','xp-button'+(primary?' primary':''),label);
  node.href=url;
  if(!url.startsWith('mailto:')){node.target='_blank';node.rel='noopener noreferrer';}
  return node;
}
function shortcut(id,meta) {
  const button=h('button','shortcut');button.type='button';button.dataset.open=id;
  button.append(icon(meta.icon),h('span','shortcut-label',meta.name));return button;
}
function renderWelcome(){
  const panel=h('div','welcome-body');
  const kicker=h('p','welcome-kicker');kicker.append(icon('computer'),document.createTextNode('YAZAN FATTAL / PORTFOLIO'));
  const title=h('h1',null,'Welcome to'); title.append(h('br'),document.createTextNode('my desktop.'));
  const desc=h('p',null,'I’m Yazan, a media design and ICT student. Open a shortcut to explore the games, apps, and design projects I’ve made.');
  const actions=h('div','actions');
  actions.append(openButton('Explore projects','projects',true,'folder'),openButton('About me','about',false,'person'));
  const note=h('div','welcome-note');note.append(h('b',null,'i'),document.createTextNode('Click or tap any shortcut to open it.'));
  panel.append(kicker,title,desc,actions,note);return panel;
}
function renderExplorer(status) {
  const explorer=h('div','explorer'), bar=h('div','explorer-toolbar'), label=h('label',null,'Search');
  const search=h('input');search.type='search';search.placeholder='Find a project';label.append(search);
  const filters=h('div','filters');filters.setAttribute('aria-label','Filter projects');
  const list=h('div','explorer-items');
  let filter='All';
  function update(){
    const query=search.value.trim().toLowerCase();
    const found=PROJECTS.filter(p=>(filter==='All'||p.category===filter)&&[p.name,p.summary,...p.tags].join(' ').toLowerCase().includes(query));
    list.replaceChildren();
    for(const p of found){
      const item=h('button','explorer-item');item.type='button';item.dataset.open=p.id;
      const text=h('span');text.append(h('b',null,p.name),h('small',null,p.category+(p.year?' · '+p.year:'')));
      item.append(icon(p.icon),text);list.append(item);
    }
    if(!found.length) list.append(h('p','empty','No projects match your search.'));
    status.textContent=found.length+' of '+PROJECTS.length+' projects';
  }
  for(const name of ['All','Games','Apps','Design']){
    const button=h('button',null,name);button.type='button';button.setAttribute('aria-pressed',String(name===filter));
    button.addEventListener('click',()=>{filter=name;for(const item of filters.children)item.setAttribute('aria-pressed',String(item===button));update();});
    filters.append(button);
  }
  search.addEventListener('input',update);
  bar.append(label,filters);explorer.append(bar,list);update();return explorer;
}
function renderProject(p) {
  const article=h('article','project'), lead=h('div','project-lead'), intro=h('div');
  intro.append(h('div','project-kicker',p.category+(p.year?' · '+p.year:'')),h('h3',null,p.name));
  lead.append(icon(p.icon),intro);
  const tags=h('ul','tags');for(const tag of p.tags)tags.append(h('li',null,tag));
  article.append(lead,h('p',null,p.summary),tags);
  if(p.demo || p.links.length){
    const actions=h('div','actions');
    if(p.demo)actions.append(openButton('Launch in window','demo:'+p.id,true,'computer'));
    for(const [i,[label,url]] of p.links.entries())actions.append(link(label+' ↗',url,!p.demo&&!i));
    article.append(actions);
  }
  if(p.details){
    const details=h('details');details.append(h('summary',null,'Read the case study'));
    const dl=h('dl');
    ['Overview','Problem','Solution','My role'].forEach((label,i)=>dl.append(h('dt',null,label),h('dd',null,p.details[i])));
    details.append(dl);article.append(details);
  }
  return article;
}
function renderDemo(p) {
  const body=h('div','demo-body'),toolbar=h('div','demo-toolbar');
  const a=link('Open in a new tab ↗',p.demo);toolbar.append(a);
  const frame=h('iframe','demo-frame');frame.title=p.name+' interactive demo';frame.src=p.demo;frame.referrerPolicy='strict-origin-when-cross-origin';
  body.append(toolbar,frame);return body;
}
function renderAbout(){
  const pane=h('article','plain-page'), intro=h('div','about-intro'), img=h('img'), name=h('div');
  img.src='assets/me.JPG';img.alt='Yazan Fattal';
  name.append(h('div','project-kicker','Media Design & ICT Student'),h('h3',null,'Yazan Fattal'));
  intro.append(img,name);
  pane.append(intro,h('p',null,'From Damascus to Eindhoven, my journey has shaped how I approach design, interaction, and creative technology.'),h('h4',null,'My journey'));
  const cities=h('ol','journey');
  for(const [city,period,description] of [
    ['Damascus, Syria','2000–2002','Where my story began, building my roots, identity, and curiosity.'],
    ['Jeddah, Saudi Arabia','2002–2016','A multicultural city where I learned adaptability and diversity.'],
    ['Valenciennes, France','2016–2019','High school years where I became more independent and creative.'],
    ['Eindhoven, Netherlands','2019–present','Studying Media Design & ICT and building projects with purpose.']
  ]){
    const item=h('li');item.append(h('b',null,city),h('small',null,period),h('small',null,description));cities.append(item);
  }
  pane.append(cities,h('p',null,'4 countries · 4 cities · 5,900+ km · 4 languages'),openButton('Get in touch','contact',true,'mail'));return pane;
}
function renderContact(){
  const pane=h('article','plain-page'),actions=h('div','actions');
  pane.append(h('div','project-kicker','Available for internships & creative work'),h('h3',null,'Let’s connect'),h('p',null,'Interested in collaborating, offering an internship, or just saying hello? I’m based in Eindhoven, Netherlands, and open to remote and hybrid work.'));
  actions.append(link('Email me','mailto:yazanfattal19@gmail.com',true),link('LinkedIn ↗','https://linkedin.com/in/yazan-fattal-8b25b21b9'),link('GitHub ↗','https://github.com/YazanFattal'),link('YouTube ↗','https://youtube.com/@Yazan.Design'));pane.append(actions);return pane;
}
function sizeAndPlace(s, reset=false){
  const w=workspace.clientWidth, hh=workspace.clientHeight, mobile=isMobile(), isDemo=s.id.startsWith('demo:');
  if(!w||!hh)return;
  const width=Math.min(w-(mobile?14:26),s.id==='welcome'?560:isDemo?900:s.id==='projects'?710:625);
  const proposedHeight=isDemo?Math.min(690,hh-28):s.id==='projects'?Math.min(510,hh-28):0;
  s.panel.style.width=width+'px';
  s.panel.style.height=proposedHeight?Math.max(120,proposedHeight)+'px':'';
  s.panel.style.maxHeight=Math.max(100,hh-(mobile?14:20))+'px';
  const height=s.panel.offsetHeight;
  const defaultX=s.id==='welcome'&&!mobile?Math.max(w<=990?310:426,w*.5-125):Math.max(7,(w-width)/2+(mobile?0:s.offset));
  const defaultY=s.id==='welcome'?Math.min(hh*.17,145):mobile?9:Math.min(86+s.offset,hh*.12);
  const gap=mobile?7:9;
  s.x=Math.round(Math.max(gap,Math.min((reset||s.x==null)?defaultX:s.x,w-width-gap)));
  s.y=Math.round(Math.max(gap,Math.min((reset||s.y==null)?defaultY:s.y,hh-height-gap)));
  s.panel.style.left=s.x+'px';s.panel.style.top=s.y+'px';
}
function focusWindow(s,focus=false){
  if(s.panel.hidden){s.panel.hidden=false;sizeAndPlace(s);}
  active=s.id;s.panel.style.zIndex=String(++nextZ);
  if(nextZ>8000){
    [...states.values()].sort((a,b)=>Number(a.panel.style.zIndex)-Number(b.panel.style.zIndex)).forEach((win,i)=>{win.panel.style.zIndex=String(i+1);});
    nextZ=states.size;
  }
  syncActive();
  if(focus)s.panel.focus({preventScroll:true});
}
function syncActive(){
  for(const s of states.values()){
    const yes=active===s.id&&!s.panel.hidden;
    s.panel.classList.toggle('is-active',yes);
    s.task.setAttribute('aria-pressed',String(yes));
    s.task.title=s.panel.hidden?'Restore '+s.title:s.title;
  }
}
function topVisible(){
  return [...states.values()].filter(s=>!s.panel.hidden).sort((a,b)=>Number(b.panel.style.zIndex)-Number(a.panel.style.zIndex))[0];
}
function hideOne(s,remove=false){
  const hadFocus=s.panel.contains(document.activeElement);
  s.panel.hidden=true;
  if(remove){states.delete(s.id);s.panel.remove();s.task.remove();}
  if(active===s.id)active=topVisible()?.id||null;
  syncActive();
  if(hadFocus){
    const opener=s.returnFocus;
    (remove&&opener?.isConnected&&opener.getClientRects().length?opener:remove?start:s.task).focus({preventScroll:true});
  }
}
function toggleMax(s){
  const max=s.panel.classList.toggle('is-max');
  s.maxButton.textContent=max?'❐':'□';
  s.maxButton.title=max?'Restore size':'Maximize';
  s.maxButton.setAttribute('aria-label',s.maxButton.title);
  if(!max)sizeAndPlace(s);
}
function bindDrag(s,bar){
  let drag=null;
  bar.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('button')||s.panel.classList.contains('is-max')||isMobile())return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:s.x,top:s.y};
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    s.x=Math.max(0,Math.min(drag.left+e.clientX-drag.x,workspace.clientWidth-s.panel.offsetWidth));
    s.y=Math.max(0,Math.min(drag.top+e.clientY-drag.y,workspace.clientHeight-s.panel.offsetHeight));
    s.panel.style.left=s.x+'px';s.panel.style.top=s.y+'px';
  });
  bar.addEventListener('lostpointercapture',()=>{drag=null;});
  bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))toggleMax(s);});
}
function openWindow(id,from=null,focus=true){
  setMenu(false);restoreList=[];
  if(states.has(id)){focusWindow(states.get(id),focus);return;}
  const p=all.get(id)||all.get(id.startsWith('demo:')?id.slice(5):'');
  const isDemo=id.startsWith('demo:');
  const meta=sys[id]||p;
  if(!meta||(isDemo&&!p.demo))return;
  const title=meta.name+(isDemo?' — Demo':'');
  const panel=h('section','window');panel.dataset.window=id;panel.tabIndex=-1;panel.setAttribute('role','dialog');
  const bar=h('div','titlebar'), heading=h('h2');
  heading.id='title-'+id.replace(':','-');heading.append(icon(meta.icon),h('span',null,title));panel.setAttribute('aria-labelledby',heading.id);
  const controls=h('div','window-controls');
  const makeControl=(label,glyph,cls)=>{
    const b=h('button',cls,glyph);b.type='button';b.title=label;b.setAttribute('aria-label',label);return b;
  };
  const min=makeControl('Minimize','−'), max=makeControl('Maximize','□'), close=makeControl('Close','×','close');
  controls.append(min,max,close);bar.append(heading,controls);
  const body=h('div','window-body'), status=h('div','window-status',meta.note||p.status||p.category);
  status.setAttribute('aria-live','polite');
  let content;
  if(id==='welcome')content=renderWelcome();
  else if(id==='projects')content=renderExplorer(status);
  else if(id==='about')content=renderAbout();
  else if(id==='contact')content=renderContact();
  else content=isDemo?renderDemo(p):renderProject(p);
  body.append(content);panel.append(bar,body,status);
  const task=h('button','task');task.type='button';task.append(icon(meta.icon),h('span',null,title));
  const s={id,panel,task,title,maxButton:max,returnFocus:from,offset:((states.size%5)-2)*14};
  states.set(id,s);layer.append(panel);tasks.append(task);
  min.addEventListener('click',()=>hideOne(s));
  max.addEventListener('click',()=>toggleMax(s));
  close.addEventListener('click',()=>hideOne(s,true));
  panel.addEventListener('pointerdown',()=>{if(active!==id)focusWindow(s);});
  panel.addEventListener('focusin',()=>{if(active!==id)focusWindow(s);});
  task.addEventListener('click',()=>{if(active===id&&!panel.hidden)hideOne(s);else focusWindow(s,true);});
  bindDrag(s,bar);sizeAndPlace(s,true);focusWindow(s,focus);
}
function setMenu(show,keyboard=false){
  menu.hidden=!show;start.setAttribute('aria-expanded',String(show));
  if(show&&keyboard)menu.querySelector('button').focus();
}
function showDesktop(){
  if(restoreList.length&&!topVisible()){
    const previous=restoreList;restoreList=[];
    for(const id of previous){const s=states.get(id);if(s)focusWindow(s);}
    return;
  }
  restoreList=[...states.values()].filter(s=>!s.panel.hidden).sort((a,b)=>Number(a.panel.style.zIndex)-Number(b.panel.style.zIndex)).map(s=>s.id);
  for(const id of restoreList)states.get(id).panel.hidden=true;
  active=null;syncActive();
}
function tick(){
  const now=new Date(),clock=el('clock');
  clock.dateTime=now.toISOString();clock.textContent=now.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
  clock.title=now.toLocaleDateString([],{dateStyle:'full'});
}
for(const id of ['projects','about','contact'])el('shortcuts').append(shortcut(id,sys[id]));
for(const p of PROJECTS)el('shortcuts').append(shortcut(p.id,p));
for(const node of document.querySelectorAll('[data-icon]'))node.replaceWith(icon(node.dataset.icon));

document.addEventListener('click',e=>{
  const opener=e.target.closest('[data-open]');
  if(opener){openWindow(opener.dataset.open,opener.closest('#start-menu')?start:opener);return;}
  if(!menu.hidden&&!e.target.closest('#start-menu,#start'))setMenu(false);
});
start.addEventListener('click',e=>setMenu(menu.hidden,e.detail===0));
el('hide-windows').addEventListener('click',()=>{setMenu(false);start.focus();showDesktop();});
el('desktop-toggle').addEventListener('click',showDesktop);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setMenu(false);start.focus();}});
window.addEventListener('resize',()=>{for(const s of states.values())if(!s.panel.hidden)sizeAndPlace(s);});
function openHash(){
  const id=location.hash.slice(1);
  const mapped={work:'projects',journey:'about',connect:'contact'}[id]||id;
  if(Object.hasOwn(sys,mapped)||all.has(mapped)){openWindow(mapped,null,false);return true;}
  return false;
}
window.addEventListener('hashchange',openHash);
if(!openHash()&&!isMobile())openWindow('welcome',null,false);
tick();setInterval(tick,10000);
