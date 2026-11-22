'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {orders,summarize}=require('./order-check');
assert.deepEqual(orders,['ABC','ACB','BAC','BCA','CAB','CBA']);
assert.deepEqual(summarize('A',orders.map(x=>x[0])),{correct:2,baselineFlips:4,pairFlips:12});
assert.deepEqual(summarize('A',orders.map(()=> 'A')),{correct:6,baselineFlips:0,pairFlips:0});
assert.deepEqual(summarize('A',orders.map(()=> 'B')),{correct:0,baselineFlips:0,pairFlips:0});
assert.deepEqual(summarize('C',['A','A','B','A','A','C']),{correct:1,baselineFlips:2,pairFlips:9});
assert.throws(()=>summarize('',orders.map(()=> 'A')),RangeError);
assert.throws(()=>summarize('A',new Array(6)),RangeError);
assert.throws(()=>summarize('A',['A','B','C','A','B','D']),RangeError);
for(let k=0;k<729;k++){
 const picks=orders.map((_,i)=>'ABC'[Math.floor(k/3**i)%3]);
 const counts=Array.from('ABC',label=>picks.filter(x=>x===label).length);
 const s=summarize('A',picks);
 assert.equal(s.pairFlips,counts[0]*counts[1]+counts[0]*counts[2]+counts[1]*counts[2]);
 assert.equal(s.correct,counts[0]);
 assert(s.baselineFlips<=s.pairFlips);
}
const html=fs.readFileSync('./fair-test.html','utf8');
const fields={},get=id=>{
 assert(html.includes('id="'+id+'"'),id+' must exist in HTML');
 return fields[id]??={value:'',textContent:'',events:{},addEventListener(type,fn){this.events[type]=fn;}};
};
vm.runInNewContext(fs.readFileSync('./order-check.js','utf8'),{document:{getElementById:get}});
get('order-first').events.click();
assert.match(get('order-output').textContent,/2\/6.*4\/5.*12\/15/);
get('order-right').events.click();
assert.match(get('order-output').textContent,/6\/6.*0\/5.*0\/15/);
get('order-wrong').events.click();
assert.match(get('order-output').textContent,/0\/6.*0\/5.*0\/15/);
get('order-abc').value='';
get('order-abc').events.change();
assert.match(get('order-output').textContent,/Selections changed/);
get('order-form').events.submit({preventDefault(){}});
assert.match(get('order-output').textContent,/record one selected label/);
for(const id of orders.map(o=>'order-'+o.toLowerCase()).concat('order-correct'))assert(html.includes('for="'+id+'"'),id);
assert.match(html,/id="order-output" role="status"/);
console.log('PASS: six semantic orderings, all-pairs stability, baseline dependence, synthetic examples and stale-result prevention.');
