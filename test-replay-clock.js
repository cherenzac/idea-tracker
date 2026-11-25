'use strict';
const assert = require('node:assert/strict');
const { replay } = require('./replay-clock');
assert.equal(replay(9, 9).selected.id, 'A');
assert.deepEqual(replay(9, 9).checks.map(r => [r.id, r.applies, r.visible]), [
 ['A', true, true], ['B', false, true], ['C', true, false]
]);
assert.equal(replay(9, 12).selected.id, 'C');
assert.equal(replay(10, 9).selected.id, 'B');
assert.equal(replay(10, 12).selected.id, 'B');
assert.equal(replay(10, 7).selected.id, 'A');
assert.equal(replay(6, 12).selected.id, 'C');
assert.equal(replay(5, 12).selected.id, 'A');
assert.equal(replay(1, 1).selected.id, 'A');
for (const bad of [null, '9', 0, 13, 8.5, NaN]) {
 assert.throws(() => replay(bad, 9), RangeError);
 assert.throws(() => replay(9, bad), RangeError);
}
console.log('PASS: point-in-time replay rejects late and premature records, honors inclusive boundaries and chooses latest effective rather than latest observed.');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const element = value => ({ value, textContent: '', listeners: {},
 addEventListener(event, callback) { this.listeners[event] = callback; }
});
const ids = Object.fromEntries(['target', 'known', 'result', 'row-A', 'row-B', 'row-C']
 .map(id => ['replay-' + id, element('9')]));
const html = readFileSync('fair-test.html', 'utf8');
for (const id of Object.keys(ids)) assert(html.includes('id="' + id + '"'));
assert(html.includes('src="replay-clock.js?v=1"'));
runInNewContext(readFileSync('replay-clock.js', 'utf8'), {
 document: { getElementById: id => ids[id] }
});
assert.equal(ids['replay-result'].textContent, 'Version A allows 3 game pieces.');
assert.equal(ids['replay-row-B'].textContent, 'Not yet in effect; known');
assert.equal(ids['replay-row-C'].textContent, 'In effect; not yet known');
ids['replay-known'].value = '12';
ids['replay-known'].listeners.change();
assert.equal(ids['replay-result'].textContent, 'Version C allows 4 game pieces.');
ids['replay-target'].value = '10';
ids['replay-target'].listeners.change();
assert.equal(ids['replay-result'].textContent, 'Version B allows 5 game pieces.');
console.log('PASS: Fair Test replay markup and both change handlers independently update the live result.');
