/* ═══ DEVICES ═══ */
const DEVS={
  /* iPhone */
  '6.9': {w:1320, h:2868, lbl:'1320×2868 (iPhone 6.9")'},
  '6.7': {w:1290, h:2796, lbl:'1290×2796 (iPhone 6.7")'},
  '6.5': {w:1242, h:2688, lbl:'1242×2688 (iPhone 6.5")'},
  '5.5': {w:1242, h:2208, lbl:'1242×2208 (iPhone 5.5")'},
  /* iPad */
  'ipad13': {w:2048, h:2732, lbl:'2048×2732 (iPad 12.9")'},
  'ipad11': {w:1668, h:2388, lbl:'1668×2388 (iPad 11")'},
  'ipad97': {w:1536, h:2048, lbl:'1536×2048 (iPad 9.7")'},
};
let curDev='6.9';
const PW=268;
function setDevice(d){
  curDev=d;
  document.querySelectorAll('.dev-btn').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('dev-'+d);
  if(btn) btn.classList.add('active');
  initAllCanvas();render();
}

/* ═══ UNDO / REDO ═══ */
let undoStack=[],redoStack=[],MAX_UNDO=40;
function pushUndo(){
  const snap=serializeSlides();
  undoStack.push(snap);
  if(undoStack.length>MAX_UNDO)undoStack.shift();
  redoStack=[];
  updateUndoBtn();
}
function undo(){
  if(!undoStack.length)return;
  const current=serializeSlides();
  redoStack.push(current);
  const snap=undoStack.pop();
  deserializeSlides(snap);
  updateUndoBtn();
  showToast('元に戻しました ↩');
}
function redo(){
  if(!redoStack.length)return;
  const current=serializeSlides();
  undoStack.push(current);
  const snap=redoStack.pop();
  deserializeSlides(snap);
  updateUndoBtn();
  showToast('やり直しました ↪');
}
function updateUndoBtn(){
  const btn=document.getElementById('undo-btn');
  const cnt=document.getElementById('undo-count');
  btn.disabled=undoStack.length===0;
  cnt.textContent=undoStack.length>0?`(${undoStack.length})`:'';
  const rbtn=document.getElementById('redo-btn');
  const rcnt=document.getElementById('redo-count');
  if(rbtn){rbtn.disabled=redoStack.length===0;}
  if(rcnt){rcnt.textContent=redoStack.length>0?`(${redoStack.length})`:'';}
}
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='z'&&!e.shiftKey){e.preventDefault();undo();}
  if((e.ctrlKey||e.metaKey)&&((e.key==='z'&&e.shiftKey)||e.key==='y')){e.preventDefault();redo();}
});

/* ═══ FONTS ═══ */
const FONTS=[
  {id:'noto',   name:'Noto Sans JP',   sample:'あいうえお',      css:"'Noto Sans JP'",        weights:['400','700','900']},
  {id:'mplus',  name:'M PLUS Rounded', sample:'まるくて可愛い',   css:"'M PLUS Rounded 1c'",   weights:['400','700','800']},
  {id:'dela',   name:'Dela Gothic',    sample:'太くてパワフル',   css:"'Dela Gothic One'",     weights:['400']},
  {id:'zen',    name:'Zen Maru Gothic',sample:'ナチュラル和風',   css:"'Zen Maru Gothic'",     weights:['400','700','900']},
  {id:'kaisei', name:'Kaisei Decol',   sample:'上品な明朝体',     css:"'Kaisei Decol'",        weights:['400','700']},
  {id:'klee',   name:'Klee One',       sample:'やわらか手書き',   css:"'Klee One'",            weights:['400','600']},
  {id:'hachi',  name:'はちまるポップ', sample:'ポップでかわいい', css:"'Hachi Maru Pop'",      weights:['400']},
  {id:'dot',    name:'ドットゴシック',  sample:'レトロなドット',   css:"'DotGothic16'",         weights:['400']},
  {id:'yomogi', name:'よもぎ',         sample:'ゆるくてほっこり', css:"'Yomogi'",              weights:['400']},
  {id:'rampart',name:'Rampart One',    sample:'立体感のある文字', css:"'Rampart One'",         weights:['400']},
  {id:'rocknroll',name:'RocknRoll',    sample:'ロック！元気！',   css:"'RocknRoll One'",       weights:['400']},
];

/* ═══ DEVICE-AWARE GETTERS ═══ */
function getTitleSize(s){return isIpadDev()?(s.titleSizeIpad!=null?s.titleSizeIpad:s.titleSize||100):(s.titleSize||100);}
function getTextOffsetY(s){return isIpadDev()?(s.textOffsetYIpad!=null?s.textOffsetYIpad:s.textOffsetY||0):(s.textOffsetY||0);}

/* ═══ HELPERS ═══ */
function ha(hex,a){try{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;}catch{return`rgba(0,0,0,${a})`;}}
function drawGrad(ctx,W,H,c1,c2,angle){
  const rad=(+angle||135)*Math.PI/180,cx=W/2,cy=H/2,d=Math.sqrt(W*W+H*H)/2;
  const g=ctx.createLinearGradient(cx-Math.sin(rad)*d,cy-Math.cos(rad)*d,cx+Math.sin(rad)*d,cy+Math.cos(rad)*d);
  g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
}
function rr(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}
function drawImgCover(ctx,img,x,y,w,h,scale,offX,offY){
  if(!img)return;const ia=img.width/img.height,aa=w/h;
  let dw,dh,dx,dy;
  if(ia>aa){dh=h;dw=dh*ia;dx=x+(w-dw)/2;dy=y;}else{dw=w;dh=dw/ia;dx=x;dy=y+(h-dh)/2;}
  const sc=scale||100;
  if(sc!==100){const f=sc/100;const cdx=x+w/2,cdy=y+h/2;dw*=f;dh*=f;dx=cdx-dw/2;dy=cdy-dh/2;}
  if(offX)dx+=offX*w/100;
  if(offY)dy+=offY*h/100;
  ctx.drawImage(img,dx,dy,dw,dh);
}
function drawPill(ctx,cx,cy,w,h,bg,tc,text,fs){
  const r=h/2;
  ctx.beginPath();ctx.moveTo(cx-w/2+r,cy-h/2);ctx.lineTo(cx+w/2-r,cy-h/2);
  ctx.arcTo(cx+w/2,cy-h/2,cx+w/2,cy,r);ctx.arcTo(cx+w/2,cy+h/2,cx+w/2-r,cy+h/2,r);
  ctx.lineTo(cx-w/2+r,cy+h/2);ctx.arcTo(cx-w/2,cy+h/2,cx-w/2,cy,r);
  ctx.arcTo(cx-w/2,cy-h/2,cx-w/2+r,cy-h/2,r);ctx.closePath();
  ctx.fillStyle=bg;ctx.fill();
  if(text&&fs&&tc){ctx.strokeStyle=tc;ctx.lineWidth=h*.05;ctx.stroke();ctx.fillStyle=tc;ctx.font=`700 ${fs}px 'Noto Sans JP'`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,cx,cy);}
}

/* ═══ GRAIN ═══ */
let grainCache={canvas:null,w:0,h:0,intensity:0};
function getGrainCanvas(W,H,intensity){
  if(grainCache.canvas&&grainCache.w===W&&grainCache.h===H&&grainCache.intensity===intensity)return grainCache.canvas;
  const gc=document.createElement('canvas');gc.width=W;gc.height=H;
  const gctx=gc.getContext('2d');
  const id=gctx.createImageData(W,H);
  const data=id.data;
  const str=intensity/100;
  for(let i=0;i<data.length;i+=4){
    const v=Math.random()*255;
    data[i]=data[i+1]=data[i+2]=v;
    data[i+3]=Math.floor(str*80);
  }
  gctx.putImageData(id,0,0);
  grainCache={canvas:gc,w:W,h:H,intensity};
  return gc;
}
function drawGrain(ctx,W,H,intensity){
  if(!intensity||intensity<=0)return;
  const gc=getGrainCanvas(W,H,intensity);
  ctx.save();ctx.globalCompositeOperation='overlay';ctx.globalAlpha=0.6;ctx.drawImage(gc,0,0);ctx.restore();
}

/* ═══ PHONE ═══ */
function drawPhone(ctx,x,y,w,h,s){
  const ipad=isIpadDev();
  const r=w*(ipad?.065:.11),bw=w*(ipad?.028:.018);
  ctx.save();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=w*.28;ctx.shadowOffsetY=w*.09;
  const FC={black:['#282828','#0f0f0f'],silver:['#e2e2e2','#acacac'],gold:['#d4a96a','#a07840'],none:['#2a2a2a','#111']};
  const [fa,fb]=(FC[s.frameColor]||FC.black);
  const fg=ctx.createLinearGradient(x,y,x+w,y+h);fg.addColorStop(0,fa);fg.addColorStop(1,fb);
  rr(ctx,x,y,w,h,r);ctx.fillStyle=fg;ctx.fill();ctx.restore();

  // Screen area
  const sx=x+bw,sy=y+bw,sw=w-bw*2,sh=h-bw*2;
  const sr=r*(ipad?.75:.82);
  ctx.save();rr(ctx,sx,sy,sw,sh,sr);ctx.clip();
  if(getScreenshot(s)){
    drawImgCover(ctx,getScreenshot(s),sx,sy,sw,sh,s.screenshotScale,s.screenshotOffsetX,s.screenshotOffsetY);
  }else{
    ctx.fillStyle='#0a0a18';ctx.fillRect(sx,sy,sw,sh);
    ctx.fillStyle='rgba(255,255,255,.05)';ctx.font=`${sw*.055}px -apple-system`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('スクショをアップロード',sx+sw/2,sy+sh/2);
  }
  ctx.restore();

  if(ipad){
    // iPad: front camera (small circle, top center)
    const camR=w*.012;
    ctx.beginPath();ctx.arc(x+w/2,y+bw+camR*2.5,camR,0,Math.PI*2);ctx.fillStyle='#0a0a18';ctx.fill();
    ctx.beginPath();ctx.arc(x+w/2,y+bw+camR*2.5,camR*.5,0,Math.PI*2);ctx.fillStyle='#1a1a2a';ctx.fill();
  }else{
    // iPhone: Dynamic Island
    const diW=w*.3,diH=w*.037;rr(ctx,x+w/2-diW/2,y+bw+h*.013,diW,diH,diH/2);ctx.fillStyle='#000';ctx.fill();
  }

  // Home bar
  const bW=w*(ipad?.25:.33),bH=Math.max(h*.004,1.5);
  rr(ctx,x+w/2-bW/2,y+h-bw-bH-h*.013,bW,bH,bH/2);
  ctx.fillStyle=s.frameColor==='silver'?'rgba(0,0,0,.15)':'rgba(255,255,255,.28)';ctx.fill();

  if(!ipad){
    // iPhone: side buttons
    const bc=s.frameColor==='silver'?'#aaa':s.frameColor==='gold'?'#b08a48':'#1a1a1a';
    [[x-bw*.7,y+h*.2,bw*.7,h*.07],[x-bw*.7,y+h*.3,bw*.7,h*.07],[x+w,y+h*.27,bw*.65,h*.1]].forEach(([bx,by,bw2,bh2])=>{rr(ctx,bx,by,bw2,bh2,2);ctx.fillStyle=bc;ctx.fill();});
  }
}

function miniPhone(ctx,x,y,w,h,fill='rgba(30,40,70,.9)',stroke='rgba(255,255,255,.25)',angle=0){
  const r=w*.1,cx2=x+w/2,cy2=y+h/2;
  ctx.save();if(angle){ctx.translate(cx2,cy2);ctx.rotate(angle);ctx.translate(-cx2,-cy2);}
  rr(ctx,x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
  rr(ctx,x+w*.05,y+w*.05,w*.9,h-w*.1,r*.8);ctx.fillStyle='rgba(60,100,200,.25)';ctx.fill();
  ctx.strokeStyle=stroke;ctx.lineWidth=1;rr(ctx,x,y,w,h,r);ctx.stroke();
  const diW=w*.28,diH=w*.035;rr(ctx,cx2-diW/2,y+w*.05+h*.015,diW,diH,diH/2);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fill();
  ctx.restore();
}
function miniTextLines(ctx,x,y,align,W){
  const lw=W*.45,sh=W*.025,lx=align==='center'?x-lw/2:align==='right'?x-lw:x;
  ctx.fillStyle='rgba(255,255,255,.65)';ctx.fillRect(lx,y,lw,sh);
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(lx+lw*.12,y+sh*1.6,lw*.76,sh*.75);
}

/* ═══ BG STYLES ═══ */
const BG_STYLES=[
  {id:'grad-diag',name:'グラデ斜め',desc:'定番の斜めグラデ',
   mini:(c,W,H)=>{drawGrad(c,W,H,'#0A84FF','#5AC8FA',135);},
   draw:(c,W,H,s)=>{drawGrad(c,W,H,s.bgColor1||'#0A84FF',s.bgColor2||'#5AC8FA',135);}},
  {id:'grad-vert',name:'グラデ縦',desc:'上から下へのグラデ',
   mini:(c,W,H)=>{drawGrad(c,W,H,'#FF6B6B','#FFE66D',180);},
   draw:(c,W,H,s)=>{drawGrad(c,W,H,s.bgColor1||'#FF6B6B',s.bgColor2||'#FFE66D',180);}},
  {id:'solid',name:'単色',desc:'シンプルな単色背景',
   mini:(c,W,H)=>{c.fillStyle='#667EEA';c.fillRect(0,0,W,H);},
   draw:(c,W,H,s)=>{c.fillStyle=s.bgColor1||'#667EEA';c.fillRect(0,0,W,H);}},
  {id:'split',name:'上下スプリット',desc:'上半分と下半分で別の色',
   mini:(c,W,H)=>{c.fillStyle='#667EEA';c.fillRect(0,0,W,H*.5);c.fillStyle='#eef0ff';c.fillRect(0,H*.5,W,H*.5);},
   draw:(c,W,H,s)=>{c.fillStyle=s.bgColor1||'#667EEA';c.fillRect(0,0,W,H*.5);c.fillStyle=s.bgColor2||'#eef0ff';c.fillRect(0,H*.5,W,H*.5);}},
  {id:'white-accent',name:'ホワイト+アクセント',desc:'白背景に丸いアクセント',
   mini:(c,W,H)=>{c.fillStyle='#fff';c.fillRect(0,0,W,H);c.save();c.globalAlpha=.15;c.fillStyle='#FF9F0A';c.beginPath();c.ellipse(W*.95,H*.7,W*.65,W*.65,0,0,Math.PI*2);c.fill();c.restore();},
   draw:(c,W,H,s)=>{c.fillStyle='#fff';c.fillRect(0,0,W,H);const ac=s.accentColor||'#FF9F0A';c.save();c.globalAlpha=.13;c.fillStyle=ac;c.beginPath();c.ellipse(W*1.08,H*.7,W*.85,W*.85,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(-W*.08,H*.88,W*.65,W*.65,0,0,Math.PI*2);c.fill();c.restore();}},
  {id:'dark',name:'ダーク',desc:'深みある暗背景+グロウ',
   mini:(c,W,H)=>{drawGrad(c,W,H,'#0a0a1a','#1a0830',135);const g=c.createRadialGradient(W/2,H*.5,0,W/2,H*.5,W*.6);g.addColorStop(0,'rgba(120,80,255,.25)');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,W,H);},
   draw:(c,W,H,s)=>{drawGrad(c,W,H,s.bgColor1||'#0a0a1a',s.bgColor2||'#1a0830',135);const ac=s.accentColor||'#7B5FF2';const g=c.createRadialGradient(W/2,H*.48,0,W/2,H*.48,W*.72);g.addColorStop(0,ha(ac,.28));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);}},
];

