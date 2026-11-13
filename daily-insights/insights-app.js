'use strict';
(function(root){
 const TOPICS = ['AI', 'MCP', 'RAG', 'Agent governance', 'Agent harnesses'];
 const PAGE_SIZE = 10;
 function safeSource(url) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : null; }
  catch { return null; }
 }
 function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value;
 }
 function validateEntries(entries) {
  if (!Array.isArray(entries)) return [];
  const ids = new Set();
  return entries.filter(entry => {
   const valid = entry && typeof entry.id === 'string' && /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(entry.id)
    && !ids.has(entry.id) && validDate(entry.date) && entry.id.startsWith(entry.date + '-')
    && typeof entry.title === 'string' && entry.title.trim().length > 0 && entry.title.length <= 120
    && typeof entry.summary === 'string' && entry.summary.trim().length > 0 && entry.summary.length <= 360
    && Array.isArray(entry.topics) && entry.topics.length > 0 && entry.topics.every(topic => TOPICS.includes(topic))
    && (entry.kind === 'original' || (entry.kind === 'source' && entry.source && typeof entry.source.name === 'string'
     && entry.source.name.trim().length > 0 && safeSource(entry.source.url)));
   if (valid) ids.add(entry.id);
   return valid;
  }).slice().sort((a,b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
 }
 function filterEntries(entries, query = '', topic = 'all') {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter(entry => (topic === 'all' || entry.topics.includes(topic))
   && words.every(word => [entry.title,entry.summary,entry.date,...entry.topics,entry.source?.name || ''].join(' ').toLowerCase().includes(word)));
 }
 function pageEntries(entries, requestedPage = 1) {
  const pages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const page = Math.max(1, Math.min(pages, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1));
  return {page, pages, entries: entries.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE)};
 }
 function formatDate(date) { return new Intl.DateTimeFormat('en', {month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z')); }
 function start(doc, input) {
  const all = validateEntries(input);
  const $ = id => doc.getElementById(id);
  let currentPage = 1;
  const make = (tag, text, className) => { const node=doc.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node; };
  function render() {
   const filtered = filterEntries(all, $('insight-search').value, $('insight-topic').value);
   const view = pageEntries(filtered, currentPage); currentPage=view.page;
   $('insight-list').replaceChildren();
   for (const entry of view.entries) {
    const article=make('article',undefined,'insight-card');article.id='insight-'+entry.id;
    article.setAttribute('tabindex','-1');article.setAttribute('aria-labelledby',article.id+'-title');
    const meta=make('div',undefined,'entry-meta');
    const time=make('time',formatDate(entry.date));time.setAttribute('datetime',entry.date);
    const attribution=make('span',entry.kind==='original'?'Original insight · AI-assisted':'Source-inspired insight');
    meta.append(time,attribution);
    const heading=make('h2',entry.title);heading.id=article.id+'-title';
    const summary=make('p',entry.summary,'entry-summary');
    const topics=make('ul',undefined,'entry-topics');topics.setAttribute('aria-label','Topics');
    for(const topic of entry.topics)topics.append(make('li',topic));
    const footer=make('div',undefined,'entry-footer');
    if(entry.kind==='source') {
     const source=make('a','Source: '+entry.source.name+' ↗');source.href=safeSource(entry.source.url);
     source.target='_blank';source.rel='noopener noreferrer';footer.append(source);
    }
    const link=make('a','Link to this insight ↗');link.href='#insight-'+entry.id;
    link.setAttribute('aria-label','Link to insight: '+entry.title);footer.append(link);
    article.append(meta,heading,summary,topics,footer);$('insight-list').append(article);
   }
   $('insight-count').textContent=filtered.length===all.length ? `${all.length} ${all.length===1?'insight':'insights'} in the archive` : `${filtered.length} of ${all.length} insights match`;
   $('insight-empty').hidden=filtered.length!==0;
   $('insight-page').textContent=`Page ${view.page} of ${view.pages}`;
   $('insight-prev').disabled=view.page<=1;$('insight-next').disabled=view.page>=view.pages;
   $('insight-pagination').hidden=view.pages<=1;
  }
  function resetPage(){currentPage=1;render();}
  $('insight-search').addEventListener('input',resetPage);
  $('insight-topic').addEventListener('change',resetPage);
  $('insight-clear').addEventListener('click',()=>{$('insight-search').value='';$('insight-topic').value='all';resetPage();$('insight-search').focus();});
  function turnPage(delta) {
   currentPage+=delta;render();
   const first=$('insight-list').children[0];
   first?.focus({preventScroll:true});first?.scrollIntoView({block:'start'});
  }
  $('insight-prev').addEventListener('click',()=>turnPage(-1));
  $('insight-next').addEventListener('click',()=>turnPage(1));
  // Shared article links must reach their page as the archive grows; clear active filters.
  function followAnchor() {
   const id=(root.location?.hash || '').replace(/^#insight-/,'');
   const index=all.findIndex(entry=>entry.id===id);
   if(index<0)return;
   $('insight-search').value='';$('insight-topic').value='all';currentPage=Math.floor(index/PAGE_SIZE)+1;render();
   const target=$('insight-'+id);
   target?.focus({preventScroll:true});target?.scrollIntoView({block:'start'});
  }
  $('insight-warning').hidden=Array.isArray(input)&&input.length===all.length;
  $('insight-updated').textContent=all.length ? 'Latest note · '+formatDate(all[0].date) : 'The first note is still to come';
  render();followAnchor();root.addEventListener?.('hashchange',followAnchor);
 }
 const api={TOPICS,PAGE_SIZE,safeSource,validDate,validateEntries,filterEntries,pageEntries,formatDate,start};
 if(typeof module!=='undefined')module.exports=api;
 else {root.IdeaVisionInsightsApp=api;start(document,root.IdeaVisionInsights);}
})(typeof window!=='undefined'?window:globalThis);
