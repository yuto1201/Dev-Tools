/* ═══ SVG アイコンヘルパー ═══ */
function ic(name,size){return window.yutoIcons?yutoIcons.toSVG(name,{size:size||16}):'';}
function initIcons(){
  document.querySelectorAll('[data-ic]').forEach(function(el){
    var size=parseInt(el.dataset.icSize)||16;
    el.innerHTML=yutoIcons.toSVG(el.dataset.ic,{size:size});
  });
}

var tables={},relations=[],nodePos={},nodeCol={},editTbl=null;
var tableComments={};
var historyStack=[],historyFuture=[];
var MAX_HISTORY=50;
var showLabels=true,showDBG=true,showMemo=true;
var memos={};
var memoIdCounter=0;
var editingMemoId=null;
var changeLog=[];
var databases={}; // {dbName: {color,comment}}
var tableDB={}; // {tableName: dbName}
var collapsedDBs={}; // {dbName: true} — サイドバーの折りたたみ状態
var DB_PALETTE=['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#f97316'];
var tf={x:40,y:40,scale:1},isPan=false,panMode=false,panSt=null;
var dragNode=null,dragOff={x:0,y:0};
var TYPES=['int','bigint','varchar','varchar(255)','char','text','boolean','date','datetime','timestamp','decimal(10,2)','float','double','uuid','json','blob'];
var cnv=document.getElementById('cnv');
var nl=document.getElementById('nl'),el=document.getElementById('el'),dr=document.getElementById('dr');

function openAddModal(){
  editTbl=null;
  document.getElementById('mttl').textContent='新しいテーブルを追加';
  document.getElementById('inName').value='';
  if(document.getElementById('inComment'))document.getElementById('inComment').value='';
  document.getElementById('delBtn').style.display='none';
  refreshDBSelect(null);
  document.getElementById('colList').innerHTML='';
  document.getElementById('fkList').innerHTML='';
  addColRow({name:'id',type:'INT',pk:true,nullable:false});
  document.getElementById('tblModal').classList.add('open');
  setTimeout(function(){document.getElementById('inName').focus();},150);
}

function openEditModal(name){
  editTbl=name;
  document.getElementById('mttl').textContent='編集：'+name;
  document.getElementById('inName').value=name;
  if(document.getElementById('inComment'))document.getElementById('inComment').value=tableComments[name]||'';
  refreshDBSelect(tableDB[name]||null);
  document.getElementById('delBtn').style.display='flex';
  document.getElementById('colList').innerHTML='';
  document.getElementById('fkList').innerHTML='';
  (tables[name]||[]).forEach(function(c){addColRow(c);});
  (tables[name]||[]).filter(function(c){return c.fk;}).forEach(function(c){addFKRow({fromCol:c.name,toTable:c.fk.table,toCol:c.fk.col,cardinality:c.fk.cardinality||'1-n'});});
  document.getElementById('tblModal').classList.add('open');
}

function renderIncomingRefs(name){
  var sec=document.getElementById('incomingRefs');
  if(!sec)return;
  var rows=[];
  Object.entries(tables).forEach(function(e){
    var tblName=e[0],cols=e[1];
    if(tblName===name)return;
    cols.forEach(function(col){
      if(col.fk&&col.fk.table===name){
        rows.push({fromTable:tblName,fromCol:col.name,toCol:col.fk.col,card:col.fk.cardinality||'1-n'});
      }
    });
  });
  if(!rows.length){
    sec.innerHTML='<div style="font-size:11px;color:var(--muted);padding:6px 2px;">このテーブルを参照している外部キーはありません</div>';
    return;
  }
  var cardLabel={'1-1':'1対1','1-n':'1対多','n-1':'多対1','n-n':'多対多'};
  sec.innerHTML=rows.map(function(r){
    var cl=cardLabel[r.card]||r.card;
    return '<div style="padding:7px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px;font-size:11px;margin-bottom:5px;line-height:1.8;">'
      +'<span style="color:var(--accent);font-weight:600;">'+r.fromTable+'</span>'
      +'<span style="color:var(--muted);"> の </span>'
      +'<span style="color:var(--yellow);">'+r.fromCol+'</span>'
      +'<span style="color:var(--muted);"> が、このテーブルの </span>'
      +'<span style="color:var(--yellow);">'+r.toCol+'</span>'
      +'<span style="color:var(--muted);"> を参照しています</span>'
      +'<span style="color:var(--purple);font-size:10px;margin-left:8px;padding:1px 7px;border:1px solid var(--purple);border-radius:99px;">'+cl+'</span>'
      +'</div>';
  }).join('');
}

function closeModal(){document.getElementById('tblModal').classList.remove('open');}

function addColRow(data){
  data=data||{};
  var row=document.createElement('div');
  row.className='col-row';
  row.draggable=true;
  var typeOpts=TYPES.map(function(t){return '<option value="'+t+'"'+(data.type===t?' selected':'')+'>'+t+'</option>';}).join('');
  row.innerHTML='<div class="drag-handle" title="ドラッグで並び替え">'+ic('grip-vertical',14)+'</div><input class="cn" placeholder="column_name" value="'+(data.name||'')+'" autocomplete="off"><select class="ct">'+typeOpts+'</select><div class="col-tog"><input type="checkbox" class="cpk"'+(data.pk?' checked':'')+'><label>PK</label></div><div class="col-tog"><input type="checkbox" class="cnu"'+(data.nullable!==false?' checked':'')+'><label>NULL</label></div><input class="cm" placeholder="メモ" value="'+(data.comment||'')+'" autocomplete="off" style="font-size:10px;"><button class="col-del" onclick="this.closest(\'.col-row\').remove()">'+ic('x',14)+'</button>';
  var pk=row.querySelector('.cpk'),nu=row.querySelector('.cnu');
  function sync(){if(pk.checked){nu.checked=false;nu.disabled=true;}else{nu.disabled=false;}}
  pk.addEventListener('change',sync);sync();
  // Drag & drop reorder
  row.addEventListener('dragstart',function(e){
    e.dataTransfer.effectAllowed='move';
    row.classList.add('dragging');
    colDragSrc=row;
  });
  row.addEventListener('dragend',function(){
    row.classList.remove('dragging');
    document.querySelectorAll('#colList .col-row').forEach(function(r){r.classList.remove('drag-over');});
  });
  row.addEventListener('dragover',function(e){
    e.preventDefault();e.dataTransfer.dropEffect='move';
    if(row!==colDragSrc){row.classList.add('drag-over');}
  });
  row.addEventListener('dragleave',function(){row.classList.remove('drag-over');});
  row.addEventListener('drop',function(e){
    e.preventDefault();
    row.classList.remove('drag-over');
    if(colDragSrc&&colDragSrc!==row){
      var list=document.getElementById('colList');
      var rows=Array.from(list.querySelectorAll('.col-row'));
      var srcIdx=rows.indexOf(colDragSrc),dstIdx=rows.indexOf(row);
      if(srcIdx<dstIdx){list.insertBefore(colDragSrc,row.nextSibling);}
      else{list.insertBefore(colDragSrc,row);}
    }
  });
  document.getElementById('colList').appendChild(row);
}
var colDragSrc=null;
var collapsedTables={}; // {tableName: true/false}

function addFKRow(data){
  data=data||{};
  var row=document.createElement('div');
  row.className='fk-row';
  var cur=document.getElementById('inName').value||editTbl||'';
  var opts=Object.keys(tables).filter(function(t){return t!==cur;}).map(function(t){return '<option value="'+t+'"'+(data.toTable===t?' selected':'')+'>'+t+'</option>';}).join('');
  var dlId='dl'+Date.now().toString(36);
  var dlId2='dl2'+Date.now().toString(36);
  var curCols=(tables[cur]||[]).map(function(c){return '<option value="'+c.name+'">';}).join('');
  var initToTable=data.toTable||Object.keys(tables).filter(function(t){return t!==cur;})[0]||'';
  var toCols=(tables[initToTable]||[]).map(function(c){return '<option value="'+c.name+'">';}).join('');
  var cardVal=data.cardinality||'1-n';
  row.innerHTML='<input placeholder="このテーブルの列" value="'+(data.fromCol||'')+'" class="ff" list="'+dlId+'" autocomplete="off"><datalist id="'+dlId+'">'+curCols+'</datalist><div class="fk-arr">→</div><select class="ft">'+(opts||'<option value="">（テーブルなし）</option>')+'</select><div class="fk-arr">.</div><input placeholder="参照列(例:id)" value="'+(data.toCol||'id')+'" class="fc" list="'+dlId2+'" autocomplete="off"><datalist id="'+dlId2+'">'+toCols+'</datalist><select class="fcard"><option value="1-1" '+(cardVal==='1-1'?'selected':'')+'>1対1</option><option value="1-n" '+(cardVal==='1-n'?'selected':'')+'>1対多</option><option value="n-1" '+(cardVal==='n-1'?'selected':'')+'>多対1</option><option value="n-n" '+(cardVal==='n-n'?'selected':'')+'>多対多</option></select><button class="col-del" onclick="this.closest(\'.fk-row\').remove()">'+ic('x',14)+'</button>';
  // 参照先テーブルが変わったらdatalistを更新
  var ftSel=row.querySelector('.ft');
  var fcDl=row.querySelector('#'+dlId2);
  ftSel.addEventListener('change',function(){
    var selectedTbl=ftSel.value;
    fcDl.innerHTML=(tables[selectedTbl]||[]).map(function(c){return '<option value="'+c.name+'">';}).join('');
  });
  document.getElementById('fkList').appendChild(row);
}

function saveTable(){
  var name=document.getElementById('inName').value.trim();
  var tableComment=document.getElementById('inComment')?document.getElementById('inComment').value.trim():'';
  if(!name){showToast('テーブル名を入力してください','error');return;}
  var cols=[];
  document.querySelectorAll('#colList .col-row').forEach(function(r){
    var n=r.querySelector('.cn').value.trim();
    if(!n)return;
    var cm=r.querySelector('.cm');cols.push({name:n,type:r.querySelector('.ct').value,pk:r.querySelector('.cpk').checked,nullable:r.querySelector('.cnu').checked,comment:cm?cm.value.trim():'',fk:null});
  });
  if(!cols.length){showToast('カラムを1つ以上追加してください','error');return;}
  document.querySelectorAll('#fkList .fk-row').forEach(function(r){
    var fc=r.querySelector('.ff').value.trim(),ft=r.querySelector('.ft').value,tc=r.querySelector('.fc').value.trim();
    var card=r.querySelector('.fcard')?r.querySelector('.fcard').value:'1-n';
    if(!fc||!ft||!tc)return;
    var col=cols.find(function(c){return c.name===fc;});
    if(col)col.fk={table:ft,col:tc,cardinality:card};
  });
  if(editTbl&&editTbl!==name){
    nodePos[name]=nodePos[editTbl];nodeCol[name]=nodeCol[editTbl];
    delete nodePos[editTbl];delete nodeCol[editTbl];delete tables[editTbl];
    Object.values(tables).forEach(function(t){t.forEach(function(c){if(c.fk&&c.fk.table===editTbl)c.fk.table=name;});});
  }
  tables[name]=cols;
  tableComments[name]=tableComment;
  var dbSel=document.getElementById('inDB');
  if(dbSel)tableDB[name]=dbSel.value||null;
  delete nodeCol[name];
  // 同期: n-1 ↔ 1-n を相手テーブルに反映
  cols.forEach(function(col){
    if(!col.fk)return;
    var mirror={'1-n':'n-1','n-1':'1-n','1-1':'1-1','n-n':'n-n'};
    var toTbl=tables[col.fk.table];
    if(!toTbl)return;
    toTbl.forEach(function(tc){
      if(tc.fk&&tc.fk.table===name&&tc.fk.col===col.name){
        tc.fk.cardinality=mirror[col.fk.cardinality]||'1-n';
      }
    });
  });
  addChangeLog(editTbl?'テーブル編集':'テーブル追加',name);
  buildRels();renderAll();closeModal();
  showToast('✓ "'+name+'" を保存しました','success');
}

function deleteTable(){
  if(!editTbl||!confirm('"'+editTbl+'" を削除しますか？'))return;
  delete tables[editTbl];delete nodePos[editTbl];delete nodeCol[editTbl];
  Object.values(tables).forEach(function(t){t.forEach(function(c){if(c.fk&&c.fk.table===editTbl)c.fk=null;});});
  addChangeLog('テーブル削除',editTbl);saveHistory();buildRels();renderAll();closeModal();
  showToast('"'+editTbl+'" を削除しました');
}

function openUploadModal(){document.getElementById('upModal').classList.add('open');}
var upzone=document.getElementById('upzone');
upzone.addEventListener('dragover',function(e){e.preventDefault();upzone.classList.add('drag-over');});
upzone.addEventListener('dragleave',function(){upzone.classList.remove('drag-over');});
upzone.addEventListener('drop',function(e){e.preventDefault();upzone.classList.remove('drag-over');handleFile(e.dataTransfer.files[0]);});

function handleFile(file){
  if(!file)return;
  var ext=file.name.split('.').pop().toLowerCase();
  var r=new FileReader();
  r.onload=function(e){
    try{
      if(ext==='csv')parseCSV(e.target.result);
      else if(ext==='json')parseJSON(e.target.result);
      else{showToast('CSV または JSON を選択してください','error');return;}
      renderAll();
      document.getElementById('upModal').classList.remove('open');
      showToast('✓ '+Object.keys(tables).length+' テーブルを読み込みました','success');
    }catch(err){showToast('解析エラー: '+err.message,'error');}
  };
  r.readAsText(file,'UTF-8');
}

