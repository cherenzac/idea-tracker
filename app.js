'use strict';
const KEY = 'ideavision.ideas.v2';
const LEGACY_KEY = 'ideavision.ideas.v1';
const legacySeeds = [
 {id:'seed-1',title:'A tiny tutor for big questions',description:'An AI learning companion that turns a tricky concept into three small experiments you can try.',icon:'◉',status:'New'},
 {id:'seed-2',title:'The meeting-to-momentum machine',description:'A sandbox that turns fictional meeting notes into clear next steps, with a human review before anything is shared.',icon:'⚡',status:'Exploring'},
 {id:'seed-3',title:'A creative constraint generator',description:'Generate playful constraints for a weekend project: one color, one button, one surprisingly useful outcome.',icon:'✦',status:'New'}
];
const seeds = [
 {
  "id": "family-v2-1",
  "title": "Story Spark",
  "description": "Turn three imaginary words into a short, cheerful choose-your-own-adventure.",
  "icon": "✦",
  "status": "New"
 },
 {
  "id": "family-v2-2",
  "title": "Doodle Detective",
  "description": "Draw a silly object and let a tiny model guess what it is.",
  "icon": "✦",
  "status": "New"
 },
 {
  "id": "family-v2-3",
  "title": "Pantry Remix",
  "description": "Type a few ingredients and get playful meal ideas to review before cooking; check allergies and food safety yourself.",
  "icon": "♧",
  "status": "New"
 },
 {
  "id": "family-v2-4",
  "title": "Poem Postcards",
  "description": "Turn a theme into a tiny poem on a colorful downloadable card.",
  "icon": "✦",
  "status": "New"
 },
 {
  "id": "family-v2-5",
  "title": "Pocket Piano",
  "description": "Tap a few keys to create a surprisingly musical mini tune.",
  "icon": "✦",
  "status": "New"
 },
 {
  "id": "family-v2-6",
  "title": "Word Bridge",
  "description": "Play a cooperative word-association game with AI-powered clues.",
  "icon": "◉",
  "status": "New"
 },
 {
  "id": "family-v2-7",
  "title": "Rainy-Day Quest",
  "description": "Generate an indoor scavenger hunt from a theme and ordinary objects, with adult review for safe play.",
  "icon": "♧",
  "status": "New"
 },
 {
  "id": "family-v2-8",
  "title": "Talk to a Checklist",
  "description": "Turn a short spoken or typed thought into an editable to-do list.",
  "icon": "⚡",
  "status": "New"
 },
 {
  "id": "family-v2-9",
  "title": "Kindness Quest",
  "description": "Generate small, practical kindness challenges for home or friends.",
  "icon": "♧",
  "status": "New"
 },
 {
  "id": "family-v2-10",
  "title": "Prompt Playground",
  "description": "Describe a fictional scene, then compare your words with an AI picture.",
  "icon": "◉",
  "status": "New"
 }
];
const $ = id => document.getElementById(id);
let ideas = seeds.map(x => ({...x}));
let editing = null;
let storageReady = true;
function validIdeas(value) {
 return Array.isArray(value) && value.every(x => x && typeof x.id === 'string' && typeof x.title === 'string' && typeof x.description === 'string' && ['New','Exploring','Built'].includes(x.status) && ['✦','◉','⚡','♧'].includes(x.icon));
}
try {
 const saved = localStorage.getItem(KEY);
 if (saved !== null) {
  const parsed = JSON.parse(saved);
  if (!validIdeas(parsed)) throw new Error('Invalid saved data');
  ideas = parsed;
 } else {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (legacy !== null) {
   const parsed = JSON.parse(legacy);
   if (!validIdeas(parsed)) throw new Error('Invalid legacy data');
   // Replace only untouched original examples, never personal or edited entries.
   const personal = parsed.filter(x => !legacySeeds.some(seed => ['id','title','description','icon','status'].every(key => x[key] === seed[key])));
   ideas = [...personal, ...seeds.filter(seed => !personal.some(x => x.id === seed.id)).map(x => ({...x}))];
  }
  // A separate versioned key keeps the old data as a backup and prevents reseeding on reload.
  localStorage.setItem(KEY, JSON.stringify(ideas));
 }
} catch { storageReady = false; $('message').textContent = 'Saved data could not be read or upgraded. This session works in memory; export to keep your ideas. Existing storage will not be overwritten.'; }
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
