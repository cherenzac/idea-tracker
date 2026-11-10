'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
class Element {
 constructor(){this.children=[];this.value='';this.hidden=false;this.textContent='';this.handlers={};this.attrs={};}
 append(...items){this.children.push(...items);} replaceChildren(...items){this.children=items;} setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(type,fn){this.handlers[type]=fn;} focus(){} setCustomValidity(value){this.invalid=value;} reportValidity(){}
 reset(){for(const key of ['title','description'])els[key].value='';els.icon.value='✦';els.status.value='New';} click(){}
}
let els;
const storage=new Map();
function load(options = {}){
 els=Object.fromEntries(['title','description','icon','status','message','form','form-heading','save','cancel','search','filter','ideas','empty','count','export','undo-delete','delete-note','clear-filters','search-results','idea-sort'].map(x=>[x,new Element()]));
 els['idea-sort'].value='saved';els.filter.value='all';els.icon.value='✦';els.status.value='New';
 const context={document:{getElementById:id=>els[id],createElement:()=>new Element()},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{if(options.writeFails)throw new Error('Storage unavailable');storage.set(k,v);}},crypto:require('node:crypto').webcrypto,confirm:()=>true,URL,Blob,setTimeout};
 vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);return context;
}
function submit(){els.form.handlers.submit({preventDefault(){}});}
load();assert.equal(els.ideas.children.length,20);
els.title.value='  Test signal  ';els.description.value='<script>not executable</script>';submit();
assert.equal(els.ideas.children.length,21);assert.match(els.message.textContent,/Saved/);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Test signal');
assert.equal(els.ideas.children[0].children[1].children[1].textContent,'<script>not executable</script>');
let actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[0].onclick();
assert.equal(els.title.value,'Test signal');els.title.value='Changed';els.status.value='Built';submit();
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Changed');
actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[0].onclick();els.title.value='Unsaved';els.cancel.handlers.click();
assert.equal(els.title.value,'');assert.equal(els.cancel.hidden,true);
els.filter.value='Built';els.filter.handlers.change();assert.equal(els.ideas.children.length,1);
els.search.value='absent';els.search.handlers.input();assert.equal(els.ideas.children.length,0);assert.equal(els.empty.hidden,false);
load();assert.equal(els.ideas.children.length,21);assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Changed');
actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[1].onclick();assert.equal(els.ideas.children.length,20);
load();assert.equal(els.ideas.children.length,20);
els.title.value='   ';submit();assert.equal(els.title.invalid,'Please give your idea a title.');
storage.set('ideavision.ideas.v12','invalid');load();assert.match(els.message.textContent,/could not be read/);els.title.value='In memory';submit();assert.equal(storage.get('ideavision.ideas.v12'),'invalid');assert.match(els.message.textContent,/Not saved/);
storage.clear();
const oldSeeds = vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8').split('const $ = id')[0] + '\nlegacySeeds;');
const edited = {...oldSeeds[1], title:'My edited example'};
const personal = {id:'personal-example', title:'User-created idea',description:'Generic test text',icon:'✦',status:'New'};
const legacy = JSON.stringify([oldSeeds[0], edited, personal]);
storage.set('ideavision.ideas.v1',legacy);load();
assert.equal(els.ideas.children.length,22);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'My edited example');
assert.equal(els.ideas.children[1].children[1].children[0].textContent,'User-created idea');
assert.equal(storage.get('ideavision.ideas.v1'),legacy);
load();assert.equal(els.ideas.children.length,22);
storage.set('ideavision.ideas.v12','[]');load();assert.equal(els.ideas.children.length,0);
console.log('PASS: v1 migration preserves user entries, edited examples and old backup; no duplicate reseeding; empty v12 stays empty.');
console.log('PASS: initial render, create, safe text, edit, cancel, search/filter, empty state, delete, reload, blank title, corrupt storage preservation.');

