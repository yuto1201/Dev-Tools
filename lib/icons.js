// =============================================================
// lib/icons.js — SVG アイコンレジストリ
//
// 24×24 viewBox、ストロークベース、stroke-width 2、
// round linecap/linejoin のミニマルモノラインアイコン。
//
// 使い方:
//   const svg = yutoIcons.toSVG('search', { size: 20, class: 'my-cls' });
//   const el  = yutoIcons.toElement('search', { size: 20 });
//   const all = yutoIcons.list();        // [{name,category,tags,ja,path}]
//   const cats = yutoIcons.categories(); // ['tool','nav',...]
// =============================================================

;(function(root){
  'use strict';

  var icons = [

    // ========== Tool ===========================================
    { name:'database',     category:'tool', tags:['er','db','table','data'], ja:['データベース','テーブル','DB'],
      path:'<path d="M3 6c0-1.66 4.03-3 9-3s9 1.34 9 3M3 6v4c0 1.66 4.03 3 9 3s9-1.34 9-3V6M3 10v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4M3 14v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4"/>' },

    { name:'smartphone',   category:'tool', tags:['mobile','phone','app','device'], ja:['スマホ','携帯','モバイル','端末'],
      path:'<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>' },

    { name:'tablet',       category:'tool', tags:['ipad','device','screen'], ja:['タブレット','画面'],
      path:'<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>' },

    { name:'monitor',      category:'tool', tags:['screen','display','desktop','pc'], ja:['モニター','画面','パソコン','デスクトップ'],
      path:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },

    { name:'laptop',       category:'tool', tags:['computer','notebook','pc'], ja:['ノートパソコン','PC','ラップトップ'],
      path:'<path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16"/>' },

    { name:'sparkles',     category:'tool', tags:['particle','star','magic','effect'], ja:['キラキラ','パーティクル','魔法','エフェクト'],
      path:'<path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/><path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/><path d="M4 16l.5 1.5L6 18l-1.5.5L4 20l-.5-1.5L2 18l1.5-.5L4 16z"/>' },

    { name:'code',         category:'tool', tags:['parser','decode','dev','bracket','html'], ja:['コード','開発','パーサー','括弧'],
      path:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },

    { name:'code-2',       category:'tool', tags:['snippet','script','programming'], ja:['コード','スニペット','プログラミング'],
      path:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>' },

    { name:'palette',      category:'tool', tags:['design','color','art','paint'], ja:['パレット','色','デザイン','塗る'],
      path:'<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.49-9-10-9z"/>' },

    { name:'file-text',    category:'tool', tags:['text','document','counter','note'], ja:['テキスト','ファイル','文書','メモ'],
      path:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>' },

    { name:'grid-3x3',     category:'tool', tags:['icon','gallery','grid','layout'], ja:['グリッド','アイコン','一覧','ギャラリー'],
      path:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },

    { name:'cpu',          category:'tool', tags:['processor','chip','hardware'], ja:['CPU','プロセッサ','チップ'],
      path:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>' },

    { name:'server',       category:'tool', tags:['hosting','backend','rack'], ja:['サーバー','ホスティング','バックエンド'],
      path:'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>' },

    { name:'hard-drive',   category:'tool', tags:['disk','storage','hdd','ssd'], ja:['ハードディスク','ストレージ','ディスク'],
      path:'<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>' },

    { name:'wifi',         category:'tool', tags:['wireless','network','internet','signal'], ja:['WiFi','無線','ネットワーク','電波'],
      path:'<path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>' },

    { name:'bluetooth',    category:'tool', tags:['wireless','connect','pair'], ja:['ブルートゥース','無線','接続'],
      path:'<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>' },

    { name:'battery',      category:'tool', tags:['power','charge','energy'], ja:['バッテリー','電池','充電'],
      path:'<rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/>' },

    { name:'plug',         category:'tool', tags:['power','connect','electric'], ja:['プラグ','電源','接続'],
      path:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 01-12 0V8z"/>' },

    // ========== Navigation =====================================
    { name:'arrow-left',      category:'nav', tags:['back','prev','return'], ja:['左','戻る','前'],
      path:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>' },

    { name:'arrow-right',     category:'nav', tags:['next','forward'], ja:['右','次','進む'],
      path:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' },

    { name:'arrow-up',        category:'nav', tags:['top','up'], ja:['上','トップ'],
      path:'<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>' },

    { name:'arrow-down',      category:'nav', tags:['bottom','down'], ja:['下','ボトム'],
      path:'<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>' },

    { name:'arrow-up-right',  category:'nav', tags:['external','open','link'], ja:['外部','リンク','開く'],
      path:'<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>' },

    { name:'arrow-down-left', category:'nav', tags:['internal','back'], ja:['内部','戻る'],
      path:'<line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/>' },

    { name:'corner-up-left',  category:'nav', tags:['reply','undo','back'], ja:['返信','元に戻す'],
      path:'<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/>' },

    { name:'corner-up-right', category:'nav', tags:['forward','redirect'], ja:['転送','リダイレクト'],
      path:'<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/>' },

    { name:'rotate-cw',       category:'nav', tags:['redo','clockwise','repeat'], ja:['やり直す','時計回り','リピート'],
      path:'<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>' },

    { name:'rotate-ccw',      category:'nav', tags:['undo','counterclockwise','back'], ja:['元に戻す','反時計回り'],
      path:'<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>' },

    { name:'chevron-left',    category:'nav', tags:['prev','collapse'], ja:['前','閉じる'],
      path:'<polyline points="15 18 9 12 15 6"/>' },

    { name:'chevron-right',   category:'nav', tags:['next','expand'], ja:['次','開く'],
      path:'<polyline points="9 18 15 12 9 6"/>' },

    { name:'chevron-down',    category:'nav', tags:['dropdown','expand'], ja:['下','ドロップダウン','開く'],
      path:'<polyline points="6 9 12 15 18 9"/>' },

    { name:'chevron-up',      category:'nav', tags:['collapse','up'], ja:['上','閉じる'],
      path:'<polyline points="18 15 12 9 6 15"/>' },

    { name:'chevrons-left',   category:'nav', tags:['first','rewind','skip'], ja:['最初','巻き戻し'],
      path:'<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>' },

    { name:'chevrons-right',  category:'nav', tags:['last','fast-forward','skip'], ja:['最後','早送り'],
      path:'<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>' },

    { name:'home',            category:'nav', tags:['house','top','main'], ja:['ホーム','家','トップ'],
      path:'<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-2 0h2"/>' },

    { name:'menu',            category:'nav', tags:['hamburger','sidebar','list'], ja:['メニュー','ハンバーガー','サイドバー'],
      path:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>' },

    { name:'x',               category:'nav', tags:['close','cancel','remove','delete'], ja:['閉じる','キャンセル','削除','バツ'],
      path:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' },

    { name:'more-horizontal', category:'nav', tags:['dots','menu','options'], ja:['その他','メニュー','オプション'],
      path:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>' },

    { name:'more-vertical',   category:'nav', tags:['dots','menu','options'], ja:['その他','メニュー','縦'],
      path:'<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>' },

    { name:'sidebar',         category:'nav', tags:['panel','drawer','layout'], ja:['サイドバー','パネル'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>' },

    { name:'log-in',          category:'nav', tags:['signin','enter','auth'], ja:['ログイン','サインイン','入る'],
      path:'<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>' },

    { name:'log-out',         category:'nav', tags:['signout','exit','leave'], ja:['ログアウト','サインアウト','出る'],
      path:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>' },

    // ========== Action =========================================
    { name:'plus',          category:'action', tags:['add','create','new'], ja:['追加','作成','新規','プラス'],
      path:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' },

    { name:'plus-circle',   category:'action', tags:['add','create','new'], ja:['追加','作成','新規'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>' },

    { name:'minus',         category:'action', tags:['remove','subtract'], ja:['削除','マイナス','引く'],
      path:'<line x1="5" y1="12" x2="19" y2="12"/>' },

    { name:'minus-circle',  category:'action', tags:['remove','subtract'], ja:['削除','マイナス'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>' },

    { name:'edit',          category:'action', tags:['pencil','write','modify'], ja:['編集','書く','変更','鉛筆'],
      path:'<path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>' },

    { name:'edit-2',        category:'action', tags:['pencil','write','rename'], ja:['編集','書く','名前変更'],
      path:'<path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><line x1="15" y1="5" x2="19" y2="9"/>' },

    { name:'trash',         category:'action', tags:['delete','remove','bin'], ja:['ゴミ箱','削除','除去'],
      path:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>' },

    { name:'copy',          category:'action', tags:['duplicate','clipboard','paste'], ja:['コピー','複製','貼り付け'],
      path:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>' },

    { name:'scissors',      category:'action', tags:['cut','trim','crop'], ja:['ハサミ','切る','切り取り'],
      path:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>' },

    { name:'download',      category:'action', tags:['save','export','get'], ja:['ダウンロード','保存','エクスポート'],
      path:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>' },

    { name:'upload',        category:'action', tags:['import','send','put'], ja:['アップロード','インポート','送信'],
      path:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>' },

    { name:'save',          category:'action', tags:['floppy','store','disk'], ja:['保存','フロッピー','ディスク'],
      path:'<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>' },

    { name:'search',        category:'action', tags:['find','magnify','look'], ja:['検索','探す','虫眼鏡','ルーペ'],
      path:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },

    { name:'refresh',       category:'action', tags:['reload','sync','update'], ja:['更新','リロード','同期','リフレッシュ'],
      path:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>' },

    { name:'check',         category:'action', tags:['done','ok','confirm','success'], ja:['完了','確認','チェック','OK'],
      path:'<polyline points="20 6 9 17 4 12"/>' },

    { name:'x-circle',      category:'action', tags:['close','cancel','error','deny'], ja:['閉じる','キャンセル','エラー','拒否'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' },

    { name:'external-link', category:'action', tags:['open','new-window','external'], ja:['外部リンク','新しいウィンドウ'],
      path:'<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>' },

    { name:'share',         category:'action', tags:['send','social','export'], ja:['共有','シェア','送る','SNS'],
      path:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' },

    { name:'share-2',       category:'action', tags:['send','forward','ios'], ja:['共有','転送','シェア'],
      path:'<polyline points="8 12 12 8 16 12"/><line x1="12" y1="8" x2="12" y2="20"/><path d="M20 14v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"/>' },

    { name:'clipboard',     category:'action', tags:['copy','paste','board'], ja:['クリップボード','貼り付け'],
      path:'<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>' },

    { name:'clipboard-check',category:'action', tags:['done','task','complete'], ja:['完了','タスク','チェック済み'],
      path:'<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><polyline points="16 12 10.5 17 8 14.5"/>' },

    { name:'zoom-in',       category:'action', tags:['magnify','enlarge','plus'], ja:['拡大','ズームイン'],
      path:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>' },

    { name:'zoom-out',      category:'action', tags:['shrink','minus'], ja:['縮小','ズームアウト'],
      path:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>' },

    { name:'send',          category:'action', tags:['submit','message','paper-plane'], ja:['送信','メッセージ','紙飛行機'],
      path:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' },

    { name:'printer',       category:'action', tags:['print','output','paper'], ja:['プリンター','印刷','出力'],
      path:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>' },

    { name:'power',         category:'action', tags:['on','off','shutdown','toggle'], ja:['電源','オンオフ','シャットダウン'],
      path:'<path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>' },

    { name:'repeat',        category:'action', tags:['loop','cycle','reload'], ja:['繰り返し','ループ','リピート'],
      path:'<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>' },

    { name:'shuffle',       category:'action', tags:['random','mix'], ja:['シャッフル','ランダム','混ぜる'],
      path:'<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>' },

    { name:'sliders',       category:'action', tags:['settings','control','adjust'], ja:['スライダー','設定','調整'],
      path:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>' },

    { name:'toggle-left',   category:'action', tags:['switch','off','disable'], ja:['トグル','スイッチ','オフ'],
      path:'<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3"/>' },

    { name:'toggle-right',  category:'action', tags:['switch','on','enable'], ja:['トグル','スイッチ','オン'],
      path:'<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3"/>' },

    // ========== UI / Status ====================================
    { name:'sun',            category:'ui', tags:['light','day','theme','bright'], ja:['太陽','ライト','明るい','テーマ'],
      path:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' },

    { name:'moon',           category:'ui', tags:['dark','night','theme'], ja:['月','ダーク','暗い','テーマ'],
      path:'<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>' },

    { name:'eye',            category:'ui', tags:['view','show','visible','preview'], ja:['目','表示','見る','プレビュー'],
      path:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },

    { name:'eye-off',        category:'ui', tags:['hide','hidden','invisible'], ja:['非表示','隠す','見えない'],
      path:'<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>' },

    { name:'settings',      category:'ui', tags:['gear','cog','config','preferences'], ja:['設定','歯車','環境設定'],
      path:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>' },

    { name:'info',           category:'ui', tags:['information','help','about'], ja:['情報','ヘルプ','について'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' },

    { name:'help-circle',    category:'ui', tags:['question','faq','support'], ja:['ヘルプ','質問','サポート','はてな'],
      path:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },

    { name:'alert-triangle', category:'ui', tags:['warning','caution','danger'], ja:['警告','注意','危険','三角'],
      path:'<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },

    { name:'alert-circle',  category:'ui', tags:['error','problem','issue'], ja:['エラー','問題','注意'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },

    { name:'check-circle',  category:'ui', tags:['success','done','ok','confirm'], ja:['成功','完了','OK','確認'],
      path:'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },

    { name:'check-square',  category:'ui', tags:['checkbox','todo','task'], ja:['チェックボックス','タスク','完了'],
      path:'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>' },

    { name:'square',        category:'ui', tags:['checkbox','unchecked','empty'], ja:['四角','チェックなし','空'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/>' },

    { name:'circle',        category:'ui', tags:['radio','dot','shape'], ja:['丸','ラジオ','図形'],
      path:'<circle cx="12" cy="12" r="10"/>' },

    { name:'filter',        category:'ui', tags:['funnel','sort','refine'], ja:['フィルター','絞り込み','漏斗'],
      path:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' },

    { name:'sort',          category:'ui', tags:['order','arrange','list'], ja:['並び替え','ソート','順序'],
      path:'<line x1="4" y1="6" x2="13" y2="6"/><line x1="4" y1="12" x2="10" y2="12"/><line x1="4" y1="18" x2="7" y2="18"/><polyline points="17 10 20 6 23 10"/><line x1="20" y1="6" x2="20" y2="18"/>' },

    { name:'loader',        category:'ui', tags:['loading','spinner','wait'], ja:['読み込み','スピナー','待機','ローディング'],
      path:'<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>' },

    { name:'shield',        category:'ui', tags:['secure','protect','safety'], ja:['シールド','セキュリティ','保護','安全'],
      path:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },

    { name:'shield-check',  category:'ui', tags:['verified','secure','safe'], ja:['認証済み','安全','保護済み'],
      path:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>' },

    { name:'thumbs-up',     category:'ui', tags:['like','approve','good'], ja:['いいね','承認','良い','高評価'],
      path:'<path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>' },

    { name:'thumbs-down',   category:'ui', tags:['dislike','reject','bad'], ja:['低評価','却下','悪い'],
      path:'<path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>' },

    { name:'flag',          category:'ui', tags:['report','mark','milestone'], ja:['フラグ','旗','報告','マイルストーン'],
      path:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>' },

    { name:'activity',      category:'ui', tags:['pulse','health','graph'], ja:['アクティビティ','脈拍','グラフ','心拍'],
      path:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },

    { name:'bar-chart',     category:'ui', tags:['graph','statistics','analytics'], ja:['棒グラフ','統計','分析'],
      path:'<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>' },

    { name:'pie-chart',     category:'ui', tags:['graph','statistics','analytics'], ja:['円グラフ','統計','分析'],
      path:'<path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/>' },

    { name:'trending-up',   category:'ui', tags:['growth','increase','up'], ja:['上昇','成長','増加','トレンド'],
      path:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>' },

    { name:'trending-down', category:'ui', tags:['decline','decrease','down'], ja:['下降','減少','低下'],
      path:'<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>' },

    // ========== Content / Object ===============================
    { name:'file',          category:'content', tags:['document','page','blank'], ja:['ファイル','文書','ページ'],
      path:'<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>' },

    { name:'file-plus',     category:'content', tags:['new','add','create'], ja:['新規ファイル','追加','作成'],
      path:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>' },

    { name:'file-minus',    category:'content', tags:['remove','delete'], ja:['ファイル削除','除去'],
      path:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>' },

    { name:'folder',        category:'content', tags:['directory','project'], ja:['フォルダ','ディレクトリ','プロジェクト'],
      path:'<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>' },

    { name:'folder-plus',   category:'content', tags:['new','add','create'], ja:['新規フォルダ','追加'],
      path:'<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>' },

    { name:'image',         category:'content', tags:['photo','picture','media'], ja:['画像','写真','メディア'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' },

    { name:'video',         category:'content', tags:['movie','film','camera'], ja:['動画','映像','ビデオ','カメラ'],
      path:'<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>' },

    { name:'music',         category:'content', tags:['audio','sound','note'], ja:['音楽','オーディオ','音符'],
      path:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },

    { name:'mic',           category:'content', tags:['microphone','record','voice'], ja:['マイク','録音','音声'],
      path:'<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>' },

    { name:'volume',        category:'content', tags:['sound','audio','speaker'], ja:['音量','スピーカー','音声'],
      path:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>' },

    { name:'volume-off',    category:'content', tags:['mute','silent','no-sound'], ja:['ミュート','消音','無音'],
      path:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>' },

    { name:'camera',        category:'content', tags:['photo','capture','screenshot'], ja:['カメラ','撮影','スクリーンショット'],
      path:'<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>' },

    { name:'link',          category:'content', tags:['url','chain','connect'], ja:['リンク','URL','チェーン','接続'],
      path:'<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>' },

    { name:'unlink',        category:'content', tags:['disconnect','break','detach'], ja:['リンク解除','切断'],
      path:'<path d="M18.84 12.25l1.72-1.71a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M5.16 11.75l-1.72 1.71a5 5 0 007.07 7.07l1.72-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/>' },

    { name:'layers',        category:'content', tags:['stack','overlap','depth'], ja:['レイヤー','重ねる','階層'],
      path:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },

    { name:'tag',           category:'content', tags:['label','category','mark'], ja:['タグ','ラベル','カテゴリ','印'],
      path:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>' },

    { name:'bookmark',      category:'content', tags:['save','favorite','mark'], ja:['ブックマーク','お気に入り','保存'],
      path:'<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>' },

    { name:'heart',         category:'content', tags:['like','love','favorite'], ja:['ハート','いいね','お気に入り','好き'],
      path:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' },

    { name:'star',          category:'content', tags:['rating','favorite','feature'], ja:['星','評価','お気に入り'],
      path:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },

    { name:'clock',         category:'content', tags:['time','history','schedule'], ja:['時計','時間','履歴','スケジュール'],
      path:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },

    { name:'calendar',      category:'content', tags:['date','schedule','event'], ja:['カレンダー','日付','予定','イベント'],
      path:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },

    { name:'user',          category:'content', tags:['person','account','profile'], ja:['ユーザー','人','アカウント','プロフィール'],
      path:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },

    { name:'users',         category:'content', tags:['people','team','group'], ja:['ユーザー','チーム','グループ','人々'],
      path:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },

    { name:'user-plus',     category:'content', tags:['add','invite','new'], ja:['ユーザー追加','招待','新規'],
      path:'<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>' },

    { name:'lock',          category:'content', tags:['secure','private','password'], ja:['ロック','鍵','セキュリティ','パスワード'],
      path:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>' },

    { name:'unlock',        category:'content', tags:['open','public','access'], ja:['アンロック','解錠','公開'],
      path:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/>' },

    { name:'cloud',         category:'content', tags:['storage','sync','online'], ja:['クラウド','同期','オンライン'],
      path:'<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>' },

    { name:'cloud-upload',  category:'content', tags:['upload','sync','backup'], ja:['アップロード','同期','バックアップ'],
      path:'<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>' },

    { name:'cloud-download',category:'content', tags:['download','sync','restore'], ja:['ダウンロード','同期','復元'],
      path:'<polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"/>' },

    { name:'mail',          category:'content', tags:['email','message','envelope'], ja:['メール','手紙','封筒','メッセージ'],
      path:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>' },

    { name:'message-square',category:'content', tags:['chat','comment','speech'], ja:['チャット','コメント','吹き出し','メッセージ'],
      path:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>' },

    { name:'message-circle',category:'content', tags:['chat','comment','bubble'], ja:['チャット','コメント','バブル'],
      path:'<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>' },

    { name:'bell',          category:'content', tags:['notification','alert','ring'], ja:['通知','ベル','お知らせ','アラート'],
      path:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>' },

    { name:'globe',         category:'content', tags:['world','web','international','language'], ja:['地球','ウェブ','国際','言語','世界'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>' },

    { name:'map',           category:'content', tags:['location','geography','navigation'], ja:['地図','マップ','場所','ナビ'],
      path:'<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>' },

    { name:'map-pin',       category:'content', tags:['location','place','marker'], ja:['ピン','位置','マーカー','場所'],
      path:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>' },

    { name:'navigation',    category:'content', tags:['compass','direction','north'], ja:['ナビゲーション','方角','コンパス'],
      path:'<polygon points="3 11 22 2 13 21 11 13 3 11"/>' },

    { name:'terminal',      category:'content', tags:['console','cli','shell','command'], ja:['ターミナル','コンソール','コマンド','シェル'],
      path:'<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>' },

    { name:'hash',          category:'content', tags:['number','id','tag','pound'], ja:['ハッシュ','番号','シャープ','ナンバー'],
      path:'<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>' },

    { name:'at-sign',       category:'content', tags:['email','mention','address'], ja:['アットマーク','メール','メンション'],
      path:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/>' },

    { name:'box',           category:'content', tags:['package','product','cube'], ja:['ボックス','パッケージ','箱','立方体'],
      path:'<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>' },

    { name:'gift',          category:'content', tags:['present','reward','surprise'], ja:['ギフト','プレゼント','贈り物'],
      path:'<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>' },

    { name:'zap',           category:'content', tags:['lightning','power','energy','fast'], ja:['雷','電力','エネルギー','高速'],
      path:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },

    { name:'layout',        category:'content', tags:['template','page','dashboard'], ja:['レイアウト','テンプレート','ダッシュボード'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>' },

    { name:'columns',       category:'content', tags:['table','split','side-by-side'], ja:['カラム','列','テーブル','分割'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>' },

    { name:'list',          category:'content', tags:['bullet','items','menu'], ja:['リスト','一覧','箇条書き'],
      path:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },

    { name:'maximize',      category:'content', tags:['fullscreen','expand','resize'], ja:['最大化','全画面','拡大'],
      path:'<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>' },

    { name:'minimize',      category:'content', tags:['shrink','reduce','resize'], ja:['最小化','縮小'],
      path:'<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>' },

    { name:'move',          category:'content', tags:['drag','reorder','arrange'], ja:['移動','ドラッグ','並べ替え'],
      path:'<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>' },

    { name:'type',          category:'content', tags:['text','font','typography'], ja:['文字','フォント','テキスト','タイポグラフィ'],
      path:'<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>' },

    { name:'bold',          category:'content', tags:['text','format','strong'], ja:['太字','ボールド','書式'],
      path:'<path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/>' },

    { name:'italic',        category:'content', tags:['text','format','slant'], ja:['斜体','イタリック','書式'],
      path:'<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>' },

    { name:'underline',     category:'content', tags:['text','format'], ja:['下線','アンダーライン','書式'],
      path:'<path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><line x1="4" y1="21" x2="20" y2="21"/>' },

    { name:'align-left',    category:'content', tags:['text','format','left'], ja:['左揃え','書式'],
      path:'<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>' },

    { name:'align-center',  category:'content', tags:['text','format','center'], ja:['中央揃え','書式'],
      path:'<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>' },

    { name:'align-right',   category:'content', tags:['text','format','right'], ja:['右揃え','書式'],
      path:'<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>' },

    { name:'droplet',       category:'content', tags:['water','color','fill'], ja:['しずく','水','色','塗りつぶし'],
      path:'<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>' },

    { name:'crosshair',     category:'content', tags:['target','aim','focus','center'], ja:['照準','ターゲット','中心','フォーカス'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>' },

    { name:'key',           category:'content', tags:['password','auth','access','secret'], ja:['鍵','パスワード','認証','アクセス'],
      path:'<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>' },

    { name:'anchor',        category:'content', tags:['marine','link','stable'], ja:['アンカー','錨','リンク','固定'],
      path:'<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0020 0h-3"/>' },

    { name:'paperclip',     category:'content', tags:['attach','file','clip'], ja:['クリップ','添付','留める'],
      path:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>' },

    { name:'archive',       category:'content', tags:['box','store','compress'], ja:['アーカイブ','保管','圧縮'],
      path:'<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>' },

    { name:'trash-2',       category:'content', tags:['delete','remove','empty'], ja:['ゴミ箱','削除','空にする'],
      path:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>' },

    { name:'inbox',         category:'content', tags:['mail','receive','tray'], ja:['受信箱','メール','トレイ'],
      path:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>' },

    { name:'award',         category:'content', tags:['trophy','badge','prize','medal'], ja:['賞','トロフィー','バッジ','メダル'],
      path:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>' },

    { name:'coffee',        category:'content', tags:['cup','drink','break','mug'], ja:['コーヒー','カップ','休憩','飲み物'],
      path:'<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>' },

    { name:'tool',          category:'content', tags:['wrench','fix','repair','settings'], ja:['工具','修理','設定','レンチ'],
      path:'<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>' },

    { name:'compass',       category:'content', tags:['direction','explore','navigation'], ja:['コンパス','方位','探索','ナビ'],
      path:'<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>' },

    { name:'percent',       category:'content', tags:['discount','ratio','math'], ja:['パーセント','割合','割引','計算'],
      path:'<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' },

    { name:'git-branch',    category:'content', tags:['branch','version','merge'], ja:['ブランチ','バージョン','マージ','Git'],
      path:'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/>' },

    { name:'git-commit',    category:'content', tags:['commit','version','point'], ja:['コミット','バージョン','Git'],
      path:'<circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>' },

    { name:'git-pull-request',category:'content', tags:['pr','review','merge'], ja:['プルリクエスト','レビュー','PR'],
      path:'<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>' },

    { name:'feather',       category:'content', tags:['write','quill','light'], ja:['羽根','ペン','軽い'],
      path:'<path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>' },

    { name:'aperture',      category:'content', tags:['camera','lens','iris','shutter'], ja:['絞り','レンズ','カメラ'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/>' },

    { name:'hexagon',       category:'content', tags:['shape','polygon','logo'], ja:['六角形','図形','ポリゴン'],
      path:'<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' },

    { name:'triangle',      category:'content', tags:['shape','play','geometry'], ja:['三角形','再生','図形'],
      path:'<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>' },

    { name:'crop',          category:'content', tags:['trim','cut','resize'], ja:['切り抜き','トリミング','クロップ'],
      path:'<path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/>' },

    { name:'grid',          category:'content', tags:['layout','matrix','table'], ja:['グリッド','レイアウト','表','マトリックス'],
      path:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },

    // ========== Media / Player =================================
    { name:'play',          category:'media', tags:['start','video','audio','run'], ja:['再生','スタート','動画','実行'],
      path:'<polygon points="5 3 19 12 5 21 5 3"/>' },

    { name:'pause',         category:'media', tags:['stop','hold','wait'], ja:['一時停止','ポーズ','待機'],
      path:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>' },

    { name:'stop-circle',   category:'media', tags:['stop','end','halt'], ja:['停止','ストップ','終了'],
      path:'<circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/>' },

    { name:'skip-back',     category:'media', tags:['previous','rewind','back'], ja:['前へ','巻き戻し','スキップ'],
      path:'<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>' },

    { name:'skip-forward',  category:'media', tags:['next','forward','skip'], ja:['次へ','早送り','スキップ'],
      path:'<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>' },

    { name:'rewind',        category:'media', tags:['backward','back','fast'], ja:['巻き戻し','高速','戻す'],
      path:'<polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/>' },

    { name:'fast-forward',  category:'media', tags:['forward','speed','fast'], ja:['早送り','高速','進む'],
      path:'<polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/>' },

    { name:'play-circle',   category:'media', tags:['start','video','play'], ja:['再生','動画','プレイ'],
      path:'<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>' },

    { name:'radio',         category:'media', tags:['broadcast','signal','fm'], ja:['ラジオ','放送','電波'],
      path:'<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/>' },

    { name:'headphones',    category:'media', tags:['audio','music','listen'], ja:['ヘッドホン','音楽','聴く'],
      path:'<path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>' },

    { name:'airplay',       category:'media', tags:['cast','stream','screen'], ja:['エアプレイ','キャスト','画面共有'],
      path:'<path d="M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1"/><polygon points="12 15 17 21 7 21 12 15"/>' },

    // ========== E-commerce / Finance ============================
    { name:'shopping-cart',  category:'commerce', tags:['cart','buy','purchase','shop'], ja:['カート','買い物','購入','ショッピング'],
      path:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>' },

    { name:'shopping-bag',   category:'commerce', tags:['bag','buy','store','shop'], ja:['ショッピングバッグ','買い物袋','店'],
      path:'<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>' },

    { name:'credit-card',    category:'commerce', tags:['payment','card','money','pay'], ja:['クレジットカード','支払い','決済','カード'],
      path:'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },

    { name:'dollar-sign',    category:'commerce', tags:['money','currency','price','cost'], ja:['ドル','お金','通貨','価格','料金'],
      path:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>' },

    { name:'tag-price',      category:'commerce', tags:['price','sale','discount','label'], ja:['値札','セール','割引','価格'],
      path:'<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="12" y1="17" x2="17" y2="12"/>' },

    { name:'receipt',        category:'commerce', tags:['bill','invoice','ticket'], ja:['レシート','請求書','チケット','領収書'],
      path:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/>' },

    { name:'wallet',         category:'commerce', tags:['money','payment','balance'], ja:['財布','ウォレット','残高','支払い'],
      path:'<path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 100 4h4v-4z"/>' },

    { name:'truck',          category:'commerce', tags:['delivery','shipping','transport'], ja:['トラック','配送','運送','配達'],
      path:'<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },

    { name:'package',        category:'commerce', tags:['box','delivery','parcel'], ja:['荷物','配達','小包','宅配'],
      path:'<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>' },

    // ========== Weather / Nature ================================
    { name:'cloud-rain',     category:'weather', tags:['rain','weather','wet'], ja:['雨','天気','降水'],
      path:'<line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/>' },

    { name:'cloud-snow',     category:'weather', tags:['snow','winter','cold'], ja:['雪','冬','寒い'],
      path:'<path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/>' },

    { name:'cloud-lightning',category:'weather', tags:['storm','thunder','electric'], ja:['雷雨','嵐','稲妻'],
      path:'<path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/>' },

    { name:'wind',           category:'weather', tags:['air','breeze','blow'], ja:['風','空気','そよ風'],
      path:'<path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>' },

    { name:'thermometer',    category:'weather', tags:['temperature','hot','cold','heat'], ja:['温度計','気温','暑い','寒い'],
      path:'<path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>' },

    { name:'sunrise',        category:'weather', tags:['morning','dawn','day'], ja:['日の出','朝','夜明け'],
      path:'<path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/>' },

    { name:'sunset',         category:'weather', tags:['evening','dusk','night'], ja:['日没','夕方','夕暮れ'],
      path:'<path d="M17 18a5 5 0 00-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/>' },

    { name:'umbrella',       category:'weather', tags:['rain','protect','shield'], ja:['傘','雨','守る'],
      path:'<path d="M23 12a11.05 11.05 0 00-22 0zm-5 7a3 3 0 01-6 0v-7"/>' },

    { name:'snowflake',      category:'weather', tags:['ice','winter','frozen','cold'], ja:['雪の結晶','氷','冬','凍る'],
      path:'<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/><line x1="12" y1="2" x2="9" y2="5"/><line x1="12" y1="2" x2="15" y2="5"/><line x1="22" y1="12" x2="19" y2="9"/><line x1="22" y1="12" x2="19" y2="15"/>' },

    // ========== Social / Communication =========================
    { name:'phone',          category:'social', tags:['call','telephone','contact'], ja:['電話','通話','連絡'],
      path:'<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>' },

    { name:'phone-off',      category:'social', tags:['hangup','end','decline'], ja:['電話オフ','切る','拒否'],
      path:'<path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/>' },

    { name:'phone-call',     category:'social', tags:['ringing','calling','active'], ja:['着信','呼び出し','通話中'],
      path:'<path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94m-1 7.98v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>' },

    { name:'video-cam',      category:'social', tags:['camera','meeting','zoom'], ja:['ビデオ通話','カメラ','ミーティング'],
      path:'<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>' },

    { name:'smile',          category:'social', tags:['happy','emoji','face','smiley'], ja:['笑顔','スマイル','絵文字','顔'],
      path:'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>' },

    { name:'frown',          category:'social', tags:['sad','unhappy','face'], ja:['悲しい顔','不満','残念'],
      path:'<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>' },

    { name:'meh',            category:'social', tags:['neutral','face','emoji'], ja:['普通','無表情','微妙'],
      path:'<circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>' },

    { name:'rss',            category:'social', tags:['feed','blog','subscribe'], ja:['RSS','フィード','ブログ','購読'],
      path:'<path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1"/>' },

    { name:'wifi-off',       category:'social', tags:['offline','disconnect','no-signal'], ja:['WiFiオフ','オフライン','切断'],
      path:'<line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.56 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>' },

    // ========== Shapes / Decorative ============================
    { name:'diamond',        category:'shape', tags:['shape','gem','rhombus'], ja:['ダイヤモンド','ひし形','宝石'],
      path:'<path d="M2.7 10.3a2.41 2.41 0 000 3.41l7.59 7.59a2.41 2.41 0 003.41 0l7.59-7.59a2.41 2.41 0 000-3.41L13.7 2.71a2.41 2.41 0 00-3.41 0z"/>' },

    { name:'octagon',        category:'shape', tags:['shape','stop','polygon'], ja:['八角形','停止','図形'],
      path:'<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>' },

    { name:'pentagon',       category:'shape', tags:['shape','polygon','five'], ja:['五角形','図形'],
      path:'<path d="M12 2l9.51 6.91L18.18 19H5.82L2.49 8.91z"/>' },

    { name:'star-4',         category:'shape', tags:['sparkle','four','shape'], ja:['四芒星','キラキラ','図形'],
      path:'<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>' },

    { name:'infinity',       category:'shape', tags:['loop','forever','endless'], ja:['無限','ループ','永遠'],
      path:'<path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.873 0-4.873 8 0 8 5.606 0 7.644-8 12.74-8z"/>' },

    { name:'hash-2',         category:'shape', tags:['grid','tic-tac-toe','number'], ja:['井桁','ハッシュ','格子'],
      path:'<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/>' },

    { name:'target',         category:'shape', tags:['goal','aim','bullseye'], ja:['的','目標','ゴール','狙い'],
      path:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },

    // ========== Misc / Utility (追加) ==========================
    { name:'book',           category:'content', tags:['read','manual','documentation','study'], ja:['本','マニュアル','ドキュメント','勉強'],
      path:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>' },

    { name:'book-open',      category:'content', tags:['read','manual','documentation'], ja:['開いた本','読む','マニュアル'],
      path:'<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>' },

    { name:'newspaper',      category:'content', tags:['article','news','press','blog'], ja:['新聞','ニュース','記事','ブログ'],
      path:'<path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><line x1="10" y1="6" x2="18" y2="6"/><line x1="10" y1="10" x2="18" y2="10"/><line x1="10" y1="14" x2="14" y2="14"/>' },

    { name:'watch',          category:'content', tags:['time','wearable','clock','smartwatch'], ja:['腕時計','ウォッチ','スマートウォッチ'],
      path:'<circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83"/>' },

    { name:'stopwatch',      category:'content', tags:['timer','countdown','speed'], ja:['ストップウォッチ','タイマー','計測'],
      path:'<circle cx="12" cy="13" r="8"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="16.24" y1="9.76" x2="14" y2="12"/><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="2" x2="12" y2="5"/>' },

    { name:'hourglass',      category:'content', tags:['time','wait','loading','sand'], ja:['砂時計','時間','待ち','ローディング'],
      path:'<path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 00-.586-1.414L12 12l-4.414 4.414A2 2 0 007 17.828V22M7 2v4.172a2 2 0 00.586 1.414L12 12l4.414-4.414A2 2 0 0017 6.172V2"/>' },

    { name:'database-2',     category:'content', tags:['storage','data','sql','table'], ja:['データベース','ストレージ','SQL'],
      path:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>' },

    { name:'hard-drive-2',   category:'content', tags:['disk','ssd','storage','save'], ja:['ディスク','SSD','保存'],
      path:'<path d="M2 17l2.17-5.42A2 2 0 016.03 10h11.94a2 2 0 011.86 1.26L22 17"/><rect x="2" y="17" width="20" height="4" rx="1"/><line x1="6" y1="19" x2="6.01" y2="19"/><line x1="10" y1="19" x2="10.01" y2="19"/>' },

    { name:'smartphone-2',   category:'content', tags:['mobile','device','portrait'], ja:['スマートフォン','端末','モバイル'],
      path:'<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="18" x2="15" y2="18"/>' },

    { name:'table',          category:'content', tags:['spreadsheet','data','grid','excel'], ja:['テーブル','表','スプレッドシート','データ'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>' },

    { name:'pie',            category:'content', tags:['chart','data','graph','statistics'], ja:['円グラフ','チャート','統計','データ'],
      path:'<path d="M21 12A9 9 0 1112 3v9z"/><path d="M21 12A9 9 0 0012 3v9z"/>' },

    { name:'bar-chart-2',    category:'content', tags:['chart','data','graph','analytics'], ja:['棒グラフ','チャート','分析','グラフ'],
      path:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },

    { name:'voicemail',      category:'content', tags:['message','audio','answer'], ja:['ボイスメール','留守電','メッセージ'],
      path:'<circle cx="5.5" cy="11.5" r="4.5"/><circle cx="18.5" cy="11.5" r="4.5"/><line x1="5.5" y1="16" x2="18.5" y2="16"/>' },

    { name:'phone-forwarded',category:'content', tags:['call','redirect','forward'], ja:['電話転送','リダイレクト','転送'],
      path:'<polyline points="19 1 23 5 19 9"/><line x1="15" y1="5" x2="23" y2="5"/><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>' },

    { name:'cast',           category:'content', tags:['chromecast','stream','tv'], ja:['キャスト','ストリーミング','テレビ'],
      path:'<path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/>' },

    { name:'tv',             category:'content', tags:['television','screen','display'], ja:['テレビ','ディスプレイ','画面'],
      path:'<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>' },

    { name:'speaker',        category:'content', tags:['audio','sound','music'], ja:['スピーカー','音響','サウンド'],
      path:'<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/>' },

    { name:'life-buoy',      category:'content', tags:['help','support','rescue','safety'], ja:['浮き輪','助け','サポート','安全'],
      path:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>' },

    { name:'scissors-2',     category:'content', tags:['cut','trim','divide'], ja:['ハサミ','切る','分割'],
      path:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>' },

    { name:'wand',           category:'content', tags:['magic','transform','generate','ai'], ja:['魔法の杖','変換','生成','AI'],
      path:'<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/><path d="M11 6.2L9.7 5"/><path d="M11 11.8L9.7 13"/><line x1="2" y1="22" x2="13" y2="11"/>' },

    { name:'scan',           category:'content', tags:['qr','barcode','camera','read'], ja:['スキャン','QR','バーコード','読み取り'],
      path:'<path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>' },

    { name:'fingerprint',    category:'content', tags:['biometric','auth','identity','secure'], ja:['指紋','生体認証','本人確認','セキュリティ'],
      path:'<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-2.2.6-4.2 1.6-5.8"/><path d="M22 19.2c0-.7 0-1.3-.1-2 0-3.2-1.2-6.2-3.3-8.5"/><path d="M14.8 22a14.3 14.3 0 001.2-6"/><path d="M18 13a3 3 0 00-3-3 3 3 0 00-3 3c0 2.2-.4 4.3-1.2 6.2"/><path d="M12 22a10 10 0 001-4.5c0-1.6-.5-3.1-1.4-4.3"/>' },

    { name:'qr-code',        category:'content', tags:['scan','barcode','link','share'], ja:['QRコード','スキャン','バーコード','共有'],
      path:'<rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4" rx="1"/><line x1="22" y1="18" x2="22" y2="22"/><line x1="18" y1="22" x2="22" y2="22"/>' },

    { name:'accessibility',  category:'content', tags:['a11y','disability','universal'], ja:['アクセシビリティ','ユニバーサル','バリアフリー'],
      path:'<circle cx="16" cy="4" r="1"/><path d="M18 22l-4-8"/><path d="M6 22l4-8"/><path d="M10 14l-2-4 8-1"/><path d="M18 8l-8 1"/>' },

    { name:'binary',         category:'content', tags:['code','data','computer','01'], ja:['バイナリ','2進数','データ','コンピュータ'],
      path:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M18 15v6m0-6a2 2 0 00-2 2v2a2 2 0 004 0v-2a2 2 0 00-2-2z"/>' },

    { name:'braces',         category:'content', tags:['json','code','object','curly'], ja:['波括弧','JSON','オブジェクト','コード'],
      path:'<path d="M8 3H7a2 2 0 00-2 2v5a2 2 0 01-2 2 2 2 0 012 2v5a2 2 0 002 2h1"/><path d="M16 3h1a2 2 0 012 2v5a2 2 0 002 2 2 2 0 00-2 2v5a2 2 0 01-2 2h-1"/>' },

    { name:'parentheses',    category:'content', tags:['bracket','math','code','group'], ja:['括弧','数式','グループ'],
      path:'<path d="M8 21s-4-3-4-9 4-9 4-9"/><path d="M16 3s4 3 4 9-4 9-4 9"/>' },

    { name:'regex',          category:'content', tags:['pattern','match','search','expression'], ja:['正規表現','パターン','マッチ','検索'],
      path:'<path d="M17 3v10"/><path d="M12.67 5.5l8.66 5"/><path d="M12.67 10.5l8.66-5"/><circle cx="6" cy="17" r="3"/><path d="M3 17h6"/>' },

    { name:'variable',       category:'content', tags:['math','algebra','formula','x'], ja:['変数','数式','代数','公式'],
      path:'<path d="M8 21s-4-3-4-9 4-9 4-9"/><path d="M16 3s4 3 4 9-4 9-4 9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>' },

    { name:'function',       category:'content', tags:['code','math','lambda','method'], ja:['関数','メソッド','ラムダ','コード'],
      path:'<path d="M9 17c2 0 2.8-1 2.8-2.8V9.2C11.8 7.4 11 6 9 6"/><path d="M15 17c-2 0-2.8-1-2.8-2.8V9.2C12.2 7.4 13 6 15 6"/><line x1="8" y1="12" x2="16" y2="12"/>' },

    { name:'rocket',         category:'content', tags:['launch','startup','deploy','fast'], ja:['ロケット','起動','デプロイ','高速','スタートアップ'],
      path:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>' },

    { name:'puzzle',         category:'content', tags:['plugin','extension','piece','module'], ja:['パズル','プラグイン','拡張','モジュール'],
      path:'<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 01-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 10-3.214 3.214c.446.166.855.497.925.968a.979.979 0 01-.276.837l-1.61 1.61a2.404 2.404 0 01-1.705.707 2.402 2.402 0 01-1.704-.706l-1.568-1.568a1.026 1.026 0 00-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 11-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 00-.289-.877l-1.568-1.568A2.402 2.402 0 011.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 103.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0112 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 113.237 3.237c-.464.18-.894.527-.967 1.02z"/>' },

    { name:'sparkle',        category:'content', tags:['ai','magic','generate','new','star'], ja:['AI','生成','魔法','新しい','キラキラ'],
      path:'<path d="M12 3l1.8 5.4L19.2 10.2l-5.4 1.8L12 17.4l-1.8-5.4L4.8 10.2l5.4-1.8z"/><path d="M19 15l.9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9z"/>' },

    // ========== Hand / Gesture ==================================
    { name:'pointer',        category:'gesture', tags:['cursor','click','mouse','hand'], ja:['カーソル','クリック','マウス','ポインタ'],
      path:'<path d="M22 14a8 8 0 01-8 8h-1c-2.21 0-4-1.79-4-4v0M3.7 3.7l7.8 7.8"/><path d="M9.26 9.26L3 5l2 8.5 2.1-2.1"/>' },

    { name:'mouse-pointer',  category:'gesture', tags:['cursor','arrow','click','select'], ja:['マウスポインタ','カーソル','矢印','選択'],
      path:'<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>' },

    { name:'hand',           category:'gesture', tags:['stop','grab','palm','wave'], ja:['手','ストップ','掴む','手のひら'],
      path:'<path d="M18 11V6a2 2 0 00-4 0m0 5V4a2 2 0 00-4 0m0 7V6a2 2 0 00-4 0v8"/><path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/>' },

    { name:'thumbs-up-2',    category:'gesture', tags:['like','approve','good','yes'], ja:['いいね','賛成','グッド'],
      path:'<path d="M7 10v12"/><path d="M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2a3.13 3.13 0 013 3.88z"/>' },

    { name:'grab',           category:'gesture', tags:['drag','move','grip','handle'], ja:['つかむ','ドラッグ','グリップ','ハンドル'],
      path:'<path d="M18 8.5V6a2 2 0 00-4 0v.5M14 8.5V4a2 2 0 00-4 0v4.5m0 0V3a2 2 0 00-4 0v7"/><path d="M18 8.5a2 2 0 014 0V16a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34L2.41 18.06a2 2 0 012.83-2.83L6 16"/>' },

    { name:'pinch',          category:'gesture', tags:['zoom','resize','gesture','touch'], ja:['ピンチ','ズーム','リサイズ','ジェスチャー'],
      path:'<path d="M6 6l4 4"/><path d="M14 14l4 4"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="20" r="2"/><path d="M8.64 8.64L18 4l-4.64 9.36"/><path d="M15.36 15.36L6 20l4.64-9.36"/>' },

    // ========== Transport ======================================
    { name:'car',            category:'transport', tags:['vehicle','auto','drive'], ja:['車','自動車','運転','ドライブ'],
      path:'<path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>' },

    { name:'plane',          category:'transport', tags:['flight','airplane','travel','trip'], ja:['飛行機','フライト','旅行','出張'],
      path:'<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>' },

    { name:'train',          category:'transport', tags:['rail','subway','metro','transit'], ja:['電車','鉄道','地下鉄','交通'],
      path:'<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/>' },

    { name:'bicycle',        category:'transport', tags:['bike','cycle','pedal','exercise'], ja:['自転車','サイクリング','バイク','運動'],
      path:'<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 100-2 1 1 0 000 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>' },

    { name:'bus',            category:'transport', tags:['transit','public','transport'], ja:['バス','公共交通','交通機関'],
      path:'<rect x="3" y="4" width="18" height="14" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="4" x2="12" y2="12"/><circle cx="7" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>' },

    { name:'ship',           category:'transport', tags:['boat','ferry','cruise','sea'], ja:['船','フェリー','海','航海'],
      path:'<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0021 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6"/><line x1="12" y1="10" x2="12" y2="2"/>' },

    // ========== Nature / Ecology ================================
    { name:'leaf',           category:'nature', tags:['plant','eco','green','organic'], ja:['葉','植物','エコ','オーガニック','緑'],
      path:'<path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 2 20 2s-1.7 5.3-6 9.6"/><path d="M10.7 13.7c3-3 6.3-5.7 6.3-5.7"/>' },

    { name:'tree',           category:'nature', tags:['forest','plant','wood','nature'], ja:['木','森','植物','自然'],
      path:'<path d="M12 22v-7"/><path d="M17 15H7l2.5-4H7l2.5-4H7l5-7 5 7h-2.5l2.5 4h-2.5z"/>' },

    { name:'flower',         category:'nature', tags:['blossom','plant','garden'], ja:['花','植物','園芸','ガーデニング'],
      path:'<path d="M12 7.5a4.5 4.5 0 114.5 4.5M12 7.5A4.5 4.5 0 107.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 104.5 4.5M7.5 12H9m3 4.5a4.5 4.5 0 104.5-4.5M12 16.5V15m4.5-3a4.5 4.5 0 10-4.5-4.5M16.5 12H15"/><circle cx="12" cy="12" r="3"/><path d="M12 22v-6"/>' },

    { name:'flame',          category:'nature', tags:['fire','hot','burn','trending'], ja:['炎','火','燃える','ホット','トレンド'],
      path:'<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>' },

    { name:'mountain',       category:'nature', tags:['hill','peak','landscape','outdoor'], ja:['山','風景','アウトドア','ピーク'],
      path:'<path d="M8 3l4 8 5-5 7 11H2z"/>' },

    { name:'waves',          category:'nature', tags:['water','ocean','sea','wave'], ja:['波','海','水','オーシャン'],
      path:'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>' },

    { name:'sprout',         category:'nature', tags:['seedling','grow','plant','new'], ja:['芽','苗','成長','新芽'],
      path:'<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>' },

    { name:'recycle',        category:'nature', tags:['reuse','green','eco','sustainable'], ja:['リサイクル','再利用','エコ','サステナブル'],
      path:'<path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 000-1.775l-1.226-2.12"/><path d="M14 16l3 3-3 3"/><path d="M8.293 13.596L4.875 7.5l3.418-6.096"/><path d="M5.293 7.5H12.5"/><path d="M15.707 10.404L19.125 16.5l-3.418 6.096"/><path d="M19.125 16.5h-3.418"/>' },

    // ========== Health =========================================
    { name:'heart-pulse',    category:'health', tags:['heartbeat','medical','health','vital'], ja:['心拍','医療','健康','バイタル'],
      path:'<path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.572"/><path d="M12 10l1.5 3 1.5-2 1.5 3"/>' },

    { name:'pill',           category:'health', tags:['medicine','drug','pharmacy','tablet'], ja:['薬','カプセル','薬局','錠剤'],
      path:'<path d="M10.5 1.5L3 9a4.95 4.95 0 007 7l7.5-7.5a4.95 4.95 0 00-7-7z"/><line x1="10" y1="7" x2="17" y2="14"/>' },

    { name:'stethoscope',    category:'health', tags:['doctor','medical','diagnosis','health'], ja:['聴診器','医者','診察','医療'],
      path:'<path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 0012 0V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/><path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/>' },

    { name:'bandage',        category:'health', tags:['wound','heal','medical','plaster'], ja:['絆創膏','傷','治療','包帯'],
      path:'<path d="M18 2l4 4-12 12-4-4z"/><path d="M2 18l4 4 12-12-4-4z"/><line x1="10" y1="12" x2="10" y2="12.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="14" y1="12" x2="14" y2="12.01"/><line x1="12" y1="14" x2="12" y2="14.01"/>' },

    { name:'syringe',        category:'health', tags:['injection','vaccine','medical'], ja:['注射器','注射','ワクチン','医療'],
      path:'<path d="M19 3l2 2"/><path d="M14 8l5-5"/><path d="M17 7L8.7 15.3a1 1 0 01-1.4 0L5.7 13.7a1 1 0 010-1.4L14 4"/><line x1="2" y1="22" x2="7.3" y2="16.7"/><line x1="9" y1="11" x2="13" y2="7"/>' },

    { name:'dna',            category:'health', tags:['gene','biology','science','helix'], ja:['DNA','遺伝子','生物学','科学'],
      path:'<path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="M17 6l-2.5-2.5"/><path d="M14 8l-1-1"/><path d="M7 18l2.5 2.5"/><path d="M3.5 14.5L5 16"/><path d="M20 9l.5.5"/><path d="M6 12l-2-2"/><path d="M12 12l-1.5-1.5"/>' },

    // ========== Building / Place ================================
    { name:'building',       category:'place', tags:['office','company','skyscraper'], ja:['ビル','オフィス','会社','建物'],
      path:'<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/>' },

    { name:'store',          category:'place', tags:['shop','market','retail','business'], ja:['店','ショップ','マーケット','商店'],
      path:'<path d="M3 9l1-4a1 1 0 011-1h14a1 1 0 011 1l1 4"/><path d="M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9"/><path d="M3 9h18"/><path d="M10 20v-5a2 2 0 012-2 2 2 0 012 2v5"/>' },

    { name:'hospital',       category:'place', tags:['medical','health','emergency','clinic'], ja:['病院','医療','クリニック','緊急'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/><path d="M3 8h18"/>' },

    { name:'school',         category:'place', tags:['education','university','college','learn'], ja:['学校','教育','大学','学習'],
      path:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 4 6 4s6-2 6-4v-5"/>' },

    { name:'warehouse',      category:'place', tags:['storage','factory','depot'], ja:['倉庫','工場','保管','デポ'],
      path:'<path d="M22 8.35V20a2 2 0 01-2 2H4a2 2 0 01-2-2V8.35A2 2 0 013.26 6.5l8-3.2a2 2 0 011.48 0l8 3.2A2 2 0 0122 8.35z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/>' },

    // ========== Education / Knowledge ===========================
    { name:'graduation',     category:'education', tags:['cap','degree','student','university'], ja:['卒業','学位','学生','大学'],
      path:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 4 6 4s6-2 6-4v-5"/>' },

    { name:'pen-tool',       category:'education', tags:['design','bezier','vector','draw'], ja:['ペンツール','デザイン','ベジェ','描く'],
      path:'<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>' },

    { name:'ruler',          category:'education', tags:['measure','scale','size','dimension'], ja:['定規','測る','スケール','サイズ'],
      path:'<path d="M21.174 6.812a1 1 0 00-3.986-3.987L3.842 16.174a2 2 0 000 2.83l1.154 1.154a2 2 0 002.83 0z"/><path d="M15 5l1 3"/><path d="M12 8l1 3"/><path d="M9 11l1 3"/><path d="M6 14l1 3"/>' },

    { name:'lightbulb',      category:'education', tags:['idea','innovation','creative','think'], ja:['電球','アイデア','発明','ひらめき','創造'],
      path:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>' },

    { name:'telescope',      category:'education', tags:['astronomy','science','observe','explore'], ja:['望遠鏡','天文','科学','観察','探索'],
      path:'<path d="M10.065 12.493l-6.18 1.318a.934.934 0 01-1.108-.702l-.537-2.15a1.07 1.07 0 01.691-1.265l13.504-4.44"/><path d="M13.56 11.747l4.332-.924"/><path d="M16 21l-3.105-6.21"/><path d="M13 13l5.5-2.5L21 16"/><circle cx="12" cy="12" r="1"/>' },

    { name:'microscope',     category:'education', tags:['science','lab','research','biology'], ja:['顕微鏡','科学','研究','実験'],
      path:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 100-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 01-2-2V6h6v4a2 2 0 01-2 2z"/><path d="M12 6V3a1 1 0 00-1-1H9a1 1 0 00-1 1v3"/>' },

    // ========== Arrow variants =================================
    { name:'arrow-left-circle',  category:'nav', tags:['back','prev','return'], ja:['左戻る','前へ'],
      path:'<circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/>' },

    { name:'arrow-right-circle', category:'nav', tags:['next','forward','go'], ja:['右進む','次へ'],
      path:'<circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/>' },

    { name:'arrow-up-circle',    category:'nav', tags:['up','top','scroll'], ja:['上へ','トップ'],
      path:'<circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/>' },

    { name:'arrow-down-circle',  category:'nav', tags:['down','bottom','scroll'], ja:['下へ','ボトム'],
      path:'<circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/>' },

    { name:'move-horizontal',    category:'nav', tags:['resize','width','horizontal'], ja:['水平移動','幅','リサイズ'],
      path:'<polyline points="18 8 22 12 18 16"/><polyline points="6 8 2 12 6 16"/><line x1="2" y1="12" x2="22" y2="12"/>' },

    { name:'move-vertical',      category:'nav', tags:['resize','height','vertical'], ja:['垂直移動','高さ','リサイズ'],
      path:'<polyline points="8 18 12 22 16 18"/><polyline points="8 6 12 2 16 6"/><line x1="12" y1="2" x2="12" y2="22"/>' },

    // ========== More Action ====================================
    { name:'pin',            category:'action', tags:['attach','fix','stick','pinned'], ja:['ピン','固定','留める','ピン留め'],
      path:'<line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24z"/>' },

    { name:'paperclip-2',    category:'action', tags:['attach','file','clip'], ja:['添付','クリップ','ファイル添付'],
      path:'<path d="M13.234 20.252l6.368-6.368a5.327 5.327 0 00-7.532-7.532L4.6 13.822a3.551 3.551 0 005.022 5.022l7.47-7.47a1.776 1.776 0 00-2.512-2.512l-6.37 6.37"/>' },

    { name:'link-2',         category:'action', tags:['url','chain','connect'], ja:['リンク','URL','接続'],
      path:'<path d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3"/><line x1="8" y1="12" x2="16" y2="12"/>' },

    { name:'lock-open',      category:'action', tags:['unlock','open','access'], ja:['解錠','開ける','アクセス'],
      path:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019-3"/>' },

    { name:'eraser',         category:'action', tags:['delete','clear','remove','undo'], ja:['消しゴム','消す','クリア','取り消し'],
      path:'<path d="M20 20H7L3 16l8.5-8.5a2.83 2.83 0 014 0L20 12a2.83 2.83 0 010 4L16 20"/><path d="M6.47 17.53L12 12"/>' },

    { name:'undo',           category:'action', tags:['back','revert','cancel','history'], ja:['元に戻す','取り消し','戻す','履歴'],
      path:'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>' },

    { name:'redo',           category:'action', tags:['forward','repeat','again'], ja:['やり直し','進む','リドゥ'],
      path:'<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/>' },

    { name:'replace',        category:'action', tags:['swap','exchange','substitute'], ja:['置換','入れ替え','交換','スワップ'],
      path:'<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-8.5 8.5"/><path d="M3 3l8.5 8.5"/><path d="M3 21l8.5-8.5"/><path d="M21 21l-8.5-8.5"/>' },

    { name:'merge',          category:'action', tags:['combine','join','git','branch'], ja:['マージ','結合','統合','Git'],
      path:'<path d="M8 18V6l7 6-7 6z"/><line x1="15" y1="12" x2="22" y2="12"/>' },

    { name:'split',          category:'action', tags:['divide','separate','fork'], ja:['分割','分岐','分ける','フォーク'],
      path:'<path d="M16 3h5v5"/><path d="M8 3H3v5"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="3" x2="10" y2="10"/><line x1="12" y1="12" x2="12" y2="22"/>' },

    // ========== More UI ========================================
    { name:'panel-left',     category:'ui', tags:['sidebar','drawer','layout'], ja:['左パネル','サイドバー','レイアウト'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>' },

    { name:'panel-right',    category:'ui', tags:['sidebar','drawer','layout'], ja:['右パネル','サイドバー','レイアウト'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>' },

    { name:'panel-top',      category:'ui', tags:['header','toolbar','layout'], ja:['上パネル','ヘッダー','ツールバー'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>' },

    { name:'panel-bottom',   category:'ui', tags:['footer','console','layout'], ja:['下パネル','フッター','コンソール'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/>' },

    { name:'grip-vertical',  category:'ui', tags:['drag','handle','reorder','sort'], ja:['ドラッグハンドル','並べ替え','グリップ'],
      path:'<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>' },

    { name:'grip-horizontal',category:'ui', tags:['drag','handle','reorder'], ja:['ドラッグハンドル','横','グリップ'],
      path:'<circle cx="5" cy="9" r="1"/><circle cx="12" cy="9" r="1"/><circle cx="19" cy="9" r="1"/><circle cx="5" cy="15" r="1"/><circle cx="12" cy="15" r="1"/><circle cx="19" cy="15" r="1"/>' },

    { name:'app-window',     category:'ui', tags:['window','browser','app','frame'], ja:['ウィンドウ','ブラウザ','アプリ','フレーム'],
      path:'<rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><circle cx="6" cy="6.5" r=".5"/><circle cx="9" cy="6.5" r=".5"/><circle cx="12" cy="6.5" r=".5"/>' },

    { name:'minimize-2',     category:'ui', tags:['window','minimize','taskbar'], ja:['最小化','ウィンドウ','タスクバー'],
      path:'<line x1="5" y1="12" x2="19" y2="12"/>' },

    { name:'maximize-2',     category:'ui', tags:['window','fullscreen','expand'], ja:['最大化','全画面','ウィンドウ'],
      path:'<rect x="3" y="3" width="18" height="18" rx="2"/>' },

    { name:'bell-off',       category:'ui', tags:['mute','notification','silent'], ja:['通知オフ','ミュート','消音'],
      path:'<path d="M13.73 21a2 2 0 01-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0118 8"/><path d="M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 00-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/>' },

    { name:'badge-percent',  category:'ui', tags:['discount','sale','coupon','deal'], ja:['割引','セール','クーポン','お得'],
      path:'<path d="M3.85 8.62a4 4 0 014.78-4.77 4 4 0 016.74 0 4 4 0 014.78 4.78 4 4 0 010 6.74 4 4 0 01-4.77 4.78 4 4 0 01-6.75 0 4 4 0 01-4.78-4.77 4 4 0 010-6.76z"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="10" y1="9.5" x2="10" y2="9.51"/><line x1="14" y1="14.5" x2="14" y2="14.51"/>' },

    { name:'signal',         category:'ui', tags:['strength','connection','bars','reception'], ja:['信号','電波','接続','強度'],
      path:'<line x1="2" y1="20" x2="2" y2="16"/><line x1="7" y1="20" x2="7" y2="12"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="17" y1="20" x2="17" y2="4"/><line x1="22" y1="20" x2="22" y2="2"/>' },

    { name:'battery-charging',category:'ui', tags:['power','charge','energy'], ja:['充電中','バッテリー','エネルギー'],
      path:'<rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/><polyline points="11 17 13 11 9 11 11 7"/>' },
  ];

  // ---- カテゴリ表示名 ------------------------------------------
  var categoryLabels = {
    tool:      'Tool',
    nav:       'Navigation',
    action:    'Action',
    ui:        'UI / Status',
    content:   'Content',
    media:     'Media',
    commerce:  'Commerce',
    weather:   'Weather',
    social:    'Social',
    shape:     'Shape',
    gesture:   'Gesture',
    transport: 'Transport',
    nature:    'Nature',
    health:    'Health',
    place:     'Place',
    education: 'Education',
  };

  // ---- ヘルパー ------------------------------------------------
  var defaultAttrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };

  function buildSVG(iconPath, opts){
    opts = opts || {};
    var size = opts.size || 24;
    var attrs = [];
    for(var k in defaultAttrs){
      var val = defaultAttrs[k];
      if(k === 'width' || k === 'height') val = size;
      attrs.push(k + '="' + val + '"');
    }
    if(opts['class']) attrs.push('class="' + opts['class'] + '"');
    if(opts.id) attrs.push('id="' + opts.id + '"');
    if(opts.style) attrs.push('style="' + opts.style + '"');
    return '<svg ' + attrs.join(' ') + '>' + iconPath + '</svg>';
  }

  // ---- API（グローバル window.yutoIcons） -----------------------
  var api = {
    /** アイコン名 → SVG HTML 文字列 */
    toSVG: function(name, opts){
      var icon = icons.find(function(i){ return i.name === name; });
      if(!icon) return '';
      return buildSVG(icon.path, opts);
    },

    /** アイコン名 → DOM 要素 */
    toElement: function(name, opts){
      var html = api.toSVG(name, opts);
      if(!html) return null;
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.firstChild;
    },

    /** 全アイコン一覧（コピーを返す） */
    list: function(){
      return icons.map(function(i){
        return { name:i.name, category:i.category, tags:i.tags.slice(), ja:(i.ja||[]).slice(), path:i.path };
      });
    },

    /** カテゴリ一覧 */
    categories: function(){
      var seen = {};
      var result = [];
      icons.forEach(function(i){
        if(!seen[i.category]){
          seen[i.category] = true;
          result.push(i.category);
        }
      });
      return result;
    },

    /** カテゴリ表示名 */
    categoryLabel: function(cat){
      return categoryLabels[cat] || cat;
    },

    /** アイコン数 */
    count: function(){ return icons.length; },
  };

  root.yutoIcons = api;
})(typeof window !== 'undefined' ? window : this);