/* ═══ PHONE LAYOUTS ═══ */
function miniBase(c,W,H){drawGrad(c,W,H,'#1c2d50','#263660',135);}

/* Device aspect ratio from current selection */
function getDeviceAR(){return DEVS[curDev].h/DEVS[curDev].w;}

const PHONE_LAYOUTS=[

  // 1. テキスト上：テキスト上部20%、iPhoneが画面の大部分を占める
  {id:'text-top',name:'テキスト上',desc:'テキストが上、iPhoneが下',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.06,'center',W);
     const pw=W*.62,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.25,pw,ph);
   },
   zone:(W,H,s)=>{
     const pw=W*.72,ph=pw*getDeviceAR();
     return{tx:W/2,ty:H*.06+getTextOffsetY(s)*H*.002,ta:'center',
            px:(W-pw)/2,py:H*.26,pw,ph};
   }},

  // 2. テキスト下：iPhoneが上部70%、テキストが下
  {id:'text-bottom',name:'テキスト下',desc:'iPhoneが上、テキストが下',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     const pw=W*.62,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.02,pw,ph);
     miniTextLines(c,W/2,H*.82,'center',W);
   },
   zone:(W,H,s)=>{
     const pw=W*.70,ph=pw*getDeviceAR(),py=H*.03;
     return{tx:W/2,ty:py+ph+H*.025+getTextOffsetY(s)*H*.002,
            ta:'center',px:(W-pw)/2,py,pw,ph};
   }},

  // 3. フルスクリーン↓：iPhone全面、テキストを下部に重ねる
  {id:'center-large',name:'フルスクリーン↓',desc:'大きなiPhone、テキストを下に重ねる',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     const pw=W*.76,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.02,pw,ph);
     const ov=c.createLinearGradient(0,H*.62,0,H);
     ov.addColorStop(0,'rgba(0,0,0,0)');ov.addColorStop(1,'rgba(0,0,0,.88)');
     c.fillStyle=ov;c.fillRect(0,H*.62,W,H*.38);
     miniTextLines(c,W/2,H*.82,'center',W*.85);
   },
   zone:(W,H,s)=>{
     const pw=W*.84,ph=pw*getDeviceAR();
     return{tx:W/2,ty:H*.79+getTextOffsetY(s)*H*.002,ta:'center',
            px:(W-pw)/2,py:H*.02,pw,ph,overlay:'bottom'};
   }},

  // 4. フルスクリーン↑：iPhone全面、テキストを上部に重ねる
  {id:'center-large-top',name:'フルスクリーン↑',desc:'大きなiPhone、テキストを上に重ねる',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     const pw=W*.76,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.15,pw,ph);
     const ov=c.createLinearGradient(0,0,0,H*.40);
     ov.addColorStop(0,'rgba(0,0,0,.88)');ov.addColorStop(1,'rgba(0,0,0,0)');
     c.fillStyle=ov;c.fillRect(0,0,W,H*.40);
     miniTextLines(c,W/2,H*.08,'center',W*.85);
   },
   zone:(W,H,s)=>{
     const pw=W*.84,ph=pw*getDeviceAR();
     return{tx:W/2,ty:H*.07+getTextOffsetY(s)*H*.002,ta:'center',
            px:(W-pw)/2,py:H*.15,pw,ph,overlay:'top'};
   }},

  // 5. 全面スクショ↓：スクショが全画面、テキスト下部オーバーレイ
  {id:'screen-fill',name:'全面スクショ↓',desc:'スクショを全画面、テキストを下に重ねる',
   mini:(c,W,H)=>{
     c.clearRect(0,0,W,H);
     c.fillStyle='#2255aa';c.fillRect(0,0,W,H);
     const ov=c.createLinearGradient(0,H*.45,0,H);
     ov.addColorStop(0,'rgba(0,0,0,0)');ov.addColorStop(.6,'rgba(0,0,0,.75)');ov.addColorStop(1,'rgba(0,0,0,.95)');
     c.fillStyle=ov;c.fillRect(0,H*.45,W,H*.55);
     // テキストライン（白・はっきり）
     const lw=W*.55,lx=(W-lw)/2;
     c.fillStyle='rgba(255,255,255,.90)';c.fillRect(lx,H*.72,lw,W*.028);
     c.fillStyle='rgba(255,255,255,.65)';c.fillRect(lx+lw*.1,H*.72+W*.044,lw*.75,W*.022);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.77+getTextOffsetY(s)*H*.002,ta:'center',
     px:0,py:0,pw:W,ph:H,screenFill:'bottom'})},

  // 6. 全面スクショ↑：スクショが全画面、テキスト上部オーバーレイ
  {id:'screen-fill-top',name:'全面スクショ↑',desc:'スクショを全画面、テキストを上に重ねる',
   mini:(c,W,H)=>{
     c.clearRect(0,0,W,H);
     c.fillStyle='#2255aa';c.fillRect(0,0,W,H);
     const ov=c.createLinearGradient(0,0,0,H*.55);
     ov.addColorStop(0,'rgba(0,0,0,.95)');ov.addColorStop(.6,'rgba(0,0,0,.75)');ov.addColorStop(1,'rgba(0,0,0,0)');
     c.fillStyle=ov;c.fillRect(0,0,W,H*.55);
     const lw=W*.55,lx=(W-lw)/2;
     c.fillStyle='rgba(255,255,255,.90)';c.fillRect(lx,H*.10,lw,W*.028);
     c.fillStyle='rgba(255,255,255,.65)';c.fillRect(lx+lw*.1,H*.10+W*.044,lw*.75,W*.022);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.09+getTextOffsetY(s)*H*.002,ta:'center',
     px:0,py:0,pw:W,ph:H,screenFill:'top'})},

  // 7. 傾き：大きなiPhoneをダイナミックに傾ける
  {id:'tilted',name:'傾き',desc:'傾きをスライダーで調整',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.06,'center',W);
     const pw=W*.58,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.28,pw,ph,undefined,undefined,10*Math.PI/180);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.06+getTextOffsetY(s)*H*.002,ta:'center',
     px:(W-W*.68)/2,py:H*.28,pw:W*.68,ph:W*.68*getDeviceAR()})},

  // 8. ウィジェット紹介：ウィジェット画像を小中大で並べて表示
  {id:'widget-showcase',name:'ウィジェット紹介',desc:'小・中・大ウィジェットを並べて紹介',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.06,'center',W);
     // Large widget
     const lw=W*.78,lh=lw*.52,lx=(W-lw)/2;
     rr(c,lx,H*.22,lw,lh,W*.04);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     c.fillStyle='rgba(255,255,255,.2)';c.font=`${W*.06}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('Large',lx+lw/2,H*.22+lh/2);
     // Medium widget
     const mw=W*.52,mh=mw*.52;
     rr(c,W*.06,H*.56,mw,mh,W*.03);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     c.fillStyle='rgba(255,255,255,.2)';c.font=`${W*.05}px sans-serif`;c.fillText('Medium',W*.06+mw/2,H*.56+mh/2);
     // Small widget
     const sw2=W*.34,sh2=sw2;
     rr(c,W*.62,H*.56,sw2,sh2,W*.03);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     c.fillStyle='rgba(255,255,255,.2)';c.font=`${W*.05}px sans-serif`;c.fillText('Small',W*.62+sw2/2,H*.56+sh2/2);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.05+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,widgetShowcase:true})},

  // 9. ウィジェット+iPhone：左にiPhone、右にウィジェット群
  {id:'widget-phone',name:'ウィジェット+iPhone',desc:'iPhoneとウィジェットを同時にアピール',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.05,'center',W);
     const pw=W*.42,ph=pw*getDeviceAR();
     miniPhone(c,W*.04,H*.22,pw,ph);
     // Widgets on the right
     const wx=W*.54,ww=W*.42;
     rr(c,wx,H*.24,ww,ww*.52,W*.02);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     rr(c,wx,H*.24+ww*.58,ww,ww*.52,W*.02);c.fillStyle='rgba(60,100,200,.35)';c.fill();
   },
   zone:(W,H,s)=>{
     const pw=W*.48,ph=pw*getDeviceAR();
     return{tx:W/2,ty:H*.05+getTextOffsetY(s)*H*.002,ta:'center',
            px:W*.02,py:H*.22,pw,ph,widgetPhone:true};
   }},

  // 10. テーマ比較：2台のiPhoneを左右に並べて比較
  {id:'theme-compare',name:'テーマ比較',desc:'ライト/ダーク等を左右に並べて比較',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.05,'center',W);
     const pw=W*.38,ph=pw*getDeviceAR();
     miniPhone(c,W*.06,H*.22,pw,ph);
     miniPhone(c,W*.56,H*.22,pw,ph);
     // Labels
     c.fillStyle='rgba(255,255,255,.5)';c.font=`${W*.06}px sans-serif`;c.textAlign='center';
     c.fillText('Light',W*.06+pw/2,H*.20);
     c.fillText('Dark',W*.56+pw/2,H*.20);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,themeCompare:true})},

  // 11. テーマ一覧：2×2グリッドでスクショを4枚表示
  {id:'theme-grid',name:'テーマ一覧',desc:'4枚のスクショをグリッドで表示',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.06,'center',W);
     const gw=W*.43,gh=gw*.65,gap=W*.04;
     [[W*.05,H*.24],[W*.52,H*.24],[W*.05,H*.57],[W*.52,H*.57]].forEach(([x,y])=>{
       rr(c,x,y,gw,gh,W*.03);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     });
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,themeGrid:true})},

  // 12. マルチデバイス：iPhone + iPad + ウィジェットを1枚に
  {id:'multi-device',name:'マルチデバイス',desc:'iPhone・iPad・ウィジェットを1枚に',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.05,'center',W);
     // iPad (back, black frame)
     const ipadW=W*.44,ipadH=ipadW*.75;
     rr(c,W*.44,H*.22,ipadW,ipadH,W*.03);c.fillStyle='rgba(20,20,20,.9)';c.fill();
     rr(c,W*.46,H*.24,ipadW-.04*W,ipadH-.04*W,W*.02);c.fillStyle='rgba(40,60,120,.4)';c.fill();
     // iPhone (front, larger)
     const pw=W*.42,ph=pw*getDeviceAR();
     miniPhone(c,W*.04,H*.24,pw,ph);
     // Apple Watch
     const awW=W*.2,awH=awW*1.22;
     rr(c,W*.58,H*.66,awW,awH,awW*.25);c.fillStyle='rgba(20,20,20,.9)';c.fill();
     rr(c,W*.6,H*.68,awW-.04*W,awH-.04*W,awW*.2);c.fillStyle='rgba(60,100,200,.35)';c.fill();
   },
   zone:(W,H,s)=>{
     const pw=W*.44,ph=pw*getDeviceAR();
     return{tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
            px:W*.04,py:H*.30,pw,ph,multiDevice:true};
   }},

  // 13. テキスト強調：テキストが主役、小さなiPhoneがアクセント
  {id:'text-hero',name:'テキスト強調',desc:'テキストが主役、iPhoneはアクセント',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     const lw=W*.82,lx=(W-lw)/2;
     c.fillStyle='rgba(255,255,255,.85)';c.fillRect(lx,H*.08,lw,W*.042);
     c.fillStyle='rgba(255,255,255,.7)' ;c.fillRect(lx+lw*.05,H*.08+W*.065,lw*.9,W*.034);
     c.fillStyle='rgba(255,255,255,.45)';c.fillRect(lx+lw*.1,H*.08+W*.118,lw*.7,W*.026);
     const pw=W*.62,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.36,pw,ph);
   },
   zone:(W,H,s)=>{
     const pw=W*.78,ph=pw*getDeviceAR();
     return{tx:W/2,ty:H*.08+getTextOffsetY(s)*H*.002,ta:'center',
            px:(W-pw)/2,py:H*.36,pw,ph,heroText:true};
   }},

  // 9. 機能リスト：タイトル＋アイコン付き箇条書き
  {id:'feature-list',name:'機能リスト',desc:'アイコン＋テキストの箇条書き風',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.07,'center',W*.82);
     [[H*.21],[H*.32],[H*.43],[H*.54],[H*.65]].forEach(([y])=>{
       c.fillStyle='rgba(255,255,255,.55)';
       c.beginPath();c.arc(W*.12,y,W*.038,0,Math.PI*2);c.fill();
       c.fillStyle='rgba(255,255,255,.55)';c.fillRect(W*.21,y-W*.013,W*.62,W*.022);
       c.fillStyle='rgba(255,255,255,.28)';c.fillRect(W*.21,y+W*.018,W*.46,W*.016);
     });
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.06+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,featureList:true})},
];


/* ═══ EFFECTS ═══ */
const EFFECTS=[
  {id:'glow',name:'グロウ',desc:'テキストに光る発光エフェクト',icon:'✨'},
  {id:'badge',name:'ピル型バッジ',desc:'キャッチコピーをバッジで表示',icon:'🏷️'},
  {id:'emoji',name:'絵文字アイコン',desc:'タイトルの上に大きな絵文字',icon:'😊'},
  {id:'deco',name:'デコシェイプ',desc:'背景に装飾の丸や図形を追加',icon:'🔮'},
];

/* ═══ STATE ═══ */
const PRESETS=['#0A84FF','#30D158','#FF453A','#FF9F0A','#BF5AF2','#FF375F','#5AC8FA','#667EEA','#FFFFFF','#1a1a2e'];

function defSlide(){
  return{
    bgStyle:'grad-diag',phoneLayout:'text-top',effects:['glow'],
    bgColor1:'#0A84FF',bgColor2:'#5AC8FA',accentColor:'#FF9F0A',
    title:'あなたのアプリ名',titleColor:'#FFFFFF',
    subtitle:'ここにキャッチコピーが入ります',subColor:'#FFFFFF',
    iconEmoji:'📱',
    badgeText:'NEW',badgeColor:'#FFFFFF',badgeTextColor:'#1a4a00',
    screenshotImg:null,_src:'',
    screenshotImg2:null,_src2:'',
    screenshotImg3:null,_src3:'',
    screenshotImg4:null,_src4:'',
    screenshotImgIpad:null,_srcIpad:'',
    widgetSmallImg:null,_srcWidgetSmall:'',
    widgetMediumImg:null,_srcWidgetMedium:'',
    widgetLargeImg:null,_srcWidgetLarge:'',
    themeLabel1:'Light',themeLabel2:'Dark',
    frameColor:'black',
    fontId:'noto',fontWeight:'900',
    titleSize:100,textOffsetY:0,titleSizeIpad:100,textOffsetYIpad:0,phoneTilt:10,
    grain:0,
    textEffect:'none',
    textShadowColor:'#000000',textShadowSize:12,
    textStrokeColor:'#000000',textStrokeSize:4,
    featureItems:'✨ かんたん操作\n📊 データを見える化\n🔔 通知でお知らせ\n🎨 自由にカスタマイズ',
    screenshotScale:100,screenshotOffsetX:0,screenshotOffsetY:0,
  };
}

let slides=[defSlide()],curSlide=0,inStep=1;

/* ═══ SERIALIZE / DESERIALIZE ═══ */
function serializeSlides(){
  return JSON.stringify(slides.map(s=>{
    const {screenshotImg,screenshotImg2,screenshotImg3,screenshotImg4,screenshotImgIpad,widgetSmallImg,widgetMediumImg,widgetLargeImg,...rest}=s;
    return rest;
  }));
}
function deserializeSlides(json){
  const arr=JSON.parse(json);
  slides=arr.map(d=>{
    const s={...defSlide(),...d,screenshotImg:null,screenshotImg2:null,screenshotImg3:null,screenshotImg4:null,screenshotImgIpad:null,widgetSmallImg:null,widgetMediumImg:null,widgetLargeImg:null};
    if(s._src){const img=new Image();img.onload=()=>{s.screenshotImg=img;render();};img.src=s._src;}
    if(s._src2){const img=new Image();img.onload=()=>{s.screenshotImg2=img;render();};img.src=s._src2;}
    if(s._src3){const img=new Image();img.onload=()=>{s.screenshotImg3=img;render();};img.src=s._src3;}
    if(s._src4){const img=new Image();img.onload=()=>{s.screenshotImg4=img;render();};img.src=s._src4;}
    if(s._srcIpad){const img=new Image();img.onload=()=>{s.screenshotImgIpad=img;render();};img.src=s._srcIpad;}
    if(s._srcWidgetSmall){const img=new Image();img.onload=()=>{s.widgetSmallImg=img;render();};img.src=s._srcWidgetSmall;}
    if(s._srcWidgetMedium){const img=new Image();img.onload=()=>{s.widgetMediumImg=img;render();};img.src=s._srcWidgetMedium;}
    if(s._srcWidgetLarge){const img=new Image();img.onload=()=>{s.widgetLargeImg=img;render();};img.src=s._srcWidgetLarge;}
    return s;
  });
  if(curSlide>=slides.length)curSlide=0;
  if(inStep===2){buildFields();renderThumbs();}
  render();
}

/* ═══ PROJECT SAVE / LOAD (file) ═══ */
function saveProject(){
  const json=serializeSlides();
  const blob=new Blob([json],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  const name=currentProjectId?getProjectMeta(currentProjectId).name:'preview-project';
  a.download=`${name}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  showToast('JSONファイルを保存しました 📥');
}
function loadProject(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      pushUndo();
      deserializeSlides(ev.target.result);
      if(currentProjectId) saveProjectToStorage();
      showToast('プロジェクトを読み込みました 📂');
    }catch(err){showToast('読み込みに失敗しました');}
  };
  reader.readAsText(file);
  e.target.value='';
}