function parseCSV(text){
  var lines=text.trim().split('\n').filter(function(l){return l.trim();});
  var start=lines[0].toLowerCase().includes('table')?1:0;
  for(var i=start;i<lines.length;i++){
    var c=lines[i].split(',').map(function(s){return s.trim();});
    if(c.length<3||!c[0]||!c[1])continue;
    if(!tables[c[0]])tables[c[0]]=[];
    tables[c[0]].push({name:c[1],type:c[2]||'VARCHAR',pk:c[3]==='true'||c[3]==='1',nullable:c[3]!=='true',fk:(c[4]&&c[5])?{table:c[4],col:c[5]}:null});
  }
  buildRels();
}

function parseJSON(text){
  var raw=JSON.parse(text);
  // 新フォーマット: {databases:[...], tables:[...]}
  var arr, dbList=[];
  if(!Array.isArray(raw)&&raw.tables){
    arr=raw.tables;
    dbList=raw.databases||[];
  }else{
    arr=Array.isArray(raw)?raw:[raw];
  }
  // databases復元
  dbList.forEach(function(d){databases[d.name]={color:d.color||DB_PALETTE[0]};});
  var hasPos=false;
  arr.forEach(function(tbl){
    if(!tbl.name)return;
    tables[tbl.name]=(tbl.columns||[]).map(function(c){
      var fkd=c.fk||c.foreignKey;
      return{name:c.name,type:c.type||'VARCHAR',pk:!!(c.pk||c.primaryKey),nullable:c.nullable!==false,
        fk:fkd?{table:fkd.table||fkd.references,col:fkd.column||fkd.col||'id',cardinality:fkd.cardinality||'1-n'}:null};
    });
    if(tbl.comment)tableComments[tbl.name]=tbl.comment;
    if(tbl.collapsed)collapsedTables[tbl.name]=true;
    if(tbl.db)tableDB[tbl.name]=tbl.db;
    if(tbl.position&&typeof tbl.position.x==='number'){
      nodePos[tbl.name]={x:tbl.position.x,y:tbl.position.y};
      hasPos=true;
    }
  });
  buildRels();
  // positionが含まれていない場合は自動レイアウト
  if(!hasPos) forceLayout();
}

function buildRels(){
  relations=[];
  Object.entries(tables).forEach(function(e){
    e[1].forEach(function(col){
      if(col.fk&&tables[col.fk.table])relations.push({from:e[0],to:col.fk.table,fromCol:col.name,toCol:col.fk.col,cardinality:col.fk.cardinality||'1-n'});
    });
  });
}

var NW=220,HH=36,CH=26;
function nodeH(n){
  if(collapsedTables[n]){
    // PKとFKのカラム数だけ
    var cnt=(tables[n]||[]).filter(function(c){return c.pk||c.fk;}).length;
    return HH+cnt*CH+8;
  }
  return HH+(tables[n]?tables[n].length:0)*CH+8;
}
function color(n){var db=tableDB[n];if(db&&databases[db])return databases[db].color;return '#94a3b8';}

// キャンバスCSS変数を読む
function cv(name){return getComputedStyle(cnv).getPropertyValue(name).trim();}
// テーマに合わせた色を返す（ライトモード: 明るく / ダークモード: そのまま）
function isLightTheme(){return document.documentElement.dataset.theme!=='dark';}
function mixWithBg(hex,ratio){
  var bg=isLightTheme()?[248,250,252]:[13,22,40]; // --node-bg相当
  var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  r=Math.round(r*ratio+bg[0]*(1-ratio));g=Math.round(g*ratio+bg[1]*(1-ratio));b=Math.round(b*ratio+bg[2]*(1-ratio));
  return '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0');
}
function hdrColors(clr){
  if(!isLightTheme())return{bg:mixWithBg(clr,0.3),text:'#e2e8f0',sub:'rgba(255,255,255,0.4)'};
  return{bg:mixWithBg(clr,0.18),text:clr,sub:clr+'66'};
}

function renderAll(){
  var has=Object.keys(tables).length>0;
  document.getElementById('emp').style.display=has?'none':'flex';
  document.getElementById('st-t').textContent=Object.keys(tables).length;
  document.getElementById('st-r').textContent=relations.length;
  renderSidebarDBList();
  layoutNew();renderDBGroups();renderEdges();renderNodes();renderMemos();
  if(typeof autoSave==='function')autoSave();
}

function layoutNew(){
  var names=Object.keys(tables);
  var newNames=names.filter(function(n){return !nodePos[n];});
  if(!newNames.length)return;
  var cols=Math.ceil(Math.sqrt(names.length));
  var PAD_X=60, PAD_Y=50;
  // build row max-heights
  var rowMaxH={};
  names.forEach(function(n,i){
    var r=Math.floor(i/cols);
    rowMaxH[r]=Math.max(rowMaxH[r]||0,nodeH(n));
  });
  var rowY=[0];
  for(var r=1;r<Object.keys(rowMaxH).length;r++){
    rowY[r]=rowY[r-1]+rowMaxH[r-1]+PAD_Y;
  }
  newNames.forEach(function(n){
    var i=names.indexOf(n),c=i%cols,row=Math.floor(i/cols);
    nodePos[n]={x:40+c*(NW+PAD_X),y:40+rowY[row]};
  });
}

function forceLayout(){
  nodePos={};
  var names=Object.keys(tables);
  if(!names.length)return;
  var PAD_X=70, PAD_Y=60;

  // 1. 各テーブルの階層（depth）をトポロジカルに決定
  //    参照される側(親)が上、参照する側(子)が下
  var depth={};
  names.forEach(function(n){depth[n]=0;});

  // FKエッジ: child -> parent
  var edges=[];
  names.forEach(function(n){
    (tables[n]||[]).forEach(function(col){
      if(col.fk&&tables[col.fk.table]&&col.fk.table!==n){
        edges.push({from:n,to:col.fk.table});
      }
    });
  });

  // depthを繰り返し計算（最大パスの深さ）
  for(var iter=0;iter<names.length;iter++){
    edges.forEach(function(e){
      if(depth[e.from]<=depth[e.to]){
        depth[e.from]=depth[e.to]+1;
      }
    });
  }

  // 2. 同じdepthのテーブルを横に並べる
  var layers={};
  names.forEach(function(n){
    var d=depth[n];
    if(!layers[d])layers[d]=[];
    layers[d].push(n);
  });

  // 3. 各レイヤーの最大高さを計算してY位置を決定
  var depthKeys=Object.keys(layers).map(Number).sort(function(a,b){return b-a;}); // 深い=下
  var layerY={};
  var curY=40;
  depthKeys.forEach(function(d){
    layerY[d]=curY;
    var maxH=0;
    layers[d].forEach(function(n){maxH=Math.max(maxH,nodeH(n));});
    curY+=maxH+PAD_Y;
  });

  // 4. 同レイヤー内でFKの繋がりが近くなるよう並び替え
  depthKeys.forEach(function(d){
    var layer=layers[d];
    // 親テーブルのX位置の重心でソート
    layer.sort(function(a,b){
      var axSum=0,axCnt=0,bxSum=0,bxCnt=0;
      edges.forEach(function(e){
        if(e.from===a&&nodePos[e.to]){axSum+=nodePos[e.to].x+NW/2;axCnt++;}
        if(e.from===b&&nodePos[e.to]){bxSum+=nodePos[e.to].x+NW/2;bxCnt++;}
      });
      var ax=axCnt?axSum/axCnt:99999;
      var bx=bxCnt?bxSum/bxCnt:99999;
      return ax-bx;
    });
    // X位置を割り当て（中央揃え）
    var totalW=layer.length*(NW+PAD_X)-PAD_X;
    var startX=40;
    layer.forEach(function(n,i){
      nodePos[n]={x:startX+i*(NW+PAD_X),y:layerY[d]};
    });
  });

  renderDBGroups();renderEdges();renderNodes();
}

function svgEl(tag,attrs){
  var el=document.createElementNS('http://www.w3.org/2000/svg',tag);
  Object.entries(attrs||{}).forEach(function(a){el.setAttribute(a[0],a[1]);});
  return el;
}

// ─── DB group rendering ───────────────────────────────────
var dbGroupLayer=null;

function renderDBGroups(){
  if(!dbGroupLayer){
    dbGroupLayer=svgEl('g',{id:'db-group-layer'});
    dr.insertBefore(dbGroupLayer,el);
  }
  dbGroupLayer.innerHTML='';
  if(!showDBG)return;
  var PAD=DB_GROUP_PAD;

  Object.keys(databases).forEach(function(dbName){
    var dbColor=databases[dbName].color;
    var members=Object.keys(tables).filter(function(t){return tableDB[t]===dbName;});
    if(!members.length)return;

    // バウンディングボックス計算
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    members.forEach(function(t){
      var p=nodePos[t];if(!p)return;
      minX=Math.min(minX,p.x); minY=Math.min(minY,p.y);
      maxX=Math.max(maxX,p.x+NW); maxY=Math.max(maxY,p.y+nodeH(t));
    });
    if(!isFinite(minX))return;

    var gx=minX-PAD, gy=minY-PAD-20;
    var gw=maxX-minX+PAD*2, gh=maxY-minY+PAD*2+20;

    var g=svgEl('g',{'data-db':dbName});

    // 背景
    g.appendChild(svgEl('rect',{x:gx,y:gy,width:gw,height:gh,rx:12,
      fill:dbColor,'fill-opacity':'0.08',stroke:dbColor,'stroke-width':'1.5',
      'stroke-dasharray':'6 3'}));
    // DB名ラベル
    var lhc=hdrColors(dbColor);
    // 全角・半角を考慮した幅計算
    var nameW=0;for(var ci=0;ci<dbName.length;ci++){nameW+=dbName.charCodeAt(ci)>255?14:8;}
    var lbg=svgEl('rect',{x:gx+12,y:gy+4,width:nameW+36,height:22,rx:11,fill:lhc.bg,stroke:dbColor,'stroke-width':isLightTheme()?'1':'0'});
    g.appendChild(lbg);
    var ltxt=svgEl('text',{x:gx+24,y:gy+19,fill:lhc.text,'font-size':12,'font-weight':700,'font-family':'sans-serif'});
    ltxt.innerHTML=ic('database',14)+' '+dbName;
    g.appendChild(ltxt);
    // 編集ボタン
    var editBtn=svgEl('text',{x:gx+gw-12,y:gy+19,fill:dbColor,'font-size':11,'text-anchor':'end','font-family':'sans-serif',cursor:'pointer'});
    editBtn.innerHTML=ic('edit-2',12);
    editBtn.addEventListener('click',function(ev){ev.stopPropagation();openEditDBModal(dbName);});
    g.appendChild(editBtn);

    // DB枠ドラッグ（ヘッダーバーをドラッグ）
    lbg.style.cursor='grab';
    ltxt.style.cursor='grab';
    function startDBDrag(ev){
      ev.stopPropagation();
      var startP=svgPt(ev.clientX,ev.clientY);
      var startPositions={};
      members.forEach(function(t){startPositions[t]={x:nodePos[t].x,y:nodePos[t].y};});
      function onMove(e){
        var p=svgPt(e.clientX,e.clientY);
        var dx=p.x-startP.x,dy=p.y-startP.y;
        members.forEach(function(t){
          nodePos[t]={x:startPositions[t].x+dx,y:startPositions[t].y+dy};
          var node=nl.querySelector('[data-table="'+t+'"]');
          if(node)node.setAttribute('transform','translate('+nodePos[t].x+','+nodePos[t].y+')');
        });
        renderEdges();renderDBGroups();
      }
      function onUp(){document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);}
      document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);
    }
    lbg.addEventListener('mousedown',startDBDrag);
    ltxt.addEventListener('mousedown',startDBDrag);

    dbGroupLayer.appendChild(g);
  });
}

