'use strict';
const KEY = 'ideavision.ideas.v1';
const seeds = [
 {id:'seed-1',title:'A tiny tutor for big questions',description:'An AI learning companion that turns a tricky concept into three small experiments you can try.',icon:'◉',status:'New'},
 {id:'seed-2',title:'The meeting-to-momentum machine',description:'A sandbox that turns fictional meeting notes into clear next steps, with a human review before anything is shared.',icon:'⚡',status:'Exploring'},
 {id:'seed-3',title:'A creative constraint generator',description:'Generate playful constraints for a weekend project: one color, one button, one surprisingly useful outcome.',icon:'✦',status:'New'}
];
const $ = id => document.getElementById(id);
let ideas = seeds.map(x => ({...x}));
let editing = null;
let storageReady = true;
try {
 const saved = localStorage.getItem(KEY);
 if (saved !== null) {
  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed) || !parsed.every(x => x && typeof x.id === 'string' && typeof x.title === 'string' && typeof x.description === 'string' && ['New','Exploring','Built'].includes(x.status) && ['✦','◉','⚡','♧'].includes(x.icon))) throw new Error('Invalid saved data');
  ideas = parsed;
 }
} catch { storageReady = false; $('message').textContent = 'Saved data could not be read. This session works in memory; export to keep your ideas. Existing storage will not be overwritten.'; }
function persist() {
 if (!storageReady) return false;
 try {localStorage.setItem(KEY, JSON.stringify(ideas)); return true;}
 catch {storageReady = false; return false;}
}
function announce(action) { $('message').textContent = persist() ? action + ' Saved in this browser.' : action + ' Not saved to browser storage — export your ideas before leaving.'; }
function resetForm() {editing = null; $('form').reset(); $('form-heading').textContent = 'Broadcast a new idea'; $('save').textContent = '+ Add idea'; $('cancel').hidden = true;}
function editIdea(id) {
 const idea = ideas.find(x=>x.id===id); if (!idea) return;
 editing = id;
 for (const key of ['title','description','icon','status']) $(key).value = idea[key];
 $('form-heading').textContent = 'Fine-tune your idea'; $('save').textContent = 'Save changes'; $('cancel').hidden = false; $('title').focus();
}
function render() {
 const query = $('search').value.trim().toLowerCase();
 const filtered = ideas.filter(x => ($('filter').value === 'all' || x.status === $('filter').value) && (x.title+' '+x.description).toLowerCase().includes(query));
 $('ideas').replaceChildren(); $('empty').hidden = filtered.length !== 0;
 $('count').textContent = `${ideas.length} SIGNAL${ideas.length === 1 ? '' : 'S'}`;
 for (const idea of filtered) {
  const card = document.createElement('article'); card.className='card';
  const icon=document.createElement('span'); icon.className='idea-icon'; icon.textContent=idea.icon; icon.setAttribute('aria-hidden','true');
  const content=document.createElement('div');
  const title=document.createElement('h2'); title.textContent=idea.title;
  const text=document.createElement('p'); text.textContent=idea.description;
  const bottom=document.createElement('div'); bottom.className='card-bottom';
  const badge=document.createElement('span'); badge.className='badge'; badge.textContent=idea.status;
  const actions=document.createElement('div');
  const edit=document.createElement('button'); edit.type='button'; edit.textContent='Edit'; edit.setAttribute('aria-label',`Edit ${idea.title}`); edit.onclick=()=>editIdea(idea.id);
  const remove=document.createElement('button'); remove.type='button'; remove.textContent='Delete'; remove.setAttribute('aria-label',`Delete ${idea.title}`);
  remove.onclick=()=> {if(!confirm(`Delete “${idea.title}”?`))return; ideas=ideas.filter(x=>x.id!==idea.id); if(editing===idea.id)resetForm(); announce('Idea deleted.'); render();};
  actions.append(edit,remove); bottom.append(badge,actions); content.append(title,text,bottom); card.append(icon,content); $('ideas').append(card);
 }
}
$('form').addEventListener('submit',event=>{
 event.preventDefault(); const title=$('title').value.trim(); if(!title){$('title').setCustomValidity('Please give your idea a title.'); $('title').reportValidity(); return;}
 const data={title,description:$('description').value.trim(),icon:$('icon').value,status:$('status').value};
 if(editing){ideas=ideas.map(x=>x.id===editing?{...x,...data}:x);}else{ideas.unshift({id:crypto.randomUUID(),...data});}
 announce(editing?'Idea updated.':'Idea added.'); resetForm(); render();
});
$('title').addEventListener('input',()=> $('title').setCustomValidity(''));
$('cancel').addEventListener('click',resetForm);
$('search').addEventListener('input',render); $('filter').addEventListener('change',render);
$('export').addEventListener('click',()=>{
 const url=URL.createObjectURL(new Blob([JSON.stringify(ideas,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='ideavision-ideas.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();
