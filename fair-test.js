'use strict';
(function(root){
 const required=['question','change','keep','measure'];
 const trialFields=[1,2,3].flatMap(n=>['expected','observed','verdict'].map(k=>`trial-${n}-${k}`));
 const fields=[...required,'prediction','notes','rule',...trialFields];
 const example={...Object.fromEntries(trialFields.map(id=>[id,''])),rule:'Each bridge holds at least five paper squares before bending.',notes:'',question:'Does folding paper change how much it can hold?',change:'Paper shape: flat versus accordion-folded.',keep:'Same paper size and type, same small gap between supports, same paper squares as weights.',measure:'Count paper squares held before the bridge bends. Repeat each shape three times and write down every count.',prediction:'I predict folded paper will hold more squares because the folds may help it keep its shape.'};
 function buildPlan(input){
  const values={};
  for(const field of fields){const value=input?.[field];if(typeof value!=='string')throw new Error('Enter text for each worksheet field.');values[field]=value.trim();if(values[field].length>300)throw new Error('Keep each field to 300 characters or fewer.');if(required.includes(field)&&!values[field])throw new Error('Complete the four required fields before building a plan.');}
  for(const n of [1,2,3]){const verdict=values[`trial-${n}-verdict`];if(!['','Pass','Fail','Unclear'].includes(verdict))throw new Error('Choose a listed trial outcome.');if(verdict&&(!values.rule||!values[`trial-${n}-expected`]||!values[`trial-${n}-observed`]))throw new Error('To score a trial, add a success rule, expected result and observation.');}
  const trials=[1,2,3].flatMap(n=>[`Trial ${n}:`,`Expected: ${values[`trial-${n}-expected`]||'Not recorded.'}`,`Observed: ${values[`trial-${n}-observed`]||'Not recorded.'}`,`Outcome (your judgment): ${values[`trial-${n}-verdict`]||'Not scored.'}`,'']);
  const counts = Object.fromEntries(['Pass','Fail','Unclear','Not scored'].map(label=>[label,[1,2,3].filter(n=>(values[`trial-${n}-verdict`]||'Not scored')===label).length]));
  const summary = Object.entries(counts).map(([label,count])=>`${label}: ${count}`).join('; ');
  return ['FAIR TEST STUDIO','A worksheet, not a safety review or scientific prediction.','','QUESTION',values.question,'','CHANGE ONE THING',values.change,'','KEEP THE SAME',values.keep,'','OBSERVE OR COUNT',values.measure,'','MY PREDICTION',values.prediction||'No prediction recorded.','','BEFORE YOU START','Ask a grown-up to review the plan and materials. Use harmless tabletop materials only.','','SUCCESS RULE (decide before testing)',values.rule||'No success rule recorded.','','RESULTS (record every trial; no automatic scoring)',...trials,'SUMMARY (counts of your judgments, not a scientific conclusion)',summary,'','MY OBSERVATIONS',values.notes||'No observations recorded yet.','','REFLECT','What did you notice?','Was anything different besides the planned change?','What could you try next?'].join('\n');
 }
 if(typeof module!=='undefined')module.exports={fields,example,buildPlan};
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id);let current='';
 function invalidate(){current='';$('plan').value='';$('plan').hidden=true;$('download').hidden=true;$('select-plan').hidden=true;$('print').hidden=true;$('print-plan').textContent='';$('result-title').textContent='Ready when you are.';}
 fields.forEach(id=>$(id).addEventListener('input',()=>{invalidate();$('feedback').textContent='Worksheet changed. Build your plan to include these edits.';}));
 $('experiment-form').addEventListener('submit',event=>{event.preventDefault();try{current=buildPlan(Object.fromEntries(fields.map(id=>[id,$(id).value])));$('plan').value=current;$('plan').hidden=false;$('download').hidden=false;$('select-plan').hidden=false;$('print').hidden=false;$('print-plan').textContent=current;$('result-title').textContent='Your fair-test plan';$('feedback').textContent='Plan built. Review it with a grown-up before trying anything.';}catch(error){invalidate();$('feedback').textContent=error.message;const missing=fields.find(id=>required.includes(id)&&!$(id).value.trim());if(missing)$(missing).focus();}});
 function hasText(){return fields.some(id=>$(id).value.trim());}
 $('example').addEventListener('click',()=>{if(hasText()&&!confirm('Replace this worksheet with the paper example?'))return;fields.forEach(id=>$(id).value=example[id]);invalidate();$('feedback').textContent='Paper example loaded. Review or edit it, then build your plan.';});
 // A repeat run retains the original plan and success rule, never old results.
 $('clear-results').addEventListener('click',()=>{
  const resultFields=[...trialFields,'notes'];
  if(!resultFields.some(id=>$(id).value.trim())){$('feedback').textContent='No trial results to clear. Your plan is unchanged.';return;}
  if(!confirm('Clear all trial expectations, observations, outcomes and notes? Your plan and success rule will stay. Download the current plan first if you want to keep these results.'))return;
  resultFields.forEach(id=>$(id).value='');invalidate();
  $('feedback').textContent='Trial log and notes cleared. Your plan and success rule are unchanged. Build a fresh plan before testing again.';
  $('trial-1-expected').focus();
 });
 $('clear').addEventListener('click',()=>{if(hasText()&&!confirm('Clear this worksheet? Download any plan you want to keep first.'))return;fields.forEach(id=>$(id).value='');invalidate();$('feedback').textContent='Worksheet cleared.';$('question').focus();});
 $('select-plan').addEventListener('click',()=>{if(!current)return;$('plan').focus();$('plan').select();$('feedback').textContent='Plan text selected. Use your device’s Copy command, then paste it where you want. Nothing has been copied automatically.';});
 $('print').addEventListener('click',()=>{if(!current)return;try{root.print();$('feedback').textContent='Print dialog requested. Your worksheet stays here if you cancel.';}catch(error){$('feedback').textContent='Printing unavailable. Download or copy your plan instead.';}});
 $('download').addEventListener('click',()=>{if(!current)return;let url;try{url=URL.createObjectURL(new Blob([current],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='fair-test-plan.txt';link.click();$('feedback').textContent='Plan download requested.';}catch(error){$('feedback').textContent='Download unavailable. Select and copy the plan text instead.';}finally{if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}});
})(typeof window!=='undefined'?window:globalThis);