function renderNodes(){
  nl.innerHTML='';
  var nBg=cv('--node-bg'),nBorder=cv('--node-border'),nShadow=cv('--node-shadow');
  var nText=cv('--node-text'),nType=cv('--node-type'),nHover=cv('--node-hover');
  var nPk=cv('--node-pk'),nFk=cv('--node-fk'),nTitle=cv('--node-title');
  Object.entries(tables).forEach(function(e){
    var name=e[0],cols=e[1],pos=nodePos[name]||{x:40,y:40},clr=color(name),h=nodeH(name);
    var hc=hdrColors(clr);
    var g=svgEl('g',{'data-table':name,transform:'translate('+pos.x+','+pos.y+')'});
    g.style.cursor='grab';
    g.appendChild(svgEl('rect',{x:4,y:4,width:NW,height:h,rx:8,fill:nShadow}));
    g.appendChild(svgEl('rect',{x:0,y:0,width:NW,height:h,rx:8,fill:nBg,stroke:clr,'stroke-width':1.5}));
    g.appendChild(svgEl('rect',{x:0,y:0,width:NW,height:HH,rx:8,fill:hc.bg}));
    g.appendChild(svgEl('rect',{x:0,y:HH-8,width:NW,height:8,fill:hc.bg}));
    if(tableComments[name]){
      var ttip=document.createElementNS('http://www.w3.org/2000/svg','title');
      ttip.textContent=tableComments[name];
      g.appendChild(ttip);
    }
    var hdrHit=svgEl('rect',{x:0,y:0,width:NW,height:HH,fill:'transparent'});
    hdrHit.style.cursor='pointer';
    hdrHit.addEventListener('dblclick',function(){openEditModal(name);});
    g.appendChild(hdrHit);
    var isCollapsed=collapsedTables[name];
    var togLabel=isCollapsed?'+ 展開':'- 絞込';
    var togW=56,togH=17,togX=NW-togW-6,togY=(HH-togH)/2;
    var clipId='clip-'+name.replace(/[^a-zA-Z0-9]/g,'_');
    var cp=svgEl('clipPath',{id:clipId});
    cp.appendChild(svgEl('rect',{x:0,y:0,width:togX-4,height:HH}));
    g.appendChild(cp);
    var ttl=svgEl('text',{x:12,y:HH-12,fill:hc.text,'font-size':13,'font-weight':600,'font-family':'JetBrains Mono,monospace','clip-path':'url(#'+clipId+')'});
    ttl.textContent=name;g.appendChild(ttl);
    var hint=svgEl('title');hint.textContent=name+'（ダブルクリックで編集）';g.appendChild(hint);
    var togBg=svgEl('rect',{x:togX,y:togY,width:togW,height:togH,rx:togH/2,
      fill:hc.sub,stroke:hc.text+'66','stroke-width':'1'});
    togBg.style.cursor='pointer';
    g.appendChild(togBg);
    var togTxt=svgEl('text',{x:togX+togW/2,y:togY+togH/2+1,fill:hc.text,'font-size':10,'font-weight':600,
      'text-anchor':'middle','dominant-baseline':'middle','font-family':'sans-serif'});
    togTxt.textContent=togLabel;
    togTxt.style.cursor='pointer';
    g.appendChild(togTxt);
    function onTogClick(ev){
      ev.stopPropagation();
      collapsedTables[name]=!collapsedTables[name];
      renderEdges();renderNodes();
    }
    togBg.addEventListener('click',onTogClick);
    togTxt.addEventListener('click',onTogClick);
    var visibleCols=collapsedTables[name]?cols.filter(function(c){return c.pk||c.fk;}):cols;
    visibleCols.forEach(function(col,i){
      var y=HH+4+i*CH;
      if(i>0){var ln=svgEl('line',{x1:8,y1:y,x2:NW-8,y2:y,stroke:nBorder,'stroke-width':'0.5'});g.appendChild(ln);}
      var bg=svgEl('rect',{x:1,y:y,width:NW-2,height:CH,fill:'transparent'});
      bg.addEventListener('mouseenter',function(){bg.setAttribute('fill',nHover);});
      bg.addEventListener('mouseleave',function(){bg.setAttribute('fill','transparent');});
      g.appendChild(bg);
      var badge=col.pk&&col.fk?'PK FK':col.pk?'PK':col.fk?'FK':'';
      if(badge){var bt=svgEl('text',{x:10,y:y+17,'font-size':10,'font-family':'JetBrains Mono,monospace',fill:col.pk?nPk:nFk,'font-weight':700,'letter-spacing':'0.5'});bt.textContent=badge;g.appendChild(bt);}
      var colX=col.pk&&col.fk?50:badge?32:12;
      var ct=svgEl('text',{x:colX,y:y+17,fill:col.pk?nPk:col.fk?nFk:nText,'font-size':12,'font-weight':col.pk?600:500,'font-family':'JetBrains Mono,monospace'});
      ct.textContent=col.name;g.appendChild(ct);
      var tt=svgEl('text',{x:NW-8,y:y+17,fill:nType,'font-size':11,'font-weight':500,'text-anchor':'end','font-family':'JetBrains Mono,monospace'});
      tt.textContent=col.type+(col.nullable?' ?':'');g.appendChild(tt);
    });
    g.addEventListener('mousedown',function(ev){startDrag(ev,name);});
    nl.appendChild(g);
  });
}

function renderEdges(){
  el.innerHTML='';
  var SYM=0;
  var portCount={};
  function pk(x,y){return Math.round(x)+','+Math.round(y);}

  relations.forEach(function(rel){
    if(!nodePos[rel.from]||!nodePos[rel.to])return;
    var fp=nodePos[rel.from],tp=nodePos[rel.to];
    var fh=nodeH(rel.from),th=nodeH(rel.to);
    var fCX=fp.x+NW/2,fCY=fp.y+fh/2,tCX=tp.x+NW/2,tCY=tp.y+th/2;
    var ddx=tCX-fCX,ddy=tCY-fCY;

    var bx1,by1,bx2,by2,horiz;
    if(Math.abs(ddx)>=Math.abs(ddy)){
      horiz=true;
      if(ddx>0){bx1=fp.x+NW;by1=fCY;bx2=tp.x;by2=tCY;}
      else      {bx1=fp.x;   by1=fCY;bx2=tp.x+NW;by2=tCY;}
    }else{
      horiz=false;
      if(ddy>0){bx1=fCX;by1=fp.y+fh;bx2=tCX;by2=tp.y;}
      else      {bx1=fCX;by1=fp.y;   bx2=tCX;by2=tp.y+th;}
    }

    // 始点・終点それぞれでポート重複カウント → オフセット
    var key1=pk(bx1,by1),key2=pk(bx2,by2);
    portCount[key1]=(portCount[key1]||0)+1;
    portCount[key2]=(portCount[key2]||0)+1;
    var off1=((portCount[key1]-1)-(0))*20; // 始点オフセット
    var off2=((portCount[key2]-1)-(0))*20; // 終点オフセット
    // 偶数番は正方向、奇数番は負方向に交互に振り分け
    var n1=portCount[key1]-1,n2=portCount[key2]-1;
    off1=(Math.ceil(n1/2))*(n1%2===0?1:-1)*20;
    off2=(Math.ceil(n2/2))*(n2%2===0?1:-1)*20;
    if(horiz){by1+=off1;by2+=off2;}else{bx1+=off1;bx2+=off2;}

    var px1,py1,px2,py2;
    if(horiz){
      var dirX=ddx>0?1:-1;
      px1=bx1+dirX*SYM;py1=by1;
      px2=bx2-dirX*SYM;py2=by2;
    }else{
      var dirY=ddy>0?1:-1;
      px1=bx1;py1=by1+dirY*SYM;
      px2=bx2;py2=by2-dirY*SYM;
    }

    var cx=(px2-px1)/2,cy=(py2-py1)/2,d;
    if(horiz){d='M '+px1+' '+py1+' C '+(px1+cx)+' '+py1+' '+(px2-cx)+' '+py2+' '+px2+' '+py2;}
    else     {d='M '+px1+' '+py1+' C '+px1+' '+(py1+cy)+' '+px2+' '+(py2-cy)+' '+px2+' '+py2;}

    var fromDB=tableDB[rel.from]||null,toDBn=tableDB[rel.to]||null;
    var isCrossDB=fromDB&&toDBn&&fromDB!==toDBn;
    var eSame=cv('--edge-same'),eCross=cv('--edge-cross');
    var lineColor=isCrossDB?eCross:eSame;
    var lineDash=isCrossDB?'3 4':'6 3';
    var lineW=isCrossDB?'2':'1.5';
    var path=svgEl('path',{d:d,fill:'none',stroke:lineColor,'stroke-width':lineW,'stroke-dasharray':lineDash,opacity:isCrossDB?'1':'.85'});
    el.appendChild(path);


    var card=rel.cardinality||'1-n';
    // startType: from側シンボル / endType: to側シンボル
    var startType,endType;
    if(card==='1-1'){startType='one'; endType='one';}
    else if(card==='1-n'){startType='one'; endType='many';}
    else if(card==='n-1'){startType='many';endType='one';}
    else{startType='many';endType='many';} // n-n

    var angStart,angEnd;
    if(horiz){angStart=ddx>0?0:180;angEnd=ddx>0?180:0;}
    else     {angStart=ddy>0?90:270;angEnd=ddy>0?270:90;}
    drawIESymbol(bx1,by1,angStart,startType);
    drawIESymbol(bx2,by2,angEnd,  endType);

    if(showLabels){
      var mx=(px1+px2)/2,my=(py1+py2)/2;
      var fromTxt=rel.fromCol,toTxt=rel.toCol;
      var boxW=Math.max(fromTxt.length,toTxt.length)*7+16;
      var lineH=18,gap=3;
      // テーブルカラーと同期
      var fromClr=color(rel.from),toClr=color(rel.to);
      var fromBg=fromClr+'33',toBg=toClr+'33'; // 20%透過
      el.appendChild(svgEl('rect',{x:mx-boxW/2,y:my-lineH-gap/2,width:boxW,height:lineH,rx:3,fill:fromBg,stroke:fromClr,'stroke-width':'1.5'}));
      var eLbl=cv('--edge-label');
      var t1=svgEl('text',{x:mx,y:my-gap/2-lineH/2,fill:eLbl,'font-family':'JetBrains Mono,monospace','font-size':11,'font-weight':600,'text-anchor':'middle','dominant-baseline':'middle'});
      t1.textContent=fromTxt;el.appendChild(t1);
      el.appendChild(svgEl('rect',{x:mx-boxW/2,y:my+gap/2,width:boxW,height:lineH,rx:3,fill:toBg,stroke:toClr,'stroke-width':'1.5'}));
      var t2=svgEl('text',{x:mx,y:my+gap/2+lineH/2,fill:eLbl,'font-family':'JetBrains Mono,monospace','font-size':11,'font-weight':500,'text-anchor':'middle','dominant-baseline':'middle'});
      t2.textContent=toTxt;el.appendChild(t2);
    }
  });
}

function drawIESymbol(cx,cy,angleDeg,type){
  var S=cv('--edge-same'),W=1.8;
  var g=svgEl('g',{transform:'translate('+cx+','+cy+') rotate('+angleDeg+')'});
  if(type==='one'){
    // 何も描かない（ただの線末端）
  }else{
    // シンプルな矢印
    g.appendChild(svgEl('line',{x1:0,y1:-7,x2:10,y2:0,stroke:S,'stroke-width':W}));
    g.appendChild(svgEl('line',{x1:0,y1:7, x2:10,y2:0,stroke:S,'stroke-width':W}));
  }
  el.appendChild(g);
}

function startDrag(e,name){
  if(panMode)return;
  e.stopPropagation();dragNode=name;
  var p=svgPt(e.clientX,e.clientY);
  dragOff={x:p.x-nodePos[name].x,y:p.y-nodePos[name].y};
  document.addEventListener('mousemove',onDrag);document.addEventListener('mouseup',stopDrag);
}
function onDrag(e){
  if(!dragNode)return;
  var p=svgPt(e.clientX,e.clientY);
  nodePos[dragNode]={x:p.x-dragOff.x,y:p.y-dragOff.y};
  var g=nl.querySelector('[data-table="'+dragNode+'"]');
  if(g)g.setAttribute('transform','translate('+nodePos[dragNode].x+','+nodePos[dragNode].y+')');
  renderEdges();renderDBGroups();
}
function stopDrag(){if(dragNode){saveHistory();renderDBGroups();if(typeof autoSave==='function')autoSave();}dragNode=null;document.removeEventListener('mousemove',onDrag);document.removeEventListener('mouseup',stopDrag);cnv.style.cursor='grab';}
function svgPt(cx,cy){var r=cnv.getBoundingClientRect();return{x:(cx-r.left-tf.x)/tf.scale,y:(cy-r.top-tf.y)/tf.scale};}

cnv.addEventListener('mousedown',function(e){if(dragNode)return;isPan=true;panSt={x:e.clientX-tf.x,y:e.clientY-tf.y};cnv.style.cursor='grabbing';});
window.addEventListener('mousemove',function(e){if(!isPan)return;tf.x=e.clientX-panSt.x;tf.y=e.clientY-panSt.y;applyTf();});
window.addEventListener('mouseup',function(){isPan=false;cnv.style.cursor='grab';});
cnv.addEventListener('wheel',function(e){
  e.preventDefault();
  var d=e.deltaY>0?0.9:1.1,r=cnv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
  tf.x=mx-(mx-tf.x)*d;tf.y=my-(my-tf.y)*d;
  tf.scale=Math.min(3,Math.max(0.15,tf.scale*d));applyTf();
},{passive:false});
function zoomIn(){tf.scale=Math.min(3,tf.scale*1.2);applyTf();}
function zoomOut(){tf.scale=Math.max(0.15,tf.scale/1.2);applyTf();}
function resetZoom(){tf={x:40,y:40,scale:1};applyTf();}
function fitToScreen(){
  var names=Object.keys(tables);
  if(!names.length)return;
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  names.forEach(function(n){var p=nodePos[n];if(!p)return;minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x+NW);maxY=Math.max(maxY,p.y+nodeH(n));});
  var r=cnv.getBoundingClientRect(),PAD=40;
  var scale=Math.min((r.width-PAD*2)/(maxX-minX),(r.height-PAD*2)/(maxY-minY),1.5);
  tf.scale=scale;
  tf.x=PAD+(r.width-PAD*2)/2-(minX+(maxX-minX)/2)*scale;
  tf.y=PAD+(r.height-PAD*2)/2-(minY+(maxY-minY)/2)*scale;
  applyTf();
}
function applyTf(){dr.setAttribute('transform','translate('+tf.x+','+tf.y+') scale('+tf.scale+')');document.getElementById('zlv').textContent=Math.round(tf.scale*100)+'%';}

function focusTable(name){
  var pos=nodePos[name];if(!pos)return;
  var r=cnv.getBoundingClientRect();
  tf.x=r.width/2-pos.x*tf.scale-(NW*tf.scale)/2;
  tf.y=r.height/2-pos.y*tf.scale-(nodeH(name)*tf.scale)/2;
  applyTf();
  nl.querySelectorAll('[data-table]').forEach(function(g){
    var rects=g.querySelectorAll('rect');
    if(rects[1])rects[1].setAttribute('stroke-width',g.getAttribute('data-table')===name?'3':'1.5');
  });
}

