'use strict';
(function(root){
 const products=[
 {id:'adhd-book',title:'ADHD 2.0',brand:'Edward M. Hallowell & John J. Ratey',category:'Read & learn',description:'A book exploring ADHD, attention, and everyday strategies. Read the publisher’s overview before choosing.',note:'For the curious mind',art:'book',url:'https://penguinrandomhousesecondaryeducation.com/book/?isbn=9780399178740'},
 {id:'visual-timer',title:'Time Timer MOD',brand:'Time Timer',category:'Time & memory',description:'A desktop visual timer with a disappearing disk. Put time in view without opening another app.',note:'Make time visible',art:'timer',url:'https://www.timetimer.com/pages/time-timer-mod'},
 {id:'analog',title:'Analog task cards',brand:'Ugmonk',category:'Time & memory',description:'A paper card system for keeping tasks in sight. A place to park a thought before you switch tabs.',note:'A home for loose thoughts',art:'cards',url:'https://ugmonk.com/pages/analog'},
 {id:'quiet',title:'Loop Quiet 2',brand:'Loop Earplugs',category:'Sensory & calm',description:'Reusable earplugs to explore for quieter surroundings. Check sizing and safe-use guidance with the maker.',note:'Turn down the background',art:'loops',url:'https://www.loopearplugs.com/products/quiet'},
 {id:'sensory-band',title:'Sensory bangle bracelets',brand:'ARK Therapeutic',category:'Sensory & calm',description:'Wearable sensory bracelets in different styles and firmness levels. Review fit, durability and safety instructions.',note:'A tactile option',art:'band',url:'https://www.arktherapeutic.com/chewable-bracelets/'},
 {id:'paper-tablet',title:'reMarkable Paper Pro',brand:'reMarkable',category:'Thinking tools',description:'A paper tablet for handwritten notes and sketches. Compare the full device and accessory costs before deciding.',note:'Space to sketch the next idea',art:'tablet',url:'https://remarkable.com/products/remarkable-paper/pro'}
 ];
 if(typeof module!=='undefined')module.exports=products;else root.StoreProducts=products;
})(typeof window!=='undefined'?window:globalThis);
