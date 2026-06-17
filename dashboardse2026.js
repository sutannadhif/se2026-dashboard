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
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');",
    "#se2026-db * { box-sizing:border-box; margin:0; padding:0; font-family:'Inter',sans-serif; }",
    "#se2026-db { position:fixed;inset:0;z-index:2147483647;background:#0a0f1e;overflow:hidden;color:#fff; }",
    ".se-card { background:rgba(255,255,255,.03);border:1px solid rgba(99,179,237,.08);border-radius:12px; }",
    ".se-card-green { background:rgba(56,161,105,.06);border:1px solid rgba(56,161,105,.15);border-radius:12px; }",
    ".se-card-amber { background:rgba(221,107,32,.06);border:1px solid rgba(221,107,32,.15);border-radius:12px; }",
    ".se-card-red { background:rgba(203,104,67,.06);border:1px solid rgba(203,104,67,.15);border-radius:12px; }",
    "@keyframes se-bar { from{width:0} }",
    ".se-bf { animation:se-bar 1.6s cubic-bezier(.4,0,.2,1) both; }",
    "@keyframes se-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }",
    ".se-fu { animation:se-fade-up .5s ease both; }",
    "@keyframes se-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }",
    ".se-pd { animation:se-pulse 2s infinite; }",
    "@keyframes se-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }",
    ".se-ticker-inner { display:flex;animation:se-ticker 30s linear infinite;width:max-content; }",
    "@keyframes se-count { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }",
    ".se-num { animation:se-count .8s cubic-bezier(.34,1.56,.64,1) both; }",
    "@keyframes se-glow-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }",
    ".se-glow { animation:se-glow-pulse 3s ease infinite; }",
    ".se-bar-wrap { overflow:hidden; width:100%; }",
    ".se-bar-track { display:flex; transition:transform .5s cubic-bezier(.4,0,.2,1); }",
    ".se-bar-slide { min-width:100%; display:flex; flex-direction:column; gap:5px; }",
    ".se-kec-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:0; }",
    ".se-kec-card { display:flex;flex-direction:column;justify-content:space-between; }"
  ].join('');
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'se2026-db';
  wrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px;color:rgba(255,255,255,.3);">Memuat data SE2026...</div>';
  document.body.appendChild(wrap);

  function fmt(n) { return (n||0).toLocaleString('id-ID'); }
  function pct(k) { return k.prelist?Math.min((k.resp/k.prelist)*100,100):0; }
  function clr(p) { return p>=50?'#48bb78':p>=20?'#dd6b20':'#cb6843'; }
  function tgl(d) { return d?new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'}):'–'; }
  function cardClass(p) { return p>=50?'se-card-green':p>=20?'se-card-amber':'se-card-red'; }

  var _slideIdx = 0;
  var _slideTotal = 0;

  function goTo(idx) {
    _slideIdx = (idx + _slideTotal) % _slideTotal;
    var track = document.getElementById('se-bar-track');
    if (track) track.style.transform = 'translateX(-'+(_slideIdx*100)+'%)';
    document.querySelectorAll('.se-dot').forEach(function(d,i) {
      d.style.width = i===_slideIdx?'20px':'6px';
      d.style.background = i===_slideIdx?'#4299e1':'rgba(255,255,255,.15)';
    });
    var ctr = document.getElementById('se-slide-ctr');
    if (ctr) ctr.textContent = (_slideIdx+1)+' / '+_slideTotal;
  }

  function resetSlideAuto() {
    if (window._seSlideTimer) clearInterval(window._seSlideTimer);
    window._seSlideTimer = setInterval(function(){ goTo(_slideIdx+1); }, 3500);
  }

  async function render() {
    var refBtn = document.getElementById('se-ref-btn');
    if (refBtn) { refBtn.textContent = 'Memuat...'; refBtn.disabled = true; }

    var res, raw;
    try {
      res = await fetch('/api/agregat/fasih?level=kecamatan&jenis=progres&indikator=1,2,3&kabupaten=1709');
      raw = await res.json();
    } catch (e) {
      if (refBtn) { refBtn.textContent = 'Refresh'; refBtn.disabled = false; }
      console.error('SE2026 fetch error:', e);
      return;
    }

    var map = {};
    raw.forEach(function(d) {
      if (!d.nama_kecamatan || d.nama_kecamatan === 'TIDAK DIKETAHUI') return;
      var k = d.nama_kecamatan;
      if (!map[k]) map[k] = {nama:k,prelist:0,resp:0,usaha:0,updated:null};
      if (d.kode_indikator==='2') map[k].prelist = d.total_value||0;
      if (d.kode_indikator==='1') { map[k].resp = d.total_value||0; map[k].updated = d.updated_at; }
      if (d.kode_indikator==='3') map[k].usaha = d.total_value||0;
    });

    var kecs = Object.values(map).sort(function(a,b) {
      return (b.prelist?(b.resp/b.prelist):0)-(a.prelist?(a.resp/a.prelist):0);
    });

    var totalPrelist = kecs.reduce(function(s,k){ return s+k.prelist; },0);
    var totalResp    = kecs.reduce(function(s,k){ return s+k.resp; },0);
    var totalUsaha   = kecs.reduce(function(s,k){ return s+k.usaha; },0);
    var pctTotal     = totalPrelist?((totalResp/totalPrelist)*100).toFixed(1):'0.0';
    var aktif        = kecs.filter(function(k){ return k.resp>0; }).length;

    // DONUT
    var R=34,CX=42,CY=42,CIRC=2*Math.PI*R;
    var filled=(parseFloat(pctTotal)/100)*CIRC;
    var donut = '<svg width="80" height="80" viewBox="0 0 84 84">'
      +'<defs><linearGradient id="sdg" x1="0%" y1="0%" x2="100%" y2="100%">'
      +'<stop offset="0%" stop-color="#dd6b20"/><stop offset="100%" stop-color="#48bb78"/>'
      +'</linearGradient></defs>'
      +'<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="none" stroke="rgba(99,179,237,.08)" stroke-width="8"/>'
      +'<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="none" stroke="url(#sdg)" stroke-width="8"'
      +' stroke-dasharray="'+filled+' '+CIRC+'" stroke-dashoffset="'+(CIRC/4)+'" stroke-linecap="round"/>'
      +'<text x="'+CX+'" y="'+(CY-3)+'" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="Inter">'+pctTotal+'%</text>'
      +'<text x="'+CX+'" y="'+(CY+10)+'" text-anchor="middle" fill="rgba(99,179,237,.5)" font-size="6" font-family="Inter" letter-spacing="1">SELESAI</text>'
      +'</svg>';

    // TICKER
    var tickerItems = kecs.map(function(k) {
      var p = pct(k); var c = clr(p);
      return '<span style="margin-right:40px;font-size:11px;color:rgba(255,255,255,.4);">'
        +'<span style="color:'+c+';font-weight:700;">'+p.toFixed(1)+'%</span>'
        +' &nbsp;'+k.nama+'&nbsp;'
        +'<span style="color:rgba(255,255,255,.2);">'+fmt(k.resp)+'/'+fmt(k.prelist)+'</span>'
        +'</span>';
    }).join('');

    // HERO
    var h = kecs[0]; var hp = pct(h); var hc = clr(hp);
    var hero = '<div class="se-fu '+cardClass(hp)+'" style="padding:10px 16px;position:relative;overflow:hidden;animation-delay:.1s;flex-shrink:0;">'
      +'<div style="position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,'+hc+'12,transparent 70%);top:-60px;right:-40px;pointer-events:none;"></div>'
      +'<div style="position:relative;display:flex;align-items:center;gap:16px;">'
      +'<div style="min-width:0;flex:1;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
      +'<div style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.05);border:1px solid '+hc+'33;border-radius:6px;padding:2px 8px;">'
      +'<div class="se-pd" style="width:5px;height:5px;border-radius:50%;background:'+hc+';flex-shrink:0;"></div>'
      +'<span style="font-size:9px;font-weight:700;color:'+hc+';letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;">Kecamatan Terdepan</span>'
      +'</div>'
      +'<span style="font-size:10px;color:rgba(255,255,255,.2);">'+tgl(h.updated)+'</span>'
      +'</div>'
      +'<div style="font-size:18px;font-weight:900;color:#fff;letter-spacing:-.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Kec. '+h.nama+'</div>'
      +'<div style="font-size:9px;color:rgba(99,179,237,.4);margin-top:2px;">Kabupaten Bengkulu Tengah · BPS SE2026</div>'
      +'</div>'
      +'<div style="display:flex;gap:16px;flex-shrink:0;align-items:center;">'
      +'<div style="text-align:center;"><div class="se-num" style="font-size:24px;font-weight:900;color:'+hc+';line-height:1;white-space:nowrap;">'+hp.toFixed(1)+'<span style="font-size:12px;">%</span></div><div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:2px;">Persentase</div></div>'
      +'<div style="text-align:center;"><div class="se-num" style="font-size:24px;font-weight:900;color:#fff;line-height:1;white-space:nowrap;animation-delay:.1s;">'+fmt(h.resp)+'</div><div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:2px;">Terdata</div></div>'
      +'<div style="text-align:center;"><div class="se-num" style="font-size:24px;font-weight:900;color:rgba(255,255,255,.25);line-height:1;white-space:nowrap;animation-delay:.2s;">'+fmt(h.prelist)+'</div><div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:2px;">Prelist</div></div>'
      +'<div style="text-align:center;"><div class="se-num" style="font-size:24px;font-weight:900;color:#ecc94b;line-height:1;white-space:nowrap;animation-delay:.3s;">'+fmt(h.usaha)+'</div><div style="font-size:9px;color:rgba(255,255,255,.3);margin-top:2px;">Usaha</div></div>'
      +'<div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin-left:8px;">'
      +'<div style="width:4px;height:52px;background:rgba(255,255,255,.05);border-radius:999px;overflow:hidden;display:flex;align-items:flex-end;">'
      +'<div style="width:100%;height:'+Math.min(hp,100).toFixed(1)+'%;background:'+hc+';border-radius:999px;transition:height 1.6s cubic-bezier(.4,0,.2,1);"></div>'
      +'</div>'
      +'<span style="font-size:8px;color:rgba(255,255,255,.2);">'+fmt(h.prelist-h.resp)+' sisa</span>'
      +'</div>'
      +'</div>'
      +'</div>'
      +'</div>';

    // BAR ROW
    function barRow(k, i) {
      var p = pct(k); var c = clr(p);
      return '<div style="display:flex;align-items:center;gap:7px;">'
        +'<span style="font-size:9px;color:rgba(99,179,237,.4);font-weight:700;width:14px;text-align:right;flex-shrink:0;">'+(i+1)+'</span>'
        +'<span style="font-size:10px;font-weight:600;color:rgba(255,255,255,.8);width:120px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+k.nama+'">'+k.nama+'</span>'
        +'<div style="flex:1;background:rgba(255,255,255,.04);border-radius:999px;height:10px;overflow:hidden;">'
        +'<div class="se-bf" style="background:'+c+';height:100%;width:'+Math.max(p,1.5).toFixed(1)+'%;border-radius:999px;opacity:.85;animation-delay:'+(i*.04)+'s;"></div>'
        +'</div>'
        +'<span style="font-size:10px;font-weight:700;color:'+c+';width:38px;text-align:right;flex-shrink:0;">'+p.toFixed(1)+'%</span>'
        +'<span style="font-size:9px;color:rgba(255,255,255,.18);width:70px;text-align:right;flex-shrink:0;">'+fmt(k.resp)+'/'+fmt(k.prelist)+'</span>'
        +'</div>';
    }

    // CAROUSEL
    _slideIdx = 0;
    _slideTotal = Math.ceil(kecs.length / 2);

    var slidesHTML = '';
    for (var s = 0; s < _slideTotal; s++) {
      var pair = kecs.slice(s*2, s*2+2);
      var rowsHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px 28px;">'
        + pair.map(function(k,i){ return barRow(k, s*2+i); }).join('')
        + '</div>';
      slidesHTML += '<div class="se-bar-slide">'+rowsHTML+'</div>';
    }

    var dotsHTML = '';
    for (var d = 0; d < _slideTotal; d++) {
      dotsHTML += '<div class="se-dot" data-idx="'+d+'" style="width:'+(d===0?'20px':'6px')+';height:6px;border-radius:999px;background:'+(d===0?'#4299e1':'rgba(255,255,255,.15)')+';cursor:pointer;transition:all .3s;flex-shrink:0;"></div>';
    }

    var now = new Date().toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'});

    wrap.innerHTML = ''
      // HEADER
      +'<div style="background:rgba(10,15,30,.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(99,179,237,.06);padding:7px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">'
      +'<div style="display:flex;align-items:center;gap:12px;">'
      +'<div style="display:flex;align-items:center;gap:5px;"><div class="se-pd" style="width:6px;height:6px;border-radius:50%;background:#48bb78;"></div><span style="font-size:10px;font-weight:700;letter-spacing:2px;color:#4299e1;text-transform:uppercase;">Live</span></div>'
      +'<div style="width:1px;height:14px;background:rgba(255,255,255,.06);"></div>'
      +'<span style="font-size:14px;font-weight:800;color:#fff;">Progress Pendataan SE2026</span>'
      +'<span style="font-size:10px;color:rgba(255,255,255,.2);">BPS Kabupaten Bengkulu Tengah</span>'
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:10px;">'
      +'<div style="font-size:10px;color:rgba(255,255,255,.2);">Data: <span style="color:rgba(99,179,237,.6);">'+now+'</span></div>'
      +'<div id="se-time" style="font-size:10px;color:rgba(255,255,255,.2);"></div>'
      +'<button id="se-ref-btn" style="background:rgba(66,153,225,.1);border:1px solid rgba(66,153,225,.2);color:rgba(99,179,237,.8);padding:3px 10px;font-size:10px;border-radius:7px;cursor:pointer;font-family:Inter;">Refresh</button>'
      +'<button id="se-cls-btn" style="background:rgba(221,107,32,.1);border:1px solid rgba(221,107,32,.2);color:#dd6b20;padding:3px 10px;font-size:10px;border-radius:7px;cursor:pointer;font-family:Inter;">Tutup</button>'
      +'</div>'
      +'</div>'

      // TICKER
      +'<div style="background:rgba(66,153,225,.04);border-bottom:1px solid rgba(99,179,237,.06);padding:4px 0;overflow:hidden;flex-shrink:0;">'
      +'<div class="se-ticker-inner">'+tickerItems+tickerItems+'</div>'
      +'</div>'

      // MAIN
      +'<div style="padding:8px 20px 12px;height:calc(100vh - 76px);display:flex;flex-direction:column;gap:7px;overflow:hidden;">'
      +hero

      // SUMMARY STATS
      +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex-shrink:0;">'
      +'<div class="se-card se-fu" style="padding:8px 12px;animation-delay:.12s;display:flex;flex-direction:column;justify-content:center;"><div style="font-size:8px;font-weight:600;color:rgba(99,179,237,.5);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Total Terdata</div><div style="font-size:18px;font-weight:800;color:#fff;">'+fmt(totalResp)+'</div><div style="font-size:9px;color:rgba(255,255,255,.2);margin-top:1px;">dari '+fmt(totalPrelist)+' prelist</div></div>'
      +'<div class="se-card se-fu" style="padding:6px 12px;animation-delay:.17s;display:flex;align-items:center;justify-content:center;">'+donut+'</div>'
      +'<div class="se-card se-fu" style="padding:8px 12px;animation-delay:.22s;display:flex;flex-direction:column;justify-content:center;"><div style="font-size:8px;font-weight:600;color:rgba(99,179,237,.5);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Usaha Didata</div><div style="font-size:18px;font-weight:800;color:#ecc94b;">'+fmt(totalUsaha)+'</div><div style="font-size:9px;color:rgba(255,255,255,.2);margin-top:1px;">usaha terdaftar</div></div>'
      +'<div class="se-card se-fu" style="padding:8px 12px;animation-delay:.27s;display:flex;flex-direction:column;justify-content:center;"><div style="font-size:8px;font-weight:600;color:rgba(99,179,237,.5);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">Kecamatan Aktif</div><div style="font-size:18px;font-weight:800;color:#4299e1;">'+aktif+' <span style="font-size:11px;color:rgba(255,255,255,.2);">/ '+kecs.length+'</span></div><div style="font-size:9px;color:rgba(255,255,255,.2);margin-top:1px;">kecamatan aktif</div></div>'
      +'</div>'

      // BAR CHART CAROUSEL
      +'<div class="se-card se-fu" style="padding:10px 16px;animation-delay:.32s;flex-shrink:0;">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      +'<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.9);">Progress per Kecamatan</div>'
      +'<div style="display:flex;align-items:center;gap:12px;">'
      +'<div style="display:flex;gap:10px;">'
      +'<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:50%;background:#48bb78;"></div><span style="font-size:9px;color:rgba(255,255,255,.3);">&#8805;50%</span></div>'
      +'<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:50%;background:#dd6b20;"></div><span style="font-size:9px;color:rgba(255,255,255,.3);">20–49%</span></div>'
      +'<div style="display:flex;align-items:center;gap:4px;"><div style="width:7px;height:7px;border-radius:50%;background:#cb6843;"></div><span style="font-size:9px;color:rgba(255,255,255,.3);">&lt;20%</span></div>'
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:5px;">'
      +'<button id="se-prev" style="background:rgba(66,153,225,.1);border:1px solid rgba(66,153,225,.2);color:rgba(99,179,237,.8);width:24px;height:24px;border-radius:7px;cursor:pointer;font-size:13px;line-height:1;">&#8249;</button>'
      +'<button id="se-next" style="background:rgba(66,153,225,.1);border:1px solid rgba(66,153,225,.2);color:rgba(99,179,237,.8);width:24px;height:24px;border-radius:7px;cursor:pointer;font-size:13px;line-height:1;">&#8250;</button>'
      +'</div>'
      +'</div>'
      +'</div>'
      +'<div class="se-bar-wrap"><div id="se-bar-track" class="se-bar-track">'+slidesHTML+'</div></div>'
      +'<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:7px;">'
      +dotsHTML
      +'<span id="se-slide-ctr" style="font-size:9px;color:rgba(255,255,255,.2);margin-left:6px;">1 / '+_slideTotal+'</span>'
      +'</div>'
      +'</div>'

      // GRID RANK 2-6
      +'<div style="flex:1;min-height:0;display:flex;flex-direction:column;gap:4px;">'
      +'<div style="font-size:9px;font-weight:700;color:rgba(99,179,237,.4);letter-spacing:2px;text-transform:uppercase;flex-shrink:0;">Peringkat 2 – 6</div>'
      +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;flex:1;min-height:0;">'
      + kecs.slice(1,6).map(function(k,i){
          var p=pct(k),c=clr(p),delay=(i*.06+.4);
          return '<div class="se-fu '+cardClass(p)+'" style="animation-delay:'+delay+'s;padding:8px 10px;display:flex;flex-direction:column;justify-content:space-between;">'
            +'<div style="font-size:8px;font-weight:700;color:rgba(99,179,237,.4);letter-spacing:.5px;">#'+(i+2)+'</div>'
            +'<div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.85);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+k.nama+'">'+k.nama+'</div>'
            +'<div style="font-size:19px;font-weight:900;color:'+c+';line-height:1;">'+p.toFixed(1)+'<span style="font-size:11px;">%</span></div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.2);">'+fmt(k.resp)+' / '+fmt(k.prelist)+'</div>'
            +'<div style="background:rgba(255,255,255,.05);border-radius:999px;height:3px;overflow:hidden;">'
            +'<div class="se-bf" style="background:'+c+';height:100%;width:'+Math.min(p,100).toFixed(1)+'%;animation-delay:'+delay+'s;"></div>'
            +'</div>'
            +'<div style="display:flex;justify-content:space-between;">'
            +'<span style="font-size:8px;color:rgba(255,255,255,.2);">Usaha: <span style="color:#ecc94b;">'+fmt(k.usaha)+'</span></span>'
            +'<span style="font-size:8px;color:rgba(255,255,255,.2);">'+tgl(k.updated)+'</span>'
            +'</div>'
            +'</div>';
        }).join('')
      +'</div>'
      +'</div>'

      // GRID RANK 7-11
      +'<div style="flex:1;min-height:0;display:flex;flex-direction:column;gap:4px;">'
      +'<div style="font-size:9px;font-weight:700;color:rgba(99,179,237,.4);letter-spacing:2px;text-transform:uppercase;flex-shrink:0;">Peringkat 7 – 11</div>'
      +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;flex:1;min-height:0;">'
      + kecs.slice(6,11).map(function(k,i){
          var p=pct(k),c=clr(p),delay=(i*.06+.7);
          return '<div class="se-fu '+cardClass(p)+'" style="animation-delay:'+delay+'s;padding:8px 10px;display:flex;flex-direction:column;justify-content:space-between;">'
            +'<div style="font-size:8px;font-weight:700;color:rgba(99,179,237,.4);letter-spacing:.5px;">#'+(i+7)+'</div>'
            +'<div style="font-size:10px;font-weight:700;color:rgba(255,255,255,.85);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+k.nama+'">'+k.nama+'</div>'
            +'<div style="font-size:19px;font-weight:900;color:'+c+';line-height:1;">'+p.toFixed(1)+'<span style="font-size:11px;">%</span></div>'
            +'<div style="font-size:8px;color:rgba(255,255,255,.2);">'+fmt(k.resp)+' / '+fmt(k.prelist)+'</div>'
            +'<div style="background:rgba(255,255,255,.05);border-radius:999px;height:3px;overflow:hidden;">'
            +'<div class="se-bf" style="background:'+c+';height:100%;width:'+Math.min(p,100).toFixed(1)+'%;animation-delay:'+delay+'s;"></div>'
            +'</div>'
            +'<div style="display:flex;justify-content:space-between;">'
            +'<span style="font-size:8px;color:rgba(255,255,255,.2);">Usaha: <span style="color:#ecc94b;">'+fmt(k.usaha)+'</span></span>'
            +'<span style="font-size:8px;color:rgba(255,255,255,.2);">'+tgl(k.updated)+'</span>'
            +'</div>'
            +'</div>';
        }).join('')
      +'</div>'
      +'</div>'

      // FOOTER
      +'<div style="text-align:center;padding:4px 0 0;border-top:1px solid rgba(99,179,237,.06);flex-shrink:0;">'
      +'<div style="font-size:8px;color:rgba(255,255,255,.1);">Sumber: FASIH Pendataan SE2026 · BPS Kabupaten Bengkulu Tengah · Auto-refresh setiap 5 menit</div>'
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
      render().then(function() {
        window._seAuto = setInterval(render, 5*60*1000);
      });
    });

    document.getElementById('se-prev').addEventListener('click', function() {
      goTo(_slideIdx-1); resetSlideAuto();
    });
    document.getElementById('se-next').addEventListener('click', function() {
      goTo(_slideIdx+1); resetSlideAuto();
    });
    document.querySelectorAll('.se-dot').forEach(function(d) {
      d.addEventListener('click', function() {
        goTo(parseInt(d.dataset.idx)); resetSlideAuto();
      });
    });

    resetSlideAuto();
    if (refBtn) { refBtn.textContent = 'Refresh'; refBtn.disabled = false; }
    console.log('SE2026 Dashboard refreshed —', kecs.length, 'kecamatan @', now);
  }

  function tick() {
    var el = document.getElementById('se-time');
    if (el) el.textContent = new Date().toLocaleString('id-ID',{weekday:'short',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
  tick();
  window._seClk = setInterval(tick, 1000);

  await render();
  window._seAuto = setInterval(render, 5*60*1000);
})();