'use strict';
const assert = require('node:assert/strict');
const { compare } = require('./delayed-outcomes');
assert.deepEqual(compare('early', 30), { perArm: 200, observed: [0, 0], initialSavings: 400, decision: 'wait' });
assert.deepEqual(compare('lag', 30), { perArm: 200, observed: [200, 190], initialSavings: 400, decision: 'repair' });
assert.deepEqual(compare('complete', 30), {
 perArm: 200, observed: [200, 200], initialSavings: 400, decision: 'pause', rates: [2.5, 12.5],
 change: 10, effort: [1350, 1550], extraReopens: 20, netSavings: -200, breakEven: 20
});
assert.equal(compare('complete', 20).netSavings, 0);
assert.equal(compare('complete', 0).netSavings, 400);
assert.equal(compare('complete', 120).netSavings, -2000);
assert.equal(compare('complete', 30, 10).decision, 'within');
assert.equal(compare('complete', 30, 9).decision, 'pause');
assert.equal(compare('complete', 0, 5).decision, 'pause');
compare('early', 30).observed[0] = 200;
assert.deepEqual(compare('early', 30).observed, [0, 0]);
for (const [_stage, cost, limit] of [
 ['bad', 1, 5], ['__proto__',1,5], ['complete', 121, 5], ['complete', '5', 5],
 ['complete', 7, 1.5], ['complete', -1, 5], ['complete', 8, 101]
]) assert.throws(() => compare(_stage, cost, limit), RangeError);
console.log('PASS: mature and complete follow-up gates, effort, exact threshold, sensitivity and invalid-input checks.');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const html = readFileSync('fair-test.html', 'utf8');
const mock = value => ({ value, textContent: '', events: {},
 addEventListener(name, listener) { this.events[name] = listener; }
});
const els = { stage: mock('early'), cost: mock('30'), limit: mock('5'), result: mock(''), 'cost-label': mock('') };
for (const key of Object.keys(els)) assert(html.includes('id="delay-' + key + '"'));
assert.match(html, /href="#delayed-outcomes"/);
runInNewContext(readFileSync('delayed-outcomes.js', 'utf8'), {
 document: { getElementById: id => els[id.slice(6)] }
});
assert.match(els.result.textContent, /not mature/);
els.stage.value = 'lag'; els.stage.events.change();
assert.match(els.result.textContent, /190\/200.*missing/);
assert.doesNotMatch(els.result.textContent, /12.5%/);
els.stage.value = 'complete'; els.stage.events.change();
assert.match(els.result.textContent, /1350 vs 1550.*200 extra minutes.*Pause expansion/);
els.limit.value = '10'; els.limit.events.change();
assert.match(els.result.textContent, /reopen limit was not exceeded/);
els.cost.value = '20'; els.cost.events.input();
assert.equal(els['cost-label'].textContent, '20 minutes');
assert.match(els.result.textContent, /equal effort/);
console.log('PASS: controls, live status, navigation markup and no premature rates.');