var sampleInserted=false;
function insertSampleData(){
  if(sampleInserted||Object.keys(tables).length){
    if(!confirm('既存データがあります。サンプルデータを追加しますか？'))return;
  }
  var json={
    databases:[
      {name:'商品管理',color:'#3b82f6'},
      {name:'ユーザー管理',color:'#10b981'},
      {name:'注文管理',color:'#f59e0b'},
      {name:'レビュー',color:'#8b5cf6'}
    ],
    tables:[
      {name:'categories',db:'商品管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'name',type:'VARCHAR(100)'},{name:'slug',type:'VARCHAR(100)'},
        {name:'parent_id',type:'INT',nullable:true,fk:{table:'categories',column:'id',cardinality:'n-1'}},
        {name:'sort_order',type:'INT'},{name:'created_at',type:'TIMESTAMP'}
      ]},
      {name:'products',db:'商品管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'category_id',type:'INT',fk:{table:'categories',column:'id',cardinality:'n-1'}},
        {name:'name',type:'VARCHAR(200)'},{name:'slug',type:'VARCHAR(200)'},{name:'description',type:'TEXT'},
        {name:'price',type:'DECIMAL(10,2)'},{name:'stock',type:'INT'},{name:'is_active',type:'BOOLEAN'},
        {name:'created_at',type:'TIMESTAMP'},{name:'updated_at',type:'TIMESTAMP'},
        {name:'deleted_at',type:'TIMESTAMP',nullable:true}
      ]},
      {name:'product_images',db:'商品管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'product_id',type:'INT',fk:{table:'products',column:'id',cardinality:'n-1'}},
        {name:'url',type:'VARCHAR(500)'},{name:'alt_text',type:'VARCHAR(200)'},
        {name:'sort_order',type:'INT'},{name:'created_at',type:'TIMESTAMP'}
      ]},
      {name:'users',db:'ユーザー管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'email',type:'VARCHAR(255)'},{name:'password_hash',type:'VARCHAR(255)'},
        {name:'name',type:'VARCHAR(100)'},{name:'phone',type:'VARCHAR(20)',nullable:true},
        {name:'is_active',type:'BOOLEAN'},{name:'role',type:'VARCHAR(20)'},
        {name:'created_at',type:'TIMESTAMP'}
      ]},
      {name:'addresses',db:'ユーザー管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'user_id',type:'INT',fk:{table:'users',column:'id',cardinality:'n-1'}},
        {name:'postal_code',type:'VARCHAR(10)'},{name:'prefecture',type:'VARCHAR(10)'},
        {name:'city',type:'VARCHAR(100)'},{name:'street',type:'VARCHAR(200)'},
        {name:'building',type:'VARCHAR(200)',nullable:true},{name:'is_default',type:'BOOLEAN'},
        {name:'created_at',type:'TIMESTAMP'}
      ]},
      {name:'orders',db:'注文管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'user_id',type:'INT',fk:{table:'users',column:'id',cardinality:'n-1'}},
        {name:'address_id',type:'INT',fk:{table:'addresses',column:'id',cardinality:'n-1'}},
        {name:'status',type:'VARCHAR(20)'},{name:'total_amount',type:'DECIMAL(10,2)'},
        {name:'shipping_fee',type:'DECIMAL(10,2)'},{name:'tax_amount',type:'DECIMAL(10,2)'},
        {name:'ordered_at',type:'TIMESTAMP'},{name:'shipped_at',type:'TIMESTAMP',nullable:true},
        {name:'delivered_at',type:'TIMESTAMP',nullable:true},
        {name:'cancelled_at',type:'TIMESTAMP',nullable:true}
      ]},
      {name:'order_items',db:'注文管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'order_id',type:'INT',fk:{table:'orders',column:'id',cardinality:'n-1'}},
        {name:'product_id',type:'INT',fk:{table:'products',column:'id',cardinality:'n-1'}},
        {name:'quantity',type:'INT'},{name:'unit_price',type:'DECIMAL(10,2)'},
        {name:'subtotal',type:'DECIMAL(10,2)'},{name:'created_at',type:'TIMESTAMP'}
      ]},
      {name:'cart_items',db:'注文管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'user_id',type:'INT',fk:{table:'users',column:'id',cardinality:'n-1'}},
        {name:'product_id',type:'INT',fk:{table:'products',column:'id',cardinality:'n-1'}},
        {name:'quantity',type:'INT'},{name:'added_at',type:'TIMESTAMP'}
      ]},
      {name:'payments',db:'注文管理',columns:[
        {name:'id',type:'INT',pk:true},{name:'order_id',type:'INT',fk:{table:'orders',column:'id',cardinality:'1-1'}},
        {name:'method',type:'VARCHAR(30)'},{name:'amount',type:'DECIMAL(10,2)'},
        {name:'status',type:'VARCHAR(20)'},{name:'transaction_id',type:'VARCHAR(100)',nullable:true},
        {name:'paid_at',type:'TIMESTAMP',nullable:true}
      ]},
      {name:'reviews',db:'レビュー',columns:[
        {name:'id',type:'INT',pk:true},{name:'user_id',type:'INT',fk:{table:'users',column:'id',cardinality:'n-1'}},
        {name:'product_id',type:'INT',fk:{table:'products',column:'id',cardinality:'n-1'}},
        {name:'rating',type:'INT'},{name:'title',type:'VARCHAR(200)'},
        {name:'body',type:'TEXT'},{name:'is_visible',type:'BOOLEAN'},
        {name:'created_at',type:'TIMESTAMP'}
      ]}
    ]
  };
  parseJSON(JSON.stringify(json));
  addChangeLog('サンプルデータ挿入','ECサイト');
  saveHistory();renderAll();
  sampleInserted=true;
  showToast('サンプルデータを挿入しました','success');
}
function resetAll(){
  if(Object.keys(tables).length&&!confirm('全てのテーブルをリセットしますか？'))return;
  tables={};relations=[];nodePos={};nodeCol={};tableComments={};historyStack=[];historyFuture=[];memos={};memoIdCounter=0;changeLog=[];databases={};tableDB={};
  nl.innerHTML='';el.innerHTML='';
  document.getElementById('emp').style.display='flex';
  document.getElementById('st-t').textContent='0';document.getElementById('st-r').textContent='0';
  document.getElementById('tblList').innerHTML='<div style="text-align:center;color:var(--muted);font-size:11px;padding-top:20px;line-height:1.9;">「＋ テーブル追加」または<br>ファイルを読み込んでください</div>';
  document.getElementById('fileInp').value='';
  if(typeof autoSave==='function')autoSave();
}

// ─── Dropdown control ────────────────────────────────────
function toggleDD(id){
  var dd=document.getElementById(id);
  if(!dd)return;
  var isOpen=dd.classList.contains('open');
  // 全部閉じる
  document.querySelectorAll('.dropdown.open').forEach(function(el){el.classList.remove('open');});
  if(!isOpen)dd.classList.add('open');
}
function closeDD(){
  document.querySelectorAll('.dropdown.open').forEach(function(el){el.classList.remove('open');});
}
// 外クリックで閉じる
document.addEventListener('click',function(e){
  if(!e.target.closest('.dropdown'))closeDD();
});

var toastTimer;
function showToast(msg,type){
  var t=document.getElementById('toast');t.innerHTML=msg;t.className='show '+(type||'');
  clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.className=type||'';},3000);
}

document.getElementById('tblModal').addEventListener('click',function(e){if(e.target.id==='tblModal')closeModal();});
document.getElementById('upModal').addEventListener('click',function(e){if(e.target.id==='upModal')document.getElementById('upModal').classList.remove('open');});
document.getElementById('projModal').addEventListener('click',function(e){if(e.target.id==='projModal')document.getElementById('projModal').classList.remove('open');});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();['upModal','shortcutModal','historyModal','memoModal','dbModal','aiModal','projModal'].forEach(function(id){var el=document.getElementById(id);if(el)el.classList.remove('open');});closeProjectDropdown();}});
applyTf();

// ─── Shortcut list ────────────────────────────────────────
(function(){
  var shortcuts=[
    ['Ctrl + Z','元に戻す'],
    ['Ctrl + Y','やり直す'],
    ['? キー','このショートカット一覧を表示'],
    ['Esc','モーダルを閉じる'],
    ['ホイール','ズームイン/アウト'],
    ['背景ドラッグ','マップ移動'],
    ['テーブルドラッグ','テーブル移動'],
    ['ヘッダーダブルクリック','テーブルを編集'],
    [ic('minimize-2',12)+' キーのみ','全テーブルをPK/FKのみ表示'],
    [ic('layout',12)+' 全て展開','全テーブルを展開'],
    [ic('tag',12)+' ラベル','リレーションラベルの表示切替'],
    [ic('copy',12)+' ボタン','テーブルを複製'],
    [ic('file-text',12)+' メモ','付箋メモをキャンバスに追加'],
    ['メモをダブルクリック','メモを編集・削除'],
    [ic('clipboard',12)+' ボタン','変更履歴を表示'],
    [ic('maximize-2',12)+' ボタン','全テーブルが見える位置に戻る'],
  ];
  var tbody=document.getElementById('scTable');
  if(!tbody)return;
  shortcuts.forEach(function(s,i){
    var tr=document.createElement('tr');
    tr.style.borderBottom='1px solid var(--border)';
    tr.innerHTML='<td style="padding:8px 4px;width:46%;"><span style="background:var(--bg);border:1px solid var(--border-strong);border-radius:4px;padding:2px 8px;font-size:11px;color:var(--accent);white-space:nowrap;">'+s[0]+'</span></td>'
      +'<td style="padding:8px 4px;color:var(--text-dim);font-size:12px;">'+s[1]+'</td>';
    tbody.appendChild(tr);
  });
})();

// ─── Undo / Redo ─────────────────────────────────────────
function saveHistory(){
  var snap=JSON.stringify({tables:tables,nodePos:nodePos,tableComments:tableComments});
  historyStack.push(snap);
  if(historyStack.length>MAX_HISTORY)historyStack.shift();
  historyFuture=[];
  updateUndoRedoBtns();
}
function undo(){
  if(!historyStack.length)return;
  historyFuture.push(JSON.stringify({tables:tables,nodePos:nodePos,tableComments:tableComments}));
  var snap=JSON.parse(historyStack.pop());
  tables=snap.tables;nodePos=snap.nodePos;tableComments=snap.tableComments||{};
  buildRels();renderAll();updateUndoRedoBtns();
  showToast(ic('undo',14)+' 元に戻しました');
}
function redo(){
  if(!historyFuture.length)return;
  historyStack.push(JSON.stringify({tables:tables,nodePos:nodePos,tableComments:tableComments}));
  var snap=JSON.parse(historyFuture.pop());
  tables=snap.tables;nodePos=snap.nodePos;tableComments=snap.tableComments||{};
  buildRels();renderAll();updateUndoRedoBtns();
  showToast(ic('redo',14)+' やり直しました');
}
// ─── DB management ───────────────────────────────────────
var editingDB=null;
var DB_GROUP_PAD=30; // グループ枠のパディング

function openAddDBModal(){
  editingDB=null;
  document.getElementById('dbModalTitle').innerHTML=ic('plus-circle')+' DBを追加';
  document.getElementById('inDBName').value='';
  document.getElementById('dbDeleteBtn').style.display='none';
  initDBColorPicker(null);
  document.getElementById('dbModal').classList.add('open');
  setTimeout(function(){document.getElementById('inDBName').focus();},150);
}

function openEditDBModal(name){
  editingDB=name;
  document.getElementById('dbModalTitle').textContent='編集：'+name;
  document.getElementById('inDBName').value=name;
  document.getElementById('dbDeleteBtn').style.display='flex';
  initDBColorPicker(databases[name]?databases[name].color:null);
  document.getElementById('dbModal').classList.add('open');
}

function initDBColorPicker(current){
  var el=document.getElementById('dbColorPicker');
  if(!el)return;
  el.innerHTML='';
  DB_PALETTE.forEach(function(c){
    var sw=document.createElement('div');
    sw.className='db-color-sw'+(c===current?' db-sel':'');
    sw.dataset.color=c;
    sw.style.setProperty('--db-color',c);
    sw.addEventListener('click',function(){
      el.querySelectorAll('.db-color-sw').forEach(function(s){s.classList.remove('db-sel');});
      sw.classList.add('db-sel');
    });
    el.appendChild(sw);
  });
  if(!current&&el.firstChild)el.firstChild.classList.add('db-sel');
}

function saveDB(){
  var name=document.getElementById('inDBName').value.trim();
  if(!name){showToast('DB名を入力してください','error');return;}
  var sw=document.querySelector('#dbColorPicker .db-sel');
  var clr=sw?sw.dataset.color:DB_PALETTE[0];
  if(editingDB&&editingDB!==name){
    databases[name]=databases[editingDB];
    delete databases[editingDB];
    Object.keys(tableDB).forEach(function(t){if(tableDB[t]===editingDB)tableDB[t]=name;});
  }
  databases[name]={color:clr};
  addChangeLog(editingDB?'DB編集':'DB追加',name);
  document.getElementById('dbModal').classList.remove('open');
  refreshAllDBSelects();
  renderAll();
  showToast('✓ DB "'+name+'" を保存しました','success');
}

function deleteDB(){
  if(!editingDB)return;
  if(!confirm('"'+editingDB+'" を削除しますか？（テーブルのDB所属は解除されます）'))return;
  delete databases[editingDB];
  Object.keys(tableDB).forEach(function(t){if(tableDB[t]===editingDB)tableDB[t]=null;});
  addChangeLog('DB削除',editingDB);
  document.getElementById('dbModal').classList.remove('open');
  refreshAllDBSelects();
  renderAll();
  showToast('"'+editingDB+'" を削除しました');
}

function refreshDBSelect(currentDB){
  var sel=document.getElementById('inDB');
  if(!sel)return;
  sel.innerHTML='<option value="">（なし）</option>';
  Object.keys(databases).forEach(function(d){
    var opt=document.createElement('option');
    opt.value=d;opt.textContent=d;
    if(d===currentDB)opt.selected=true;
    sel.appendChild(opt);
  });
}

function refreshAllDBSelects(){
  // サイドバーのDB一覧を再描画
  renderSidebarDBList();
}

// ─── DB Group Drag (long-press) ─────────────────────────
var dbDrag={timer:null,active:false,name:null,ghost:null,indicator:null,offsetY:0,justDragged:false,cancelMove:null};

