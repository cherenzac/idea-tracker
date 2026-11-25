'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const api=require('./daily-insights/insights-app');
const published=require('./daily-insights/insights');
assert.equal(api.validateEntries(published).length,published.length);
assert.ok(published.length>=1);
assert.equal(new Set(published.map(entry=>entry.date)).size,published.length,'Publish at most one insight per date.');
const originalEntry=published.find(entry=>entry.id==='2026-11-03-evidence-and-authority');
assert.ok(originalEntry);assert.equal(originalEntry.date,'2026-11-03');
assert.equal(originalEntry.kind,'original');assert.equal(new Set(published.map(x=>x.id)).size,published.length);
assert.equal(api.validDate('2026-02-29'),false);assert.equal(api.validDate('2024-02-29'),true);
assert.equal(api.validDate('2026-13-01'),false);assert.equal(api.validDate('2026-1-01'),false);
assert.equal(api.formatDate('2026-11-03'),'November 3, 2026');
for(const url of ['javascript:alert(1)','http://example.com','https://user:password@example.com/','https://trusted.example@evil.example/','data:text/html,test','not a url'])assert.equal(api.safeSource(url),null);
assert.equal(api.safeSource('https://example.com/note'),'https://example.com/note');
const sample={...originalEntry,id:'2026-11-02-sample',date:'2026-11-02',title:'Sample',summary:'A fictional retrieval test.',topics:['MCP'],kind:'source',source:{name:'Example source',url:'https://example.com/note'}};
assert.equal(api.validateEntries([sample]).length,1);
for(const invalid of [{...sample,source:undefined},{...sample,source:{name:'No URL'}},{...sample,kind:'unknown'},{...sample,date:'2026-02-30'},{...sample,topics:['Mystery']},{...sample,summary:''},{...sample,title:' '},{...sample,summary:'x'.repeat(361)},{...sample,id:'unsafe<id>'},{...sample,date:'2026-11-01'}])assert.equal(api.validateEntries([invalid]).length,0);
assert.equal(api.validateEntries(null).length,0);assert.equal(api.validateEntries([sample,sample]).length,1);
assert.equal(api.validateEntries([sample,originalEntry])[0].date,'2026-11-03');
assert.equal(api.filterEntries([sample,originalEntry],'RETRIEVED permissions').length,1);
assert.equal(api.filterEntries([sample,originalEntry],'','MCP')[0].id,sample.id);
assert.equal(api.filterEntries([sample,originalEntry],'fictional','RAG').length,0);
assert.equal(api.filterEntries([sample,originalEntry],'November 3 2026')[0].id,originalEntry.id);
assert.equal(api.filterEntries([sample,originalEntry],'november 2026','MCP')[0].id,sample.id);
assert.equal(api.filterEntries([sample,originalEntry],'2026-11-03')[0].id,originalEntry.id);
assert.equal(api.filterEntries([sample,originalEntry],'December').length,0);
assert.equal(api.filterEntries([sample,originalEntry],'November permissions')[0].id,originalEntry.id);
const fixture=Array.from({length:25},(_,i)=>({...sample,id:`2026-10-${String(i+1).padStart(2,'0')}-fixture`,date:`2026-10-${String(i+1).padStart(2,'0')}`,title:'Fixture '+(i+1)}));
const ordered=api.validateEntries(fixture);
assert.equal(api.pageEntries(ordered,1).entries.length,10);assert.equal(api.pageEntries(ordered,3).entries.length,5);
assert.equal(api.pageEntries(ordered,99).page,3);assert.equal(api.pageEntries(ordered,-1).page,1);
assert.equal(api.pageEntries(ordered,NaN).page,1);assert.equal(api.pageEntries([],10).pages,1);
function boot(entries,hash=''){
 const elements={};let focused;const handlers={};let scrolled;
 class Element{
  constructor(tag){this.tagName=tag;this.children=[];this.value='';this.hidden=false;this.attrs={};this.handlers={};this.textContent='';}
  set id(value){this._id=value;elements[value]=this;}get id(){return this._id;}
  append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.handlers[k]=fn;}
  focus(){focused=this.id;}scrollIntoView(){scrolled=this.id;}
 }
 for(const id of ['insight-clear-search','insight-search','insight-topic','insight-list','insight-count','insight-empty','insight-page','insight-prev','insight-next','insight-pagination','insight-clear','insight-warning','insight-updated']){const e=new Element('div');e.id=id;}
 elements['insight-topic'].value='all';
 const window={IdeaVisionInsights:entries,location:{hash},addEventListener:(event,fn)=>handlers[event]=fn};
 const doc={getElementById:id=>elements[id],createElement:tag=>new Element(tag)};
 vm.runInNewContext(fs.readFileSync('./daily-insights/insights-app.js','utf8'),{window,document:doc,URL,Intl,Date});
 return {elements,window,handlers,focused:()=>focused,scrolled:()=>scrolled};
}
let app=boot([originalEntry]),e=app.elements;
assert.equal(e['insight-list'].children.length,1);assert.equal(e['insight-warning'].hidden,true);
assert.equal(e['insight-pagination'].hidden,true);assert.equal(e['insight-count'].textContent,'1 insight in the archive');
assert.equal(e['insight-list'].children[0].children[0].children[1].textContent,'Original insight · AI-assisted');
e['insight-topic'].value='MCP';e['insight-topic'].handlers.change();assert.equal(e['insight-list'].children.length,0);assert.equal(e['insight-empty'].hidden,false);
e['insight-clear'].handlers.click();assert.equal(e['insight-list'].children.length,1);assert.equal(app.focused(),'insight-search');
e['insight-search'].value='agent';e['insight-search'].handlers.input();assert.equal(e['insight-list'].children.length,1);
e['insight-search'].value='absent';e['insight-search'].handlers.input();assert.equal(e['insight-count'].textContent,'Matches: 0 of 1');
app=boot(fixture);e=app.elements;assert.equal(e['insight-pagination'].hidden,false);
assert.equal(e['insight-count'].textContent,'25 insights in the archive · Showing 1–10');
e['insight-next'].handlers.click();assert.equal(e['insight-count'].textContent,'25 insights in the archive · Showing 11–20');assert.equal(e['insight-page'].textContent,'Page 2 of 3');assert.equal(app.focused(),'insight-2026-10-15-fixture');assert.equal(app.scrolled(),'insight-2026-10-15-fixture');
e['insight-next'].handlers.click();assert.equal(e['insight-list'].children.length,5);assert.equal(e['insight-count'].textContent,'25 insights in the archive · Showing 21–25');assert.equal(e['insight-next'].disabled,true);assert.equal(app.focused(),'insight-2026-10-05-fixture');
e['insight-prev'].handlers.click();assert.equal(e['insight-page'].textContent,'Page 2 of 3');assert.equal(app.focused(),'insight-2026-10-15-fixture');assert.equal(app.scrolled(),'insight-2026-10-15-fixture');
e['insight-search'].value='Fixture 25';e['insight-search'].handlers.input();assert.equal(e['insight-page'].textContent,'Page 1 of 1');assert.equal(app.focused(),'insight-2026-10-15-fixture','Filtering must not move focus to an article.');
assert.equal(e['insight-count'].textContent,'Matches: 1 of 25');
e['insight-search'].value='fixture';e['insight-search'].handlers.input();assert.equal(e['insight-count'].textContent,'Matches: 25 of 25 · Showing 1–10');
e['insight-clear'].handlers.click();assert.equal(e['insight-page'].textContent,'Page 1 of 3');
app=boot(fixture,'#insight-2026-10-01-fixture');e=app.elements;
assert.equal(e['insight-page'].textContent,'Page 3 of 3');assert.equal(app.scrolled(),'insight-2026-10-01-fixture');assert.equal(app.focused(),'insight-2026-10-01-fixture');
assert.equal(e['insight-2026-10-01-fixture'].attrs.tabindex,'-1');
assert.equal(e['insight-2026-10-01-fixture'].attrs['aria-labelledby'],'insight-2026-10-01-fixture-title');
app.window.location.hash='#insight-2026-10-25-fixture';app.handlers.hashchange();assert.equal(e['insight-page'].textContent,'Page 1 of 3');
assert.equal(app.focused(),'insight-2026-10-25-fixture');
e['insight-search'].value='missing';e['insight-search'].handlers.input();
app.window.location.hash='#insight-2026-10-01-fixture';app.handlers.hashchange();
assert.equal(e['insight-search'].value,'');assert.equal(e['insight-page'].textContent,'Page 3 of 3');
assert.equal(app.focused(),'insight-2026-10-01-fixture');
e['insight-clear'].handlers.click();
app.window.location.hash='#unknown';app.handlers.hashchange();
assert.equal(app.focused(),'insight-search','Unknown fragments must not steal focus.');
app=boot([{...sample,title:'<script>fake</script>',summary:'<img src=x onerror=alert(1)>'},{}]);e=app.elements;
const card=e['insight-list'].children[0];assert.equal(card.children[1].textContent,'<script>fake</script>');
assert.equal(card.children[2].textContent,'<img src=x onerror=alert(1)>');assert.equal(e['insight-warning'].hidden,false);
const source=card.children[4].children[0];assert.equal(source.href,'https://example.com/note');assert.equal(source.rel,'noopener noreferrer');assert.equal(source.target,'_blank');
// Topic chips are real buttons; retain the query, reset paging and focus the filter.
app=boot([originalEntry,sample]);e=app.elements;
let topicButton=e['insight-list'].children[0].children[3].children[1].children[0];
assert.equal(topicButton.tagName,'button');assert.equal(topicButton.type,'button');
assert.equal(topicButton.attrs['aria-label'],'Filter insights by RAG');
e['insight-search'].value='permissions';e['insight-search'].handlers.input();
topicButton=e['insight-list'].children[0].children[3].children[1].children[0];
topicButton.handlers.click();assert.equal(e['insight-topic'].value,'RAG');
assert.equal(e['insight-search'].value,'permissions');assert.equal(e['insight-list'].children.length,1);
assert.equal(app.focused(),'insight-topic');assert.equal(app.scrolled(),'insight-topic');
topicButton.handlers.click();assert.equal(e['insight-list'].children.length,1);
e['insight-clear'].handlers.click();assert.equal(e['insight-list'].children.length,2);
app=boot(fixture);e=app.elements;e['insight-next'].handlers.click();
e['insight-list'].children[0].children[3].children[0].children[0].handlers.click();
assert.equal(e['insight-page'].textContent,'Page 1 of 3');assert.equal(e['insight-topic'].value,'MCP');
app=boot([]);assert.equal(app.elements['insight-empty'].hidden,false);
const html=fs.readFileSync('./daily-insights/index.html','utf8');
const latestDate=api.validateEntries(published)[0].date.replaceAll('-','');
assert.ok(html.includes(`insights.js?v=${latestDate}`),'Refresh the entry asset version for the latest publication date.');
assert.match(html,/<meta name="viewport"/);assert.match(html,/<noscript>/);assert.match(html,/No account, tracking or uploads/);
const home=fs.readFileSync('./index.html','utf8');
assert.match(home,/<a class="daily-insights-link" href="daily-insights\/" target="_blank" rel="noopener noreferrer"/);
console.log('PASS: published metadata, original/source labels, URL safety, dates, sorting, search/topic filters, pagination, permalink paging, empty/error states and text-only rendering.');

