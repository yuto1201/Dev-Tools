/* ═══ ヘッダー ドロップダウン ═══ */
function toggleDropdown(btn){
  const dd=btn.closest('.hdr-dropdown');
  const wasOpen=dd.classList.contains('open');
  closeDropdowns();
  if(!wasOpen) dd.classList.add('open');
}
function closeDropdowns(){
  document.querySelectorAll('.hdr-dropdown.open').forEach(d=>d.classList.remove('open'));
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.hdr-dropdown')) closeDropdowns();
});

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
  if(inStep===3)buildStep3();
}

const DEVICE_CATALOG={
  iphone:[
    {model:'iPhone 16 Pro Max',inch:'6.9"',pixels:'1320×2868',ppi:'460',ratio:'19.5:9',appKey:'6.9'},
    {model:'iPhone 16 Plus / 15 Plus / 14 Plus',inch:'6.7"',pixels:'1290×2796',ppi:'458',ratio:'19.5:9',appKey:'6.7'},
    {model:'iPhone 16 Pro',inch:'6.3"',pixels:'1206×2622',ppi:'460',ratio:'19.5:9'},
    {model:'iPhone 16 / 15 / 14',inch:'6.1"',pixels:'1179×2556',ppi:'460',ratio:'19.5:9'},
    {model:'iPhone 13 / 13 Pro / 12 / 12 Pro',inch:'6.1"',pixels:'1170×2532',ppi:'460',ratio:'19.5:9'},
    {model:'iPhone 13 mini / 12 mini',inch:'5.4"',pixels:'1080×2340',ppi:'476',ratio:'19.5:9'},
    {model:'iPhone 11 Pro Max / XS Max',inch:'6.5"',pixels:'1242×2688',ppi:'458',ratio:'19.5:9',appKey:'6.5'},
    {model:'iPhone 11 Pro / XS / X',inch:'5.8"',pixels:'1125×2436',ppi:'458',ratio:'19.5:9'},
    {model:'iPhone 11 / XR',inch:'6.1"',pixels:'828×1792',ppi:'326',ratio:'19.5:9'},
    {model:'iPhone 8 Plus / 7 Plus / 6s Plus / 6 Plus',inch:'5.5"',pixels:'1242×2208',ppi:'401',ratio:'16:9',appKey:'5.5'},
    {model:'iPhone SE (第3/2世代) / 8 / 7 / 6s / 6',inch:'4.7"',pixels:'750×1334',ppi:'326',ratio:'16:9'},
    {model:'iPhone SE (第1世代) / 5s / 5c / 5',inch:'4.0"',pixels:'640×1136',ppi:'326',ratio:'16:9'},
  ],
  ipad:[
    {model:'iPad Pro 13" (M4)',inch:'13"',pixels:'2064×2752',ppi:'264',ratio:'4:3'},
    {model:'iPad Pro 12.9" (第3〜6世代)',inch:'12.9"',pixels:'2048×2732',ppi:'264',ratio:'4:3',appKey:'ipad13'},
    {model:'iPad Air 13" (M2)',inch:'13"',pixels:'2048×2732',ppi:'264',ratio:'4:3',appKey:'ipad13'},
    {model:'iPad Pro 11" (第1〜4世代)',inch:'11"',pixels:'1668×2388',ppi:'264',ratio:'4:3',appKey:'ipad11'},
    {model:'iPad Air 11" (M2) / Air 10.9" (第4/5世代) / iPad (第10世代)',inch:'10.9"〜11"',pixels:'1640×2360',ppi:'264',ratio:'4:3'},
    {model:'iPad Pro 10.5"',inch:'10.5"',pixels:'1668×2224',ppi:'264',ratio:'4:3'},
    {model:'iPad (第9/8/7世代) 10.2"',inch:'10.2"',pixels:'1620×2160',ppi:'264',ratio:'4:3'},
    {model:'iPad (第6/5世代) / iPad Pro 9.7" / Air 2 / Air',inch:'9.7"',pixels:'1536×2048',ppi:'264',ratio:'4:3',appKey:'ipad97'},
    {model:'iPad mini (第6世代)',inch:'8.3"',pixels:'1488×2266',ppi:'326',ratio:'3:2'},
    {model:'iPad mini (第5〜1世代)',inch:'7.9"',pixels:'1536×2048',ppi:'326',ratio:'4:3'},
  ]
};

function renderDeviceCatalogTable(tableId,rows){
  const table=document.getElementById(tableId);
  if(!table)return;
  table.innerHTML='';

  const thead=document.createElement('thead');
  const htr=document.createElement('tr');
  ['モデル','画面サイズ','解像度(px)','PPI','比率','アプリ対応','操作'].forEach(t=>{
    const th=document.createElement('th');
    th.textContent=t;
    htr.appendChild(th);
  });
  thead.appendChild(htr);

  const tbody=document.createElement('tbody');
  rows.forEach(row=>{
    const tr=document.createElement('tr');
    if(row.appKey)tr.className='is-supported';

    const modelTd=document.createElement('td');
    const strong=document.createElement('span');
    strong.className='devdb-model';
    strong.textContent=row.model;
    modelTd.appendChild(strong);
    tr.appendChild(modelTd);

    const inchTd=document.createElement('td');inchTd.textContent=row.inch;tr.appendChild(inchTd);
    const pxTd=document.createElement('td');pxTd.textContent=row.pixels;tr.appendChild(pxTd);
    const ppiTd=document.createElement('td');ppiTd.textContent=row.ppi;tr.appendChild(ppiTd);
    const ratioTd=document.createElement('td');ratioTd.textContent=row.ratio;tr.appendChild(ratioTd);

    const supTd=document.createElement('td');
    if(row.appKey){
      const chip=document.createElement('span');
      chip.className='devdb-chip';
      chip.textContent='対応';
      supTd.appendChild(chip);
    }else{
      supTd.textContent='-';
    }
    tr.appendChild(supTd);

    const actionTd=document.createElement('td');
    if(row.appKey){
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='devdb-use-btn';
      btn.textContent='このサイズで作業';
      btn.onclick=()=>{
        setDevice(row.appKey);
        hideDeviceCatalog();
        showToast(`${DEVS[row.appKey].lbl} に切り替えました`);
      };
      actionTd.appendChild(btn);
    }else{
      actionTd.textContent='-';
    }
    tr.appendChild(actionTd);

    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
}
function showDeviceCatalog(){
  renderDeviceCatalogTable('devdb-iphone',DEVICE_CATALOG.iphone);
  renderDeviceCatalogTable('devdb-ipad',DEVICE_CATALOG.ipad);
  const modal=document.getElementById('device-catalog-modal');
  if(modal)modal.style.display='flex';
}
function hideDeviceCatalog(){
  const modal=document.getElementById('device-catalog-modal');
  if(modal)modal.style.display='none';
}
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  const modal=document.getElementById('device-catalog-modal');
  if(modal&&modal.style.display==='flex')hideDeviceCatalog();
});

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
  if(inStep===2)buildFields();
  if(inStep===3)buildStep3();
  updateUndoBtn();
  showToast('元に戻しました ↩');
}
function redo(){
  if(!redoStack.length)return;
  const current=serializeSlides();
  undoStack.push(current);
  const snap=redoStack.pop();
  deserializeSlides(snap);
  if(inStep===2)buildFields();
  if(inStep===3)buildStep3();
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
  if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();if(!inDashboard)saveProjectToStorage();}
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
function drawPhone(ctx,x,y,w,h,s,forceIphone){
  const ipad=forceIphone?false:isIpadDev();
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
  const scImg=forceIphone?s.screenshotImg:getScreenshot(s);
  if(scImg){
    drawImgCover(ctx,scImg,sx,sy,sw,sh,s.screenshotScale,s.screenshotOffsetX,s.screenshotOffsetY);
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
  {id:'gradient',name:'グラデーション',desc:'2色グラデ（角度調整可）',
   mini:(c,W,H)=>{drawGrad(c,W,H,'#0A84FF','#5AC8FA',135);},
   draw:(c,W,H,s)=>{drawGrad(c,W,H,s.bgColor1||'#0A84FF',s.bgColor2||'#5AC8FA',s.bgAngle!=null?s.bgAngle:135);}},
  {id:'solid',name:'単色',desc:'シンプルな単色背景',
   mini:(c,W,H)=>{c.fillStyle='#667EEA';c.fillRect(0,0,W,H);},
   draw:(c,W,H,s)=>{c.fillStyle=s.bgColor1||'#667EEA';c.fillRect(0,0,W,H);}},
  {id:'split',name:'スプリット',desc:'カーブで上下分割（曲がり調整可）',
   mini:(c,W,H)=>{c.fillStyle='#667EEA';c.fillRect(0,0,W,H);c.fillStyle='#eef0ff';c.beginPath();c.moveTo(0,H*.45);c.quadraticCurveTo(W*.5,H*.58,W,H*.45);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();},
   draw:(c,W,H,s)=>{
     const curve=(s.splitCurve!=null?s.splitCurve:30)/100;
     c.fillStyle=s.bgColor1||'#667EEA';c.fillRect(0,0,W,H);
     c.fillStyle=s.bgColor2||'#eef0ff';
     const midY=H*.5,bulge=H*curve;
     c.beginPath();c.moveTo(0,midY);
     c.bezierCurveTo(W*.33,midY+bulge,W*.67,midY-bulge,W,midY);
     c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
   }},
  {id:'radial',name:'ラジアル',desc:'中心から外側への放射状グラデ',
   mini:(c,W,H)=>{const g=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.4,W*.8);g.addColorStop(0,'#FF6B6B');g.addColorStop(1,'#5856D6');c.fillStyle=g;c.fillRect(0,0,W,H);},
   draw:(c,W,H,s)=>{
     const cx=W*.5,cy=H*((s.radialY!=null?s.radialY:40)/100);
     const r=Math.max(W,H)*((s.radialSize!=null?s.radialSize:80)/100);
     const g=c.createRadialGradient(cx,cy,0,cx,cy,r);
     g.addColorStop(0,s.bgColor1||'#FF6B6B');g.addColorStop(1,s.bgColor2||'#5856D6');
     c.fillStyle=g;c.fillRect(0,0,W,H);
   }},
  {id:'mesh',name:'メッシュ',desc:'複数色のぼかしブロブが重なるApple風',
   mini:(c,W,H)=>{
     c.fillStyle='#1a1040';c.fillRect(0,0,W,H);
     c.save();c.filter='blur('+W*.18+'px)';
     c.globalAlpha=.7;c.fillStyle='#0A84FF';c.beginPath();c.ellipse(W*.25,H*.3,W*.35,W*.35,0,0,Math.PI*2);c.fill();
     c.fillStyle='#BF5AF2';c.beginPath();c.ellipse(W*.75,H*.25,W*.3,W*.3,0,0,Math.PI*2);c.fill();
     c.fillStyle='#FF375F';c.beginPath();c.ellipse(W*.5,H*.7,W*.35,W*.35,0,0,Math.PI*2);c.fill();
     c.restore();},
   draw:(c,W,H,s)=>{
     c.fillStyle=s.bgColor1||'#1a1040';c.fillRect(0,0,W,H);
     const c1=s.bgColor2||'#0A84FF',c2=s.meshColor3||'#BF5AF2',c3=s.meshColor4||'#FF375F';
     const blur=W*.15;
     c.save();c.filter='blur('+blur+'px)';c.globalAlpha=.7;
     c.fillStyle=c1;c.beginPath();c.ellipse(W*.2,H*.25,W*.45,W*.45,0,0,Math.PI*2);c.fill();
     c.fillStyle=c2;c.beginPath();c.ellipse(W*.8,H*.2,W*.4,W*.4,0,0,Math.PI*2);c.fill();
     c.fillStyle=c3;c.beginPath();c.ellipse(W*.5,H*.72,W*.45,W*.45,0,0,Math.PI*2);c.fill();
     c.restore();
   }},
  {id:'pattern',name:'パターン',desc:'ドット・ストライプ等の幾何学模様',
   mini:(c,W,H)=>{
     c.fillStyle='#667EEA';c.fillRect(0,0,W,H);
     c.fillStyle='rgba(255,255,255,.12)';
     for(let y=0;y<H;y+=W*.12)for(let x=0;x<W;x+=W*.12){c.beginPath();c.arc(x,y,W*.025,0,Math.PI*2);c.fill();}
   },
   draw:(c,W,H,s)=>{
     c.fillStyle=s.bgColor1||'#667EEA';c.fillRect(0,0,W,H);
     const pt=s.patternType||'dots';
     const col=s.bgColor2||'#ffffff';
     const opacity=(s.patternOpacity!=null?s.patternOpacity:12)/100;
     const gap=W*((s.patternScale!=null?s.patternScale:50)/500+.04);
     c.save();c.fillStyle=ha(col,opacity);c.strokeStyle=ha(col,opacity);c.lineWidth=Math.max(1,W*.004);
     if(pt==='dots'){
       for(let y=0;y<H+gap;y+=gap)for(let x=0;x<W+gap;x+=gap){c.beginPath();c.arc(x,y,gap*.1,0,Math.PI*2);c.fill();}
     }else if(pt==='stripes'){
       const ang=(s.bgAngle!=null?s.bgAngle:45)*Math.PI/180;
       c.translate(W/2,H/2);c.rotate(ang);c.translate(-W/2,-H/2);
       const diag=Math.sqrt(W*W+H*H);
       for(let x=-diag;x<diag*2;x+=gap){c.fillRect(x,-diag,gap*.3,diag*3);}
     }else if(pt==='grid'){
       for(let x=0;x<W+gap;x+=gap){c.fillRect(x,0,Math.max(1,W*.002),H);}
       for(let y=0;y<H+gap;y+=gap){c.fillRect(0,y,W,Math.max(1,W*.002));}
     }else if(pt==='diamonds'){
       const sz=gap*.35;
       for(let row=0;row<H/gap+1;row++)for(let col2=0;col2<W/gap+1;col2++){
         const cx2=col2*gap+(row%2?gap*.5:0),cy2=row*gap;
         c.beginPath();c.moveTo(cx2,cy2-sz);c.lineTo(cx2+sz,cy2);c.lineTo(cx2,cy2+sz);c.lineTo(cx2-sz,cy2);c.closePath();c.fill();
       }
     }
     c.restore();
   }},
];
/* 旧ID → 新IDマッピング（保存済みプロジェクトの後方互換） */
const BG_COMPAT={'grad-diag':'gradient','grad-vert':'gradient','white-accent':'solid','dark':'gradient'};
function resolveBgStyle(id){return BG_COMPAT[id]||id;}

/* ═══ PHONE LAYOUTS ═══ */
function miniBase(c,W,H){drawGrad(c,W,H,'#1c2d50','#263660',135);}

/* Device aspect ratio from current selection */
function getDeviceAR(){return DEVS[curDev].h/DEVS[curDev].w;}
function getIphoneAR(){return DEVS['6.9'].h/DEVS['6.9'].w;}