function dbDragCleanup(){
  clearTimeout(dbDrag.timer);
  if(dbDrag.ghost){dbDrag.ghost.remove();dbDrag.ghost=null;}
  if(dbDrag.indicator){dbDrag.indicator.remove();dbDrag.indicator=null;}
  var d=document.querySelector('.db-group.dragging');if(d)d.classList.remove('dragging');
  document.removeEventListener('mousemove',dbDragMove);
  document.removeEventListener('mouseup',dbDragEnd);
  if(dbDrag.cancelMove){document.removeEventListener('mousemove',dbDrag.cancelMove);dbDrag.cancelMove=null;}
  dbDrag.active=false;dbDrag.name=null;dbDrag.dropTarget=null;
}

function dbDragStart(dbName,hdrEl,groupEl,e){
  if(e.button!==0||e.target.closest('.db-hdr-edit'))return;
  var sx=e.clientX,sy=e.clientY;
  // 移動しすぎたらタイマーキャンセル
  var cancelFn=function(ev){if(Math.abs(ev.clientX-sx)>5||Math.abs(ev.clientY-sy)>5)clearTimeout(dbDrag.timer);};
  dbDrag.cancelMove=cancelFn;
  document.addEventListener('mousemove',cancelFn);
  dbDrag.timer=setTimeout(function(){
    document.removeEventListener('mousemove',cancelFn);dbDrag.cancelMove=null;
    dbDrag.active=true;dbDrag.name=dbName;dbDrag.justDragged=false;
    groupEl.classList.add('dragging');
    // ゴースト（ヘッダーだけ複製）
    var rect=hdrEl.getBoundingClientRect();
    var ghost=hdrEl.cloneNode(true);
    ghost.className='db-hdr db-drag-ghost';
    ghost.style.cssText='position:fixed;left:'+rect.left+'px;top:'+rect.top+'px;width:'+rect.width+'px;z-index:9999;pointer-events:none;opacity:.85;box-shadow:var(--shadow-out-lg);';
    ghost.style.setProperty('--db-color',hdrEl.style.getPropertyValue('--db-color'));
    document.body.appendChild(ghost);
    dbDrag.ghost=ghost;dbDrag.offsetY=e.clientY-rect.top;
    // インジケーターライン
    var ind=document.createElement('div');
    ind.className='db-drag-indicator';
    document.body.appendChild(ind);
    dbDrag.indicator=ind;
    document.addEventListener('mousemove',dbDragMove);
    document.addEventListener('mouseup',dbDragEnd);
  },400);
  // mouseup が先ならタイマーキャンセル
  document.addEventListener('mouseup',function(){clearTimeout(dbDrag.timer);if(dbDrag.cancelMove){document.removeEventListener('mousemove',dbDrag.cancelMove);dbDrag.cancelMove=null;}},{once:true});
}

function dbDragMove(e){
  if(!dbDrag.active)return;
  e.preventDefault();
  dbDrag.ghost.style.top=(e.clientY-dbDrag.offsetY)+'px';
  // ドロップ位置を探す
  var groups=document.querySelectorAll('.db-group:not(.dragging)');
  var best=null,bestDist=Infinity;
  groups.forEach(function(g){
    var r=g.getBoundingClientRect();
    var midY=(r.top+r.bottom)/2;
    if(e.clientY<midY){
      var d=Math.abs(e.clientY-r.top);
      if(d<bestDist){bestDist=d;best={el:g,y:r.top,pos:'before'};}
    }else{
      var d2=Math.abs(e.clientY-r.bottom);
      if(d2<bestDist){bestDist=d2;best={el:g,y:r.bottom,pos:'after'};}
    }
  });
  if(best&&dbDrag.indicator){
    var listRect=document.getElementById('tblList').getBoundingClientRect();
    var ind=dbDrag.indicator;
    ind.style.cssText='position:fixed;z-index:9998;pointer-events:none;display:block;left:'+(listRect.left+4)+'px;width:'+(listRect.width-8)+'px;top:'+(best.y-1)+'px;height:2px;background:var(--accent);border-radius:1px;';
    dbDrag.dropTarget=best;
  }
}

function dbDragEnd(){
  if(!dbDrag.active){dbDragCleanup();return;}
  var target=dbDrag.dropTarget;
  if(target&&dbDrag.name&&target.el.dataset.db!==dbDrag.name){
    var order=Object.keys(databases);
    var fromIdx=order.indexOf(dbDrag.name);
    if(fromIdx>-1){
      order.splice(fromIdx,1);
      var toIdx=order.indexOf(target.el.dataset.db);
      if(target.pos==='after')toIdx++;
      order.splice(toIdx,0,dbDrag.name);
      var newDB={};order.forEach(function(k){newDB[k]=databases[k];});
      databases=newDB;
      autoSave();
    }
  }
  dbDrag.justDragged=true;
  dbDragCleanup();
  renderSidebarDBList();
  setTimeout(function(){dbDrag.justDragged=false;},50);
}

// ─── Table Item Drag (long-press) ───────────────────────
var tblDrag={timer:null,active:false,name:null,ghost:null,offsetY:0,justDragged:false,cancelMove:null,dropDB:null};

function tblDragCleanup(){
  clearTimeout(tblDrag.timer);
  if(tblDrag.ghost){tblDrag.ghost.remove();tblDrag.ghost=null;}
  document.querySelectorAll('.tbl-item.dragging').forEach(function(el){el.classList.remove('dragging');});
  document.querySelectorAll('.db-group.drag-hover').forEach(function(el){el.classList.remove('drag-hover');});
  document.removeEventListener('mousemove',tblDragMove);
  document.removeEventListener('mouseup',tblDragEnd);
  if(tblDrag.cancelMove){document.removeEventListener('mousemove',tblDrag.cancelMove);tblDrag.cancelMove=null;}
  tblDrag.active=false;tblDrag.name=null;tblDrag.dropDB=null;
}

function tblDragStart(tblName,itemEl,e){
  if(e.button!==0||e.target.closest('.tbl-edit'))return;
  var sx=e.clientX,sy=e.clientY;
  var cancelFn=function(ev){if(Math.abs(ev.clientX-sx)>5||Math.abs(ev.clientY-sy)>5)clearTimeout(tblDrag.timer);};
  tblDrag.cancelMove=cancelFn;
  document.addEventListener('mousemove',cancelFn);
  tblDrag.timer=setTimeout(function(){
    document.removeEventListener('mousemove',cancelFn);tblDrag.cancelMove=null;
    tblDrag.active=true;tblDrag.name=tblName;tblDrag.justDragged=false;
    itemEl.classList.add('dragging');
    var rect=itemEl.getBoundingClientRect();
    var ghost=itemEl.cloneNode(true);
    ghost.className='tbl-item tbl-drag-ghost';
    ghost.style.cssText='position:fixed;left:'+rect.left+'px;top:'+rect.top+'px;width:'+rect.width+'px;z-index:9999;pointer-events:none;opacity:.85;background:var(--bg);box-shadow:var(--shadow-out-lg);border-radius:var(--radius-sm);';
    document.body.appendChild(ghost);
    tblDrag.ghost=ghost;tblDrag.offsetY=e.clientY-rect.top;
    document.addEventListener('mousemove',tblDragMove);
    document.addEventListener('mouseup',tblDragEnd);
  },400);
  document.addEventListener('mouseup',function(){clearTimeout(tblDrag.timer);if(tblDrag.cancelMove){document.removeEventListener('mousemove',tblDrag.cancelMove);tblDrag.cancelMove=null;}},{once:true});
}

function tblDragMove(e){
  if(!tblDrag.active)return;
  e.preventDefault();
  tblDrag.ghost.style.top=(e.clientY-tblDrag.offsetY)+'px';
  // DB グループ上にいるか判定
  document.querySelectorAll('.db-group.drag-hover').forEach(function(el){el.classList.remove('drag-hover');});
  tblDrag.dropDB=null;
  var groups=document.querySelectorAll('.db-group');
  groups.forEach(function(g){
    var r=g.getBoundingClientRect();
    if(e.clientY>=r.top&&e.clientY<=r.bottom){
      g.classList.add('drag-hover');
      tblDrag.dropDB=g.dataset.db;
    }
  });
  // 未分類エリア判定
  var noneLabel=document.querySelector('.db-none-label');
  if(noneLabel){
    var listRect=document.getElementById('tblList').getBoundingClientRect();
    var noneTop=noneLabel.getBoundingClientRect().top;
    if(e.clientY>=noneTop&&e.clientY<=listRect.bottom){
      tblDrag.dropDB='__none__';
    }
  }
}

function tblDragEnd(){
  if(!tblDrag.active){tblDragCleanup();return;}
  var targetDB=tblDrag.dropDB;
  var tblName=tblDrag.name;
  if(tblName&&targetDB!==null){
    var currentDB=tableDB[tblName]||'__none__';
    if(targetDB==='__none__'){
      if(currentDB!=='__none__'){delete tableDB[tblName];delete nodeCol[tblName];autoSave();buildRels();renderAll();}
    }else if(targetDB!==currentDB){
      tableDB[tblName]=targetDB;delete nodeCol[tblName];autoSave();buildRels();renderAll();
    }
  }
  tblDrag.justDragged=true;
  tblDragCleanup();
  renderSidebarDBList();
  setTimeout(function(){tblDrag.justDragged=false;},50);
}

function renderSidebarDBList(){
  var listEl=document.getElementById('tblList');
  listEl.innerHTML='';
  var q=(document.getElementById('tblSearch')?document.getElementById('tblSearch').value:'').toLowerCase().trim();

  function matchesQuery(name,cols){
    if(!q)return true;
    var comment=(tableComments[name]||'').toLowerCase();
    var colText=cols.map(function(c){return c.name+' '+(c.comment||'');}).join(' ').toLowerCase();
    return name.toLowerCase().includes(q)||comment.includes(q)||colText.includes(q);
  }

  function makeTblItem(n,cols,indent){
    var item=document.createElement('div');
    item.className='tbl-item';
    if(indent)item.style.marginLeft='12px';
    var dot=document.createElement('div');dot.className='tbl-dot';dot.style.background=color(n);
    var nm=document.createElement('span');nm.className='tbl-name';nm.textContent=n;
    item.appendChild(dot);item.appendChild(nm);
    var dupB=document.createElement('button');dupB.className='tbl-edit';dupB.innerHTML=ic('copy',12);
    (function(tn){dupB.onclick=function(e){e.stopPropagation();duplicateTable(tn);};})(n);
    var editB=document.createElement('button');editB.className='tbl-edit';editB.innerHTML=ic('edit-2',12);
    (function(tn){editB.onclick=function(e){e.stopPropagation();openEditModal(tn);};})(n);
    var cnt=document.createElement('span');cnt.className='tbl-cnt';cnt.textContent=cols.length;
    item.appendChild(dupB);item.appendChild(editB);item.appendChild(cnt);
    item.dataset.tbl=n;
    (function(tn,el){
      el.onclick=function(){if(!tblDrag.justDragged)focusTable(tn);};
      el.addEventListener('mousedown',function(e){tblDragStart(tn,el,e);});
    })(n,item);
    return item;
  }

  var grouped={__none__:[]};
  Object.keys(databases).forEach(function(d){grouped[d]=[];});
  Object.entries(tables).forEach(function(e){
    var n=e[0],cols=e[1];
    var db=tableDB[n]||'__none__';
    if(!grouped[db])grouped[db]=[];
    grouped[db].push({name:n,cols:cols});
  });

  Object.keys(databases).forEach(function(dbName){
    var items=grouped[dbName]||[];
    var dbClr=databases[dbName].color;
    var isCollapsed=!!collapsedDBs[dbName];
    // グループラッパー
    var groupEl=document.createElement('div');
    groupEl.className='db-group';
    groupEl.dataset.db=dbName;
    var dbHdr=document.createElement('div');
    dbHdr.className='db-hdr'+(isCollapsed?' collapsed':'');
    dbHdr.style.setProperty('--db-color',dbClr);
    var chev=document.createElement('span');chev.className='db-hdr-chev';chev.innerHTML=ic('chevron-down',12);
    var s1=document.createElement('span');s1.className='db-hdr-name';s1.innerHTML=ic('database',12)+' '+dbName;
    var s2=document.createElement('span');s2.className='db-hdr-count';s2.textContent=items.length+' tables';
    var eb=document.createElement('button');eb.className='db-hdr-edit';eb.innerHTML=ic('edit-2',11);
    (function(dn){eb.onclick=function(e){e.stopPropagation();openEditDBModal(dn);};})(dbName);
    (function(dn){dbHdr.onclick=function(e){if(dbDrag.justDragged||e.target.closest('.db-hdr-edit'))return;collapsedDBs[dn]=!collapsedDBs[dn];renderSidebarDBList();};})(dbName);
    // 長押しドラッグ
    (function(dn,hdr,grp){
      hdr.addEventListener('mousedown',function(e){dbDragStart(dn,hdr,grp,e);});
    })(dbName,dbHdr,groupEl);
    dbHdr.appendChild(chev);dbHdr.appendChild(s1);dbHdr.appendChild(s2);dbHdr.appendChild(eb);
    groupEl.appendChild(dbHdr);
    if(!isCollapsed){
      items.forEach(function(it){
        if(!matchesQuery(it.name,it.cols))return;
        groupEl.appendChild(makeTblItem(it.name,it.cols,true));
      });
    }
    listEl.appendChild(groupEl);
  });

  var noneItems=grouped['__none__']||[];
  if(noneItems.length){
    var noneHdr=document.createElement('div');
    noneHdr.className='db-none-label';
    noneHdr.textContent='未分類';
    listEl.appendChild(noneHdr);
    noneItems.forEach(function(it){
      if(!matchesQuery(it.name,it.cols))return;
      listEl.appendChild(makeTblItem(it.name,it.cols,false));
    });
  }
  if(!Object.keys(tables).length){
    listEl.innerHTML='<div style="text-align:center;color:var(--muted);font-size:11px;padding-top:20px;line-height:1.9;">「＋ テーブル追加」または<br>ファイルを読み込んでください</div>';
  }
}

