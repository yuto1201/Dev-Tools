var tables={},relations=[],nodePos={},nodeCol={},editTbl=null;
var tableComments={};
var historyStack=[],historyFuture=[];
var MAX_HISTORY=50;
var showLabels=true;
var memos={};
var memoIdCounter=0;
var editingMemoId=null;
var changeLog=[];
var databases={}; // {dbName: {color,comment}}
var tableDB={}; // {tableName: dbName}
var DB_PALETTE=['#1e3a5f','#14532d','#4c1d95','#7c2d12','#0c4a6e','#365314','#831843','#1c1917'];
var tf={x:40,y:40,scale:1},isPan=false,panMode=false,panSt=null;
var dragNode=null,dragOff={x:0,y:0};
var PALETTE=['#1e40af','#164e63','#14532d','#3b0764','#78350f','#0c4a6e','#065f46','#4c1d95','#7c2d12','#1e3a5f','#4a1942','#1c1917'];
var TYPES=['int','bigint','varchar','varchar(255)','char','text','boolean','date','datetime','timestamp','decimal(10,2)','float','double','uuid','json','blob'];
var cnv=document.getElementById('cnv');
var nl=document.getElementById('nl'),el=document.getElementById('el'),dr=document.getElementById('dr');

function openAddModal(){
  editTbl=null;
  document.getElementById('mttl').textContent='新しいテーブルを追加';
  document.getElementById('inName').value='';
  if(document.getElementById('inComment'))document.getElementById('inComment').value='';
  document.getElementById('delBtn').style.display='none';
  initColorPicker(null);
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
  initColorPicker(nodeCol[name]||null);
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
    sec.innerHTML='<div style="font-size:11px;color:var(--text3);padding:6px 2px;">このテーブルを参照している外部キーはありません</div>';
    return;
  }
  var cardLabel={'1-1':'1対1','1-n':'1対多','n-1':'多対1','n-n':'多対多'};
  sec.innerHTML=rows.map(function(r){
    var cl=cardLabel[r.card]||r.card;
    return '<div style="padding:7px 12px;background:var(--bg);border:1px solid var(--border);border-radius:5px;font-size:11px;margin-bottom:5px;line-height:1.8;">'
      +'<span style="color:var(--accent2);font-weight:600;">'+r.fromTable+'</span>'
      +'<span style="color:var(--text3);"> の </span>'
      +'<span style="color:var(--yellow);">'+r.fromCol+'</span>'
      +'<span style="color:var(--text3);"> が、このテーブルの </span>'
      +'<span style="color:var(--yellow);">'+r.toCol+'</span>'
      +'<span style="color:var(--text3);"> を参照しています</span>'
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
  row.innerHTML='<div class="drag-handle" title="ドラッグで並び替え">⠿</div><input class="cn" placeholder="column_name" value="'+(data.name||'')+'" autocomplete="off"><select class="ct">'+typeOpts+'</select><div class="col-tog"><input type="checkbox" class="cpk"'+(data.pk?' checked':'')+'><label>PK</label></div><div class="col-tog"><input type="checkbox" class="cnu"'+(data.nullable!==false?' checked':'')+'><label>NULL</label></div><input class="cm" placeholder="メモ" value="'+(data.comment||'')+'" autocomplete="off" style="font-size:10px;"><button class="col-del" onclick="this.closest(\'.col-row\').remove()">✕</button>';
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
  row.innerHTML='<input placeholder="このテーブルの列" value="'+(data.fromCol||'')+'" class="ff" list="'+dlId+'" autocomplete="off"><datalist id="'+dlId+'">'+curCols+'</datalist><div class="fk-arr">→</div><select class="ft">'+(opts||'<option value="">（テーブルなし）</option>')+'</select><div class="fk-arr">.</div><input placeholder="参照列(例:id)" value="'+(data.toCol||'id')+'" class="fc" list="'+dlId2+'" autocomplete="off"><datalist id="'+dlId2+'">'+toCols+'</datalist><select class="fcard"><option value="1-1" '+(cardVal==='1-1'?'selected':'')+'>1対1</option><option value="1-n" '+(cardVal==='1-n'?'selected':'')+'>1対多</option><option value="n-1" '+(cardVal==='n-1'?'selected':'')+'>多対1</option><option value="n-n" '+(cardVal==='n-n'?'selected':'')+'>多対多</option></select><button class="col-del" onclick="this.closest(\'.fk-row\').remove()">✕</button>';
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
  var pickedColor=document.querySelector('#colorPicker .cp-swatch.selected');
  if(pickedColor)nodeCol[name]=pickedColor.dataset.color;
  var dbSel=document.getElementById('inDB');
  if(dbSel)tableDB[name]=dbSel.value||null;
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
function color(n){if(!nodeCol[n])nodeCol[n]=PALETTE[Object.keys(tables).indexOf(n)%PALETTE.length];return nodeCol[n];}

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
    var lbg=svgEl('rect',{x:gx+12,y:gy+4,width:dbName.length*8+24,height:22,rx:11,fill:dbColor});
    g.appendChild(lbg);
    var ltxt=svgEl('text',{x:gx+24,y:gy+19,fill:'white','font-size':12,'font-weight':700,'font-family':'sans-serif'});
    ltxt.textContent='🗄 '+dbName;
    g.appendChild(ltxt);
    // 編集ボタン
    var editBtn=svgEl('text',{x:gx+gw-12,y:gy+19,fill:dbColor,'font-size':11,'text-anchor':'end','font-family':'sans-serif',cursor:'pointer'});
    editBtn.textContent='✏';
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
  Object.entries(tables).forEach(function(e){
    var name=e[0],cols=e[1],pos=nodePos[name]||{x:40,y:40},clr=color(name),h=nodeH(name);
    var g=svgEl('g',{'data-table':name,transform:'translate('+pos.x+','+pos.y+')'});
    g.style.cursor='grab';
    g.appendChild(svgEl('rect',{x:4,y:4,width:NW,height:h,rx:8,fill:'rgba(0,0,0,0.4)'}));
    g.appendChild(svgEl('rect',{x:0,y:0,width:NW,height:h,rx:8,fill:'#0d1628',stroke:clr,'stroke-width':1.5}));
    g.appendChild(svgEl('rect',{x:0,y:0,width:NW,height:HH,rx:8,fill:clr}));
    g.appendChild(svgEl('rect',{x:0,y:HH-8,width:NW,height:8,fill:clr}));
    // テーブルコメントをツールチップとして表示
    if(tableComments[name]){
      var ttip=document.createElementNS('http://www.w3.org/2000/svg','title');
      ttip.textContent=tableComments[name];
      g.appendChild(ttip);
    }
    var hdrHit=svgEl('rect',{x:0,y:0,width:NW,height:HH,fill:'transparent'});
    hdrHit.style.cursor='pointer';
    hdrHit.addEventListener('dblclick',function(){openEditModal(name);});
    g.appendChild(hdrHit);
    var ttl=svgEl('text',{x:12,y:HH-12,fill:'white','font-size':13,'font-weight':600,'font-family':'JetBrains Mono,monospace'});
    ttl.textContent=name;g.appendChild(ttl);
    // ダブルクリックヒント
    var hint=svgEl('title');hint.textContent='ダブルクリックで編集';g.appendChild(hint);
    // ✏はヘッダーダブルクリックで代替（ボタンは非表示）
    // トグルボタン（折りたたみ）- 目立つバッジ形式
    var isCollapsed=collapsedTables[name];
    var togLabel=isCollapsed?'+ 展開':'- 絞込';
    var togW=56,togH=17,togX=NW-togW-6,togY=(HH-togH)/2;
    var togBg=svgEl('rect',{x:togX,y:togY,width:togW,height:togH,rx:togH/2,
      fill:isCollapsed?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.1)',
      stroke:'rgba(255,255,255,0.4)','stroke-width':'1'});
    togBg.style.cursor='pointer';
    g.appendChild(togBg);
    var togTxt=svgEl('text',{x:togX+togW/2,y:togY+togH/2+1,fill:'white','font-size':10,'font-weight':600,
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
      if(i>0){var ln=svgEl('line',{x1:8,y1:y,x2:NW-8,y2:y,stroke:'#1e3356','stroke-width':'0.5'});g.appendChild(ln);}
      var bg=svgEl('rect',{x:1,y:y,width:NW-2,height:CH,fill:'transparent'});
      bg.addEventListener('mouseenter',function(){bg.setAttribute('fill','rgba(255,255,255,0.03)');});
      bg.addEventListener('mouseleave',function(){bg.setAttribute('fill','transparent');});
      g.appendChild(bg);
      var badge=col.pk&&col.fk?'🔑🔗':col.pk?'🔑':col.fk?'🔗':'';
      if(badge){var bt=svgEl('text',{x:10,y:y+17,'font-size':11,'font-family':'JetBrains Mono,monospace'});bt.textContent=badge;g.appendChild(bt);}
      var ct=svgEl('text',{x:badge.length>1?38:badge?24:12,y:y+17,fill:col.pk?'#fbbf24':col.fk?'#a78bfa':'#e2e8f0','font-size':11,'font-weight':col.pk?600:400,'font-family':'JetBrains Mono,monospace'});
      ct.textContent=col.name;g.appendChild(ct);
      var tt=svgEl('text',{x:NW-8,y:y+17,fill:'#4a6080','font-size':10,'text-anchor':'end','font-family':'JetBrains Mono,monospace'});
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
    var lineColor=isCrossDB?'#f87171':'#a78bfa';
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
      var t1=svgEl('text',{x:mx,y:my-gap/2-lineH/2,fill:'white','font-family':'JetBrains Mono,monospace','font-size':11,'font-weight':600,'text-anchor':'middle','dominant-baseline':'middle'});
      t1.textContent=fromTxt;el.appendChild(t1);
      el.appendChild(svgEl('rect',{x:mx-boxW/2,y:my+gap/2,width:boxW,height:lineH,rx:3,fill:toBg,stroke:toClr,'stroke-width':'1.5'}));
      var t2=svgEl('text',{x:mx,y:my+gap/2+lineH/2,fill:'white','font-family':'JetBrains Mono,monospace','font-size':11,'font-weight':500,'text-anchor':'middle','dominant-baseline':'middle'});
      t2.textContent=toTxt;el.appendChild(t2);
    }
  });
}

function drawIESymbol(cx,cy,angleDeg,type){
  var S='#a78bfa',W=1.8;
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

function resetAll(){
  if(Object.keys(tables).length&&!confirm('全てのテーブルをリセットしますか？'))return;
  tables={};relations=[];nodePos={};nodeCol={};tableComments={};historyStack=[];historyFuture=[];memos={};memoIdCounter=0;changeLog=[];databases={};tableDB={};
  nl.innerHTML='';el.innerHTML='';
  document.getElementById('emp').style.display='flex';
  document.getElementById('st-t').textContent='0';document.getElementById('st-r').textContent='0';
  document.getElementById('tblList').innerHTML='<div style="text-align:center;color:var(--text3);font-size:11px;padding-top:20px;line-height:1.9;">「＋ テーブル追加」または<br>ファイルを読み込んでください</div>';
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
  var t=document.getElementById('toast');t.textContent=msg;t.className='show '+(type||'');
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
    ['⊟ キーのみ','全テーブルをPK/FKのみ表示'],
    ['⊞ 全て展開','全テーブルを展開'],
    ['🏷 ラベル','リレーションラベルの表示切替'],
    ['⧉ ボタン','テーブルを複製'],
    ['📝 メモ','付箋メモをキャンバスに追加'],
    ['メモをダブルクリック','メモを編集・削除'],
    ['📋 ボタン','変更履歴を表示'],
    ['⊡ ボタン','全テーブルが見える位置に戻る'],
  ];
  var tbody=document.getElementById('scTable');
  if(!tbody)return;
  shortcuts.forEach(function(s,i){
    var tr=document.createElement('tr');
    tr.style.borderBottom='1px solid var(--border)';
    tr.innerHTML='<td style="padding:8px 4px;width:46%;"><span style="background:var(--surface2);border:1px solid var(--border2);border-radius:4px;padding:2px 8px;font-size:11px;color:var(--accent2);white-space:nowrap;">'+s[0]+'</span></td>'
      +'<td style="padding:8px 4px;color:var(--text2);font-size:12px;">'+s[1]+'</td>';
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
  showToast('↩ 元に戻しました');
}
function redo(){
  if(!historyFuture.length)return;
  historyStack.push(JSON.stringify({tables:tables,nodePos:nodePos,tableComments:tableComments}));
  var snap=JSON.parse(historyFuture.pop());
  tables=snap.tables;nodePos=snap.nodePos;tableComments=snap.tableComments||{};
  buildRels();renderAll();updateUndoRedoBtns();
  showToast('↪ やり直しました');
}
// ─── DB management ───────────────────────────────────────
var editingDB=null;
var DB_GROUP_PAD=30; // グループ枠のパディング

function openAddDBModal(){
  editingDB=null;
  document.getElementById('dbModalTitle').textContent='⊕ DBを追加';
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
    sw.dataset.color=c;
    sw.style.cssText='width:24px;height:24px;border-radius:4px;background:'+c+';cursor:pointer;border:2px solid '+(c===current?'white':'transparent')+';transition:border .1s;';
    if(c===current)sw.classList.add('db-sel');
    sw.addEventListener('click',function(){
      el.querySelectorAll('div').forEach(function(s){s.style.border='2px solid transparent';s.classList.remove('db-sel');});
      sw.style.border='2px solid white';sw.classList.add('db-sel');
    });
    el.appendChild(sw);
  });
  // 選択がなければ先頭を選択
  if(!current&&el.firstChild){el.firstChild.style.border='2px solid white';el.firstChild.classList.add('db-sel');}
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
    var nm=document.createElement('span');nm.style.cssText='flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';nm.textContent=n;
    // DB名バッジ（常に表示）
    var db=tableDB[n];
    item.appendChild(dot);item.appendChild(nm);
    if(db&&databases[db]){
      var dbBadge=document.createElement('span');
      var dbClr=databases[db].color;
      dbBadge.style.cssText='font-size:9px;padding:1px 6px;border-radius:99px;background:'+dbClr+';color:white;white-space:nowrap;flex-shrink:0;max-width:64px;overflow:hidden;text-overflow:ellipsis;';
      dbBadge.textContent=db;
      dbBadge.title=db;
      item.appendChild(dbBadge);
    }
    var dupB=document.createElement('button');dupB.className='tbl-edit';dupB.textContent='⧉';
    (function(tn){dupB.onclick=function(e){e.stopPropagation();duplicateTable(tn);};})(n);
    var editB=document.createElement('button');editB.className='tbl-edit';editB.textContent='✏';
    (function(tn){editB.onclick=function(e){e.stopPropagation();openEditModal(tn);};})(n);
    var cnt=document.createElement('span');cnt.className='tbl-cnt';cnt.textContent=cols.length;
    item.appendChild(dupB);item.appendChild(editB);item.appendChild(cnt);
    (function(tn){item.onclick=function(){focusTable(tn);};})(n);
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
    var dbHdr=document.createElement('div');
    dbHdr.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:5px;font-size:11px;font-weight:600;color:white;background:'+dbClr+';margin-bottom:4px;cursor:pointer;';
    var s1=document.createElement('span');s1.style.flex='1';s1.textContent='🗄 '+dbName;
    var s2=document.createElement('span');s2.style.cssText='font-size:10px;opacity:.7;';s2.textContent=items.length+' tables';
    var eb=document.createElement('button');eb.style.cssText='background:transparent;border:none;color:rgba(255,255,255,.6);cursor:pointer;font-size:11px;padding:0 2px;';eb.textContent='✏';
    (function(dn){eb.onclick=function(e){e.stopPropagation();openEditDBModal(dn);};})(dbName);
    dbHdr.appendChild(s1);dbHdr.appendChild(s2);dbHdr.appendChild(eb);
    listEl.appendChild(dbHdr);
    items.forEach(function(it){
      if(!matchesQuery(it.name,it.cols))return;
      listEl.appendChild(makeTblItem(it.name,it.cols,true));
    });
    if(items.length)listEl.appendChild(Object.assign(document.createElement('div'),{style:'height:6px;'}));
  });

  var noneItems=grouped['__none__']||[];
  if(noneItems.length){
    var noneHdr=document.createElement('div');
    noneHdr.style.cssText='font-size:9px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;padding:4px 8px;';
    noneHdr.textContent='未分類';
    listEl.appendChild(noneHdr);
    noneItems.forEach(function(it){
      if(!matchesQuery(it.name,it.cols))return;
      listEl.appendChild(makeTblItem(it.name,it.cols,false));
    });
  }
  if(!Object.keys(tables).length){
    listEl.innerHTML='<div style="text-align:center;color:var(--text3);font-size:11px;padding-top:20px;line-height:1.9;">「＋ テーブル追加」または<br>ファイルを読み込んでください</div>';
  }
}

