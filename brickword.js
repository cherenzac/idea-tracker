'use strict';
// Browser-local typography, not a remote AI image service.
const BrickWord = (() => {
 const palettes={classic:['#ee4c42','#f5c843','#3b9ed9','#58ba78'],sunset:['#fca85c','#ec6861','#bf78bb','#f4d06f'],ocean:['#5fc7cf','#4b9dd5','#596ac7','#c1e5de']};
 function normalize(value){return Array.from(String(value).normalize('NFC').replace(/\s+/gu,' ').trim()).slice(0,24).join('');}
 function linesFor(value){const chars=Array.from(normalize(value));if(chars.length<=12)return [chars.join('')];let split=chars.lastIndexOf(' ',12);if(split<5)split=12;return [chars.slice(0,split).join(''),chars.slice(split).join('').trim()];}
 function filename(value){return 'brick-word-'+normalize(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,36).replace(/^$/,'art')+'.png';}
 function paint(canvas,value,paletteName='classic',makeCanvas){
  const text=normalize(value);if(!text)throw new Error('Type a word or short phrase first.');
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('This browser cannot draw canvas images.');
  canvas.width=1400;canvas.height=900;
  const mask=makeCanvas();mask.width=1400;mask.height=900;const m=mask.getContext('2d',{willReadFrequently:true});
  if(!m)throw new Error('This browser cannot draw canvas images.');
  const lines=linesFor(text), palette=palettes[paletteName]||palettes.classic;
  let size=lines.length===1?290:220;
  do{m.font=`900 ${size}px Arial, sans-serif`;if(Math.max(...lines.map(line=>m.measureText(line).width))<=1160)break;size-=4;}while(size>36);
  m.textAlign='center';m.textBaseline='middle';m.fillStyle='#fff';
  lines.forEach((line,index)=>m.fillText(line,700,lines.length===1?425:310+index*265));
  const pixels=m.getImageData(0,0,1400,900).data;
  ctx.fillStyle='#e7e5dc';ctx.fillRect(0,0,1400,900);
  // Neutral baseplate. Its small studs keep the letters visually dominant.
  for(let y=28;y<900;y+=28)for(let x=28;x<1400;x+=28){ctx.fillStyle='#dad8ce';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();}
  let count=0;const step=16;
  for(let y=96;y<790;y+=step)for(let x=80;x<1320;x+=step){
   if(pixels[(y*1400+x)*4+3]<100)continue;
   count++;const color=palette[Math.floor(x/150)%palette.length];
   ctx.fillStyle='#18251d35';ctx.fillRect(x-6,y-3,16,16);
   ctx.fillStyle=color;ctx.fillRect(x-8,y-8,15,15);
   ctx.fillStyle='#fff4';ctx.fillRect(x-8,y-8,15,2);ctx.fillStyle='#0002';ctx.fillRect(x-8,y+5,15,2);
   ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(x,y+1,4.4,3.7,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y-1,4.4,3.7,0,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#ffffff70';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y-1,3.7,3,0,Math.PI,Math.PI*1.8);ctx.stroke();
  }
  ctx.textAlign='center';ctx.font='16px monospace';ctx.fillStyle='#54624c';ctx.fillText('IDEAVISION  /  BRICK WORD STUDIO',700,836);
  if(!count)throw new Error('No visible letters found. Try another word or a font-supported script.');
  return {text,count,lines};
 }
 return {normalize,linesFor,filename,paint,palettes};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=BrickWord;
if(typeof document!=='undefined'){
 const el=id=>document.getElementById(id);const canvas=el('brick-canvas');let last='';
 function build(){try{const result=BrickWord.paint(canvas,el('brick-word').value,el('brick-palette').value,()=>document.createElement('canvas'));last=result.text;canvas.setAttribute('aria-label',`Building-block lettering of ${last}`);el('brick-message').textContent=`Built “${last}” with ${result.count.toLocaleString()} bricks. Your image is ready.`;el('brick-download').disabled=false;}catch(error){el('brick-message').textContent=error.message;el('brick-download').disabled=true;}}
 el('brick-form').addEventListener('submit',event=>{event.preventDefault();build();});
 el('brick-palette').addEventListener('change',build);
 document.querySelectorAll('[data-brick-word]').forEach(button=>button.addEventListener('click',()=>{el('brick-word').value=button.dataset.brickWord;build();}));
 el('brick-word').addEventListener('input',()=>{el('brick-message').textContent='Press Build image to update the preview.';el('brick-download').disabled=true;});
 el('brick-download').addEventListener('click',()=>{
  try{canvas.toBlob(blob=>{if(!blob){el('brick-message').textContent='Image export failed. Please try again.';return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=BrickWord.filename(last);a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);el('brick-message').textContent='PNG download started. On mobile, use your browser’s Downloads or Share menu to save it.';},'image/png');}catch{el('brick-message').textContent='Image export is unavailable in this browser.';}
 });
 build();
}