// ─── Memo nodes ───────────────────────────────────────────
var MEMO_COLORS=['#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
function initMemoColorPicker(current){
  var el=document.getElementById('memoColorPicker');
  if(!el)return;
  el.innerHTML='';
  MEMO_COLORS.forEach(function(c){
    var sw=document.createElement('div');
    sw.className='db-color-sw'+(c===current?' db-sel':'');
    sw.dataset.color=c;
    sw.style.setProperty('--db-color',c);
    sw.addEventListener('click',function(){
      el.querySelectorAll('.db-color-sw').forEach(function(s){s.classList.remove('db-sel');});
      sw.classList.add('db-sel');
    });
    el.appendChild(sw);
  });
}

function addMemo(){
  editingMemoId=null;
  document.getElementById('memoModalTitle').innerHTML=ic('file-text')+' メモを追加';
  document.getElementById('memoText').value='';
  document.getElementById('memoDeleteBtn').style.display='none';
  initMemoColorPicker(MEMO_COLORS[0]);
  document.getElementById('memoModal').classList.add('open');
  setTimeout(function(){document.getElementById('memoText').focus();},150);
}

function editMemo(id){
  var m=memos[id];if(!m)return;
  editingMemoId=id;
  document.getElementById('memoModalTitle').innerHTML=ic('file-text')+' メモを編集';
  document.getElementById('memoText').value=m.text;
  document.getElementById('memoDeleteBtn').style.display='flex';
  initMemoColorPicker(m.color||MEMO_COLORS[0]);
  document.getElementById('memoModal').classList.add('open');
}

function saveMemo(){
  var text=document.getElementById('memoText').value.trim();
  if(!text){showToast('メモを入力してください','error');return;}
  var sw=document.querySelector('#memoColorPicker .db-sel');
  var clr=sw?sw.dataset.color:MEMO_COLORS[0];
  if(editingMemoId!==null){
    memos[editingMemoId].text=text;
    memos[editingMemoId].color=clr;
    addChangeLog('メモ編集','ID:'+editingMemoId);
  }else{
    var id=memoIdCounter++;
    var r=document.getElementById('cnv').getBoundingClientRect();
    memos[id]={text:text,color:clr,x:(r.width/2-tf.x)/tf.scale-100,y:(r.height/2-tf.y)/tf.scale-40};
    addChangeLog('メモ追加',text.slice(0,20));
  }
  document.getElementById('memoModal').classList.remove('open');
  renderMemos();
}

function deleteMemo(){
  if(editingMemoId===null)return;
  delete memos[editingMemoId];
  addChangeLog('メモ削除','ID:'+editingMemoId);
  document.getElementById('memoModal').classList.remove('open');
  renderMemos();
}

function renderMemos(){
  // 既存のメモSVGノードを削除して再描画
  var existing=document.querySelectorAll('.memo-node');
  existing.forEach(function(e){e.parentNode&&e.parentNode.removeChild(e);});
  if(!showMemo)return;
  Object.entries(memos).forEach(function(e){
    var id=e[0],m=e[1];
    var mClr=m.color||MEMO_COLORS[0];
    var mc=hdrColors(mClr);
    var nShadow=cv('--node-shadow');
    // テキスト全体の幅を計算
    var PAD=10,LH=18,FS=12;
    var totalW=0,chars=m.text.split('');
    chars.forEach(function(ch){totalW+=ch.charCodeAt(0)>255?FS:FS*0.6;});
    // 短いテキストは1行に収める、長いテキストは折り返し（幅120〜240）
    var MW=Math.min(240,Math.max(120,totalW+PAD*2+4));
    var maxW=MW-PAD*2;
    var lines=[],cur='',curW=0;
    chars.forEach(function(ch){
      var cw=ch.charCodeAt(0)>255?FS:FS*0.6;
      if(curW+cw>maxW&&cur){lines.push(cur);cur='';curW=0;}
      cur+=ch;curW+=cw;
    });
    if(cur)lines.push(cur);
    var MH=Math.max(44,lines.length*LH+20);
    var g=svgEl('g',{class:'memo-node',transform:'translate('+m.x+','+m.y+')'});
    g.style.cursor='grab';
    // 影
    g.appendChild(svgEl('rect',{x:4,y:4,width:MW,height:MH,rx:6,fill:nShadow}));
    // 本体
    g.appendChild(svgEl('rect',{x:0,y:0,width:MW,height:MH,rx:6,fill:mc.bg,stroke:mClr,'stroke-width':'1'}));
    // 折り目（右上三角）
    var fold=svgEl('polygon',{points:(MW-12)+',0 '+MW+',0 '+MW+',12',fill:mClr,opacity:'0.3'});
    g.appendChild(fold);
    lines.forEach(function(line,i){
      var t=svgEl('text',{x:10,y:22+i*18,fill:cv('--node-text'),'font-size':12,'font-weight':500,'font-family':'sans-serif'});
      t.textContent=line;g.appendChild(t);
    });
    // ダブルクリックで編集
    g.addEventListener('dblclick',function(){editMemo(id);});
    // ドラッグ
    g.addEventListener('mousedown',function(ev){
      if(ev.target.tagName==='text')return;
      ev.stopPropagation();
      var startP=svgPt(ev.clientX,ev.clientY);
      var sx=m.x,sy=m.y;
      function onMove(e){var p=svgPt(e.clientX,e.clientY);m.x=sx+(p.x-startP.x);m.y=sy+(p.y-startP.y);g.setAttribute('transform','translate('+m.x+','+m.y+')');}
      function onUp(){document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);}
      document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);
    });
    nl.appendChild(g);
  });
}

// ─── Change log ───────────────────────────────────────────
function addChangeLog(action,detail){
  var now=new Date();
  var ts=now.getFullYear()+'-'
    +String(now.getMonth()+1).padStart(2,'0')+'-'
    +String(now.getDate()).padStart(2,'0')+' '
    +String(now.getHours()).padStart(2,'0')+':'
    +String(now.getMinutes()).padStart(2,'0')+':'
    +String(now.getSeconds()).padStart(2,'0');
  changeLog.unshift({time:ts,action:action,detail:detail||''});
  if(changeLog.length>100)changeLog.pop();
}

function showAIHelp(){
  var FORMAT_EXAMPLE = JSON.stringify({
    databases:[{name:"your_db",color:"#1e40af"}],
    tables:[{
      name:"users",db:"your_db",comment:"テーブルの説明",
      columns:[
        {name:"id",type:"int",pk:true,nullable:false,comment:""},
        {name:"name",type:"varchar(255)",pk:false,nullable:false},
        {name:"foreign_id",type:"int",pk:false,nullable:false,
          fk:{table:"other_table",column:"id",cardinality:"1-n"}}
      ],
      position:{x:40,y:40},collapsed:false
    }]
  }, null, 2);

  var currentJSON = '';
  try {
    if(Object.keys(tables).length > 0) {
      var out = Object.entries(tables).map(function(e){
        var n=e[0];
        var entry={name:n,columns:e[1].map(function(c){
          var col={name:c.name,type:c.type,pk:c.pk,nullable:c.nullable};
          if(c.comment)col.comment=c.comment;
          if(c.fk)col.fk={table:c.fk.table,column:c.fk.col,cardinality:c.fk.cardinality||'1-n'};
          return col;
        })};
        if(tableDB[n])entry.db=tableDB[n];
        if(tableComments[n])entry.comment=tableComments[n];
        return entry;
      });
      var res={};
      if(Object.keys(databases).length){
        res.databases=Object.entries(databases).map(function(e){return{name:e[0],color:e[1].color};});
        res.tables=out;
      } else { res=out; }
      currentJSON = JSON.stringify(res, null, 2);
    }
  } catch(e) {}

  var prompts = [
    {
      title: ic('camera',14)+' 画像・スクショからJSONを生成',
      desc: 'DBの設計書・既存テーブルのスクショをClaudeに見せて生成',
      text: 'この画像に含まれるテーブル定義を、以下のJSONフォーマットで出力してください。コードブロックなしのJSONのみ返してください。\n\nフォーマット：\n' + FORMAT_EXAMPLE
    },
    {
      title: ic('message-square',14)+' テキストの仕様からJSONを生成',
      desc: '「usersテーブルにはid, name, emailがあって...」のような説明から生成',
      text: '以下のテーブル仕様を、このJSONフォーマットで出力してください。コードブロックなしのJSONのみ返してください。\n\nフォーマット：\n' + FORMAT_EXAMPLE + '\n\n仕様：\n（ここに仕様を書いてください）'
    },
    {
      title: ic('tool',14)+' 既存のJSONを修正・追加',
      desc: '今開いているデータをClaudeに渡して修正してもらう',
      text: currentJSON
        ? '以下のER図JSONに、（修正内容を書いてください）を追加・修正してください。同じJSONフォーマットで、コードブロックなしのJSONのみ返してください。\n\n現在のJSON：\n' + currentJSON
        : '（先にテーブルを読み込んでください）'
    },
    {
      title: ic('clipboard',14)+' DDLからJSONを生成',
      desc: 'CREATE TABLE文を貼り付けてJSONに変換してもらう',
      text: '以下のDDL（CREATE TABLE文）を、このJSONフォーマットに変換してください。コードブロックなしのJSONのみ返してください。\n\nフォーマット：\n' + FORMAT_EXAMPLE + '\n\nDDL：\n（ここにCREATE TABLE文を貼り付けてください）'
    }
  ];

  var container = document.getElementById('aiPromptList');
  if(!container) return;
  container.innerHTML = '';

  prompts.forEach(function(p){
    var card = document.createElement('div');
    card.className = 'ai-prompt-card';
    var hdr = document.createElement('div');
    hdr.className = 'ai-prompt-header';
    var info = document.createElement('div');
    var title = document.createElement('div');title.className='ai-prompt-title';title.textContent=p.title;
    var desc = document.createElement('div');desc.className='ai-prompt-desc';desc.textContent=p.desc;
    info.appendChild(title);info.appendChild(desc);
    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'コピー';
    (function(text, btn){
      btn.onclick = function(){
        navigator.clipboard.writeText(text).then(function(){
          btn.textContent='✓ コピー済み';btn.classList.add('copied');
          setTimeout(function(){btn.textContent='コピー';btn.classList.remove('copied');},2000);
        }).catch(function(){
          // fallback
          var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
          btn.textContent='✓ コピー済み';btn.classList.add('copied');
          setTimeout(function(){btn.textContent='コピー';btn.classList.remove('copied');},2000);
        });
      };
    })(p.text, copyBtn);
    hdr.appendChild(info);hdr.appendChild(copyBtn);
    var body = document.createElement('div');
    body.className = 'ai-prompt-body';
    body.textContent = p.text;
    card.appendChild(hdr);card.appendChild(body);
    container.appendChild(card);
  });

  document.getElementById('aiModal').classList.add('open');
}

function showHistory(){
  var el=document.getElementById('historyList');
  if(!el)return;
  if(!changeLog.length){
    el.innerHTML='<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px;">変更履歴はまだありません</div>';
  }else{
    el.innerHTML=changeLog.map(function(c){
      return '<div style="display:grid;grid-template-columns:140px auto 1fr;gap:8px;align-items:center;padding:7px 8px;background:var(--bg);border:1px solid var(--border);border-radius:5px;font-size:11px;">'
        +'<span style="color:var(--muted);">'+c.time+'</span>'
        +'<span style="background:var(--accent);color:white;padding:1px 8px;border-radius:99px;font-size:10px;white-space:nowrap;">'+c.action+'</span>'
        +'<span style="color:var(--text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+c.detail+'</span>'
        +'</div>';
    }).join('');
  }
  document.getElementById('historyModal').classList.add('open');
}

// ─── Label toggle ─────────────────────────────────────────
function syncViewToggles(){
  var b;
  b=document.getElementById('togLabels');if(b)b.classList.toggle('active',showLabels);
  b=document.getElementById('togDBGroup');if(b)b.classList.toggle('active',showDBG);
  b=document.getElementById('togMemos');if(b)b.classList.toggle('active',showMemo);
  // キーのみ: 全テーブルが折りたたまれていたら active
  var names=Object.keys(tables);
  var allCollapsed=names.length>0&&names.every(function(n){return collapsedTables[n];});
  b=document.getElementById('togCollapse');if(b)b.classList.toggle('active',allCollapsed);
}
function toggleLabels(){
  showLabels=!showLabels;
  var btn=document.getElementById('togLabels');
  if(btn)btn.classList.toggle('active',showLabels);
  renderEdges();
}
function toggleDBGroups(){
  showDBG=!showDBG;
  var btn=document.getElementById('togDBGroup');
  if(btn)btn.classList.toggle('active',showDBG);
  renderDBGroups();
}
function toggleMemos(){
  showMemo=!showMemo;
  var btn=document.getElementById('togMemos');
  if(btn)btn.classList.toggle('active',showMemo);
  renderMemos();
}

// ─── Duplicate table ──────────────────────────────────────
function duplicateTable(name){
  if(!tables[name])return;
  var base=name+'_copy',newName=base,i=2;
  while(tables[newName])newName=base+i++;
  tables[newName]=JSON.parse(JSON.stringify(tables[name]));
  // FK内のテーブル名は元のまま
  tableComments[newName]=tableComments[name]||'';
  var pos=nodePos[name]||{x:40,y:40};
  nodePos[newName]={x:pos.x+240,y:pos.y+30};
  addChangeLog('テーブル複製',name+'→'+newName);saveHistory();buildRels();renderAll();
  showToast('"'+newName+'" を作成しました','success');
}

// ─── Keyboard shortcuts help ──────────────────────────────
function showShortcuts(){
  document.getElementById('shortcutModal').classList.add('open');
}

