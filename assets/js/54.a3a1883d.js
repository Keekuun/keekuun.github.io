(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{480:function(i,e,t){},731:function(i,e,t){"use strict";t(480)},761:function(i,e,t){"use strict";t.r(e);t(15);var h={data:()=>({msg:"Happy Birthday 2020",birthday:null}),mounted(){var i=c.width=800,e=c.height=800,t=c.getContext("2d"),h=i/2,s=e/2,r={strings:["HAPPY","BIRTHDAY","2020!"],charSize:30,charSpacing:35,lineHeight:40,cx:i/2,cy:e/2,fireworkPrevPoints:10,fireworkBaseLineWidth:5,fireworkAddedLineWidth:8,fireworkSpawnTime:200,fireworkBaseReachTime:30,fireworkAddedReachTime:30,fireworkCircleBaseSize:20,fireworkCircleAddedSize:10,fireworkCircleBaseTime:30,fireworkCircleAddedTime:30,fireworkCircleFadeBaseTime:10,fireworkCircleFadeAddedTime:5,fireworkBaseShards:5,fireworkAddedShards:5,fireworkShardPrevPoints:3,fireworkShardBaseVel:4,fireworkShardAddedVel:2,fireworkShardBaseSize:3,fireworkShardAddedSize:3,gravity:.1,upFlow:-.1,letterContemplatingWaitTime:360,balloonSpawnTime:20,balloonBaseInflateTime:10,balloonAddedInflateTime:10,balloonBaseSize:20,balloonAddedSize:20,balloonBaseVel:.4,balloonAddedVel:.4,balloonBaseRadian:-(Math.PI/2-.5),balloonAddedRadian:-1},a=r.charSpacing*Math.max(r.strings[0].length,r.strings[1].length),l=2*Math.PI,o=l/4,n=[];function d(i,e,h){this.char=i,this.x=e,this.y=h,this.dx=-t.measureText(i).width/2,this.dy=+r.charSize/2,this.fireworkDy=this.y-s;var l=e/a*360;this.color="hsl(hue,80%,50%)".replace("hue",l),this.lightAlphaColor="hsla(hue,80%,light%,alp)".replace("hue",l),this.lightColor="hsl(hue,80%,light%)".replace("hue",l),this.alphaColor="hsla(hue,80%,50%,alp)".replace("hue",l),this.reset()}function f(i,e,t,h,s){var a=r.fireworkShardBaseVel+r.fireworkShardAddedVel*Math.random();this.vx=t*a,this.vy=h*a,this.x=i,this.y=e,this.prevPoints=[[i,e]],this.color=s,this.alive=!0,this.size=r.fireworkShardBaseSize+r.fireworkShardAddedSize*Math.random()}function p(i,e,h){t.moveTo(i,e),t.bezierCurveTo(i-h/2,e-h/2,i-h/4,e-h,i,e-h),t.bezierCurveTo(i+h/4,e-h,i+h/2,e-h/2,i,e)}t.font=r.charSize+"px Verdana",d.prototype.reset=function(){this.phase="firework",this.tick=0,this.spawned=!1,this.spawningTime=r.fireworkSpawnTime*Math.random()|0,this.reachTime=r.fireworkBaseReachTime+r.fireworkAddedReachTime*Math.random()|0,this.lineWidth=r.fireworkBaseLineWidth+r.fireworkAddedLineWidth*Math.random(),this.prevPoints=[[0,s,0]]},d.prototype.step=function(){if("firework"===this.phase)if(this.spawned){++this.tick;var i=this.tick/this.reachTime,e=Math.sin(i*o),a=i*this.x,n=s+e*this.fireworkDy;this.prevPoints.length>r.fireworkPrevPoints&&this.prevPoints.shift(),this.prevPoints.push([a,n,i*this.lineWidth]);for(var c=1/(this.prevPoints.length-1),d=1;d<this.prevPoints.length;++d){var g=this.prevPoints[d],k=this.prevPoints[d-1];t.strokeStyle=this.alphaColor.replace("alp",d/this.prevPoints.length),t.lineWidth=g[2]*c*d,t.beginPath(),t.moveTo(g[0],g[1]),t.lineTo(k[0],k[1]),t.stroke()}if(this.tick>=this.reachTime){this.phase="contemplate",this.circleFinalSize=r.fireworkCircleBaseSize+r.fireworkCircleAddedSize*Math.random(),this.circleCompleteTime=r.fireworkCircleBaseTime+r.fireworkCircleAddedTime*Math.random()|0,this.circleCreating=!0,this.circleFading=!1,this.circleFadeTime=r.fireworkCircleFadeBaseTime+r.fireworkCircleFadeAddedTime*Math.random()|0,this.tick=0,this.tick2=0,this.shards=[];var w=r.fireworkBaseShards+r.fireworkAddedShards*Math.random()|0,m=l/w,v=Math.cos(m),y=Math.sin(m);for(a=1,n=0,d=0;d<w;++d){var T=a;a=a*v-n*y,n=n*v+T*y,this.shards.push(new f(this.x,this.y,a,n,this.alphaColor))}}}else++this.tick,this.tick>=this.spawningTime&&(this.tick=0,this.spawned=!0);else if("contemplate"===this.phase){if(++this.tick,this.circleCreating){++this.tick2;var S=this.tick2/this.circleCompleteTime,x=-Math.cos(S*Math.PI)/2+.5;t.beginPath(),t.fillStyle=this.lightAlphaColor.replace("light",50+50*S).replace("alp",S),t.beginPath(),t.arc(this.x,this.y,x*this.circleFinalSize,0,l),t.fill(),this.tick2>this.circleCompleteTime&&(this.tick2=0,this.circleCreating=!1,this.circleFading=!0)}else if(this.circleFading){t.fillStyle=this.lightColor.replace("light",70),t.fillText(this.char,this.x+this.dx,this.y+this.dy),++this.tick2;S=this.tick2/this.circleFadeTime,x=-Math.cos(S*Math.PI)/2+.5;t.beginPath(),t.fillStyle=this.lightAlphaColor.replace("light",100).replace("alp",1-x),t.arc(this.x,this.y,this.circleFinalSize,0,l),t.fill(),this.tick2>=this.circleFadeTime&&(this.circleFading=!1)}else t.fillStyle=this.lightColor.replace("light",70),t.fillText(this.char,this.x+this.dx,this.y+this.dy);for(d=0;d<this.shards.length;++d)this.shards[d].step(),this.shards[d].alive||(this.shards.splice(d,1),--d);if(this.tick>r.letterContemplatingWaitTime){this.phase="balloon",this.tick=0,this.spawning=!0,this.spawnTime=r.balloonSpawnTime*Math.random()|0,this.inflating=!1,this.inflateTime=r.balloonBaseInflateTime+r.balloonAddedInflateTime*Math.random()|0,this.size=r.balloonBaseSize+r.balloonAddedSize*Math.random()|0;var P=r.balloonBaseRadian+r.balloonAddedRadian*Math.random(),u=r.balloonBaseVel+r.balloonAddedVel*Math.random();this.vx=Math.cos(P)*u,this.vy=Math.sin(P)*u}}else if("balloon"===this.phase)if(t.strokeStyle=this.lightColor.replace("light",80),this.spawning)++this.tick,t.fillStyle=this.lightColor.replace("light",70),t.fillText(this.char,this.x+this.dx,this.y+this.dy),this.tick>=this.spawnTime&&(this.tick=0,this.spawning=!1,this.inflating=!0);else if(this.inflating){++this.tick;S=this.tick/this.inflateTime,a=this.cx=this.x,n=this.cy=this.y-this.size*S;t.fillStyle=this.alphaColor.replace("alp",S),t.beginPath(),p(a,n,this.size*S),t.fill(),t.beginPath(),t.moveTo(a,n),t.lineTo(a,this.y),t.stroke(),t.fillStyle=this.lightColor.replace("light",70),t.fillText(this.char,this.x+this.dx,this.y+this.dy),this.tick>=this.inflateTime&&(this.tick=0,this.inflating=!1)}else this.cx+=this.vx,this.cy+=this.vy+=r.upFlow,t.fillStyle=this.color,t.beginPath(),p(this.cx,this.cy,this.size),t.fill(),t.beginPath(),t.moveTo(this.cx,this.cy),t.lineTo(this.cx,this.cy+this.size),t.stroke(),t.fillStyle=this.lightColor.replace("light",70),t.fillText(this.char,this.cx+this.dx,this.cy+this.dy+this.size),(this.cy+this.size<-s||this.cx<-h||this.cy>h)&&(this.phase="done")},f.prototype.step=function(){this.x+=this.vx,this.y+=this.vy+=r.gravity,this.prevPoints.length>r.fireworkShardPrevPoints&&this.prevPoints.shift(),this.prevPoints.push([this.x,this.y]);for(var i=this.size/this.prevPoints.length,e=0;e<this.prevPoints.length-1;++e){var h=this.prevPoints[e],a=this.prevPoints[e+1];t.strokeStyle=this.color.replace("alp",e/this.prevPoints.length),t.lineWidth=e*i,t.beginPath(),t.moveTo(h[0],h[1]),t.lineTo(a[0],a[1]),t.stroke()}this.prevPoints[0][1]>s&&(this.alive=!1)};for(var g=0;g<r.strings.length;++g)for(var k=0;k<r.strings[g].length;++k)n.push(new d(r.strings[g][k],k*r.charSpacing+r.charSpacing/2-r.strings[g].length*r.charSize/2,g*r.lineHeight+r.lineHeight/2-r.strings.length*r.lineHeight/2));!function r(){window.requestAnimationFrame(r),t.fillStyle="#111",t.fillRect(0,0,i,e),t.translate(h,s);for(var a=!0,l=0;l<n.length;++l)n[l].step(),"done"!==n[l].phase&&(a=!1);if(t.translate(-h,-s),a)for(l=0;l<n.length;++l)n[l].reset()}(),window.addEventListener("resize",(function(){i=c.width=window.innerWidth,e=c.height=window.innerHeight,h=i/2,s=e/2,t.font=r.charSize+"px Verdana"}))}},s=(t(731),t(2)),r=Object(s.a)(h,(function(){return(0,this._self._c)("canvas",{attrs:{id:"c"}})}),[],!1,null,"bc299cb2",null);e.default=r.exports}}]);