/* ═══ PROJECT MANAGEMENT (localStorage) ═══ */
const PROJECTS_KEY='previewgen_projects';
const PROJECT_PREFIX='previewgen_proj_';
let currentProjectId=null;
let inDashboard=true;

function getProjectsList(){
  try{return JSON.parse(localStorage.getItem(PROJECTS_KEY)||'[]');}
  catch{return [];}
}
function saveProjectsList(list){
  localStorage.setItem(PROJECTS_KEY,JSON.stringify(list));
}
function getProjectMeta(id){
  return getProjectsList().find(p=>p.id===id)||null;
}
function getProjectData(id){
  try{return localStorage.getItem(PROJECT_PREFIX+id)||null;}
  catch{return null;}
}
function setProjectData(id,json){
  localStorage.setItem(PROJECT_PREFIX+id,json);
}
function removeProjectData(id){
  localStorage.removeItem(PROJECT_PREFIX+id);
}

function generateId(){
  return Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
}

function createNewProject(name){
  const id=generateId();
  const now=new Date().toISOString();
  const pName=name||'新しいプロジェクト';
  const list=getProjectsList();
  list.unshift({id,name:pName,createdAt:now,updatedAt:now,slideCount:1});
  saveProjectsList(list);
  // Initialize with default slide
  slides=[defSlide()];curSlide=0;inStep=1;undoStack=[];
  setProjectData(id,serializeSlides());
  openProject(id);
}

function openProject(id){
  const data=getProjectData(id);
  if(!data){showToast('プロジェクトデータが見つかりません');return;}
  currentProjectId=id;
  undoStack=[];updateUndoBtn();
  deserializeSlides(data);
  inStep=1;
  showEditor();
}

function saveProjectToStorage(){
  if(!currentProjectId)return;
  const json=serializeSlides();
  setProjectData(currentProjectId,json);
  // Update meta
  const list=getProjectsList();
  const p=list.find(p=>p.id===currentProjectId);
  if(p){
    p.updatedAt=new Date().toISOString();
    p.slideCount=slides.length;
    saveProjectsList(list);
  }
  showToast('保存しました 💾');
}

// Auto-save on changes (debounced)
let _autoSaveTimer=null;
function autoSave(){
  if(!currentProjectId||inDashboard)return;
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer=setTimeout(()=>{
    if(!currentProjectId)return;
    const json=serializeSlides();
    setProjectData(currentProjectId,json);
    const list=getProjectsList();
    const p=list.find(p=>p.id===currentProjectId);
    if(p){p.updatedAt=new Date().toISOString();p.slideCount=slides.length;saveProjectsList(list);}
  },2000);
}

function deleteProject(id,ev){
  if(ev){ev.stopPropagation();}
  if(!confirm('このプロジェクトを削除しますか？'))return;
  let list=getProjectsList();
  list=list.filter(p=>p.id!==id);
  saveProjectsList(list);
  removeProjectData(id);
  if(currentProjectId===id){currentProjectId=null;}
  renderDashboard();
  showToast('プロジェクトを削除しました');
}

function duplicateProject(id,ev){
  if(ev){ev.stopPropagation();}
  const meta=getProjectMeta(id);
  const data=getProjectData(id);
  if(!meta||!data)return;
  const newId=generateId();
  const now=new Date().toISOString();
  const list=getProjectsList();
  list.unshift({id:newId,name:meta.name+' (コピー)',createdAt:now,updatedAt:now,slideCount:meta.slideCount||1});
  saveProjectsList(list);
  setProjectData(newId,data);
  renderDashboard();
  showToast('プロジェクトを複製しました');
}

