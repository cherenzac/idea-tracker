'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
class Element{constructor(){this.handlers={};this.attrs={};this.hidden=false;this.children=[];this.value='';}addEventListener(k,f){this.handlers[k]=f;}setAttribute(k,v){this.attrs[k]=v;}append(...x){this.children.push(...x);}replaceChildren(...x){this.children=x;}focus(){this.focused=true;}}
const ids=['tab-ideas','tab-news','panel-ideas','panel-news','export','clear-news','news-feed','news-message','load-news','news-form','news-handle'];const els=Object.fromEntries(ids.map(id=>[id,new Element()]));let scripts=0;
vm.runInNewContext(fs.readFileSync(__dirname+'/channels.js','utf8'),{document:{getElementById:id=>els[id],createElement:()=>new Element(),head:{append:()=>scripts++}},window:{}});
els['tab-news'].handlers.click();assert.equal(els['panel-ideas'].hidden,true);assert.equal(els['panel-news'].hidden,false);assert.equal(els.export.hidden,true);assert.equal(scripts,0);
els['tab-news'].handlers.keydown({key:'Home',preventDefault(){}});assert.equal(els['panel-ideas'].hidden,false);assert.equal(els['tab-ideas'].focused,true);
els['news-handle'].value='https://bad.invalid';els['news-form'].handlers.submit({preventDefault(){}});assert.match(els['news-message'].textContent,/Enter a public/);assert.equal(scripts,0);
els['clear-news'].handlers.click();assert.equal(els['news-feed'].children.length,0);assert.match(els['news-message'].textContent,/cleared/);
console.log('PASS: channel switching, keyboard navigation, no automatic X load, invalid handle, clear preview.');
