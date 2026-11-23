'use strict';
(function(){
 const recipients=['Maple Print Desk','Cedar Print Desk'];
 const amounts=[120,210];
 function createReview(){
  let draft={recipient:recipients[0],amount:amounts[0]},revision=1,reviewed=null,used=false;
  function state(){
   const status=!reviewed?'unreviewed':reviewed.revision!==revision?'stale':used?'used':'ready';
   return {draft:{...draft},revision,reviewed:reviewed?{...reviewed}:null,status};
  }
  return {
   state,
   edit(recipient,amount){
    if(!recipients.includes(recipient)||!amounts.includes(amount))throw new RangeError('Choose one of the fictional drafts.');
    if(recipient!==draft.recipient||amount!==draft.amount){draft={recipient,amount};revision++;}
    return state();
   },
   review(){reviewed={...draft,revision};used=false;return state();},
   simulate(){if(state().status!=='ready')return false;used=true;return true;}
  };
 }
 if(typeof module!=='undefined')module.exports={createReview};
 if(typeof document==='undefined')return;
 const el=id=>document.getElementById(id),flow=createReview();
 const recipient=el('approval-demo-recipient'),amount=el('approval-demo-amount');
 const format=({recipient,amount})=>recipient+', $'+amount+' USD';
 const statusText={
  unreviewed:'Not reviewed. Record a review of this draft first.',
  stale:'Draft changed since review. Review this revision again, even if an edit was reversed.',
  ready:'Current revision reviewed. You can simulate proceeding once.',
  used:'Simulation already recorded for this review; nothing was sent or charged.'
 };
 function render(prefix=''){
  const s=flow.state();
  el('approval-demo-reviewed').textContent=s.reviewed
   ? 'Reviewed revision '+s.reviewed.revision+': '+format(s.reviewed)+'.'
   : 'No reviewed draft yet.';
  el('approval-demo-status').textContent=prefix+'Draft revision '+s.revision+': '+format(s.draft)+'. '+statusText[s.status];
 }
 function sync(){return flow.edit(recipient.value,Number(amount.value));}
 for(const field of [recipient,amount])field.addEventListener('change',()=>{sync();render();});
 el('approval-demo-review').addEventListener('click',()=>{sync();flow.review();render();});
 el('approval-demo-proceed').addEventListener('click',()=>{
  sync();
  render(flow.simulate()?'Simulation recorded. ':'Simulation blocked. ');
 });
})();