// Clear only the query, preserving the topic and resetting pagination.
app=boot(fixture);e=app.elements;
assert.equal(e['insight-clear-search'].hidden,true);
e['insight-topic'].value='MCP';e['insight-topic'].handlers.change();
e['insight-search'].value='not present';e['insight-search'].handlers.input();
assert.equal(e['insight-clear-search'].hidden,false);
assert.equal(e['insight-list'].children.length,0);
e['insight-clear-search'].handlers.click();
assert.equal(e['insight-search'].value,'');assert.equal(e['insight-topic'].value,'MCP');
assert.equal(e['insight-list'].children.length,10);assert.equal(e['insight-clear-search'].hidden,true);
assert.equal(app.focused(),'insight-search');
e['insight-next'].handlers.click();e['insight-clear-search'].handlers.click();
assert.equal(e['insight-page'].textContent,'Page 1 of 3');
e['insight-search'].value=' ';e['insight-search'].handlers.input();
assert.equal(e['insight-clear-search'].hidden,false);
e['insight-clear'].handlers.click();assert.equal(e['insight-clear-search'].hidden,true);
assert.match(html,/id="insight-clear-search" type="button" hidden/);
console.log('PASS: query-only clear, topic preservation, zero-result recovery, repeated clear, pagination reset and focus.');