const PHONE_LAYOUTS=[

  // 1. テキスト上：テキスト上部20%、iPhoneが画面の大部分を占める
  {id:'text-top',name:'テキスト上',desc:'テキストが上、iPhoneが下',cat:'fixed',
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
  {id:'text-bottom',name:'テキスト下',desc:'iPhoneが上、テキストが下',cat:'fixed',
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
  {id:'center-large',name:'フルスクリーン↓',desc:'大きなiPhone、テキストを下に重ねる',cat:'fixed',
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
  {id:'center-large-top',name:'フルスクリーン↑',desc:'大きなiPhone、テキストを上に重ねる',cat:'fixed',
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
  {id:'screen-fill',name:'全面スクショ↓',desc:'スクショを全画面、テキストを下に重ねる',cat:'fixed',
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
  {id:'screen-fill-top',name:'全面スクショ↑',desc:'スクショを全画面、テキストを上に重ねる',cat:'fixed',
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
  {id:'tilted',name:'傾き',desc:'傾きをスライダーで調整',cat:'custom',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.06,'center',W);
     const pw=W*.58,ph=pw*getDeviceAR();
     miniPhone(c,(W-pw)/2,H*.28,pw,ph,undefined,undefined,10*Math.PI/180);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.06+getTextOffsetY(s)*H*.002,ta:'center',
     px:(W-W*.68)/2,py:H*.28,pw:W*.68,ph:W*.68*getDeviceAR()})},

  // 8. ウィジェット紹介：ウィジェット画像を小中大で並べて表示
  // 9. ウィジェット+iPhone：ウィジェットを上、iPhoneを下に重ねて配置
  {id:'widget-phone',name:'ウィジェット+iPhone',desc:'ウィジェットとiPhoneを重ねてアピール',cat:'custom',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.04,'center',W);
     // Widget (large square)
     const ww=W*.7,wh=ww*.7,wx=(W-ww)/2,wy=H*.18;
     rr(c,wx,wy,ww,wh,W*.04);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     // iPhone overlapping below
     const pw=W*.32,ph=pw*getDeviceAR();
     miniPhone(c,W*.5-pw/2,wy+wh-ph*.15,pw,ph);
   },
   zone:(W,H,s)=>{
     return{tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
            px:-9999,py:-9999,pw:0,ph:0,widgetPhoneV:true};
   }},

  // 10. テキスト強調：テキストが主役、小さなiPhoneがアクセント
  {id:'text-hero',name:'テキスト強調',desc:'テキストが主役、iPhoneはアクセント',cat:'fixed',
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
  {id:'feature-list',name:'機能リスト',desc:'アイコン＋テキストの箇条書き風',cat:'fixed',
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

  // 15. ウィジェットグリッド：任意のウィジェットをグリッドで整列
  {id:'widget-grid',name:'ウィジェットグリッド',desc:'小中大特大を自由に組み合わせて整列',cat:'custom',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     miniTextLines(c,W/2,H*.05,'center',W);
     const u=W*.21,g=W*.04,ox=W*.06,oy=H*.22;
     // 特大 (4x2)
     rr(c,ox,oy,u*4+g*3,u*2+g,u*.18);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     // 大 (2x2)
     rr(c,ox,oy+u*2+g*2,u*2+g,u*2+g,u*.18);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     // 小 (1x1)
     rr(c,ox+u*2+g*2,oy+u*2+g*2,u,u,u*.18);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     rr(c,ox+u*2+g*2,oy+u*3+g*3,u,u,u*.18);c.fillStyle='rgba(60,100,200,.35)';c.fill();
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,widgetGrid:true})},

  // 16. マルチiPhone：複数のiPhoneを自由に配置
  {id:'multi-phone',name:'マルチiPhone',desc:'複数のiPhoneを並べて配置',cat:'custom',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     const pw=W*.28,ph=pw*getDeviceAR();
     miniPhone(c,W*.02,H*.25,pw,ph);
     miniPhone(c,W*.3,H*.2,pw,ph);
     miniPhone(c,W*.58,H*.25,pw,ph);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,multiPhone:true})},

  // 16. フリー配置：iPhone/iPad/Watchを自由に配置
  {id:'free-device',name:'フリー配置',desc:'各デバイスの位置・サイズを自由に調整',cat:'custom',
   mini:(c,W,H)=>{
     miniBase(c,W,H);
     // MacBook
     const mw=W*.5,mh=mw*.625,mx=W*.04,my=H*.1;
     rr(c,mx,my,mw,mh*.82,W*.01);c.fillStyle='rgba(30,30,30,.9)';c.fill();
     rr(c,mx+W*.02,my+W*.02,mw-W*.04,mh*.82-W*.04,W*.008);c.fillStyle='rgba(40,60,120,.4)';c.fill();
     rr(c,mx-mw*.02,my+mh*.82,mw*1.04,mh*.18,W*.005);c.fillStyle='rgba(50,50,52,.9)';c.fill();
     // iPhone
     const pw=W*.22,ph=pw*getDeviceAR();
     miniPhone(c,W*.58,H*.22,pw,ph);
     // Watch
     const awW=W*.17,awH=awW*1.22;
     rr(c,W*.62,H*.65,awW,awH,awW*.25);c.fillStyle='rgba(20,20,20,.9)';c.fill();
     rr(c,W*.64,H*.67,awW-W*.04,awH-W*.04,awW*.2);c.fillStyle='rgba(60,100,200,.35)';c.fill();
     // Free icon
     c.fillStyle='rgba(255,255,255,.4)';c.font=`${W*.12}px sans-serif`;c.textAlign='center';c.fillText('✦',W*.5,H*.92);
   },
   zone:(W,H,s)=>({tx:W/2,ty:H*.04+getTextOffsetY(s)*H*.002,ta:'center',
     px:-9999,py:-9999,pw:0,ph:0,freeDevice:true})},
];


/* ═══ EFFECTS ═══ */
const EFFECTS=[
  {id:'glow',name:'グロウ',desc:'テキストに光る発光エフェクト',icon:'✨'},
  {id:'deco',name:'デコシェイプ',desc:'背景に装飾の丸や図形を追加',icon:'🔮'},
  {id:'particles',name:'パーティクル',desc:'キラキラ光る粒子を背景に散らす',icon:'🌟'},
  {id:'grain',name:'グレインノイズ',desc:'フィルム風のザラつきテクスチャ',icon:'🎞'},
  {id:'reflection',name:'デバイス反射',desc:'iPhoneの下に薄い映り込み',icon:'🪞'},
  {id:'border',name:'ボーダー',desc:'スライド全体に余白付きの枠線',icon:'🔲'},
];

/* ═══ STATE ═══ */
const PRESETS=['#0A84FF','#30D158','#FF453A','#FF9F0A','#BF5AF2','#FF375F','#5AC8FA','#667EEA','#FFFFFF','#1a1a2e'];

function defSlide(){
  return{
    bgStyle:'gradient',phoneLayout:'text-top',effects:['glow'],
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

/* ═══ IMAGE STORAGE OPTIMIZATION ═══ */
const STORAGE_IMAGE_FIELDS=[
  ['screenshotImg','_src'],
  ['screenshotImg2','_src2'],
  ['screenshotImg3','_src3'],
  ['screenshotImg4','_src4'],
  ['screenshotImgIpad','_srcIpad'],
  ['widgetSmallImg','_srcWidgetSmall'],
  ['widgetMediumImg','_srcWidgetMedium'],
  ['widgetLargeImg','_srcWidgetLarge'],
];
const IMAGE_UPLOAD_OPT={targetBytes:260*1024,maxDim:2000,minDim:900,startQuality:0.9,minQuality:0.55,qualityStep:0.08};
const IMAGE_RECOVERY_STEPS=[
  {targetBytes:220*1024,maxDim:1800,minDim:900,startQuality:0.86,minQuality:0.5,qualityStep:0.08},
  {targetBytes:150*1024,maxDim:1500,minDim:760,startQuality:0.82,minQuality:0.45,qualityStep:0.08},
  {targetBytes:100*1024,maxDim:1200,minDim:640,startQuality:0.78,minQuality:0.4,qualityStep:0.08},
];

function dataUrlBytes(dataUrl){
  if(!dataUrl||typeof dataUrl!=='string')return 0;
  const idx=dataUrl.indexOf(',');
  if(idx<0)return dataUrl.length;
  const b64Len=dataUrl.length-idx-1;
  return Math.floor(b64Len*3/4);
}
function fileToDataUrl(file){
  return new Promise((resolve,reject)=>{
    const rd=new FileReader();
    rd.onload=ev=>resolve(ev.target.result);
    rd.onerror=()=>reject(rd.error||new Error('file read failed'));
    rd.readAsDataURL(file);
  });
}
function loadImageFromSrc(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('image load failed'));
    img.src=src;
  });
}
function encodeOptimizedImage(img,longSide,quality){
  const maxSide=Math.max(img.width||1,img.height||1);
  const scale=Math.min(1,longSide/maxSide);
  const w=Math.max(1,Math.round((img.width||1)*scale));
  const h=Math.max(1,Math.round((img.height||1)*scale));
  const canvas=document.createElement('canvas');
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');
  ctx.drawImage(img,0,0,w,h);
  let out=canvas.toDataURL('image/webp',quality);
  if(!out.startsWith('data:image/webp')) out=canvas.toDataURL('image/jpeg',quality);
  return out;
}
async function optimizeImageDataUrl(src,options={}){
  if(!src||typeof src!=='string'||!src.startsWith('data:image/'))return src;
  const opt={targetBytes:260*1024,maxDim:2000,minDim:900,startQuality:0.9,minQuality:0.55,qualityStep:0.08,force:false,...options};
  const srcBytes=dataUrlBytes(src);
  if(!opt.force&&srcBytes<=opt.targetBytes)return src;
  let img;
  try{img=await loadImageFromSrc(src);}
  catch{return src;}
  if(!img.width||!img.height)return src;
  let best=src,bestBytes=srcBytes;
  let side=Math.min(opt.maxDim,Math.max(img.width,img.height));
  while(true){
    for(let q=opt.startQuality;q>=opt.minQuality-1e-6;q-=opt.qualityStep){
      const qq=Math.max(opt.minQuality,Math.min(opt.startQuality,q));
      const out=encodeOptimizedImage(img,side,qq);
      const b=dataUrlBytes(out);
      if(b<bestBytes){best=out;bestBytes=b;}
      if(b<=opt.targetBytes)return out;
    }
    if(side<=opt.minDim)break;
    const next=Math.max(opt.minDim,Math.round(side*0.82));
    if(next===side)break;
    side=next;
  }
  return best;
}
async function compactProjectImages(stepOpt){
  let changed=false;
  for(const s of slides){
    for(const [imgKey,srcKey] of STORAGE_IMAGE_FIELDS){
      const src=s[srcKey];
      if(!src)continue;
      const optimized=await optimizeImageDataUrl(src,stepOpt);
      if(optimized===src||dataUrlBytes(optimized)>=dataUrlBytes(src))continue;
      s[srcKey]=optimized;
      try{s[imgKey]=await loadImageFromSrc(optimized);}
      catch{}
      changed=true;
    }
  }
  return changed;
}

/* ═══ PROJECT SAVE / LOAD (file) ═══ */
function saveProject(){
  const json=serializeSlides();
  const blob=new Blob([json],{type:'application/json'});
  const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;
  const name=currentProjectId?getProjectMeta(currentProjectId).name:'preview-project';
  a.download=`${name}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
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
  try{
    localStorage.setItem(PROJECT_PREFIX+id,json);
    return true;
  }catch(e){
    console.error('localStorage save failed:',e);
    return false;
  }
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

async function saveProjectToStorage(options={}){
  const silent=!!options.silent;
  if(!currentProjectId){
    if(!silent)showToast('⚠️ プロジェクトが選択されていません');
    return false;
  }
  try{
    let recoveredByCompression=false;
    let json=serializeSlides();
    let saved=setProjectData(currentProjectId,json);
    if(!saved){
      for(const stepOpt of IMAGE_RECOVERY_STEPS){
        const changed=await compactProjectImages(stepOpt);
        if(!changed)continue;
        json=serializeSlides();
        saved=setProjectData(currentProjectId,json);
        if(saved){
          recoveredByCompression=true;
          break;
        }
      }
    }
    if(!saved){
      if(!silent)showToast('⚠️ 保存に失敗しました。不要なプロジェクト削除かJSON保存を試してください');
      return false;
    }
    // Update meta
    const list=getProjectsList();
    const p=list.find(p=>p.id===currentProjectId);
    if(p){
      p.updatedAt=new Date().toISOString();
      p.slideCount=slides.length;
      saveProjectsList(list);
    }
    if(!silent)showToast(recoveredByCompression?'保存しました（画像を圧縮） 💾':'保存しました 💾');
    // Drive 同期: ログイン中なら fire-and-forget でアップロード（保存自体はブロックしない）
    if(window.driveSync){
      window.driveSync.markDirty(PROJECT_PREFIX+currentProjectId);
      window.driveSync.markDirty(PROJECTS_KEY);
    }
    return true;
  }catch(e){
    console.error('saveProjectToStorage error:',e);
    if(!silent)showToast('⚠️ 保存中にエラーが発生しました');
    return false;
  }
}

// Auto-save on changes (debounced)
let _autoSaveTimer=null;
function autoSave(){
  if(!currentProjectId||inDashboard)return;
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer=setTimeout(async()=>{
    if(!currentProjectId)return;
    await saveProjectToStorage({silent:true});
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
  // Drive 側からも削除（リスト更新も同期）
  if(window.driveSync){
    window.driveSync.markDeleted(PROJECT_PREFIX+id);
    window.driveSync.markDirty(PROJECTS_KEY);
  }
}

function duplicateProject(id,ev){
  if(ev){ev.stopPropagation();}
  const meta=getProjectMeta(id);
  const data=getProjectData(id);
  if(!meta||!data)return;
  const newId=generateId();
  const now=new Date().toISOString();
  const newMeta={id:newId,name:meta.name+' (コピー)',createdAt:now,updatedAt:now,slideCount:meta.slideCount||1};
  const list=getProjectsList();
  list.unshift(newMeta);
  saveProjectsList(list);
  setProjectData(newId,data);
  renderDashboard();
  showToast('プロジェクトを複製しました');
  if(window.driveSync){
    window.driveSync.markDirty(PROJECT_PREFIX+newId);
    window.driveSync.markDirty(PROJECTS_KEY);
  }
}

function exportProjectJson(id,ev){
  if(ev){ev.stopPropagation();}
  const meta=getProjectMeta(id);
  const data=getProjectData(id);
  if(!data)return;
  const blob=new Blob([data],{type:'application/json'});
  const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;
  a.download=`${meta?meta.name:'project'}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
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
      const newMeta={id,name,createdAt:now,updatedAt:now,slideCount:arr.length};
      const list=getProjectsList();
      list.unshift(newMeta);
      saveProjectsList(list);
      setProjectData(id,ev.target.result);
      renderDashboard();
      showToast('プロジェクトを読み込みました 📂');
      if(window.driveSync){
        window.driveSync.markDirty(PROJECT_PREFIX+id);
        window.driveSync.markDirty(PROJECTS_KEY);
      }
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
    if(p && p.name!==newName){
      p.name=newName;
      p.updatedAt=new Date().toISOString();
      saveProjectsList(list);
      if(window.driveSync) window.driveSync.markDirty(PROJECTS_KEY);
    }
    renderDashboard();
  };
  input.onblur=finish;
  input.onkeydown=e=>{if(e.key==='Enter')input.blur();if(e.key==='Escape'){input.value=meta.name;input.blur();}};
  nameEl.replaceWith(input);
  input.focus();input.select();
}

/* ═══ URL HASH ROUTING ═══
   #             → ダッシュボード
   #p/<id>       → 指定IDのプロジェクトをエディタで開く
   ブラウザの戻る/進むで行き来できる。リロード・ブックマークでも復元される。 */
function syncUrlForView(){
  const desired=inDashboard
    ? location.pathname+location.search
    : (currentProjectId?location.pathname+location.search+'#p/'+currentProjectId:location.pathname+location.search);
  // 現在のURLと差分があるときだけ pushState する
  const current=location.pathname+location.search+location.hash;
  if(current!==desired){
    try{history.pushState(null,'',desired);}catch(e){/* about:blank 等で失敗しても致命ではない */}
  }
}

