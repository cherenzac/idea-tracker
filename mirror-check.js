'use strict';
(function () {
 // Synthetic claims about one exit; a cropped frame keeps the exit visible but hides its side.
 const presets = Object.freeze({
  grounded: Object.freeze(['left', 'right', 'unknown', 1, 'blue']),
  sticky: Object.freeze(['left', 'left', 'unknown', 1, 'blue']),
  guessing: Object.freeze(['left', 'right', 'right', 1, 'blue']),
  drift: Object.freeze(['left', 'right', 'unknown', 2, 'green'])
 });
 function score(original, mirror, crop, count, color) {
  if (![original, mirror, crop].every(v => ['left', 'right', 'unknown'].includes(v)) ||
      !Number.isInteger(count) || count < 0 || count > 3 ||
      !['blue', 'green', 'unknown'].includes(color)) throw new RangeError('Invalid example claims.');
  return { direction: Number(original === 'left') + Number(mirror === 'right'),
   consistentFlip: original !== 'unknown' && mirror !== 'unknown' && original !== mirror,
   preserved: Number(count === 1) + Number(color === 'blue'), abstains: crop === 'unknown' };
 }
 if (typeof module !== 'undefined') module.exports = { score, presets };
 if (typeof document === 'undefined') return;
 const variant = document.getElementById('mirror-variant'), result = document.getElementById('mirror-result');
 if (!variant || !result) return;
 function render() {
  if (!Object.hasOwn(presets, variant.value)) return;
  const claims = presets[variant.value], [original, mirror, crop, count, color] = claims;
  const s = score(...claims);
  result.textContent = 'Claims: original ' + original + ', mirror ' + mirror + ', crop ' + crop +
   '; mirrored exit count ' + count + ', color ' + color + '. Direction accuracy: ' + s.direction +
   '/2. Flip consistency: ' + (s.consistentFlip ? 'yes' : 'no') + '. Preserved count and color: ' +
   s.preserved + '/2. Withholds direction on the crop: ' + (s.abstains ? 'yes' : 'no') + '.';
 }
 variant.addEventListener('change', render);
 render();
})();
