'use strict';
// Public project registry. Add only real, verified destinations; never keys or private URLs.
(function(root){
 const projects=[
  {id:'ideas',title:'TV Ideas',description:'Your private-on-this-device idea notebook. Concepts are not built apps.',category:'Notebook',status:'Ready',panel:'panel-ideas',tags:['ideas','concepts','notes']},
  {id:'news',title:'Live AI News',description:'Optional public X preview. Live feed setup is still pending.',category:'News',status:'Preview',panel:'panel-news',tags:['news','x','ai']},
  {id:'bricks',title:'Brick Word',description:'Build colorful brick lettering and download a PNG. No account needed.',category:'Creative',status:'Ready',panel:'panel-bricks',tags:['lego','word','image','png']}
 ];
 if(typeof module!=='undefined')module.exports=projects;else root.IdeaVisionProjects=projects;
})(typeof window!=='undefined'?window:globalThis);
