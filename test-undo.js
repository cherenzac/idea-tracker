'use strict';
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const KEY = 'ideavision.ideas.v15';
const original = [
 {id:'a',title:'First',description:'Original description',icon:'◉',status:'Built',extra:'Preserve me'},
 {id:'b',title:'Second',description:'Second description',icon:'✦',status:'New'},
 {id:'c',title:'Third',description:'Third description',icon:'♧',status:'Exploring'}
];
function boot(storage, options = {}) {
 let focused = null;
 class Element {
  constructor(id){this.id=id;this.children=[];this.value='';this.hidden=id==='undo-delete';this.textContent='';this.handlers={};this.attrs={};}
  append(...x){this.children.push(...x);} replaceChildren(...x){this.children=x;} setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(k,fn){this.handlers[k]=fn;} focus(){focused=this.id;} setCustomValidity(){} reportValidity(){}
  reset(){els.title.value='';els.description.value='';els.icon.value='✦';els.status.value='New';} click(){}
 }
 const ids=['title','description','icon','status','message','form','form-heading','save','cancel','search','filter','ideas','empty','count','export','undo-delete','delete-note','clear-filters','search-results','idea-sort'];
 const els = Object.fromEntries(ids.map(id=>[id,new Element(id)]));
 els['idea-sort'].value='saved';els.filter.value='all';els.icon.value='✦';els.status.value='New';
 const context = vm.createContext({document:{getElementById:id=>els[id],createElement:()=>new Element()},
  localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{if(options.writeFails)throw new Error('full');storage.set(k,v);}},
  crypto:require('node:crypto').webcrypto,confirm:()=>options.confirm!==false,URL,Blob,setTimeout});
 vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);
 return {els, run:code=>vm.runInContext(code,context), focused:()=>focused,
  submit:()=>els.form.handlers.submit({preventDefault(){}}), undo:()=>els['undo-delete'].handlers.click()};
}
const storage = new Map([[KEY,JSON.stringify(original)]]);
let app=boot(storage), e=app.els;
assert.equal(e['undo-delete'].hidden,true);
const remove = e.ideas.children[0].children[1].children[2].children[1].children[1];
remove.onclick();
assert.equal(e['undo-delete'].hidden,false);assert.equal(app.focused(),'undo-delete');
assert.deepEqual(JSON.parse(storage.get(KEY)),original.slice(1));
app.undo();
assert.deepEqual(JSON.parse(storage.get(KEY)),original);assert.equal(e['undo-delete'].hidden,true);
assert.equal(app.focused(),'search');app.undo();assert.deepEqual(JSON.parse(storage.get(KEY)),original);

// Canceling another deletion keeps the prior undo; only latest confirmed deletion is restored.
const options={};app=boot(storage,options);app.run("deleteIdea('a')");
options.confirm=false;app.run("deleteIdea('b')");app.undo();assert.deepEqual(JSON.parse(storage.get(KEY)),original);
options.confirm=true;app.run("deleteIdea('a');deleteIdea('b')");app.undo();
assert.deepEqual(JSON.parse(storage.get(KEY)),original.slice(1));
app=boot(storage);assert.equal(app.els['undo-delete'].hidden,true);app.undo();assert.deepEqual(JSON.parse(storage.get(KEY)),original.slice(1));

// Undo restores full fields and leaves another edit, new idea and unsaved form alone.
storage.set(KEY,JSON.stringify(original));app=boot(storage);e=app.els;app.run("deleteIdea('b');editIdea('a')");
e.title.value='Edited first';app.submit();e.title.value='Added later';app.submit();
app.run("editIdea('c')");e.title.value='Unsaved draft';
e.filter.value='Built';e.filter.handlers.change();e.search.value='Edited';e.search.handlers.input();
app.undo();assert.equal(e.title.value,'Unsaved draft');assert.equal(e['form-heading'].textContent,'Fine-tune your idea');
assert.equal(e.filter.value,'Built');assert.equal(e.search.value,'Edited');assert.equal(e.ideas.children.length,1);
const restored=JSON.parse(storage.get(KEY));assert.equal(restored.length,4);
assert.deepEqual(restored.slice(1).map(x=>x.id),['a','b','c']);
assert.deepEqual(restored.find(x=>x.id==='b'),original[1]);assert.equal(restored.find(x=>x.id==='a').title,'Edited first');
assert.equal(restored.find(x=>x.id==='a').extra,'Preserve me');assert.equal(restored.find(x=>x.id==='c').title,'Third');
app.submit();assert.equal(JSON.parse(storage.get(KEY)).find(x=>x.id==='c').title,'Unsaved draft');

// Deleting the entry being edited cancels that edit. Unknown IDs and repeated stale clicks are harmless.
app.run("editIdea('c');deleteIdea('c');deleteIdea('c');deleteIdea('missing')");
assert.equal(e.title.value,'');assert.equal(e.cancel.hidden,true);app.undo();
assert.equal(JSON.parse(storage.get(KEY)).filter(x=>x.id==='c').length,1);

// A failed write never overwrites saved data, and undo still works in memory for export.
storage.set(KEY,JSON.stringify(original));app=boot(storage,{writeFails:true});
app.run("deleteIdea('a')");app.undo();assert.equal(app.els.ideas.children.length,3);
assert.equal(storage.get(KEY),JSON.stringify(original));assert.match(app.els.message.textContent,/Not saved/);
storage.set(KEY,'broken');app=boot(storage);app.run("deleteIdea('family-2026-11-03')");app.undo();
assert.equal(storage.get(KEY),'broken');assert.equal(app.els.ideas.children.length,23);
assert.match(app.els.message.textContent,/Not saved/);
console.log('PASS: delete/undo UI, original fields/order, repeated calls, cancellation, latest-only recovery, reload expiry, filters, unsaved edits, additions, storage errors and corrupt-data preservation.');


