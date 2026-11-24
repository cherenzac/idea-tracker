'use strict';
const assert=require('node:assert/strict');const {validProjects,recentIds,searchProjects}=require('./navigation');const registry=require('./projects');
assert.equal(validProjects(registry).length,8);
const fifty=Array.from({length:50},(_,i)=>({id:'p'+i,title:'Project '+i,description:'Daily creation',category:i%2?'Creative':'Tools',status:'Ready',url:'https://example.com/'+i,tags:['day'+i]}));
assert.equal(validProjects(fifty).length,50);assert.equal(searchProjects(fifty,'day49')[0].id,'p49');assert.equal(searchProjects(fifty,'DAILY creative').length,25);assert.equal(searchProjects(fifty,'unknown').length,0);
assert.deepEqual(recentIds(['p49','p2','p49','missing','p3','p4','p5','p6'],fifty),['p49','p2','p3','p4','p5']);
assert.equal(validProjects([{id:'x',title:'Unsafe',url:'javascript:alert(1)'},{id:'a',title:'Okay',url:'https://example.com'},{id:'a',title:'Duplicate',panel:'p'}]).length,1);
assert.equal(searchProjects(registry,'lego png')[0].id,'bricks');console.log('PASS: 50 projects, multiple-term search, five recents, dedupe, stale ids, URL filtering, actual registry.');


assert.equal(searchProjects(registry,'pomodoro timer')[0].id,'pomodoro');


assert.equal(searchProjects(registry,'daily insights')[0].id,'daily-insights');


assert.equal(searchProjects(registry,'vacation hotels')[0].id,'vacations');

assert.equal(searchProjects(registry,'experiment worksheet')[0].id,'fair-test');
{
 const assert=require('node:assert/strict'), fs=require('node:fs');
 const registry=require('./projects'),{searchProjects}=require('./navigation');
 for(const query of ['agent approval','answer order','AUDIT   sampling','review snapshot']) {
  const results=searchProjects(registry,query);
  assert.deepEqual(results.map(p=>p.id),['fair-test'],query);
  assert.match(results[0].url,/fair-test\.html$/);
 }
 assert.equal(searchProjects(registry,'audit somethingabsent').length,0);
 assert.match(fs.readFileSync('./index.html','utf8'),/projects\.js\?v=20261124-alias/);
}
