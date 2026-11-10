'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const KEY='ideavision.ideas.v12';
const original=[
 {id:'a',title:'Alpha',description:'First idea',icon:'✦',status:'New',extra:{note:'Keep me'}},
 {id:'b',title:'Beta',description:'Second idea',icon:'◉',status:'Exploring'},
 {id:'c',title:'Gamma',description:'Third idea',icon:'♧',status:'Built'}
];
function boot(value=JSON.stringify(original)){
 const storage=new Map([[KEY,value]]),els={},answers=[],prompts=[];let writes=0,focused;
 class Element{
  constructor(id){this.id=id;this.children=[];this.value='';this.hidden=false;this.textContent='';this.handlers={};}
  append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}setAttribute(){}
  addEventListener(k,fn){this.handlers[k]=fn;}focus(){focused=this.id;}setCustomValidity(value){this.invalid=value;}reportValidity(){}
  reset(){els.title.value='';els.description.value='';els.icon.value='✦';els.status.value='New';}click(){}
 }
 for(const id of ['title','description','icon','status','message','form','form-heading','save','cancel','search','filter','ideas','empty','count','export','undo-delete','delete-note','clear-filters','search-results','idea-sort'])els[id]=new Element(id);
 els.filter.value='all';els['idea-sort'].value='saved';els.icon.value='✦';els.status.value='New';
 const context=vm.createContext({document:{getElementById:id=>els[id],createElement:()=>new Element()},
  localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{writes++;storage.set(k,v);}},
  confirm:message=>{prompts.push(message);return answers.length?answers.shift():true;},
  crypto:require('node:crypto').webcrypto,URL,Blob,setTimeout});
 vm.runInContext(fs.readFileSync('./app.js','utf8'),context);
 const run=code=>vm.runInContext(code,context);
 return {els,storage,prompts,answers,writes:()=>writes,focused:()=>focused,run,
  edit:id=>run(`editIdea(${JSON.stringify(id)})`),remove:id=>run(`deleteIdea(${JSON.stringify(id)})`),
  cancel:()=>els.cancel.handlers.click(),submit:()=>els.form.handlers.submit({preventDefault(){}}),
  dirty:()=>run('hasUnsavedDraft()'),editing:()=>run('editing'),snapshot:()=>run('formSnapshot()')};
}
// Every form field is protected, including a new unsaved idea.
for(const [field,value] of [['title','Unsaved title'],['description','Unsaved description'],['icon','⚡'],['status','Built']]){
 const app=boot(),e=app.els;assert.equal(app.dirty(),false);e[field].value=value;
 const before=app.snapshot();app.answers.push(false);app.edit('b');
 assert.equal(app.snapshot(),before);assert.equal(app.editing(),null);assert.equal(app.prompts.length,1);
 assert.match(app.prompts[0],/Discard your unsaved form changes/);assert.equal(app.writes(),0);
 app.answers.push(true);app.edit('b');assert.equal(e.title.value,'Beta');assert.equal(app.editing(),'b');
 assert.equal(app.dirty(),false);assert.equal(app.storage.get(KEY),JSON.stringify(original));
}
let app=boot(),e=app.els;
app.edit('a');app.edit('b');assert.equal(app.prompts.length,0);assert.equal(app.dirty(),false);
app.cancel();assert.equal(app.prompts.length,0);assert.equal(app.editing(),null);assert.equal(app.dirty(),false);
// Repeated Edit clicks keep the current draft, even if a prompt would have been accepted.
app.edit('a');e.title.value='Alpha draft';e.description.value='Draft body';const draft=app.snapshot();
app.edit('a');app.edit('a');assert.equal(app.snapshot(),draft);assert.equal(app.prompts.length,0);assert.equal(app.focused(),'title');
// Rejecting a switch retains the edit identity so Save updates Alpha, not Beta.
app.answers.push(false);app.edit('b');assert.equal(app.editing(),'a');assert.equal(app.snapshot(),draft);
assert.equal(app.writes(),0);app.submit();
const saved=JSON.parse(app.storage.get(KEY));assert.equal(saved.length,3);assert.equal(saved[0].title,'Alpha draft');
assert.equal(saved[1].title,'Beta');assert.deepEqual(saved[0].extra,original[0].extra);assert.equal(app.dirty(),false);
app.edit('b');assert.equal(app.prompts.length,1);assert.equal(e.title.invalid,'');
// Rejecting Cancel edit retains all fields and controls; accepting it changes no stored record.
e.status.value='Built';const cancelDraft=app.snapshot();app.answers.push(false);app.cancel();
assert.equal(app.snapshot(),cancelDraft);assert.equal(app.editing(),'b');assert.equal(e.cancel.hidden,false);
const writes=app.writes();app.answers.push(true);app.cancel();
assert.equal(app.editing(),null);assert.equal(e.title.value,'');assert.equal(e.cancel.hidden,true);assert.equal(app.dirty(),false);
assert.equal(app.writes(),writes);assert.deepEqual(JSON.parse(app.storage.get(KEY)),saved);
// Reverting a field makes the edit clean; filters, sorting and unknown IDs do not discard drafts.
app.edit('b');e.description.value='Changed';e.description.value='Second idea';assert.equal(app.dirty(),false);
const promptCount=app.prompts.length;app.cancel();assert.equal(app.prompts.length,promptCount);
app.edit('a');e.title.value='Another draft';const retained=app.snapshot();
e.search.value='absent';e.search.handlers.input();e['idea-sort'].value='title';e['idea-sort'].handlers.change();e['clear-filters'].handlers.click();
app.edit('missing');assert.equal(app.snapshot(),retained);assert.equal(app.prompts.length,promptCount);
// A rejected edit switch does not disturb the previous deletion's Undo.
app.remove('c');const afterDeletion=app.storage.get(KEY);app.answers.push(false);app.edit('b');
assert.equal(app.storage.get(KEY),afterDeletion);e['undo-delete'].handlers.click();
assert.equal(app.snapshot(),retained);assert.equal(app.editing(),'a');assert.deepEqual(JSON.parse(app.storage.get(KEY)),saved);
// Deleting the active edited record warns once about its unsaved changes; Cancel preserves them.
app.answers.push(false);const beforeDelete=app.prompts.length;app.remove('a');
assert.equal(app.prompts.length,beforeDelete+1);assert.match(app.prompts.at(-1),/unsaved form changes will also be discarded/);
assert.equal(app.snapshot(),retained);assert.equal(app.editing(),'a');
app.answers.push(true);app.remove('a');assert.equal(app.prompts.length,beforeDelete+2);assert.equal(app.editing(),null);
assert.equal(app.dirty(),false);e['undo-delete'].handlers.click();assert.deepEqual(JSON.parse(app.storage.get(KEY)),saved);
// Invalid-title feedback must not follow an accepted switch to a valid saved idea.
app=boot();e=app.els;e.title.value=' ';app.submit();assert.ok(e.title.invalid);assert.equal(app.writes(),0);
app.answers.push(false);app.edit('a');assert.ok(e.title.invalid);app.answers.push(true);app.edit('a');assert.equal(e.title.invalid,'');
// Guard decisions never write or repair malformed storage.
app=boot('broken');e=app.els;e.title.value='In-memory draft';app.answers.push(false);app.edit('family-2026-11-06');
assert.equal(e.title.value,'In-memory draft');assert.equal(app.storage.get(KEY),'broken');assert.equal(app.writes(),0);
const html=fs.readFileSync('./index.html','utf8');assert.match(html,/id="draft-help"/);assert.match(html,/Drafts are not autosaved/);
console.log('PASS: new/edit draft guards, four fields, accepted/canceled switches and cancel-edit prompts, repeat Edit, edit identity, save/reset, validation, delete warning, undo and zero guard writes.');

