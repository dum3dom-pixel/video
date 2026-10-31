/* Whole-scene animation. All assets are intact paper illustrations. */
(() => {
  'use strict';
  const W=1920,H=1080,SP=window.PILOT,P=window.PAPER;
  const dynamic=window.PILOT_VARIANT==='dynamic';
  const ctx=document.getElementById('stage').getContext('2d');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,u)=>a+(b-a)*u;
  const smooth=u=>{u=clamp(u);return u*u*(3-2*u)};
  const IMG={};
  const FILES={door:'bg/bg_door_wall.png',kostya:'shots/p2_kostya.png',calendar:'shots/p3_calendar.png',sasha:'shots/p4_sasha.png',sock:'shots/p0_sock.png'};
  const SC=Object.fromEntries(SP.scenes.map(s=>[s.id,s]));
  let sock=null,vignette=null;

  function makeSock() {
    // Technical green removal is an explicit code step in the image brief.
    const cv=document.createElement('canvas');cv.width=1536;cv.height=1024;
    const c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(IMG.sock,0,0);
    const pixels=c.getImageData(0,0,1536,1024),d=pixels.data;
    let x0=1536,y0=1024,x1=0,y1=0;
    for(let y=0;y<1024;y++)for(let x=0;x<1536;x++){
      const i=(y*1536+x)*4,r=d[i],g=d[i+1],b=d[i+2],excess=g-Math.max(r,b);
      if(excess>25&&g>90){d[i+3]=0;continue;}
      if(excess>0&&g>90){d[i+3]=Math.round(255*(1-excess/25));d[i+1]=Math.max(r,b);}
      if(d[i+3]>100){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    }
    if(x1<=x0||y1<=y0)throw new Error('Empty keyed sock');
    c.putImageData(pixels,0,0);
    const out=document.createElement('canvas');out.width=x1-x0+17;out.height=y1-y0+17;
    out.getContext('2d').drawImage(cv,x0-8,y0-8,out.width,out.height,0,0,out.width,out.height);
    return out;
  }

  async function load(){
    await Promise.all(Object.entries(FILES).map(([key,file])=>new Promise((resolve,reject)=>{
      const im=new Image();IMG[key]=im;im.onload=resolve;im.onerror=()=>reject(new Error(file));im.src=(window.PILOT_ASSET_BASE||'assets/')+file;
    })));
    sock=makeSock();
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;
    const c=cv.getContext('2d'),g=c.createRadialGradient(W*.5,H*.46,H*.42,W*.5,H*.46,H*1.12);
    g.addColorStop(0,'rgba(50,32,12,0)');g.addColorStop(1,'rgba(50,32,12,.30)');c.fillStyle=g;c.fillRect(0,0,W,H);vignette=cv;
  }

  function camera(c,name,{z=1,x=768,y=512}={},extra){
    // At z=1 this is exactly the central y=80..943, 1536x864 crop.
    x=clamp(x,768/z,1536-768/z);y=clamp(y,432/z,1024-432/z);
    const scale=1.25*z,dx=W/2-x*scale,dy=H/2-y*scale;
    c.save();c.translate(dx,dy);c.scale(scale,scale);c.drawImage(IMG[name],0,0,1536,1024);
    if(extra)extra(c);c.restore();
    return {scale,dx,dy};
  }

  function calendarDate(c,t){
    const a=clamp((t-SC.calendar.start)/.22);
    c.save();c.globalAlpha=a;c.fillStyle='#62513e';c.textAlign='center';c.textBaseline='alphabetic';
    // Anchored inside the actual blank page; the camera moves image and date together.
    c.font='700 148px PilotSerif';c.fillText('12',625,428);
    c.font='40px PilotSerif';c.fillText('сентября',625,502);
    c.font='700 72px PilotSerif';c.fillText('2005',625,598);c.restore();
  }

  function flight(c,t){
    const begin=.15,end=SP.sockImpact+.08;
    if(t<begin||t>end)return;
    const u=clamp((t-begin)/(end-begin));
    const burst=dynamic?Math.pow(u,7):Math.pow(u,4.3);
    const width=80+190*u+3100*burst,height=width*sock.height/sock.width;
    const x=mix(1085,980,smooth(u)),y=mix(255,440,smooth(u));
    // At the end of the throw the sock naturally occludes the lens. Never cut
    // its silhouette with a rectangular subtitle-zone mask; captions draw last.
    c.save();
    c.translate(x,y);c.rotate((dynamic?-.42:-.18)+u*(dynamic?1.12:.52));
    c.drawImage(sock,-width/2,-height/2,width,height);c.restore();
  }

  function image(c,t){
    if(t<SC.lead.start){
      camera(c,'door',{z:1+.018*smooth(t/SC.lead.start),x:768,y:512});flight(c,t);return;
    }
    if(t<SC.calendar.start){
      const u=smooth((t-SC.lead.start)/(SC.calendar.start-SC.lead.start));
      const hairPunch=dynamic&&t>SC.hair.start+SC.hair.dur*.70;
      if(hairPunch){camera(c,'kostya',{z:2.60+.06*smooth((t-(SC.hair.start+SC.hair.dur*.70))/1.6),x:860,y:235});}
      else camera(c,'kostya',{z:mix(1.01,1.15,u),x:mix(768,820,u),y:mix(505,420,u)});
      return;
    }
    if(t<SC.reveal.start){
      const u=smooth((t-SC.calendar.start)/SC.calendar.dur);
      camera(c,'calendar',{z:mix(dynamic?1.08:1, dynamic?1.16:1.06,u),x:mix(740,715,u),y:mix(500,480,u)},cc=>calendarDate(cc,t));return;
    }
    const u=smooth((t-SC.reveal.start)/SC.reveal.dur);
    if(dynamic&&t>SC.reveal.start+1.1){camera(c,'sasha',{z:2.4+.10*u,x:770,y:388});}
    else camera(c,'sasha',{z:mix(1.01,1.15,u),x:768,y:mix(500,450,u)});
  }

  // Subtitles are reconstructed from the unchanged transcript and measured word starts.
  const groups=[];
  for(const sc of SP.scenes){
    const timings=SP.words.filter(w=>w.scene===sc.id);
    const tokens=sc.text.split(/\s+/).filter(Boolean);
    let group=[],chars=0;
    for(let i=0;i<tokens.length;i++){
      const token=tokens[i],w=timings[Math.min(i,timings.length-1)];
      if(!w)continue;
      if(group.length&&(chars+token.length>32||group.length>=5)){
        groups.push({items:group,start:group[0].t,end:w.t});group=[];chars=0;
      }
      group.push({text:token,t:w.t,d:w.d});chars+=token.length+1;
    }
    if(group.length)groups.push({items:group,start:group[0].t,end:sc.start+sc.speechDur+.16});
  }

  function captions(c,t){
    const g=groups.find(g=>t>=g.start-.025&&t<g.end);if(!g)return;
    c.save();c.font='700 68px PilotSans';c.textBaseline='middle';
    const widths=g.items.map(w=>c.measureText(w.text).width),gap=22;
    const total=widths.reduce((a,b)=>a+b,0)+gap*(widths.length-1),left=(W-total)/2;
    const x0=left-38,x1=left+total+38,y0=911,y1=1031;
    c.shadowColor='rgba(55,40,22,.24)';c.shadowBlur=12;c.shadowOffsetY=5;
    c.fillStyle='#F1E6CF';c.beginPath();c.moveTo(x0,y0+4);
    for(let x=x0;x<x1;x+=23)c.lineTo(x,y0+(P.hr(Math.floor(x),14)-.5)*5);
    c.lineTo(x1,y1-4);for(let x=x1;x>x0;x-=23)c.lineTo(x,y1+(P.hr(Math.floor(x),16)-.5)*5);
    c.closePath();c.fill();c.shadowColor='transparent';
    let x=left;
    for(let i=0;i<g.items.length;i++){
      const item=g.items[i],next=g.items[i+1]?.t??g.end;
      if(t>=item.t-.025&&t<next){c.fillStyle='#D9A441';c.fillRect(x-6,935,widths[i]+12,70);}
      c.fillStyle='#4c443b';c.fillText(item.text,x,973);x+=widths[i]+gap;
    }
    c.restore();
  }

  function transition(c,t){
    if(!dynamic)return;
    const cuts=[SC.lead.start,SC.calendar.start,SC.reveal.start];
    for(const at of cuts){
      const u=(t-at+.12)/.27;if(u<=0||u>=1)continue;
      const x=mix(-W-70,W+70,smooth(u));
      c.save();c.fillStyle='#F1E6CF';c.shadowColor='rgba(56,35,18,.2)';c.shadowBlur=16;c.beginPath();c.moveTo(x,0);
      for(let y=0;y<=H;y+=22)c.lineTo(x+(P.hr(y,45)-.5)*24,y);
      c.lineTo(x+W+80,H);for(let y=H;y>=0;y-=22)c.lineTo(x+W+80+(P.hr(y,55)-.5)*24,y);
      c.closePath();c.fill();c.restore();
    }
  }

  function render(time){
    // HyperFrames can seek before asynchronous images are decoded.
    if(!sock||!vignette)return;
    const t=Math.floor(clamp(time,0,SP.duration)*12+1e-6)/12;
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,W,H);
    image(ctx,t);ctx.drawImage(vignette,0,0);
    ctx.save();ctx.globalAlpha=.15;const step=Math.floor(t*12);ctx.translate(Math.floor(P.hr(step,21)*256),Math.floor(P.hr(step,22)*256));ctx.fillStyle=P.grainPattern(ctx);ctx.fillRect(-256,-256,W+512,H+512);ctx.restore();
    transition(ctx,t);captions(ctx,time);
  }
  window.PILOT_ENGINE={load,render,groups};
})();
