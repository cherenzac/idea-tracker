'use strict';
(function(root){
 const KEY='ideavision.recent-projects.v1';
 function validProjects(items){const seen=new Set();return items.filter(p=>{if(!p||!p.id||seen.has(p.id)||!p.title)return false;const valid=p.panel||(/^https:\/\//.test(p.url||'')&&!/[\s]/.test(p.url));if(valid)seen.add(p.id);return !!valid;});}
 function recentIds(ids,projects){return [...new Set(ids)].filter(id=>projects.some(p=>p.id===id)).slice(0,5);}
 function searchProjects(projects,query){const words=query.trim().toLowerCase().split(/\s+/);return projects.filter(p=>words.every(w=>[p.title,p.description,p.category,p.status,...(p.tags||[])].join(' ').toLowerCase().includes(w)));}
 if(typeof module!=='undefined'){module.exports={validProjects,recentIds,searchProjects};return;}
 const projects=validProjects(root.IdeaVisionProjects||[]),el=id=>document.getElementById(id);
 let recent=[],current='ideas';try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(saved))recent=recentIds(saved,projects);}catch{/* Corrupt/unavailable navigation storage must not affect notebook data. */}
 function remember(id){recent=recentIds([id,...recent],projects);try{localStorage.setItem(KEY,JSON.stringify(recent));}catch{el('navigation-status').textContent='Recent projects cannot be saved in this browser; navigation still works.';}renderRecent();}
 function activate(project,record=true){
  if(!project.panel){remember(project.id);return;}
  projects.filter(p=>p.panel).forEach(p=>{el(p.panel).hidden=p.id!==project.id;});current=project.id;document.querySelector('.explore-tab')?.setAttribute('aria-current',current==='explore'?'page':'false');el('export').hidden=current!=='ideas';
  if(record)remember(current);else renderRecent();
  el('project-picker').value=current;
 }
 function launchControl(project){const control=document.createElement(project.panel?'button':'a');control.textContent=project.title+(project.panel?'':' ↗');if(project.panel){control.type='button';if(current===project.id)control.setAttribute('aria-current','page');control.addEventListener('click',()=>{location.hash='project='+encodeURIComponent(project.id);activate(project);});}else{control.href=project.url;control.target='_blank';control.rel='noopener noreferrer';control.addEventListener('click',()=>remember(project.id));}return control;}
 function renderRecent(){el('recent-projects').replaceChildren();const ids=recent.length?recent:['ideas'];ids.forEach(id=>{const p=projects.find(p=>p.id===id);if(p)el('recent-projects').append(launchControl(p));});}
 function renderDirectory(){const matches=searchProjects(projects,el('project-search').value);el('project-directory').replaceChildren();matches.forEach(p=>{const card=document.createElement('article');card.className='project-card';const tag=document.createElement('span');tag.className='badge';tag.textContent=p.category+' / '+p.status+(p.panel?' / On this site':' / External site');const detail=document.createElement('p');detail.textContent=p.description;card.append(tag,launchControl(p),detail);el('project-directory').append(card);});el('project-results').textContent=matches.length+' of '+projects.length+' projects'+(matches.length?'':' — try another search.');}
 projects.forEach(p=>{const option=document.createElement('option');option.value=p.id;option.textContent=p.title+' · '+p.status;el('project-picker').append(option);});
 el('project-picker').addEventListener('change',()=>{const p=projects.find(p=>p.id===el('project-picker').value);if(!p)return;if(p.panel){location.hash='project='+encodeURIComponent(p.id);activate(p);}else{el('project-search').value=p.title;renderDirectory();el('navigation-status').textContent='Use the external site link below to open '+p.title+'.';}});
 el('project-search').addEventListener('input',renderDirectory);
 function fromHash(){let id;try{id=decodeURIComponent(location.hash.replace(/^#project=/,''));}catch{id='ideas';}const p=projects.find(p=>p.id===id&&p.panel)||projects.find(p=>p.id==='ideas');if(p)activate(p);}
 root.addEventListener('hashchange',fromHash);el('project-count').textContent=projects.length+' PROJECTS';renderDirectory();fromHash();
})(typeof window!=='undefined'?window:globalThis);