function toggleAllCollapse(){
  var names=Object.keys(tables);
  if(!names.length)return;
  var anyExpanded=names.some(function(n){return !collapsedTables[n];});
  names.forEach(function(n){collapsedTables[n]=anyExpanded;});
  var btn=document.getElementById('togCollapse');
  if(btn)btn.classList.toggle('active',anyExpanded);
  renderEdges();renderNodes();
}

function updateUndoRedoBtns(){
  var u=document.getElementById('undoBtn'),r=document.getElementById('redoBtn');
  if(u)u.style.opacity=historyStack.length?'1':'0.35';
  if(r)r.style.opacity=historyFuture.length?'1':'0.35';
}
// Ctrl+Z / Ctrl+Y
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==='z'){e.preventDefault();undo();}
  if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.shiftKey&&e.key==='z'))){e.preventDefault();redo();}
  if(e.key==='?'&&!e.ctrlKey&&!e.metaKey){
    var t=document.activeElement.tagName;
    if(t!=='INPUT'&&t!=='TEXTAREA'&&t!=='SELECT') showShortcuts();
  }
});

// ─── Table search ─────────────────────────────────────────
function filterTables(q){
  q=q.toLowerCase().trim();
  document.querySelectorAll('#tblList .tbl-item').forEach(function(el){
    var name=el.querySelector('span').textContent.toLowerCase();
    var tname=el.querySelector('span').textContent.trim();
    var comment=(tableComments[tname]||'').toLowerCase();
    var colText=(tables[tname]||[]).map(function(c){return c.name+' '+(c.comment||'');}).join(' ').toLowerCase();
    var match=!q||name.includes(q)||comment.includes(q)||colText.includes(q);
    el.style.display=match?'':'none';
  });
}

// ─── Export ──────────────────────────────────────────────
function exportDDL(){
  if(!Object.keys(tables).length){showToast('テーブルがありません','error');return;}
  var out=[];
  Object.entries(tables).forEach(function(e){
    var tname=e[0],cols=e[1];
    var tc=tableComments[tname];
    if(tc)out.push('-- '+tc);
    out.push('CREATE TABLE `'+tname+'` (');
    var defs=[];
    cols.forEach(function(c){
      var d='  `'+c.name+'` '+c.type.toUpperCase();
      if(!c.nullable)d+=' NOT NULL';
      if(c.pk)d+=' AUTO_INCREMENT';
      if(c.comment)d+=" COMMENT '"+c.comment+"'";
      defs.push(d);
    });
    var pks=cols.filter(function(c){return c.pk;}).map(function(c){return '`'+c.name+'`';});
    if(pks.length)defs.push('  PRIMARY KEY ('+pks.join(', ')+')');
    cols.filter(function(c){return c.fk;}).forEach(function(c){
      defs.push('  FOREIGN KEY (`'+c.name+'`) REFERENCES `'+c.fk.table+'` (`'+c.fk.col+'`)');
    });
    out.push(defs.join(',\\n'));
    out.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');
    out.push('');
  });
  downloadText(out.join('\n'),'er_diagram.sql','text/plain');
  showToast('✓ DDLをダウンロードしました','success');
}

function exportJSON(){
  if(!Object.keys(tables).length){showToast('テーブルがありません','error');return;}
  var result={};
  if(Object.keys(databases).length){
    result.databases=Object.entries(databases).map(function(e){return{name:e[0],color:e[1].color};});
  }
  var out=Object.entries(tables).map(function(e){
    var n=e[0];
    var entry={name:n,columns:e[1].map(function(c){
      var col={name:c.name,type:c.type,pk:c.pk,nullable:c.nullable};
      if(c.comment)col.comment=c.comment;
      if(c.fk)col.fk={table:c.fk.table,column:c.fk.col,cardinality:c.fk.cardinality||'1-n'};
      return col;
    })};
    if(nodePos[n])entry.position={x:Math.round(nodePos[n].x),y:Math.round(nodePos[n].y)};
    if(tableComments[n])entry.comment=tableComments[n];
    if(collapsedTables[n])entry.collapsed=true;
    if(tableDB[n])entry.db=tableDB[n];
    return entry;
  });
  if(result.databases)result.tables=out;else result=out;
  downloadText(JSON.stringify(result,null,2),'er_diagram.json','application/json');
  showToast('✓ JSONをダウンロードしました','success');
}

function buildExportSVG(){
  var svgEl=document.getElementById('diagram-svg');
  var bbox=getSVGBBox();
  var PAD=40;
  var clone=svgEl.cloneNode(true);
  clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  clone.setAttribute('width',bbox.w+PAD*2);
  clone.setAttribute('height',bbox.h+PAD*2);
  // フォントをシステムフォントに統一（出力時の崩れ対策）
  var isLight=document.body.classList.contains('light-theme');
  clone.setAttribute('style','background:'+(isLight?'#f0f4f8':'#080e1a')+';font-family:monospace,sans-serif;');
  clone.querySelectorAll('text').forEach(function(t){t.setAttribute('font-family','monospace,sans-serif');});
  clone.querySelector('#dr').setAttribute('transform','translate('+(PAD-bbox.x)+','+(PAD-bbox.y)+')');
  return {clone:clone, w:bbox.w+PAD*2, h:bbox.h+PAD*2};
}

function exportSVG(){
  if(!Object.keys(tables).length){showToast('テーブルがありません','error');return;}
  var res=buildExportSVG();
  var svgStr=new XMLSerializer().serializeToString(res.clone);
  downloadText(svgStr,'er_diagram.svg','image/svg+xml');
  showToast('✓ SVGをダウンロードしました','success');
}

function exportPNG(){
  if(!Object.keys(tables).length){showToast('テーブルがありません','error');return;}
  var res=buildExportSVG();
  var W=res.w, H=res.h;
  var isLight=document.body.classList.contains('light-theme');
  var bgColor=isLight?'#f0f4f8':'#080e1a';
  var svgStr=new XMLSerializer().serializeToString(res.clone);
  var img=new Image();
  var canvas=document.createElement('canvas');
  canvas.width=W*2; canvas.height=H*2;
  var ctx=canvas.getContext('2d');
  ctx.scale(2,2);
  img.onload=function(){
    ctx.fillStyle=bgColor; ctx.fillRect(0,0,W,H);
    ctx.drawImage(img,0,0,W,H);
    var a=document.createElement('a');
    a.href=canvas.toDataURL('image/png');
    a.download='er_diagram.png'; a.click();
    showToast('✓ PNGをダウンロードしました','success');
  };
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
}

function getSVGBBox(){
  var names=Object.keys(tables);
  if(!names.length)return{x:0,y:0,w:800,h:600};
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  names.forEach(function(n){
    var p=nodePos[n];if(!p)return;
    minX=Math.min(minX,p.x); minY=Math.min(minY,p.y);
    maxX=Math.max(maxX,p.x+NW); maxY=Math.max(maxY,p.y+nodeH(n));
  });
  return{x:minX,y:minY,w:maxX-minX,h:maxY-minY};
}

function downloadText(text,filename,mime){
  var blob=new Blob([text],{type:mime});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename; a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Project Management ─────────────────────────────────
var LS_PROJECTS='erd_projects';
var LS_PROJECT_PREFIX='erd_project_';
var LS_CURRENT='erd_current_project';
var currentProjectId=null;
var projectList={}; // {id: {name, createdAt, updatedAt}}
var autoSaveTimer=null;

function generateId(){return Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);}

function getERState(){
  return{
    tables:tables,nodePos:nodePos,nodeCol:nodeCol,
    tableComments:tableComments,databases:databases,
    tableDB:tableDB,memos:memos,collapsedTables:collapsedTables,
    memoIdCounter:memoIdCounter,changeLog:changeLog,
    relations:relations,tf:{x:tf.x,y:tf.y,scale:tf.scale},
    showLabels:showLabels,showDBG:showDBG,showMemo:showMemo
  };
}

function loadERState(state){
  tables=state.tables||{};
  nodePos=state.nodePos||{};
  nodeCol=state.nodeCol||{};
  tableComments=state.tableComments||{};
  databases=state.databases||{};
  tableDB=state.tableDB||{};
  memos=state.memos||{};
  collapsedTables=state.collapsedTables||{};
  memoIdCounter=state.memoIdCounter||0;
  changeLog=state.changeLog||[];
  showLabels=state.showLabels!==undefined?state.showLabels:true;
  showDBG=state.showDBG!==undefined?state.showDBG:true;
  showMemo=state.showMemo!==undefined?state.showMemo:true;
  if(state.tf){tf.x=state.tf.x;tf.y=state.tf.y;tf.scale=state.tf.scale;}
  historyStack=[];historyFuture=[];
  syncViewToggles();
  buildRels();applyTf();renderAll();updateUndoRedoBtns();
}

function clearERState(){
  tables={};relations=[];nodePos={};nodeCol={};
  tableComments={};databases={};tableDB={};
  memos={};memoIdCounter=0;collapsedTables={};
  changeLog=[];historyStack=[];historyFuture=[];
  tf={x:40,y:40,scale:1};showLabels=true;showDBG=true;showMemo=true;
  syncViewToggles();
  nl.innerHTML='';el.innerHTML='';
  if(dbGroupLayer)dbGroupLayer.innerHTML='';
  applyTf();updateUndoRedoBtns();
  document.getElementById('emp').style.display='flex';
  document.getElementById('st-t').textContent='0';
  document.getElementById('st-r').textContent='0';
  document.getElementById('tblList').innerHTML='<div style="text-align:center;color:var(--muted);font-size:11px;padding-top:20px;line-height:1.9;">「＋ テーブル追加」または<br>ファイルを読み込んでください</div>';
}

function autoSave(){
  clearTimeout(autoSaveTimer);
  autoSaveTimer=setTimeout(function(){
    if(!currentProjectId)return;
    try{
      var state=getERState();
      localStorage.setItem(LS_PROJECT_PREFIX+currentProjectId,JSON.stringify(state));
      projectList[currentProjectId].updatedAt=new Date().toISOString();
      projectList[currentProjectId].tableCount=Object.keys(tables).length;
      saveProjectList();
      if(window.driveSync) window.driveSync.markDirty(LS_PROJECT_PREFIX+currentProjectId);
    }catch(e){console.warn('autoSave failed:',e);}
  },500);
}

function saveProjectList(){
  try{
    localStorage.setItem(LS_PROJECTS,JSON.stringify(projectList));
    if(window.driveSync) window.driveSync.markDirty(LS_PROJECTS);
  }catch(e){}
}

function loadProjectList(){
  try{
    var raw=localStorage.getItem(LS_PROJECTS);
    if(raw)projectList=JSON.parse(raw);
    else projectList={};
  }catch(e){projectList={};}
}

function createNewProject(name){
  // 現在のプロジェクトを保存
  if(currentProjectId)autoSaveNow();
  var id=generateId();
  var pName=name||'untitled';
  // プロンプトで名前入力
  if(!name){
    var input=prompt('プロジェクト名を入力してください:','新しいプロジェクト');
    if(input===null)return; // キャンセル
    pName=input.trim()||'untitled';
  }
  projectList[id]={name:pName,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),tableCount:0};
  saveProjectList();
  // 新プロジェクトに切替
  switchProject(id,true);
  closeProjectDropdown();
  document.getElementById('projModal').classList.remove('open');
  showToast('✓ "'+pName+'" を作成しました','success');
}

function switchProject(id,isNew){
  if(id===currentProjectId)return;
  // 現在のプロジェクトを保存
  if(currentProjectId)autoSaveNow();
  currentProjectId=id;
  localStorage.setItem(LS_CURRENT,id);
  if(isNew){
    clearERState();
  }else{
    // プロジェクトデータを読み込み
    try{
      var raw=localStorage.getItem(LS_PROJECT_PREFIX+id);
      if(raw){
        loadERState(JSON.parse(raw));
      }else{
        clearERState();
      }
    }catch(e){clearERState();}
  }
  updateProjectUI();
  closeProjectDropdown();
}

function autoSaveNow(){
  clearTimeout(autoSaveTimer);
  if(!currentProjectId)return;
  try{
    var state=getERState();
    localStorage.setItem(LS_PROJECT_PREFIX+currentProjectId,JSON.stringify(state));
    projectList[currentProjectId].updatedAt=new Date().toISOString();
    projectList[currentProjectId].tableCount=Object.keys(tables).length;
    saveProjectList();
    if(window.driveSync) window.driveSync.markDirty(LS_PROJECT_PREFIX+currentProjectId);
  }catch(e){}
}

function renameProject(id){
  var proj=projectList[id];if(!proj)return;
  var newName=prompt('新しい名前:',proj.name);
  if(newName===null||!newName.trim())return;
  proj.name=newName.trim();
  proj.updatedAt=new Date().toISOString();
  saveProjectList();
  updateProjectUI();
  renderProjectManager();
  showToast('✓ 名前を変更しました','success');
}

function duplicateProject(id){
  var proj=projectList[id];if(!proj)return;
  var newId=generateId();
  projectList[newId]={name:proj.name+' (コピー)',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),tableCount:proj.tableCount||0};
  // データもコピー
  try{
    var raw=localStorage.getItem(LS_PROJECT_PREFIX+id);
    if(raw)localStorage.setItem(LS_PROJECT_PREFIX+newId,raw);
  }catch(e){}
  saveProjectList();
  if(window.driveSync) window.driveSync.markDirty(LS_PROJECT_PREFIX+newId);
  renderProjectManager();
  renderProjectDropdownList();
  showToast('✓ "'+projectList[newId].name+'" を作成しました','success');
}

