// =========================
// İMZA: KAVİS
// =========================
// Codex kavis geometrisi (wiserrise-kavis-geometri.svg) 180° döndürülmüş: şerit dizisi kutunun sağ alt köşesinden
// (kose: 'ust' ise sağ üst köşesinden) başlar, köşede boşluk bırakmaz, uçlar kutunun dışında kalır. Şeritler yazıya 40 px kala durur, hiçbir yazının
// altından geçmez; paneller (haric) yazı sayılmaz, kavis arkalarından geçer. Şeritler köşeden içe doğru incelir.
// Yazının yeri ekran boyuna ve yazı tipine göre değiştiği için şekil sayfada ölçülerek çizilir.
// Her yerin renklendirmesi bir referanstan: radyal, sirali (köşe taraması), dikey (tablo), blok (rakam bloğu), cam (yivli cam).
(() => {
  const kutular = document.querySelectorAll('[data-kavis]');
  if (!kutular.length) return;

  const NANE = '#7ff0e3', LILA = '#9fb3e8', FIRUZE = '#2bb3a6', BOSLUK = 40;
  // s: birim başına piksel, en: en fazla şerit (kart genişleyince kavis büyümez), kal: köşedeki kalınlık (birim),
  // inc: en uçtaki incelme oranı, ust: kavisin çıkabileceği en üst çizgi (yoksa yazıya göre),
  // kes: üst çizgi şerit eklemeyi durdurmaz, şeritleri düz keser; şeritler sola, kutunun kenarına kadar sürer,
  // grup: aynı gruptaki kutularda şerit sayısı hepsine sığan en küçük sayı olur, az: bundan azı sığarsa hiç çizilmez
  const YERLER = {
    // hero altındaki iki kart: sağ üst köşede, ikisinde de aynı ölçek ve aynı şerit sayısı
    superzeka: { kose: 'ust', grup: 'hl', az: 6, s: 0.302, en: 11, haric: '.wz-frame', boya: 'dikey', renk: [LILA, NANE] },
    harita: { kose: 'ust', grup: 'hl', az: 6, s: 0.302, en: 11, haric: '.gp-panel', boya: 'sirali', renk: [FIRUZE, LILA] },
    kararsiz: { s: 0.279, en: 17, kal: 19, inc: 0.9, boya: 'blok', zemin: NANE, renk: LILA },
    // liste sayfalarındaki koyu kart: aynı boya, kart iki sütuna yayılınca yazının sağındaki boşluğu doldurur
    liste: { s: 0.42, en: 40, kal: 19, inc: 0.9, boya: 'blok', zemin: NANE, renk: LILA },
    // ekranı kaplayan siyah bantta cam şeritler; yazıya kadar büyür, paneli arkadan sarar. İçerik sayfalarındaki kısa bant da bunu kullanır.
    // isik: parlaklığın en yüksek olduğu nokta, kavisin kapladığı alanda soldan ve yukarıdan oran
    kapanis: { s: 0.8, en: 200, kal: 15, inc: 0.45, haric: '.v2-cam-frame', boya: 'cam', isik: [0.12, 0.72] },
    // yazı logosunun tamamını kaplar, telif satırının altında tek bir düz çizgide biter
    footer: { s: 0.6, en: 300, ust: 16, kes: true, adim: 6, boya: 'radyal', renk: [FIRUZE, LILA] },
  };

  // Kutudaki yazıların, düğmelerin ve rozetlerin dikdörtgenleri (kutuya göre)
  const engeller = (kutu, haric) => {
    const k = kutu.getBoundingClientRect(), r = [];
    const ekle = (q) => { if (q.width && q.height) r.push({ t: q.top - k.top, r: q.right - k.left, b: q.bottom - k.top }); };
    const w = document.createTreeWalker(kutu, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, e = n.parentElement;
      if (!n.textContent.trim() || (haric && e.closest(haric))) continue;
      if (getComputedStyle(e).opacity === '0' || e.closest('[aria-hidden="true"]')) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      [...rg.getClientRects()].forEach(ekle);
    }
    kutu.querySelectorAll('*').forEach((e) => {
      if ((haric && e.closest(haric)) || e.closest('.kavis')) return;
      const s = getComputedStyle(e), q = e.getBoundingClientRect();
      if (q.width > k.width * 0.6 || s.opacity === '0') return;
      if (e.tagName === 'svg' || parseFloat(s.borderTopWidth) > 0 || s.backgroundColor !== 'rgba(0, 0, 0, 0)') ekle(q);
    });
    return r;
  };

  // Yazının bittiği dikey çizgiden sağ kenara uzanan en büyük boş alan
  const bosAlan = (kutu, haric) => {
    const W = kutu.clientWidth, H = kutu.clientHeight, e = engeller(kutu, haric);
    let en = null;
    for (const L of [0, ...e.map((q) => q.r + BOSLUK)]) {
      if (L >= W) continue;
      const ust = Math.max(0, ...e.filter((q) => q.r + BOSLUK > L).map((q) => q.b + BOSLUK));
      const a = { x: L, y: ust, w: W - L, h: H - ust };
      if (a.w > 100 && a.h > 60 && (!en || a.w * a.h > en.w * en.h)) en = a;
    }
    return en;
  };

  // Kutuya sığan şeritler. Sağ üst köşedeki kavis alttakinin dikey aynasıdır: ölçüm ve geometri aynalanmış
  // düzlemde (köşe hep sağ altta) yapılır, sayfaya yazarken geri çevrilir.
  const olc = (kutu) => {
    const ayar = YERLER[kutu.dataset.kavis];
    if (!ayar) return null;
    const W = kutu.clientWidth, H = kutu.clientHeight, ust = ayar.kose === 'ust';
    const s = ayar.s, wMax = (ayar.kal ?? 13) * s, plan = { kutu, ayar, W, H, ust, wMax, halkalar: [] };
    // sigar(x0, y0): en dış kenarı x0 ve y0'da olan şerit yazıya 40 px'ten fazla yaklaşmıyor mu
    let sigar;
    if (ust) {
      // her yazıya tek tek bakılır: yazı ya şeridin solunda ya da (aynalanmış düzlemde) üstünde 40 px uzakta olmalı
      const e = engeller(kutu, ayar.haric).map((q) => ({ r: q.r, b: H - q.t }));
      sigar = (x0, y0) => e.every((q) => q.r + BOSLUK <= x0 || q.b + BOSLUK <= y0);
    } else {
      const a = bosAlan(kutu, ayar.haric);
      if (!a) return plan;
      plan.ustCizgi = ayar.ust ?? a.y;
      sigar = (x0, y0) => x0 >= a.x && (ayar.kes || y0 >= plan.ustCizgi);
    }
    // Şerit n: merkez (-(360+9n), 400-5n), yarıçap 220+15n birim; dizi n = -14'ten kutunun kenarında başlar
    const n0 = -14, tx = (W - 12 * s) + s * (580 + 24 * n0), ty = (H - 10 * s) - s * (180 - 20 * n0);
    for (let n = n0; plan.halkalar.length < ayar.en; n++) {
      const cx = tx - s * (360 + 9 * n), cy = ty + s * (400 - 5 * n), r = s * (220 + 15 * n);
      if (!sigar(cx - r - wMax / 2, cy - r - wMax / 2)) break;
      plan.halkalar.push({ cx, cy, r });
    }
    return plan;
  };

  const ciz = ({ kutu, ayar, W, H, ust, wMax, ustCizgi, halkalar: sigan }, adet) => {
    let svg = kutu.querySelector(':scope > .kavis');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'kavis');
      svg.setAttribute('aria-hidden', 'true');
      kutu.append(svg);
    }
    const halkalar = adet >= (ayar.az ?? 1) ? sigan.slice(0, adet) : [];
    if (!halkalar.length) { svg.innerHTML = ''; return; }
    const inc = ayar.inc ?? 0.85;
    const R = parseFloat(getComputedStyle(kutu)[ust ? 'borderTopRightRadius' : 'borderBottomRightRadius']) || 0;
    const Y = (yy) => (ust ? H - yy : yy);   // aynalanmış düzlemden sayfaya

    // incelme ve renk geçişi köşeden en dış şeridin tepesine olan uzaklığa göre
    const son = halkalar[halkalar.length - 1];
    const D = Math.hypot(W - (son.cx - son.r * Math.SQRT1_2), H - (son.cy - son.r * Math.SQRT1_2));
    const gen = (x, yy) => wMax * (1 - inc * Math.min(1, Math.hypot(W - x, H - yy) / D));
    // merkez çizgisi ve normali: alt kenardan yukarı, çeyrek yay, sağ kenara.
    // kes varsa kesme çizgisinin üstünde kalan kısım hiç üretilmez (çizgi yukarı doğru tek yönde ilerler)
    const tepe = ayar.kes ? ustCizgi - wMax : -Infinity, adim = ayar.adim ?? 3;
    const cizgi = ({ cx, cy, r }) => {
      const p = [];
      for (let yy = H + wMax; yy > cy; yy -= adim) { if (yy < tepe) return p; p.push([cx - r, yy, -1, 0]); }
      for (let t = 180; t <= 270; t += 3) {
        let q = (t * Math.PI) / 180;
        // büyük yayda 3° uzun bir adım; şerit kesme çizgisine varmadan bitmesin diye son nokta tam kesişimde
        const kesik = cy + r * Math.sin(q) < tepe;
        if (kesik) q = Math.PI + Math.asin(Math.min(1, (cy - tepe) / r));
        p.push([cx + r * Math.cos(q), cy + r * Math.sin(q), Math.cos(q), Math.sin(q)]);
        if (kesik) return p;
      }
      for (let x = cx; x < W + wMax; x += adim) p.push([x, cy - r, 0, -1]);
      p.push([W + wMax, cy - r, 0, -1]);
      return p;
    };
    const yaz = (p) => p.map(([x, yy]) => `${x.toFixed(1)} ${Y(yy).toFixed(1)}`).join('L');
    // bant [a, b]: şerit kalınlığının bir dilimi; -0.5 köşeye bakan iç kenar, 0.5 dış kenar
    const serit = (h, [a, b] = [-0.5, 0.5]) => {
      const dis = [], ic = [];
      for (const [x, yy, nx, ny] of cizgi(h)) { const w = gen(x, yy); dis.push([x + nx * w * b, yy + ny * w * b]); ic.push([x + nx * w * a, yy + ny * w * a]); }
      return `M${yaz(dis.concat(ic.reverse()))}Z`;
    };
    const seritler = (hs, bant) => hs.map((h) => serit(h, bant)).join('');

    const id = `kavis-${kutu.dataset.kavis}`, clip = `clip-path="url(#${id}-k)"`;
    const kesY = ayar.kes ? ustCizgi : 0;
    let defs = `<clipPath id="${id}-k"><rect y="${kesY}" width="${W}" height="${H - kesY}" rx="${R}"/></clipPath>`, govde;
    const gecis = (ad, tur, koor, [r0, r1]) => `<${tur} id="${id}-${ad}" gradientUnits="userSpaceOnUse" ${koor}><stop offset="0" stop-color="${r0}"/><stop offset="1" stop-color="${r1}"/></${tur}>`;
    if (ayar.boya === 'sirali') {
      govde = [0, 1].map((k) => `<path ${clip} fill="${ayar.renk[k]}" d="${seritler(halkalar.filter((_, i) => i % 2 === k))}"/>`).join('');
    } else if (ayar.boya === 'dikey') {
      // kavisin üst ucu ilk renk, alt ucu ikinci renk
      const [y1, y2] = [Y(son.cy - son.r - wMax / 2), Y(H)].sort((p, q) => p - q);
      defs += gecis('g', 'linearGradient', `x1="0" y1="${y1}" x2="0" y2="${y2}"`, ayar.renk);
      govde = `<path ${clip} fill="url(#${id}-g)" d="${seritler(halkalar)}"/>`;
    } else if (ayar.boya === 'blok') {
      // en dış şeridin dış kenarına kadar düz renk blok, kalan şeritler bloğun içinde
      const dis = cizgi(son).map(([x, yy, nx, ny]) => { const w = gen(x, yy) / 2; return [x + nx * w, yy + ny * w]; });
      dis.push([W + wMax, H + wMax]);
      govde = `<path ${clip} fill="${ayar.zemin}" d="M${yaz(dis)}Z"/><path ${clip} fill="${ayar.renk}" d="${seritler(halkalar.slice(0, -1))}"/>`;
    } else if (ayar.boya === 'cam') {
      // cam şerit: saydam renkli gövde, ışığa (yazıya) bakan dış kenarda parlak bir kenar, köşeye bakan iç kenarda soluk yansıma.
      // parlaklık kavisin bir noktasında en yüksek, oradan uzaklaştıkça söner. Işık şeridin içinde kalır, dışarı taşmaz.
      // parlak nokta kavisin sol alt bölgesinde: en dış şeridin sol bacağından sağ kenara, tepesinden alt kenara
      // giden yolların isik oranında (panel ortada durduğu için bu bölge her ekranda açıkta kalır)
      const Lx = son.cx - son.r, Ty = son.cy - son.r, [ax, ay] = ayar.isik;
      const ix = Lx + (W - Lx) * ax, iy = Ty + (H - Ty) * ay;
      const parla = (ad, duraklar) => `<radialGradient id="${id}-${ad}" gradientUnits="userSpaceOnUse" cx="${ix.toFixed(1)}" cy="${Y(iy).toFixed(1)}" r="${(D * 0.7).toFixed(1)}">`
        + duraklar.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('') + '</radialGradient>';
      defs += parla('g', [[0, NANE, 0.5], [0.35, NANE, 0.26], [1, LILA, 0.1]]) + parla('p', [[0, '#ffffff', 1], [0.4, NANE, 0.9], [1, LILA, 0.55]]);
      govde = `<path ${clip} fill="url(#${id}-g)" d="${seritler(halkalar)}"/>`
        + `<path ${clip} fill="url(#${id}-p)" fill-opacity="0.45" d="${seritler(halkalar, [-0.5, -0.38])}"/>`
        + `<path ${clip} fill="url(#${id}-p)" d="${seritler(halkalar, [0.28, 0.5])}"/>`;
    } else {
      defs += gecis('g', 'radialGradient', `cx="${W}" cy="${Y(H)}" r="${D}"`, ayar.renk);
      govde = `<path ${clip} fill="url(#${id}-g)" d="${seritler(halkalar)}"/>`;
    }
    svg.innerHTML = `<defs>${defs}</defs>${govde}`;
  };

  // Kutu boyutu değişince (ekran, kartın genişlemesi) aynı karede bir kez yeniden çizilir.
  // Gruptaki kutulardan biri değişince hepsi yeniden ölçülür, şerit sayısı hepsinde aynı kalır.
  const bekleyen = new Set();
  let kare = 0;
  const grubu = (k) => YERLER[k.dataset.kavis]?.grup;
  const bosalt = () => {
    kare = 0;
    const kume = new Set(bekleyen);
    bekleyen.clear();
    [...kume].forEach((k) => { if (grubu(k)) kutular.forEach((o) => { if (grubu(o) === grubu(k)) kume.add(o); }); });
    const planlar = [...kume].map(olc).filter(Boolean), enAz = {};
    planlar.forEach(({ ayar, halkalar }) => { if (ayar.grup) enAz[ayar.grup] = Math.min(enAz[ayar.grup] ?? Infinity, halkalar.length); });
    planlar.forEach((p) => ciz(p, p.ayar.grup ? enAz[p.ayar.grup] : p.halkalar.length));
  };
  const sira = (kutu) => {
    bekleyen.add(kutu);
    kare = kare || requestAnimationFrame(bosalt);
  };
  kutular.forEach(sira);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((girdiler) => girdiler.forEach((g) => sira(g.target)));
    kutular.forEach((k) => ro.observe(k));
  }
  // yazı tipi gelince satırlar kayar
  document.fonts?.ready.then(() => kutular.forEach(sira));
})();
