'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {fields,example,buildPlan}=require('./fair-test');
assert.match(buildPlan(example),/Trial 3:/);assert.match(buildPlan({...example,prediction:''}),/No prediction recorded/);
for(const field of fields){assert.throws(()=>buildPlan({...example,[field]:'x'.repeat(301)}));assert.throws(()=>buildPlan({...example,[field]:3}));if(['question','change','keep','measure'].includes(field))assert.throws(()=>buildPlan({...example,[field]:'  '}));}
assert.match(buildPlan({...example,question:'<script>literal</script>'}),/<script>literal<\/script>/);
class El{constructor(){this.value='';this.hidden=false;this.handlers={};this.textContent='';}addEventListener(t,f){this.handlers[t]=f;}focus(){this.focused=true;}select(){this.selectionStart=0;this.selectionEnd=this.value.length;}click(){this.clicked=true;}}
const els=Object.fromEntries([...fields,'experiment-form','example','clear','feedback','plan','download','result-title','print','print-plan','select-plan','clear-results'].map(id=>[id,new El()]));let allow=true,downloads=[],revoked=[],prints=0;
const ctx={print:()=>{prints++;},document:{getElementById:id=>els[id],createElement:()=>{const e=new El();downloads.push(e);return e;}},confirm:()=>allow,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:u=>revoked.push(u)},Blob,setTimeout:fn=>fn()};
vm.runInNewContext(fs.readFileSync('fair-test.js','utf8'),ctx);
const click=id=>els[id].handlers.click();const submit=()=>els['experiment-form'].handlers.submit({preventDefault(){}});
click('example');assert.equal(els.question.value,example.question);submit();assert.equal(els.plan.hidden,false);assert.match(els.plan.value,/FAIR TEST STUDIO/);click('download');assert.equal(downloads[0].download,'fair-test-plan.txt');assert.equal(downloads[0].clicked,true);assert.deepEqual(revoked,['blob:test']);
allow=false;click('clear');assert.equal(els.question.value,example.question);els.question.value='My custom question';click('example');assert.equal(els.question.value,'My custom question');els.question.handlers.input();assert.equal(els.plan.hidden,true);click('download');assert.equal(downloads.length,1);
allow=true;click('example');submit();click('example');assert.equal(els.download.hidden,true);submit();click('clear');assert.equal(els.question.value,'');assert.equal(els.plan.value,'');assert.equal(els.question.focused,true);submit();assert.match(els.feedback.textContent,/four required/);
click('example');submit();ctx.URL.createObjectURL=()=>{throw Error('blocked');};click('download');assert.match(els.feedback.textContent,/Select and copy/);
const html=fs.readFileSync('fair-test.html','utf8');for(const id of Object.keys(els))assert.ok(html.includes(`id="${id}"`),id);assert.ok(html.includes('readonly hidden'));assert.ok(html.includes('No people, animals, chemicals, heat or electricity'));
assert.ok(fs.readFileSync('index.html','utf8').includes('href="fair-test.html"'));assert.equal(require('./projects').filter(p=>p.id==='fair-test').length,1);
console.log('PASS: worksheet validation, optional prediction, literal text, example/clear confirmation, stale-output invalidation, download/error, repeated flows and launcher wiring.');

click('print');assert.equal(prints,1);assert.equal(els['print-plan'].textContent,els.plan.value);
assert.match(els.feedback.textContent,/cancel/);
els.question.value='Revised';els.question.handlers.input();assert.equal(els.print.hidden,true);assert.equal(els['print-plan'].textContent,'');click('print');assert.equal(prints,1);
submit();ctx.print=()=>{throw Error('blocked');};click('print');assert.match(els.feedback.textContent,/Printing unavailable/);
assert.match(fs.readFileSync('fair-test.css','utf8'),/@media print/);
console.log('PASS: print snapshot, cancel-safe feedback, stale-print prevention and unavailable-print fallback.');


// Observations are optional, literal user text, never generated results.
assert.match(buildPlan(example), /No observations recorded yet/);
assert.match(buildPlan({...example, notes:'  Trial 1: 4; Trial 2: 3; <b>uncertain</b>  '}), /Trial 1: 4; Trial 2: 3; <b>uncertain<\/b>/);
els.notes.value='Two trials gave different counts';els.notes.handlers.input();
assert.equal(els.download.hidden,true);assert.equal(els.print.hidden,true);
submit();assert.match(els.plan.value,/Two trials gave different counts/);
assert.equal(els['print-plan'].textContent,els.plan.value);
allow=false;click('example');assert.equal(els.notes.value,'Two trials gave different counts');
allow=true;click('clear');assert.equal(els.notes.value,'');
console.log('PASS: optional observations, literal text, rebuild and print inclusion, stale-output protection and cancel-safe clearing.');