function applyHashRoute(){
  const m=location.hash.match(/^#p\/(.+)$/);
  if(m){
    const id=decodeURIComponent(m[1]);
    if(!inDashboard&&currentProjectId===id) return; // 既に開いている
    const data=getProjectData(id);
    if(data){
      currentProjectId=id;
      undoStack=[];updateUndoBtn();
      deserializeSlides(data);
      inStep=1;
      showEditor({skipUrlSync:true});
      return;
    }
    // ID が見つからなければダッシュボードへフォールバック + URL も補正
    currentProjectId=null;
    try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
  }
  showDashboard({skipUrlSync:true});
}

/* ═══ VIEW SWITCHING ═══
   表示切替は body[data-view] を更新するだけ。要素ごとの display 操作は CSS が引き受ける。
   opts.skipUrlSync を渡すと URL 履歴を更新しない（popstate / 初期ロード時に使用）。 */
function showDashboard(opts){
  opts=opts||{};
  // Auto-save current project before leaving (must not block navigation)
  try{
    if(currentProjectId&&!inDashboard){
      const json=serializeSlides();
      if(setProjectData(currentProjectId,json)){
        const list=getProjectsList();
        const p=list.find(p=>p.id===currentProjectId);
        if(p){
          p.updatedAt=new Date().toISOString();
          p.slideCount=slides.length;
          saveProjectsList(list);
          if(window.driveSync){
            window.driveSync.markDirty(PROJECT_PREFIX+currentProjectId);
            window.driveSync.markDirty(PROJECTS_KEY);
          }
        }
      }
    }
  }catch(e){console.error('Auto-save on dashboard transition failed:',e);}
  inDashboard=true;
  document.body.dataset.view='dashboard';
  delete document.body.dataset.hasProject;
  renderDashboard();
  if(!opts.skipUrlSync) syncUrlForView();
}

function showEditor(opts){
  opts=opts||{};
  inDashboard=false;
  document.body.dataset.view='editor';
  updateProjNameDisplay();
  initAllCanvas();
  goStep(1);
  render();
  if(!opts.skipUrlSync) syncUrlForView();
}

/* ═══ EDITOR PANE RESIZER ═══ */
const EDITOR_PANE_WIDTH_KEY='previewgen_editor_pane_width';
const EDITOR_PANE_DEFAULT_WIDTH=430;
const EDITOR_PANE_MIN_WIDTH=300;
const EDITOR_PANE_MIN_PREVIEW_WIDTH=320;
let editorPaneWidth=EDITOR_PANE_DEFAULT_WIDTH;

function isEditorPaneResizable(){
  return window.innerWidth>1279;
}
function getActiveEditorWorkspace(){
  const id=inStep===3?'s3':(inStep===2?'s2':'s1');
  return document.getElementById(id)||document.getElementById('s2')||document.getElementById('s1');
}
function applyEditorPaneWidth(width){
  const ws=getActiveEditorWorkspace();
  const min=EDITOR_PANE_MIN_WIDTH;
  let max=min;
  if(ws){
    max=Math.max(min,ws.clientWidth-EDITOR_PANE_MIN_PREVIEW_WIDTH);
  }
  const next=Math.round(Math.max(min,Math.min(max,+width||EDITOR_PANE_DEFAULT_WIDTH)));
  editorPaneWidth=next;
  document.documentElement.style.setProperty('--editor-pane-w',next+'px');
  return next;
}
function syncEditorPaneWidthForViewport(){
  if(isEditorPaneResizable()){
    applyEditorPaneWidth(editorPaneWidth);
  }else{
    document.documentElement.style.removeProperty('--editor-pane-w');
  }
}
function initEditorPaneResizer(){
  try{
    const saved=parseInt(localStorage.getItem(EDITOR_PANE_WIDTH_KEY)||'',10);
    if(Number.isFinite(saved)&&saved>=EDITOR_PANE_MIN_WIDTH)editorPaneWidth=saved;
  }catch{}

  document.querySelectorAll('.pane-splitter').forEach(splitter=>{
    if(splitter._paneBound)return;
    splitter._paneBound=true;

    splitter.addEventListener('dblclick',()=>{
      const v=applyEditorPaneWidth(EDITOR_PANE_DEFAULT_WIDTH);
      try{localStorage.setItem(EDITOR_PANE_WIDTH_KEY,String(v));}catch{}
      if(inStep===2&&zoomIdx===-1)applyZoom();
    });

    splitter.addEventListener('pointerdown',ev=>{
      if(!isEditorPaneResizable())return;
      const ws=splitter.closest('.ws');
      if(!ws)return;
      ev.preventDefault();
      splitter.classList.add('active');
      document.body.classList.add('split-resizing');

      let rafId=0;
      const updateFromClientX=clientX=>{
        const rect=ws.getBoundingClientRect();
        const next=clientX-rect.left-splitter.offsetWidth/2;
        applyEditorPaneWidth(next);
        if(inStep===2&&zoomIdx===-1)applyZoom();
      };
      const onMove=e=>{
        if(rafId)return;
        rafId=requestAnimationFrame(()=>{
          rafId=0;
          updateFromClientX(e.clientX);
        });
      };
      const stop=()=>{
        if(rafId){cancelAnimationFrame(rafId);rafId=0;}
        splitter.classList.remove('active');
        document.body.classList.remove('split-resizing');
        document.removeEventListener('pointermove',onMove);
        document.removeEventListener('pointerup',stop);
        document.removeEventListener('pointercancel',stop);
        try{localStorage.setItem(EDITOR_PANE_WIDTH_KEY,String(editorPaneWidth));}catch{}
      };

      document.addEventListener('pointermove',onMove);
      document.addEventListener('pointerup',stop);
      document.addEventListener('pointercancel',stop);
      updateFromClientX(ev.clientX);
    });
  });

  syncEditorPaneWidthForViewport();
  window.addEventListener('resize',syncEditorPaneWidthForViewport);
}

function updateProjNameDisplay(){
  const el=document.getElementById('proj-name-display');
  if(!el)return;
  if(!currentProjectId){delete document.body.dataset.hasProject;return;}
  const meta=getProjectMeta(currentProjectId);
  if(!meta){delete document.body.dataset.hasProject;return;}
  // 表示は CSS（body[data-view="editor"][data-has-project] .proj-name-area）が制御
  document.body.dataset.hasProject='1';
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
    if(p && p.name!==newName){
      p.name=newName;
      p.updatedAt=new Date().toISOString();
      saveProjectsList(list);
      if(window.driveSync) window.driveSync.markDirty(PROJECTS_KEY);
    }
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
  const bg=BG_STYLES.find(b=>b.id===resolveBgStyle(s.bgStyle))||BG_STYLES[0];
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
  // パーティクル（背景にキラキラ粒子）
  if(s.effects.includes('particles')){
    ctx.save();
    const seed=((s.bgColor1||'#0A84FF').charCodeAt(1)*7+13)%1000;
    const count=35;
    for(let i=0;i<count;i++){
      const rng=(seed*31+i*97)%1000/1000;
      const rng2=(seed*17+i*53)%1000/1000;
      const rng3=(seed*41+i*79)%1000/1000;
      const px=rng*W,py=rng2*H;
      const sz=W*(.003+rng3*.012);
      const alpha=.15+rng3*.4;
      ctx.globalAlpha=alpha;
      ctx.fillStyle='#fff';
      ctx.beginPath();ctx.arc(px,py,sz,0,Math.PI*2);ctx.fill();
      // クロス光芒
      if(rng3>.6){
        ctx.globalAlpha=alpha*.4;
        ctx.strokeStyle='#fff';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(px-sz*3,py);ctx.lineTo(px+sz*3,py);ctx.stroke();
        ctx.beginPath();ctx.moveTo(px,py-sz*3);ctx.lineTo(px,py+sz*3);ctx.stroke();
      }
    }
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

  // widget-grid: ウィジェットをグリッドで整列
  if(s.phoneLayout==='widget-grid'){
    const items=(s.wgItems||'xl,l,m,s').split(',').map(v=>v.trim()).filter(Boolean);
    // ウィジェットサイズ定義（1ユニット=小ウィジェット1個分）
    // 小=1x1, 中=2x1, 大=2x2, 特大=4x2
    const SIZES={s:{gw:1,gh:1,label:'Small'},m:{gw:2,gh:1,label:'Medium'},l:{gw:2,gh:2,label:'Large'},xl:{gw:4,gh:2,label:'Extra Large'}};
    const cols=Math.max(2,Math.min(4,s.wgCols||4)),gap=W*.02,pad=W*.06;
    const u=(W-pad*2-gap*(cols-1))/cols; // 1ユニットの幅
    const rad=u*.15;
    // ウィジェット画像マッピング
    const imgMap={s:s.widgetSmallImg,m:s.widgetMediumImg,l:s.widgetLargeImg,xl:s.widgetLargeImg};
    const lblMap={s:'Small',m:'Medium',l:'Large',xl:'Extra Large'};
    // 行ごとに配置（グリッドシミュレーション）
    const grid=[];// grid[row][col] = true/false
    function getCell(r,c){return grid[r]&&grid[r][c];}
    function setCell(r,c){if(!grid[r])grid[r]=[];grid[r][c]=true;}
    function canPlace(r,c,gw,gh){
      for(let dr=0;dr<gh;dr++)for(let dc=0;dc<gw;dc++){if(c+dc>=cols||getCell(r+dr,c+dc))return false;}
      return true;
    }
    function place(r,c,gw,gh){for(let dr=0;dr<gh;dr++)for(let dc=0;dc<gw;dc++)setCell(r+dr,c+dc);}
    const placed=[];
    items.forEach((id,idx)=>{
      const raw=SIZES[id];if(!raw)return;
      const sz={gw:Math.min(raw.gw,cols),gh:raw.gh};
      // 最初に配置できるセルを探す
      for(let r=0;r<50;r++){
        for(let c=0;c<=cols-sz.gw;c++){
          if(canPlace(r,c,sz.gw,sz.gh)){
            place(r,c,sz.gw,sz.gh);
            placed.push({id,idx,r,c,gw:sz.gw,gh:sz.gh});
            return;
          }
        }
      }
    });
    // 描画
    const startY=ty+H*.02;
    placed.forEach(p=>{
      const x=pad+p.c*(u+gap);
      const y=startY+p.r*(u+gap);
      const w=p.gw*u+(p.gw-1)*gap;
      const h=p.gh*u+(p.gh-1)*gap;
      ctx.save();ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=W*.03;ctx.shadowOffsetY=W*.01;
      rr(ctx,x,y,w,h,rad);ctx.fillStyle='rgba(40,60,120,.5)';ctx.fill();ctx.restore();
      ctx.save();rr(ctx,x,y,w,h,rad);ctx.clip();
      const img=imgMap[p.id];
      if(img){drawImgCover(ctx,img,x,y,w,h);}
      else{ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(255,255,255,.18)';ctx.font=`${Math.min(w,h)*.12}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(lblMap[p.id]||p.id,x+w/2,y+h/2);}
      ctx.restore();
    });
  }

  // widget-phone: ウィジェット前面 + iPhone背面
  if(s.phoneLayout==='widget-phone'){
    // iPhone（背面）
    const iphSz=(s.wpPhoneSize||42)/100;
    const pw=W*iphSz,ph=pw*getIphoneAR();
    const px=W*(s.wpPhoneX!=null?s.wpPhoneX:50)/100-pw/2;
    const py=H*(s.wpPhoneY!=null?s.wpPhoneY:55)/100-ph/2;
    drawPhone(ctx,px,py,pw,ph,s,true);
    // ウィジェット（前面）
    const wSz=(s.wpWidgetSize||70)/100;
    const ww=W*wSz,wh=ww*.65;
    const wx=W*(s.wpWidgetX!=null?s.wpWidgetX:50)/100-ww/2;
    const wy=H*(s.wpWidgetY!=null?s.wpWidgetY:32)/100-wh/2;
    const wRad=W*.04;
    ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=W*.05;ctx.shadowOffsetY=W*.02;
    rr(ctx,wx,wy,ww,wh,wRad);ctx.fillStyle='rgba(40,60,120,.5)';ctx.fill();ctx.restore();
    ctx.save();rr(ctx,wx,wy,ww,wh,wRad);ctx.clip();
    if(s.widgetLargeImg){drawImgCover(ctx,s.widgetLargeImg,wx,wy,ww,wh);}
    else{ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(wx,wy,ww,wh);ctx.fillStyle='rgba(255,255,255,.18)';ctx.font=`${W*.04}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('ウィジェット',wx+ww/2,wy+wh/2);}
    ctx.restore();
  }

  // multi-phone: 複数iPhoneを自由に配置
  if(s.phoneLayout==='multi-phone'){
    const count=Math.max(1,Math.min(5,s.mpCount||3));
    const sz=(s.mpSize||40)/100;
    const rot=(s.mpRot||0)*Math.PI/180;
    const pw=W*sz,ph=pw*getIphoneAR();
    const imgs=[s.screenshotImg,s.screenshotImg2,s.screenshotImg3,s.screenshotImg4,s.screenshotImgIpad];
    // デフォルト位置（等間隔）
    const defX=i=>{const margin=10,span=80;return count===1?50-sz*50:margin+i*(span/(count-1))-sz*50+sz*50;};
    const defY=i=>30;
    for(let i=0;i<count;i++){
      const xKey='mpX'+i,yKey='mpY'+i;
      const px=W*(s[xKey]!=null?s[xKey]:defX(i))/100;
      const py=H*(s[yKey]!=null?s[yKey]:defY(i))/100;
      ctx.save();
      if(rot){const cx2=px+pw/2,cy2=py+ph/2;ctx.translate(cx2,cy2);ctx.rotate(rot);ctx.translate(-cx2,-cy2);}
      const copy={...s,screenshotImg:imgs[i]||null};
      drawPhone(ctx,px,py,pw,ph,copy,true);
      ctx.restore();
    }
  }

  // free-device: ユーザーが自由に配置
  if(s.phoneLayout==='free-device'){
    // 描画順序を管理（奥から手前へ）
    const devs=[];
    if(s.fdMacOn!==false) devs.push({type:'mac',z:s.fdMacZ!=null?s.fdMacZ:0});
    if(s.fdIpadOn!==false) devs.push({type:'ipad',z:s.fdIpadZ!=null?s.fdIpadZ:1});
    if(s.fdIphoneOn!==false) devs.push({type:'iphone',z:s.fdIphoneZ!=null?s.fdIphoneZ:2});
    if(s.fdWatchOn!==false) devs.push({type:'watch',z:s.fdWatchZ!=null?s.fdWatchZ:3});
    devs.sort((a,b)=>a.z-b.z);

    devs.forEach(d=>{
      if(d.type==='mac'){
        const sz=(s.fdMacSize||60)/100;
        const mw=W*sz;
        const mx=W*(s.fdMacX!=null?s.fdMacX:20)/100;
        const my=H*(s.fdMacY!=null?s.fdMacY:20)/100;
        const rot=(s.fdMacRot||0)*Math.PI/180;
        ctx.save();

        // 全体サイズ: ディスプレイ + 薄いベース
        const lidH=mw*.64,lidR=mw*.018;
        const totalH=lidH+mw*.04;
        if(rot){const cx=mx+mw/2,cy=my+totalH/2;ctx.translate(cx,cy);ctx.rotate(rot);ctx.translate(-cx,-cy);}

        // ドロップシャドウ
        ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=mw*.1;ctx.shadowOffsetY=mw*.03;

        // ディスプレイ筐体（スペースグレー風グラデ）
        const lidGrad=ctx.createLinearGradient(mx,my,mx,my+lidH);
        lidGrad.addColorStop(0,'#3a3a3c');lidGrad.addColorStop(.5,'#2c2c2e');lidGrad.addColorStop(1,'#232325');
        rr(ctx,mx,my,mw,lidH,lidR);ctx.fillStyle=lidGrad;ctx.fill();
        // 上部にハイライトエッジ
        ctx.save();rr(ctx,mx,my,mw,mw*.003,lidR);ctx.fillStyle='rgba(255,255,255,.1)';ctx.fill();ctx.restore();
        ctx.shadowBlur=0;ctx.shadowOffsetY=0;

        // スクリーン（薄ベゼル）
        const bz=mw*.012; // 細いベゼル
        const sx=mx+bz,sy=my+bz*1.8,sw=mw-bz*2,sh=lidH-bz*2.8,sr=lidR*.5;
        ctx.save();rr(ctx,sx,sy,sw,sh,sr);ctx.clip();
        if(s.screenshotImg3){drawImgCover(ctx,s.screenshotImg3,sx,sy,sw,sh);}
        else{
          const scGrad=ctx.createLinearGradient(sx,sy,sx,sy+sh);
          scGrad.addColorStop(0,'#1a1a2e');scGrad.addColorStop(1,'#0d0d1a');
          ctx.fillStyle=scGrad;ctx.fillRect(sx,sy,sw,sh);
          ctx.fillStyle='rgba(255,255,255,.08)';ctx.font=`600 ${sw*.035}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Macスクショ',sx+sw/2,sy+sh/2);
        }
        ctx.restore();

        // カメラ（ノッチ風）
        const notchW=mw*.06,notchH=bz*1.2,notchR=notchH*.4;
        const nx=mx+mw/2-notchW/2;
        ctx.beginPath();ctx.moveTo(nx,my);ctx.lineTo(nx+notchW,my);
        ctx.lineTo(nx+notchW,my+notchH-notchR);ctx.arcTo(nx+notchW,my+notchH,nx+notchW-notchR,my+notchH,notchR);
        ctx.lineTo(nx+notchR,my+notchH);ctx.arcTo(nx,my+notchH,nx,my+notchH-notchR,notchR);
        ctx.closePath();ctx.fillStyle='#232325';ctx.fill();
        ctx.beginPath();ctx.arc(mx+mw/2,my+notchH*.45,mw*.003,0,Math.PI*2);ctx.fillStyle='#1a1a2e';ctx.fill();

        // ベース（くさび型 - 奥が薄く手前がやや厚い）
        const baseY=my+lidH,baseH=mw*.025;
        const bx=mx+mw*.08,bw=mw*.84;
        // ヒンジ部（ディスプレイとベースの接続、細い線）
        ctx.fillStyle='#1a1a1c';
        ctx.fillRect(mx+mw*.03,baseY,mw*.94,mw*.004);
        // ベース本体（台形風）
        ctx.beginPath();
        ctx.moveTo(mx+mw*.03,baseY+mw*.004);
        ctx.lineTo(mx+mw*.97,baseY+mw*.004);
        ctx.lineTo(mx+mw*1.01,baseY+baseH);
        ctx.quadraticCurveTo(mx+mw*1.01,baseY+baseH+mw*.006,mx+mw*1.005,baseY+baseH+mw*.006);
        ctx.lineTo(mx-mw*.005,baseY+baseH+mw*.006);
        ctx.quadraticCurveTo(mx-mw*.01,baseY+baseH+mw*.006,mx-mw*.01,baseY+baseH);
        ctx.lineTo(mx+mw*.03,baseY+mw*.004);
        ctx.closePath();
        const bGrad=ctx.createLinearGradient(mx,baseY,mx,baseY+baseH+mw*.006);
        bGrad.addColorStop(0,'#333335');bGrad.addColorStop(1,'#28282a');
        ctx.fillStyle=bGrad;ctx.fill();
        // ベース前面のエッジライン
        ctx.save();
        ctx.beginPath();ctx.moveTo(mx-mw*.005,baseY+baseH+mw*.005);ctx.lineTo(mx+mw*1.005,baseY+baseH+mw*.005);
        ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=1;ctx.stroke();
        ctx.restore();

        // ゴム足（底面の細いライン）
        ctx.fillStyle='#1a1a1c';
        rr(ctx,mx+mw*.25,baseY+baseH+mw*.005,mw*.5,mw*.003,mw*.001);ctx.fill();

        ctx.restore();
      }
      if(d.type==='iphone'){
        const sz=(s.fdIphoneSize||50)/100;
        const pw=W*sz,ph=pw*getIphoneAR();
        const px=W*(s.fdIphoneX!=null?s.fdIphoneX:10)/100;
        const py=H*(s.fdIphoneY!=null?s.fdIphoneY:25)/100;
        const rot=(s.fdIphoneRot||0)*Math.PI/180;
        ctx.save();
        if(rot){const cx=px+pw/2,cy=py+ph/2;ctx.translate(cx,cy);ctx.rotate(rot);ctx.translate(-cx,-cy);}
        drawPhone(ctx,px,py,pw,ph,s,true);
        ctx.restore();
      }
      if(d.type==='ipad'){
        const sz=(s.fdIpadSize||45)/100;
        const iw=W*sz,ih=iw*1.33;
        const ix=W*(s.fdIpadX!=null?s.fdIpadX:40)/100;
        const iy=H*(s.fdIpadY!=null?s.fdIpadY:15)/100;
        const rot=(s.fdIpadRot||0)*Math.PI/180;
        ctx.save();
        if(rot){const cx=ix+iw/2,cy=iy+ih/2;ctx.translate(cx,cy);ctx.rotate(rot);ctx.translate(-cx,-cy);}
        // iPad frame
        const ibw=iw*.025,ir=iw*.06;
        ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=iw*.1;ctx.shadowOffsetY=iw*.04;
        const ifg=ctx.createLinearGradient(ix,iy,ix+iw,iy+ih);
        ifg.addColorStop(0,'#282828');ifg.addColorStop(1,'#0f0f0f');
        rr(ctx,ix,iy,iw,ih,ir);ctx.fillStyle=ifg;ctx.fill();
        ctx.shadowBlur=0;ctx.shadowOffsetY=0;
        // iPad screen
        const isx=ix+ibw,isy=iy+ibw,isw=iw-ibw*2,ish=ih-ibw*2,isr=ir*.7;
        rr(ctx,isx,isy,isw,ish,isr);ctx.clip();
        if(s.screenshotImg2){drawImgCover(ctx,s.screenshotImg2,isx,isy,isw,ish);}
        else{ctx.fillStyle='#0a0a18';ctx.fillRect(isx,isy,isw,ish);ctx.fillStyle='rgba(255,255,255,.06)';ctx.font=`${isw*.05}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('iPadスクショ',isx+isw/2,isy+ish/2);}
        ctx.restore();
      }
      if(d.type==='watch'){
        const sz=(s.fdWatchSize||22)/100;
        const aw=W*sz,ah=aw*1.22;
        const ax=W*(s.fdWatchX!=null?s.fdWatchX:68)/100;
        const ay=H*(s.fdWatchY!=null?s.fdWatchY:65)/100;
        const rot=(s.fdWatchRot||0)*Math.PI/180;
        const aR=aw*.28,abw=aw*.05;
        ctx.save();
        if(rot){const cx=ax+aw/2,cy=ay+ah/2;ctx.translate(cx,cy);ctx.rotate(rot);ctx.translate(-cx,-cy);}
        ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=aw*.12;ctx.shadowOffsetY=aw*.05;
        const afg=ctx.createLinearGradient(ax,ay,ax+aw,ay+ah);
        afg.addColorStop(0,'#2a2a2a');afg.addColorStop(1,'#111');
        rr(ctx,ax,ay,aw,ah,aR);ctx.fillStyle=afg;ctx.fill();
        ctx.shadowBlur=0;ctx.shadowOffsetY=0;
        // Crown
        const crW2=aw*.06,crH2=ah*.13,crR2=crW2*.4;
        rr(ctx,ax+aw-crW2*.3,ay+ah*.3,crW2,crH2,crR2);ctx.fillStyle='#3a3a3a';ctx.fill();
        rr(ctx,ax+aw-crW2*.3,ay+ah*.5,crW2,crH2*.5,crR2);ctx.fillStyle='#333';ctx.fill();
        // Watch screen
        const wsx2=ax+abw,wsy2=ay+abw,wsw2=aw-abw*2,wsh2=ah-abw*2,wsr2=aR*.75;
        ctx.save();rr(ctx,wsx2,wsy2,wsw2,wsh2,wsr2);ctx.clip();
        if(s.widgetMediumImg){drawImgCover(ctx,s.widgetMediumImg,wsx2,wsy2,wsw2,wsh2);}
        else{ctx.fillStyle='#000';ctx.fillRect(wsx2,wsy2,wsw2,wsh2);ctx.fillStyle='rgba(255,255,255,.1)';ctx.font=`${wsw2*.1}px -apple-system`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Watch',wsx2+wsw2/2,wsy2+wsh2/2);}
        ctx.restore();
        ctx.restore();
      }
    });
  }

  // Draw phone for standard phone-based layouts
  const noPhoneLo=['text-bottom','center-large','center-large-top','screen-fill','screen-fill-top','feature-list','center-text','before-after','widget-grid','widget-phone','multi-phone','free-device'];
  if(!noPhoneLo.includes(s.phoneLayout)){
    drawPhoneAtZone(ctx,z,s);
  }

  // デバイス反射（iPhoneの下に薄い映り込み）
  if(s.effects.includes('reflection')&&z.pw>0&&z.ph>0&&!noPhoneLo.includes(s.phoneLayout)){
    const refH=z.ph*.25;
    const refY=z.py+z.ph+W*.005;
    ctx.save();
    ctx.translate(0,refY+refH);ctx.scale(1,-1);
    ctx.globalAlpha=.12;
    ctx.drawImage(ctx.canvas,z.px,z.py,z.pw,z.ph,z.px,refY+refH-z.ph,z.pw,z.ph);
    ctx.restore();
    // フェードアウト
    ctx.save();
    const fadeG=ctx.createLinearGradient(0,refY,0,refY+refH);
    fadeG.addColorStop(0,'rgba(0,0,0,0)');fadeG.addColorStop(1,s.bgColor1||'#0A84FF');
    ctx.fillStyle=fadeG;ctx.fillRect(z.px-W*.05,refY,z.pw+W*.1,refH);
    ctx.restore();
  }


  // グレインノイズ（フィルム風ザラつき）
  if(s.effects.includes('grain')&&!(s.grain>0)){
    drawGrain(ctx,W,H,40);
  }

  // ボーダー（余白付き枠線）
  if(s.effects.includes('border')){
    ctx.save();
    const bm=W*.035; // マージン
    const br=W*.025; // 角丸
    ctx.strokeStyle='rgba(255,255,255,.25)';
    ctx.lineWidth=W*.004;
    rr(ctx,bm,bm,W-bm*2,H-bm*2,br);ctx.stroke();
    ctx.restore();
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
    ty+=tz*.25;
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
const S1_PREVIEW_ZOOM_KEY='previewgen_s1_preview_zoom_idx';
const S1_PREVIEW_ZOOM_STEPS=[70,85,100,115,130,145];
let s1PreviewZoomIdx=2;
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
function applyS1PreviewZoom(){
  const scale=S1_PREVIEW_ZOOM_STEPS[s1PreviewZoomIdx]/100;
  document.documentElement.style.setProperty('--s1-preview-zoom',String(scale));
  const minus=document.getElementById('s1-zoom-minus');
  const plus=document.getElementById('s1-zoom-plus');
  if(minus)minus.disabled=s1PreviewZoomIdx===0;
  if(plus)plus.disabled=s1PreviewZoomIdx===S1_PREVIEW_ZOOM_STEPS.length-1;
}
function adjustS1PreviewZoom(dir){
  const next=Math.max(0,Math.min(S1_PREVIEW_ZOOM_STEPS.length-1,s1PreviewZoomIdx+dir));
  if(next===s1PreviewZoomIdx)return;
  s1PreviewZoomIdx=next;
  applyS1PreviewZoom();
  try{localStorage.setItem(S1_PREVIEW_ZOOM_KEY,String(s1PreviewZoomIdx));}catch{}
}
function initS1PreviewZoom(){
  try{
    const saved=parseInt(localStorage.getItem(S1_PREVIEW_ZOOM_KEY)||'',10);
    if(Number.isFinite(saved)&&saved>=0&&saved<S1_PREVIEW_ZOOM_STEPS.length)s1PreviewZoomIdx=saved;
  }catch{}
  applyS1PreviewZoom();
}
function calcFitPercent(){
  const center=document.querySelector('.edit-center');
  if(!center||center.clientWidth===0||center.clientHeight===0)return 100;
  const dev=DEVS[curDev],ar=dev.h/dev.w;
  const pad=40;
  const zoomBarH=44;
  const cszH=28;
  const availW=center.clientWidth-pad*2;
  const availH=center.clientHeight-pad*2-zoomBarH-cszH;
  if(availW<=0||availH<=0)return 100;
  const fitByW=availW;
  const fitByH=availH/ar;
  const fitW=Math.min(fitByW,fitByH);
  return Math.max(25,Math.round(fitW/PW*100));
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
let _rendering=false;
function render(){
  if(_rendering)return;
  _rendering=true;
  const s=slides[curSlide];if(!s){_rendering=false;return;}
  const isDraggable=s.phoneLayout==='free-device'||s.phoneLayout==='multi-phone'||s.phoneLayout==='widget-phone';
  if(inStep===1){const c=document.getElementById('s1-canvas');if(c){renderSlide(c.getContext('2d'),c.width,c.height,s);c.classList.toggle('free-drag',isDraggable);}}
  if(inStep===2){const c=document.getElementById('canvas');if(c){renderSlide(c.getContext('2d'),c.width,c.height,s);c.classList.toggle('free-drag',isDraggable);}}
  renderThumbs();updateSummary();
  _rendering=false;
  autoSave();
}

/* ═══ フリー配置：ドラッグ＆ホイール操作 ═══ */
(function(){
  let dragDev=null,dragStartX=0,dragStartY=0,dragOrigX=0,dragOrigY=0,dragUndoPushed=false;

  // デバイスごとの矩形を計算（canvas座標系）
  function getDevRects(s,cW,cH){
    const W=cW,H=cH,rects=[];
    if(s.phoneLayout==='widget-phone'){
      // ウィジェット（前面）
      const wSz=(s.wpWidgetSize||70)/100,ww=W*wSz,wh=ww*.65;
      const wx=W*(s.wpWidgetX!=null?s.wpWidgetX:50)/100-ww/2;
      const wy=H*(s.wpWidgetY!=null?s.wpWidgetY:32)/100-wh/2;
      rects.push({id:'widget',x:wx,y:wy,w:ww,h:wh,z:1,
        xKey:'wpWidgetX',yKey:'wpWidgetY',sKey:'wpWidgetSize',
        xDef:50,yDef:32,sDef:70,sMin:20,sMax:100,center:true});
      // iPhone（背面）
      const pSz=(s.wpPhoneSize||42)/100,pw=W*pSz,ph=pw*getIphoneAR();
      const px=W*(s.wpPhoneX!=null?s.wpPhoneX:50)/100-pw/2;
      const py=H*(s.wpPhoneY!=null?s.wpPhoneY:55)/100-ph/2;
      rects.push({id:'phone',x:px,y:py,w:pw,h:ph,z:0,
        xKey:'wpPhoneX',yKey:'wpPhoneY',sKey:'wpPhoneSize',
        xDef:50,yDef:55,sDef:42,sMin:15,sMax:80,center:true});
      rects.sort((a,b)=>b.z-a.z);
      return rects;
    }
    if(s.phoneLayout==='multi-phone'){
      const count=Math.max(1,Math.min(5,s.mpCount||3));
      const sz=(s.mpSize||40)/100;
      const pw=W*sz,ph=pw*getDeviceAR();
      const defX=i=>{const margin=10,span=80;return count===1?50-sz*50:margin+i*(span/(count-1))-sz*50+sz*50;};
      for(let i=count-1;i>=0;i--){
        const xKey='mpX'+i,yKey='mpY'+i;
        const px=W*(s[xKey]!=null?s[xKey]:defX(i))/100;
        const py=H*(s[yKey]!=null?s[yKey]:30)/100;
        rects.push({id:'mp'+i,x:px,y:py,w:pw,h:ph,z:i,
          xKey,yKey,sKey:'mpSize',xDef:defX(i),yDef:30,sDef:40,sMin:15,sMax:70});
      }
      return rects;
    }
    if(s.fdMacOn!==false){
      const sz=(s.fdMacSize||60)/100,mw=W*sz,mh=mw*.68;
      const mx=W*(s.fdMacX!=null?s.fdMacX:20)/100;
      const my=H*(s.fdMacY!=null?s.fdMacY:20)/100;
      rects.push({id:'mac',x:mx,y:my,w:mw,h:mh,z:s.fdMacZ!=null?s.fdMacZ:0,
        xKey:'fdMacX',yKey:'fdMacY',sKey:'fdMacSize',
        xDef:20,yDef:20,sDef:60,sMin:20,sMax:90,arFn:()=>.68});
    }
    if(s.fdIphoneOn!==false){
      const sz=(s.fdIphoneSize||50)/100,pw=W*sz,ph=pw*getIphoneAR();
      const px=W*(s.fdIphoneX!=null?s.fdIphoneX:10)/100;
      const py=H*(s.fdIphoneY!=null?s.fdIphoneY:25)/100;
      rects.push({id:'iphone',x:px,y:py,w:pw,h:ph,z:s.fdIphoneZ!=null?s.fdIphoneZ:1,
        xKey:'fdIphoneX',yKey:'fdIphoneY',sKey:'fdIphoneSize',
        xDef:10,yDef:25,sDef:50,sMin:15,sMax:80,arFn:()=>getDeviceAR()});
    }
    if(s.fdIpadOn!==false){
      const sz=(s.fdIpadSize||45)/100,iw=W*sz,ih=iw*1.33;
      const ix=W*(s.fdIpadX!=null?s.fdIpadX:40)/100;
      const iy=H*(s.fdIpadY!=null?s.fdIpadY:15)/100;
      rects.push({id:'ipad',x:ix,y:iy,w:iw,h:ih,z:s.fdIpadZ!=null?s.fdIpadZ:0,
        xKey:'fdIpadX',yKey:'fdIpadY',sKey:'fdIpadSize',
        xDef:40,yDef:15,sDef:45,sMin:15,sMax:80,arFn:()=>1.33});
    }
    if(s.fdWatchOn!==false){
      const sz=(s.fdWatchSize||22)/100,aw=W*sz,ah=aw*1.22;
      const ax=W*(s.fdWatchX!=null?s.fdWatchX:68)/100;
      const ay=H*(s.fdWatchY!=null?s.fdWatchY:65)/100;
      rects.push({id:'watch',x:ax,y:ay,w:aw,h:ah,z:s.fdWatchZ!=null?s.fdWatchZ:2,
        xKey:'fdWatchX',yKey:'fdWatchY',sKey:'fdWatchSize',
        xDef:68,yDef:65,sDef:22,sMin:10,sMax:60,arFn:()=>1.22});
    }
    // 手前のデバイスを優先的にヒットするため逆順ソート
    rects.sort((a,b)=>b.z-a.z);
    return rects;
  }

  function canvasToSlide(e,canvas){
    const rect=canvas.getBoundingClientRect();
    const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
    return{x:(e.clientX-rect.left)*scaleX,y:(e.clientY-rect.top)*scaleY};
  }

  function hitTest(mx,my,rects){
    for(const r of rects){if(mx>=r.x&&mx<=r.x+r.w&&my>=r.y&&my<=r.y+r.h)return r;}
    return null;
  }

  function getCanvas(){
    if(inStep===1)return document.getElementById('s1-canvas');
    if(inStep===2)return document.getElementById('canvas');
    return null;
  }

  const DRAG_LAYOUTS=['free-device','multi-phone','widget-phone'];
  function onDown(e){
    const s=slides[curSlide];if(!s||!DRAG_LAYOUTS.includes(s.phoneLayout))return;
    const canvas=getCanvas();if(!canvas)return;
    const pos=canvasToSlide(e.touches?e.touches[0]:e,canvas);
    const rects=getDevRects(s,canvas.width,canvas.height);
    const hit=hitTest(pos.x,pos.y,rects);
    if(!hit)return;
    e.preventDefault();
    dragDev=hit;dragUndoPushed=false;
    dragStartX=pos.x;dragStartY=pos.y;
    dragOrigX=s[hit.xKey]!=null?s[hit.xKey]:hit.xDef;
    dragOrigY=s[hit.yKey]!=null?s[hit.yKey]:hit.yDef;
    canvas.style.cursor='grabbing';
  }

  function onMove(e){
    if(!dragDev)return;
    const s=slides[curSlide];if(!s)return;
    const canvas=getCanvas();if(!canvas)return;
    e.preventDefault();
    if(!dragUndoPushed){pushUndo();dragUndoPushed=true;}
    const pos=canvasToSlide(e.touches?e.touches[0]:e,canvas);
    const dx=(pos.x-dragStartX)/canvas.width*100;
    const dy=(pos.y-dragStartY)/canvas.height*100;
    s[dragDev.xKey]=Math.max(-50,Math.min(150,dragOrigX+dx));
    s[dragDev.yKey]=Math.max(-50,Math.min(150,dragOrigY+dy));
    render();buildAllLoAdjust();
  }

  function onUp(){
    if(!dragDev)return;
    const canvas=getCanvas();if(canvas)canvas.style.cursor='';
    dragDev=null;
  }

  function onWheel(e){
    const s=slides[curSlide];if(!s||!DRAG_LAYOUTS.includes(s.phoneLayout))return;
    const canvas=getCanvas();if(!canvas)return;
    const pos=canvasToSlide(e,canvas);
    const rects=getDevRects(s,canvas.width,canvas.height);
    const hit=hitTest(pos.x,pos.y,rects);
    if(!hit)return;
    e.preventDefault();
    pushUndo();
    const cur=s[hit.sKey]!=null?s[hit.sKey]:hit.sDef;
    const delta=e.deltaY>0?-2:2;
    s[hit.sKey]=Math.max(hit.sMin,Math.min(hit.sMax,cur+delta));
    render();buildAllLoAdjust();
  }

  // イベント登録（両キャンバスに）
  function bind(canvas){
    if(!canvas||canvas._freeBound)return;
    canvas._freeBound=true;
    canvas.addEventListener('mousedown',onDown);
    canvas.addEventListener('touchstart',onDown,{passive:false});
    canvas.addEventListener('wheel',onWheel,{passive:false});
  }
  document.addEventListener('mousemove',onMove);
  document.addEventListener('mouseup',onUp);
  document.addEventListener('touchmove',onMove,{passive:false});
  document.addEventListener('touchend',onUp);

  // canvasが生成された後にバインド
  const _origRender=render;
  const _bindCheck=()=>{bind(document.getElementById('s1-canvas'));bind(document.getElementById('canvas'));};
  const obs=new MutationObserver(_bindCheck);
  obs.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',_bindCheck);
})();

/* ═══ STEP NAV ═══ */
function goStep(n){
  inStep=n;
  document.getElementById('s1').style.display=n===1?'flex':'none';
  document.getElementById('s2').style.display=n===2?'flex':'none';
  const s3=document.getElementById('s3');if(s3)s3.style.display=n===3?'flex':'none';
  const rightPanel=document.querySelector('.edit-right');
  if(rightPanel) rightPanel.style.display=n===3?'none':'';
  document.getElementById('st1').className='step'+(n===1?' active':' done');
  document.getElementById('st2').className='step'+(n===2?' active':n>2?' done':'');
  const st3=document.getElementById('st3');if(st3)st3.className='step'+(n===3?' active':'');
  if(n===2) buildFields();
  if(n===3) buildStep3();
  render();
  if(isIphone()) iphoneApplyStep();
}

/* ═══ STEP 3: 仕上げる（プレビュー＋書き出し） ═══ */
function buildStep3(){
  buildS3Left();
  renderS3Gallery();
}
function buildS3Left(){
  const el=document.getElementById('s3-left');
  if(!el)return;
  el.innerHTML='';

  // 📐 デバイスサイズ
  const devCard=addCard(el,'📐','書き出しサイズ',DEVS[curDev].lbl.split(' ')[0]);
  const iphoneIds=['6.9','6.7','6.5','5.5'];
  const ipadIds=['ipad13','ipad11','ipad97'];
  const makeDevBtn=(id)=>{
    const dev=DEVS[id];
    const btn=document.createElement('button');btn.type='button';
    btn.className='s3-dev-btn'+(curDev===id?' active':'');
    const inch=id.startsWith('ipad')?id.replace('ipad','')+'"':id+'"';
    btn.innerHTML=`<div>${inch}</div><div class="s3-dev-sub">${dev.w}×${dev.h}</div>`;
    btn.onclick=()=>{setDevice(id);buildStep3();};
    return btn;
  };
  const iphCat=document.createElement('div');iphCat.className='s3-dev-cat';iphCat.textContent='iPhone';
  devCard.appendChild(iphCat);
  const iphGrid=document.createElement('div');iphGrid.className='s3-dev-grid';
  iphoneIds.forEach(id=>iphGrid.appendChild(makeDevBtn(id)));
  devCard.appendChild(iphGrid);
  const ipadCat=document.createElement('div');ipadCat.className='s3-dev-cat';ipadCat.textContent='iPad';
  devCard.appendChild(ipadCat);
  const ipadGrid=document.createElement('div');ipadGrid.className='s3-dev-grid';
  ipadIds.forEach(id=>ipadGrid.appendChild(makeDevBtn(id)));
  devCard.appendChild(ipadGrid);

  // 📦 書き出し
  const expCard=addCard(el,'📦','書き出し');
  const makeExpBtn=(icon,name,desc,onClick)=>{
    const btn=document.createElement('button');btn.type='button';
    btn.className='s3-export-btn';
    btn.innerHTML=`<div class="s3-export-icon">${icon}</div><div class="s3-export-text"><div class="s3-export-name">${name}</div><div class="s3-export-desc">${desc}</div></div>`;
    btn.onclick=onClick;
    return btn;
  };
  expCard.appendChild(makeExpBtn('🗜','現在のサイズで全スライド ZIP',`${DEVS[curDev].lbl.split(' ')[1]||''} を ${slides.length}枚`,()=>exportZip()));
  expCard.appendChild(makeExpBtn('🌐','全サイズで全スライド ZIP','iPhone+iPad の全7サイズ',()=>exportAllSizesZip()));
  expCard.appendChild(makeExpBtn('🖼','選択中のスライドだけ PNG',`スライド ${curSlide+1} を1枚だけ`,()=>exportCurrent()));

  // 📋 サマリー
  const sumCard=addCard(el,'📋','サマリー');
  const stats=document.createElement('div');stats.className='s3-stats';
  const dev=DEVS[curDev];
  const mkStat=(lbl,val)=>{const d=document.createElement('div');d.className='s3-stat';d.innerHTML=`<div class="s3-stat-lbl">${lbl}</div><div class="s3-stat-val">${val}</div>`;return d;};
  stats.appendChild(mkStat('スライド数',slides.length+'枚'));
  stats.appendChild(mkStat('解像度',dev.w+'×'+dev.h));
  sumCard.appendChild(stats);
}
function renderS3Gallery(){
  const gallery=document.getElementById('s3-gallery');
  if(!gallery)return;
  gallery.innerHTML='';
  const dev=DEVS[curDev];
  // ヘッダーの情報を更新
  const info=document.getElementById('s3-dev-info');
  if(info)info.textContent=`${dev.lbl} ・ ${slides.length}枚`;
  slides.forEach((s,i)=>{
    const tile=document.createElement('div');tile.className='s3-tile';
    const tw=240;
    const tc=document.createElement('canvas');
    tc.width=tw;tc.height=Math.round(tw*dev.h/dev.w);
    renderSlide(tc.getContext('2d'),tc.width,tc.height,s);
    tc.style.cssText='width:100%;height:auto;display:block';
    const foot=document.createElement('div');foot.className='s3-tile-foot';
    const num=document.createElement('div');num.className='s3-tile-n';num.textContent='#'+(i+1);
    const dl=document.createElement('button');dl.type='button';dl.className='s3-tile-dl';dl.textContent='↓ PNG';
    dl.onclick=()=>exportSlide(i);
    foot.appendChild(num);foot.appendChild(dl);
    tile.appendChild(tc);tile.appendChild(foot);
    gallery.appendChild(tile);
  });
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
    const card=makeOptCard(b,'bgStyle',BG_STYLES,()=>{pushUndo();slides[curSlide].bgStyle=b.id;buildAllBgAdjust();render();});
    const mc=document.createElement('canvas');mc.width=117;mc.height=88;b.mini(mc.getContext('2d'),117,88);
    card.querySelector('.opt-prev').appendChild(mc);el.appendChild(card);
  });
}
// 配色プリセット（各色にダーク／ライト両モードを定義）
// グラデーションがはっきり見えるよう、bgColor1 → bgColor2 で
// 明度・彩度・色相のいずれかに大きな差をつけてある
const COLOR_PRESETS=[
  {name:'オーシャン',icon:'🌊',
   dark:{bgColor1:'#001A66',bgColor2:'#00E5FF',meshColor3:'#0057FF',meshColor4:'#00C2D8',titleColor:'#FFFFFF',subColor:'#C8E8FF'},
   light:{bgColor1:'#E8F8FF',bgColor2:'#5DC8F0',meshColor3:'#A8DCF0',meshColor4:'#3AA8DC',titleColor:'#001A66',subColor:'#0057B3'}},
  {name:'サンセット',icon:'🌅',
   dark:{bgColor1:'#5C0033',bgColor2:'#FFB800',meshColor3:'#E63950',meshColor4:'#FF7A00',titleColor:'#FFFFFF',subColor:'#FFE8C0'},
   light:{bgColor1:'#FFF0E0',bgColor2:'#FF9560',meshColor3:'#FFC8A0',meshColor4:'#FF7530',titleColor:'#5C0033',subColor:'#C45200'}},
  {name:'フォレスト',icon:'🌿',
   dark:{bgColor1:'#06330F',bgColor2:'#9CFF38',meshColor3:'#1F7A2E',meshColor4:'#5DD63A',titleColor:'#FFFFFF',subColor:'#D8F5C0'},
   light:{bgColor1:'#EBFCE0',bgColor2:'#7DC850',meshColor3:'#B8E090',meshColor4:'#5BAA32',titleColor:'#06330F',subColor:'#1F7A2E'}},
  {name:'ミッドナイト',icon:'🌑',
   dark:{bgColor1:'#000018',bgColor2:'#9D4EDD',meshColor3:'#3a1a6e',meshColor4:'#7B5FF2',titleColor:'#FFFFFF',subColor:'#D0C8FF'},
   light:{bgColor1:'#EDEDFA',bgColor2:'#8E7AD8',meshColor3:'#D0C8F5',meshColor4:'#6A52C0',titleColor:'#1A0040',subColor:'#3a1a6e'}},
  {name:'クリーン',icon:'⬜',
   dark:{bgColor1:'#000000',bgColor2:'#5A5A60',meshColor3:'#1C1C1E',meshColor4:'#48484A',titleColor:'#FFFFFF',subColor:'#C0C0C8'},
   light:{bgColor1:'#FFFFFF',bgColor2:'#C0C0CC',meshColor3:'#F0F0F5',meshColor4:'#9898A0',titleColor:'#000000',subColor:'#48484A'}},
  {name:'パステル',icon:'🍬',
   dark:{bgColor1:'#5C0A4A',bgColor2:'#FF6FB5',meshColor3:'#9C2470',meshColor4:'#FFA0CC',titleColor:'#FFFFFF',subColor:'#FFD8E8'},
   light:{bgColor1:'#FFEEF6',bgColor2:'#FF9CCB',meshColor3:'#FFD0E8',meshColor4:'#FF6FB0',titleColor:'#5C0A4A',subColor:'#9C2470'}},
  {name:'ネオン',icon:'💜',
   dark:{bgColor1:'#0D0221',bgColor2:'#FF1493',meshColor3:'#BF5AF2',meshColor4:'#00E5FF',titleColor:'#FFFFFF',subColor:'#FFB8E8'},
   light:{bgColor1:'#FBE8FF',bgColor2:'#FF6FA8',meshColor3:'#E0B8FF',meshColor4:'#FF3D85',titleColor:'#3D0066',subColor:'#9C0050'}},
  {name:'モノクロ',icon:'◻️',
   dark:{bgColor1:'#0a0a0c',bgColor2:'#8E8E94',meshColor3:'#2C2C2E',meshColor4:'#48484A',titleColor:'#FFFFFF',subColor:'#C7C7CC'},
   light:{bgColor1:'#FFFFFF',bgColor2:'#8E8E94',meshColor3:'#E5E5EA',meshColor4:'#5C5C62',titleColor:'#0a0a0c',subColor:'#48484A'}},
  {name:'チェリー',icon:'🍒',
   dark:{bgColor1:'#2A0008',bgColor2:'#FF1744',meshColor3:'#7A0020',meshColor4:'#FF6B85',titleColor:'#FFFFFF',subColor:'#FFD0D8'},
   light:{bgColor1:'#FFEDF0',bgColor2:'#FF5577',meshColor3:'#FFC0CB',meshColor4:'#E63950',titleColor:'#2A0008',subColor:'#A30F2B'}},
  {name:'ライム',icon:'🍋',
   dark:{bgColor1:'#1A2D00',bgColor2:'#D4FF00',meshColor3:'#5C8500',meshColor4:'#A8FF38',titleColor:'#FFFFFF',subColor:'#E8FFC0'},
   light:{bgColor1:'#F8FFE0',bgColor2:'#A8E63D',meshColor3:'#DDFF9C',meshColor4:'#7AB800',titleColor:'#1A2D00',subColor:'#5C8500'}},
  {name:'ラベンダー',icon:'💐',
   dark:{bgColor1:'#1A0040',bgColor2:'#C77FFF',meshColor3:'#5C148C',meshColor4:'#9D4EDD',titleColor:'#FFFFFF',subColor:'#E8D0FF'},
   light:{bgColor1:'#F4E8FF',bgColor2:'#9D7AD8',meshColor3:'#D6C0F5',meshColor4:'#7048B8',titleColor:'#1A0040',subColor:'#5C148C'}},
  {name:'ゴールド',icon:'✨',
   dark:{bgColor1:'#1F1400',bgColor2:'#FFC107',meshColor3:'#7A5500',meshColor4:'#FFD54F',titleColor:'#FFD700',subColor:'#FFE8A0'},
   light:{bgColor1:'#FFF8DC',bgColor2:'#FFB300',meshColor3:'#FFEDB0',meshColor4:'#E69500',titleColor:'#3D2A00',subColor:'#7A5500'}},
  {name:'ミント',icon:'🌱',
   dark:{bgColor1:'#002A22',bgColor2:'#5DECC8',meshColor3:'#00897B',meshColor4:'#26D7B0',titleColor:'#FFFFFF',subColor:'#B2DFDB'},
   light:{bgColor1:'#E0F8F0',bgColor2:'#4DD0AC',meshColor3:'#B0E5D8',meshColor4:'#1FA886',titleColor:'#002A22',subColor:'#00695C'}},
  {name:'コーラル',icon:'🪸',
   dark:{bgColor1:'#3D0020',bgColor2:'#FF8C7A',meshColor3:'#C04060',meshColor4:'#FFA88C',titleColor:'#FFFFFF',subColor:'#FFD8D0'},
   light:{bgColor1:'#FFF0EC',bgColor2:'#FF8870',meshColor3:'#FFC8B8',meshColor4:'#E0604A',titleColor:'#3D0020',subColor:'#C04060'}},
  {name:'アクア',icon:'💧',
   dark:{bgColor1:'#001F4D',bgColor2:'#00E0FF',meshColor3:'#003366',meshColor4:'#5DECDC',titleColor:'#FFFFFF',subColor:'#C8E8FF'},
   light:{bgColor1:'#E8F8FF',bgColor2:'#5DBFE8',meshColor3:'#B0E5FF',meshColor4:'#0099D8',titleColor:'#001F4D',subColor:'#0066CC'}},
  {name:'プラム',icon:'🍇',
   dark:{bgColor1:'#180029',bgColor2:'#C233E0',meshColor3:'#4A0E6E',meshColor4:'#9C42B0',titleColor:'#FFFFFF',subColor:'#E8C0FF'},
   light:{bgColor1:'#F2E0FA',bgColor2:'#9C42B0',meshColor3:'#DDB8E5',meshColor4:'#6A1B9A',titleColor:'#180029',subColor:'#4A0E6E'}},
  {name:'スカイ',icon:'☁️',
   dark:{bgColor1:'#0A1F3D',bgColor2:'#7DC8FF',meshColor3:'#1a3a5c',meshColor4:'#5DADE2',titleColor:'#FFFFFF',subColor:'#D8ECFF'},
   light:{bgColor1:'#EBF5FF',bgColor2:'#5BA4D8',meshColor3:'#B8DCFF',meshColor4:'#3A7AB8',titleColor:'#0A1F3D',subColor:'#2d5a8c'}},
  {name:'ローズ',icon:'🌹',
   dark:{bgColor1:'#2A0010',bgColor2:'#FF4081',meshColor3:'#AD1457',meshColor4:'#FF85AC',titleColor:'#FFFFFF',subColor:'#FFC8D8'},
   light:{bgColor1:'#FFEBF1',bgColor2:'#FF6B9C',meshColor3:'#FFB8C8',meshColor4:'#E91E63',titleColor:'#2A0010',subColor:'#C2185B'}},
  {name:'チャコール',icon:'⚫',
   dark:{bgColor1:'#000000',bgColor2:'#5C5C62',meshColor3:'#1C1C1C',meshColor4:'#3A3A3A',titleColor:'#FFFFFF',subColor:'#B0B0B8'},
   light:{bgColor1:'#FAFAFC',bgColor2:'#A0A0A8',meshColor3:'#E5E5E5',meshColor4:'#7A7A82',titleColor:'#000000',subColor:'#3A3A3A'}},
  {name:'バブルガム',icon:'🩷',
   dark:{bgColor1:'#3D0020',bgColor2:'#FF45A8',meshColor3:'#9C1F5F',meshColor4:'#FF85C0',titleColor:'#FFFFFF',subColor:'#FFD0E5'},
   light:{bgColor1:'#FFEBF4',bgColor2:'#FF5BA8',meshColor3:'#FFC0DC',meshColor4:'#D8358A',titleColor:'#3D0020',subColor:'#9C1F5F'}},
  {name:'スモーク',icon:'🌫️',
   dark:{bgColor1:'#0B1220',bgColor2:'#9CA3AF',meshColor3:'#374151',meshColor4:'#7E8DA8',titleColor:'#FFFFFF',subColor:'#E0E5EE'},
   light:{bgColor1:'#FAFBFC',bgColor2:'#7E8DA8',meshColor3:'#D1D5DB',meshColor4:'#4B5563',titleColor:'#0B1220',subColor:'#4b5563'}},
  {name:'バニラ',icon:'🍦',
   dark:{bgColor1:'#2A1A00',bgColor2:'#FFD180',meshColor3:'#8C7340',meshColor4:'#FFE082',titleColor:'#FFF8DC',subColor:'#FFE8B0'},
   light:{bgColor1:'#FFFAF0',bgColor2:'#FFC957',meshColor3:'#FFEFC8',meshColor4:'#E0A030',titleColor:'#2A1A00',subColor:'#8C7340'}},
  {name:'ピーチ',icon:'🍑',
   dark:{bgColor1:'#3D0033',bgColor2:'#FFB088',meshColor3:'#D85C8E',meshColor4:'#FFCDD2',titleColor:'#FFFFFF',subColor:'#FFE0D8'},
   light:{bgColor1:'#FFF2EC',bgColor2:'#FF8870',meshColor3:'#FFD0C0',meshColor4:'#E04A38',titleColor:'#3D0033',subColor:'#D85C8E'}},
  {name:'エメラルド',icon:'💎',
   dark:{bgColor1:'#002A20',bgColor2:'#1DE9B6',meshColor3:'#00754D',meshColor4:'#69F0AE',titleColor:'#FFFFFF',subColor:'#B0F0DC'},
   light:{bgColor1:'#E6FAEF',bgColor2:'#1DE9B6',meshColor3:'#B0E8D0',meshColor4:'#00A86B',titleColor:'#002A20',subColor:'#00754D'}},
];

// プリセットの現在のモード（buildAllBgAdjust の再描画で参照）
let presetColorMode='dark';

function buildBgAdjust(el){
  if(!el)return;el.innerHTML='';
  const s=slides[curSlide];
  const resolved=resolveBgStyle(s.bgStyle);
  const isSolid=resolved==='solid';
  const isGrad=resolved==='gradient';
  const isSplit=resolved==='split';
  const isRadial=resolved==='radial';
  const isMesh=resolved==='mesh';
  const isPattern=resolved==='pattern';
  // 背景スタイルごとのアイコン・名前
  const bgInfo={
    solid:{icon:'⬛',name:'単色'},
    gradient:{icon:'🌈',name:'グラデーション'},
    split:{icon:'⚡',name:'スプリット'},
    radial:{icon:'☀️',name:'ラジアル'},
    mesh:{icon:'🌌',name:'メッシュ'},
    pattern:{icon:'🎭',name:'パターン'},
  };
  const info=bgInfo[resolved]||{icon:'🎨',name:'背景'};
  // ── 配色プリセットカード（ダーク／ライト切り替え対応） ──
  const presetCard=addCard(el,'🎨','配色プリセット',presetColorMode==='dark'?'DARK':'LIGHT');
  // ダーク／ライト モードトグル
  const modeToggle=document.createElement('div');modeToggle.className='preset-mode-toggle';
  [['dark','🌙 ダーク'],['light','☀️ ライト']].forEach(([m,lbl])=>{
    const mBtn=document.createElement('button');mBtn.type='button';mBtn.textContent=lbl;
    if(presetColorMode===m)mBtn.classList.add('active');
    mBtn.onclick=()=>{presetColorMode=m;buildAllBgAdjust();};
    modeToggle.appendChild(mBtn);
  });
  presetCard.appendChild(modeToggle);
  // プリセットボタン群（グラデ背景＋アイコン＋名前）
  const presetRow=document.createElement('div');presetRow.className='color-preset-row';
  COLOR_PRESETS.forEach(p=>{
    const variant=p[presetColorMode]||p.dark;
    const btn=document.createElement('button');btn.type='button';btn.className='color-preset-btn';
    btn.style.background=`linear-gradient(135deg, ${variant.bgColor1}, ${variant.bgColor2})`;
    btn.style.color=variant.titleColor||(presetColorMode==='dark'?'#FFFFFF':'#1a1a1a');
    if(presetColorMode==='light')btn.classList.add('cp-light');
    btn.innerHTML=`<span class="cp-icon">${p.icon}</span><span class="cp-name">${p.name}</span>`;
    btn.onclick=()=>{
      pushUndo();
      s.bgColor1=variant.bgColor1;s.bgColor2=variant.bgColor2;
      if(variant.meshColor3)s.meshColor3=variant.meshColor3;
      if(variant.meshColor4)s.meshColor4=variant.meshColor4;
      if(variant.titleColor)s.titleColor=variant.titleColor;
      if(variant.subColor)s.subColor=variant.subColor;
      buildAllBgAdjust();render();
    };
    presetRow.appendChild(btn);
  });
  presetCard.appendChild(presetRow);
  // ── 背景カスタマイズカード（選択スタイルごと） ──
  const card=addCard(el,info.icon,info.name+'の詳細',resolved.toUpperCase());
  // メインカラー（全スタイル共通）
  addColorField(card,'メインカラー','bgColor1');
  // サブカラー（単色以外）
  if(!isSolid)addColorField(card,'サブカラー','bgColor2');
  // グラデーション
  if(isGrad)addSliderField(card,'グラデ角度','bgAngle',0,360,s.bgAngle!=null?s.bgAngle:135,'°');
  // スプリット
  if(isSplit)addSliderField(card,'カーブの強さ','splitCurve',-50,50,s.splitCurve!=null?s.splitCurve:30,'');
  // ラジアル
  if(isRadial){
    addSliderField(card,'中心位置（上下）','radialY',0,100,s.radialY!=null?s.radialY:40,'%');
    addSliderField(card,'広がり','radialSize',30,150,s.radialSize!=null?s.radialSize:80,'%');
  }
  // メッシュ
  if(isMesh){
    addColorField(card,'アクセント 1','meshColor3');
    addColorField(card,'アクセント 2','meshColor4');
  }
  // パターン
  if(isPattern){
    addSelectField(card,'パターン種類','patternType',[['dots','ドット'],['stripes','ストライプ'],['grid','グリッド'],['diamonds','ダイヤ']]);
    // パターン種類変更時にUIを再構築（ストライプ角度の出し分け）
    const sel=card.querySelector('select');if(sel){const orig=sel.onchange;sel.onchange=()=>{orig();buildAllBgAdjust();};}
    addSliderField(card,'模様の大きさ','patternScale',10,100,s.patternScale!=null?s.patternScale:50,'');
    addSliderField(card,'模様の濃さ','patternOpacity',3,40,s.patternOpacity!=null?s.patternOpacity:12,'%');
    if((s.patternType||'dots')==='stripes')addSliderField(card,'ストライプ角度','bgAngle',0,180,s.bgAngle!=null?s.bgAngle:45,'°');
  }
}
function buildAllBgAdjust(){
  buildBgAdjust(document.getElementById('bg-adjust'));
}
function buildLoGrid(el){
  if(!el)return;el.innerHTML='';
  const cats=[
    {id:'fixed',label:'テンプレート'},
    {id:'custom',label:'カスタム配置'},
  ];
  cats.forEach(cat=>{
    const items=PHONE_LAYOUTS.filter(lo=>lo.cat===cat.id);
    if(!items.length)return;
    const lbl=document.createElement('div');lbl.className='lo-cat-label';lbl.textContent=cat.label;
    el.appendChild(lbl);
    const grid=document.createElement('div');grid.className='opt-grid';
    items.forEach(lo=>{
      const card=makeOptCard(lo,'phoneLayout',PHONE_LAYOUTS,()=>{pushUndo();slides[curSlide].phoneLayout=lo.id;buildAllLoAdjust();render();});
      const mc=document.createElement('canvas');mc.width=100;mc.height=190;lo.mini(mc.getContext('2d'),100,190);
      card.querySelector('.opt-prev').appendChild(mc);grid.appendChild(card);
    });
    el.appendChild(grid);
  });
}
function buildLoAdjust(el){
  if(!el)return;el.innerHTML='';
  const s=slides[curSlide];
  const lo=s.phoneLayout;
  // 傾き
  if(lo==='tilted'){
    const card=addCard(el,'📐','傾き設定');
    addSliderField(card,'傾き角度','phoneTilt',-30,30,s.phoneTilt||10,'°');
  }
  // ウィジェット+iPhone
  if(lo==='widget-phone'){
    const card=addCard(el,'🧩','ウィジェット + iPhone');
    addSliderField(card,'ウィジェット サイズ','wpWidgetSize',20,100,s.wpWidgetSize||70,'%');
    addSliderField(card,'iPhone サイズ','wpPhoneSize',15,80,s.wpPhoneSize||42,'%');
    // 中央揃えボタン
    const centerRow=document.createElement('div');centerRow.style.cssText='display:flex;gap:6px;margin-top:2px';
    [['wpWidgetX','ウィジェットを中央'],['wpPhoneX','iPhoneを中央']].forEach(([key,label])=>{
      const btn=document.createElement('button');btn.className='btn btn-g';btn.style.cssText='font-size:10px;padding:4px 10px';
      btn.textContent=label;
      btn.onclick=()=>{pushUndo();s[key]=50;render();};
      centerRow.appendChild(btn);
    });
    card.appendChild(centerRow);
  }
  // ウィジェットグリッド
  if(lo==='widget-grid'){
    const card=addCard(el,'🧩','ウィジェットグリッド');
    addSliderField(card,'横幅（カラム数）','wgCols',2,4,s.wgCols||4,'列');
    const items=(s.wgItems||'xl,l,m,s').split(',').map(v=>v.trim()).filter(Boolean);
    const nameMap={s:'小',m:'中',l:'大',xl:'特大'};
    const colorMap={s:'#30D158',m:'#0A84FF',l:'#BF5AF2',xl:'#FF9F0A'};
    // ヘッダー（個数表示）
    const hdr=document.createElement('div');hdr.style.cssText='font-size:11px;color:var(--dm);display:flex;align-items:center;gap:8px;margin-top:2px';
    hdr.innerHTML=`<span>ウィジェット構成</span><span style="background:var(--b1);padding:1px 7px;border-radius:9px;font-size:10px;font-weight:700">${items.length}個</span>`;
    card.appendChild(hdr);
    // チップリスト（個別削除・並べ替え可能）
    const chipList=document.createElement('div');chipList.style.cssText='display:flex;gap:4px;flex-wrap:wrap';
    items.forEach((id,i)=>{
      const chip=document.createElement('div');
      const c=colorMap[id]||'var(--dm)';
      chip.style.cssText=`display:inline-flex;align-items:center;gap:2px;padding:3px 4px 3px 8px;border-radius:6px;font-size:11px;font-weight:700;background:${c}18;color:${c};border:1px solid ${c}40;cursor:default;user-select:none`;
      // 順序ラベル
      const lbl=document.createElement('span');lbl.textContent=nameMap[id]||id;
      chip.appendChild(lbl);
      // 左に移動
      if(i>0){
        const left=document.createElement('button');left.style.cssText=`background:none;border:none;color:${c};cursor:pointer;font-size:10px;padding:0 2px;opacity:.6`;
        left.textContent='◀';left.title='左に移動';
        left.onmouseenter=()=>left.style.opacity='1';left.onmouseleave=()=>left.style.opacity='.6';
        left.onclick=()=>{pushUndo();const arr=[...items];[arr[i-1],arr[i]]=[arr[i],arr[i-1]];s.wgItems=arr.join(',');buildAllLoAdjust();render();};
        chip.appendChild(left);
      }
      // 右に移動
      if(i<items.length-1){
        const right=document.createElement('button');right.style.cssText=`background:none;border:none;color:${c};cursor:pointer;font-size:10px;padding:0 2px;opacity:.6`;
        right.textContent='▶';right.title='右に移動';
        right.onmouseenter=()=>right.style.opacity='1';right.onmouseleave=()=>right.style.opacity='.6';
        right.onclick=()=>{pushUndo();const arr=[...items];[arr[i],arr[i+1]]=[arr[i+1],arr[i]];s.wgItems=arr.join(',');buildAllLoAdjust();render();};
        chip.appendChild(right);
      }
      // 個別削除
      if(items.length>1){
        const del=document.createElement('button');del.style.cssText=`background:none;border:none;color:${c};cursor:pointer;font-size:12px;padding:0 2px;opacity:.5;margin-left:1px`;
        del.textContent='×';del.title='削除';
        del.onmouseenter=()=>{del.style.opacity='1';del.style.color='var(--red)';};
        del.onmouseleave=()=>{del.style.opacity='.5';del.style.color=c;};
        del.onclick=()=>{pushUndo();const arr=[...items];arr.splice(i,1);s.wgItems=arr.join(',');buildAllLoAdjust();render();};
        chip.appendChild(del);
      }
      chipList.appendChild(chip);
    });
    card.appendChild(chipList);
    // 追加ボタン群
    const addBtnRow=document.createElement('div');addBtnRow.style.cssText='display:flex;gap:4px;flex-wrap:wrap;align-items:center';
    [['s','+ 小'],['m','+ 中'],['l','+ 大'],['xl','+ 特大']].forEach(([id,label])=>{
      const btn=document.createElement('button');btn.className='btn btn-g';btn.style.cssText='font-size:10px;padding:4px 8px';
      btn.textContent=label;
      btn.onclick=()=>{pushUndo();const cur=(s.wgItems||'xl,l,m,s');s.wgItems=cur+','+id;buildAllLoAdjust();render();};
      addBtnRow.appendChild(btn);
    });
    // リセット
    const sep=document.createElement('span');sep.style.cssText='width:1px;height:16px;background:var(--b2);margin:0 2px';
    addBtnRow.appendChild(sep);
    const resetBtn=document.createElement('button');resetBtn.className='btn btn-g';resetBtn.style.cssText='font-size:10px;padding:4px 8px';
    resetBtn.textContent='リセット';
    resetBtn.onclick=()=>{pushUndo();s.wgItems='xl,l,m,s';buildAllLoAdjust();render();};
    addBtnRow.appendChild(resetBtn);
    card.appendChild(addBtnRow);
  }
  // マルチiPhone
  if(lo==='multi-phone'){
    const card=addCard(el,'📱','マルチ iPhone');
    addSliderField(card,'台数','mpCount',1,5,s.mpCount||3,'台');
    // 台数変更時にUIを再構築
    const countSlider=card.querySelector('input[type=range]');
    if(countSlider){const orig=countSlider.oninput;countSlider.oninput=()=>{orig();buildAllLoAdjust();};}
    addSliderField(card,'サイズ（共通）','mpSize',15,70,s.mpSize||40,'%');
    addSliderField(card,'角度（共通）','mpRot',-30,30,s.mpRot||0,'°');
  }
  // フリー配置（デバイスごとに個別カード）
  if(lo==='free-device'){
    // MacBook
    const macCard=addCard(el,'💻','MacBook','フリー配置');
    addToggleField_s1(macCard,'表示','fdMacOn',true);
    if(s.fdMacOn!==false){
      addSliderField(macCard,'サイズ','fdMacSize',20,90,s.fdMacSize||60,'%');
      addSliderField(macCard,'回転','fdMacRot',-30,30,s.fdMacRot||0,'°');
      addSliderField(macCard,'重なり順','fdMacZ',0,3,s.fdMacZ!=null?s.fdMacZ:0,'');
    }
    // iPhone
    const iphCard=addCard(el,'📱','iPhone','フリー配置');
    addToggleField_s1(iphCard,'表示','fdIphoneOn',true);
    if(s.fdIphoneOn!==false){
      addSliderField(iphCard,'サイズ','fdIphoneSize',15,80,s.fdIphoneSize||50,'%');
      addSliderField(iphCard,'回転','fdIphoneRot',-30,30,s.fdIphoneRot||0,'°');
      addSliderField(iphCard,'重なり順','fdIphoneZ',0,3,s.fdIphoneZ!=null?s.fdIphoneZ:2,'');
    }
    // iPad
    const ipdCard=addCard(el,'🖥️','iPad','フリー配置');
    addToggleField_s1(ipdCard,'表示','fdIpadOn',true);
    if(s.fdIpadOn!==false){
      addSliderField(ipdCard,'サイズ','fdIpadSize',15,80,s.fdIpadSize||45,'%');
      addSliderField(ipdCard,'回転','fdIpadRot',-30,30,s.fdIpadRot||0,'°');
      addSliderField(ipdCard,'重なり順','fdIpadZ',0,3,s.fdIpadZ!=null?s.fdIpadZ:1,'');
    }
    // Apple Watch
    const wchCard=addCard(el,'⌚','Apple Watch','フリー配置');
    addToggleField_s1(wchCard,'表示','fdWatchOn',true);
    if(s.fdWatchOn!==false){
      addSliderField(wchCard,'サイズ','fdWatchSize',10,60,s.fdWatchSize||22,'%');
      addSliderField(wchCard,'回転','fdWatchRot',-30,30,s.fdWatchRot||0,'°');
      addSliderField(wchCard,'重なり順','fdWatchZ',0,3,s.fdWatchZ!=null?s.fdWatchZ:3,'');
    }
  }
}
function addToggleField_s1(p,label,key,defVal){
  const r=addRow(p,label);
  const btn=document.createElement('button');
  const on=slides[curSlide][key]!=null?slides[curSlide][key]:defVal;
  btn.className='fi';btn.style.cssText='width:auto;padding:5px 14px;cursor:pointer;'+(on?'border-color:var(--acc);background:var(--adim);color:var(--acc)':'');
  btn.textContent=on?'ON':'OFF';
  btn.onclick=()=>{pushUndo();slides[curSlide][key]=!on;buildAllLoAdjust();render();};
  r.appendChild(btn);
}
function buildAllLoAdjust(){
  buildLoAdjust(document.getElementById('lo-adjust'));
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
  buildBgGrid(document.getElementById('bg-grid'));
  buildLoGrid(document.getElementById('layout-grid'));
  buildFxList(document.getElementById('fx-list'));
  buildAllBgAdjust();
  buildAllLoAdjust();
}

function makeOptCard(item,stateKey,group,onChange){
  const card=document.createElement('div');const s=slides[curSlide];
  const curVal=stateKey==='bgStyle'?resolveBgStyle(s[stateKey]):s[stateKey];
  card.className='opt-card'+(curVal===item.id?' sel':'');card.id='oc-'+item.id+'-'+Math.random().toString(36).slice(2,6);
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
  const bg=BG_STYLES.find(b=>b.id===resolveBgStyle(s.bgStyle))||BG_STYLES[0];
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
  const bg=BG_STYLES.find(b=>b.id===resolveBgStyle(s.bgStyle))||BG_STYLES[0];
  const lo=PHONE_LAYOUTS.find(l=>l.id===s.phoneLayout)||PHONE_LAYOUTS[0];

  // Helper: build a section's content into a container el
  function buildTextSection(el){
    // タイトル（テキスト＋色を1枚のカードにまとめる）
    const titleCard=addCard(el,'✏️','タイトル');
    addTextareaField(titleCard,null,'title','キャッチコピーを入力');
    addInlineColorField(titleCard,'文字色','titleColor');
    // サブタイトル
    const subCard=addCard(el,'💬','サブタイトル');
    addTextField(subCard,null,'subtitle','サブコピーを入力');
    addInlineColorField(subCard,'文字色','subColor');
    // iPhone 文字調整
    const iphCard=addCard(el,'📱','iPhone 文字調整','iPhone');
    addSliderField(iphCard,'上下位置','textOffsetY',-50,50,s.textOffsetY||0,'px');
    addSliderField(iphCard,'文字サイズ','titleSize',60,160,s.titleSize||100,'%');
    // iPad 文字調整
    const ipdCard=addCard(el,'🖥️','iPad 文字調整','iPad');
    addSliderField(ipdCard,'上下位置','textOffsetYIpad',-50,50,s.textOffsetYIpad||0,'px');
    addSliderField(ipdCard,'文字サイズ','titleSizeIpad',60,160,s.titleSizeIpad||100,'%');
    // 機能リスト（feature-listレイアウトのみ）
    if(s.phoneLayout==='feature-list'){
      const flCard=addCard(el,'📋','機能リスト');
      addTextareaField(flCard,'項目（1行1項目、先頭に絵文字可）','featureItems','✓ 機能その1\n✓ 機能その2');
    }
  }
  function buildFontSection(el){
    const fontCard=addCard(el,'🔤','フォント');
    addFontPicker(fontCard);
    addFontWeightPicker(fontCard);
  }
  function addToggleField(p,label,key,defVal){
    const r=addRow(p,label);
    const btn=document.createElement('button');
    const on=slides[curSlide][key]!=null?slides[curSlide][key]:defVal;
    btn.className='fi';btn.style.cssText='width:auto;padding:5px 14px;cursor:pointer;'+(on?'border-color:var(--acc);background:var(--adim);color:var(--acc)':'');
    btn.textContent=on?'ON':'OFF';
    btn.onclick=()=>{pushUndo();slides[curSlide][key]=!on;buildFields();render();};
    r.appendChild(btn);
  }
  function buildDeviceSection(el){
    const isFree=s.phoneLayout==='free-device';

    // ── フリー配置は専用フロー ──
    if(isFree){
      // 📸 スクリーンショット（4デバイス分まとめて）
      const ssCard=addCard(el,'📸','スクリーンショット','フリー配置');
      if(s.fdIphoneOn!==false) addUploadField(ssCard,'iPhone用','screenshotImg','_src');
      if(s.fdIpadOn!==false) addUploadField(ssCard,'iPad用','screenshotImg2','_src2');
      if(s.fdMacOn!==false) addUploadField(ssCard,'MacBook用','screenshotImg3','_src3');
      if(s.fdWatchOn!==false) addUploadField(ssCard,'Apple Watch用','widgetMediumImg','_srcWidgetMedium');
      // iPhoneフレーム調整（フリー配置のiPhoneにも適用される）
      const adjCard=addCard(el,'🎚','iPhone スクショ調整');
      addSliderField(adjCard,'ズーム','screenshotScale',100,200,s.screenshotScale||100,'%');
      addSliderField(adjCard,'横位置','screenshotOffsetX',-50,50,s.screenshotOffsetX||0,'%');
      addSliderField(adjCard,'縦位置','screenshotOffsetY',-50,50,s.screenshotOffsetY||0,'%');
      addSelectField(adjCard,'iPhoneフレーム色','frameColor',[['black','ブラック'],['silver','シルバー'],['gold','ゴールド'],['none','フレームなし']]);
      // 💻 MacBook
      const macCard=addCard(el,'💻','MacBook','フリー配置');
      addToggleField(macCard,'表示','fdMacOn',true);
      if(s.fdMacOn!==false){
        addSliderField(macCard,'サイズ','fdMacSize',20,90,s.fdMacSize||60,'%');
        addSliderField(macCard,'回転','fdMacRot',-30,30,s.fdMacRot||0,'°');
        addSliderField(macCard,'重なり順','fdMacZ',0,3,s.fdMacZ!=null?s.fdMacZ:0,'');
      }
      // 📱 iPhone
      const fdIphCard=addCard(el,'📱','iPhone','フリー配置');
      addToggleField(fdIphCard,'表示','fdIphoneOn',true);
      if(s.fdIphoneOn!==false){
        addSliderField(fdIphCard,'サイズ','fdIphoneSize',15,80,s.fdIphoneSize||50,'%');
        addSliderField(fdIphCard,'回転','fdIphoneRot',-30,30,s.fdIphoneRot||0,'°');
        addSliderField(fdIphCard,'重なり順','fdIphoneZ',0,3,s.fdIphoneZ!=null?s.fdIphoneZ:2,'');
      }
      // 🖥️ iPad
      const fdIpdCard=addCard(el,'🖥️','iPad','フリー配置');
      addToggleField(fdIpdCard,'表示','fdIpadOn',true);
      if(s.fdIpadOn!==false){
        addSliderField(fdIpdCard,'サイズ','fdIpadSize',15,80,s.fdIpadSize||45,'%');
        addSliderField(fdIpdCard,'回転','fdIpadRot',-30,30,s.fdIpadRot||0,'°');
        addSliderField(fdIpdCard,'重なり順','fdIpadZ',0,3,s.fdIpadZ!=null?s.fdIpadZ:1,'');
      }
      // ⌚ Apple Watch
      const fdWchCard=addCard(el,'⌚','Apple Watch','フリー配置');
      addToggleField(fdWchCard,'表示','fdWatchOn',true);
      if(s.fdWatchOn!==false){
        addSliderField(fdWchCard,'サイズ','fdWatchSize',10,60,s.fdWatchSize||22,'%');
        addSliderField(fdWchCard,'回転','fdWatchRot',-30,30,s.fdWatchRot||0,'°');
        addSliderField(fdWchCard,'重なり順','fdWatchZ',0,3,s.fdWatchZ!=null?s.fdWatchZ:3,'');
      }
      return;
    }

    // ── 通常レイアウト ──
    const isWidgetLayout=['widget-grid','widget-phone'].includes(s.phoneLayout);
    const needsPhone=!['widget-grid'].includes(s.phoneLayout);

    if(s.phoneLayout==='multi-phone'){
      const count=Math.max(1,Math.min(5,s.mpCount||3));
      const mpCard=addCard(el,'📱','iPhone スクショ',count+'台分');
      const imgKeys=[['screenshotImg','_src'],['screenshotImg2','_src2'],['screenshotImg3','_src3'],['screenshotImg4','_src4'],['screenshotImgIpad','_srcIpad']];
      for(let i=0;i<count;i++){
        addUploadField(mpCard,'iPhone '+(i+1),imgKeys[i][0],imgKeys[i][1]);
      }
    } else if(needsPhone){
      const ssCard=addCard(el,'📸','スクリーンショット','iPhone & iPad');
      addUploadField(ssCard,'iPhone用','screenshotImg','_src');
      addUploadField(ssCard,'iPad用','screenshotImgIpad','_srcIpad');
      if(s.phoneLayout==='before-after') addUploadField(ssCard,'下段','screenshotImg2','_src2');
    }
    if(isWidgetLayout){
      const wgCard=addCard(el,'🧩','ウィジェット画像');
      if(s.phoneLayout==='widget-grid'){
        addUploadField(wgCard,'大 / 特大 ウィジェット','widgetLargeImg','_srcWidgetLarge');
        addUploadField(wgCard,'中ウィジェット','widgetMediumImg','_srcWidgetMedium');
        addUploadField(wgCard,'小ウィジェット','widgetSmallImg','_srcWidgetSmall');
      } else { // widget-phone
        addUploadField(wgCard,'ウィジェット画像','widgetLargeImg','_srcWidgetLarge');
      }
    }
    if(needsPhone||s.phoneLayout==='screen-fill'||s.phoneLayout==='screen-fill-top'){
      const adjCard=addCard(el,'🎚','スクショ表示調整');
      addSliderField(adjCard,'ズーム','screenshotScale',100,200,s.screenshotScale||100,'%');
      addSliderField(adjCard,'横位置','screenshotOffsetX',-50,50,s.screenshotOffsetX||0,'%');
      addSliderField(adjCard,'縦位置','screenshotOffsetY',-50,50,s.screenshotOffsetY||0,'%');
      if(needsPhone){
        addSelectField(adjCard,'フレームカラー','frameColor',[['black','ブラック'],['silver','シルバー'],['gold','ゴールド'],['none','フレームなし']]);
      }
      if(s.phoneLayout==='tilted')addSliderField(adjCard,'傾き角度','phoneTilt',-30,30,s.phoneTilt||10,'°');
    }
  }

  // s2-leftの中身を動的に構築
  const s2left=document.getElementById('s2-left');
  if(!s2left)return;
  s2left.innerHTML='';

  // タブバー
  const tabBar=document.createElement('div');
  tabBar.className='s2-tab-bar';tabBar.id='s2-tab-bar';
  const tabs=[['text','✍️ テキスト'],['font','🔤 フォント'],['device','📱 デバイス']];
  const curTab=s2left.dataset.tab||'text';
  tabs.forEach(([id,label])=>{
    const btn=document.createElement('button');
    btn.textContent=label;
    if(id===curTab)btn.classList.add('active');
    btn.onclick=()=>{s2left.dataset.tab=id;buildFields();};
    tabBar.appendChild(btn);
  });
  s2left.appendChild(tabBar);

  // アクティブペインのみ構築
  const pane=document.createElement('div');
  pane.className='s2-pane active';
  if(curTab==='text') buildTextSection(pane);
  else if(curTab==='font') buildFontSection(pane);
  else if(curTab==='device') buildDeviceSection(pane);
  s2left.appendChild(pane);
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
  const applyValue=()=>{slides[curSlide][key]=+inp.value;display.textContent=inp.value+(unit||'');render();};
  inp.oninput=applyValue;
  inp.onchange=()=>{applyValue();pushUndo();};
  row2.appendChild(inp);row2.appendChild(display);r.appendChild(row2);
}
function addSec(p,t){const d=document.createElement('div');d.className='sec-lbl';d.textContent=t;p.appendChild(d);}
function addDivider(p){const d=document.createElement('div');d.className='divider';p.appendChild(d);}
function addRow(p,label){const r=document.createElement('div');r.className='frow';if(label){const l=document.createElement('div');l.className='flbl';l.textContent=label;r.appendChild(l);}p.appendChild(r);return r;}
// グループ化されたカードセクションを追加し、内部のbody要素を返す
function addCard(p,icon,title,sub){
  const card=document.createElement('div');card.className='field-card';
  const head=document.createElement('div');head.className='field-card-head';
  const ic=document.createElement('div');ic.className='field-card-icon';ic.textContent=icon||'';
  const tt=document.createElement('div');tt.className='field-card-title';tt.textContent=title||'';
  head.appendChild(ic);head.appendChild(tt);
  if(sub){const sb=document.createElement('div');sb.className='field-card-sub';sb.textContent=sub;head.appendChild(sb);}
  const body=document.createElement('div');body.className='field-card-body';
  card.appendChild(head);card.appendChild(body);p.appendChild(card);
  return body;
}
// カード内に「色: [picker] #hex」のような横並び行を追加する
function addInlineColorField(p,label,key){
  const row=document.createElement('div');row.className='field-color-row';
  const lbl=document.createElement('div');lbl.className='fcr-lbl';lbl.textContent=label;
  const crow=document.createElement('div');crow.className='crow';const s=slides[curSlide];
  const cp=document.createElement('input');cp.type='color';cp.value=s[key]||'#FFFFFF';
  const hx=document.createElement('input');hx.className='chex';hx.value=s[key]||'#FFFFFF';hx.maxLength=7;
  cp.oninput=()=>{slides[curSlide][key]=cp.value;hx.value=cp.value;render();};
  cp.onchange=()=>pushUndo();
  hx.oninput=()=>{if(/^#[0-9a-fA-F]{6}$/.test(hx.value)){slides[curSlide][key]=hx.value;cp.value=hx.value;render();}};
  hx.onchange=()=>pushUndo();
  crow.appendChild(cp);crow.appendChild(hx);
  row.appendChild(lbl);row.appendChild(crow);p.appendChild(row);
}
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
  const cp=document.createElement('input');cp.type='color';cp.value=s[key]||'#FFFFFF';
  const hx=document.createElement('input');hx.className='chex';hx.value=s[key]||'#FFFFFF';hx.maxLength=7;
  cp.oninput=()=>{slides[curSlide][key]=cp.value;hx.value=cp.value;render();};
  cp.onchange=()=>pushUndo();
  hx.oninput=()=>{if(/^#[0-9a-fA-F]{6}$/.test(hx.value)){slides[curSlide][key]=hx.value;cp.value=hx.value;render();}};
  hx.onchange=()=>pushUndo();
  crow.appendChild(cp);crow.appendChild(hx);r.appendChild(crow);
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
async function loadImg(file,key,srcKey='_src'){
  if(!file||!file.type.startsWith('image/'))return;
  try{
    const rawSrc=await fileToDataUrl(file);
    const optimizedSrc=await optimizeImageDataUrl(rawSrc,IMAGE_UPLOAD_OPT);
    const img=await loadImageFromSrc(optimizedSrc);
    pushUndo();
    slides[curSlide][key]=img;
    slides[curSlide][srcKey]=optimizedSrc;
    buildFields();
    render();
    const rawBytes=dataUrlBytes(rawSrc);
    const optimizedBytes=dataUrlBytes(optimizedSrc);
    if(optimizedBytes<rawBytes){
      const reduced=Math.round((1-optimizedBytes/rawBytes)*100);
      showToast(`画像を読み込みました（最適化 -${reduced}%）`);
    }else{
      showToast('画像を読み込みました');
    }
  }catch(e){
    console.error('loadImg error:',e);
    showToast('画像の読み込みに失敗しました');
  }
}
document.addEventListener('paste',e=>{for(const item of e.clipboardData.items){if(item.type.startsWith('image/')){const key=isIpadDev()?'screenshotImgIpad':'screenshotImg';const src=isIpadDev()?'_srcIpad':'_src';loadImg(item.getAsFile(),key,src);break;}}});

/* ═══ CONVERT MODAL ═══ */
let convTargetIdx=null,convSelBg=null,convSelLo=null;

function showConvModal(idx){
  convTargetIdx=idx;const s=slides[idx];
  convSelBg=resolveBgStyle(s.bgStyle);convSelLo=s.phoneLayout;
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
  if(convTargetIdx===curSlide){if(inStep===2)buildFields();if(inStep===1){buildAllBgAdjust();buildAllLoAdjust();}}
  render();showToast('パーツを変換しました 🔄');
}

/* ═══ SLIDES + DRAG&DROP ═══ */
let dragSrc=null;
function copyImgFields(ns,src){
  ['screenshotImg','screenshotImg2','screenshotImg3','screenshotImg4','screenshotImgIpad','widgetSmallImg','widgetMediumImg','widgetLargeImg'].forEach(k=>{ns[k]=src[k];});
  ['_src','_src2','_src3','_src4','_srcIpad','_srcWidgetSmall','_srcWidgetMedium','_srcWidgetLarge'].forEach(k=>{ns[k]=src[k];});
}
function addSlide(){
  // 「+」はデフォルトの新規スライドを追加する。複製したい場合は ⧉ ボタンを使う
  pushUndo();
  slides.push(defSlide());
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
    document.querySelectorAll('.opt-card[data-state-key="bgStyle"]').forEach(c=>c.classList.toggle('sel',c.dataset.itemId===resolveBgStyle(slides[i].bgStyle)));
    document.querySelectorAll('.opt-card[data-state-key="phoneLayout"]').forEach(c=>c.classList.toggle('sel',c.dataset.itemId===slides[i].phoneLayout));
    buildAllBgAdjust();
    buildAllLoAdjust();
    updateSummary();
  }
  if(inStep===2) buildFields();
  if(inStep===3) buildStep3();
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
      e.preventDefault();div.classList.remove('drag-over');if(dragSrc===null||dragSrc===i){dragSrc=null;return;}
      pushUndo();const moved=slides.splice(dragSrc,1)[0];const newIdx=dragSrc<i?i-1:i;slides.splice(newIdx,0,moved);
      let newCur=curSlide;if(curSlide===dragSrc)newCur=newIdx;else if(curSlide>Math.min(dragSrc,newIdx)&&curSlide<=Math.max(dragSrc,newIdx))newCur=dragSrc<newIdx?curSlide-1:curSlide+1;
      curSlide=newCur;dragSrc=null;renderThumbs();if(inStep===2)buildFields();if(inStep===3)buildStep3();render();showToast('スライドを移動しました');
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
  const url=URL.createObjectURL(blob);a.href=url;
  a.download=`preview_${curDev}inch_all${slides.length}slides.zip`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
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
      const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;
      a.download=filename;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      if(!silent)showToast(`スライド${i+1}を書き出しました！`);
    },'image/png');
  }
}
let _toastTimer=null;
function showToast(m){const t=document.getElementById('toast');if(_toastTimer)clearTimeout(_toastTimer);t.textContent=m;t.classList.add('show');_toastTimer=setTimeout(()=>{t.classList.remove('show');_toastTimer=null;},2400);}

/* ═══ TEMPLATES ═══ */
const TEMPLATES=[
  {
    id:'standard5',
    name:'スタンダード5枚',
    desc:'王道の5枚構成。機能紹介に最適',
    slides:[
      {bgStyle:'gradient',phoneLayout:'center-large',effects:['glow'],bgColor1:'#0A84FF',bgColor2:'#5856D6',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:105},
      {bgStyle:'gradient',phoneLayout:'text-top',effects:['glow'],bgColor1:'#30D158',bgColor2:'#34C759',title:'機能その1\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'text-top',effects:['glow'],bgColor1:'#FF9F0A',bgColor2:'#FF6B00',title:'機能その2\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'text-top',effects:['glow'],bgColor1:'#BF5AF2',bgColor2:'#9B59B6',title:'機能その3\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'text-hero',effects:['glow'],bgColor1:'#FF375F',bgColor2:'#FF2D55',title:'今すぐ\nダウンロード',subtitle:'無料で始められます',titleColor:'#fff',subColor:'#fff',badgeText:'App Storeで配信中',badgeColor:'#fff',badgeTextColor:'#c00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'dark5',
    name:'ダークテーマ5枚',
    desc:'かっこいいダーク系。ゲーム・ツール系に',
    slides:[
      {bgStyle:'gradient',phoneLayout:'center-large',effects:['glow','deco'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#7B5FF2',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#aaa',fontId:'dela',fontWeight:'400',titleSize:105},
      {bgStyle:'gradient',phoneLayout:'text-top',effects:['glow'],bgColor1:'#0d1117',bgColor2:'#1a1040',accentColor:'#0A84FF',title:'機能その1\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'text-top',effects:['glow'],bgColor1:'#0d1117',bgColor2:'#0d2040',accentColor:'#30D158',title:'機能その2\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'feature-list',effects:['glow'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#BF5AF2',title:'主な機能',subtitle:'',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'700',titleSize:100,featureItems:'✨ 機能その1\n🚀 機能その2\n🔒 機能その3\n📊 機能その4\n⚡ 機能その5'},
      {bgStyle:'gradient',phoneLayout:'text-hero',effects:['glow'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#FF375F',title:'今すぐ\nダウンロード',subtitle:'無料で始められます',titleColor:'#fff',subColor:'#aaa',badgeText:'App Storeで配信中',badgeColor:'#FF375F',badgeTextColor:'#fff',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'feature5',
    name:'機能紹介5枚',
    desc:'機能リストを使った詳細紹介構成',
    slides:[
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'center-large',effects:['glow'],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:105},
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'text-top',effects:['glow'],bgColor1:'#4facfe',bgColor2:'#00f2fe',title:'機能その1\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:100},
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'text-top',effects:['glow'],bgColor1:'#43e97b',bgColor2:'#38f9d7',title:'機能その2\nの説明',subtitle:'詳細説明をここに',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:100},
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'feature-list',effects:[],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'できること',subtitle:'',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'700',titleSize:100,featureItems:'📌 機能その1\n🎯 機能その2\n💡 機能その3\n🔔 機能その4\n❤️ 機能その5'},
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'text-hero',effects:['glow'],bgColor1:'#f093fb',bgColor2:'#f5576c',title:'今すぐ\n試してみて',subtitle:'',titleColor:'#fff',subColor:'#ddd',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'minimal3',
    name:'ミニマル3枚',
    desc:'シンプルに3枚でまとめる。スタイリッシュ',
    slides:[
      {bgStyle:'solid',phoneLayout:'center-large',effects:['deco'],bgColor1:'#fff',accentColor:'#0A84FF',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#1a1a1a',subColor:'#555',fontId:'noto',fontWeight:'900',titleSize:105},
      {bgStyle:'solid',phoneLayout:'text-top',effects:['deco'],bgColor1:'#fff',accentColor:'#30D158',title:'一番の\n特徴はこれ',subtitle:'詳細説明をここに',titleColor:'#1a1a1a',subColor:'#555',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'solid',phoneLayout:'text-hero',effects:['deco'],bgColor1:'#fff',accentColor:'#FF9F0A',title:'今すぐ\n始めよう',subtitle:'',titleColor:'#1a1a1a',subColor:'#555',badgeText:'App Storeで無料配信',badgeColor:'#0A84FF',badgeTextColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:110},
    ]
  },
  {
    id:'widget3',
    name:'ウィジェット紹介3枚',
    desc:'ウィジェット機能をアピールする構成',
    slides:[
      {bgStyle:'gradient',phoneLayout:'widget-grid',effects:['glow'],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'ウィジェットで\nもっと便利に',subtitle:'ホーム画面からすぐアクセス',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'widget-phone',effects:['glow'],bgColor1:'#4facfe',bgColor2:'#00f2fe',title:'アプリと連携',subtitle:'リアルタイムで情報を表示',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'text-hero',effects:['glow'],bgColor1:'#30D158',bgColor2:'#34C759',title:'今すぐ\nダウンロード',subtitle:'',titleColor:'#fff',subColor:'#fff',badgeText:'ウィジェット対応',badgeColor:'#fff',badgeTextColor:'#1a6e00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'theme3',
    name:'テーマ紹介3枚',
    desc:'豊富なテーマ・カラーをアピール',
    slides:[
      {bgStyle:'gradient',phoneLayout:'before-after',effects:['glow'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#BF5AF2',title:'ライト & ダーク\n自由に切り替え',subtitle:'目に優しいデザイン',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'900',titleSize:95},
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'center-large',effects:['glow'],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'10種類以上の\nカラーテーマ',subtitle:'あなた好みにカスタマイズ',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'800',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'text-hero',effects:['glow'],bgColor1:'#FF375F',bgColor2:'#FF2D55',title:'自分だけの\nスタイルを',subtitle:'',titleColor:'#fff',subColor:'#fff',badgeText:'テーマ機能搭載',badgeColor:'#fff',badgeTextColor:'#c00',fontId:'dela',fontWeight:'400',titleSize:110},
    ]
  },
  {
    id:'allFeatures5',
    name:'フル機能5枚',
    desc:'アプリ・ウィジェット・テーマを全部紹介',
    slides:[
      {bgStyle:'gradient',phoneLayout:'center-large',effects:['glow'],bgColor1:'#0A84FF',bgColor2:'#5856D6',title:'アプリ名\nキャッチコピー',subtitle:'サブタイトルを入れてね',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:105},
      {bgStyle:'gradient',phoneLayout:'widget-phone',effects:['glow'],bgColor1:'#30D158',bgColor2:'#34C759',title:'便利なウィジェット',subtitle:'ホーム画面に追加しよう',titleColor:'#fff',subColor:'#fff',fontId:'noto',fontWeight:'900',titleSize:100},
      {bgStyle:'gradient',phoneLayout:'before-after',effects:['glow','deco'],bgColor1:'#0a0a1a',bgColor2:'#1a0830',accentColor:'#BF5AF2',title:'ライト & ダーク\n両対応',subtitle:'お好みで切り替え',titleColor:'#fff',subColor:'#aaa',fontId:'noto',fontWeight:'900',titleSize:95},
      {bgStyle:'gradient',bgAngle:180,phoneLayout:'feature-list',effects:[],bgColor1:'#667EEA',bgColor2:'#764BA2',title:'できること',subtitle:'',titleColor:'#fff',subColor:'#ddd',fontId:'mplus',fontWeight:'700',titleSize:100,featureItems:'📌 機能その1\n🎯 機能その2\n💡 機能その3\n🔔 機能その4\n❤️ 機能その5'},
      {bgStyle:'gradient',phoneLayout:'free-device',effects:['glow'],bgColor1:'#FF9F0A',bgColor2:'#FF6B00',title:'iPhone・iPad\nウィジェット対応',subtitle:'すべてのデバイスで',titleColor:'#fff',subColor:'#fff',badgeText:'App Storeで配信中',badgeColor:'#fff',badgeTextColor:'#a04000',fontId:'dela',fontWeight:'400',titleSize:100},
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
  const savedDev=curDev;
  for(const devId of targetDevs){
    curDev=devId; // デバイスを切り替えてレンダリング
    const dev=DEVS[devId];
    const folder=zip.folder(dev.lbl.replace(/[^a-zA-Z0-9×_"]/g,''));
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
  curDev=savedDev; // 元のデバイスに戻す
  const blob=await zip.generateAsync({type:'blob'});
  const a=document.createElement('a');
  const url2=URL.createObjectURL(blob);a.href=url2;
  a.download=`preview_allsizes_${slides.length}slides.zip`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url2),1000);
  showToast(`全サイズZIPを書き出しました 🗜`);
}
window.onload=async()=>{
  await document.fonts.ready;
  initS1PreviewZoom();
  initEditorPaneResizer();
  initAllCanvas();
  buildStep1();
  updateUndoBtn();
  iphoneSetup();
  initDriveSync();
  // ブラウザの戻る/進むで状態復元
  window.addEventListener('popstate',applyHashRoute);
  // 初期ルート: URL の #p/<id> を解釈し、なければダッシュボード
  applyHashRoute();
};

/* ═══ DRIVE SYNC INTEGRATION ═══
   /drive-sync.js（リポジトリ共通の汎用エンジン）に登録するだけ。
   保存系はすでに各所で markDirty / markDeleted を呼ぶようフックされている。
   未ログイン時はアプリは普通にローカルだけで動く。 */
function initDriveSync(){
  if(!window.driveSync) return;
  window.driveSync.register({
    toolId: 'appstore-preview',
    keys: [PROJECTS_KEY],
    keyPatterns: [new RegExp('^'+PROJECT_PREFIX.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))],
    // リモートから新しいデータが降ってきたらダッシュボードを再描画
    onSyncedFromRemote: ()=>{
      if(inDashboard) renderDashboard();
      // 編集中のプロジェクトが更新されたら警告だけ出す（強制リロードはしない）
      if(!inDashboard && currentProjectId){
        showToast('別の端末から更新がありました。再読み込みすると反映されます');
      }
    },
  });
  const mount=document.getElementById('sync-mount');
  if(mount) window.driveSync.mountUI(mount);
  window.driveSync.init();
}

/* ═══ IPHONE SUPPORT ═══ */
function isIphone(){return window.innerWidth<=479;}
function isIpadDev(){return curDev.startsWith('ipad');}
// Return the appropriate screenshot image for current device
function getScreenshot(s){return isIpadDev()?(s.screenshotImgIpad||null):s.screenshotImg;}

function iphoneSetup(){
  // iphone-nav の表示は CSS の body[data-view="editor"] + @media で制御済み。
  // ここでは inStep に依存する s2-tab-bar の出し分けだけを面倒みる。
  const apply=()=>{
    const s2tab=document.getElementById('s2-tab-bar');
    if(s2tab){
      const iph=isIphone();
      s2tab.style.display=(iph&&!inDashboard&&inStep===2)?'flex':'none';
    }
    if(isIphone()&&!inDashboard) iphoneApplyStep();
  };
  apply();
  window.addEventListener('resize',apply);
}

function iphoneApplyStep(){
  if(!isIphone())return;
  const partsBtn=document.getElementById('inav-parts');
  if(partsBtn) partsBtn.classList.toggle('iph-hidden', inStep===1);
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
