'use strict';
// Public project registry. Add only real, verified destinations; never keys or private URLs.
(function(root){
 const projects=[
  {id:'ideas',title:'TV Ideas',description:'Your private-on-this-device idea notebook. Concepts are not built apps.',category:'Notebook',status:'Ready',panel:'panel-ideas',tags:['ideas','concepts','notes']},
  {id:'news',title:'AI Agent Radar',description:'Topic-driven Hacker News stories, refreshed while open. X latest search opens separately.',category:'News',status:'Ready',panel:'panel-news',tags:['news','x','ai']},
  {id:'pomodoro',title:'Pomodoro Focus',description:'Configurable focus and break intervals with pause, resume and long breaks. Runs locally while this page stays open.',category:'Focus',status:'Ready',panel:'panel-pomodoro',tags:['timer','interval','pomodoro','work','break']},
  {id:'bricks',title:'Brick Word',description:'Build colorful brick lettering and download a PNG. No account needed.',category:'Creative',status:'Ready',panel:'panel-bricks',tags:['lego','word','image','png']}
 ];
 if(typeof module!=='undefined')module.exports=projects;else root.IdeaVisionProjects=projects;
})(typeof window!=='undefined'?window:globalThis);