click('example');submit();click('select-plan');
assert.equal(els.plan.focused,true);assert.equal(els.plan.selectionStart,0);
assert.equal(els.plan.selectionEnd,els.plan.value.length);
assert.match(els.feedback.textContent,/Nothing has been copied automatically/);
els.notes.value='Updated';els.notes.handlers.input();
assert.equal(els['select-plan'].hidden,true);
const priorFeedback=els.feedback.textContent;click('select-plan');assert.equal(els.feedback.textContent,priorFeedback);
submit();assert.equal(els['select-plan'].hidden,false);click('select-plan');click('select-plan');
assert.equal(els.plan.selectionEnd,els.plan.value.length);
console.log('PASS: select-plan focus/full text, honest copy instructions, hidden and inert stale output, rebuild and repeat selection.');

const scored={...example,'trial-1-expected':'5 squares','trial-1-observed':'6 squares','trial-1-verdict':'Pass'};
assert.match(buildPlan(scored),/Expected: 5 squares/);assert.match(buildPlan(scored),/Observed: 6 squares/);assert.match(buildPlan(scored),/Outcome \(your judgment\): Pass/);
for(const missing of ['rule','trial-1-expected','trial-1-observed'])assert.throws(()=>buildPlan({...scored,[missing]:''}),/To score/);
assert.throws(()=>buildPlan({...scored,'trial-1-verdict':'Guaranteed'}),/listed/);
for(const verdict of ['Fail','Unclear',''])assert.doesNotThrow(()=>buildPlan({...scored,'trial-1-verdict':verdict}));
click('example');els['trial-1-expected'].value='5';els['trial-1-observed'].value='<b>6</b>';els['trial-1-verdict'].value='Pass';submit();assert.match(els.plan.value,/<b>6<\/b>/);
els['trial-1-observed'].handlers.input();assert.equal(els.download.hidden,true);submit();assert.equal(els['print-plan'].textContent,els.plan.value);
allow=false;click('clear');assert.equal(els['trial-1-verdict'].value,'Pass');allow=true;click('clear');for(const id of fields)assert.equal(els[id].value,'');
console.log('PASS: human-scored trial validation, optional unscored records, literal observations, stale output, print inclusion and cancel-safe clearing.');

// Reset results for a repeat run without losing the planned experiment.
click('example');els.rule.value='Keep this rule';els.notes.value='Old notes';
els['trial-1-expected'].value='Five';els['trial-1-observed'].value='Six';els['trial-1-verdict'].value='Pass';submit();
const prior=els.plan.value;allow=false;click('clear-results');
assert.equal(els.plan.value,prior);assert.equal(els.notes.value,'Old notes');
allow=true;click('clear-results');assert.equal(els.question.value,example.question);
assert.equal(els.rule.value,'Keep this rule');assert.equal(els.prediction.value,example.prediction);
for(const id of fields.filter(id=>id.startsWith('trial-')||id==='notes'))assert.equal(els[id].value,'');
assert.equal(els.plan.hidden,true);assert.equal(els.download.hidden,true);assert.equal(els.print.hidden,true);
assert.equal(els['trial-1-expected'].focused,true);submit();assert.doesNotMatch(els.plan.value,/Old notes|Observed: Six/);
const fresh=els.plan.value;click('clear-results');assert.equal(els.plan.value,fresh);
assert.match(els.feedback.textContent,/No trial results/);
console.log('PASS: cancel-safe result reset, plan/rule preservation, stale exports hidden, empty/repeated reset and keyboard focus.');

assert.match(buildPlan(example),/Pass: 0; Fail: 0; Unclear: 0; Not scored: 3/);
assert.match(buildPlan({...example,'trial-1-expected':'Five','trial-1-observed':'Five','trial-1-verdict':'Pass','trial-2-expected':'Five','trial-2-observed':'Four','trial-2-verdict':'Fail','trial-3-expected':'Five','trial-3-observed':'Could not count','trial-3-verdict':'Unclear'}),/Pass: 1; Fail: 1; Unclear: 1; Not scored: 0/);
{
 const fs=require('node:fs'),assert=require('node:assert/strict');
 const page=fs.readFileSync('./fair-test.html','utf8'),css=fs.readFileSync('./fair-test.css','utf8');
 const directory=page.match(/<nav class="studio-directory" aria-label="Studio sections">.*?<\/nav>/s)?.[0];
 assert(directory);
 const targets=Array.from(directory.matchAll(/href="#([^"]+)"/g),m=>m[1]);
 assert.deepEqual(targets,['planner','paired','audit-sampling','order-check','approval-revision', 'replay-clock', 'delayed-outcomes', 'mirror-check']);
 for(const target of targets){assert.equal(page.split('id="'+target+'"').length,2);assert(page.includes('id="'+target+'" tabindex="-1"'));}
 assert.match(css,/@media print\{\.studio-directory\{display:none!important\}\}/);
}
