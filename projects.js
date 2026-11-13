'use strict';
// Public project registry. Add only real, verified destinations; never keys or private URLs.
(function(root){
 const projects=[
  {id:'fair-test',title:'Fair Test Studio',description:'Build and download a simple experiment worksheet. Choose one change, controls, observations and a prediction. Browser-local, not an AI or safety checker.',category:'Learning',status:'Ready',url:'https://cherenzac.github.io/idea-tracker/fair-test.html',tags:['experiment','science','worksheet','learning','plan']},
  {id:'vacations',title:'Vacation Atlas',description:'Source-linked hotel highlights, vacation experiences and a private-on-this-device shortlist. Search curated stays or save an unresearched hotel note.',category:'Travel',status:'Ready',url:'https://cherenzac.github.io/idea-tracker/vacations/',tags:['vacation','travel','hotels','experiences','shortlist']},
  {id:'daily-insights',title:'Daily Insights',description:'A dated notebook of short original and source-attributed thoughts on AI, MCP, RAG, governance and agent harnesses.',category:'Journal',status:'Ready',url:'https://cherenzac.github.io/idea-tracker/daily-insights/',tags:['daily','insights','blog','ai','mcp','rag','governance','harness']},
  {id:'explore',title:'Explore Projects',description:'50 sourced project concepts to browse, filter and save. Ideas to build, not finished applications.',category:'Inspiration',status:'Ready',panel:'panel-explore',tags:['explore','50','ideas','concepts','inspiration']},
  {id:'ideas',title:'TV Ideas',description:'Your private-on-this-device idea notebook. Concepts are not built apps.',category:'Notebook',status:'Ready',panel:'panel-ideas',tags:['ideas','concepts','notes']},
  {id:'news',title:'AI Agent Radar',description:'Topic-driven Hacker News stories, refreshed while open. X latest search opens separately.',category:'News',status:'Ready',panel:'panel-news',tags:['news','x','ai']},
  {id:'pomodoro',title:'Pomodoro Focus',description:'Configurable focus and break intervals with pause, resume and long breaks. Runs locally while this page stays open.',category:'Focus',status:'Ready',panel:'panel-pomodoro',tags:['timer','interval','pomodoro','work','break']},
  {id:'bricks',title:'Brick Word',description:'Build colorful brick lettering and download a PNG. No account needed.',category:'Creative',status:'Ready',panel:'panel-bricks',tags:['lego','word','image','png']}
 ];
 if(typeof module!=='undefined')module.exports=projects;else root.IdeaVisionProjects=projects;
})(typeof window!=='undefined'?window:globalThis);



