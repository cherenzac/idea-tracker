'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {fields,example,buildPlan}=require('./fair-test');
assert.match(buildPlan(example),/Trial 3:/);assert.match(buildPlan({...example,prediction:''}),/No prediction recorded/);
for(const field of fields){assert.throws(()=>buildPlan({...example,[field]:'x'.repeat(301)}));assert.throws(()=>buildPlan({...example,[field]:3}));if(field!=='prediction')assert.throws(()=>buildPlan({...example,[field]:'  '}));}
assert.match(buildPlan({...example,question:'<script>literal</script>'}),/<script>literal<\/script>/);
class El{constructor(){this.value='';this.hidden=false;this.handlers={};this.textContent='';}addEventListener(t,f){this.handlers[t]=f;}focus(){this.focused=true;}click(){this.clicked=true;}}
const els=Object.fromEntries([...fields,'experiment-form','example','clear','feedback','plan','download','result-title','print','print-plan'].map(id=>[id,new El()]));let allow=true,downloads=[],revoked=[],prints=0;
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