function exportProjectJson(id,ev){
  if(ev){ev.stopPropagation();}
  const meta=getProjectMeta(id);
  const data=getProjectData(id);
  if(!data)return;
  const blob=new Blob([data],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`${meta?meta.name:'project'}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  showToast('JSONファイルを保存しました 📥');
}

function importProjectFromFile(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const arr=JSON.parse(ev.target.result);
      if(!Array.isArray(arr)){showToast('無効なファイル形式です');return;}
      const id=generateId();
      const now=new Date().toISOString();
      const name=file.name.replace(/\.json$/i,'').replace(/-\d{4}-\d{2}-\d{2}$/,'');
      const list=getProjectsList();
      list.unshift({id,name,createdAt:now,updatedAt:now,slideCount:arr.length});
      saveProjectsList(list);
      setProjectData(id,ev.target.result);
      renderDashboard();
      showToast('プロジェクトを読み込みました 📂');
    }catch(err){showToast('読み込みに失敗しました');}
  };
  reader.readAsText(file);
  e.target.value='';
}

function renameProject(id,ev){
  if(ev){ev.stopPropagation();}
  const nameEl=document.querySelector(`.dash-card[data-id="${id}"] .dash-card-name`);
  if(!nameEl)return;
  const meta=getProjectMeta(id);
  if(!meta)return;
  const input=document.createElement('input');
  input.className='dash-card-name-input';
  input.value=meta.name;
  input.onclick=e=>e.stopPropagation();
  const finish=()=>{
    const newName=input.value.trim()||meta.name;
    const list=getProjectsList();
    const p=list.find(p=>p.id===id);
    if(p){p.name=newName;saveProjectsList(list);}
    renderDashboard();
  };
  input.onblur=finish;
  input.onkeydown=e=>{if(e.key==='Enter')input.blur();if(e.key==='Escape'){input.value=meta.name;input.blur();}};
  nameEl.replaceWith(input);
  input.focus();input.select();
}

function showDashboard(){
  // Auto-save current project before leaving
  if(currentProjectId&&!inDashboard){
    const json=serializeSlides();
    setProjectData(currentProjectId,json);
    const list=getProjectsList();
    const p=list.find(p=>p.id===currentProjectId);
    if(p){p.updatedAt=new Date().toISOString();p.slideCount=slides.length;saveProjectsList(list);}
  }
  inDashboard=true;
  document.getElementById('dashboard').style.display='flex';
  document.getElementById('editor-wrapper').style.display='none';
  document.getElementById('editor-header-controls').style.display='none';
  document.getElementById('editor-header-btns').style.display='none';
  const pna=document.getElementById('proj-name-area');if(pna)pna.style.display='none';
  const nav=document.getElementById('iphone-nav');
  if(nav)nav.style.display='none';
  renderDashboard();
}

function showEditor(){
  inDashboard=false;
  document.getElementById('dashboard').style.display='none';
  document.getElementById('editor-wrapper').style.display='flex';
  document.getElementById('editor-header-controls').style.display='';
  document.getElementById('editor-header-btns').style.display='';
  updateProjNameDisplay();
  initAllCanvas();
  goStep(1);
  render();
  // Re-apply iPhone layout
  const nav=document.getElementById('iphone-nav');
  if(nav&&isIphone())nav.style.display='flex';
}

function updateProjNameDisplay(){
  const area=document.getElementById('proj-name-area');
  const el=document.getElementById('proj-name-display');
  if(!area||!el)return;
  if(!currentProjectId){area.style.display='none';return;}
  const meta=getProjectMeta(currentProjectId);
  if(!meta){area.style.display='none';return;}
  area.style.display='flex';
  el.textContent=meta.name||'無題';
  el.ondblclick=startEditProjName;
  el.onclick=startEditProjName;
}

function startEditProjName(){
  const el=document.getElementById('proj-name-display');
  if(!el||!currentProjectId)return;
  const meta=getProjectMeta(currentProjectId);
  if(!meta)return;
  const input=document.createElement('input');
  input.className='proj-name-input';
  input.value=meta.name;
  const finish=()=>{
    const newName=input.value.trim()||meta.name;
    const list=getProjectsList();
    const p=list.find(p=>p.id===currentProjectId);
    if(p){p.name=newName;saveProjectsList(list);}
    const span=document.createElement('span');
    span.className='proj-name';
    span.id='proj-name-display';
    span.title='ダブルクリックで名前を変更';
    input.replaceWith(span);
    updateProjNameDisplay();
  };
  input.onblur=finish;
  input.onkeydown=e=>{if(e.key==='Enter')input.blur();if(e.key==='Escape'){input.value=meta.name;input.blur();}};
  el.replaceWith(input);
  input.focus();input.select();
}

function renderDashboard(){
  const list=getProjectsList();
  const grid=document.getElementById('dash-grid');
  const empty=document.getElementById('dash-empty');
  if(!list.length){
    grid.style.display='none';
    empty.style.display='flex';
    return;
  }
  grid.style.display='grid';
  empty.style.display='none';
  grid.innerHTML='';

  list.forEach(meta=>{
    const card=document.createElement('div');
    card.className='dash-card';
    card.dataset.id=meta.id;
    card.onclick=()=>openProject(meta.id);

    // Thumbnail area
    const thumbs=document.createElement('div');
    thumbs.className='dash-card-thumbs';
    // Try rendering thumbnails from stored data
    const data=getProjectData(meta.id);
    if(data){
      try{
        const arr=JSON.parse(data);
        const dev=DEVS['6.9'];
        const maxThumbs=Math.min(arr.length,4);
        for(let i=0;i<maxThumbs;i++){
          const s={...defSlide(),...arr[i],screenshotImg:null,screenshotImg2:null,screenshotImg3:null,screenshotImg4:null,screenshotImgIpad:null,widgetSmallImg:null,widgetMediumImg:null,widgetLargeImg:null};
          const tc=document.createElement('canvas');
          const tw=100;
          tc.width=tw;tc.height=Math.round(tw*dev.h/dev.w);
          renderSlide(tc.getContext('2d'),tc.width,tc.height,s);
          thumbs.appendChild(tc);
        }
      }catch(e){}
    }

    // Actions (overlay)
    const actions=document.createElement('div');
    actions.className='dash-card-actions';
    actions.innerHTML=`
      <button class="dash-card-btn dash-card-btn-dup" onclick="duplicateProject('${meta.id}',event)" title="複製">⧉</button>
      <button class="dash-card-btn dash-card-btn-export" onclick="exportProjectJson('${meta.id}',event)" title="JSON書き出し">↓</button>
      <button class="dash-card-btn dash-card-btn-del" onclick="deleteProject('${meta.id}',event)" title="削除">✕</button>
    `;

    // Info
    const info=document.createElement('div');
    info.className='dash-card-info';
    const nameEl=document.createElement('div');
    nameEl.className='dash-card-name';
    nameEl.textContent=meta.name||'無題';
    nameEl.ondblclick=e=>renameProject(meta.id,e);
    const metaEl=document.createElement('div');
    metaEl.className='dash-card-meta';
    const slideCount=meta.slideCount||1;
    const updated=meta.updatedAt?formatDate(meta.updatedAt):'';
    metaEl.innerHTML=`<span>${slideCount}枚のスライド</span><span>${updated}</span>`;
    info.appendChild(nameEl);
    info.appendChild(metaEl);

    card.appendChild(thumbs);
    card.appendChild(actions);
    card.appendChild(info);
    grid.appendChild(card);
  });
}

function formatDate(iso){
  try{
    const d=new Date(iso);
    const now=new Date();
    const diff=now-d;
    if(diff<60000)return 'たった今';
    if(diff<3600000)return Math.floor(diff/60000)+'分前';
    if(diff<86400000)return Math.floor(diff/3600000)+'時間前';
    if(diff<604800000)return Math.floor(diff/86400000)+'日前';
    return `${d.getMonth()+1}/${d.getDate()}`;
  }catch{return '';}
}


/* ═══ RENDER ═══ */
function getFontCss(s){
  const f=FONTS.find(f=>f.id===(s.fontId||'noto'))||FONTS[0];
  const w=s.fontWeight||'900';
  return{css:f.css,weight:f.weights.includes(w)?w:f.weights[f.weights.length-1]};
}

function renderSlide(ctx,W,H,s){
  ctx.clearRect(0,0,W,H);
  const bg=BG_STYLES.find(b=>b.id===s.bgStyle)||BG_STYLES[0];
  bg.draw(ctx,W,H,s);
  // Grain
  if((s.grain||0)>0)drawGrain(ctx,W,H,s.grain);
  // Deco shapes
  if(s.effects.includes('deco')){
    const ac=s.accentColor||'#667EEA';
    ctx.save();ctx.globalAlpha=.12;ctx.fillStyle=ac;
    ctx.beginPath();ctx.ellipse(W*.85,H*.2,W*.45,W*.45,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(W*.1,H*.65,W*.3,W*.3,0,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=.07;ctx.beginPath();ctx.ellipse(W*.5,H*.85,W*.6,W*.6,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  const lo=PHONE_LAYOUTS.find(l=>l.id===s.phoneLayout)||PHONE_LAYOUTS[0];
  const z=lo.zone(W,H,s);

  // text-bottom: phone drawn first (above), text below
  if(s.phoneLayout==='text-bottom') drawPhoneAtZone(ctx,z,s);

  // center-large: phone first, then dark overlay (top or bottom), text on top
  if(s.phoneLayout==='center-large'||s.phoneLayout==='center-large-top'){
    drawPhoneAtZone(ctx,z,s);
    if(z.overlay==='bottom'){
      const ov=ctx.createLinearGradient(0,H*.60,0,H*.99);
      ov.addColorStop(0,'rgba(0,0,0,0)');ov.addColorStop(.35,'rgba(0,0,0,.75)');ov.addColorStop(1,'rgba(0,0,0,.95)');
      ctx.fillStyle=ov;ctx.fillRect(0,H*.60,W,H*.40);
    } else {
      const ov=ctx.createLinearGradient(0,0,0,H*.42);
      ov.addColorStop(0,'rgba(0,0,0,.92)');ov.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ov;ctx.fillRect(0,0,W,H*.42);
    }
  }

  // screen-fill: full-bleed screenshot + overlay (top or bottom)
  if(s.phoneLayout==='screen-fill'||s.phoneLayout==='screen-fill-top'){
    ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
    if(getScreenshot(s)){drawImgCover(ctx,getScreenshot(s),0,0,W,H,s.screenshotScale,s.screenshotOffsetX,s.screenshotOffsetY);}
    else{ctx.fillStyle='rgba(30,60,130,.5)';ctx.fillRect(0,0,W,H);}
    ctx.restore();
    if(z.screenFill==='bottom'){
      const ov=ctx.createLinearGradient(0,H*.60,0,H);
      ov.addColorStop(0,'rgba(0,0,0,0)');ov.addColorStop(1,'rgba(0,0,0,.92)');
      ctx.fillStyle=ov;ctx.fillRect(0,H*.60,W,H*.40);
    } else {
      const ov=ctx.createLinearGradient(0,0,0,H*.42);
      ov.addColorStop(0,'rgba(0,0,0,.92)');ov.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ov;ctx.fillRect(0,0,W,H*.42);
    }
  }

  // card: rounded card housing the screenshot
  if(s.phoneLayout==='card'){
    const{px,py,pw,ph}=z;const cr=pw*.06;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=pw*.12;ctx.shadowOffsetY=pw*.07;
    rr(ctx,px,py,pw,ph,cr);ctx.fillStyle='rgba(20,40,100,.85)';ctx.fill();
    ctx.restore();
    ctx.save();rr(ctx,px,py,pw,ph,cr);ctx.clip();
    if(s.screenshotImg){drawImgCover(ctx,s.screenshotImg,px,py,pw,ph);}
    else{ctx.fillStyle='rgba(60,100,200,.35)';ctx.fillRect(px,py,pw,ph);}
    ctx.restore();
  }

  let ty=drawTextBlock(ctx,W,H,z,s);
  if(s.effects.includes('badge')&&s.badgeText){
    const{css,weight}=getFontCss(s);
    ctx.font=`${weight} ${W*.038}px ${css}`;
    const bh=W*.065,bw=Math.min(W*.75,ctx.measureText(s.badgeText).width+bh);
    const bx=z.ta==='left'?z.tx+bw/2:W/2;
    drawPill(ctx,bx,ty+bh*.6,bw,bh,s.badgeColor||'#fff',s.badgeTextColor||'#000',s.badgeText,W*.038);
    ty+=bh*1.6;
  }
  // feature-list: render icon+text rows - distribute evenly in remaining space
  if(s.phoneLayout==='feature-list'){
    const{css,weight}=getFontCss(s);const sizeScale=getTitleSize(s)/100;
    const items=(s.featureItems||'✓ 機能その1\n✓ 機能その2\n✓ 機能その3').split('\n').filter(Boolean).slice(0,5);
    const listTop=ty+H*.035;
    const listBottom=H*.94;
    const totalH=listBottom-listTop;
    const rowH=totalH/items.length;
    const iconR=Math.min(W*.052, rowH*.38);
    items.forEach((item,i)=>{
      const rowTop=listTop+i*rowH;
      const cy2=rowTop+rowH/2;
      const cx2=W*.1;
      // Icon circle
      ctx.beginPath();ctx.arc(cx2,cy2,iconR,0,Math.PI*2);
      ctx.fillStyle=ha(s.titleColor||'#fff',.2);ctx.fill();
      ctx.strokeStyle=ha(s.titleColor||'#fff',.5);ctx.lineWidth=1.5;ctx.stroke();
      // Emoji / first char
      const ico=item.match(/^(\p{Emoji}|\S)/u)?.[0]||'·';
      ctx.font=`${iconR*1.3}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=s.titleColor||'#fff';ctx.fillText(ico,cx2,cy2);
      // Text
      const txt=item.replace(/^(\p{Emoji}|\S)\s*/u,'');
      const fs=Math.min(W*.058,rowH*.38)*sizeScale;
      ctx.font=`${weight} ${fs}px ${css}`;ctx.textAlign='left';ctx.textBaseline='middle';
      ctx.fillStyle=s.titleColor||'#fff';ctx.shadowBlur=0;
      ctx.fillText(txt,W*.19,cy2,W*.76);
      // Divider
      if(i<items.length-1){
        ctx.strokeStyle=ha(s.titleColor||'#fff',.12);ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(W*.18,rowTop+rowH-.5);ctx.lineTo(W*.92,rowTop+rowH-.5);ctx.stroke();
      }
    });
  }

  // center-text: decorative lines above/below
  if(s.phoneLayout==='center-text'){
    ctx.save();ctx.strokeStyle=ha(s.titleColor||'#fff',.18);ctx.lineWidth=Math.max(1,W*.003);
    ctx.beginPath();ctx.moveTo(W*.15,H*.32);ctx.lineTo(W*.85,H*.32);ctx.stroke();
    ctx.beginPath();ctx.moveTo(W*.15,H*.72);ctx.lineTo(W*.85,H*.72);ctx.stroke();
    ctx.restore();
  }

  // before-after: two cards top/bottom
  if(s.phoneLayout==='before-after'){
    const cw=W*.88,ch=H*.36,cx=(W-cw)/2;const cr=cw*.04;
    // Top card
    ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=cw*.07;ctx.shadowOffsetY=cw*.04;
    rr(ctx,cx,H*.13,cw,ch,cr);ctx.fillStyle='rgba(20,40,100,.85)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,cx,H*.13,cw,ch,cr);ctx.clip();
    if(s.screenshotImg){drawImgCover(ctx,s.screenshotImg,cx,H*.13,cw,ch);}
    else{ctx.fillStyle='rgba(50,90,200,.4)';ctx.fillRect(cx,H*.13,cw,ch);
      ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.045}px -apple-system`;
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('スクショ 1',cx+cw/2,H*.13+ch/2);}
    ctx.restore();
    // Bottom card
    ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=cw*.07;ctx.shadowOffsetY=cw*.04;
    rr(ctx,cx,H*.53,cw,ch,cr);ctx.fillStyle='rgba(20,40,100,.85)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,cx,H*.53,cw,ch,cr);ctx.clip();
    if(s.screenshotImg2){drawImgCover(ctx,s.screenshotImg2,cx,H*.53,cw,ch);}
    else{ctx.fillStyle='rgba(70,50,200,.4)';ctx.fillRect(cx,H*.53,cw,ch);
      ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.045}px -apple-system`;
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('スクショ 2',cx+cw/2,H*.53+ch/2);}
    ctx.restore();
  }

  // widget-showcase: display small/medium/large widget images
  if(s.phoneLayout==='widget-showcase'){
    const sizeScale=getTitleSize(s)/100;
    const{css,weight}=getFontCss(s);
    const gap=W*.03;
    // Large widget
    const lw=W*.82,lh=lw*.48,lx=(W-lw)/2,lyBase=ty+H*.03;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=W*.04;ctx.shadowOffsetY=W*.02;
    rr(ctx,lx,lyBase,lw,lh,W*.04);ctx.fillStyle='rgba(40,60,120,.6)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,lx,lyBase,lw,lh,W*.04);ctx.clip();
    if(s.widgetLargeImg){drawImgCover(ctx,s.widgetLargeImg,lx,lyBase,lw,lh);}
    else{ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(lx,lyBase,lw,lh);ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.045}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Large Widget',lx+lw/2,lyBase+lh/2);}
    ctx.restore();
    ctx.fillStyle=ha(s.subColor||'#fff',.5);ctx.font=`600 ${W*.032*sizeScale}px ${css}`;ctx.textAlign='center';ctx.fillText('Large',lx+lw/2,lyBase+lh+W*.045);

    // Medium + Small row
    const row2y=lyBase+lh+W*.08;
    const mw=W*.52,mh=mw*.48;
    const sw2=W*.26,sh2=sw2;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=W*.03;ctx.shadowOffsetY=W*.015;
    rr(ctx,lx,row2y,mw,mh,W*.035);ctx.fillStyle='rgba(40,60,120,.6)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,lx,row2y,mw,mh,W*.035);ctx.clip();
    if(s.widgetMediumImg){drawImgCover(ctx,s.widgetMediumImg,lx,row2y,mw,mh);}
    else{ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(lx,row2y,mw,mh);ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.04}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Medium Widget',lx+mw/2,row2y+mh/2);}
    ctx.restore();
    ctx.fillStyle=ha(s.subColor||'#fff',.5);ctx.font=`600 ${W*.032*sizeScale}px ${css}`;ctx.textAlign='center';ctx.fillText('Medium',lx+mw/2,row2y+mh+W*.045);

    const sx2=lx+mw+gap;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=W*.03;ctx.shadowOffsetY=W*.015;
    rr(ctx,sx2,row2y,sw2,sh2,W*.035);ctx.fillStyle='rgba(40,60,120,.6)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,sx2,row2y,sw2,sh2,W*.035);ctx.clip();
    if(s.widgetSmallImg){drawImgCover(ctx,s.widgetSmallImg,sx2,row2y,sw2,sh2);}
    else{ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(sx2,row2y,sw2,sh2);ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.035}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Small',sx2+sw2/2,row2y+sh2/2);}
    ctx.restore();
    ctx.fillStyle=ha(s.subColor||'#fff',.5);ctx.font=`600 ${W*.032*sizeScale}px ${css}`;ctx.textAlign='center';ctx.fillText('Small',sx2+sw2/2,row2y+sh2+W*.045);
  }

  // widget-phone: iPhone on the left, widgets on the right
  if(s.phoneLayout==='widget-phone'){
    drawPhoneAtZone(ctx,z,s);
    const{css,weight}=getFontCss(s);const sizeScale=getTitleSize(s)/100;
    const wx=z.px+z.pw+W*.03,ww=W-(wx+W*.04);
    // Medium widget
    const mh=ww*.48,my=z.py+z.ph*.08;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=W*.03;ctx.shadowOffsetY=W*.015;
    rr(ctx,wx,my,ww,mh,W*.03);ctx.fillStyle='rgba(40,60,120,.6)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,wx,my,ww,mh,W*.03);ctx.clip();
    if(s.widgetMediumImg){drawImgCover(ctx,s.widgetMediumImg,wx,my,ww,mh);}
    else{ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(wx,my,ww,mh);ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.035}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Medium',wx+ww/2,my+mh/2);}
    ctx.restore();
    // Small widget
    const sh3=ww*.7,sy=my+mh+W*.03;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=W*.03;ctx.shadowOffsetY=W*.015;
    rr(ctx,wx,sy,ww,sh3,W*.03);ctx.fillStyle='rgba(40,60,120,.6)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,wx,sy,ww,sh3,W*.03);ctx.clip();
    if(s.widgetSmallImg){drawImgCover(ctx,s.widgetSmallImg,wx,sy,ww,sh3);}
    else{ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(wx,sy,ww,sh3);ctx.fillStyle='rgba(255,255,255,.2)';ctx.font=`${W*.035}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Small',wx+ww/2,sy+sh3/2);}
    ctx.restore();
  }

  // theme-compare: two iPhones side by side with labels
  if(s.phoneLayout==='theme-compare'){
    const{css,weight}=getFontCss(s);const sizeScale=getTitleSize(s)/100;
    const gap=W*.04,pw2=W*.44,ph2=pw2*getDeviceAR();
    const lx=W/2-gap/2-pw2,rx=W/2+gap/2;
    const py2=ty+H*.025;
    // Draw labels
    const lblFs=W*.038*sizeScale;
    ctx.font=`${weight} ${lblFs}px ${css}`;ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle=ha(s.subColor||'#fff',.7);
    ctx.fillText(s.themeLabel1||'Light',lx+pw2/2,py2-W*.012);
    ctx.fillText(s.themeLabel2||'Dark',rx+pw2/2,py2-W*.012);
    // Phone 1 (left)
    const s1Copy={...s};
    drawPhone(ctx,lx,py2,pw2,ph2,s1Copy);
    // Phone 2 (right) — uses screenshotImg2
    const s2Copy={...s,screenshotImg:s.screenshotImg2,screenshotImgIpad:s.screenshotImg2};
    drawPhone(ctx,rx,py2,pw2,ph2,s2Copy);
  }

  // theme-grid: 2x2 grid of screenshots in rounded cards
  if(s.phoneLayout==='theme-grid'){
    const gap=W*.03;
    const cw=(W-W*.08*2-gap)/2,ch=cw*1.4;
    const ox=W*.08,oy=ty+H*.025;
    const imgs=[s.screenshotImg,s.screenshotImg2,s.screenshotImg3,s.screenshotImg4];
    const labels=['Theme 1','Theme 2','Theme 3','Theme 4'];
    [[0,0],[1,0],[0,1],[1,1]].forEach(([col,row],i)=>{
      const cx2=ox+col*(cw+gap),cy2=oy+row*(ch+gap+W*.01);
      ctx.save();ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=W*.04;ctx.shadowOffsetY=W*.02;
      rr(ctx,cx2,cy2,cw,ch,W*.03);ctx.fillStyle='rgba(30,50,100,.7)';ctx.fill();ctx.restore();
      ctx.save();rr(ctx,cx2,cy2,cw,ch,W*.03);ctx.clip();
      if(imgs[i]){drawImgCover(ctx,imgs[i],cx2,cy2,cw,ch);}
      else{ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(cx2,cy2,cw,ch);ctx.fillStyle='rgba(255,255,255,.18)';ctx.font=`${W*.04}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(labels[i],cx2+cw/2,cy2+ch/2);}
      ctx.restore();
    });
  }

  // multi-device: iPhone front + iPad back + Apple Watch
  if(s.phoneLayout==='multi-device'){
    // iPad (background, right side, slightly tilted)
    const ipadW=W*.58,ipadH=ipadW*1.33;
    const ipadX=W*.34,ipadY=z.py-H*.02;
    ctx.save();ctx.translate(ipadX+ipadW/2,ipadY+ipadH/2);ctx.rotate(6*Math.PI/180);ctx.translate(-(ipadX+ipadW/2),-(ipadY+ipadH/2));
    // iPad frame (black)
    const ibw=ipadW*.028,ir=ipadW*.065;
    const ifg=ctx.createLinearGradient(ipadX,ipadY,ipadX+ipadW,ipadY+ipadH);
    ifg.addColorStop(0,'#282828');ifg.addColorStop(1,'#0f0f0f');
    ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=ipadW*.14;ctx.shadowOffsetY=ipadW*.06;
    rr(ctx,ipadX,ipadY,ipadW,ipadH,ir);ctx.fillStyle=ifg;ctx.fill();
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    // iPad screen
    const isx=ipadX+ibw,isy=ipadY+ibw,isw=ipadW-ibw*2,ish=ipadH-ibw*2,isr=ir*.75;
    rr(ctx,isx,isy,isw,ish,isr);ctx.clip();
    if(s.screenshotImg2){drawImgCover(ctx,s.screenshotImg2,isx,isy,isw,ish);}
    else{ctx.fillStyle='#0a0a18';ctx.fillRect(isx,isy,isw,ish);ctx.fillStyle='rgba(255,255,255,.06)';ctx.font=`${isw*.06}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('iPadスクショ',isx+isw/2,isy+ish/2);}
    ctx.restore();
    // iPad front camera
    ctx.save();const icr=ipadW*.012;
    ctx.translate(ipadX+ipadW/2,ipadY+ipadH/2);ctx.rotate(6*Math.PI/180);ctx.translate(-(ipadX+ipadW/2),-(ipadY+ipadH/2));
    ctx.beginPath();ctx.arc(ipadX+ipadW/2,ipadY+ibw+icr*2.5,icr,0,Math.PI*2);ctx.fillStyle='#0a0a18';ctx.fill();
    ctx.beginPath();ctx.arc(ipadX+ipadW/2,ipadY+ibw+icr*2.5,icr*.5,0,Math.PI*2);ctx.fillStyle='#1a1a2a';ctx.fill();
    ctx.restore();

    // iPhone (foreground)
    drawPhoneAtZone(ctx,z,s);

    // Apple Watch (bottom right, balanced size)
    const awSize=W*.16,awH=awSize*1.22;
    const awX=W*.72,awY=H*.78;
    const awR=awSize*.28,awBw=awSize*.06;
    ctx.save();
    ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=W*.03;ctx.shadowOffsetY=W*.015;
    const awFg=ctx.createLinearGradient(awX,awY,awX+awSize,awY+awH);
    awFg.addColorStop(0,'#2a2a2a');awFg.addColorStop(1,'#111');
    rr(ctx,awX,awY,awSize,awH,awR);ctx.fillStyle=awFg;ctx.fill();
    ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    // Digital Crown
    const crownW=awSize*.07,crownH=awH*.16,crownR=crownW*.4;
    rr(ctx,awX+awSize-crownW*.3,awY+awH*.3,crownW,crownH,crownR);
    ctx.fillStyle='#3a3a3a';ctx.fill();
    // Side button
    const sbH=crownH*.45;
    rr(ctx,awX+awSize-crownW*.3,awY+awH*.52,crownW,sbH,crownR);
    ctx.fillStyle='#333';ctx.fill();
    ctx.restore();
    // Watch screen
    const wsx=awX+awBw,wsy=awY+awBw,wsw=awSize-awBw*2,wsh=awH-awBw*2,wsr=awR*.78;
    ctx.save();rr(ctx,wsx,wsy,wsw,wsh,wsr);ctx.clip();
    if(s.widgetMediumImg){drawImgCover(ctx,s.widgetMediumImg,wsx,wsy,wsw,wsh);}
    else{ctx.fillStyle='#000';ctx.fillRect(wsx,wsy,wsw,wsh);ctx.fillStyle='rgba(255,255,255,.12)';ctx.font=`${wsw*.13}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Watch',wsx+wsw/2,wsy+wsh/2);}
    ctx.restore();
  }

  // Draw phone for standard phone-based layouts
  const noPhoneLo=['text-bottom','center-large','center-large-top','screen-fill','screen-fill-top','feature-list','center-text','before-after','widget-showcase','widget-phone','theme-compare','theme-grid','multi-device'];
  if(!noPhoneLo.includes(s.phoneLayout)){
    drawPhoneAtZone(ctx,z,s);
  }
}

