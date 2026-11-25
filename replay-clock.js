(function () {
 'use strict';
 const rows = [
  { id: 'A', value: 3, effective: 1, observed: 1 },
  { id: 'B', value: 5, effective: 10, observed: 8 },
  { id: 'C', value: 4, effective: 6, observed: 12 }
 ];
 function replay(target, knownBy) {
  if (![target, knownBy].every(day => Number.isInteger(day) && day >= 1 && day <= 12)) {
   throw new RangeError('Choose a day from 1 through 12 for each clock.');
  }
  const checks = rows.map(row => ({
   ...row, applies: row.effective <= target, visible: row.observed <= knownBy
  }));
  const selected = checks.filter(row => row.applies && row.visible)
   .sort((a, b) => b.effective - a.effective)[0];
  return { checks, selected };
 }
 if (typeof module !== 'undefined') module.exports = { replay };
 if (typeof document === 'undefined') return;
 const get = id => document.getElementById(id);
 const target = get('replay-target'), knownBy = get('replay-known');
 function render() {
  const { checks, selected } = replay(Number(target.value), Number(knownBy.value));
  for (const row of checks) {
   get('replay-row-' + row.id).textContent =
    (row.applies ? 'In effect' : 'Not yet in effect') + '; ' +
    (row.visible ? 'known' : 'not yet known') + (row === selected ? '; selected' : '');
  }
  get('replay-result').textContent = selected
   ? 'Version ' + selected.id + ' allows ' + selected.value + ' game pieces.'
   : 'No eligible version. Do not fill the gap with future information.';
 }
 target.addEventListener('change', render);
 knownBy.addEventListener('change', render);
 render();
})();
