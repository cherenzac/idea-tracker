'use strict';
(function(root){
 const REFRESH_MS=5*60*1000;
 function cleanQuery(value){return String(value||'').trim().replace(/\s+/g,' ').slice(0,80);}
 function safeUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
 function feedUrl(query,now=Date.now()){
  const params=new URLSearchParams({query:cleanQuery(query),tags:'story',hitsPerPage:'30',numericFilters:'created_at_i>'+Math.floor((now-7*86400000)/1000)});
  return 'https://hn.algolia.com/api/v1/search_by_date?'+params;
 }
 function xSearchUrl(query){return 'https://x.com/search?'+new URLSearchParams({q:cleanQuery(query),src:'typed_query',f:'live'});}
 function normalizeHits(hits,now=Date.now()){
  const seen=new Set();return (Array.isArray(hits)?hits:[]).filter(h=>h&&/^\d+$/.test(String(h.objectID))&&typeof h.title==='string').map(h=>({id:String(h.objectID),title:h.title,author:String(h.author||'Unknown'),publishedAt:h.created_at,url:safeUrl(h.url)||'https://news.ycombinator.com/item?id='+h.objectID,discussionUrl:'https://news.ycombinator.com/item?id='+h.objectID,points:Math.max(0,Number(h.points)||0),comments:Math.max(0,Number(h.num_comments)||0)})).filter(h=>{const t=Date.parse(h.publishedAt);if(!Number.isFinite(t)||t<now-7*86400000||t>now+5*60000||seen.has(h.id))return false;seen.add(h.id);return true;}).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
 }
 function createFeedController({fetcher,onState,now=Date.now,makeAbort=()=>new AbortController(),setTimer=setTimeout,clearTimer=clearTimeout}){
  let version=0,abort,timer,lastGood=null;
  function cancel(){version++;if(abort)abort.abort();if(timer)clearTimer(timer);}
  async function refresh(raw){
   const query=cleanQuery(raw);if(!query){onState({status:'invalid',message:'Enter a topic to search.'});return;}
   cancel();const request=version;abort=makeAbort();const currentAbort=abort;
   const previous=lastGood?.query===query?lastGood:null;
   onState({status:'loading',query,previous});
   timer=setTimer(()=>currentAbort.abort(),12000);
   try{
    const response=await fetcher(feedUrl(query,now()),{signal:currentAbort.signal,credentials:'omit',referrerPolicy:'no-referrer'});
    if(!response.ok)throw new Error('Source returned '+response.status);
    const data=await response.json();if(!Array.isArray(data.hits))throw new Error('Unexpected source response');
    if(request!==version)return;
    lastGood={query,items:normalizeHits(data.hits,now()),checkedAt:now()};onState({status:'ready',...lastGood});
   }catch(error){if(request!==version)return;onState({status:'error',query,previous,message:error.name==='AbortError'?'The source took too long to respond.':'Could not refresh the source.'});}
   finally{if(request===version&&timer){clearTimer(timer);timer=null;}}
  }
  return {refresh,cancel};
 }
 const api={REFRESH_MS,cleanQuery,safeUrl,feedUrl,xSearchUrl,normalizeHits,createFeedController};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(typeof document==='undefined')return;
 const el=id=>document.getElementById(id),panel=el('panel-news');if(!el('agent-news-form')||!panel)return;
 let lastAttempt=0,paused=false,interval;
 const sourceLabel=el('agent-news-source'),status=el('agent-news-status'),list=el('agent-news-list'),refreshButton=el('agent-news-refresh');
 function link(text,url){const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
 function renderItems(items){
  list.replaceChildren();if(!items.length){const p=document.createElement('p');p.textContent='No matching Hacker News stories from the last seven days. Try another topic or open the X search.';list.append(p);return;}
  for(const item of items){
   const article=document.createElement('article');article.className='agent-news-card';
   const h=document.createElement('h3');h.append(link(item.title,item.url));
   const meta=document.createElement('p');meta.className='intro';
   const time=document.createElement('time');time.dateTime=item.publishedAt;time.textContent=new Date(item.publishedAt).toLocaleString();
   meta.append('Hacker News · submitted by '+item.author+' · ',time);
   const discussion=link(item.points+' points · '+item.comments+' comments ↗',item.discussionUrl);
   article.append(h,meta,discussion);list.append(article);
  }
 }
 function render(s){
  refreshButton.disabled=s.status==='loading';
  if(s.status==='invalid'){status.textContent=s.message;return;}
  el('agent-news-x-search').href=xSearchUrl(s.query);
  if(s.status==='loading'){
   sourceLabel.textContent='CHECKING HACKER NEWS';status.textContent='Fetching recent “'+s.query+'” stories…';
   if(!s.previous)list.replaceChildren();return;
  }
  if(s.status==='ready'){
   sourceLabel.textContent='HACKER NEWS · UPDATED';
   status.textContent='Last checked '+new Date(s.checkedAt).toLocaleTimeString()+'. '+s.items.length+' stories from the last seven days. '+(paused?'Auto-refresh paused.':'Refreshes every five minutes while this tab is visible.');
   renderItems(s.items);return;
  }
  sourceLabel.textContent=s.previous?'HACKER NEWS · STALE':'HACKER NEWS · UNAVAILABLE';
  status.textContent=s.message+(s.previous?' Showing the previous results, last checked '+new Date(s.previous.checkedAt).toLocaleTimeString()+'.':' No current results available.')+' You can retry or use the X search link.';
 }
 const controller=createFeedController({fetcher:(...args)=>fetch(...args),onState:render});
 function visible(){return !panel.hidden&&!document.hidden;}
 function refresh(){lastAttempt=Date.now();return controller.refresh(el('agent-news-query').value);}
 function maybeRefresh(){if(visible()&&!paused&&Date.now()-lastAttempt>=REFRESH_MS)refresh();}
 el('agent-news-form').addEventListener('submit',event=>{event.preventDefault();refresh();});
 el('agent-news-presets').addEventListener('click',event=>{const button=event.target.closest('[data-news-topic]');if(button){el('agent-news-query').value=button.dataset.newsTopic;refresh();}});
 el('agent-news-pause').addEventListener('click',()=>{paused=!paused;el('agent-news-pause').textContent=paused?'Resume auto-refresh':'Pause auto-refresh';el('agent-news-pause').setAttribute('aria-pressed',String(paused));status.textContent=paused?'Auto-refresh paused. The displayed stories have not changed.':'Auto-refresh resumed. Refreshes every five minutes while visible.';if(!paused)maybeRefresh();});
 new MutationObserver(maybeRefresh).observe(panel,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',maybeRefresh);
 interval=setInterval(maybeRefresh,30000);
 window.addEventListener('pagehide',()=>{controller.cancel();clearInterval(interval);});
 window.addEventListener('pageshow',event=>{if(event.persisted){interval=setInterval(maybeRefresh,30000);lastAttempt=0;maybeRefresh();}});
 maybeRefresh();
})(typeof window==='undefined'?globalThis:window);