function deleteProjectById(id){
  var proj=projectList[id];if(!proj)return;
  var ids=Object.keys(projectList);
  if(ids.length<=1){showToast('最後のプロジェクトは削除できません','error');return;}
  if(!confirm('"'+proj.name+'" を削除しますか？'))return;
  delete projectList[id];
  try{localStorage.removeItem(LS_PROJECT_PREFIX+id);}catch(e){}
  saveProjectList();
  if(window.driveSync) window.driveSync.markDeleted(LS_PROJECT_PREFIX+id);
  // 削除したのが現在のプロジェクトなら別のに切替
  if(id===currentProjectId){
    var remainIds=Object.keys(projectList);
    switchProject(remainIds[0],false);
  }
  renderProjectManager();
  renderProjectDropdownList();
  showToast('プロジェクトを削除しました');
}

function updateProjectUI(){
  var el=document.getElementById('edProjName');
  if(!el)return;
  var name=(currentProjectId&&projectList[currentProjectId])?projectList[currentProjectId].name:'untitled';
  el.textContent=name;
}
function toggleSidebar(){
  var sb=document.getElementById('sidebar');
  if(sb)sb.classList.toggle('collapsed');
}
function startProjNameEdit(){
  var el=document.getElementById('edProjName');
  if(!el||!currentProjectId||!projectList[currentProjectId])return;
  el.contentEditable='true';
  el.classList.add('editing');
  el.focus();
}
function initProjNameEdit(){
  var el=document.getElementById('edProjName');
  if(!el)return;
  el.addEventListener('blur',function(){commitProjName(el);});
  el.addEventListener('keydown',function(e){
    if(e.key==='Enter'){e.preventDefault();el.blur();}
    if(e.key==='Escape'){el.textContent=projectList[currentProjectId].name;el.blur();}
  });
}
function commitProjName(el){
  el.contentEditable='false';
  el.classList.remove('editing');
  if(!currentProjectId||!projectList[currentProjectId])return;
  var v=el.textContent.trim();
  if(!v)v='untitled';
  projectList[currentProjectId].name=v;
  el.textContent=v;
  localStorage.setItem(LS_LIST,JSON.stringify(projectList));
  if(window.driveSync)window.driveSync.markDirty(LS_LIST);
}

function openProjectManager(){
  renderProjectManager();
  document.getElementById('projModal').classList.add('open');
}

function renderProjectManager(){
  var list=document.getElementById('projManagerList');
  if(!list)return;
  list.innerHTML='';
  var sorted=Object.entries(projectList).sort(function(a,b){return(b[1].updatedAt||'').localeCompare(a[1].updatedAt||'');});
  sorted.forEach(function(e){
    var id=e[0],proj=e[1];
    var item=document.createElement('div');
    item.className='proj-mgr-item'+(id===currentProjectId?' active':'');
    // アイコン
    var icon=document.createElement('span');icon.innerHTML=id===currentProjectId?ic('folder',16):ic('file',16);
    // 名前
    var name=document.createElement('span');name.className='proj-mgr-name';name.textContent=proj.name;
    // メタ
    var meta=document.createElement('span');meta.className='proj-mgr-meta';
    var d=proj.updatedAt?new Date(proj.updatedAt):new Date();
    meta.textContent=(proj.tableCount||0)+' tables / '+d.toLocaleDateString('ja-JP');
    // ボタン群
    var btnRename=document.createElement('button');btnRename.className='proj-mgr-btn';btnRename.innerHTML=ic('edit-2',12)+' 名前変更';
    (function(pid){btnRename.onclick=function(){renameProject(pid);};})(id);
    var btnDup=document.createElement('button');btnDup.className='proj-mgr-btn';btnDup.innerHTML=ic('copy',12)+' 複製';
    (function(pid){btnDup.onclick=function(){duplicateProject(pid);};})(id);
    var btnDel=document.createElement('button');btnDel.className='proj-mgr-btn del';btnDel.innerHTML=ic('trash',12);
    (function(pid){btnDel.onclick=function(){deleteProjectById(pid);};})(id);
    var btnOpen=document.createElement('button');btnOpen.className='proj-mgr-btn';
    btnOpen.style.cssText='background:var(--accent);color:white;border-color:var(--accent);';
    btnOpen.textContent=id===currentProjectId?'● 使用中':'開く';
    if(id!==currentProjectId)(function(pid){btnOpen.onclick=function(){switchProject(pid,false);renderProjectManager();document.getElementById('projModal').classList.remove('open');};})(id);

    item.appendChild(icon);item.appendChild(name);item.appendChild(meta);
    item.appendChild(btnRename);item.appendChild(btnDup);item.appendChild(btnDel);item.appendChild(btnOpen);
    list.appendChild(item);
  });
}

// Escape key closes project modal
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    document.getElementById('projModal').classList.remove('open');
  }
});

// ─── Project Select Screen ──────────────────────────────
function showProjectSelectScreen(){
  document.getElementById('projectSelectScreen').style.display='flex';
  document.getElementById('editorWrapper').style.display='none';
  renderPSSList();
}

function showEditor(){
  document.getElementById('projectSelectScreen').style.display='none';
  document.getElementById('editorWrapper').style.display='flex';
}

function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function renderProjectThumbnail(projectId){
  try{
    var raw=localStorage.getItem(LS_PROJECT_PREFIX+projectId);
    if(!raw)return '<div class="erd-thumb-empty">'+ic('hexagon',24)+'</div>';
    var state=JSON.parse(raw);
    var tbls=state.tables||{};
    var pos=state.nodePos||{};
    var col=state.nodeCol||{};
    var ids=Object.keys(tbls);
    if(ids.length===0)return '<div class="erd-thumb-empty">'+ic('hexagon',24)+'</div>';
    // 各テーブルの近似サイズ（実エディタの値に近い概算）
    var TW=200,TH=80;
    // バウンディングボックス
    var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    ids.forEach(function(id){
      var p=pos[id]||{x:0,y:0};
      if(p.x<minX)minX=p.x;
      if(p.y<minY)minY=p.y;
      if(p.x+TW>maxX)maxX=p.x+TW;
      if(p.y+TH>maxY)maxY=p.y+TH;
    });
    var pad=40;
    minX-=pad;minY-=pad;maxX+=pad;maxY+=pad;
    var w=maxX-minX,h=maxY-minY;
    if(w<=0||h<=0)return '<div class="erd-thumb-empty">'+ic('hexagon',24)+'</div>';
    // FK 関係を抽出（tables[id] はカラム配列そのもの）
    var lines=[];
    ids.forEach(function(id){
      var cols=tbls[id];
      if(!Array.isArray(cols))return;
      cols.forEach(function(c){
        if(c && c.fk && c.fk.table && pos[id] && pos[c.fk.table]){
          var p1=pos[id],p2=pos[c.fk.table];
          lines.push([p1.x+TW/2,p1.y+TH/2,p2.x+TW/2,p2.y+TH/2]);
        }
      });
    });
    var svg='<svg viewBox="'+minX+' '+minY+' '+w+' '+h+'" preserveAspectRatio="xMidYMid meet">';
    // 関係線
    lines.forEach(function(l){
      svg+='<line x1="'+l[0]+'" y1="'+l[1]+'" x2="'+l[2]+'" y2="'+l[3]+'" stroke="rgba(167,139,250,.55)" stroke-width="3"/>';
    });
    // テーブル矩形
    ids.forEach(function(id){
      var p=pos[id]||{x:0,y:0};
      var c=col[id]||'#3b82f6';
      svg+='<rect x="'+p.x+'" y="'+p.y+'" width="'+TW+'" height="'+TH+'" rx="10" fill="'+c+'" opacity="0.88"/>';
      svg+='<rect x="'+p.x+'" y="'+p.y+'" width="'+TW+'" height="20" rx="10" fill="rgba(255,255,255,.18)"/>';
    });
    svg+='</svg>';
    return svg;
  }catch(e){return '<div class="erd-thumb-empty">'+ic('hexagon',24)+'</div>';}
}

function renderPSSList(){
  var list=document.getElementById('pssProjectList');
  if(!list)return;
  list.innerHTML='';
  var sorted=Object.entries(projectList).sort(function(a,b){return(b[1].updatedAt||'').localeCompare(a[1].updatedAt||'');});
  if(!sorted.length){
    list.innerHTML='<div class="app-empty">'
      +'<div class="app-empty-icon">'+ic('hexagon',48)+'</div>'
      +'<div class="app-empty-text">プロジェクトがありません</div>'
      +'<div class="app-empty-sub">「＋ 新規プロジェクト」から作成してください</div>'
      +'</div>';
    return;
  }
  sorted.forEach(function(e){
    var id=e[0],proj=e[1];
    var card=document.createElement('div');
    card.className='app-card';
    var d=proj.updatedAt?new Date(proj.updatedAt):new Date();
    var dateStr=d.toLocaleDateString('ja-JP');
    card.innerHTML='<div class="app-card-thumb">'+renderProjectThumbnail(id)+'</div>'
      +'<div class="app-card-info">'
      +'<div class="app-card-name">'+escapeHtml(proj.name)+'</div>'
      +'<div class="app-card-meta"><span>'+(proj.tableCount||0)+' tables</span><span>'+dateStr+'</span></div>'
      +'</div>'
      +'<div class="app-card-actions">'
      +'<button class="app-card-btn rename-btn" title="名前変更">'+ic('edit-2',14)+'</button>'
      +'<button class="app-card-btn danger del-btn" title="削除">'+ic('trash',14)+'</button>'
      +'</div>';
    // クリックでプロジェクトを開く（ボタン以外）
    (function(pid){
      card.addEventListener('click',function(ev){
        if(ev.target.closest('.app-card-actions'))return;
        pssOpenProject(pid);
      });
      card.querySelector('.rename-btn').addEventListener('click',function(ev){
        ev.stopPropagation();
        pssRenameProject(pid);
      });
      card.querySelector('.del-btn').addEventListener('click',function(ev){
        ev.stopPropagation();
        pssDeleteProject(pid);
      });
    })(id);
    list.appendChild(card);
  });
}

function pssOpenProject(id){
  currentProjectId=id;
  localStorage.setItem(LS_CURRENT,id);
  try{
    var raw=localStorage.getItem(LS_PROJECT_PREFIX+id);
    if(raw){loadERState(JSON.parse(raw));}
    else{clearERState();}
  }catch(e){clearERState();}
  updateProjectUI();
  showEditor();
}

function pssCreateNew(){
  var input=prompt('プロジェクト名を入力してください:','新しいプロジェクト');
  if(input===null)return;
  var pName=input.trim()||'untitled';
  var id=generateId();
  projectList[id]={name:pName,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),tableCount:0};
  saveProjectList();
  currentProjectId=id;
  localStorage.setItem(LS_CURRENT,id);
  clearERState();
  updateProjectUI();
  showEditor();
  showToast('✓ "'+pName+'" を作成しました','success');
}

function pssRenameProject(id){
  var proj=projectList[id];if(!proj)return;
  var newName=prompt('新しい名前:',proj.name);
  if(newName===null||!newName.trim())return;
  proj.name=newName.trim();
  proj.updatedAt=new Date().toISOString();
  saveProjectList();
  renderPSSList();
}

function pssDeleteProject(id){
  var proj=projectList[id];if(!proj)return;
  var ids=Object.keys(projectList);
  if(ids.length<=1){showToast('最後のプロジェクトは削除できません','error');return;}
  if(!confirm('"'+proj.name+'" を削除しますか？'))return;
  delete projectList[id];
  try{localStorage.removeItem(LS_PROJECT_PREFIX+id);}catch(e){}
  saveProjectList();
  if(window.driveSync) window.driveSync.markDeleted(LS_PROJECT_PREFIX+id);
  if(id===currentProjectId){currentProjectId=null;}
  renderPSSList();
  showToast('プロジェクトを削除しました');
}

// ヘッダータイトルクリックでプロジェクト選択画面に戻る

// ─── Initialize Projects ─────────────────────────────────
function initProjects(){
  loadProjectList();
  var ids=Object.keys(projectList);
  if(!ids.length){
    var id=generateId();
    projectList[id]={name:'untitled',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),tableCount:0};
    saveProjectList();
  }
  // 常にプロジェクト選択画面を表示
  showProjectSelectScreen();
}

// ─── Drive Sync ──────────────────────────────────────────
function initDriveSync(){
  if(!window.driveSync) return;
  window.driveSync.register({
    toolId:'er-diagram',
    keys:[LS_PROJECTS],
    keyPatterns:[new RegExp('^'+LS_PROJECT_PREFIX.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))],
    onSyncedFromRemote:function(changedKeys){
      // Drive 側から更新が降ってきたらプロジェクト一覧をリロードして UI を再描画
      loadProjectList();
      // PSS が表示されているなら一覧を更新
      var pss=document.getElementById('projectSelectScreen');
      if(pss && pss.style.display!=='none' && typeof renderPSSList==='function'){
        renderPSSList();
      }
      // 編集中のプロジェクトが更新された場合は警告のみ
      if(currentProjectId && changedKeys.indexOf(LS_PROJECT_PREFIX+currentProjectId)>=0){
        showToast('別の端末から更新がありました。プロジェクトを開き直すと反映されます','info');
      }
      // 編集中のプロジェクトが削除された場合
      if(currentProjectId && !projectList[currentProjectId]){
        showToast('編集中のプロジェクトが別の端末で削除されました','error');
        currentProjectId=null;
        showProjectSelectScreen();
      }
    },
  });
  // 同期UIはプロジェクト選択画面のみにマウント（編集画面では非表示）
  var pssMount=document.getElementById('pss-sync-mount');
  if(pssMount) window.driveSync.mountUI(pssMount);
  window.driveSync.init();
}

function initTheme(){
  if(!window.theme) return;
  ['theme-mount','pss-theme-mount'].forEach(function(id){
    var m=document.getElementById(id);
    if(m) window.theme.mountUI(m);
  });
  // テーマ変更時にキャンバスを再描画（CSS変数が変わるため）
  window.theme.onChange(function(){
    if(Object.keys(tables).length)renderAll();
  });
}

initIcons();
initProjects();
initTheme();
initProjNameEdit();
initDriveSync();
