/* Full-length film engine: a shot list (spec/film-*-shots.json) cued to the measured narration timeline.
   Whole paper illustrations moved by camera plus code-made paper props, captions, transitions. */
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
  const cueTime=([id,n=0])=>{const w=WD(id)[n];return w?w.t:(SC[id]?SC[id].start:0);};
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

  // ---- plate overlays (drawn in 1536x1024 plate space, move with the camera) ----
  const RULES=[['Перезапуска нет',cueTime(['015']),290],['Словам не верят',cueTime(['017']),402],['Знание тает',cueTime(['023']),514]];
  const MELT=[wordAt('024','курсы'),cueTime(['025'])];
  const PLAN=['Доллар','Учёба','Английский','Компьютер','Копилка','Кассеты','Биткоин'];
  const PLAN_T=(()=>{
    const a=wordAt('056','доллар'),b=wordAt('056','биткоин');
    return PLAN.map((_,i)=>mix(a,b,i/(PLAN.length-1)));
  })();
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
      for(const [s,at,y] of RULES){
        let u=appear(t,at,.3);if(u<=0)continue;
        if(s==='Знание тает')u*=1-smooth((t-MELT[0])/(MELT[1]-MELT[0]));
        if(u<=0)continue;
        c.save();c.font='700 76px PilotSerif';const w=c.measureText(s).width+60;
        c.globalAlpha=u*.6;c.fillStyle=MUSTARD;c.fillRect(760-w/2,y-48,w,92);c.restore();
        c.save();c.translate(760,y);const k=mix(1.12,1,u);c.scale(k,k);text(c,s,0,0,{font:'700 76px PilotSerif',alpha:u,fill:INK});c.restore();
      }
    },
    plan(c,t){
      text(c,'ПЛАН',190,240,{font:'700 66px PilotSerif',align:'left',alpha:appear(t,SC['055'].start+.2)});
      PLAN.forEach((s,i)=>{
        const u=appear(t,PLAN_T[i],.25);if(u<=0)return;
        const y=330+i*62;
        if(i===PLAN.length-1){c.save();c.globalAlpha=u*.55;c.fillStyle=MUSTARD;c.fillRect(160,y-30,520,60);c.restore();}
        text(c,`${i+1}. ${s}`,190,y,{font:'700 46px PilotSerif',align:'left',alpha:u});
      });
    },
    fractions(c,t){
      const a=appear(t,wordAt('019','три'),.3),b=appear(t,wordAt('019','тридцать'),.4);
      c.save();c.rotate(-.012);
      text(c,'3/5 + 2/7 =',390,380,{font:'700 64px PilotSerif',fill:'#5a5048',alpha:a*.9});
      text(c,'31/35',960,380,{font:'700 96px PilotSerif',fill:'#5a5048',alpha:b*.9});c.restore();
    },
    plan7(c,t){
      text(c,'ПЛАН',1056,215,{font:'700 62px PilotSerif',alpha:appear(t,SC['024'].start+.2)});
      PLAN.forEach((s,i)=>{
        const u=appear(t,SC['025'].start+.3+i*.12,.25);if(u<=0)return;
        const y=300+i*60;
        if(i===PLAN.length-1){const h=appear(t,wordAt('026','седьм'),.3);c.save();c.globalAlpha=h*.55;c.fillStyle=MUSTARD;c.fillRect(690,y-28,560,56);c.restore();}
        text(c,`${i+1}. ${s}`,720,y,{font:'700 44px PilotSerif',align:'left',alpha:u});
      });
    },
    tape2026(c,t,s){
      const u=appear(t,s.start+.6,.5);if(u<=0)return;
      // Follow the label's clockwise slope; leave paper margins around all four digits.
      c.save();c.translate(663,318);c.rotate(.12);text(c,'2026',0,0,{font:'italic 700 40px PilotSerif',fill:'#4c443b',alpha:u*.9});c.restore();
    },
    chalk(c,t){
      const u=appear(t,wordAt('053','сколько'),.4);
      // Above Sasha, wholly inside the board, in the same plate space as the camera.
      c.save();c.translate(640,190);c.rotate(-.01);text(c,'3/5 + 2/7 = ?',0,0,{font:'700 42px PilotSerif',fill:'#EFE8D8',alpha:u*.92});c.restore();
    }
  };

  // ---- screen overlays (1920x1080) ----
  const DATE_PLATES={1:'Сентябрь 2005 · 12 лет',2:'Осень 2005 · 12 лет',3:'Май 2006 · 13 лет',4:'2006 · 13 лет',5:'Сентябрь 2008 · 15 лет',6:'2009 · 15 лет',7:'Весна 2011',8:'2011 · 18 лет',9:'2012 · 19 лет',10:'2013 · 20 лет',11:'2015 · 22 года',12:'2019 · 26 лет',13:'2024 · 31 год',14:'2026 · 33 года'};
  const SCREEN={
    title_card(c,t,s){
      const u=appear(t,s.start+.15,.45);if(u<=0)return;
      c.save();c.translate(0,(1-u)*60);
      strip(c,W/2,H/2-30,1740,330,{alpha:u,seed:3});
      text(c,'Что, если ты проснулся в двенадцать лет',W/2,H/2-85,{font:'700 68px PilotSerif',alpha:u});
      text(c,'и помнишь всю жизнь наперёд?',W/2,H/2+25,{font:'700 68px PilotSerif',alpha:u});
      c.restore();
    },
    date_plate(c,t,s,arg){
      const u=appear(t,s.start+.35,.3)*(1-appear(t,s.start+3.6,.4));if(u<=0)return;
      c.font='700 44px PilotSerif';const w=c.measureText(DATE_PLATES[arg]).width+70;
      strip(c,70+w/2,86,w,92,{alpha:u,seed:5,fill:MUSTARD});text(c,DATE_PLATES[arg],70+w/2,86,{font:'700 44px PilotSerif',alpha:u});
    },
    pc_hour(c,t){
      const u=appear(t,wordAt('023','час'),.3);if(u<=0)return;
      c.font='700 60px PilotSerif';const w=c.measureText('1 час').width+80;
      strip(c,1560,210,w,100,{alpha:u,seed:8,fill:MUSTARD});text(c,'1 час',1560,210,{font:'700 60px PilotSerif',alpha:u});
    },
    bank(c,t){
      const at=wordAt('046','банк'),u=appear(t,at,.3)*(1-appear(t,at+3.2,.4));if(u<=0)return;
      c.font='700 56px PilotSerif';const w=c.measureText('Банк завтра в 10:00').width+80;
      strip(c,W/2,150,w,100,{alpha:u,seed:11,fill:MUSTARD});text(c,'Банк завтра в 10:00',W/2,150,{font:'700 56px PilotSerif',alpha:u});
    },
    timeline(c,t,s){
      const u=appear(t,s.start+.2,.4);if(u<=0)return;
      const k=appear(t,s.start+1.0,.9);
      strip(c,W/2,H/2-40,1300,260,{alpha:u,seed:13});
      text(c,'2006',W/2-420,H/2-40,{font:'700 110px PilotSerif',alpha:u});
      text(c,'2008',W/2+420,H/2-40,{font:'700 110px PilotSerif',alpha:u*smooth((t-(s.start+1.6))/.5)});
      c.save();c.globalAlpha=u;c.strokeStyle=INK;c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(W/2-250,H/2-40);c.lineTo(mix(W/2-250,W/2+250,k),H/2-40);c.stroke();c.restore();
      text(c,'осень',W/2+420,H/2+50,{font:'700 48px PilotSerif',alpha:u*smooth((t-(s.start+2.0))/.5),fill:BRICK});
    },
    cold(c){c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgb(168,190,216)';c.fillRect(0,0,W,H);c.restore();},
    lights(c,t,s){
      const a=smooth((t-(s.end-.85))/.55);if(a<=0)return;
      c.save();c.fillStyle='rgba(12,9,18,'+(a*.93)+')';c.fillRect(0,0,W,H);c.restore();
    },
    grain(c){c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgb(176,176,184)';c.fillRect(0,0,W,H);c.restore();},
    life_words(c,t){
      [['работа','работа',560,330,-.04],['маршрутка','маршрутка',960,470,.03],['сериал','сериал',1360,350,-.02]].forEach(([s,stem,x,y,r])=>{
        const at=wordAt('088',stem),u=appear(t,at,.2)*(1-appear(t,at+1.5,.3));if(u<=0)return;
        c.font='700 70px PilotSerif';const w=c.measureText(s).width+70;
        strip(c,x,y,w,110,{alpha:u,rot:r,seed:7});text(c,s,x,y,{font:'700 70px PilotSerif',alpha:u});
      });
    },
    answered2(c,t){
      const at=wordAt('077','ответил')-.5,u=appear(t,at,.35);if(u<=0)return;
      c.save();c.translate(W/2,H/2-120);const k=mix(1.08,1,u);c.scale(k,k);
      strip(c,0,0,820,170,{alpha:u,seed:9});text(c,'«Он ответил»',0,0,{font:'700 88px PilotSerif',alpha:u});c.restore();
    },
    answered(c,t){
      const at=wordAt('091','ответил')-.5,u=appear(t,at,.35);if(u<=0)return;
      c.save();c.translate(W/2,H/2-120);const k=mix(1.08,1,u);c.scale(k,k);
      strip(c,0,0,820,170,{alpha:u,seed:9});text(c,'«Он ответил»',0,0,{font:'700 88px PilotSerif',alpha:u});c.restore();
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