function drawPhoneAtZone(ctx,z,s){
  const tiltDeg=s.phoneLayout==='tilted'?(s.phoneTilt||10):0;
  const tiltRad=tiltDeg*Math.PI/180;
  const cx=z.px+z.pw/2,cy=z.py+z.ph/2;
  ctx.save();
  if(tiltRad){ctx.translate(cx,cy);ctx.rotate(tiltRad);ctx.translate(-cx,-cy);}
  drawPhone(ctx,z.px,z.py,z.pw,z.ph,s);
  ctx.restore();
}

function drawTextBlock(ctx,W,H,z,s){
  let ty=z.ty;
  const{css,weight}=getFontCss(s);
  const sizeScale=getTitleSize(s)/100;
  const maxW=z.maxW||undefined;
  const te=s.textEffect||'none';

  if(s.effects.includes('emoji')&&s.iconEmoji){
    const ez=z.maxW?W*.1:W*.15;ctx.font=`${ez}px sans-serif`;
    ctx.textAlign=z.ta;ctx.textBaseline='top';
    ctx.fillText(s.iconEmoji,z.tx,ty);ty+=ez*1.05;
  }

  const isOverlay=z.overlay; // center-large text sits on dark overlay
  const baseTz=z.maxW?W*.085:isOverlay?W*.095:W*.11;const tz=baseTz*sizeScale;
  const glow=s.effects.includes('glow');
  ctx.font=`${weight} ${tz}px ${css}`;
  ctx.textAlign=z.ta;ctx.textBaseline='top';

  const tlines=(s.title||'').split('\n');

  // Apply text effect
  if(te==='outline'){
    // Draw stroke first, then fill
    ctx.strokeStyle=s.textStrokeColor||'#000';
    ctx.lineWidth=(+s.textStrokeSize||4)*sizeScale*(W/268);
    ctx.lineJoin='round';
    tlines.forEach(l=>{ctx.strokeText(l,z.tx,ty,...(maxW?[maxW]:[]));ty+=tz*1.25;});
    ty-=tz*1.25*tlines.length;
    ctx.fillStyle=s.titleColor||'#fff';
    if(glow){ctx.shadowColor=ha(s.titleColor||'#fff',.6);ctx.shadowBlur=W*.05;}
    tlines.forEach(l=>{ctx.fillText(l,z.tx,ty,...(maxW?[maxW]:[]));ty+=tz*1.25;});
    ctx.shadowBlur=0;
  } else if(te==='shadow'){
    ctx.shadowColor=s.textShadowColor||'#000';
    ctx.shadowBlur=(+s.textShadowSize||12)*(W/268);
    ctx.shadowOffsetX=(+s.textShadowSize||12)*.3*(W/268);
    ctx.shadowOffsetY=(+s.textShadowSize||12)*.5*(W/268);
    ctx.fillStyle=s.titleColor||'#fff';
    if(glow){ctx.shadowColor=ha(s.titleColor||'#fff',.6);ctx.shadowBlur=W*.06;}
    tlines.forEach(l=>{ctx.fillText(l,z.tx,ty,...(maxW?[maxW]:[]));ty+=tz*1.25;});
    ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
  } else {
    ctx.fillStyle=s.titleColor||'#fff';
    if(glow){ctx.shadowColor=ha(s.titleColor||'#fff',.6);ctx.shadowBlur=W*.05;}
    tlines.forEach(l=>{ctx.fillText(l,z.tx,ty,...(maxW?[maxW]:[]));ty+=tz*1.25;});
    ctx.shadowBlur=0;
  }

  if(s.subtitle){
    const sz=W*.054*sizeScale;
    ctx.font=`${weight==='900'?'700':weight} ${sz}px ${css}`;
    ctx.fillStyle=ha(s.subColor||'#fff',.8);ctx.textAlign=z.ta;
    ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
    s.subtitle.split('\n').forEach(l=>{ctx.fillText(l,z.tx,ty,...(maxW?[maxW]:[]));ty+=sz*1.3;});
    ty+=sz*.3;
  }
  return ty;
}

/* ═══ CANVAS INIT & ZOOM ═══ */
const ZOOM_STEPS=[25,50,75,100,125,150,200];
let zoomIdx=-1; // -1 = auto-fit mode
function zoomPreview(dir){
  if(zoomIdx===-1){
    // Leaving auto-fit: find nearest step to current fit size
    const fitPct=calcFitPercent();
    let nearest=0;
    for(let i=0;i<ZOOM_STEPS.length;i++){if(Math.abs(ZOOM_STEPS[i]-fitPct)<Math.abs(ZOOM_STEPS[nearest]-fitPct))nearest=i;}
    zoomIdx=Math.max(0,Math.min(ZOOM_STEPS.length-1,nearest+dir));
  } else {
    zoomIdx=Math.max(0,Math.min(ZOOM_STEPS.length-1,zoomIdx+dir));
  }
  applyZoom();
}
function zoomPreviewReset(){zoomIdx=-1;applyZoom();}
function calcFitPercent(){
  const center=document.querySelector('.edit-center');
  if(!center)return 100;
  const dev=DEVS[curDev],ar=dev.h/dev.w;
  const pad=40;
  const zoomBarH=44;
  const cszH=28;
  const availW=center.clientWidth-pad*2;
  const availH=center.clientHeight-pad*2-zoomBarH-cszH;
  const fitByW=availW;
  const fitByH=availH/ar;
  const fitW=Math.min(fitByW,fitByH);
  return Math.round(fitW/PW*100);
}
function applyZoom(){
  let pct;
  if(zoomIdx===-1){
    pct=calcFitPercent();
    pct=Math.max(25,Math.min(400,pct));
  } else {
    pct=ZOOM_STEPS[zoomIdx];
  }
  const el=document.getElementById('zoom-level');
  if(el)el.textContent=zoomIdx===-1?'フィット':pct+'%';
  const dev=DEVS[curDev],ar=dev.h/dev.w;
  const w=Math.round(PW*pct/100);
  const c=document.getElementById('canvas');
  if(c){c.width=w;c.height=Math.round(w*ar);}
  render();
}
function initAllCanvas(){
  const dev=DEVS[curDev],ar=dev.h/dev.w;
  const c1=document.getElementById('s1-canvas');
  if(c1){c1.width=PW;c1.height=Math.round(PW*ar);}
  applyZoom();
  const el=document.getElementById('csz');if(el)el.textContent=dev.lbl;
}
/* Re-fit on window resize when in auto-fit mode */
let _resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(_resizeTimer);
  _resizeTimer=setTimeout(()=>{if(zoomIdx===-1&&inStep===2)applyZoom();},120);
});
function render(){
  const s=slides[curSlide];if(!s)return;
  if(inStep===1){const c=document.getElementById('s1-canvas');if(c)renderSlide(c.getContext('2d'),c.width,c.height,s);}
  if(inStep===2){const c=document.getElementById('canvas');if(c)renderSlide(c.getContext('2d'),c.width,c.height,s);}
  renderThumbs();updateSummary();
  autoSave();
}

/* ═══ STEP NAV ═══ */
function goStep(n){
  inStep=n;
  document.getElementById('s1').style.display=n===1?'flex':'none';
  document.getElementById('s2').style.display=n===2?'flex':'none';
  document.getElementById('st1').className='step'+(n===1?' active':' done');
  document.getElementById('st2').className='step'+(n===2?' active':'');
  if(n===2) buildFields();
  render();
  if(isIphone()) iphoneApplyStep();
}

/* ═══ STEP 1 TAB SWITCH (iPad) ═══ */
function switchS1Tab(id,btn){
  document.querySelectorAll('#s1-tab-bar button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  ['bg','layout','fx'].forEach(t=>{
    const p=document.getElementById('s1-pane-'+t);
    if(p) p.classList.toggle('active',t===id);
  });
}

/* ═══ STEP 1 UI ═══ */
// Build opt-cards/fx into a given grid/list element
function buildBgGrid(el){
  if(!el)return;el.innerHTML='';
  BG_STYLES.forEach(b=>{
    const card=makeOptCard(b,'bgStyle',BG_STYLES,()=>{pushUndo();slides[curSlide].bgStyle=b.id;render();});
    const mc=document.createElement('canvas');mc.width=117;mc.height=88;b.mini(mc.getContext('2d'),117,88);
    card.querySelector('.opt-prev').appendChild(mc);el.appendChild(card);
  });
}
function buildLoGrid(el){
  if(!el)return;el.innerHTML='';
  PHONE_LAYOUTS.forEach(lo=>{
    const card=makeOptCard(lo,'phoneLayout',PHONE_LAYOUTS,()=>{pushUndo();slides[curSlide].phoneLayout=lo.id;render();});
    const mc=document.createElement('canvas');mc.width=100;mc.height=190;lo.mini(mc.getContext('2d'),100,190);
    card.querySelector('.opt-prev').appendChild(mc);el.appendChild(card);
  });
}
function buildFxList(el,idSuffix=''){
  if(!el)return;el.innerHTML='';
  EFFECTS.forEach(fx=>{
    const s=slides[curSlide];const uid='fx-'+fx.id+(idSuffix?'-'+idSuffix:'');
    const chip=document.createElement('div');chip.className='fx-chip'+(s.effects.includes(fx.id)?' sel':'');chip.id=uid;
    chip.onclick=()=>{
      pushUndo();const s=slides[curSlide];const idx=s.effects.indexOf(fx.id);
      if(idx>=0)s.effects.splice(idx,1);else s.effects.push(fx.id);
      // sync all instances of this fx chip
      document.querySelectorAll(`[id^="fx-${fx.id}"]`).forEach(c=>{
        c.classList.toggle('sel',s.effects.includes(fx.id));
        const chk=c.querySelector('.fx-chk-inner');
        if(chk){chk.textContent=s.effects.includes(fx.id)?'✓':'';chk.style.background=s.effects.includes(fx.id)?'var(--acc)':'transparent';}
      });
      render();
    };
    chip.innerHTML=`<div class="fx-icon">${fx.icon}</div><div class="fx-text"><div class="fx-name">${fx.name}</div><div class="fx-desc">${fx.desc}</div></div><div class="fx-chk fx-chk-inner" style="background:${s.effects.includes(fx.id)?'var(--acc)':'transparent'}">${s.effects.includes(fx.id)?'✓':''}</div>`;
    el.appendChild(chip);
  });
}

function buildStep1(){
  // Desktop grids
  buildBgGrid(document.getElementById('bg-grid'));
  buildLoGrid(document.getElementById('layout-grid'));
  buildFxList(document.getElementById('fx-list'));
  // Tablet tab grids
  buildBgGrid(document.getElementById('bg-grid-t'));
  buildLoGrid(document.getElementById('layout-grid-t'));
  buildFxList(document.getElementById('fx-list-t'),'t');
}

function makeOptCard(item,stateKey,group,onChange){
  const card=document.createElement('div');const s=slides[curSlide];
  card.className='opt-card'+(s[stateKey]===item.id?' sel':'');card.id='oc-'+item.id+'-'+Math.random().toString(36).slice(2,6);
  card.dataset.itemId=item.id;card.dataset.stateKey=stateKey;
  card.onclick=()=>{
    // Deselect all cards with same stateKey across both desktop+tablet grids
    document.querySelectorAll(`.opt-card[data-state-key="${stateKey}"]`).forEach(c=>c.classList.remove('sel'));
    // Select all cards with this itemId
    document.querySelectorAll(`.opt-card[data-item-id="${item.id}"][data-state-key="${stateKey}"]`).forEach(c=>c.classList.add('sel'));
    onChange();
  };
  const prev=document.createElement('div');prev.className='opt-prev';card.appendChild(prev);
  const lbl=document.createElement('div');lbl.className='opt-lbl';
  lbl.innerHTML=`<div class="opt-lbl-name">${item.name}</div><div class="opt-lbl-desc">${item.desc||''}</div>`;card.appendChild(lbl);
  return card;
}

function updateSummary(){
  const s=slides[curSlide];const sum=document.getElementById('prev-summary');if(!sum)return;
  const bg=BG_STYLES.find(b=>b.id===s.bgStyle)||BG_STYLES[0];
  const lo=PHONE_LAYOUTS.find(l=>l.id===s.phoneLayout)||PHONE_LAYOUTS[0];
  const fxNames=s.effects.map(id=>EFFECTS.find(e=>e.id===id)?.name||id).join('、');
  const font=FONTS.find(f=>f.id===s.fontId)||FONTS[0];
  sum.innerHTML=`
    <div class="sum-row"><span class="sum-key">背景</span><span class="sum-val">${bg.name}</span></div>
    <div class="sum-row"><span class="sum-key">配置</span><span class="sum-val">${lo.name}</span></div>
    <div class="sum-row"><span class="sum-key">エフェクト</span><span class="sum-val">${fxNames||'なし'}</span></div>
    <div class="sum-row"><span class="sum-key">フォント</span><span class="sum-val">${font.name}</span></div>
  `;
}

