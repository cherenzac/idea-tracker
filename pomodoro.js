'use strict';
(function(root){
 const defaults=Object.freeze({work:30,short:10,long:30,rounds:5,longEvery:4});
 function validate(input){
  const config={};
  for(const key of Object.keys(defaults)){
   const raw=input[key],value=Number(raw),max=['rounds','longEvery'].includes(key)?20:180;
   if(raw===''||!Number.isInteger(value)||value<1||value>max)throw new Error('Use whole minutes from 1–180 and round counts from 1–20.');
   config[key]=value;
  }
  return config;
 }
 function schedule(input){
  const c=validate(input),phases=[];
  for(let round=1;round<=c.rounds;round++){
   phases.push({kind:'work',label:'Focus',round,duration:c.work*60000});
   if(round<c.rounds){const long=round%c.longEvery===0;phases.push({kind:long?'long':'short',label:long?'Long break':'Short break',round,duration:(long?c.long:c.short)*60000});}
  }
  return phases;
 }
 class Timer {
  constructor(config=defaults,now=()=>Date.now()){this.now=now;this.configure(config);}
  configure(config){const valid=validate(config),phases=schedule(valid);this.config=valid;this.phases=phases;this.reset();}
  reset(){this.index=0;this.remaining=this.phases[0].duration;this.running=false;this.deadline=null;this.started=false;}
  tick(){
   if(!this.running)return;
   const now=this.now();
   // Use elapsed wall time, not callback counts; catch up after throttled tabs/sleep.
   while(this.index<this.phases.length&&now>=this.deadline){
    this.index++;
    if(this.index===this.phases.length){this.running=false;this.remaining=0;this.deadline=null;return;}
    this.deadline+=this.phases[this.index].duration;
   }
   this.remaining=Math.max(0,this.deadline-now);
  }
  start(){if(this.running||this.index===this.phases.length)return;this.running=true;this.started=true;this.deadline=this.now()+this.remaining;}
  pause(){this.tick();if(!this.running)return;this.running=false;this.deadline=null;}
  snapshot(){this.tick();return {phase:this.phases[this.index]||null,remaining:this.remaining,running:this.running,complete:this.index===this.phases.length,started:this.started,rounds:this.config.rounds};}
 }
 function format(ms){const seconds=Math.ceil(Math.max(0,ms)/1000);return Math.floor(seconds/60).toString().padStart(2,'0')+':'+(seconds%60).toString().padStart(2,'0');}
 if(typeof module!=='undefined'){module.exports={defaults,validate,schedule,Timer,format};return;}
 const el=id=>document.getElementById(id),timer=new Timer();let lastAnnouncement='';
 function render(){
  const s=timer.snapshot(),phase=s.complete?'Session complete':s.phase.label+' · round '+s.phase.round+' of '+s.rounds;
  el('pomodoro-time').textContent=format(s.remaining);el('pomodoro-phase').textContent=phase;
  el('pomodoro-start').textContent=s.started?'Resume':'Start';el('pomodoro-start').disabled=s.running||s.complete;
  el('pomodoro-pause').disabled=!s.running;
  const summary=s.complete?'Session complete. All focus rounds finished.':phase+(s.running?' — running.':s.started?' — paused.':' — ready.');
  if(summary!==lastAnnouncement){el('pomodoro-status').textContent=summary;lastAnnouncement=summary;}
 }
 function showPlan(){el('pomodoro-plan').textContent=timer.phases.map(p=>p.label+' '+p.duration/60000+' min').join(' → ');}
 el('pomodoro-start').addEventListener('click',()=>{timer.start();render();});
 el('pomodoro-pause').addEventListener('click',()=>{timer.pause();render();});
 el('pomodoro-reset').addEventListener('click',()=>{if(timer.started&&!confirm('Reset this timer session? Your configured durations stay the same.'))return;timer.reset();render();});
 el('pomodoro-form').addEventListener('submit',event=>{
  event.preventDefault();const input=Object.fromEntries(Object.keys(defaults).map(key=>[key,el('pomodoro-'+key).value]));
  try{const config=validate(input);if(timer.started&&!confirm('Apply these settings and reset this timer session?'))return;timer.configure(config);showPlan();render();el('pomodoro-settings-status').textContent='Settings applied. Timer reset and ready.';}
  catch(error){el('pomodoro-settings-status').textContent=error.message;}
 });
 document.addEventListener('visibilitychange',render);root.addEventListener('focus',render);
 setInterval(render,250);showPlan();render();
})(typeof window!=='undefined'?window:globalThis);
