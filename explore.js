'use strict';
(function(root){
 const KEY='ideavision.saved-sparks.v1',PAGE_SIZE=12;
 function filterIdeas(items,query,category,level,saved,onlySaved){const words=String(query).trim().toLowerCase().split(/\s+/).filter(Boolean);return items.filter(p=>(category==='all'||p.category===category)&&(level==='all'||p.difficulty===level)&&(!onlySaved||saved.includes(p.id))&&words.every(w=>[p.title,p.description,p.category,p.difficulty].join(' ').toLowerCase().includes(w)));}
 function cleanSaved(ids,items){return Array.isArray(ids)?[...new Set(ids)].filter(id=>items.some(p=>p.id===id)):[];}
 function safeSource(url){try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
 if(typeof module!=='undefined'){module.exports={filterIdeas,cleanSaved,safeSource,PAGE_SIZE};return;}
 const items=root.IdeaVisionExplore||[],el=id=>document.getElementById(id);
 let category='all',page=0,saved=[];
 try{saved=cleanSaved(JSON.parse(localStorage.getItem(KEY)||'[]'),items);}catch{el('explore-message').textContent='Favorites are unavailable in this browser. You can still explore everything.';}
 function remember(){try{localStorage.setItem(KEY,JSON.stringify(saved));el('explore-message').textContent='Saved sparks updated on this device.';}catch{el('explore-message').textContent='Favorites work for this visit, but could not be saved on this device.';}}
 function matches(){return filterIdeas(items,el('explore-search').value,category,el('explore-level').value,saved,el('explore-saved').checked);}
 function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
 function render(){
  const found=matches(),pages=Math.max(1,Math.ceil(found.length/PAGE_SIZE));page=Math.min(page,pages-1);
  el('explore-grid').replaceChildren();
  found.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE).forEach(p=>{
   const card=node('article','spark-card');card.dataset.category=p.category;
   const top=node('div','spark-top');top.append(node('span','spark-number',String(items.indexOf(p)+1).padStart(2,'0')),node('span','spark-category',p.category));
   const title=node('h2','',p.title),description=node('p','spark-description',p.description),meta=node('p','spark-meta',p.difficulty+' · '+p.buildTime);
   const actions=node('div','spark-actions'),save=node('button','spark-save',saved.includes(p.id)?'♥ Saved':'♡ Save');save.type='button';save.setAttribute('aria-label',(saved.includes(p.id)?'Unsave ':'Save ')+p.title);save.setAttribute('aria-pressed',String(saved.includes(p.id)));save.addEventListener('click',()=>{saved=saved.includes(p.id)?saved.filter(id=>id!==p.id):[...saved,p.id];remember();render();});
   actions.append(save);if(safeSource(p.sourceUrl)){const link=node('a','',p.sourceLabel+' ↗');link.href=p.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Inspiration for '+p.title+': '+p.sourceLabel+' (opens a new tab)');actions.append(link);}
   card.append(top,title,description,meta,actions);el('explore-grid').append(card);
  });
  if(!found.length)el('explore-grid').append(node('p','explore-empty','No sparks match yet. Try another search or clear the filters.'));
  el('explore-count').textContent=found.length+' of '+items.length+' concepts'+(found.length?' · showing '+(page*PAGE_SIZE+1)+'–'+Math.min((page+1)*PAGE_SIZE,found.length):'');
  el('explore-page').textContent='Page '+(page+1)+' of '+pages;el('explore-prev').disabled=page===0;el('explore-next').disabled=page===pages-1;el('explore-surprise').disabled=!found.length;
 }
 ['all',...new Set(items.map(p=>p.category))].forEach(c=>{const b=node('button','',c==='all'?'All sparks':c);b.type='button';b.setAttribute('aria-pressed',String(c===category));b.addEventListener('click',()=>{category=c;page=0;el('explore-categories').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});el('explore-categories').append(b);});
 el('explore-search').addEventListener('input',()=>{page=0;render();});['explore-level','explore-saved'].forEach(id=>el(id).addEventListener('change',()=>{page=0;render();}));
 el('explore-prev').addEventListener('click',()=>{page--;render();});el('explore-next').addEventListener('click',()=>{page++;render();});
 el('explore-clear').addEventListener('click',()=>{category='all';page=0;el('explore-search').value='';el('explore-level').value='all';el('explore-saved').checked=false;el('explore-categories').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));render();});
 el('explore-surprise').addEventListener('click',()=>{const found=matches();if(!found.length)return;el('explore-search').value=found[Math.floor(Math.random()*found.length)].title;page=0;render();});
 render();
})(typeof window!=='undefined'?window:globalThis);
