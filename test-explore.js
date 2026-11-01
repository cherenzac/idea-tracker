'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const data=require('./explore-data'),api=require('./explore');
assert.equal(data.length,50);assert.equal(new Set(data.map(p=>p.id)).size,50);assert.equal(new Set(data.map(p=>p.title)).size,50);
for(const p of data){assert.equal(p.status,'Idea');assert(api.safeSource(p.sourceUrl));assert(['Beginner','Intermediate','Advanced'].includes(p.difficulty));for(const k of ['title','description','category','buildTime','sourceLabel'])assert(p[k]);}
assert.equal(api.filterIdeas(data,'','all','all',[],false).length,50);
assert.equal(api.filterIdeas(data,'no-matching-project-here','all','all',[],false).length,0);
assert.equal(api.filterIdeas(data,'','AI & Agents','all',[],false).length,10);
assert.equal(api.filterIdeas(data,'','all','all',[data[0].id],true)[0],data[0]);
assert.deepEqual(api.cleanSaved([data[0].id,data[0].id,'not-real'],data),[data[0].id]);
assert.equal(api.safeSource('javascript:alert(1)'),false);assert.equal(api.safeSource('https://user:pass@example.com'),false);
class Element{constructor(){this.children=[];this.listeners={};this.attrs={};this.value='';this.checked=false;this.disabled=false;this.dataset={};this.textContent='';}append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,f){this.listeners[k]=f;}querySelectorAll(){return this.children;}fire(k){this.listeners[k]?.();}}
function run(broken=false){const els={};const get=id=>els[id]??=new Element();get('explore-level').value='all';const values={};const context={window:{IdeaVisionExplore:data},document:{getElementById:get,createElement:()=>new Element()},URL,localStorage:{getItem:()=>null,setItem:(k,v)=>{if(broken)throw Error('blocked');values[k]=v;}}};vm.runInNewContext(fs.readFileSync('./explore.js','utf8'),context);return{els,get,values};}
const {get,values}=run();assert.equal(get('explore-grid').children.length,12);assert(get('explore-count').textContent.startsWith('50 of 50'));
get('explore-next').fire('click');assert.equal(get('explore-page').textContent,'Page 2 of 5');
get('explore-grid').children[0].children[4].children[0].fire('click');assert.equal(JSON.parse(values['ideavision.saved-sparks.v1']).length,1);
get('explore-saved').checked=true;get('explore-saved').fire('change');assert.equal(get('explore-grid').children.length,1);get('explore-grid').children[0].children[4].children[0].fire('click');assert.equal(get('explore-surprise').disabled,true);
get('explore-clear').fire('click');assert.equal(get('explore-grid').children.length,12);get('explore-surprise').fire('click');assert.equal(get('explore-grid').children.length,1);get('explore-clear').fire('click');
get('explore-categories').children[1].fire('click');assert.equal(get('explore-grid').children.length,10);
const b=run(true);b.get('explore-grid').children[0].children[4].children[0].fire('click');assert(b.get('explore-message').textContent.includes('could not be saved'));
console.log('PASS: 50 sourced ideas, filters, pagination, favorites, surprise, empty state, unsafe links and storage failures.');
