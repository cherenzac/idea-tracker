'use strict';
(function(){
 const labels=['A','B','C'];
 const orders=Object.freeze(['ABC','ACB','BAC','BCA','CAB','CBA']);
 function summarize(correct,picks){
  if(!labels.includes(correct)||!Array.isArray(picks)||picks.length!==orders.length||!Array.from(picks).every(p=>labels.includes(p))){
   throw new RangeError('Choose the correct label and record one selected label for each order.');
  }
  let pairFlips=0;
  for(let i=0;i<picks.length;i++)for(let j=i+1;j<picks.length;j++)if(picks[i]!==picks[j])pairFlips++;
  return {correct:picks.filter(p=>p===correct).length,baselineFlips:picks.slice(1).filter(p=>p!==picks[0]).length,pairFlips};
 }
 if(typeof module!=='undefined')module.exports={orders,summarize};
 if(typeof document==='undefined')return;
 const el=id=>document.getElementById(id);
 const selections=orders.map(order=>el('order-'+order.toLowerCase()));
 const target=el('order-correct'),result=el('order-output');
 const render=()=>{
  try{
   const s=summarize(target.value,selections.map(input=>input.value));
   result.textContent='Correct in '+s.correct+'/6 orders. Changed from ABC in '+s.baselineFlips+'/5 other orders. Different selections in '+s.pairFlips+'/15 unordered pairs.';
  }catch(error){result.textContent=error.message;}
 };
 const examples=[
  ['order-first',orders.map(order=>order[0])],
  ['order-right',orders.map(()=> 'A')],
  ['order-wrong',orders.map(()=> 'B')]
 ];
 for(const [id,picks] of examples)el(id).addEventListener('click',()=>{
  target.value='A';
  selections.forEach((input,i)=>{input.value=picks[i];});
  render();
 });
 [target,...selections].forEach(input=>input.addEventListener('change',()=>{
  result.textContent='Selections changed. Score the six orders to recalculate.';
 }));
 el('order-form').addEventListener('submit',event=>{event.preventDefault();render();});
})();
