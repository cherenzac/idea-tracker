'use strict';
(() => {
 const el=id=>document.getElementById(id);
 const tabs=[el('tab-ideas'),el('tab-news')];
 const panels=[el('panel-ideas'),el('panel-news')];
 function select(index){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});el('export').hidden=index!==0;}
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>select(index));
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=1-index;else if(event.key==='Home')next=0;else if(event.key==='End')next=1;else return;event.preventDefault();select(next);tabs[next].focus();});
 });
 let generation=0;
 let scriptPromise;
 function widget(){
  if(window.twttr?.widgets)return Promise.resolve(window.twttr.widgets);
  if(scriptPromise)return scriptPromise;
  scriptPromise=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='https://platform.twitter.com/widgets.js';script.async=true;script.charset='utf-8';
   script.onload=()=>window.twttr?.widgets?resolve(window.twttr.widgets):reject(new Error('unavailable'));
   script.onerror=()=>reject(new Error('unavailable'));document.head.append(script);
  });
  return scriptPromise;
 }
 el('clear-news').addEventListener('click',()=>{generation++;el('news-feed').replaceChildren();el('news-message').textContent='Preview cleared. Reload this page to unload the X script; no further preview is requested.';el('load-news').disabled=false;});
 el('news-form').addEventListener('submit',async event=>{
  event.preventDefault();const handle=el('news-handle').value.trim().replace(/^@/,'');
  if(!/^[A-Za-z0-9_]{1,15}$/.test(handle)){el('news-message').textContent='Enter a public X handle using letters, numbers, or underscores only.';return;}
  const request=++generation;el('load-news').disabled=true;el('news-feed').replaceChildren();
  const fallback=document.createElement('a');fallback.href='https://x.com/'+handle;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent='Open @'+handle+' on X ↗';el('news-feed').append(fallback);
  const container=document.createElement('div');el('news-feed').append(container);el('news-message').textContent='Requesting an X-managed public preview. Post freshness is not verified.';
  try{const widgets=await widget();if(request!==generation)return;const result=await widgets.createTimeline({sourceType:'profile',screenName:handle},container,{height:520,theme:'dark',dnt:true});if(request!==generation)return;el('news-message').textContent=result?'X preview loaded. No account connection or freshness guarantee.':'X did not return a preview. Use the direct X link.';}
  catch{if(request===generation)el('news-message').textContent='X preview is unavailable or blocked. Use the direct X link; no news freshness is claimed.';}
  finally{if(request===generation)el('load-news').disabled=false;}
 });
})();
