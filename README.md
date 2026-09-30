# wiserrise-site

Wiserrise'ın 3 dilli (EN / TR / DE) pazarlama sitesi. Astro ile statik üretilir, Vercel'de yayınlanır.

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ üretir
npm run preview
```

## URL yapısı

| Dil | Önek | Örnek |
| --- | --- | --- |
| EN (varsayılan) | yok | `/`, `/services/...` |
| TR | `/tr` | `/tr`, `/tr/hizmetler/...` |
| DE | `/de` | `/de`, `/de/leistungen/...` |

Sondaki slash yok (`trailingSlash: 'never'` + `vercel.json`). Eski `/sitemap.xml`
adresi `/sitemap-index.xml`'e yönlendirilir, böylece Search Console'daki kayıt bozulmaz.

## Dizinler

```
src/
  layouts/BaseLayout.astro   ortak <head>, nav, footer, hreflang, canonical
  i18n/config.ts             locale listesi, hreflang/og eşlemeleri
  i18n/routes.ts             merkezî rota haritası — her sayfanın dile göre slug'ı
  i18n/ui.ts                 nav + footer metinleri (dile göre)
  lib/schema.ts              Organization / WebSite JSON-LD (tek entity, sabit @id)
  pages/                     EN kökte, TR /tr altında, DE /de altında
public/                      statik dosyalar; apply/ ve success/ hâlâ elle yazılmış HTML
```

## Çok dillilik kuralı

Her sayfanın `src/i18n/routes.ts` içinde tek bir anahtarı ve dile göre slug'ı vardır:

```ts
'services/local-seo': {
  en: '/services/local-seo',
  tr: '/hizmetler/yerel-seo',
  de: '/leistungen/lokale-seo',
},
```

Sayfa dosyası bu anahtarı `BaseLayout`'a verir (`route="services/local-seo"`);
canonical, hreflang kümesi, dil değiştirici ve sitemap girdisi oradan üretilir.
Elle hreflang yazılmaz.

Bu harita iki kuralı zorunlu kılar:

1. **Slug'lar dile göre değişir.** Türkçe sorguda sıralanacak sayfanın URL'i de
   Türkçe olmalı.
2. **Karşılığı olmayan dile hreflang verilmez.** Pazara özgü sayfalar (TR şehir
   sayfaları gibi) haritada sadece `tr` anahtarı taşır; o sayfada EN/DE hreflang
   üretilmez ve dil değiştirme linki o dilin ana sayfasına düşer.

Bir dilde çevirisi olmayan rotayı o dilde çağırmak build'i hata ile durdurur —
sessizce kırık hreflang üretmesindense.

## Cache politikası

`vercel.json` statik varlıklara açık cache başlığı veriyor; Vercel'in varsayılanı
`max-age=0, must-revalidate` ve bu her tekrar ziyarette tüm fontların/görsellerin
yeniden doğrulanması demek.

| Yol | Politika | Gerekçe |
| --- | --- | --- |
| `/fonts/*` | 1 yıl, `immutable` | Dosya adı değişmeden içerik değişmiyor; yeni ağırlık/subset yeni ad alıyor |
| `/images/*` | 7 gün + 30 gün `stale-while-revalidate` | Logo ve OG görselleri ara sıra değişiyor; SWR sayesinde güncelleme birkaç günde iner ama render hiç beklemez |
| `style.css`, `js/*` | dokunulmadı | Dosya adlarında hash yok, her deploy'da güncel kalmaları gerekiyor |

`vercel.json` şemaya karşı doğrulanıyor (`npm run check:vercel`, build'in ilk adımı).
Geçersiz bir alan deploy'u komple düşürüyor ve hata yalnızca Vercel loglarında
görünüyor — bu kontrol onu yerelde yakalıyor.

## Fontlar

Google Fonts CDN'i yerine `public/fonts/` altından servis ediliyor: üçüncü taraf
render engelleyici istek yok, ve `/de` sürümü için kullanıcı IP'si Google'a gitmiyor.
Yalnızca `latin` ve `latin-ext` subset'leri var — Türkçe ğ/ş/İ latin-ext'te,
Almanca ä/ß latin'de. Inter değişken font olarak alındı (400–800 tek dosya).

Font eklemek/güncellemek gerekirse `public/fonts.css` elle düzenlenir ve yeni woff2
dosyası yeni bir adla eklenir — `immutable` cache nedeniyle aynı adın üzerine yazmayın.