// ─── Color picker ────────────────────────────────────────
var CP_COLORS=['#1e40af','#164e63','#14532d','#3b0764','#78350f','#0c4a6e','#065f46','#4c1d95','#7c2d12','#1e3a5f','#831843','#365314'];
function initColorPicker(current){
  var el=document.getElementById('colorPicker');
  if(!el)return;
  el.innerHTML='';
  CP_COLORS.forEach(function(c){
    var sw=document.createElement('div');
    sw.className='cp-swatch'+(c===current?' selected':'');
    sw.dataset.color=c;
    sw.style.cssText='width:20px;height:20px;border-radius:4px;background:'+c+';cursor:pointer;border:2px solid '+(c===current?'white':'transparent')+';transition:border .1s;';
    sw.addEventListener('click',function(){
      el.querySelectorAll('.cp-swatch').forEach(function(s){s.style.border='2px solid transparent';s.classList.remove('selected');});
      sw.style.border='2px solid white';sw.classList.add('selected');
    });
    el.appendChild(sw);
  });
}

// ─── Memo nodes ───────────────────────────────────────────
var MEMO_COLORS=['#78350f','#14532d','#1e3a5f','#4c1d95','#831843'];
function initMemoColorPicker(current){
  var el=document.getElementById('memoColorPicker');
  if(!el)return;
  el.innerHTML='';
  MEMO_COLORS.forEach(function(c){
    var sw=document.createElement('div');
    sw.className='mc-swatch'+(c===current?' selected':'');
    sw.dataset.color=c;
    sw.style.cssText='width:24px;height:24px;border-radius:4px;background:'+c+';cursor:pointer;border:2px solid '+(c===current?'white':'transparent')+';';
    sw.addEventListener('click',function(){
      el.querySelectorAll('.mc-swatch').forEach(function(s){s.style.border='2px solid transparent';s.classList.remove('selected');});
      sw.style.border='2px solid white';sw.classList.add('selected');
    });
    el.appendChild(sw);
  });
}

