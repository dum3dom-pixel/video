/* Second minute (0:16-1:18). Whole paper illustrations moved by camera plus code-made paper props.
   Images that are not generated yet fall back to a labelled placeholder so timing can be reviewed early. */
(() => {
  'use strict';
  const W=1920,H=1080,SP=window.M02,P=window.PAPER;
  const ctx=document.getElementById('stage').getContext('2d');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,u)=>a+(b-a)*u;
  const smooth=u=>{u=clamp(u);return u*u*(3-2*u)};
  const INK='#4c443b',CREAM='#F1E6CF',MUSTARD='#D9A441',BRICK='#8C4A32';
  const IMG={},MISSING={};
  const FILES={sasha:'shots/p4_sasha_hd.png',calendar:'shots/p3_calendar_hd.png',carpet:'bg/bg_carpet_wall_hd.png',soup:'shots/k_soup.png',table:'shots/k_sasha_table.png',kitchen:'bg/bg_kitchen.png',mama:'shots/k_mama_bread.png'};
  const SC=Object.fromEntries(SP.scenes.map(s=>[s.id,s]));
  const WD=id=>SP.words.filter(w=>w.scene===id);
  const norm=s=>s.toLowerCase().replace(/ё/g,'е');
  // Start time of the first word of a scene that begins with `stem` (after the `after`-th match).
  const wordAt=(id,stem,nth=0)=>{
    const hits=WD(id).filter(w=>norm(w.w).startsWith(norm(stem)));
    const w=hits[Math.min(nth,hits.length-1)];
    return w?w.t:SC[id].start;
  };
  let vignette=null;

  function placeholder(name){
    const cv=document.createElement('canvas');cv.width=1536;cv.height=1024;const c=cv.getContext('2d');
    c.fillStyle='#d8c9a8';c.fillRect(0,0,1536,1024);c.strokeStyle='rgba(140,74,50,.18)';c.lineWidth=18;
    for(let i=-1024;i<1536;i+=70){c.beginPath();c.moveTo(i,0);c.lineTo(i+1024,1024);c.stroke();}
    c.fillStyle='rgba(76,68,59,.75)';c.font='700 64px PilotSans';c.textAlign='center';c.fillText('ЗАГЛУШКА: '+name,768,470);
    c.font='40px PilotSerif';c.fillText('картинка ещё не сгенерирована',768,540);
    return cv;
  }

  async function load(){
    const base=window.PILOT_ASSET_BASE||'assets/';
    await Promise.all(Object.entries(FILES).map(([key,file])=>new Promise(resolve=>{
      const im=new Image();im.onload=()=>{IMG[key]=im;resolve();};
      im.onerror=()=>{IMG[key]=placeholder(file);MISSING[key]=true;resolve();};
      im.src=base+file;
    })));
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;
    const c=cv.getContext('2d'),g=c.createRadialGradient(W*.5,H*.46,H*.42,W*.5,H*.46,H*1.12);
    g.addColorStop(0,'rgba(50,32,12,0)');g.addColorStop(1,'rgba(50,32,12,.30)');c.fillStyle=g;c.fillRect(0,0,W,H);vignette=cv;
  }

  // Camera coordinates stay in the 1536x1024 frame. A 16:9 plate (any resolution) is mapped to 1536x864
  // and centred in that frame, so extra() props and camera values keep the same coordinates.
  function camera(c,name,{z=1,x=768,y=512}={},extra){
    const im=IMG[name],ph=1536*im.height/im.width,off=(1024-ph)/2;
    x=clamp(x,768/z,1536-768/z);y=clamp(y,off+432/z,off+ph-432/z);
    const scale=1.25*z,dx=W/2-x*scale,dy=H/2-y*scale;
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.save();c.translate(dx,dy);c.scale(scale,scale);c.drawImage(im,0,off,1536,ph);
    if(extra)extra(c);c.restore();
  }

  // ---- paper props drawn by code ----
  function paperStrip(c,cx,cy,w,h,{fill=CREAM,rot=0,seed=1,shadow=true}={}){
    c.save();c.translate(cx,cy);c.rotate(rot);
    if(shadow){c.shadowColor='rgba(55,40,22,.3)';c.shadowBlur=18;c.shadowOffsetY=7;}
    c.fillStyle=fill;c.beginPath();c.moveTo(-w/2,-h/2+3);
    for(let x=-w/2;x<w/2;x+=26)c.lineTo(x,-h/2+(P.hr(Math.floor(x+cx),seed)-.5)*7);
    c.lineTo(w/2,h/2-3);for(let x=w/2;x>-w/2;x-=26)c.lineTo(x,h/2+(P.hr(Math.floor(x+cx),seed+1)-.5)*7);
    c.closePath();c.fill();c.restore();
  }
  function textOnStrip(c,text,cx,cy,font,color=INK){
    c.save();c.font=font;c.fillStyle=color;c.textAlign='center';c.textBaseline='middle';c.fillText(text,cx,cy);c.restore();
  }
  function pop(c,cx,cy,t,t0,draw){
    const u=clamp((t-t0)/.22);if(t<t0)return;
    const s=u<1?1+.28*(1-u)*(1-u)*Math.cos(u*9):1;
    c.save();c.translate(cx,cy);c.scale(s,s);c.globalAlpha=Math.min(1,u*3);draw(c);c.restore();
  }

  // ---- scenes ----
  function calendarYear(c,t,t0,t1){
    const STEPS=22,u=clamp((t-t0)/(t1-t0)*1.12),f=u*STEPS,idx=Math.min(STEPS-1,Math.floor(f)),frac=f-idx;
    const year=2005+idx,prev=year-1;
    c.save();c.fillStyle='#62513e';c.textAlign='center';c.textBaseline='alphabetic';
    c.font='700 148px PilotSerif';c.fillText('12',625,428);
    c.font='40px PilotSerif';c.fillText('сентября',625,502);
    c.font='700 72px PilotSerif';
    const e=idx===0?1:smooth(frac*3.5);
    if(idx>0){c.globalAlpha=1-e;c.fillText(String(prev),625,598-e*34);}
    c.globalAlpha=idx===0?1:e;c.fillText(String(year),625,598+(1-e)*34);c.restore();
  }

  function questionCard(c,t){
    const sc=SC.question,u=smooth((t-sc.start)/.35);if(u<=0)return;
    const display=['Что,','если','ты','проснулся','в','12','лет,','помнишь,','как','всё','будет,','и','никому','не','можешь','об','этом','сказать?'];
    const tm=WD('question');
    c.save();c.font='700 66px PilotSerif';
    const maxW=1260,lines=[[]];let cur=0;
    display.forEach((tok,i)=>{
      const wdt=c.measureText(tok+' ').width;
      if(cur+wdt>maxW&&lines[lines.length-1].length){lines.push([]);cur=0;}
      lines[lines.length-1].push({tok,i,wdt});cur+=wdt;
    });
    const lh=96,h=lines.length*lh+110,cy=330+(1-u)*120;
    paperStrip(c,W/2,cy,1480,h,{rot:-.012*u,seed:61});
    lines.forEach((ln,li)=>{
      const total=ln.reduce((a,b)=>a+b.wdt,0);let x=W/2-total/2;
      const y=cy-h/2+55+lh*li+lh*.6;
      for(const it of ln){
        const w=tm[Math.min(it.i,tm.length-1)];
        const a=w?clamp((t-w.t+.02)/.14):1;
        c.globalAlpha=a;c.fillStyle=it.i>=12?BRICK:INK;c.textBaseline='middle';c.textAlign='left';c.fillText(it.tok,x,y);x+=it.wdt;
      }
    });
    c.restore();
  }

  // A row of code-drawn cassettes 2006-2026 slides left until "2024" is centred, then lifts.
  function cassettesRow(c,t){
    const sc=SC.cassettes,FOCUS=18,GAP=270;
    const tk=wordAt('cassettes','кассет'),tn=wordAt('cassettes','никогда');
    const pos=mix(0,FOCUS,smooth((t-sc.start)/Math.max(.5,tk-sc.start)));
    for(let i=0;i<21;i++){
      const x=W/2+(i-pos)*GAP;if(x<-200||x>W+200)continue;
      const hot=i===FOCUS&&t>=tk,lift=hot?smooth((t-tk)/.3)*40:0,shake=i===FOCUS&&t>=tn?Math.sin((t-tn)*40)*4*clamp(1-(t-tn)/.5):0;
      c.save();c.translate(x+shake,480-lift);c.rotate((P.hr(i,31)-.5)*.05);
      c.shadowColor='rgba(30,20,10,.45)';c.shadowBlur=20;c.shadowOffsetY=8;
      c.fillStyle=INK;c.beginPath();c.roundRect(-115,-75,230,150,14);c.fill();c.shadowColor='transparent';
      paperStrip(c,0,-28,190,62,{fill:hot?MUSTARD:CREAM,seed:40+i,shadow:false});
      textOnStrip(c,String(2006+i),0,-26,'700 44px PilotSans',hot?BRICK:INK);
      c.fillStyle=CREAM;for(const rx of [-45,45]){c.beginPath();c.arc(rx,38,20,0,Math.PI*2);c.fill();}
      c.fillStyle=INK;for(const rx of [-45,45]){c.beginPath();c.arc(rx,38,8,0,Math.PI*2);c.fill();}
      c.restore();
    }
  }

  function rulesNote(c,t){
    const u=smooth((t-SC.restart.start)/.2);if(u<=0)return;
    c.save();c.globalAlpha=u;
    paperStrip(c,310,150,420,110,{fill:'#4c443b',rot:-.03,seed:71});textOnStrip(c,'ПРАВИЛА',310,150,'700 56px PilotSans',CREAM);
    c.restore();
  }

  function restartProps(c,t){
    pop(c,W/2,500,t,SC.restart.start+.1,cc=>{paperStrip(cc,0,0,900,190,{seed:81});textOnStrip(cc,'Перезапуска нет',0,0,'700 92px PilotSerif');});
    const tb=wordAt('restart','перезапуск'),tn=wordAt('restart','нет');
    pop(c,1650,500,t,tb,cc=>{
      const dead=clamp((t-tn)/.3);
      cc.fillStyle=dead>0?'#a59b8c':BRICK;cc.shadowColor='rgba(55,40,22,.3)';cc.shadowBlur=16;cc.shadowOffsetY=6;
      cc.beginPath();cc.arc(0,0,86,0,Math.PI*2);cc.fill();cc.shadowColor='transparent';
      cc.strokeStyle=CREAM;cc.lineWidth=12;cc.lineCap='round';cc.beginPath();cc.arc(0,0,40,-.5,4.4);cc.stroke();
      cc.beginPath();cc.moveTo(22,-52);cc.lineTo(46,-36);cc.lineTo(20,-24);cc.stroke();
      if(dead>0){cc.strokeStyle=INK;cc.lineWidth=14;cc.beginPath();cc.moveTo(-70,-70);cc.lineTo(-70+140*dead,-70+140*dead);cc.stroke();}
    });
  }

  function wordsProps(c,t){
    const t0=wordAt('words','работают');
    pop(c,440,150,t,t0,cc=>{cc.rotate(-.02);paperStrip(cc,0,0,700,130,{seed:91});textOnStrip(cc,'Словам не верят',0,0,'700 72px PilotSerif');});
  }

  function ageTag(c,t){
    const t0=wordAt('age','тридцать');
    pop(c,1500,330,t,t0,cc=>{cc.rotate(.05);paperStrip(cc,0,0,360,300,{seed:97});textOnStrip(cc,'38',0,6,'700 190px PilotSerif',BRICK);});
  }

  function scene(c,t){
    const id=SP.scenes.find(s=>t>=s.start&&t<s.start+s.dur+1e-6)?.id??'age';
    const sc=SC[id],u=clamp((t-sc.start)/sc.dur);
    switch(id){
      case 'hookA':{
        const a=wordAt('hookA','каждый');
        const end=SP.words.filter(w=>w.scene==='hookA'&&norm(w.w)==='и')[0]?.t??sc.start+sc.dur*.55;
        if(t<a)camera(c,'sasha',{z:mix(1.04,1.7,smooth((t-sc.start)/(a-sc.start))),x:768,y:mix(480,420,smooth((t-sc.start)/(a-sc.start)))});
        else if(t<end){camera(c,'calendar',{z:mix(1.1,1.16,smooth((t-a)/(end-a))),x:715,y:480},cc=>calendarYear(cc,t,a,end));}
        else camera(c,'sasha',{z:mix(2.2,2.6,smooth((t-end)/(sc.start+sc.dur-end))),x:770,y:388});
        break;}
      case 'cassettes':
        camera(c,'carpet',{z:mix(1.1,1.16,u),x:768,y:470});c.fillStyle='rgba(40,25,10,.45)';c.fillRect(0,0,W,H);cassettesRow(c,t);break;
      case 'question':
        camera(c,'sasha',{z:1.35,x:768,y:330});c.fillStyle='rgba(40,25,10,.4)';c.fillRect(0,0,W,H);questionCard(c,t);break;
      case 'restart':
        camera(c,'carpet',{z:mix(1,1.08,u),x:768,y:470});rulesNote(c,t);restartProps(c,t);break;
      case 'words':
        camera(c,'soup',{z:mix(1,1.14,smooth(u)),x:mix(768,720,u),y:mix(512,540,u)});wordsProps(c,t);break;
      case 'convince':{
        const a=wordAt('convince','сбудется',1);
        camera(c,'calendar',{z:mix(1.1,1.16,u),x:715,y:480},cc=>calendarYear(cc,t,a,sc.start+sc.dur));break;}
      case 'alone':
        camera(c,'table',{z:mix(1.3,1,smooth(u)),x:768,y:mix(470,512,smooth(u))});break;
      case 'day1':
        camera(c,'table',{z:mix(1.6,2.1,smooth(u)),x:780,y:mix(480,440,smooth(u))});break;
      case 'kitchen':
        camera(c,'kitchen',{z:1.4,x:mix(940,560,smooth(u)),y:470});break;
      case 'mama':
        camera(c,'mama',{z:mix(1,1.22,smooth(u)),x:768,y:mix(512,470,smooth(u))});break;
      default:
        camera(c,'mama',{z:mix(1.22,1.28,smooth(u)),x:768,y:470});ageTag(c,t);
    }
  }

  // Subtitles from unchanged transcript + measured word starts (same recipe as the pilot).
  const groups=[];
  for(const sc of SP.scenes){
    const timings=WD(sc.id),tokens=sc.text.split(/\s+/).filter(Boolean);
    let group=[],chars=0;
    for(let i=0;i<tokens.length;i++){
      const token=tokens[i],w=timings[Math.min(i,timings.length-1)];if(!w)continue;
      if(group.length&&(chars+token.length>32||group.length>=5)){
        // keep a short function word ("и", "в", "на") with the phrase it opens
        const tail=group[group.length-1].text.replace(/[^А-Яа-яЁё]/g,'').length<=2&&group.length>1?group.pop():null;
        groups.push({items:group,start:group[0].t,end:tail?tail.t:w.t,scene:sc.id});
        group=tail?[tail]:[];chars=tail?tail.text.length+1:0;
      }
      group.push({text:token,t:w.t,d:w.d});chars+=token.length+1;
    }
    if(group.length)groups.push({items:group,start:group[0].t,end:sc.start+sc.speechDur+.16,scene:sc.id});
  }
  function captions(c,t){
    const g=groups.find(g=>t>=g.start-.025&&t<g.end);if(!g||g.scene==='question')return;
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

  function transition(c,t){
    for(const id of ['cassettes','restart','words','convince','alone','kitchen','mama']){
      const at=SC[id].start,u=(t-at+.12)/.27;if(u<=0||u>=1)continue;
      const x=mix(-W-70,W+70,smooth(u));
      c.save();c.fillStyle=CREAM;c.shadowColor='rgba(56,35,18,.2)';c.shadowBlur=16;c.beginPath();c.moveTo(x,0);
      for(let y=0;y<=H;y+=22)c.lineTo(x+(P.hr(y,45)-.5)*24,y);
      c.lineTo(x+W+80,H);for(let y=H;y>=0;y-=22)c.lineTo(x+W+80+(P.hr(y,55)-.5)*24,y);
      c.closePath();c.fill();c.restore();
    }
  }

  function render(time){
    if(!vignette)return;
    const t=Math.floor(clamp(time,0,SP.duration)*12+1e-6)/12;
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,W,H);
    scene(ctx,t);ctx.drawImage(vignette,0,0);
    ctx.save();ctx.globalAlpha=.15;const step=Math.floor(t*12);ctx.translate(Math.floor(P.hr(step,21)*256),Math.floor(P.hr(step,22)*256));ctx.fillStyle=P.grainPattern(ctx);ctx.fillRect(-256,-256,W+512,H+512);ctx.restore();
    transition(ctx,t);captions(ctx,time);
  }
  window.PILOT_ENGINE={load,render,groups,missing:MISSING};
})();