// Escape clears a nonempty search without discarding its topic.
app=boot(fixture);e=app.elements;let prevented=0;
e['insight-topic'].value='MCP';e['insight-topic'].handlers.change();
e['insight-search'].value='missing';e['insight-search'].handlers.input();
e['insight-search'].handlers.keydown({key:'Enter',preventDefault(){prevented++;}});
assert.equal(e['insight-search'].value,'missing');assert.equal(prevented,0);
e['insight-search'].handlers.keydown({key:'Escape',preventDefault(){prevented++;}});
assert.equal(e['insight-search'].value,'');assert.equal(e['insight-topic'].value,'MCP');
assert.equal(e['insight-page'].textContent,'Page 1 of 3');assert.equal(app.focused(),'insight-search');
assert.equal(prevented,1);assert.equal(e['insight-clear-search'].hidden,true);
e['insight-next'].handlers.click();
e['insight-search'].handlers.keydown({key:'Escape',preventDefault(){prevented++;}});
assert.equal(prevented,1);assert.equal(e['insight-page'].textContent,'Page 2 of 3');
assert.match(html,/aria-describedby="search-help"/);
console.log('PASS: Escape search recovery, topic retention, focus, paging, unrelated keys and empty repeat.');

const spectral=published.find(entry=>entry.id==='2026-11-22-check-the-trace-not-just-its-average');
assert(spectral&&spectral.workedExample.length===4);
for(const v of [[],[''],['x'.repeat(501)],new Array(1),['valid',null],'not an array']){
 assert.equal(api.validateEntries([{...spectral,workedExample:v}]).length,0);
}
assert.equal(api.filterEntries([spectral],'31→0','Agent harnesses').length,1);
let caseView=boot([spectral],'#insight-'+spectral.id);
let article=caseView.elements['insight-list'].children[0];
let detail=article.children.find(child=>child.tagName==='details');
assert.equal(detail.children[0].tagName,'summary');
assert.equal(detail.children[1].textContent,spectral.workedExample[0]);
const literal='<img src=x onerror=alert(1)>';
caseView=boot([{...spectral,workedExample:[literal]}]);
article=caseView.elements['insight-list'].children[0];detail=article.children.find(child=>child.tagName==='details');
assert.equal(detail.children[1].textContent,literal);
assert.equal(detail.children[1].children.length,0);
assert(!boot([originalEntry]).elements['insight-list'].children[0].children.some(child=>child.tagName==='details'));