function addMemo(){
  editingMemoId=null;
  document.getElementById('memoModalTitle').textContent='📝 メモを追加';
  document.getElementById('memoText').value='';
  document.getElementById('memoDeleteBtn').style.display='none';
  initMemoColorPicker(MEMO_COLORS[0]);
  document.getElementById('memoModal').classList.add('open');
  setTimeout(function(){document.getElementById('memoText').focus();},150);
}

function editMemo(id){
  var m=memos[id];if(!m)return;
  editingMemoId=id;
  document.getElementById('memoModalTitle').textContent='📝 メモを編集';
  document.getElementById('memoText').value=m.text;
  document.getElementById('memoDeleteBtn').style.display='flex';
  initMemoColorPicker(m.color||MEMO_COLORS[0]);
  document.getElementById('memoModal').classList.add('open');
}

function saveMemo(){
  var text=document.getElementById('memoText').value.trim();
  if(!text){showToast('メモを入力してください','error');return;}
  var sw=document.querySelector('#memoColorPicker .mc-swatch.selected');
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
  Object.entries(memos).forEach(function(e){
    var id=e[0],m=e[1];
    var MW=160,MH=Math.max(60,Math.ceil(m.text.length/18)*18+28);
    var g=svgEl('g',{class:'memo-node',transform:'translate('+m.x+','+m.y+')'});
    g.style.cursor='grab';
    // 影
    g.appendChild(svgEl('rect',{x:4,y:4,width:MW,height:MH,rx:4,fill:'rgba(0,0,0,0.35)'}));
    // 本体
    g.appendChild(svgEl('rect',{x:0,y:0,width:MW,height:MH,rx:4,fill:m.color||MEMO_COLORS[0],opacity:'0.92'}));
    // 折り目（右上三角）
    var fold=svgEl('polygon',{points:(MW-12)+',0 '+MW+',0 '+MW+',12',fill:'rgba(0,0,0,0.25)'});
    g.appendChild(fold);
    // テキスト（折り返し）
    var words=m.text;
    var lines=[],cur='',chars=words.split('');
    chars.forEach(function(ch){cur+=ch;if(cur.length>=18){lines.push(cur);cur='';}});
    if(cur)lines.push(cur);
    lines.forEach(function(line,i){
      var t=svgEl('text',{x:10,y:22+i*18,fill:'rgba(255,255,255,0.92)','font-size':12,'font-family':'sans-serif'});
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
      title: '📸 画像・スクショからJSONを生成',
      desc: 'DBの設計書・既存テーブルのスクショをClaudeに見せて生成',
      text: 'この画像に含まれるテーブル定義を、以下のJSONフォーマットで出力してください。コードブロックなしのJSONのみ返してください。\n\nフォーマット：\n' + FORMAT_EXAMPLE
    },
    {
      title: '💬 テキストの仕様からJSONを生成',
      desc: '「usersテーブルにはid, name, emailがあって...」のような説明から生成',
      text: '以下のテーブル仕様を、このJSONフォーマットで出力してください。コードブロックなしのJSONのみ返してください。\n\nフォーマット：\n' + FORMAT_EXAMPLE + '\n\n仕様：\n（ここに仕様を書いてください）'
    },
    {
      title: '🔧 既存のJSONを修正・追加',
      desc: '今開いているデータをClaudeに渡して修正してもらう',
      text: currentJSON
        ? '以下のER図JSONに、（修正内容を書いてください）を追加・修正してください。同じJSONフォーマットで、コードブロックなしのJSONのみ返してください。\n\n現在のJSON：\n' + currentJSON
        : '（先にテーブルを読み込んでください）'
    },
    {
      title: '📋 DDLからJSONを生成',
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
    el.innerHTML='<div style="color:var(--text3);font-size:12px;text-align:center;padding:20px;">変更履歴はまだありません</div>';
  }else{
    el.innerHTML=changeLog.map(function(c){
      return '<div style="display:grid;grid-template-columns:140px auto 1fr;gap:8px;align-items:center;padding:7px 8px;background:var(--bg);border:1px solid var(--border);border-radius:5px;font-size:11px;">'
        +'<span style="color:var(--text3);">'+c.time+'</span>'
        +'<span style="background:var(--accent);color:white;padding:1px 8px;border-radius:99px;font-size:10px;white-space:nowrap;">'+c.action+'</span>'
        +'<span style="color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+c.detail+'</span>'
        +'</div>';
    }).join('');
  }
  document.getElementById('historyModal').classList.add('open');
}

// ─── Label toggle ─────────────────────────────────────────
function toggleLabels(){
  showLabels=!showLabels;
  var item=document.getElementById('labelItem');
  if(item)item.style.color=showLabels?'var(--accent2)':'';
  renderEdges();
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
  var item=document.getElementById('collapseItem');
  if(item)item.textContent=anyExpanded?'⊞ 全て展開':'⊟ キーのみ表示';
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

// ─── Theme ───────────────────────────────────────────────
function toggleTheme(){
  document.body.classList.toggle('light-theme');
  var item=document.getElementById('themeItem');
  if(item)item.textContent=document.body.classList.contains('light-theme')?'☀️ ライトモード':'🌙 ダークモード';
}

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
    showLabels:showLabels
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
  if(state.tf){tf.x=state.tf.x;tf.y=state.tf.y;tf.scale=state.tf.scale;}
  historyStack=[];historyFuture=[];
  buildRels();applyTf();renderAll();updateUndoRedoBtns();
}

function clearERState(){
  tables={};relations=[];nodePos={};nodeCol={};
  tableComments={};databases={};tableDB={};
  memos={};memoIdCounter=0;collapsedTables={};
  changeLog=[];historyStack=[];historyFuture=[];
  tf={x:40,y:40,scale:1};showLabels=true;
  nl.innerHTML='';el.innerHTML='';
  if(dbGroupLayer)dbGroupLayer.innerHTML='';
  applyTf();updateUndoRedoBtns();
  document.getElementById('emp').style.display='flex';
  document.getElementById('st-t').textContent='0';
  document.getElementById('st-r').textContent='0';
  document.getElementById('tblList').innerHTML='<div style="text-align:center;color:var(--text3);font-size:11px;padding-top:20px;line-height:1.9;">「＋ テーブル追加」または<br>ファイルを読み込んでください</div>';
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
  var proj=projectList[currentProjectId];
  var nameEl=document.getElementById('projCurrentName');
  if(nameEl)nameEl.textContent=proj?proj.name:'untitled';
  renderProjectDropdownList();
}

function toggleProjectDropdown(){
  var sel=document.querySelector('.proj-selector');
  if(sel.classList.contains('open')){closeProjectDropdown();}
  else{sel.classList.add('open');renderProjectDropdownList();}
}

function closeProjectDropdown(){
  var sel=document.querySelector('.proj-selector');
  if(sel)sel.classList.remove('open');
}

function renderProjectDropdownList(){
  var list=document.getElementById('projDropdownList');
  if(!list)return;
  list.innerHTML='';
  var sorted=Object.entries(projectList).sort(function(a,b){return(b[1].updatedAt||'').localeCompare(a[1].updatedAt||'');});
  sorted.forEach(function(e){
    var id=e[0],proj=e[1];
    var item=document.createElement('div');
    item.className='proj-item'+(id===currentProjectId?' active':'');
    var name=document.createElement('span');name.className='proj-item-name';name.textContent=proj.name;
    var info=document.createElement('span');info.className='proj-item-info';info.textContent=(proj.tableCount||0)+' tables';
    item.appendChild(name);item.appendChild(info);
    (function(pid){item.onclick=function(){switchProject(pid,false);};})(id);
    list.appendChild(item);
  });
}

function openProjectManager(){
  closeProjectDropdown();
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
    var icon=document.createElement('span');icon.textContent=id===currentProjectId?'📂':'📄';icon.style.fontSize='16px';
    // 名前
    var name=document.createElement('span');name.className='proj-mgr-name';name.textContent=proj.name;
    // メタ
    var meta=document.createElement('span');meta.className='proj-mgr-meta';
    var d=proj.updatedAt?new Date(proj.updatedAt):new Date();
    meta.textContent=(proj.tableCount||0)+' tables / '+d.toLocaleDateString('ja-JP');
    // ボタン群
    var btnRename=document.createElement('button');btnRename.className='proj-mgr-btn';btnRename.textContent='✏ 名前変更';
    (function(pid){btnRename.onclick=function(){renameProject(pid);};})(id);
    var btnDup=document.createElement('button');btnDup.className='proj-mgr-btn';btnDup.textContent='⧉ 複製';
    (function(pid){btnDup.onclick=function(){duplicateProject(pid);};})(id);
    var btnDel=document.createElement('button');btnDel.className='proj-mgr-btn del';btnDel.textContent='🗑';
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

// Close project dropdown on outside click
document.addEventListener('click',function(e){
  if(!e.target.closest('.proj-selector')&&!e.target.closest('#projModal')){
    closeProjectDropdown();
  }
});

// Escape key also closes project modal
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    closeProjectDropdown();
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
    if(!raw)return '<div class="erd-thumb-empty">⬡</div>';
    var state=JSON.parse(raw);
    var tbls=state.tables||{};
    var pos=state.nodePos||{};
    var col=state.nodeCol||{};
    var ids=Object.keys(tbls);
    if(ids.length===0)return '<div class="erd-thumb-empty">⬡</div>';
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
    if(w<=0||h<=0)return '<div class="erd-thumb-empty">⬡</div>';
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
  }catch(e){return '<div class="erd-thumb-empty">⬡</div>';}
}

function renderPSSList(){
  var list=document.getElementById('pssProjectList');
  if(!list)return;
  list.innerHTML='';
  var sorted=Object.entries(projectList).sort(function(a,b){return(b[1].updatedAt||'').localeCompare(a[1].updatedAt||'');});
  if(!sorted.length){
    list.innerHTML='<div class="app-empty">'
      +'<div class="app-empty-icon">⬡</div>'
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
      +'<button class="app-card-btn rename-btn" title="名前変更">✏</button>'
      +'<button class="app-card-btn danger del-btn" title="削除">🗑</button>'
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

// ヘッダーロゴクリックでプロジェクト選択画面に戻る
document.querySelector('.logo').addEventListener('click',function(){
  if(currentProjectId)autoSaveNow();
  showProjectSelectScreen();
});
document.querySelector('.logo').style.cursor='pointer';

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
  // ヘッダーとプロジェクト選択画面の両方にマウント（同時表示はされないので両方に置いてOK）
  var headerMount=document.getElementById('sync-mount');
  var pssMount=document.getElementById('pss-sync-mount');
  if(headerMount) window.driveSync.mountUI(headerMount);
  if(pssMount) window.driveSync.mountUI(pssMount);
  window.driveSync.init();
}

function initTheme(){
  if(!window.theme) return;
  ['theme-mount','pss-theme-mount'].forEach(function(id){
    var m=document.getElementById(id);
    if(m) window.theme.mountUI(m);
  });
}

initProjects();
initTheme();
initDriveSync();
