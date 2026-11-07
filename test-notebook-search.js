'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const KEY='ideavision.ideas.v9';
const records=[
 {id:'a',title:'Paper Café',description:'A robot made from folded paper.',icon:'✦',status:'Built'},
 {id:'b',title:'Robot Route Coach',description:'Pretend arrows cross a toy grid.',icon:'◉',status:'New'},
 {id:'c',title:'Board Game',description:'Fair scores using paper tokens.',icon:'♧',status:'Exploring'}
];
function boot(value=JSON.stringify(records)){
 const storage=new Map([[KEY,value]]);let writes=0;let focused;
 const els={};
 class Element{
  constructor(id){this.id=id;this.children=[];this.value='';this.hidden=false;this.textContent='';this.handlers={};this.attrs={};}
  append(...items){this.children.push(...items);}replaceChildren(...items){this.children=items;}setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(k,fn){this.handlers[k]=fn;}focus(){focused=this.id;}setCustomValidity(){}reportValidity(){}
  reset(){els.title.value='';els.description.value='';els.icon.value='✦';els.status.value='New';}click(){}
 }
 for(const id of ['title','description','icon','status','message','form','form-heading','save','cancel','search','filter','ideas','empty','count','export','undo-delete','delete-note','clear-filters','search-results','idea-sort'])els[id]=new Element(id);
 els['idea-sort'].value='saved';els.filter.value='all';els.icon.value='✦';els.status.value='New';
 const context=vm.createContext({document:{getElementById:id=>els[id],createElement:()=>new Element()},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{writes++;storage.set(k,v);}},crypto:require('node:crypto').webcrypto,confirm:()=>true,URL,Blob,setTimeout});
 vm.runInContext(fs.readFileSync('./app.js','utf8'),context);
 return {els,storage,writes:()=>writes,focused:()=>focused,run:s=>vm.runInContext(s,context),search:q=>{els.search.value=q;els.search.handlers.input();},filter:status=>{els.filter.value=status;els.filter.handlers.change();},clear:()=>els['clear-filters'].handlers.click(),submit:()=>els.form.handlers.submit({preventDefault(){}})};
}
let app=boot(),e=app.els;
const titles=()=>e.ideas.children.map(card=>card.children[1].children[0].textContent);
assert.equal(e['clear-filters'].disabled,true);assert.equal(e['search-results'].textContent,'Showing 3 of 3 ideas.');
app.search('  PAPER\t ROBOT  ');assert.deepEqual(titles(),['Paper Café']);
assert.equal(e['search-results'].textContent,'Showing 1 of 3 ideas.');assert.equal(e['clear-filters'].disabled,false);
app.search('ROBOT built');assert.deepEqual(titles(),['Paper Café']);
app.search('café folded');assert.deepEqual(titles(),['Paper Café']);
app.search('grid route');assert.deepEqual(titles(),['Robot Route Coach']);
app.search('paper');app.filter('Exploring');assert.deepEqual(titles(),['Board Game']);
app.filter('New');assert.equal(titles().length,0);assert.equal(e.empty.hidden,false);assert.match(e.empty.textContent,/No ideas match/);
assert.equal(e['search-results'].textContent,'Showing 0 of 3 ideas.');assert.equal(e.count.textContent,'3 SIGNALS');
app.clear();assert.equal(e.filter.value,'all');assert.equal(e.search.value,'');assert.equal(titles().length,3);
assert.equal(e.empty.hidden,true);assert.equal(e['clear-filters'].disabled,true);assert.equal(app.focused(),'search');
app.clear();app.search(' \n\t ');assert.equal(titles().length,3);assert.equal(e['clear-filters'].disabled,false);app.clear();
assert.equal(app.writes(),0);assert.equal(app.storage.get(KEY),JSON.stringify(records));
// Clearing a search must not cancel an edit or destroy its unsaved form text.
app.run("editIdea('a')");e.title.value='Unsaved robot draft';e.description.value='Unsaved description';
app.search('missing');app.filter('New');app.clear();
assert.equal(e.title.value,'Unsaved robot draft');assert.equal(e.description.value,'Unsaved description');
assert.equal(e['form-heading'].textContent,'Fine-tune your idea');assert.equal(app.writes(),0);
app.submit();const saved=JSON.parse(app.storage.get(KEY));assert.equal(saved.length,3);assert.equal(saved[0].id,'a');assert.equal(saved[0].title,'Unsaved robot draft');
// Clearing filters must retain last deletion recovery and must not persist new state.
app.run("deleteIdea('b')");const writesAfterDelete=app.writes();app.search('missing');app.clear();
assert.equal(app.writes(),writesAfterDelete);e['undo-delete'].handlers.click();assert.equal(JSON.parse(app.storage.get(KEY)).length,3);
assert.equal(e['search-results'].textContent,'Showing 3 of 3 ideas.');
// Empty current-version storage remains empty; no-match text is not misleading.
app=boot('[]');e=app.els;assert.equal(e['search-results'].textContent,'Showing 0 of 0 ideas.');
assert.match(e.empty.textContent,/notebook is empty/);app.search('robot');app.clear();assert.equal(app.storage.get(KEY),'[]');assert.equal(app.writes(),0);
app=boot(JSON.stringify([records[0]]));e=app.els;assert.equal(e['search-results'].textContent,'Showing 1 of 1 idea.');
app.search('absent');assert.equal(e['search-results'].textContent,'Showing 0 of 1 idea.');
// Malformed saved data stays untouched even while searching in-memory starter ideas.
app=boot('invalid');app.search('robot route');app.filter('New');app.clear();assert.equal(app.storage.get(KEY),'invalid');assert.equal(app.writes(),0);
const html=fs.readFileSync('./index.html','utf8');
for(const id of ['search-help','search-results','clear-filters'])assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);
assert.match(html,/aria-describedby="search-help"/);assert.match(html,/id="search-results"[^>]*aria-live="polite"/);
console.log('PASS: multi-term/case/whitespace/cross-field/status search, counts, distinct empty states, clear/repeat/focus, drafts, edit target, undo and zero storage writes.');