// Direct forward DFT and inverse reconstruction, independent of the prose's expected values.
{
 const N=32, theta=2*Math.PI/N;
 const x=Array.from({length:N},(_,n)=>n<16?1:0);
 const bins=Array.from({length:N},(_,k)=>[x.reduce((s,v,n)=>s+v*Math.cos(k*n*theta),0),x.reduce((s,v,n)=>s-v*Math.sin(k*n*theta),0)]);
 const energy=indices=>indices.reduce((s,k)=>s+bins[k][0]**2+bins[k][1]**2,0);
 const all=Array.from({length:N},(_,k)=>k);
 const fullEnergy=energy(all);
 const inverse=indices=>x.map((_,n)=>indices.reduce((s,k)=>s+bins[k][0]*Math.cos(k*n*theta)-bins[k][1]*Math.sin(k*n*theta),0)/N);
 const close=(a,b,eps=1e-11)=>assert(Math.abs(a-b)<eps,`${a} differs from ${b}`);
 inverse(all).forEach((v,n)=>close(v,x[n]));
 close(fullEnergy/N,x.reduce((s,v)=>s+v*v,0));
 for(const [k,expectedEnergy,expectedMse] of [[1,'90.66','0.04671'],[15,'50.39','0.24803']]){
  const keep=[0,k,N-k],y=inverse(keep);
  const mse=x.reduce((s,v,n)=>s+(v-y[n])**2,0)/N;
  close(y.reduce((s,v)=>s+v,0)/N,.5);
  close(y[15],.5625);close(y[16],.4375);
  const percent=(100*energy(keep)/fullEnergy).toFixed(2);
  assert.equal(percent,expectedEnergy);assert.equal(mse.toFixed(5),expectedMse);
  assert(spectral.workedExample[2].includes(percent+'%')&&spectral.workedExample[2].includes(mse.toFixed(5)));
 }
}
console.log('PASS: worked example disclosure, search, text-only rendering, and direct Fourier reconstruction and metric checks.');
{
 const policy=published.find(x=>x.id==='2026-11-24-test-both-sides-of-a-policy-change');
 assert(policy);const entries=api.validateEntries(published);
 for(const dash of ['-','‑','–','−'])assert.deepEqual(api.filterEntries(entries,'as'+dash+'of $120','RAG').map(v=>v.id),[policy.id]);
 assert.equal(api.filterEntries(entries,'as-of impossibleword','RAG').length,0);
 assert.equal(api.filterEntries(entries,'as-of $120','MCP').length,0);
 const live=boot(entries);
 const e=live.elements;e['insight-search'].value='2026–11–24';e['insight-search'].handlers.input();
 assert.equal(e['insight-list'].children.length,1);assert(e['insight-list'].children[0].id.endsWith(policy.id));
}
{
 const mix=published.find(e=>e.id==='2026-11-25-fix-the-mix-before-comparing');
 assert.equal(api.validateEntries(published)[0].id,mix.id);
 const a=[90,100,4,10],b=[19,20,45,100];
 const raw=([x,n,y,m])=>100*(x+y)/(n+m);
 const fixed=([x,n,y,m])=>50*(x/n+y/m);
 assert(a[0]/a[1]<b[0]/b[1] && a[2]/a[3]<b[2]/b[3]);
 assert(raw(a)>raw(b) && fixed(a)<fixed(b));
 for (const x of [raw(a).toFixed(2),raw(b).toFixed(2),fixed(a),fixed(b)]) {
  assert(mix.workedExample[1].includes(x+'%'));
 }
 assert.deepEqual(api.filterEntries(api.validateEntries(published),'fixed reference weights','Agent harnesses').map(e=>e.id),[mix.id]);
}
