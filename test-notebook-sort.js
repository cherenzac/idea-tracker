'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const KEY='ideavision.ideas.v7';
const records=[
 {id:'ten',title:'Item 10',description:'Paper project',icon:'✦',status:'Built',extra:'Keep me'},
 {id:'a',title:'alpha',description:'Paper project',icon:'◉',status:'Built'},
 {id:'c',title:'Café',description:'Paper project',icon:'♧',status:'New'},
 {id:'a2',title:'ALPHA',description:'Paper project',icon:'◉',status:'Exploring'},
 {id:'two',title:'Item 2',description:'Paper project',icon:'✦',status:'New'},
 {id:'b',title:'Beta',description:'Paper project',icon:'♧',status:'Exploring'}
];
function boot(value=JSON.stringify(records),options={}){
 const storage=new Map([[KEY,value]]);let writes=0,exportedBlob,download,focused;
 const els={};
 class Element{
  constructor(id){this.id=id;this.children=[];this.value='';this.hidden=false;this.textContent='';this.handlers={};this.attrs={};}
  append(...items){this.children.push(...items);}replaceChildren(...items){this.children=items;}setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(k,fn){this.handlers[k]=fn;}focus(){focused=this.id;}setCustomValidity(){}reportValidity(){}
  reset(){els.title.value='';els.description.value='';els.icon.value='✦';els.status.value='New';}
  click(){download={href:this.href,name:this.download};}
 }
 for(const id of ['title','description','icon','status','message','form','form-heading','save','cancel','search','filter','ideas','empty','count','export','undo-delete','delete-note','clear-filters','search-results','idea-sort'])els[id]=new Element(id);
 els.filter.value='all';els['idea-sort'].value='saved';els.icon.value='✦';els.status.value='New';
 const context=vm.createContext({document:{getElementById:id=>els[id],createElement:()=>new Element()},
  localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{writes++;if(options.writeFails)throw new Error('Unavailable');storage.set(k,v);}},
  crypto:require('node:crypto').webcrypto,confirm:()=>true,Blob,setTimeout:fn=>fn(),
  URL:{createObjectURL:blob=>{exportedBlob=blob;return 'blob:qa';},revokeObjectURL(){}}});
 vm.runInContext(fs.readFileSync('./app.js','utf8'),context);
 return {els,storage,writes:()=>writes,focused:()=>focused,run:s=>vm.runInContext(s,context),
  sort:value=>{els['idea-sort'].value=value;els['idea-sort'].handlers.change();},
  search:value=>{els.search.value=value;els.search.handlers.input();},
  filter:value=>{els.filter.value=value;els.filter.handlers.change();},
  titles:()=>els.ideas.children.map(card=>card.children[1].children[0].textContent),
  submit:()=>els.form.handlers.submit({preventDefault(){}}),
  export:async()=>{els.export.handlers.click();assert.deepEqual(download,{href:'blob:qa',name:'ideavision-ideas.json'});return JSON.parse(await exportedBlob.text());}};
}
(async()=>{
 let app=boot(),e=app.els;
 assert.deepEqual(app.titles(),records.map(x=>x.title));
 app.sort('title');assert.deepEqual(app.titles(),['alpha','ALPHA','Beta','Café','Item 2','Item 10']);
 app.sort('title');assert.deepEqual(app.titles(),['alpha','ALPHA','Beta','Café','Item 2','Item 10']);
 app.sort('status');assert.deepEqual(app.titles(),['Café','Item 2','ALPHA','Beta','Item 10','alpha']);
 app.sort('saved');assert.deepEqual(app.titles(),records.map(x=>x.title));
 app.sort('unknown');assert.deepEqual(app.titles(),records.map(x=>x.title));
 app.sort('title');app.search('paper item');assert.deepEqual(app.titles(),['Item 2','Item 10']);
 app.filter('Built');assert.deepEqual(app.titles(),['Item 10']);assert.equal(e['search-results'].textContent,'Showing 1 of 6 ideas.');
 app.search('missing');assert.equal(e.empty.hidden,false);app.sort('status');assert.deepEqual(app.titles(),[]);
 e['clear-filters'].handlers.click();assert.equal(e['idea-sort'].value,'status');assert.equal(app.focused(),'search');
 assert.equal(app.writes(),0);assert.equal(app.storage.get(KEY),JSON.stringify(records));
 assert.deepEqual(await app.export(),records);
 // Editing the first sorted card updates its identity, not its display index.
 app.sort('title');e.ideas.children[0].children[1].children[2].children[1].children[0].onclick();
 assert.equal(e.title.value,'alpha');e.title.value='Zebra draft';e.description.value='Unsaved description';
 app.sort('status');app.search('missing');app.sort('saved');e['clear-filters'].handlers.click();
 assert.equal(e.title.value,'Zebra draft');assert.equal(e.description.value,'Unsaved description');
 assert.equal(e['form-heading'].textContent,'Fine-tune your idea');assert.equal(app.writes(),0);
 app.submit();const edited=JSON.parse(app.storage.get(KEY));
 assert.deepEqual(edited.map(x=>x.id),records.map(x=>x.id));assert.equal(edited.find(x=>x.id==='a').title,'Zebra draft');
 assert.equal(edited[0].extra,'Keep me');
 // Undo restores saved order even while the view is sorted; another draft stays intact.
 app.sort('status');e.ideas.children[0].children[1].children[2].children[1].children[1].onclick();
 assert.equal(JSON.parse(app.storage.get(KEY)).some(x=>x.id==='c'),false);
 e.title.value='Unsaved new idea';const afterDelete=app.writes();app.sort('title');app.sort('saved');
 assert.equal(app.writes(),afterDelete);e['undo-delete'].handlers.click();
 assert.equal(e.title.value,'Unsaved new idea');assert.deepEqual(JSON.parse(app.storage.get(KEY)),edited);
 app.sort('title');assert.deepEqual(await app.export(),edited);
 const reloaded=boot(app.storage.get(KEY));assert.equal(reloaded.els['idea-sort'].value,'saved');
 assert.deepEqual(reloaded.titles(),edited.map(x=>x.title));
 // A new saved entry retains insertion order, even when its visible position differs.
 app=boot();app.sort('title');app.els.title.value='Zulu';app.submit();
 assert.equal(app.titles().at(-1),'Zulu');assert.equal(JSON.parse(app.storage.get(KEY))[0].title,'Zulu');
 app.sort('saved');assert.equal(app.titles()[0],'Zulu');
 // Empty, malformed and unavailable storage are not changed by sorting.
 for(const value of ['[]','broken']){
  app=boot(value);app.sort('title');app.sort('status');app.sort('saved');
  assert.equal(app.storage.get(KEY),value);assert.equal(app.writes(),0);
  if(value==='[]')assert.equal(app.titles().length,0);
 }
 app=boot(JSON.stringify(records),{writeFails:true});app.sort('status');app.sort('title');assert.equal(app.writes(),0);
 const html=fs.readFileSync('./index.html','utf8');
 assert.equal((html.match(/id="idea-sort"/g)||[]).length,1);assert.match(html,/label for="idea-sort"/);
 assert.match(html,/id="idea-sort" aria-describedby="sort-help"/);assert.match(html,/<option value="saved">Saved order/);
 console.log('PASS: title/status/saved order, natural numbers, stable ties, filters, repeated sorting, edit identity, drafts, undo, export order, reload and zero storage writes.');
})().catch(error=>{console.error(error);process.exitCode=1;});
