export function $(sel){ return document.querySelector(sel); }
export const menu = {
el: $('#menu'),
name: $('#nameInput'),
server: $('#serverInput'),
btn: $('#playBtn'),
hide(){ this.el.style.display='none'; }
};


export const chat = {
root: document.getElementById('chat'),
log: document.getElementById('chatLog'),
input: document.getElementById('chatInput'),
open:false,
push({name,text}){
const div=document.createElement('div');
div.className='msg';
div.innerHTML = `<span class="n">${escapeHtml(name)}</span>: ${escapeHtml(text)}`;
this.log.appendChild(div); this.log.scrollTop=this.log.scrollHeight;
},
showInput(){ this.input.style.display='block'; this.input.value=''; this.input.focus(); this.open=true; },
hideInput(){ this.input.style.display='none'; this.open=false; }
};


export const board = {
el: document.getElementById('leaderboard'),
table: document.getElementById('board'),
show(){ this.el.classList.remove('hidden'); },
hide(){ this.el.classList.add('hidden'); },
render(rows){
this.table.innerHTML = '';
const add=(a,b,c,cls='')=>{
const A=document.createElement('div'); A.textContent=a; if(cls) A.className=cls; this.table.appendChild(A);
const B=document.createElement('div'); B.textContent=b; if(cls) B.className=cls; this.table.appendChild(B);
const C=document.createElement('div'); C.textContent=c; if(cls) C.className=cls; this.table.appendChild(C);
};
add('Name','Kills','Deaths','hdr');
rows.forEach(r=>add(r.name, r.kills, r.deaths));
}
};


export function escapeHtml(s){
return s.replace(/[&<>"]+/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
}
