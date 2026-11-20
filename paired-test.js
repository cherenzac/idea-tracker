'use strict';
(function(){
 const ids=['pair-both','pair-a','pair-b','pair-neither'];
 const demo=['28','3','12','17'];
 function compare(values){
  if(!Array.isArray(values)||values.length!==4||
      values.some(v=>typeof v!=='string'||!/^[0-9]{1,3}$/.test(v.trim()))) {
   throw new Error('Enter a whole count (including zeros) for each outcome.');
  }
  const [both,a,b,neither]=values.map(Number);
  const total=both+a+b+neither;
  if(total<1||total>500)throw new Error('Enter between 1 and 500 complete pairs in total.');
  const n=a+b;
  let p=null;
  if(n){
   // Under equal marginal pass rates, each discordant pair is a fair coin.
   // Sum exact integer binomial coefficients before converting the ratio.
   let term=1n,sum=term;
   for(let i=1;i<=Math.min(a,b);i++){
    term=term*BigInt(n-i+1)/BigInt(i);
    sum+=term;
   }
   p=Math.min(1,Number(2n*sum)/Number(1n<<BigInt(n)));
  }
  return {total,a,b,ties:both+neither,discordant:n,rateA:(both+a)/total,
    rateB:(both+b)/total,delta:(b-a)/total,p};
 }
 if(typeof module!=='undefined')module.exports={compare};
 if(typeof document==='undefined')return;
 const get=id=>document.getElementById(id);
 const fields=ids.map(get);
 get('paired-example').addEventListener('click',()=>{
  if(fields.some(field=>field.value.trim())&&!confirm('Replace the paired counts with the fictional example?'))return;
  fields.forEach((field,i)=>{field.value=demo[i];});
  show();
 });
 fields.forEach(field=>field.addEventListener('input',()=>{
  get('paired-output').textContent='';
  get('paired-status').textContent='Counts changed. Compare again to update the result.';
 }));
 const pct=x=>(100*x).toFixed(1);
 function show(){
  const output=get('paired-output'),status=get('paired-status');
  output.textContent='';
  status.textContent='';
  try{
   const r=compare(fields.map(field=>field.value));
   const effect=(r.delta>0?'+':r.delta===0?'±':'')+pct(r.delta);
   const p=r.p===null?'No discordant pairs; no directional evidence.':
      `Exact two-sided p-value: ${r.p<0.001?r.p.toExponential(3):r.p.toPrecision(4)}.`;
   output.textContent=`${r.total} matched pairs: A only ${r.a}, B only ${r.b}, ties ${r.ties}.\nA pass rate: ${pct(r.rateA)}%. B pass rate: ${pct(r.rateB)}%. B − A: ${effect} percentage points.\n${p}`;
   status.textContent='Comparison updated.';
  }catch(error){status.textContent=error.message;}
 }
 get('paired-form').addEventListener('submit',event=>{event.preventDefault();show();});
})();