/* ═══ STEP 2: FIELDS ═══ */
function buildFields(){
  const s=slides[curSlide];
  const bg=BG_STYLES.find(b=>b.id===s.bgStyle)||BG_STYLES[0];
  const lo=PHONE_LAYOUTS.find(l=>l.id===s.phoneLayout)||PHONE_LAYOUTS[0];

  // Tags bar (desktop)
  const tags=document.getElementById('edit-tags');
  tags.innerHTML=`<span class="tag tag-bg">${bg.name}</span><span class="tag tag-layout">${lo.name}</span>${s.effects.map(id=>`<span class="tag tag-fx">${EFFECTS.find(e=>e.id===id)?.name||id}</span>`).join('')}<button class="btn btn-g" onclick="goStep(1)" style="font-size:10px;padding:3px 8px;margin-left:auto">← パーツ変更</button>`;

  const needBg2=!['solid','white-accent'].includes(s.bgStyle);
  const needAccent=['white-accent','dark'].includes(s.bgStyle)||s.effects.includes('deco');
  const hasBadge=s.effects.includes('badge');
  const hasEmoji=s.effects.includes('emoji');

  // Helper: build a section's content into a container el
  function buildBgSection(el){
    addColorField(el,'カラー 1','bgColor1');
    if(needBg2)addColorField(el,'カラー 2','bgColor2');
    if(needAccent)addColorField(el,'アクセントカラー','accentColor');
    addSliderField(el,'グレイン（ノイズ質感）','grain',0,100,s.grain||0,'');
  }
  function buildTextSection(el){
    if(hasEmoji)addTextField(el,'絵文字アイコン','iconEmoji','例: ☕ 🚌 📅');
    addTextareaField(el,'タイトル（改行可）','title','キャッチコピーを入力');
    addColorField(el,'タイトル文字色','titleColor');
    addTextField(el,'サブタイトル','subtitle','サブコピーを入力');
    addColorField(el,'サブタイトル文字色','subColor');
    addSec(el,'iPhone 文字調整');
    addSliderField(el,'上下位置（iPhone）','textOffsetY',-50,50,s.textOffsetY||0,'px');
    addSec(el,'iPad 文字調整');
    addSliderField(el,'上下位置（iPad）','textOffsetYIpad',-50,50,s.textOffsetYIpad||0,'px');
    if(hasBadge){
      addSec(el,'バッジ');
      addTextField(el,'バッジテキスト','badgeText','例: 無料で使える');
      addColorField(el,'バッジ背景色','badgeColor');
      addColorField(el,'バッジ文字色','badgeTextColor');
    }
    if(s.phoneLayout==='feature-list'){
      addSec(el,'機能リスト');
      addTextareaField(el,'項目（1行1項目、先頭に絵文字可）','featureItems','✓ 機能その1\n✓ 機能その2');
    }
  }
  function buildFontSection(el){
    addFontPicker(el);
    addFontWeightPicker(el);
    addSliderField(el,'文字サイズ（iPhone）','titleSize',60,160,s.titleSize||100,'%');
    addSliderField(el,'文字サイズ（iPad）','titleSizeIpad',60,160,s.titleSizeIpad||100,'%');
  }
  function buildFxSection(el){
    addSec(el,'テキストエフェクト');
    addTextEffectToggle(el);
    if(s.textEffect==='shadow'){
      addColorField(el,'影の色','textShadowColor');
      addSliderField(el,'影のサイズ','textShadowSize',2,40,s.textShadowSize||12,'px');
    }
    if(s.textEffect==='outline'){
      addColorField(el,'アウトラインの色','textStrokeColor');
      addSliderField(el,'アウトラインの太さ','textStrokeSize',1,20,s.textStrokeSize||4,'px');
    }
  }
  function buildDeviceSection(el){
    const isWidgetLayout=['widget-showcase','widget-phone','multi-device'].includes(s.phoneLayout);
    const isThemeLayout=['theme-compare','theme-grid'].includes(s.phoneLayout);
    const needsPhone=!['widget-showcase','theme-grid'].includes(s.phoneLayout);

    if(needsPhone){
      addSec(el,'iPhone用スクショ');
      addUploadField(el,'スクリーンショット（iPhone）','screenshotImg','_src');
      addSec(el,'iPad用スクショ');
      addUploadField(el,'スクリーンショット（iPad）','screenshotImgIpad','_srcIpad');
    }
    if(s.phoneLayout==='before-after'||s.phoneLayout==='theme-compare'||s.phoneLayout==='multi-device') addUploadField(el,'スクリーンショット 2'+(s.phoneLayout==='theme-compare'?'（右側）':s.phoneLayout==='multi-device'?'（iPad用）':'（下段）'),'screenshotImg2','_src2');
    if(s.phoneLayout==='theme-grid'){
      addSec(el,'テーマスクショ（4枚）');
      addUploadField(el,'スクリーンショット 1（左上）','screenshotImg','_src');
      addUploadField(el,'スクリーンショット 2（右上）','screenshotImg2','_src2');
      addUploadField(el,'スクリーンショット 3（左下）','screenshotImg3','_src3');
      addUploadField(el,'スクリーンショット 4（右下）','screenshotImg4','_src4');
    }
    if(isThemeLayout){
      addSec(el,'テーマラベル');
      addTextField(el,'ラベル 1（左）','themeLabel1','例: Light');
      addTextField(el,'ラベル 2（右）','themeLabel2','例: Dark');
    }
    if(isWidgetLayout){
      addSec(el,'ウィジェット画像');
      if(s.phoneLayout==='widget-showcase'){
        addUploadField(el,'Large Widget','widgetLargeImg','_srcWidgetLarge');
        addUploadField(el,'Medium Widget','widgetMediumImg','_srcWidgetMedium');
        addUploadField(el,'Small Widget','widgetSmallImg','_srcWidgetSmall');
      } else {
        addUploadField(el,'Medium Widget','widgetMediumImg','_srcWidgetMedium');
        addUploadField(el,'Small Widget','widgetSmallImg','_srcWidgetSmall');
      }
    }
    if(needsPhone||s.phoneLayout==='screen-fill'||s.phoneLayout==='screen-fill-top'){
      addSec(el,'スクショ表示調整');
      addSliderField(el,'ズーム','screenshotScale',100,200,s.screenshotScale||100,'%');
      addSliderField(el,'横位置','screenshotOffsetX',-50,50,s.screenshotOffsetX||0,'%');
      addSliderField(el,'縦位置','screenshotOffsetY',-50,50,s.screenshotOffsetY||0,'%');
    }
    if(needsPhone){
      addSelectField(el,'フレームカラー','frameColor',[['black','ブラック'],['silver','シルバー'],['gold','ゴールド'],['none','フレームなし']]);
    }
    if(s.phoneLayout==='tilted')addSliderField(el,'傾き角度','phoneTilt',-30,30,s.phoneTilt||10,'°');
  }

  // ── iPhone: populate tab panes ──
  const panes={
    bg:document.getElementById('s2p-bg'),
    text:document.getElementById('s2p-text'),
    font:document.getElementById('s2p-font'),
    fx:document.getElementById('s2p-fx'),
    device:document.getElementById('s2p-device'),
  };
  if(panes.bg){
    Object.values(panes).forEach(p=>{if(p)p.innerHTML='';});
    buildBgSection(panes.bg);
    buildTextSection(panes.text);
    buildFontSection(panes.font);
    buildFxSection(panes.fx);
    buildDeviceSection(panes.device);
  }

  // ── Desktop: accordion in single scroll area ──
  const panel=document.getElementById('fields');
  panel.innerHTML='';
  panel.style.gap='8px';
  const secBg=makeAccSection('🎨','背景',true);
  buildBgSection(secBg);panel.appendChild(secBg.root);
  const secTx=makeAccSection('✍️','テキスト',true);
  buildTextSection(secTx);panel.appendChild(secTx.root);
  const secFn=makeAccSection('🔤','フォント',false);
  buildFontSection(secFn);panel.appendChild(secFn.root);
  const secFx=makeAccSection('✨','テキストエフェクト',false);
  buildFxSection(secFx);panel.appendChild(secFx.root);
  const secDv=makeAccSection('📱','デバイス',false);
  buildDeviceSection(secDv);panel.appendChild(secDv.root);
}

function makeAccSection(icon,title,defaultOpen,badge=''){
  const root=document.createElement('div');
  root.className='acc-sec'+(defaultOpen?' open':'');
  const head=document.createElement('div');head.className='acc-head';
  const badgeHtml=badge?`<span class="acc-badge">${badge}</span>`:'';
  head.innerHTML=`
    <div class="acc-head-left">
      <span class="acc-icon">${icon}</span>
      <span class="acc-title">${title}</span>
      ${badgeHtml}
    </div>
    <span class="acc-arrow">›</span>
  `;
  head.onclick=()=>root.classList.toggle('open');
  const body=document.createElement('div');body.className='acc-body';
  root.appendChild(head);root.appendChild(body);
  return{root,appendChild:(el)=>body.appendChild(el)};
}

