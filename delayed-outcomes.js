'use strict';
(function () {
 const scenarios = Object.freeze({
  early: Object.freeze({ day: 2, observed: [0, 0], reopens: null }),
  lag: Object.freeze({ day: 7, observed: [200, 190], reopens: [5, 25] }),
  complete: Object.freeze({ day: 7, observed: [200, 200], reopens: [5, 25] })
 });
 function compare(stage, cost, limit = 5) {
  if (!Object.hasOwn(scenarios, stage) || !Number.isInteger(cost) || cost < 0 || cost > 120 ||
      !Number.isInteger(limit) || limit < 0 || limit > 100) throw new RangeError('Invalid example settings.');
  const { day, observed, reopens } = scenarios[stage];
  const perArm = 200, firstMinutes = [6, 4], initialSavings = perArm * (firstMinutes[0] - firstMinutes[1]);
  const base = { perArm, observed: [...observed], initialSavings };
  if (day < 7) return { ...base, decision: 'wait' };
  if (observed.some(n => n !== perArm)) return { ...base, decision: 'repair' };
  const extraReopens = reopens[1] - reopens[0];
  const change = 100 * extraReopens / perArm;
  const effort = firstMinutes.map((minutes, i) => perArm * minutes + reopens[i] * cost);
  return { ...base, decision: 100 * extraReopens > limit * perArm ? 'pause' : 'within',
   rates: reopens.map(n => 100 * n / perArm), change, effort, extraReopens,
   netSavings: effort[0] - effort[1], breakEven: initialSavings / extraReopens };
 }
 if (typeof module !== 'undefined') module.exports = { compare };
 if (typeof document === 'undefined') return;
 const get = id => document.getElementById('delay-' + id);
 const stage = get('stage'), cost = get('cost'), limit = get('limit'), output = get('result');
 if (!stage || !cost || !limit || !output) return;
 function render() {
  const minutes = Number(cost.value);
  get('cost-label').textContent = minutes + ' minutes';
  const result = compare(stage.value, minutes, Number(limit.value));
  const followup = 'Complete follow-up: control ' + result.observed[0] + '/200; canary ' + result.observed[1] + '/200. ';
  const early = 'First handling: 400 minutes saved across 200 canary tickets. ';
  if (result.decision === 'wait') {
   output.textContent = followup + early + 'Hold exposure: the seven-day outcome is not mature.';
  } else if (result.decision === 'repair') {
   output.textContent = followup + early + 'Hold exposure: recover the missing canary outcomes before comparing rates.';
  } else {
   const delta = result.netSavings === 0 ? 'equal effort' : Math.abs(result.netSavings) + (result.netSavings > 0 ? ' minutes saved' : ' extra minutes');
   output.textContent = followup + 'Reopens: ' + result.rates[0] + '% control vs ' + result.rates[1] +
    '% canary (+' + result.change + ' percentage points). Total: ' + result.effort[0] + ' vs ' +
    result.effort[1] + ' minutes (' + delta + '). Break-even: ' + result.breakEven +
    ' minutes per extra reopen. ' + (result.decision === 'pause' ? 'Pause expansion: the reopen limit was exceeded.' :
     'The reopen limit was not exceeded; this alone is not approval to expand.');
  }
 }
 stage.addEventListener('change', render);
 limit.addEventListener('change', render);
 cost.addEventListener('input', render);
 render();
})();
