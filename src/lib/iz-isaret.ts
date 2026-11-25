// İç içe üçgen işareti (Padişah 25.11): hizmet kartlarındaki üç konum. Kaynak: .superpowers/imza-padisah/
// Geometri C · İZ'den (public/js/iz.js) birebir: ikizkenar, taban açısı 58,5°; taban = 7 + 283·t birim (t = i/(n−1));
// renk sırası küçükten büyüğe lila (t < 0,36), firuze, en büyük %14 (en az 2) öndeki renk (açıkta lacivert, koyuda nane).
// Yeni olan yalnız yerleşim: işaret tek merkezden (tabanın ortası) orantılı büyür, merkez kartın kenarının
// en dış derinliğin %10'u kadar dışında durur; kartın yuvarlak köşeli kutusu kırpar. Animasyon yok.
const LILA = '#9fb3e8', FIRUZE = '#2bb3a6', ON = 'var(--iz-on, #16244d)', ZEMIN = 'var(--iz-zemin, #ffffff)';
const TAN = Math.tan((58.5 * Math.PI) / 180);
const DISARI = 0.1;
const f = (n: number) => +n.toFixed(2);

type Nokta = [number, number];
function isaret(c: Nokta, yon: Nokta, B: number, n: number) {
  const [ux, uy] = yon, px = -uy, py = ux, onSay = Math.max(2, Math.round(n * 0.14));
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1), b = ((7 + 283 * t) / 290) * B, h = (b / 2) * TAN;
    const d = `M${f(c[0] + (px * b) / 2)} ${f(c[1] + (py * b) / 2)}L${f(c[0] + ux * h)} ${f(c[1] + uy * h)}L${f(c[0] - (px * b) / 2)} ${f(c[1] - (py * b) / 2)}Z`;
    return { d, renk: i >= n - onSay ? ON : t < 0.36 ? LILA : FIRUZE };
  });
}
// Renklere göre tek yol: arkada lila, sonra firuze, önde öndeki renk.
function yollar(parca: ReturnType<typeof isaret>, ek = '') {
  return [LILA, FIRUZE, ON]
    .map((r) => [r, parca.filter((p) => p.renk === r).map((p) => p.d).join('')])
    .filter(([, d]) => d)
    .map(([r, d]) => `<path d="${d}" stroke="${r}"${ek}/>`)
    .join('');
}
const kabuk = (vb: string, ic: string, ek = '') =>
  `<svg class="iz-isaret"${vb ? ` viewBox="${vb}"` : ''}${ek} aria-hidden="true" focusable="false" fill="none" stroke-linejoin="round">${ic}</svg>`;

// 1 · SAĞ KENAR: taban sağ kenarın dışında, uç sola, dikeyde ortada, 7 katman. viewBox = kartın içinde görünen kısım.
const B1 = 290, D1 = (B1 / 2) * TAN, G1 = (1 - DISARI) * D1;
export const SAG = kabuk(
  `0 0 ${f(G1)} ${B1}`,
  yollar(isaret([G1 + DISARI * D1, B1 / 2], [-1, 0], B1, 7), ' vector-effect="non-scaling-stroke"'),
  ' preserveAspectRatio="xMaxYMid meet"',
);
/** Görünen derinliğin görünen yüksekliğe oranı (CSS'te genişlikten yükseklik). */
export const SAG_ORAN = f(G1 / B1);

// 2 · KÖŞE ROZETİ: sağ üst köşe, eksen köşegende, uç kartın içine, 6 katman. Birim: kısa kenar k = 1000.
// Görünen derinlik köşegen boyunca 0,42k; rozetin kutusu (0,42k/√2) kare, köşe (S, 0).
const K = 1000, Dg = (0.42 * K) / (1 - DISARI), B2 = (2 * Dg) / TAN, r = Math.SQRT1_2, S2 = 0.42 * K * r;
export const KOSE = kabuk(
  `0 0 ${f(S2)} ${f(S2)}`,
  yollar(isaret([S2 + DISARI * Dg * r, -DISARI * Dg * r], [-r, r], B2, 6), ' vector-effect="non-scaling-stroke"'),
  ' preserveAspectRatio="xMaxYMin meet"',
);

// 3 · ALT BANT (seçenek E): 5 katmanlı işaretler alt kenar boyunca %50 üst üste binerek, sonraki öndedir;
// her işaretin altında zemin renginde kesik (knockout), öndeki işaret arkadakinin çizgisini keser.
// Dış taban 64 px, adım 32 px; tekrar eden desen (pattern), kart genişliği ne olursa olsun kesintisiz.
const B3 = 64, D3 = (B3 / 2) * TAN, H3 = (1 - DISARI) * D3, ADIM = B3 * 0.5, KAL3 = 1.21, KESIK = 3;
const bant = [-ADIM, 0, ADIM, 2 * ADIM]
  .map((x) => {
    const p = isaret([x, H3 + DISARI * D3], [0, -1], B3, 5);
    return `<path d="${p.map((q) => q.d).join('')}" stroke="${ZEMIN}" stroke-width="${f(KAL3 + 2 * KESIK)}"/>` + yollar(p, ` stroke-width="${KAL3}"`);
  })
  .join('');
export const ALT_YUKSEKLIK = f(H3);
export const altBant = (id: string) =>
  kabuk(
    '',
    `<defs><pattern id="${id}" width="${ADIM}" height="${f(H3)}" patternUnits="userSpaceOnUse">${bant}</pattern></defs><rect width="100%" height="100%" fill="url(#${id})" stroke="none"/>`,
    ` width="100%" height="${f(H3)}"`,
  );
