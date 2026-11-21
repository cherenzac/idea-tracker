'use strict';
(function(){
 const cap=1000000;
 function validate(n,p){
  if(!Number.isInteger(n)||n<0||n>cap||!Number.isFinite(p)||p<0||p>1) throw new RangeError('Enter whole review counts from 0 to 1,000,000 and rates from 0% to 100%.');
 }
 function logMiss(n,p){validate(n,p);return n===0?0:n*Math.log1p(-p);}
 function compare(n,p,a,q,b,r){
  const total=a+b;
  if(!Number.isSafeInteger(total)||n<1||total!==n) throw new RangeError('Split the entire review budget between the two slices.');
  return {random:-Math.expm1(logMiss(n,p))||0,sliced:-Math.expm1(logMiss(a,q)+logMiss(b,r))||0};
 }
 function minimum(p,target){
  validate(0,p);
  if(!Number.isFinite(target)||target<=0||target>=1) throw new RangeError('Set a target above 0% and below 100%.');
  if(p===0)return Infinity;
  if(p===1)return 1;
  const goal=Math.log1p(-target),step=Math.log1p(-p),estimate=goal/step;
  if(estimate>Number.MAX_SAFE_INTEGER)return null;
  let n=Math.max(1,Math.ceil(estimate));
  if(n>1&&(n-1)*step<=goal)n--;
  else if(n*step>goal)n++;
  return Number.isSafeInteger(n)?n:null;
 }
 if(typeof module!=='undefined')module.exports={compare,minimum};
 if(typeof document==='undefined')return;
 const el=id=>document.getElementById(id);
 const ids=['audit-budget','audit-rate','audit-slice-count','audit-slice-rate','audit-rest-rate','audit-target'];
 const percent=x=>new Intl.NumberFormat('en',{style:'percent',maximumFractionDigits:2}).format(x);
 const out=el('audit-output');
 function numeric(id){
  const value=el(id).value.trim();
  if(!/^(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)$/.test(value))throw new RangeError('Complete every field using a number.');
  return Number(value);
 }
 function render(){
  try{
   const [n,p,a,q,r,t]=ids.map(numeric);
   const {random,sliced}=compare(n,p/100,a,q/100,n-a,r/100),count=minimum(p/100,t/100);
   out.textContent='Random review: '+percent(random)+'. Split review: '+percent(sliced)+'. Random reviews for the target: '+(count===Infinity?'not achievable at 0% assumed failures':count===null?'beyond precise count range':count.toLocaleString('en'))+'.';
  }catch(error){out.textContent=error.message;}
 }
 el('audit-form').addEventListener('submit',event=>{event.preventDefault();render();});
 ids.forEach(id=>el(id).addEventListener('input',()=>{out.textContent='Inputs changed. Compare review plans to recalculate.';}));
 el('audit-example').addEventListener('click',()=>{[50,2,10,20,0,95].forEach((value,i)=>{el(ids[i]).value=String(value);});render();});
})();
