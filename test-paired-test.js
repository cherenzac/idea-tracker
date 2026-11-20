'use strict';
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs');
const {compare}=require('./paired-test');
const sample=['28','3','12','17'];
assert.deepEqual(compare(sample),{total:60,a:3,b:12,ties:45,discordant:15,rateA:31/60,rateB:40/60,delta:9/60,p:1152/32768});
assert.equal(compare(['0','0','9','0']).p,2/512);
assert.equal(compare(['0','9','0','0']).p,2/512);
assert.equal(compare(['1','3','3','0']).p,1);
assert.equal(compare(['2','0','0','0']).p,null);
assert.equal(compare(['0','0','500','0']).p,2**-499);
// Exhaustive reference independent of the recurrence: enumerate fair coin sequences.
for(let n=1;n<=9;n++){
 const counts=Array(n+1).fill(0);
 for(let j=0;j<2**n;j++)counts[j.toString(2).split('1').length-1]++;
 for(let a=0;a<=n;a++) {
  const threshold=Math.abs(n-2*a);
  const extreme=counts.reduce((sum,k,i)=>sum+(Math.abs(n-2*i)>=threshold?k:0),0);
  assert.equal(compare(['1',String(a),String(n-a),'2']).p,extreme/2**n);
 }
}
for(const bad of [null, ['0','0','0','0'],['0','0','0','501'],['-1','1','1','1'],['','1','1','1'],['1.5','1','1','1'],['1e2','1','1','1'],[0,'1','1','1'],['2']])assert.throws(()=>compare(bad));
const html=fs.readFileSync('fair-test.html','utf8'),code=fs.readFileSync('paired-test.js','utf8');
const nodes={};let allow=true;
for(const id of ['pair-both','pair-a','pair-b','pair-neither','paired-example','paired-status','paired-output','paired-form']){
 assert(html.includes(`id="${id}"`));
 nodes[id]={value:'',textContent:'',events:{},addEventListener(event,cb){this.events[event]=cb;}};
}
vm.runInNewContext(code,{document:{getElementById:id=>nodes[id]},confirm:()=>allow});
nodes['paired-example'].events.click();
assert.match(nodes['paired-output'].textContent,/B − A: \+15.0 percentage points/);
nodes['pair-a'].value='bad';nodes['pair-a'].events.input();
assert.equal(nodes['paired-output'].textContent,'');
allow=false;nodes['paired-example'].events.click();
assert.equal(nodes['pair-a'].value,'bad');
nodes['paired-form'].events.submit({preventDefault(){}});
assert.match(nodes['paired-status'].textContent,/whole count/);
console.log('PASS: paired binary outcomes, exact enumerated tails, bounds, validation, example cancellation and stale feedback.');