// Extra user metadata makes a legacy starter a user-edited record, even when its visible fields match.
const annotatedLegacy = {...oldSeeds[0], extra:{note:'Keep this metadata'}};
const annotatedStorage = JSON.stringify([annotatedLegacy,personal]);
storage.clear();storage.set('ideavision.ideas.v1',annotatedStorage);load();
assert.deepEqual(JSON.parse(storage.get('ideavision.ideas.v12')).find(x=>x.id===annotatedLegacy.id),annotatedLegacy);
assert.equal(storage.get('ideavision.ideas.v1'),annotatedStorage);
load();assert.equal(JSON.parse(storage.get('ideavision.ideas.v12')).filter(x=>x.id===annotatedLegacy.id).length,1);
console.log('PASS: v1 starter records with extra metadata remain intact.');

// Returning visitors receive only concepts newer than their saved version.
const oldCustom = JSON.stringify([personal, {...oldSeeds[0], title:'Edited and kept', status:'Built'}]);
const latestTitle = 'Creature Habitat Lab';
for (const [version, expectedAdditions] of [[2,10],[3,9],[4,8],[5,7],[6,6],[7,5],[8,4],[9,3],[10,2],[11,1]]) {
 const oldKey = `ideavision.ideas.v${version}`;
 storage.clear(); storage.set(oldKey, oldCustom);
 load(); assert.equal(els.ideas.children.length,2+expectedAdditions);
 assert.equal(els.ideas.children[0].children[1].children[0].textContent,latestTitle);
 assert.equal(storage.get(oldKey),oldCustom);
 const migrated = JSON.parse(storage.get('ideavision.ideas.v12'));
 assert.deepEqual(migrated.slice(expectedAdditions),JSON.parse(oldCustom));
 load(); assert.equal(els.ideas.children.length,2+expectedAdditions);
 els.ideas.children[0].children[1].children[2].children[1].children[1].onclick();
 load(); assert.equal(els.ideas.children.length,1+expectedAdditions);
 assert.equal(els.ideas.children.some(x=>x.children[1].children[0].textContent===latestTitle),false);
 storage.clear(); storage.set(oldKey,JSON.stringify(migrated));
 load(); assert.equal(els.ideas.children.length,2+expectedAdditions);
 // Preserve a user's edited copy of the newly introduced ID without duplication.
 const editedLatest = {...migrated[0], title:'Edited latest concept', status:'Built', extra:'Kept'};
 storage.clear(); storage.set(oldKey,JSON.stringify([editedLatest,personal]));load();
 assert.deepEqual(JSON.parse(storage.get('ideavision.ideas.v12')).find(x=>x.id===editedLatest.id),editedLatest);
 storage.clear();storage.set(oldKey,'[]');load();assert.equal(els.ideas.children.length,expectedAdditions);
 load();assert.equal(els.ideas.children.length,expectedAdditions);
 for (const malformed of ['bad','null','{}','[{}]']) {
  storage.clear();storage.set(oldKey,malformed);load();
  assert.equal(storage.get(oldKey),malformed);assert.equal(storage.has('ideavision.ideas.v12'),false);
  assert.match(els.message.textContent,/could not be read/);
 }
 console.log(`PASS: v${version} upgrade preserves records, edits, deletions and backup; adds only later concepts once; rejects malformed data.`);
}
// Never fall back to an older valid version when the newest version is malformed.
storage.clear();storage.set('ideavision.ideas.v11','broken');storage.set('ideavision.ideas.v3',oldCustom);load();
assert.equal(storage.has('ideavision.ideas.v12'),false);assert.match(els.message.textContent,/could not be read/);
// An empty current-version notebook remains empty despite populated old backups.
storage.clear();storage.set('ideavision.ideas.v12','[]');storage.set('ideavision.ideas.v11',oldCustom);load();
assert.equal(els.ideas.children.length,0);
// A write failure leaves all original data untouched and still shows migrated ideas in memory.
storage.clear();storage.set('ideavision.ideas.v11',oldCustom);load({writeFails:true});
assert.equal(els.ideas.children.length,3);assert.equal(storage.get('ideavision.ideas.v11'),oldCustom);
assert.equal(storage.has('ideavision.ideas.v12'),false);assert.match(els.message.textContent,/could not be read/);
console.log('PASS: newest-version priority, empty current storage and failed migration writes preserve backups.');