/* Field helpers */
function addTextEffectToggle(p){
  const s=slides[curSlide];
  const r=addRow(p,null);
  const row2=document.createElement('div');row2.className='fx-toggle-row';
  [['none','なし'],['shadow','ドロップ影'],['outline','アウトライン']].forEach(([v,lbl])=>{
    const btn=document.createElement('div');btn.className='fx-toggle'+(s.textEffect===v?' sel':'');
    btn.textContent=lbl;
    btn.onclick=()=>{pushUndo();slides[curSlide].textEffect=v;buildFields();render();};
    row2.appendChild(btn);
  });
  r.appendChild(row2);
}
function addFontPicker(p){
  const r=addRow(p,'フォント選択');const grid=document.createElement('div');grid.className='font-grid';const s=slides[curSlide];
  FONTS.forEach(f=>{
    const chip=document.createElement('div');chip.className='font-chip'+(s.fontId===f.id?' sel':'');chip.id='fc-'+f.id;
    chip.innerHTML=`<div class="font-chip-name" style="font-family:${f.css}">${f.name}</div><div class="font-chip-sample" style="font-family:${f.css}">${f.sample}</div>`;
    chip.onclick=()=>{pushUndo();slides[curSlide].fontId=f.id;const fw=slides[curSlide].fontWeight;if(!f.weights.includes(fw))slides[curSlide].fontWeight=f.weights[f.weights.length-1];buildFields();render();};
    grid.appendChild(chip);
  });r.appendChild(grid);
}
function addFontWeightPicker(p){
  const s=slides[curSlide];const f=FONTS.find(f=>f.id===s.fontId)||FONTS[0];if(f.weights.length<=1)return;
  const r=addRow(p,'フォントの太さ');const row2=document.createElement('div');row2.style.cssText='display:flex;gap:6px;flex-wrap:wrap';
  const WLABELS={'400':'Regular','700':'Bold','800':'ExtraBold','900':'Black'};
  f.weights.forEach(w=>{
    const btn=document.createElement('button');btn.className='fi';
    btn.style.cssText='width:auto;padding:4px 10px;cursor:pointer;flex:1;'+(s.fontWeight===w?'border-color:var(--acc);background:var(--adim);color:var(--acc)':'');
    btn.textContent=WLABELS[w]||w;btn.onclick=()=>{pushUndo();slides[curSlide].fontWeight=w;buildFields();render();};
    row2.appendChild(btn);
  });r.appendChild(row2);
}
function addSliderField(p,label,key,min,max,val,unit=''){
  const r=addRow(p,label);const row2=document.createElement('div');row2.className='slider-row';
  const inp=document.createElement('input');inp.type='range';inp.min=min;inp.max=max;inp.value=val;
  const display=document.createElement('span');display.className='slider-val';display.textContent=val+(unit||'');
  inp.oninput=()=>{slides[curSlide][key]=+inp.value;display.textContent=inp.value+(unit||'');render();};
  inp.onchange=()=>pushUndo();
  row2.appendChild(inp);row2.appendChild(display);r.appendChild(row2);
}
function addSec(p,t){const d=document.createElement('div');d.className='sec-lbl';d.textContent=t;p.appendChild(d);}
function addDivider(p){const d=document.createElement('div');d.className='divider';p.appendChild(d);}
function addRow(p,label){const r=document.createElement('div');r.className='frow';if(label){const l=document.createElement('div');l.className='flbl';l.textContent=label;r.appendChild(l);}p.appendChild(r);return r;}
function addTextField(p,label,key,ph=''){
  const r=addRow(p,label);const inp=document.createElement('input');inp.type='text';inp.className='fi';inp.placeholder=ph;inp.value=slides[curSlide][key]||'';
  inp.onchange=()=>pushUndo();
  inp.oninput=()=>{slides[curSlide][key]=inp.value;render();};r.appendChild(inp);
}
function addTextareaField(p,label,key,ph=''){
  const r=addRow(p,label);const ta=document.createElement('textarea');ta.className='fi';ta.rows=3;ta.placeholder=ph;ta.value=slides[curSlide][key]||'';
  ta.onchange=()=>pushUndo();
  ta.oninput=()=>{slides[curSlide][key]=ta.value;render();};r.appendChild(ta);
}
function addSelectField(p,label,key,opts){
  const r=addRow(p,label);const sel=document.createElement('select');sel.className='fi';
  opts.forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;if(slides[curSlide][key]===v)o.selected=true;sel.appendChild(o);});
  sel.onchange=()=>{pushUndo();slides[curSlide][key]=sel.value;render();};r.appendChild(sel);
}
function addColorField(p,label,key){
  const r=addRow(p,label);const crow=document.createElement('div');crow.className='crow';const s=slides[curSlide];
  PRESETS.forEach(c=>{
    const ch=document.createElement('div');ch.className='chip'+(s[key]===c?' sel':'');
    ch.style.background=c;if(c==='#FFFFFF')ch.style.outline='1px solid #444';
    ch.onclick=()=>{pushUndo();slides[curSlide][key]=c;buildFields();render();};
    crow.appendChild(ch);
  });
  const ccw=document.createElement('div');ccw.className='ccw';const cp=document.createElement('input');cp.type='color';cp.value=s[key]||'#FFFFFF';const hx=document.createElement('input');hx.className='chex';hx.value=s[key]||'#FFFFFF';hx.maxLength=7;
  cp.oninput=()=>{slides[curSlide][key]=cp.value;hx.value=cp.value;render();};
  cp.onchange=()=>pushUndo();
  hx.oninput=()=>{if(/^#[0-9a-fA-F]{6}$/.test(hx.value)){slides[curSlide][key]=hx.value;cp.value=hx.value;render();}};
  ccw.appendChild(cp);ccw.appendChild(hx);crow.appendChild(ccw);r.appendChild(crow);
}
function addUploadField(p,label,key,srcKey='_src'){
  const r=addRow(p,label);const s=slides[curSlide];const uz=document.createElement('div');uz.className='uz';
  const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=e=>loadImg(e.target.files[0],key,srcKey);
  uz.onclick=()=>inp.click();uz.ondragover=e=>{e.preventDefault();uz.style.borderColor='var(--acc)';};uz.ondragleave=()=>uz.style.borderColor='';uz.ondrop=e=>{e.preventDefault();uz.style.borderColor='';loadImg(e.dataTransfer.files[0],key,srcKey);};
  const t=document.createElement('div');t.className='uz-t';t.textContent='クリックまたはドロップ';const sm=document.createElement('div');sm.className='uz-s';sm.textContent='⌘V で貼り付けも可能';
  uz.appendChild(inp);uz.appendChild(t);uz.appendChild(sm);
  if(s[key]){const img=document.createElement('img');img.className='uz-img';img.src=s[srcKey]||'';uz.appendChild(img);const cx=document.createElement('button');cx.className='cx';cx.textContent='✕';cx.onclick=e=>{e.stopPropagation();pushUndo();slides[curSlide][key]=null;slides[curSlide][srcKey]='';buildFields();render();};uz.appendChild(cx);}
  r.appendChild(uz);
}
function loadImg(file,key,srcKey='_src'){
  if(!file||!file.type.startsWith('image/'))return;
  const rd=new FileReader();rd.onload=ev=>{const img=new Image();img.onload=()=>{pushUndo();slides[curSlide][key]=img;slides[curSlide][srcKey]=ev.target.result;buildFields();render();showToast('画像を読み込みました');};img.src=ev.target.result;};rd.readAsDataURL(file);
}
document.addEventListener('paste',e=>{for(const item of e.clipboardData.items){if(item.type.startsWith('image/')){const key=isIpadDev()?'screenshotImgIpad':'screenshotImg';const src=isIpadDev()?'_srcIpad':'_src';loadImg(item.getAsFile(),key,src);showToast('スクショを貼り付けました ✓');break;}}});

/* ═══ CONVERT MODAL ═══ */
let convTargetIdx=null,convSelBg=null,convSelLo=null;

function showConvModal(idx){
  convTargetIdx=idx;const s=slides[idx];
  convSelBg=s.bgStyle;convSelLo=s.phoneLayout;
  // Build bg grid
  const bgG=document.getElementById('conv-bg-grid');bgG.innerHTML='';
  BG_STYLES.forEach(b=>{
    const card=document.createElement('div');card.className='modal-card'+(b.id===convSelBg?' sel':'');card.id='cvbg-'+b.id;
    const mc=document.createElement('canvas');mc.width=100;mc.height=70;b.mini(mc.getContext('2d'),100,70);
    const lbl=document.createElement('div');lbl.className='modal-card-lbl';lbl.textContent=b.name;
    card.appendChild(mc);card.appendChild(lbl);
    card.onclick=()=>{convSelBg=b.id;document.querySelectorAll('[id^="cvbg-"]').forEach(c=>c.classList.remove('sel'));card.classList.add('sel');};
    bgG.appendChild(card);
  });
  // Build layout grid
  const loG=document.getElementById('conv-lo-grid');loG.innerHTML='';
  PHONE_LAYOUTS.forEach(lo=>{
    const card=document.createElement('div');card.className='modal-card'+(lo.id===convSelLo?' sel':'');card.id='cvlo-'+lo.id;
    const mc=document.createElement('canvas');mc.width=100;mc.height=170;lo.mini(mc.getContext('2d'),100,170);
    const lbl=document.createElement('div');lbl.className='modal-card-lbl';lbl.textContent=lo.name;
    card.appendChild(mc);card.appendChild(lbl);
    card.onclick=()=>{convSelLo=lo.id;document.querySelectorAll('[id^="cvlo-"]').forEach(c=>c.classList.remove('sel'));card.classList.add('sel');};
    loG.appendChild(card);
  });
  document.getElementById('conv-modal').style.display='flex';
}
function hideConvModal(){document.getElementById('conv-modal').style.display='none';}
function applyConv(){
  if(convTargetIdx===null)return;
  pushUndo();
  slides[convTargetIdx].bgStyle=convSelBg;
  slides[convTargetIdx].phoneLayout=convSelLo;
  hideConvModal();
  if(convTargetIdx===curSlide){if(inStep===2)buildFields();}
  render();showToast('パーツを変換しました 🔄');
}

/* ═══ SLIDES + DRAG&DROP ═══ */
let dragSrc=null;
function copyImgFields(ns,src){
  ['screenshotImg','screenshotImg2','screenshotImg3','screenshotImg4','screenshotImgIpad','widgetSmallImg','widgetMediumImg','widgetLargeImg'].forEach(k=>{ns[k]=src[k];});
  ['_src','_src2','_src3','_src4','_srcIpad','_srcWidgetSmall','_srcWidgetMedium','_srcWidgetLarge'].forEach(k=>{ns[k]=src[k];});
}
function addSlide(){
  pushUndo();
  const ns=JSON.parse(JSON.stringify(slides[curSlide]));
  copyImgFields(ns,slides[curSlide]);
  slides.push(ns);
  renderThumbs();
  selectSlide(slides.length-1);
  showToast(`スライド${slides.length}枚目を追加しました！`);
}
function delSlide(i){if(slides.length===1){showToast('最低1枚必要です');return;}pushUndo();slides.splice(i,1);if(curSlide>=slides.length)curSlide=slides.length-1;renderThumbs();selectSlide(curSlide);}
function dupSlide(i){pushUndo();const d=JSON.parse(JSON.stringify(slides[i]));copyImgFields(d,slides[i]);slides.splice(i+1,0,d);renderThumbs();selectSlide(i+1);}
function selectSlide(i){
  curSlide=i;
  document.querySelectorAll('.sth').forEach((el,j)=>el.classList.toggle('active',j===i));
  if(inStep===1){
    // Update sel state on opt-cards without full rebuild
    document.querySelectorAll('.opt-card[data-state-key="bgStyle"]').forEach(c=>c.classList.toggle('sel',c.dataset.itemId===slides[i].bgStyle));
    document.querySelectorAll('.opt-card[data-state-key="phoneLayout"]').forEach(c=>c.classList.toggle('sel',c.dataset.itemId===slides[i].phoneLayout));
    updateSummary();
  }
  if(inStep===2) buildFields();
  render();
}

function renderThumbs(){
  const list=document.getElementById('sl');if(!list)return;
  list.innerHTML='';const dev=DEVS[curDev];
  slides.forEach((s,i)=>{
    const div=document.createElement('div');div.className='sth'+(i===curSlide?' active':'');
    div.draggable=true;div.dataset.idx=i;
    div.addEventListener('dragstart',e=>{dragSrc=i;div.classList.add('dragging');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',i);});
    div.addEventListener('dragend',()=>{div.classList.remove('dragging');document.querySelectorAll('.sth').forEach(el=>el.classList.remove('drag-over'));dragSrc=null;});
    div.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';if(dragSrc!==null&&dragSrc!==i){document.querySelectorAll('.sth').forEach(el=>el.classList.remove('drag-over'));div.classList.add('drag-over');}});
    div.addEventListener('dragleave',()=>div.classList.remove('drag-over'));
    div.addEventListener('drop',e=>{
      e.preventDefault();div.classList.remove('drag-over');if(dragSrc===null||dragSrc===i)return;
      pushUndo();const moved=slides.splice(dragSrc,1)[0];const newIdx=dragSrc<i?i-1:i;slides.splice(newIdx,0,moved);
      let newCur=curSlide;if(curSlide===dragSrc)newCur=newIdx;else if(curSlide>Math.min(dragSrc,newIdx)&&curSlide<=Math.max(dragSrc,newIdx))newCur=dragSrc<newIdx?curSlide-1:curSlide+1;
      curSlide=newCur;renderThumbs();if(inStep===2)buildFields();render();showToast('スライドを移動しました');
    });
    div.onclick=e=>{if(!e.target.classList.contains('sth-del')&&!e.target.classList.contains('sth-dup')&&!e.target.classList.contains('sth-conv'))selectSlide(i);};
    const tw=160;const tc=document.createElement('canvas');tc.width=tw;tc.height=Math.round(tw*dev.h/dev.w);
    renderSlide(tc.getContext('2d'),tc.width,tc.height,s);tc.style.cssText='width:100%;height:auto;display:block';
    const n=document.createElement('div');n.className='sth-n';n.textContent=i+1;
    const del=document.createElement('button');del.className='sth-del';del.textContent='✕';del.onclick=e=>{e.stopPropagation();delSlide(i);};
    const dup=document.createElement('button');dup.className='sth-dup';dup.textContent='⧉';dup.onclick=e=>{e.stopPropagation();dupSlide(i);};
    const conv=document.createElement('button');conv.className='sth-conv';conv.textContent='🔄';conv.title='パーツを変換';conv.onclick=e=>{e.stopPropagation();showConvModal(i);};
    div.appendChild(tc);div.appendChild(n);div.appendChild(del);div.appendChild(dup);div.appendChild(conv);list.appendChild(div);
  });
}

/* ═══ EXPORT ═══ */
function exportCurrent(){exportSlide(curSlide);}
function exportAll(){
  if(isIphone()){
    showToast('iPhoneはスライド一覧から1枚ずつ保存してください');
    iphoneShowSlides();
    return;
  }
  slides.forEach((_,i)=>exportSlide(i,true));
  showToast(`${slides.length}枚を書き出しました！`);
}

async function exportZip(){
  if(typeof JSZip==='undefined'){showToast('ZIPライブラリを読み込み中...');return;}
  showToast('ZIP作成中...');
  const zip=new JSZip();
  const dev=DEVS[curDev];
  const promises=slides.map((s,i)=>new Promise(resolve=>{
    const oc=document.createElement('canvas');oc.width=dev.w;oc.height=dev.h;
    renderSlide(oc.getContext('2d'),oc.width,oc.height,s);
    oc.toBlob(blob=>{
      blob.arrayBuffer().then(buf=>{
        zip.file(`preview_${curDev}inch_slide${i+1}.png`,buf);
        resolve();
      });
    },'image/png');
  }));
  await Promise.all(promises);
  const blob=await zip.generateAsync({type:'blob'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`preview_${curDev}inch_all${slides.length}slides.zip`;
  a.click();
  showToast(`${slides.length}枚をZIPで書き出しました！🗜`);
}
function exportSlide(i,silent=false){
  const dev=DEVS[curDev];
  const oc=document.createElement('canvas');oc.width=dev.w;oc.height=dev.h;
  renderSlide(oc.getContext('2d'),oc.width,oc.height,slides[i]);
  const filename=`preview_${curDev}inch_slide${i+1}.png`;

  if(isIphone()){
    // iOS: convert to data URL and open in new tab → long-press → 写真に保存
    const dataUrl=oc.toDataURL('image/png');
    const win=window.open('','_blank');
    if(win){
      win.document.write(`
        <!DOCTYPE html><html><head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${filename}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{background:#000;min-height:100vh;display:flex;flex-direction:column;align-items:center;gap:0}
          .hint{color:#fff;font-size:14px;font-family:-apple-system,sans-serif;padding:16px;text-align:center;line-height:1.6;background:rgba(255,255,255,.1);width:100%}
          .hint strong{color:#30D158}
          img{width:100%;height:auto;display:block}
        </style>
        </head><body>
        <div class="hint">画像を<strong>長押し</strong>→「写真に追加」で保存できます</div>
        <img src="${dataUrl}" alt="${filename}">
        </body></html>
      `);
      win.document.close();
    } else {
      showToast('ポップアップをブロックされました。許可してください');
    }
  } else {
    // Desktop: normal download
    oc.toBlob(blob=>{
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);
      a.download=filename;a.click();
      if(!silent)showToast(`スライド${i+1}を書き出しました！`);
    },'image/png');
  }
}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}

/* ═══ TEMPLATES ═══ */
const TEMPLATES=[
  {
    id:'standard5',
    name:'スタンダード5枚',
    desc:'王道の5枚構成。機能紹介に最適',
    slides:[
      {bgStyle:'grad-diag',phoneLayout:'center-large',effects:['glow'],bgColor1:'#0A84FF',bgColor2:'#5856D6',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:105},
      {bgStyle:'grad-diag',phoneLayout:'text-top',effects:['glow'],bgColor1:'#30D158',bgColor2:'#34C759',title:'機能その1\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'grad-diag',phoneLayout:'text-top',effects:['glow'],bgColor1:'#FF9F0A',bgColor2:'#FF6B00',title:'機能その2\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'grad-diag',phoneLayout:'text-top',effects:['glow'],bgColor1:'#BF5AF2',bgColor2:'#9B59B6',title:'機能その3\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'grad-diag',phoneLayout:'text-hero',effects:['glow','badge'],bgColor1:'#FF375F',bgColor2:'#FF2D55',title:'今すぐ\nダウンロード',subtitle:'無料で始められます',titleColor:'#fff',subColor:'#fff',badgeText:'App Storeで配信中',badgeColor:'#fff',badgeTextColor:'#c00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'dark5',
    name:'ダークテーマ5枚',
    desc:'かっこいいダーク系。ゲーム・ツール系に',
    slides:[
      {bgStyle:'dark',phoneLayout:'center-large',effects:['glow','deco'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#7B5FF2',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#aaa',fontId:'dela',fontWeight:'400',titleSize:105},
      {bgStyle:'dark',phoneLayout:'text-top',effects:['glow'],bgColor1:'#0d1117',bgColor2:'#1a1040',accentColor:'#0A84FF',title:'機能その1\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'dark',phoneLayout:'text-top',effects:['glow'],bgColor1:'#0d1117',bgColor2:'#0d2040',accentColor:'#30D158',title:'機能その2\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'dark',phoneLayout:'feature-list',effects:['glow'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#BF5AF2',title:'主な機能',subtitle:'',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'700',titleSize:100,featureItems:'✨ 機能その1\n🚀 機能その2\n🔒 機能その3\n📊 機能その4\n⚡ 機能その5'},
      {bgStyle:'dark',phoneLayout:'text-hero',effects:['glow','badge'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#FF375F',title:'今すぐ\nダウンロード',subtitle:'無料で始められます',titleColor:'#fff',subColor:'#aaa',badgeText:'App Storeで配信中',badgeColor:'#FF375F',badgeTextColor:'#fff',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'feature5',
    name:'機能紹介5枚',
    desc:'機能リストを使った詳細紹介構成',
    slides:[
      {bgStyle:'grad-vert',phoneLayout:'center-large',effects:['glow'],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:105},
      {bgStyle:'grad-vert',phoneLayout:'text-top',effects:['glow'],bgColor1:'#4facfe',bgColor2:'#00f2fe',title:'機能その1\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:100},
      {bgStyle:'grad-vert',phoneLayout:'text-top',effects:['glow'],bgColor1:'#43e97b',bgColor2:'#38f9d7',title:'機能その2\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:100},
      {bgStyle:'grad-vert',phoneLayout:'feature-list',effects:[],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'できること',subtitle:'',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'700',titleSize:100,featureItems:'📌 機能その1\n🎯 機能その2\n💡 機能その3\n🔔 機能その4\n❤️ 機能その5'},
      {bgStyle:'grad-vert',phoneLayout:'text-hero',effects:['badge'],bgColor1:'#f093fb',bgColor2:'#f5576c',title:'今すぐ\n試してみて',subtitle:'',titleColor:'#fff',subColor:'#ddd',badgeText:'無料ダウンロード',badgeColor:'#fff',badgeTextColor:'#c00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'minimal3',
    name:'ミニマル3枚',
    desc:'シンプルに3枚でまとめる。スタイリッシュ',
    slides:[
      {bgStyle:'white-accent',phoneLayout:'center-large',effects:[],bgColor1:'#fff',bgColor2:'#fff',accentColor:'#0A84FF',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#1a1a1a',subColor:'#555',fontId:'noto',fontWeight:'900',titleSize:105},
      {bgStyle:'white-accent',phoneLayout:'text-top',effects:[],bgColor1:'#fff',bgColor2:'#fff',accentColor:'#30D158',title:'一番の\n特徴はこれ',subtitle:'詳細説明をここに',titleColor:'#1a1a1a',subColor:'#555',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'white-accent',phoneLayout:'text-hero',effects:['badge'],bgColor1:'#fff',bgColor2:'#fff',accentColor:'#FF9F0A',title:'今すぐ\n始めよう',subtitle:'',titleColor:'#1a1a1a',subColor:'#555',badgeText:'App Storeで無料配信',badgeColor:'#0A84FF',badgeTextColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:110},
    ]
  },
  {
    id:'widget3',
    name:'ウィジェット紹介3枚',
    desc:'ウィジェット機能をアピールする構成',
    slides:[
      {bgStyle:'grad-diag',phoneLayout:'widget-showcase',effects:['glow'],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'ウィジェットで\nもっと便利に',subtitle:'ホーム画面からすぐアクセス',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'grad-diag',phoneLayout:'widget-phone',effects:['glow'],bgColor1:'#4facfe',bgColor2:'#00f2fe',title:'アプリと連携',subtitle:'リアルタイムで情報を表示',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'grad-diag',phoneLayout:'text-hero',effects:['glow','badge'],bgColor1:'#30D158',bgColor2:'#34C759',title:'今すぐ\nダウンロード',subtitle:'',titleColor:'#fff',subColor:'#fff',badgeText:'ウィジェット対応',badgeColor:'#fff',badgeTextColor:'#1a6e00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'theme3',
    name:'テーマ紹介3枚',
    desc:'豊富なテーマ・カラーをアピール',
    slides:[
      {bgStyle:'dark',phoneLayout:'theme-compare',effects:['glow'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#BF5AF2',title:'ライト & ダーク\n自由に切り替え',subtitle:'目に優しいデザイン',titleColor:'#fff',subColor:'#aaa',themeLabel1:'Light',themeLabel2:'Dark',fontId:'noto',fontWeight:'900',titleSize:95},
      {bgStyle:'grad-vert',phoneLayout:'theme-grid',effects:['glow'],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'10種類以上の\nカラーテーマ',subtitle:'あなた好みにカスタマイズ',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:100},
      {bgStyle:'grad-diag',phoneLayout:'text-hero',effects:['glow','badge'],bgColor1:'#FF375F',bgColor2:'#FF2D55',title:'自分だけの\nスタイルを',subtitle:'',titleColor:'#fff',subColor:'#fff',badgeText:'テーマ機能搭載',badgeColor:'#fff',badgeTextColor:'#c00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'allFeatures5',
    name:'フル機能5枚',
    desc:'アプリ・ウィジェット・テーマを全部紹介',
    slides:[
      {bgStyle:'grad-diag',phoneLayout:'center-large',effects:['glow'],bgColor1:'#0A84FF',bgColor2:'#5856D6',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:105},
      {bgStyle:'grad-diag',phoneLayout:'widget-showcase',effects:['glow'],bgColor1:'#30D158',bgColor2:'#34C759',title:'便利なウィジェット',subtitle:'ホーム画面に追加しよう',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'dark',phoneLayout:'theme-compare',effects:['glow','deco'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#BF5AF2',title:'ライト & ダーク\n両対応',subtitle:'お好みで切り替え',titleColor:'#fff',subColor:'#aaa',themeLabel1:'Light',themeLabel2:'Dark',fontId:'noto',fontWeight:'900',titleSize:95},
      {bgStyle:'grad-vert',phoneLayout:'feature-list',effects:[],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'できること',subtitle:'',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'700',titleSize:100,featureItems:'📌 機能その1\n🎯 機能その2\n💡 機能その3\n🔔 機能その4\n❤️ 機能その5'},
      {bgStyle:'grad-diag',phoneLayout:'multi-device',effects:['glow','badge'],bgColor1:'#FF9F0A',bgColor2:'#FF6B00',title:'iPhone・iPad\nウィジェット対応',subtitle:'すべてのデバイスで',titleColor:'#fff',subColor:'#fff',badgeText:'App Storeで配信中',badgeColor:'#fff',badgeTextColor:'#a04000',fontId:'dela',fontWeight:'400',titleSize:100},
    ]
  },
];

function showTemplates(){
  const grid=document.getElementById('tpl-grid');
  grid.innerHTML='';
  TEMPLATES.forEach(tpl=>{
    const card=document.createElement('div');
    card.className='tpl-card';
    card.onclick=()=>applyTemplate(tpl);
    // Mini thumbs
    const thumbs=document.createElement('div');
    thumbs.className='tpl-thumbs';
    const dev=DEVS[curDev];
    const maxShow=Math.min(tpl.slides.length,4);
    for(let i=0;i<maxShow;i++){
      const c=document.createElement('canvas');
      const tw=50,th=Math.round(tw*dev.h/dev.w);
      c.width=tw;c.height=th;
      const s={...defSlide(),...tpl.slides[i],screenshotImg:null,screenshotImg2:null,screenshotImgIpad:null};
      renderSlide(c.getContext('2d'),tw,th,s);
      thumbs.appendChild(c);
    }
    const info=document.createElement('div');info.className='tpl-info';
    info.innerHTML=`<div class="tpl-name">${tpl.name}</div><div class="tpl-desc">${tpl.desc}</div><div class="tpl-slides">${tpl.slides.length}枚構成</div>`;
    const applyBtn=document.createElement('button');
    applyBtn.textContent='この構成で始める';
    applyBtn.style.cssText='width:calc(100% - 20px);margin:0 10px 10px;padding:9px;border-radius:8px;border:none;background:var(--acc);color:#fff;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;-webkit-tap-highlight-color:transparent';
    applyBtn.onclick=(e)=>{e.stopPropagation();applyTemplate(tpl);};
    card.onclick=null;// カードタップでは何もしない
    card.appendChild(thumbs);card.appendChild(info);card.appendChild(applyBtn);
    grid.appendChild(card);
  });
  document.getElementById('tpl-modal').style.display='flex';
}
function hideTpl(){
  document.getElementById('tpl-modal').style.display='none';
}
function applyTemplate(tpl){
  pushUndo();
  slides=tpl.slides.map(s=>({...defSlide(),...s,screenshotImg:null,screenshotImg2:null,screenshotImg3:null,screenshotImg4:null,screenshotImgIpad:null,widgetSmallImg:null,widgetMediumImg:null,widgetLargeImg:null,_src:'',_src2:'',_src3:'',_src4:'',_srcIpad:'',_srcWidgetSmall:'',_srcWidgetMedium:'',_srcWidgetLarge:''}));
  curSlide=0;
  hideTpl();
  renderThumbs();
  if(inStep===2)buildFields();
  render();
  showToast(`「${tpl.name}」を適用しました！テキストを編集してね ✏️`);
}

/* ═══ ALL SIZES ZIP ═══ */
async function exportAllSizesZip(){
  if(typeof JSZip==='undefined'){showToast('ZIPライブラリを読み込み中...');return;}
  const targetDevs=Object.keys(DEVS);
  showToast(`全${targetDevs.length}サイズ × ${slides.length}枚 を作成中...`);
  const zip=new JSZip();
  for(const devId of targetDevs){
    const dev=DEVS[devId];
    const folder=zip.folder(devId);
    for(let i=0;i<slides.length;i++){
      await new Promise(resolve=>{
        const oc=document.createElement('canvas');
        oc.width=dev.w;oc.height=dev.h;
        renderSlide(oc.getContext('2d'),dev.w,dev.h,slides[i]);
        oc.toBlob(blob=>{
          blob.arrayBuffer().then(buf=>{
            folder.file(`slide${i+1}.png`,buf);
            resolve();
          });
        },'image/png');
      });
    }
  }
  const blob=await zip.generateAsync({type:'blob'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`preview_allsizes_${slides.length}slides.zip`;
  a.click();
  showToast(`全サイズZIPを書き出しました 🗜`);
}
window.onload=async()=>{
  await document.fonts.ready;
  initAllCanvas();
  buildStep1();
  updateUndoBtn();
  iphoneSetup();
  // Start with dashboard
  showDashboard();
};

/* ═══ IPHONE SUPPORT ═══ */
function isIphone(){return window.innerWidth<=479;}
function isIpadDev(){return curDev.startsWith('ipad');}
// Return the appropriate screenshot image for current device
function getScreenshot(s){return isIpadDev()?(s.screenshotImgIpad||null):s.screenshotImg;}

function iphoneSetup(){
  const nav=document.getElementById('iphone-nav');
  const s2tab=document.getElementById('s2-tab-bar');
  if(!nav||!s2tab)return;

  const apply=()=>{
    const iph=isIphone();
    nav.style.display=(iph&&!inDashboard)?'flex':'none';
    s2tab.style.display=(iph&&!inDashboard&&inStep===2)?'flex':'none';
    if(iph&&!inDashboard) iphoneApplyStep();
  };
  apply();
  window.addEventListener('resize',apply);
}

function switchEditTab(id,btn){
  document.querySelectorAll('#s2-tab-bar button').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.s2-pane').forEach(p=>p.classList.remove('active'));
  const pane=document.getElementById('s2p-'+id);
  if(pane) pane.classList.add('active');
}

function iphoneApplyStep(){
  if(!isIphone())return;
  const partsBtn=document.getElementById('inav-parts');
  // Step1: hide ← パーツ（いらない）/ Step2: show it as back button
  if(partsBtn) partsBtn.classList.toggle('iph-hidden', inStep===1);
  // Step2: default to bg tab
  if(inStep===2){
    const firstBtn=document.querySelector('#s2-tab-bar button');
    switchEditTab('bg', firstBtn);
  }
}

function iphoneNavParts(){
  goStep(1); // just go back to step1, goStep handles everything
}
function iphoneShowDevMenu(){
  // Build buttons
  const iphoneDevs=['6.9','6.7','6.5','5.5'];
  const ipadDevs=['ipad13','ipad11','ipad97'];
  const btnStyle=`padding:10px 6px;border-radius:8px;border:1.5px solid var(--b1);background:var(--card);color:var(--dm);font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center;transition:.14s`;
  const selStyle=`padding:10px 6px;border-radius:8px;border:1.5px solid var(--acc);background:var(--adim);color:var(--acc);font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:center`;

  function makeBtn(id){
    const dev=DEVS[id];
    const btn=document.createElement('button');
    btn.style.cssText=(curDev===id?selStyle:btnStyle);
    btn.innerHTML=`<div style="font-size:13px">${id.startsWith('ipad')?id.replace('ipad','')+'\"':id+'"'}</div><div style="font-size:9px;opacity:.7;margin-top:2px">${dev.w}×${dev.h}</div>`;
    btn.onclick=()=>{setDevice(id);iphoneHideDevMenu();showToast(`${dev.lbl} に変更しました`);};
    return btn;
  }

  const iGrid=document.getElementById('iph-dev-btns-iphone');
  const padGrid=document.getElementById('iph-dev-btns-ipad');
  iGrid.innerHTML=''; padGrid.innerHTML='';
  iphoneDevs.forEach(id=>iGrid.appendChild(makeBtn(id)));
  ipadDevs.forEach(id=>padGrid.appendChild(makeBtn(id)));

  document.getElementById('iphone-dev-sheet').classList.add('open');
}
function iphoneHideDevMenu(){
  document.getElementById('iphone-dev-sheet').classList.remove('open');
}

function iphoneShowSlides(){
  renderIphoneSlides();
  document.getElementById('iphone-slides-sheet').classList.add('open');
}
function iphoneHideSlides(){
  document.getElementById('iphone-slides-sheet').classList.remove('open');
}
function renderIphoneSlides(){
  const grid=document.getElementById('iphone-sl');
  if(!grid)return;
  grid.innerHTML='';
  const dev=DEVS[curDev];
  slides.forEach((s,i)=>{
    const wrap=document.createElement('div');
    wrap.style.cssText='display:flex;flex-direction:column;gap:6px;flex-shrink:0;width:160px;scroll-snap-align:start';

    // Thumbnail
    const div=document.createElement('div');
    div.className='sth'+(i===curSlide?' active':'');
    div.style.cssText='cursor:pointer;position:relative;border-radius:8px;overflow:hidden;border:2px solid '+(i===curSlide?'var(--acc)':'var(--b1)');
    div.onclick=()=>{selectSlide(i);iphoneHideSlides();};
    const tw=136;
    const tc=document.createElement('canvas');
    tc.width=tw;tc.height=Math.round(tw*dev.h/dev.w);
    renderSlide(tc.getContext('2d'),tc.width,tc.height,s);
    tc.style.cssText='width:100%;height:auto;display:block';
    const n=document.createElement('div');
    n.style.cssText='position:absolute;bottom:4px;left:4px;background:rgba(0,0,0,.72);color:#fff;font-size:9px;font-weight:800;padding:1px 5px;border-radius:4px';
    n.textContent=i+1;
    div.appendChild(tc);div.appendChild(n);

    // Buttons row — always visible below thumbnail
    const btns=document.createElement('div');
    btns.style.cssText='display:flex;gap:4px';

    // Reorder buttons row
    const reorderRow=document.createElement('div');
    reorderRow.style.cssText='display:flex;gap:4px';
    const moveUpBtn=document.createElement('button');
    moveUpBtn.innerHTML='↑';
    moveUpBtn.style.cssText='flex:1;padding:6px 0;border-radius:7px;border:1px solid var(--b2);background:var(--card);color:var(--dm);font-size:13px;font-family:inherit;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:'+(i===0?'.3':'1');
    moveUpBtn.disabled=i===0;
    moveUpBtn.onclick=(e)=>{e.stopPropagation();if(i===0)return;pushUndo();const moved=slides.splice(i,1)[0];slides.splice(i-1,0,moved);if(curSlide===i)curSlide=i-1;else if(curSlide===i-1)curSlide=i;renderThumbs();renderIphoneSlides();render();showToast('スライドを移動しました');};
    const moveDownBtn=document.createElement('button');
    moveDownBtn.innerHTML='↓';
    moveDownBtn.style.cssText='flex:1;padding:6px 0;border-radius:7px;border:1px solid var(--b2);background:var(--card);color:var(--dm);font-size:13px;font-family:inherit;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:'+(i===slides.length-1?'.3':'1');
    moveDownBtn.disabled=i===slides.length-1;
    moveDownBtn.onclick=(e)=>{e.stopPropagation();if(i>=slides.length-1)return;pushUndo();const moved=slides.splice(i,1)[0];slides.splice(i+1,0,moved);if(curSlide===i)curSlide=i+1;else if(curSlide===i+1)curSlide=i;renderThumbs();renderIphoneSlides();render();showToast('スライドを移動しました');};
    reorderRow.appendChild(moveUpBtn);reorderRow.appendChild(moveDownBtn);

    const dupBtn=document.createElement('button');
    dupBtn.innerHTML='⧉ 複製';
    dupBtn.style.cssText='flex:1;padding:7px 0;border-radius:7px;border:1px solid var(--b2);background:var(--card);color:var(--dm);font-size:11px;font-family:inherit;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent';
    dupBtn.onclick=()=>{dupSlide(i);renderIphoneSlides();showToast('複製しました');};

    const saveBtn=document.createElement('button');
    saveBtn.innerHTML='↓ 保存';
    saveBtn.style.cssText='flex:1;padding:7px 0;border-radius:7px;border:1px solid rgba(10,132,255,.4);background:rgba(10,132,255,.1);color:var(--acc);font-size:11px;font-family:inherit;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent';
    saveBtn.onclick=()=>{exportSlide(i);};

    const delBtn=document.createElement('button');
    delBtn.innerHTML='✕ 削除';
    delBtn.style.cssText='flex:1;padding:7px 0;border-radius:7px;border:1px solid rgba(255,69,58,.35);background:rgba(255,69,58,.08);color:var(--red);font-size:11px;font-family:inherit;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent';
    delBtn.onclick=()=>{
      if(slides.length===1){showToast('最低1枚必要です');return;}
      delSlide(i);renderIphoneSlides();
    };

    btns.appendChild(dupBtn);btns.appendChild(saveBtn);btns.appendChild(delBtn);
    wrap.appendChild(div);wrap.appendChild(reorderRow);wrap.appendChild(btns);
    grid.appendChild(wrap);
  });
}
