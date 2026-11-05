'use strict';
const KEY = 'ideavision.ideas.v7';
const V6_KEY = 'ideavision.ideas.v6';
const V5_KEY = 'ideavision.ideas.v5';
const V4_KEY = 'ideavision.ideas.v4';
const V3_KEY = 'ideavision.ideas.v3';
const PREVIOUS_KEY = 'ideavision.ideas.v2';
const LEGACY_KEY = 'ideavision.ideas.v1';
const legacySeeds = [
 {id:'seed-1',title:'A tiny tutor for big questions',description:'An AI learning companion that turns a tricky concept into three small experiments you can try.',icon:'◉',status:'New'},
 {id:'seed-2',title:'The meeting-to-momentum machine',description:'A sandbox that turns fictional meeting notes into clear next steps, with a human review before anything is shared.',icon:'⚡',status:'Exploring'},
 {id:'seed-3',title:'A creative constraint generator',description:'Generate playful constraints for a weekend project: one color, one button, one surprisingly useful outcome.',icon:'✦',status:'New'}
];
const nightlyIdea = {
 id: 'family-2026-10-29',
 title: 'Toybox Tales',
 description: 'An AI project idea: choose three pretend toys and invent a short puppet-show script, with an adult reviewing the story before play. No names, photos or recordings needed.',
 icon: '✦',
 status: 'New'
};
const newNightlyIdea = {
 id: 'family-2026-11-02',
 title: 'Riddle Repair Shop',
 description: 'An AI project concept: spot ambiguous clues in a made-up riddle and suggest fairer wording without revealing the answer. A grown-up reviews each revision; use fictional objects, not personal details. No AI service is connected.',
 icon: '◉',
 status: 'New'
};
const latestNightlyIdea = {
 id: 'family-2026-11-03',
 title: 'Board Game Balance Lab',
 description: 'An AI project concept: compare fictional rules for a homemade board game and suggest fairer turn orders or scoring. A grown-up tests each suggestion through pretend play. No player profiles, tracking or AI service are connected.',
 icon: '◉',
 status: 'New'
};
const routeNightlyIdea = {
 id: 'family-2026-11-04',
 title: 'Robot Route Coach',
 description: 'An AI project concept: trace arrow instructions across a pretend grid, explain where a toy robot would meet an obstacle, and suggest a clearer route. A grown-up checks each explanation. Use fictional maps; no location data, robot connection or AI service is included.',
 icon: '◉',
 status: 'New'
};
const museumNightlyIdea = {
 id: 'family-2026-11-05',
 title: 'Make-Believe Museum',
 description: 'An AI project concept: turn made-up objects into short museum labels and playful visitor questions, keeping imagined details clearly marked as fiction. A grown-up reviews every label. Use invented collections; no names, photos, uploads or AI service are included.',
 icon: '◉',
 status: 'New'
};
const seeds = [
 museumNightlyIdea,
 routeNightlyIdea,
 latestNightlyIdea,
 newNightlyIdea,
 nightlyIdea,
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
let lastDeleted = null;
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
  // Read the newest available version; never fall back past malformed saved data.
  const upgrades = [
   [V6_KEY, [museumNightlyIdea]],
   [V5_KEY, [museumNightlyIdea, routeNightlyIdea]],
   [V4_KEY, [museumNightlyIdea, routeNightlyIdea, latestNightlyIdea]],
   [V3_KEY, [museumNightlyIdea, routeNightlyIdea, latestNightlyIdea, newNightlyIdea]],
   [PREVIOUS_KEY, [museumNightlyIdea, routeNightlyIdea, latestNightlyIdea, newNightlyIdea, nightlyIdea]]
  ];
  let upgraded = false;
  for (const [key, additions] of upgrades) {
   const previous = localStorage.getItem(key);
   if (previous === null) continue;
   const parsed = JSON.parse(previous);
   if (!validIdeas(parsed)) throw new Error('Invalid previous data');
   // Carry forward every record, edit and deletion; add only later releases once.
   ideas = additions.filter(seed => !parsed.some(x => x.id === seed.id)).map(x => ({...x})).concat(parsed);
   upgraded = true;
   break;
  }
  if (!upgraded) {
   const legacy = localStorage.getItem(LEGACY_KEY);
   if (legacy !== null) {
    const parsed = JSON.parse(legacy);
    if (!validIdeas(parsed)) throw new Error('Invalid legacy data');
    // Replace only untouched original examples, never personal or edited entries.
    const personal = parsed.filter(x => !legacySeeds.some(seed => Object.keys(x).length === Object.keys(seed).length
     && ['id','title','description','icon','status'].every(key => x[key] === seed[key])));
    ideas = [...personal, ...seeds.filter(seed => !personal.some(x => x.id === seed.id)).map(x => ({...x}))];
   }
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
function deleteIdea(id) {
 const index = ideas.findIndex(x => x.id === id);
 if (index < 0 || !confirm(`Delete “${ideas[index].title}”?`)) return;
 lastDeleted = {idea: ideas[index], index, nextId: ideas[index + 1]?.id, previousId: ideas[index - 1]?.id};
 ideas = ideas.filter(x => x.id !== id);
 if (editing === id) resetForm();
 $('undo-delete').hidden = false;
 $('delete-note').textContent = `Deleted “${lastDeleted.idea.title}”. You can undo this last deletion until you reload or delete another idea.`;
 announce('Idea deleted.');
 render();
 $('undo-delete').focus();
}
function undoDelete() {
 if (!lastDeleted) return;
 const {idea, index, nextId, previousId} = lastDeleted;
 // Do not overwrite another entry if the ID is already present.
 if (!ideas.some(x => x.id === idea.id)) {
  const nextIndex = ideas.findIndex(x => x.id === nextId);
  const previousIndex = ideas.findIndex(x => x.id === previousId);
  const restoreIndex = nextIndex >= 0 ? nextIndex : previousIndex >= 0 ? previousIndex + 1 : Math.min(index, ideas.length);
  ideas.splice(restoreIndex, 0, idea);
 }
 lastDeleted = null;
 $('undo-delete').hidden = true;
 $('delete-note').textContent = 'Last deleted idea restored. Search and status filters still apply.';
 announce('Idea restored.');
 render();
 $('search').focus();
}
function resetForm() {editing = null; $('form').reset(); $('form-heading').textContent = 'Broadcast a new idea'; $('save').textContent = '+ Add idea'; $('cancel').hidden = true;}
function editIdea(id) {
 const idea = ideas.find(x=>x.id===id); if (!idea) return;
 editing = id;
 for (const key of ['title','description','icon','status']) $(key).value = idea[key];
 $('form-heading').textContent = 'Fine-tune your idea'; $('save').textContent = 'Save changes'; $('cancel').hidden = false; $('title').focus();
}
function render() {
 const terms = $('search').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const filtered = ideas.filter(idea => {
  const text = `${idea.title} ${idea.description} ${idea.status}`.toLowerCase();
  return ($('filter').value === 'all' || idea.status === $('filter').value) && terms.every(term => text.includes(term));
 });
 // Sort only the filtered copy, never the saved notebook or its undo positions.
 const order = $('idea-sort').value;
 if (order === 'title') filtered.sort((a,b) => a.title.localeCompare(b.title, 'en', {sensitivity:'base', numeric:true}));
 if (order === 'status') {
  const stages = ['New', 'Exploring', 'Built'];
  filtered.sort((a,b) => stages.indexOf(a.status) - stages.indexOf(b.status));
 }
 $('ideas').replaceChildren(); $('empty').hidden = filtered.length !== 0;
 $('count').textContent = `${ideas.length} SIGNAL${ideas.length === 1 ? '' : 'S'}`;
 $('search-results').textContent = `Showing ${filtered.length} of ${ideas.length} ${ideas.length === 1 ? 'idea' : 'ideas'}.`;
 $('empty').textContent = ideas.length ? 'No ideas match. Try other words or clear the filters.' : 'Your notebook is empty. Add an idea to start.';
 $('clear-filters').disabled = $('search').value.length === 0 && $('filter').value === 'all';
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
  remove.onclick=()=>deleteIdea(idea.id);
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
$('undo-delete').addEventListener('click',undoDelete);
$('search').addEventListener('input',render); $('filter').addEventListener('change',render);
$('idea-sort').addEventListener('change',render);
$('clear-filters').addEventListener('click',()=>{
 $('search').value=''; $('filter').value='all'; render(); $('search').focus();
});
$('export').addEventListener('click',()=>{
 const url=URL.createObjectURL(new Blob([JSON.stringify(ideas,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='ideavision-ideas.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();



