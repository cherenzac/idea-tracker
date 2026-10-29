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
load();assert.equal(els.ideas.children.length,3);
els.title.value='  Test signal  ';els.description.value='<script>not executable</script>';submit();
assert.equal(els.ideas.children.length,4);assert.match(els.message.textContent,/Saved/);
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Test signal');
assert.equal(els.ideas.children[0].children[1].children[1].textContent,'<script>not executable</script>');
let actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[0].onclick();
assert.equal(els.title.value,'Test signal');els.title.value='Changed';els.status.value='Built';submit();
assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Changed');
actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[0].onclick();els.title.value='Unsaved';els.cancel.handlers.click();
assert.equal(els.title.value,'');assert.equal(els.cancel.hidden,true);
els.filter.value='Built';els.filter.handlers.change();assert.equal(els.ideas.children.length,1);
els.search.value='absent';els.search.handlers.input();assert.equal(els.ideas.children.length,0);assert.equal(els.empty.hidden,false);
load();assert.equal(els.ideas.children.length,4);assert.equal(els.ideas.children[0].children[1].children[0].textContent,'Changed');
actions=els.ideas.children[0].children[1].children[2].children[1];actions.children[1].onclick();assert.equal(els.ideas.children.length,3);
load();assert.equal(els.ideas.children.length,3);
els.title.value='   ';submit();assert.equal(els.title.invalid,'Please give your idea a title.');
storage.set('ideavision.ideas.v1','invalid');load();assert.match(els.message.textContent,/could not be read/);els.title.value='In memory';submit();assert.equal(storage.get('ideavision.ideas.v1'),'invalid');assert.match(els.message.textContent,/Not saved/);
console.log('PASS: initial render, create, safe text, edit, cancel, search/filter, empty state, delete, reload, blank title, corrupt storage preservation.');
