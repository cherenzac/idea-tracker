'use strict';
(function(root){
 const fields=['question','change','keep','measure','prediction'];
 const example={question:'Does folding paper change how much it can hold?',change:'Paper shape: flat versus accordion-folded.',keep:'Same paper size and type, same small gap between supports, same paper squares as weights.',measure:'Count paper squares held before the bridge bends. Repeat each shape three times and write down every count.',prediction:'I predict folded paper will hold more squares because the folds may help it keep its shape.'};
 function buildPlan(input){
  const values={};
  for(const field of fields){const value=input?.[field];if(typeof value!=='string')throw new Error('Enter text for each worksheet field.');values[field]=value.trim();if(values[field].length>300)throw new Error('Keep each field to 300 characters or fewer.');if(field!=='prediction'&&!values[field])throw new Error('Complete the four required fields before building a plan.');}
  return ['FAIR TEST STUDIO','A worksheet, not a safety review or scientific prediction.','','QUESTION',values.question,'','CHANGE ONE THING',values.change,'','KEEP THE SAME',values.keep,'','OBSERVE OR COUNT',values.measure,'','MY PREDICTION',values.prediction||'No prediction recorded.','','BEFORE YOU START','Ask a grown-up to review the plan and materials. Use harmless tabletop materials only.','','RESULTS (fill in after testing)','Trial 1:','Trial 2:','Trial 3:','','REFLECT','What did you notice?','Was anything different besides the planned change?','What could you try next?'].join('\n');
 }
 if(typeof module!=='undefined')module.exports={fields,example,buildPlan};
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id);let current='';
 function invalidate(){current='';$('plan').value='';$('plan').hidden=true;$('download').hidden=true;$('result-title').textContent='Ready when you are.';}
 fields.forEach(id=>$(id).addEventListener('input',()=>{invalidate();$('feedback').textContent='Worksheet changed. Build your plan to include these edits.';}));
 $('experiment-form').addEventListener('submit',event=>{event.preventDefault();try{current=buildPlan(Object.fromEntries(fields.map(id=>[id,$(id).value])));$('plan').value=current;$('plan').hidden=false;$('download').hidden=false;$('result-title').textContent='Your fair-test plan';$('feedback').textContent='Plan built. Review it with a grown-up before trying anything.';}catch(error){invalidate();$('feedback').textContent=error.message;const missing=fields.find(id=>id!=='prediction'&&!$(id).value.trim());if(missing)$(missing).focus();}});
 function hasText(){return fields.some(id=>$(id).value.trim());}
 $('example').addEventListener('click',()=>{if(hasText()&&!confirm('Replace this worksheet with the paper example?'))return;fields.forEach(id=>$(id).value=example[id]);invalidate();$('feedback').textContent='Paper example loaded. Review or edit it, then build your plan.';});
 $('clear').addEventListener('click',()=>{if(hasText()&&!confirm('Clear this worksheet? Download any plan you want to keep first.'))return;fields.forEach(id=>$(id).value='');invalidate();$('feedback').textContent='Worksheet cleared.';$('question').focus();});
 $('download').addEventListener('click',()=>{if(!current)return;let url;try{url=URL.createObjectURL(new Blob([current],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='fair-test-plan.txt';link.click();$('feedback').textContent='Plan download requested.';}catch(error){$('feedback').textContent='Download unavailable. Select and copy the plan text instead.';}finally{if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}});
})(typeof window!=='undefined'?window:globalThis);
