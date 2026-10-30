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
function load(){
 els=Object.fromEntries(['title','description','icon','status','message','form','form-heading','save','cancel','search','filter','ideas','empty','count','export'].map(x=>[x,new Element()]));
 els.filter.value='all';els.icon.value='✦';els.status.value='New';
 const context={document:{getElementById:id=>els[id],createElement:()=>new Element()},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},crypto:require('node:crypto').webcrypto,confirm:()=>true,URL,Blob,setTimeout};
 vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8'),context);return context;
}
function submit(){els.form.handlers.submit({preventDefault(){}});}
load();assert.equal(els.ideas.children.length,11);
els.title.value='  Test signal  ';els.description.value='<script>not executable</script>';submit();
assert.equal(els.ideas.children.length,12);assert.match(els.message.textContent,/Saved/);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Test signal');
assert.equal(els.ideas.children[0].children[1].children[1].textContent,'<script>not executable</script>');
let actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[0].onclick();
assert.equal(els.title.value,'Test signal');els.title.value='Changed';els.status.value='Built';submit();
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Changed');
actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[0].onclick();els.title.value='Unsaved';els.cancel.handlers.click();
assert.equal(els.title.value,'');assert.equal(els.cancel.hidden,true);
els.filter.value='Built';els.filter.handlers.change();assert.equal(els.ideas.children.length,1);
els.search.value='absent';els.search.handlers.input();assert.equal(els.ideas.children.length,0);assert.equal(els.empty.hidden,false);
load();assert.equal(els.ideas.children.length,12);assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Changed');
actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[1].onclick();assert.equal(els.ideas.children.length,11);
load();assert.equal(els.ideas.children.length,11);
els.title.value='   ';submit();assert.equal(els.title.invalid,'Please give your idea a title.');
storage.set('ideavision.ideas.v3','invalid');load();assert.match(els.message.textContent,/could not be read/);els.title.value='In memory';submit();assert.equal(storage.get('ideavision.ideas.v3'),'invalid');assert.match(els.message.textContent,/Not saved/);
storage.clear();
const oldSeeds = vm.runInNewContext(fs.readFileSync(__dirname+'/app.js','utf8').split('const $ = id')[0] + '\nlegacySeeds;');
const edited = {...oldSeeds[1], title:'My edited example'};
const personal = {id:'personal-example', title:'User-created idea',description:'Generic test text',icon:'✦',status:'New'};
const legacy = JSON.stringify([oldSeeds[0], edited, personal]);
storage.set('ideavision.ideas.v1',legacy);load();
assert.equal(els.ideas.children.length,13);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'My edited example');
assert.equal(els.ideas.children[1].children[1].children[0].textContent,'User-created idea');
assert.equal(storage.get('ideavision.ideas.v1'),legacy);
load();assert.equal(els.ideas.children.length,13);
storage.set('ideavision.ideas.v3','[]');load();assert.equal(els.ideas.children.length,0);
console.log('PASS: v1 migration preserves user entries, edited examples and old backup; no duplicate reseeding; empty v3 stays empty.');
console.log('PASS: initial render, create, safe text, edit, cancel, search/filter, empty state, delete, reload, blank title, corrupt storage preservation.');

// A returning v2 visitor receives only the new concept, preserving edits/deletions.
storage.clear();
const oldCustom = JSON.stringify([personal, {...oldSeeds[0], title:'Edited and kept', status:'Built'}]);
storage.set('ideavision.ideas.v2', oldCustom);
load(); assert.equal(els.ideas.children.length,3);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Toybox Tales');
assert.equal(storage.get('ideavision.ideas.v2'),oldCustom);
load(); assert.equal(els.ideas.children.length,3);
let nightlyActions=els.ideas.children[0].children[1].children[2].children[1];
nightlyActions.children[1].onclick(); load(); assert.equal(els.ideas.children.length,2);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,personal.title);
storage.clear();storage.set('ideavision.ideas.v2','[]');load();assert.equal(els.ideas.children.length,1);
load();assert.equal(els.ideas.children.length,1);
storage.clear();storage.set('ideavision.ideas.v2','bad');load();
assert.equal(storage.get('ideavision.ideas.v2'),'bad');assert.equal(storage.has('ideavision.ideas.v3'),false);
assert.match(els.message.textContent,/could not be read/);
console.log('PASS: v2 nightly upgrade adds exactly one idea; user edits/deletions, backups, repeated loads and malformed data are preserved.');
