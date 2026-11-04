/* Vertical (1080x1920) engine for the looping Short. Same data contract as film6.js (window.FILM scenes/words/shots, cue = [line id] | [line id, word stem]),
   but a shot's camera is in image fractions: {z, x, y} = zoom and the centre of the view as a share of the plate's width/height.
   Overlays are drawn in screen space; keep captions and tags out of the Shorts UI zones (top ~290 px, bottom ~480 px, right ~150 px). */
(() => {
  'use strict';
  const W=1080,H=1920,SP=window.FILM,P=window.PAPER;
  const ctx=document.getElementById('stage').getContext('2d');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,u)=>a+(b-a)*u;
  const smooth=u=>{u=clamp(u);return u*u*(3-2*u)};
  const INK='#4c443b',CREAM='#F1E6CF',MUSTARD='#D9A441',BRICK='#8C4A32',RED='#D92F2B';
  const norm=s=>s.toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]/g,'');
  const SC=Object.fromEntries(SP.scenes.map(s=>[s.id,s]));
  const WD=id=>SP.words.filter(w=>w.scene===id);
  const wordAt=(id,stem)=>{const h=WD(id).filter(w=>norm(w.w).startsWith(norm(stem)));return h.length?h[0].t:(SC[id]?SC[id].start:0);};
  const cueTime=([id,n=0])=>typeof n==='string'?wordAt(id,n):(WD(id)[n]?WD(id)[n].t:SC[id].start);
  const shots=SP.shots.map(s=>({...s,start:cueTime(s.cue),over:s.over||[]}));
  shots.forEach((s,i)=>{s.end=i+1<shots.length?shots[i+1].start:SP.total;});
  const IMG={};
  let vignette=null;

  async function load(){
    const base=window.PILOT_ASSET_BASE||'assets/';
    await Promise.all([...new Set(shots.map(s=>s.img))].map(f=>new Promise(res=>{
      const im=new Image();im.onload=()=>{IMG[f]=im;res();};im.onerror=()=>{const cv=document.createElement('canvas');cv.width=1672;cv.height=941;IMG[f]=cv;res();};im.src=base+f;
    })));
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;
    const c=cv.getContext('2d'),g=c.createRadialGradient(W*.5,H*.48,H*.3,W*.5,H*.48,H*.78);
    g.addColorStop(0,'rgba(50,32,12,0)');g.addColorStop(1,'rgba(50,32,12,.34)');c.fillStyle=g;c.fillRect(0,0,W,H);vignette=cv;
  }

  // plate fills the screen height; the view window is 1080 px wide, so x picks which slice of the plate is shown
  function camera(c,name,{z=1,x=.5,y=.5},extra){
    const im=IMG[name],h=H*z,w=h*im.width/im.height;
    const dx=w>W?clamp(W/2-x*w,W-w,0):(W-w)/2,dy=h>=H?clamp(H/2-y*h,H-h,0):(H-h)/2;
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    if(z<1){  // plate shorter than the screen: blurred, darkened copy fills the bars
      const bh=H*1.12,bw=bh*im.width/im.height;
      c.save();c.filter='blur(34px) brightness(.72)';c.drawImage(im,clamp(W/2-x*bw,W-bw,0),(H-bh)/2,bw,bh);c.restore();
    }
    c.save();c.translate(dx,dy);c.drawImage(im,0,0,w,h);
    if(extra){c.scale(h/1000,h/1000);extra(c,w/h*1000);}   // image space: height = 1000 units
    c.restore();
  }

  function strip(c,cx,cy,w,h,{fill=CREAM,seed=1,alpha=1,rot=0}={}){
    c.save();c.globalAlpha*=alpha;c.translate(cx,cy);c.rotate(rot);
    c.shadowColor='rgba(55,40,22,.3)';c.shadowBlur=18;c.shadowOffsetY=7;c.fillStyle=fill;c.beginPath();
    const x0=-w/2,x1=w/2,y0=-h/2,y1=h/2;c.moveTo(x0,y0+3);
    for(let x=x0;x<x1;x+=23)c.lineTo(x,y0+(P.hr(Math.floor(x)+seed,14)-.5)*5);
    c.lineTo(x1,y1-3);for(let x=x1;x>x0;x-=23)c.lineTo(x,y1+(P.hr(Math.floor(x)+seed,16)-.5)*5);
    c.closePath();c.fill();c.restore();
  }
  function text(c,s,x,y,{font='700 60px PilotSerif',fill=INK,align='center',alpha=1}={}){
    c.save();c.globalAlpha*=alpha;c.font=font;c.fillStyle=fill;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);c.restore();
  }
  const appear=(t,at,d=.22)=>smooth((t-at)/d);
  function ring(c,cx,cy,rx,ry,u){
    if(u<=0)return;
    c.save();c.strokeStyle=RED;c.lineWidth=12;c.lineCap='round';c.lineJoin='round';c.globalAlpha=.94;c.beginPath();
    const sweep=Math.PI*2*1.04*u;
    for(let a=0;a<=sweep;a+=.06){
      const k=1+.035*Math.sin(a*2.3)+a*.004,x=cx+Math.cos(a-1.9)*rx*k,y=cy+Math.sin(a-1.9)*ry*k;
      if(a===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.stroke();c.restore();
  }

  // ---- overlays drawn in image space (move with the camera): units = 1/1000 of the plate height ----
  const PLATE={
    calendar_date(c,t,s){
      const a=appear(t,wordAt('002','двенадцатое')-.05,.2);
      c.save();c.globalAlpha=a;c.fillStyle='#62513e';c.textAlign='center';c.textBaseline='alphabetic';
      c.font='700 210px PilotSerif';c.fillText('12',725,430);
      c.font='54px PilotSerif';c.fillText('сентября',725,500);
      c.font='700 104px PilotSerif';c.fillText('2005',725,610);c.restore();
    }
  };

  // ---- overlays in screen space; arg after ':' (| = line break) ----
  const SCREEN={
    tag(c,t,s,arg){
      const low=arg[0]==='_';if(low)arg=arg.slice(1);   // '_' = lower band (keeps a face at the top uncovered)
      const lines=arg.split('|'),u=s.start<.05?1:appear(t,s.start+.05,.18);if(u<=0)return;
      c.save();c.translate(0,(1-u)*-30+(low?520:0));
      const h=lines.length*118+44;
      c.font='700 92px PilotSans';const w=Math.max(...lines.map(l=>c.measureText(l).width))+96;
      strip(c,W/2,400+h/2-60,Math.min(w,1010),h,{alpha:u,seed:s.start*7+3,fill:MUSTARD,rot:-.012});
      lines.forEach((l,i)=>text(c,l,W/2,400+i*118+(h-lines.length*118)/2-6,{font:'700 92px PilotSans',alpha:u}));
      c.restore();
    },
    bitcoin(c,t,s){
      const u=appear(t,s.start+.1,.25);if(u<=0)return;
      c.save();c.translate(W/2,520);const k=mix(1.1,1,u);c.scale(k,k);
      strip(c,0,0,900,190,{alpha:u,seed:31,fill:CREAM});
      text(c,'4 · БИТКОИН',0,0,{font:'700 108px PilotSans',alpha:u});
      ring(c,0,6,470,118,smooth((t-(s.start+.55))/.7));
      c.restore();
    },
    cold(c,t,s){
      const k=smooth((t-s.start)/(s.end-s.start))*.85;
      c.save();c.globalCompositeOperation='multiply';c.globalAlpha=k;c.fillStyle='rgb(168,190,216)';c.fillRect(0,0,W,H);c.restore();
    },
    lights(c,t,s){
      const at=wordAt('007','выключает')+.15,a=smooth((t-at)/.18);if(a<=0)return;
      c.save();c.fillStyle='rgba(10,8,16,'+(a*.82)+')';c.fillRect(0,0,W,H);c.restore();
    },
    dark(c,t,s){
      c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgb(70,62,82)';c.fillRect(0,0,W,H);c.restore();
    }
  };

  function paintShot(c,s,t){
    const dur=Math.max(.01,s.end-s.start),u=smooth((t-s.start)/dur);
    const cam={z:mix(s.cam.z[0],s.cam.z[1],u),x:mix(s.cam.x[0],s.cam.x[1],u),y:mix(s.cam.y[0],s.cam.y[1],u)};
    camera(c,s.img,cam,cc=>{for(const o of s.over)if(PLATE[o])PLATE[o](cc,t,s);});
    for(const o of s.over){const i=o.indexOf(':'),name=i<0?o:o.slice(0,i),arg=i<0?'':o.slice(i+1);if(SCREEN[name])SCREEN[name](c,t,s,arg);}
  }
  function image(c,t){
    let i=shots.findIndex((s,k)=>t>=s.start&&(t<s.end||k===shots.length-1));if(i<0)i=0;
    const s=shots[i],prev=shots[i-1],local=t-s.start;
    if(s.in==='dissolve'&&prev&&local<.35){
      paintShot(c,prev,prev.end);c.save();c.globalAlpha=smooth(local/.35);paintShot(c,s,t);c.restore();return;
    }
    paintShot(c,s,t);
    if(s.in==='pop'&&local<.14){c.save();c.fillStyle='rgba(255,246,222,'+(.45*(1-local/.14))+')';c.fillRect(0,0,W,H);c.restore();}
  }

  // ---- captions: 2-3 words per strip, upper part of the lower half so the Shorts UI does not cover them ----
  const groups=[];
  for(const sc of SP.scenes){
    const timings=WD(sc.id),tokens=sc.text.split(/\s+/).filter(Boolean);let j=0;
    const items=tokens.map(token=>{
      const n=norm(token);if(!n)return {text:token,t:null,d:.2};
      let k=-1;for(let q=j;q<Math.min(j+3,timings.length);q++)if(norm(timings[q].w)===n){k=q;break;}
      const w=timings[k>=0?k:Math.min(j,timings.length-1)];j=(k>=0?k:j)+1;
      return {text:token,t:w?w.t:sc.start,d:w?w.d:.2};
    });
    items.forEach((it,q)=>{if(it.t===null){const nx=items.slice(q+1).find(x=>x.t!==null)||items.slice(0,q).reverse().find(x=>x.t!==null);it.t=nx?nx.t:sc.start;}});
    let group=[],chars=0;
    for(const it of items){
      if(group.length&&(chars+it.text.length>17||group.length>=3)){groups.push({items:group,start:group[0].t,end:it.t});group=[];chars=0;}
      group.push(it);chars+=it.text.length+1;
    }
    if(group.length)groups.push({items:group,start:group[0].t,end:sc.start+sc.speechDur+.1});
  }
  function captions(c,t){
    const g=groups.find(g=>t>=g.start-.02&&t<g.end);if(!g)return;
    c.save();c.font='700 92px PilotSans';c.textBaseline='middle';
    const widths=g.items.map(w=>c.measureText(w.text).width),gap=26;
    const total=widths.reduce((a,b)=>a+b,0)+gap*(widths.length-1),left=(W-total)/2;
    const x0=left-40,x1=left+total+40,y0=1190,y1=1330;
    c.shadowColor='rgba(55,40,22,.26)';c.shadowBlur=14;c.shadowOffsetY=6;
    c.fillStyle=CREAM;c.beginPath();c.moveTo(x0,y0+4);
    for(let x=x0;x<x1;x+=23)c.lineTo(x,y0+(P.hr(Math.floor(x),14)-.5)*5);
    c.lineTo(x1,y1-4);for(let x=x1;x>x0;x-=23)c.lineTo(x,y1+(P.hr(Math.floor(x),16)-.5)*5);
    c.closePath();c.fill();c.shadowColor='transparent';
    let x=left;
    for(let i=0;i<g.items.length;i++){
      const item=g.items[i],next=g.items[i+1]?.t??g.end;
      if(t>=item.t-.02&&t<next){c.fillStyle=MUSTARD;c.fillRect(x-8,1214,widths[i]+16,92);}
      c.fillStyle=INK;c.fillText(item.text,x,1262);x+=widths[i]+gap;
    }
    c.restore();
  }

  function render(time){
    if(!vignette)return;
    const t=Math.floor(clamp(time,0,SP.total)*24+1e-6)/24;
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,W,H);
    image(ctx,t);ctx.drawImage(vignette,0,0);
    ctx.save();ctx.globalAlpha=.15;const step=Math.floor(t*12);ctx.translate(Math.floor(P.hr(step,21)*256),Math.floor(P.hr(step,22)*256));ctx.fillStyle=P.grainPattern(ctx);ctx.fillRect(-256,-256,W+512,H+512);ctx.restore();
    captions(ctx,time);
  }
  window.PILOT_ENGINE={load,render,groups,shots};
})();
