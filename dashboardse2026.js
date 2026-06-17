(async () => {
  ['se2026-db','se2026-style'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  });
  clearInterval(window._seClk);
  clearInterval(window._seAuto);
  if (window._seSlideTimer) clearInterval(window._seSlideTimer);

  var style = document.createElement('style');
  style.id = 'se2026-style';
  style.textContent = [
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');",
    "#se2026-db * { box-sizing:border-box; margin:0; padding:0; font-family:'Inter',sans-serif; }",
    "#se2026-db { position:fixed;inset:0;z-index:2147483647;background:#060912;overflow:hidden;color:#fff; }",
    ".se-card { background:rgba(255,255,255,.025);border:1px solid rgba(99,179,237,.07);border-radius:14px;backdrop-filter:blur(6px); }",
    ".se-card-green { background:linear-gradient(135deg,rgba(56,161,105,.09),rgba(56,161,105,.02));border:1px solid rgba(56,161,105,.22);border-radius:14px;box-shadow:0 0 24px rgba(56,161,105,.05); }",
    ".se-card-amber { background:linear-gradient(135deg,rgba(237,137,54,.09),rgba(237,137,54,.02));border:1px solid rgba(237,137,54,.22);border-radius:14px;box-shadow:0 0 24px rgba(237,137,54,.05); }",
    ".se-card-red   { background:linear-gradient(135deg,rgba(245,101,101,.09),rgba(245,101,101,.02));border:1px solid rgba(245,101,101,.22);border-radius:14px;box-shadow:0 0 24px rgba(245,101,101,.05); }",
    "@keyframes se-bar { from{width:0} }",
    "@keyframes se-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }",
    "@keyframes se-scale-in { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }",
    "@keyframes se-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(.45)} }",
    "@keyframes se-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }",
    "@keyframes se-count { from{opacity:0;transform:scale(.75) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }",
    "@keyframes se-glow { 0%,100%{opacity:.45} 50%{opacity:1} }",
    "@keyframes se-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }",
    "@keyframes se-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }",
    ".se-bf  { animation:se-bar 1.8s cubic-bezier(.4,0,.2,1) both; }",
    ".se-fu  { animation:se-fade-up .65s cubic-bezier(.22,1,.36,1) both; }",
    ".se-si  { animation:se-scale-in .55s cubic-bezier(.34,1.56,.64,1) both; }",
    ".se-pd  { animation:se-pulse 2s infinite; }",
    ".se-num { animation:se-count .85s cubic-bezier(.34,1.56,.64,1) both; }",
    ".se-glow-anim { animation:se-glow 3s ease infinite; }",
    ".se-ticker-inner { display:flex;animation:se-ticker 32s linear infinite;width:max-content; }",
    ".se-bar-wrap { overflow:hidden;width:100%; }",
    ".se-bar-track { display:flex;transition:transform .6s cubic-bezier(.4,0,.2,1); }",
    ".se-bar-slide { min-width:100%;display:flex;flex-direction:column;gap:6px; }",
    ".se-track { background:rgba(255,255,255,.045);border-radius:999px;overflow:hidden; }",
    ".se-dot { transition:all .35s cubic-bezier(.34,1.56,.64,1);cursor:pointer; }",
    ".se-dot:hover { filter:brightness(1.5); }",
    ".se-btn { transition:all .18s ease; }",
    ".se-btn:hover { transform:scale(1.06);filter:brightness(1.25); }",
    ".se-btn:active { transform:scale(.95); }",
    ".se-kec-item { transition:transform .18s ease,box-shadow .18s ease; }",
    ".se-kec-item:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.35); }"
  ].join('');
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'se2026-db';
  wrap.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:14px;">'
    +'<div style="width:44px;height:44px;border:3px solid rgba(66,153,225,.12);border-top-color:#4299e1;border-radius:50%;animation:se-spin 1s linear infinite;"></div>'
    +'<div style="font-size:12px;font-weight:600;color:rgba(255,255,255,.2);letter-spacing:3px;text-transform:uppercase;">Memuat Data SE2026</div>'
    +'</div>';
  document.body.appendChild(wrap);

  function fmt(n)  { return (n||0).toLocaleString('id-ID'); }
  function pct(k)  { return k.prelist?Math.min((k.resp/k.prelist)*100,100):0; }
  function clr(p)  { return p>=50?'#48bb78':p>=20?'#ed8936':'#f56565'; }
  function clrDim(p){ return p>=50?'rgba(72,187,120,.14)':p>=20?'rgba(237,137,54,.14)':'rgba(245,101,101,.14)'; }
  function tgl(d)  { return d?new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'}):'–'; }
  function cardClass(p){ return p>=50?'se-card-green':p>=20?'se-card-amber':'se-card-red'; }
  function mono(s) { return '<span style="font-family:\'JetBrains Mono\',monospace;">'+s+'</span>'; }

  var _slideIdx=0, _slideTotal=0;

  function goTo(idx) {
    _slideIdx = (idx+_slideTotal)%_slideTotal;
    var track = document.getElementById('se-bar-track');
    if (track) track.style.transform = 'translateX(-'+(_slideIdx*100)+'%)';
    document.querySelectorAll('.se-dot').forEach(function(d,i){
      d.style.width   = i===_slideIdx?'26px':'7px';
      d.style.opacity = i===_slideIdx?'1':'.35';
      d.style.background = i===_slideIdx?'#4299e1':'rgba(99,179,237,.5)';
    });
    var ctr = document.getElementById('se-slide-ctr');
    if (ctr) ctr.textContent = (_slideIdx+1)+' / '+_slideTotal;
  }

  function resetSlideAuto() {
    if (window._seSlideTimer) clearInterval(window._seSlideTimer);
    window._seSlideTimer = setInterval(function(){ goTo(_slideIdx+1); }, 4000);
  }

  async function render() {
    var refBtn = document.getElementById('se-ref-btn');
    if (refBtn) { refBtn.textContent = 'Memuat...'; refBtn.disabled=true; }

    var res, raw;
    try {
      res = await fetch('/api/agregat/fasih?level=kecamatan&jenis=progres&indikator=1,2,3&kabupaten=1709');
      raw = await res.json();
    } catch(e) {
      if (refBtn) { refBtn.textContent = 'Refresh'; refBtn.disabled=false; }
      console.error('SE2026 fetch error:',e);
      return;
    }

    var map = {};
    raw.forEach(function(d) {
      if (!d.nama_kecamatan || d.nama_kecamatan==='TIDAK DIKETAHUI') return;
      var k = d.nama_kecamatan;
      if (!map[k]) map[k]={nama:k,prelist:0,resp:0,usaha:0,updated:null};
      if (d.kode_indikator==='2') map[k].prelist = d.total_value||0;
      if (d.kode_indikator==='1'){ map[k].resp = d.total_value||0; map[k].updated=d.updated_at; }
      if (d.kode_indikator==='3') map[k].usaha = d.total_value||0;
    });

    var kecs = Object.values(map).sort(function(a,b){
      return (b.prelist?(b.resp/b.prelist):0)-(a.prelist?(a.resp/a.prelist):0);
    });

    var totalPrelist = kecs.reduce(function(s,k){ return s+k.prelist; },0);
    var totalResp    = kecs.reduce(function(s,k){ return s+k.resp; },0);
    var totalUsaha   = kecs.reduce(function(s,k){ return s+k.usaha; },0);
    var pctTotal     = totalPrelist?((totalResp/totalPrelist)*100).toFixed(1):'0.0';
    var aktif        = kecs.filter(function(k){ return k.resp>0; }).length;

    // DONUT
    var R=36,CX=44,CY=44,CIRC=2*Math.PI*R;
    var filled=(parseFloat(pctTotal)/100)*CIRC;
    var donut = '<svg width="88" height="88" viewBox="0 0 88 88">'
      +'<defs>'
      +'<linearGradient id="sdg" x1="0%" y1="0%" x2="100%" y2="100%">'
      +'<stop offset="0%" stop-color="#f56565"/>'
      +'<stop offset="45%" stop-color="#ed8936"/>'
      +'<stop offset="100%" stop-color="#48bb78"/>'
      +'</linearGradient>'
      +'<filter id="dglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
      +'</defs>'
      +'<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="none" stroke="rgba(255,255,255,.04)" stroke-width="8"/>'
      +'<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="none" stroke="url(#sdg)" stroke-width="8"'
      +' stroke-dasharray="'+filled+' '+CIRC+'" stroke-dashoffset="'+(CIRC/4)+'" stroke-linecap="round" filter="url(#dglow)"/>'
      +'<text x="'+CX+'" y="'+(CY-4)+'" text-anchor="middle" fill="#fff" font-size="15" font-weight="900" font-family="JetBrains Mono,monospace">'+pctTotal+'%</text>'
      +'<text x="'+CX+'" y="'+(CY+11)+'" text-anchor="middle" fill="rgba(99,179,237,.4)" font-size="6" font-family="Inter" letter-spacing="1.5">SELESAI</text>'
      +'</svg>';

    // TICKER
    var tickerItems = kecs.map(function(k){
      var p=pct(k),c=clr(p);
      return '<span style="margin-right:44px;display:inline-flex;align-items:center;gap:8px;">'
        +'<span style="width:6px;height:6px;border-radius:50%;background:'+c+';box-shadow:0 0 6px '+c+';flex-shrink:0;"></span>'
        +'<span style="font-size:11px;font-weight:600;color:rgba(255,255,255,.55);">'+k.nama+'</span>'
        +'<span style="font-size:11px;font-weight:800;color:'+c+';font-family:\'JetBrains Mono\',monospace;">'+p.toFixed(1)+'%</span>'
        +'<span style="font-size:10px;color:rgba(255,255,255,.15);font-family:\'JetBrains Mono\',monospace;">'+fmt(k.resp)+'/'+fmt(k.prelist)+'</span>'
        +'</span>';
    }).join('');

    // HERO
    var h=kecs[0],hp=pct(h),hc=clr(hp);
    var hero = '<div class="se-fu '+cardClass(hp)+'" style="padding:12px 18px;position:relative;overflow:hidden;animation-delay:.04s;flex-shrink:0;">'
      +'<div class="se-glow-anim" style="position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,'+hc+'15,transparent 65%);top:-120px;right:-70px;pointer-events:none;"></div>'
      +'<div class="se-glow-anim" style="position:absolute;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,'+hc+'0c,transparent 70%);bottom:-50px;left:-30px;pointer-events:none;animation-delay:1.8s;"></div>'
      +'<div style="position:relative;display:flex;align-items:center;gap:18px;">'
        // KIRI
        +'<div style="min-width:0;flex:1;">'
          +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
            +'<div style="display:inline-flex;align-items:center;gap:5px;background:'+hc+'16;border:1px solid '+hc+'32;border-radius:7px;padding:2px 9px;">'
              +'<div class="se-pd" style="width:5px;height:5px;border-radius:50%;background:'+hc+';box-shadow:0 0 6px '+hc+';"></div>'
              +'<span style="font-size:9px;font-weight:700;color:'+hc+';letter-spacing:2px;text-transform:uppercase;">Kecamatan Terdepan</span>'
            +'</div>'
            +'<span style="font-size:9px;color:rgba(255,255,255,.18);">Upd: '+tgl(h.updated)+'</span>'
          +'</div>'
          +'<div class="se-num" style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation-delay:.08s;">Kec. '+h.nama+'</div>'
          +'<div style="font-size:9px;color:rgba(99,179,237,.3);margin-top:3px;letter-spacing:.4px;">Kabupaten Bengkulu Tengah · BPS SE2026</div>'
        +'</div>'
        // KANAN
        +'<div style="display:flex;gap:20px;flex-shrink:0;align-items:center;">'
          +'<div style="text-align:center;">'
            +'<div class="se-num" style="font-size:38px;font-weight:900;color:'+hc+';line-height:1;font-family:\'JetBrains Mono\',monospace;text-shadow:0 0 24px '+hc+'55;animation-delay:.18s;">'+hp.toFixed(1)+'<span style="font-size:18px;">%</span></div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.28);margin-top:3px;letter-spacing:1.5px;text-transform:uppercase;">Selesai</div>'
          +'</div>'
          +'<div style="width:1px;height:44px;background:rgba(255,255,255,.06);"></div>'
          +'<div style="text-align:center;">'
            +'<div class="se-num" style="font-size:26px;font-weight:800;color:#fff;line-height:1;font-family:\'JetBrains Mono\',monospace;animation-delay:.26s;">'+fmt(h.resp)+'</div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.28);margin-top:3px;letter-spacing:1.5px;text-transform:uppercase;">Terdata</div>'
          +'</div>'
          +'<div style="text-align:center;">'
            +'<div class="se-num" style="font-size:26px;font-weight:800;color:rgba(255,255,255,.28);line-height:1;font-family:\'JetBrains Mono\',monospace;animation-delay:.32s;">'+fmt(h.prelist)+'</div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.18);margin-top:3px;letter-spacing:1.5px;text-transform:uppercase;">Prelist</div>'
          +'</div>'
          +'<div style="text-align:center;">'
            +'<div class="se-num" style="font-size:26px;font-weight:800;color:#ecc94b;line-height:1;font-family:\'JetBrains Mono\',monospace;animation-delay:.38s;">'+fmt(h.usaha)+'</div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.28);margin-top:3px;letter-spacing:1.5px;text-transform:uppercase;">Usaha</div>'
          +'</div>'
        +'</div>'
      +'</div>'
      +'<div style="margin-top:9px;">'
        +'<div style="display:flex;justify-content:space-between;margin-bottom:4px;">'
          +'<span style="font-size:9px;color:rgba(255,255,255,.18);">Sisa <span style="color:rgba(255,255,255,.42);font-weight:600;">'+fmt(h.prelist-h.resp)+'</span> usaha belum terdata</span>'
          +'<span style="font-size:10px;font-weight:700;color:'+hc+';font-family:\'JetBrains Mono\',monospace;">'+fmt(h.resp)+' / '+fmt(h.prelist)+'</span>'
        +'</div>'
        +'<div class="se-track" style="height:5px;">'
          +'<div class="se-bf" style="background:linear-gradient(90deg,'+hc+'66,'+hc+');height:100%;width:'+Math.min(hp,100).toFixed(1)+'%;box-shadow:0 0 10px '+hc+'55;"></div>'
        +'</div>'
      +'</div>'
    +'</div>';

    // BAR ROW
    function barRow(k,i) {
      var p=pct(k),c=clr(p);
      return '<div style="display:flex;align-items:center;gap:8px;">'
        +'<span style="font-size:9px;color:rgba(99,179,237,.3);font-weight:700;width:16px;text-align:right;flex-shrink:0;">'+(i+1)+'</span>'
        +'<span style="font-size:10px;font-weight:600;color:rgba(255,255,255,.72);width:118px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+k.nama+'">'+k.nama+'</span>'
        +'<div class="se-track" style="flex:1;height:10px;">'
          +'<div class="se-bf" style="background:linear-gradient(90deg,'+c+'77,'+c+');height:100%;width:'+Math.max(p,1.5).toFixed(1)+'%;box-shadow:0 0 7px '+c+'44;animation-delay:'+(i*.05)+'s;"></div>'
        +'</div>'
        +'<span style="font-size:11px;font-weight:800;color:'+c+';width:44px;text-align:right;flex-shrink:0;font-family:\'JetBrains Mono\',monospace;">'+p.toFixed(1)+'%</span>'
        +'<span style="font-size:9px;color:rgba(255,255,255,.14);width:72px;text-align:right;flex-shrink:0;font-family:\'JetBrains Mono\',monospace;">'+fmt(k.resp)+'/'+fmt(k.prelist)+'</span>'
      +'</div>';
    }

    // CAROUSEL
    _slideIdx=0;
    _slideTotal=Math.ceil(kecs.length/2);
    var slidesHTML='';
    for (var s=0;s<_slideTotal;s++) {
      var pair=kecs.slice(s*2,s*2+2);
      slidesHTML+='<div class="se-bar-slide">'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 30px;">'
        +pair.map(function(k,i){ return barRow(k,s*2+i); }).join('')
        +'</div>'
      +'</div>';
    }

    var dotsHTML='';
    for (var d=0;d<_slideTotal;d++) {
      dotsHTML+='<div class="se-dot" data-idx="'+d+'" style="width:'+(d===0?'26px':'7px')+';height:7px;border-radius:999px;background:'+(d===0?'#4299e1':'rgba(99,179,237,.35)')+';opacity:'+(d===0?'1':'.35')+';"></div>';
    }

    // KEC CARD
    function kecCard(k,rank,delay) {
      var p=pct(k),c=clr(p),cd=clrDim(p);
      return '<div class="se-fu se-kec-item '+cardClass(p)+'" style="animation-delay:'+delay+'s;padding:9px 11px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">'
        +'<div style="position:absolute;top:-18px;right:-18px;width:72px;height:72px;border-radius:50%;background:'+cd+';pointer-events:none;"></div>'
        +'<div style="position:relative;">'
          +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">'
            +'<div style="font-size:8px;font-weight:700;color:rgba(99,179,237,.45);background:rgba(66,153,225,.1);padding:2px 6px;border-radius:4px;letter-spacing:1px;">#'+rank+'</div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.16);">'+tgl(k.updated)+'</div>'
          +'</div>'
          +'<div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.82);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:5px;" title="'+k.nama+'">'+k.nama+'</div>'
          +'<div style="font-size:28px;font-weight:900;color:'+c+';line-height:1;font-family:\'JetBrains Mono\',monospace;text-shadow:0 0 18px '+c+'44;">'+p.toFixed(1)+'<span style="font-size:14px;font-family:Inter;">%</span></div>'
          +'<div style="font-size:9px;color:rgba(255,255,255,.18);margin-top:3px;font-family:\'JetBrains Mono\',monospace;">'+fmt(k.resp)+' <span style="color:rgba(255,255,255,.08);">/</span> '+fmt(k.prelist)+'</div>'
        +'</div>'
        +'<div>'
          +'<div class="se-track" style="height:3px;margin-bottom:5px;">'
            +'<div class="se-bf" style="background:'+c+';height:100%;width:'+Math.min(p,100).toFixed(1)+'%;box-shadow:0 0 6px '+c+'55;animation-delay:'+delay+'s;"></div>'
          +'</div>'
          +'<div style="font-size:8px;color:rgba(255,255,255,.2);">Usaha: <span style="color:#ecc94b;font-weight:600;">'+fmt(k.usaha)+'</span></div>'
        +'</div>'
      +'</div>';
    }

    var now = new Date().toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'});

    wrap.innerHTML = '<div style="display:flex;flex-direction:column;height:100vh;overflow:hidden;">'

      // HEADER
      +'<div style="background:rgba(4,7,15,.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(99,179,237,.06);padding:7px 22px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">'
        +'<div style="display:flex;align-items:center;gap:14px;">'
          +'<div style="display:flex;align-items:center;gap:6px;">'
            +'<div class="se-pd" style="width:7px;height:7px;border-radius:50%;background:#48bb78;box-shadow:0 0 8px #48bb78;"></div>'
            +'<span style="font-size:9px;font-weight:800;letter-spacing:3px;color:#4299e1;text-transform:uppercase;">Live</span>'
          +'</div>'
          +'<div style="width:1px;height:16px;background:rgba(255,255,255,.06);"></div>'
          +'<span style="font-size:15px;font-weight:800;color:#fff;letter-spacing:-.3px;">Progress Pendataan SE2026</span>'
          +'<span style="font-size:10px;color:rgba(255,255,255,.18);">BPS Kabupaten Bengkulu Tengah</span>'
        +'</div>'
        +'<div style="display:flex;align-items:center;gap:10px;">'
          +'<span style="font-size:9px;color:rgba(255,255,255,.15);">Data: <span style="color:rgba(99,179,237,.45);font-family:\'JetBrains Mono\',monospace;">'+now+'</span></span>'
          +'<div id="se-time" style="font-size:9px;color:rgba(255,255,255,.15);font-family:\'JetBrains Mono\',monospace;"></div>'
          +'<button id="se-ref-btn" class="se-btn" style="background:rgba(66,153,225,.08);border:1px solid rgba(66,153,225,.16);color:rgba(99,179,237,.8);padding:4px 12px;font-size:10px;border-radius:8px;cursor:pointer;font-weight:600;">↺ Refresh</button>'
          +'<button id="se-cls-btn" class="se-btn" style="background:rgba(245,101,101,.08);border:1px solid rgba(245,101,101,.16);color:#f56565;padding:4px 12px;font-size:10px;border-radius:8px;cursor:pointer;font-weight:600;">✕ Tutup</button>'
        +'</div>'
      +'</div>'

      // TICKER
      +'<div style="background:rgba(66,153,225,.025);border-bottom:1px solid rgba(99,179,237,.05);padding:5px 0;overflow:hidden;flex-shrink:0;">'
        +'<div class="se-ticker-inner">'+tickerItems+tickerItems+'</div>'
      +'</div>'

      // MAIN
      +'<div style="flex:1;min-height:0;padding:9px 22px 12px;display:flex;flex-direction:column;gap:8px;overflow:hidden;">'

        +hero

        // STATS
        +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex-shrink:0;">'
          +'<div class="se-card se-fu" style="padding:9px 13px;animation-delay:.09s;display:flex;align-items:center;gap:11px;">'
            +'<div style="width:34px;height:34px;border-radius:10px;background:rgba(66,153,225,.1);border:1px solid rgba(66,153,225,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;">📊</div>'
            +'<div><div style="font-size:8px;font-weight:600;color:rgba(99,179,237,.5);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Total Terdata</div>'
            +'<div style="font-size:21px;font-weight:900;color:#fff;font-family:\'JetBrains Mono\',monospace;line-height:1;">'+fmt(totalResp)+'</div>'
            +'<div style="font-size:9px;color:rgba(255,255,255,.16);margin-top:2px;">dari '+fmt(totalPrelist)+' prelist</div></div>'
          +'</div>'
          +'<div class="se-card se-fu" style="padding:5px 12px;animation-delay:.14s;display:flex;align-items:center;justify-content:center;">'+donut+'</div>'
          +'<div class="se-card se-fu" style="padding:9px 13px;animation-delay:.19s;display:flex;align-items:center;gap:11px;">'
            +'<div style="width:34px;height:34px;border-radius:10px;background:rgba(236,201,75,.08);border:1px solid rgba(236,201,75,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;">🏪</div>'
            +'<div><div style="font-size:8px;font-weight:600;color:rgba(99,179,237,.5);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Usaha Didata</div>'
            +'<div style="font-size:21px;font-weight:900;color:#ecc94b;font-family:\'JetBrains Mono\',monospace;line-height:1;">'+fmt(totalUsaha)+'</div>'
            +'<div style="font-size:9px;color:rgba(255,255,255,.16);margin-top:2px;">usaha terdaftar</div></div>'
          +'</div>'
          +'<div class="se-card se-fu" style="padding:9px 13px;animation-delay:.24s;display:flex;align-items:center;gap:11px;">'
            +'<div style="width:34px;height:34px;border-radius:10px;background:rgba(72,187,120,.08);border:1px solid rgba(72,187,120,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;">📍</div>'
            +'<div><div style="font-size:8px;font-weight:600;color:rgba(99,179,237,.5);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;">Kecamatan Aktif</div>'
            +'<div style="font-size:21px;font-weight:900;color:#48bb78;font-family:\'JetBrains Mono\',monospace;line-height:1;">'+aktif+'<span style="font-size:12px;color:rgba(255,255,255,.2);"> / '+kecs.length+'</span></div>'
            +'<div style="font-size:9px;color:rgba(255,255,255,.16);margin-top:2px;">kecamatan aktif</div></div>'
          +'</div>'
        +'</div>'

        // BAR CAROUSEL
        +'<div class="se-card se-fu" style="padding:10px 15px;animation-delay:.29s;flex-shrink:0;">'
          +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">'
            +'<div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.75);letter-spacing:.3px;">📈 Progress per Kecamatan</div>'
            +'<div style="display:flex;align-items:center;gap:12px;">'
              +'<div style="display:flex;gap:10px;">'
                +'<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:50%;background:#48bb78;box-shadow:0 0 5px #48bb78;"></div><span style="font-size:9px;color:rgba(255,255,255,.28);">≥50%</span></div>'
                +'<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:50%;background:#ed8936;box-shadow:0 0 5px #ed8936;"></div><span style="font-size:9px;color:rgba(255,255,255,.28);">20–49%</span></div>'
                +'<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:50%;background:#f56565;box-shadow:0 0 5px #f56565;"></div><span style="font-size:9px;color:rgba(255,255,255,.28);">&lt;20%</span></div>'
              +'</div>'
              +'<div style="display:flex;gap:5px;">'
                +'<button id="se-prev" class="se-btn" style="background:rgba(66,153,225,.08);border:1px solid rgba(66,153,225,.14);color:rgba(99,179,237,.8);width:25px;height:25px;border-radius:7px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">‹</button>'
                +'<button id="se-next" class="se-btn" style="background:rgba(66,153,225,.08);border:1px solid rgba(66,153,225,.14);color:rgba(99,179,237,.8);width:25px;height:25px;border-radius:7px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;">›</button>'
              +'</div>'
            +'</div>'
          +'</div>'
          +'<div class="se-bar-wrap"><div id="se-bar-track" class="se-bar-track">'+slidesHTML+'</div></div>'
          +'<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:8px;">'
            +dotsHTML
            +'<span id="se-slide-ctr" style="font-size:9px;color:rgba(255,255,255,.16);margin-left:7px;">1 / '+_slideTotal+'</span>'
          +'</div>'
        +'</div>'

        // RANK 2-6
        +'<div style="flex:1;min-height:0;display:flex;flex-direction:column;gap:4px;">'
          +'<div style="font-size:8px;font-weight:700;color:rgba(99,179,237,.32);letter-spacing:2.5px;text-transform:uppercase;flex-shrink:0;">🏆 Peringkat 2 – 6</div>'
          +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;flex:1;min-height:0;">'
          +kecs.slice(1,6).map(function(k,i){ return kecCard(k,i+2,(i*.07+.33)); }).join('')
          +'</div>'
        +'</div>'

        // RANK 7-11
        +'<div style="flex:1;min-height:0;display:flex;flex-direction:column;gap:4px;">'
          +'<div style="font-size:8px;font-weight:700;color:rgba(99,179,237,.32);letter-spacing:2.5px;text-transform:uppercase;flex-shrink:0;">📋 Peringkat 7 – 11</div>'
          +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;flex:1;min-height:0;">'
          +kecs.slice(6,11).map(function(k,i){ return kecCard(k,i+7,(i*.07+.62)); }).join('')
          +'</div>'
        +'</div>'

        // FOOTER
        +'<div style="text-align:center;padding:3px 0 0;border-top:1px solid rgba(99,179,237,.05);flex-shrink:0;">'
          +'<div style="font-size:8px;color:rgba(255,255,255,.07);letter-spacing:.5px;">Sumber: FASIH Pendataan SE2026 · BPS Kabupaten Bengkulu Tengah · Auto-refresh setiap 5 menit</div>'
        +'</div>'

      +'</div>'
    +'</div>';

    document.getElementById('se-cls-btn').addEventListener('click', function() {
      clearInterval(window._seClk);
      clearInterval(window._seAuto);
      clearInterval(window._seSlideTimer);
      document.getElementById('se2026-db').remove();
      document.getElementById('se2026-style').remove();
    });
    document.getElementById('se-ref-btn').addEventListener('click', function() {
      clearInterval(window._seAuto);
      clearInterval(window._seSlideTimer);
      render().then(function() { window._seAuto = setInterval(render,5*60*1000); });
    });
    document.getElementById('se-prev').addEventListener('click', function(){ goTo(_slideIdx-1); resetSlideAuto(); });
    document.getElementById('se-next').addEventListener('click', function(){ goTo(_slideIdx+1); resetSlideAuto(); });
    document.querySelectorAll('.se-dot').forEach(function(d){
      d.addEventListener('click', function(){ goTo(parseInt(d.dataset.idx)); resetSlideAuto(); });
    });

    resetSlideAuto();
    if (refBtn) { refBtn.textContent='↺ Refresh'; refBtn.disabled=false; }
    console.log('SE2026 refreshed —', kecs.length, 'kecamatan @', now);
  }

  function tick() {
    var el = document.getElementById('se-time');
    if (el) el.textContent = new Date().toLocaleString('id-ID',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
  tick();
  window._seClk = setInterval(tick, 1000);
  await render();
  window._seAuto = setInterval(render, 5*60*1000);
})();
