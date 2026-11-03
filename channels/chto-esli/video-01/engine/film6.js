/* Film engine for script v6 (opening part): shot list cued to script-line ids of spec/timeline-v6*.json.
   Same renderer as film.js; overlays are rewritten for v6 (new plan list, red circle on item 7, red strike-outs of the rules). */
(() => {
  'use strict';
  const W=1920,H=1080,SP=window.FILM,P=window.PAPER;
  const ctx=document.getElementById('stage').getContext('2d');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,u)=>a+(b-a)*u;
  const smooth=u=>{u=clamp(u);return u*u*(3-2*u)};
  const INK='#4c443b',CREAM='#F1E6CF',MUSTARD='#D9A441',BRICK='#8C4A32',RED='#D92F2B';
  const norm=s=>s.toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]/g,'');
  const SC=Object.fromEntries(SP.scenes.map(s=>[s.id,s]));
  const WD=id=>SP.words.filter(w=>w.scene===id);
  const wordAt=(id,stem,nth=0)=>{
    const hits=WD(id).filter(w=>norm(w.w).startsWith(norm(stem)));
    const w=hits[Math.min(nth,hits.length-1)];
    return w?w.t:(SC[id]?SC[id].start:0);
  };
  const lineEnd=id=>SC[id].start+SC[id].speechDur;
  // cue = [line id] | [line id, word number] | [line id, word stem]
  const cueTime=([id,n=0])=>{
    if(typeof n==='string')return wordAt(id,n);
    const w=WD(id)[n];return w?w.t:(SC[id]?SC[id].start:0);
  };
  const shots=SP.shots.map(s=>({...s,start:cueTime(s.cue),over:s.over||[]}));
  shots.forEach((s,i)=>{s.end=i+1<shots.length?shots[i+1].start:SP.total;});
  const IMG={};
  let vignette=null;

  function placeholder(name){
    const cv=document.createElement('canvas');cv.width=1536;cv.height=864;const c=cv.getContext('2d');
    c.fillStyle='#d8c9a8';c.fillRect(0,0,1536,864);c.fillStyle='rgba(76,68,59,.75)';c.font='700 56px PilotSans';c.textAlign='center';c.fillText('MISSING '+name,768,432);
    return cv;
  }
  async function load(){
    const base=window.PILOT_ASSET_BASE||'assets/';
    const files=[...new Set(shots.map(s=>s.img))];
    await Promise.all(files.map(f=>new Promise(resolve=>{
      const im=new Image();im.onload=()=>{IMG[f]=im;resolve();};im.onerror=()=>{IMG[f]=placeholder(f);resolve();};im.src=base+f;
    })));
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;
    const c=cv.getContext('2d'),g=c.createRadialGradient(W*.5,H*.46,H*.42,W*.5,H*.46,H*1.12);
    g.addColorStop(0,'rgba(50,32,12,0)');g.addColorStop(1,'rgba(50,32,12,.30)');c.fillStyle=g;c.fillRect(0,0,W,H);vignette=cv;
  }

  // Camera coordinates stay in the 1536x1024 frame; a 16:9 plate of any resolution is mapped to 1536x864 and centred in it.
  function camera(c,name,{z=1,x=768,y=512},extra){
    const im=IMG[name],ph=1536*im.height/im.width,off=(1024-ph)/2;
    x=clamp(x,768/z,1536-768/z);y=clamp(y,off+432/z,off+ph-432/z);
    const scale=1.25*z,dx=W/2-x*scale,dy=H/2-y*scale;
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.save();c.translate(dx,dy);c.scale(scale,scale);c.drawImage(im,0,off,1536,ph);
    if(extra)extra(c);c.restore();
  }

  // ---- paper helpers ----
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
  const appear=(t,at,d=.28)=>smooth((t-at)/d);
  // red marker stroke from (x0,y) to (x1,y), drawn over `u` of its length with a slight wobble
  function marker(c,x0,x1,y,u,{width=12,rot=-.012}={}){
    if(u<=0)return;
    c.save();c.translate(x0,y);c.rotate(rot);c.strokeStyle=RED;c.lineWidth=width;c.lineCap='round';c.globalAlpha=.92;
    c.beginPath();const L=(x1-x0)*u;c.moveTo(0,0);
    for(let x=0;x<=L;x+=16)c.lineTo(x,Math.sin(x*.045)*2.6);
    c.stroke();c.restore();
  }
  // red marker ellipse around a plate rectangle, drawn over `u` of one turn
  function ring(c,cx,cy,rx,ry,u){
    if(u<=0)return;
    c.save();c.strokeStyle=RED;c.lineWidth=11;c.lineCap='round';c.lineJoin='round';c.globalAlpha=.94;c.beginPath();
    const sweep=Math.PI*2*1.04*u;
    for(let a=0;a<=sweep;a+=.06){
      const k=1+.035*Math.sin(a*2.3)+a*.004,x=cx+Math.cos(a-1.9)*rx*k,y=cy+Math.sin(a-1.9)*ry*k;
      if(a===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.stroke();c.restore();
  }

  // ---- plate overlays (drawn in 1536x1024 plate space, move with the camera) ----
  const RULES=[
    {s:'Перезапуска нет',y:290,show:()=>SC['030'].start,strike:()=>lineEnd('030')},
    {s:'Словам не верят',y:402,show:()=>SC['031'].start,strike:()=>SC['032'].start+.1},
    {s:'Знание тает',y:514,show:()=>wordAt('033','знание'),strike:()=>lineEnd('033')+.1}
  ];
  const PLAN=[['Доллар: до осени 2008','019'],['Тополь у гаражей: май','021'],['Учёба. Гена','023'],['Папа: не брать кредит','025'],['Дед. Не говорить «потом»','026'],['Костин компьютер','027'],['Биткоин: январь 2009','028']];
  const PLATE={
    calendar_date(c,t,s){
      const a=clamp((t-s.start)/.22);
      c.save();c.globalAlpha=a;c.fillStyle='#62513e';c.textAlign='center';c.textBaseline='alphabetic';
      c.font='700 148px PilotSerif';c.fillText('12',625,428);
      c.font='40px PilotSerif';c.fillText('сентября',625,502);
      c.font='700 72px PilotSerif';c.fillText('2005',625,598);c.restore();
    },
    cassette_label(c,t,s){
      const u=appear(t,s.start+.35,.5);if(u<=0)return;
      c.save();c.translate(768,246);c.rotate(-.012);text(c,'2024',0,0,{font:'700 132px PilotSerif',fill:RED,alpha:u});c.restore();
    },
    rules(c,t){
      text(c,'ПРАВИЛА',760,205,{font:'700 62px PilotSerif',alpha:appear(t,SC['029'].start+.3)});
      for(const r of RULES){
        const u=appear(t,r.show(),.3);if(u<=0)continue;
        c.save();c.font='700 76px PilotSerif';const w=c.measureText(r.s).width+60;
        c.globalAlpha=u*.6;c.fillStyle=MUSTARD;c.fillRect(760-w/2,r.y-48,w,92);c.restore();
        c.save();c.translate(760,r.y);const k=mix(1.12,1,u);c.scale(k,k);text(c,r.s,0,0,{font:'700 76px PilotSerif',alpha:u,fill:INK});c.restore();
        c.save();c.font='700 76px PilotSerif';const tw=c.measureText(r.s).width;c.restore();
        marker(c,760-tw/2-26,760+tw/2+26,r.y+4,smooth((t-r.strike())/.4));
      }
    },
    plan(c,t){
      text(c,'ПЛАН',280,240,{font:'700 66px PilotSerif',align:'left',alpha:appear(t,SC['018'].start+.3)});
      PLAN.forEach(([s,id],i)=>{
        const u=appear(t,SC[id].start-.05,.25);if(u<=0)return;
        const y=330+i*62;
        if(i===PLAN.length-1){c.save();c.globalAlpha=u*.5;c.fillStyle=MUSTARD;c.fillRect(250,y-30,620,60);c.restore();}
        text(c,`${i+1}. ${s}`,280,y,{font:'700 44px PilotSerif',align:'left',alpha:u});
      });
      const r=smooth((t-wordAt('028','седьм'))/.7);
      ring(c,570,330+6*62,350,48,r);
    }
  };

  // part B plate overlays: cue line of the shot is s.cue[0]
  const sw=(s,stem)=>wordAt(s.cue[0],stem);
  Object.assign(PLATE,{
    chalk(c,t,s){
      const u=appear(t,sw(s,'сколько'),.4);
      c.save();c.rotate(-.01);text(c,'3/5 + 2/7 = ?',520,215,{font:'700 54px PilotSerif',fill:'#EFE8D8',alpha:u*.92});c.restore();
    },
    fractions(c,t,s){
      const a=appear(t,sw(s,'три'),.3),b=appear(t,sw(s,'тридцать'),.4);
      c.save();c.rotate(-.012);
      text(c,'3/5 + 2/7 =',390,380,{font:'700 64px PilotSerif',fill:'#5a5048',alpha:a*.9});
      text(c,'31/35',960,380,{font:'700 96px PilotSerif',fill:'#5a5048',alpha:b*.9});c.restore();
    },
    plan_done(c,t,s){
      text(c,'ПЛАН',280,240,{font:'700 66px PilotSerif',align:'left'});
      const at=sw(s,'вычёркиваешь');
      PLAN.forEach(([str],i)=>{
        const y=330+i*62;
        if(i===PLAN.length-1){c.save();c.fillStyle=MUSTARD;c.globalAlpha=.5;c.fillRect(250,y-30,620,60);c.restore();}
        text(c,`${i+1}. ${str}`,280,y,{font:'700 44px PilotSerif',align:'left'});
        if(i<PLAN.length-1){
          c.save();c.font='700 44px PilotSerif';const tw=c.measureText(`${i+1}. ${str}`).width;c.restore();
          const u=smooth((t-(at+.4+i*.5))/.35);
          if(u>0){c.save();c.strokeStyle=INK;c.lineWidth=6;c.lineCap='round';c.globalAlpha=.85;c.beginPath();c.moveTo(270,y+2);c.lineTo(270+(tw+20)*u,y+2-4*u);c.stroke();c.restore();}
        }
      });
    }
  });

  // ---- screen overlays (1920x1080) ----
  const DATE_PLATES={1:'Сентябрь 2005 · 12 лет',2:'Осень 2005 · 12 лет',3:'Май 2006 · 13 лет',4:'2006 · 13 лет'};
  const SCREEN={
    date_plate(c,t,s,arg){
      const u=appear(t,s.start+.35,.3)*(1-appear(t,s.start+3.6,.4));if(u<=0)return;
      c.font='700 44px PilotSerif';const w=c.measureText(DATE_PLATES[arg]).width+70;
      strip(c,70+w/2,86,w,92,{alpha:u,seed:5,fill:MUSTARD});text(c,DATE_PLATES[arg],70+w/2,86,{font:'700 44px PilotSerif',alpha:u});
    },
    cold(c){c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgb(168,190,216)';c.fillRect(0,0,W,H);c.restore();},
    grain(c){c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgb(176,176,184)';c.fillRect(0,0,W,H);c.restore();},
    answered(c,t,s){
      const at=wordAt(s.cue[0],'ответил')-.5,u=appear(t,at,.35);if(u<=0)return;
      c.save();c.translate(W/2,H/2-120);const k=mix(1.08,1,u);c.scale(k,k);
      strip(c,0,0,820,170,{alpha:u,seed:9});text(c,'«Он ответил»',0,0,{font:'700 88px PilotSerif',alpha:u});c.restore();
    },
    title_card(c,t,s){
      const u=appear(t,s.start+.15,.45);if(u<=0)return;
      c.save();c.translate(0,(1-u)*60);
      strip(c,W/2,H/2-30,1740,330,{alpha:u,seed:3});
      text(c,'Что, если ты проснулся в двенадцать лет',W/2,H/2-85,{font:'700 68px PilotSerif',alpha:u});
      text(c,'и помнишь всю жизнь наперёд?',W/2,H/2+25,{font:'700 68px PilotSerif',alpha:u});
      c.restore();
    },
    dim(c,t){
      const k=1-smooth((t-(SC['002'].start-.2))/.7);if(k<=0)return;
      c.save();c.globalCompositeOperation='multiply';c.globalAlpha=k;c.fillStyle='rgb(118,104,132)';c.fillRect(0,0,W,H);c.restore();
    },
    graph2009(c,t){
      const at=wordAt('010','биткоин'),u=appear(t,at,.25)*(1-appear(t,at+3.0,.4));if(u<=0)return;
      c.save();c.translate(W*.76,H*.3);const k=mix(1.06,1,u)*.7;c.scale(k,k);
      strip(c,0,0,900,470,{alpha:u,seed:21});
      c.globalAlpha=u;c.strokeStyle=INK;c.lineWidth=7;c.lineCap='round';
      c.beginPath();c.moveTo(-340,-150);c.lineTo(-340,120);c.lineTo(350,120);c.stroke();
      c.lineWidth=9;c.beginPath();c.moveTo(-336,114);c.lineTo(80,114);c.lineTo(110,108);c.lineTo(350,60);c.stroke();
      text(c,'$0',-390,114,{font:'700 40px PilotSerif',alpha:u});
      text(c,'2009',-120,165,{font:'700 58px PilotSerif',alpha:u});
      c.restore();
    },
    lights(c,t,s){
      const a=smooth((t-(s.end-.85))/.55);if(a<=0)return;
      c.save();c.fillStyle='rgba(12,9,18,'+(a*.93)+')';c.fillRect(0,0,W,H);c.restore();
    }
  };

  function paintShot(c,s,t){
    const dur=Math.max(.01,s.end-s.start),u=smooth((t-s.start)/dur);
    const cam={z:mix(s.cam.z[0],s.cam.z[1],u),x:mix(s.cam.x[0],s.cam.x[1],u),y:mix(s.cam.y[0],s.cam.y[1],u)};
    camera(c,s.img,cam,cc=>{for(const o of s.over)if(PLATE[o])PLATE[o](cc,t,s);});
    for(const o of s.over){const [name,arg]=o.split(':');if(SCREEN[name])SCREEN[name](c,t,s,arg);}
  }

  function image(c,t){
    let i=shots.findIndex((s,k)=>t>=s.start&&(t<s.end||k===shots.length-1));if(i<0)i=0;
    const s=shots[i],prev=shots[i-1],local=t-s.start;
    if(s.in==='dissolve'&&prev&&local<.45){
      paintShot(c,prev,prev.end);
      c.save();c.globalAlpha=smooth(local/.45);paintShot(c,s,t);c.restore();return;
    }
    paintShot(c,s,t);
  }

  function transition(c,t){
    for(const s of shots){
      if(s.in!=='wipe')continue;
      const u=(t-s.start+.12)/.27;if(u<=0||u>=1)continue;
      const x=mix(-W-70,W+70,smooth(u));
      c.save();c.fillStyle=CREAM;c.shadowColor='rgba(56,35,18,.2)';c.shadowBlur=16;c.beginPath();c.moveTo(x,0);
      for(let y=0;y<=H;y+=22)c.lineTo(x+(P.hr(y,45)-.5)*24,y);
      c.lineTo(x+W+80,H);for(let y=H;y>=0;y-=22)c.lineTo(x+W+80+(P.hr(y,55)-.5)*24,y);
      c.closePath();c.fill();c.restore();
    }
  }

  // ---- captions: tokens of each phrase aligned to measured word starts ----
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
      if(group.length&&(chars+it.text.length>32||group.length>=5)){groups.push({items:group,start:group[0].t,end:it.t});group=[];chars=0;}
      group.push(it);chars+=it.text.length+1;
    }
    if(group.length)groups.push({items:group,start:group[0].t,end:sc.start+sc.speechDur+.16});
  }

  function captions(c,t){
    const cur=shots.find((s,k)=>t>=s.start&&(t<s.end||k===shots.length-1));
    if(cur&&cur.over.includes('title_card'))return;
    const g=groups.find(g=>t>=g.start-.025&&t<g.end);if(!g)return;
    c.save();c.font='700 68px PilotSans';c.textBaseline='middle';
    const widths=g.items.map(w=>c.measureText(w.text).width),gap=22;
    const total=widths.reduce((a,b)=>a+b,0)+gap*(widths.length-1),left=(W-total)/2;
    const x0=left-38,x1=left+total+38,y0=911,y1=1031;
    c.shadowColor='rgba(55,40,22,.24)';c.shadowBlur=12;c.shadowOffsetY=5;
    c.fillStyle=CREAM;c.beginPath();c.moveTo(x0,y0+4);
    for(let x=x0;x<x1;x+=23)c.lineTo(x,y0+(P.hr(Math.floor(x),14)-.5)*5);
    c.lineTo(x1,y1-4);for(let x=x1;x>x0;x-=23)c.lineTo(x,y1+(P.hr(Math.floor(x),16)-.5)*5);
    c.closePath();c.fill();c.shadowColor='transparent';
    let x=left;
    for(let i=0;i<g.items.length;i++){
      const item=g.items[i],next=g.items[i+1]?.t??g.end;
      if(t>=item.t-.025&&t<next){c.fillStyle=MUSTARD;c.fillRect(x-6,935,widths[i]+12,70);}
      c.fillStyle=INK;c.fillText(item.text,x,973);x+=widths[i]+gap;
    }
    c.restore();
  }

  function render(time){
    if(!vignette)return;
    const t=Math.floor(clamp(time,0,SP.total)*12+1e-6)/12;
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,W,H);
    image(ctx,t);ctx.drawImage(vignette,0,0);
    ctx.save();ctx.globalAlpha=.15;const step=Math.floor(t*12);ctx.translate(Math.floor(P.hr(step,21)*256),Math.floor(P.hr(step,22)*256));ctx.fillStyle=P.grainPattern(ctx);ctx.fillRect(-256,-256,W+512,H+512);ctx.restore();
    transition(ctx,t);captions(ctx,time);
  }
  window.PILOT_ENGINE={load,render,groups,shots};
})();
