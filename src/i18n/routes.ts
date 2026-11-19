import type { Locale } from './config';
import { localePrefix } from './config';

/**
 * Central route map: one stable key per page, with the slug each locale uses.
 *
 * Two rules this enforces, which are the whole reason it exists:
 *  1. Slugs are localized (`/services/local-seo` vs `/tr/hizmetler/yerel-seo`),
 *     because a Turkish page ranking for Turkish queries needs a Turkish URL.
 *  2. A locale that is *absent* from an entry has no translation, so it gets no
 *     hreflang. Market-specific pages (TR-only city pages) simply omit `en`/`de`
 *     instead of pointing Google at a page that does not exist.
 */
export const ROUTES = {
  home: { en: '/', tr: '/', de: '/' },

  // Services are the global layer: the same offer in every market, so all three
  // locales exist and hreflang links them.
  services: { en: '/services', tr: '/hizmetler', de: '/leistungen' },
  'services/gbp': {
    en: '/services/google-business-profile',
    tr: '/hizmetler/google-isletme-profili-yonetimi',
    de: '/leistungen/google-unternehmensprofil',
  },
  'services/local-seo': {
    en: '/services/local-seo',
    tr: '/hizmetler/yerel-seo',
    de: '/leistungen/lokale-seo',
  },
  'services/rank-tracking': {
    en: '/services/map-rank-tracking',
    tr: '/hizmetler/harita-siralama-takibi',
    de: '/leistungen/google-maps-ranking-tracking',
  },
  'services/technical-seo': {
    en: '/services/technical-seo',
    tr: '/hizmetler/teknik-seo',
    de: '/leistungen/technisches-seo',
  },
  'services/on-page-seo': {
    en: '/services/on-page-seo',
    tr: '/hizmetler/on-page-seo',
    de: '/leistungen/onpage-seo',
  },
  'services/content': {
    en: '/services/content-production',
    tr: '/hizmetler/icerik-uretimi',
    de: '/leistungen/content-erstellung',
  },
  'services/geo': { en: '/services/geo', tr: '/hizmetler/geo', de: '/leistungen/geo' },
  // Parent of technical SEO, on-page SEO and content (their breadcrumbs run through it).
  'services/seo': { en: '/services/seo', tr: '/hizmetler/seo', de: '/leistungen/seo' },
  'services/google-ads': {
    en: '/services/google-ads',
    tr: '/hizmetler/google-ads',
    de: '/leistungen/google-ads',
  },

  // Pricing explainer for the "seo fiyatları" query. Turkish market only, so no en/de hreflang.
  'pricing/seo': { tr: '/seo-fiyatlari' },

  // Industries. These target queries with no proximity signal ("avukatlar için
  // SEO"), which is the only layer that can rank nationwide.
  industries: { en: '/industries', tr: '/sektorler', de: '/branchen' },
  'industries/law': {
    en: '/industries/seo-for-lawyers',
    tr: '/sektorler/avukatlar-icin-seo',
    de: '/branchen/seo-fuer-anwaelte',
  },
  'industries/dental': {
    en: '/industries/seo-for-dentists',
    tr: '/sektorler/dis-hekimleri-icin-seo',
    de: '/branchen/seo-fuer-zahnaerzte',
  },
  'industries/aesthetics': {
    en: '/industries/seo-for-aesthetic-clinics',
    tr: '/sektorler/estetik-klinikleri-icin-seo',
    de: '/branchen/seo-fuer-aesthetik-kliniken',
  },
  'industries/physio': {
    en: '/industries/seo-for-physiotherapists',
    tr: '/sektorler/fizyoterapistler-icin-seo',
    de: '/branchen/seo-fuer-physiotherapeuten',
  },
  'industries/vehicle-inspection': {
    en: '/industries/seo-for-vehicle-inspection',
    tr: '/sektorler/oto-ekspertiz-icin-seo',
    de: '/branchen/seo-fuer-kfz-gutachter',
  },

  // Guides. Informational layer — these queries carry no proximity signal, so
  // they are the layer that reaches beyond Antalya.
  guides: { en: '/guides', tr: '/rehber', de: '/ratgeber' },
  'guides/not-showing': {
    en: '/guides/business-not-showing-on-google',
    tr: '/rehber/isletmem-googleda-cikmiyor',
    de: '/ratgeber/unternehmen-nicht-bei-google-sichtbar',
  },
  'guides/create-profile': {
    en: '/guides/how-to-create-a-google-business-profile',
    tr: '/rehber/google-isletme-profili-nasil-acilir',
    de: '/ratgeber/google-unternehmensprofil-erstellen',
  },
  'guides/rank-higher': {
    en: '/guides/rank-higher-on-google-maps',
    tr: '/rehber/google-haritalarda-ust-siraya-cikma',
    de: '/ratgeber/bei-google-maps-hoeher-ranken',
  },
  'guides/more-reviews': {
    en: '/guides/how-to-get-more-google-reviews',
    tr: '/rehber/google-yorumlari-nasil-artirilir',
    de: '/ratgeber/mehr-google-bewertungen-bekommen',
  },
  'guides/verification': {
    en: '/guides/google-business-profile-verification-problems',
    tr: '/rehber/isletme-profili-dogrulama-sorunlari',
    de: '/ratgeber/google-unternehmensprofil-verifizierung-probleme',
  },

  // Founder page, written for the "Türkiye'nin en iyi SEO uzmanı" query; en/de are translations.
  'about/founder': {
    en: '/turkeys-best-seo-expert',
    tr: '/turkiyenin-en-iyi-seo-uzmani',
    de: '/bester-seo-experte-der-tuerkei',
  },

  // Free tools. Link magnets — they run entirely in the browser, no API.
  'tools/gbp-audit': {
    en: '/tools/google-business-profile-audit',
    tr: '/araclar/google-isletme-profili-denetimi',
    de: '/tools/google-unternehmensprofil-analyse',
  },

  // Thank-you page the analysis form redirects to (public/js/script.js). noindex, kept out of the sitemap.
  thanks: { en: '/success', tr: '/success', de: '/success' },

  // Legal. KVKK is Turkish law; en/de are translations of the Turkish notices.
  'legal/kvkk': { en: '/privacy-notice', tr: '/kvkk-aydinlatma-metni', de: '/datenschutzhinweis' },
  'legal/cookies': { en: '/cookie-policy', tr: '/cerez-politikasi', de: '/cookie-richtlinie' },
  // German imprint (§ 5 DDG); only the German pages need one.
  'legal/impressum': { de: '/impressum' },
} as const satisfies Record<string, Partial<Record<Locale, string>>>;

export type RouteKey = keyof typeof ROUTES;

/** Locales a route actually has a page for. */
export function routeLocales(key: RouteKey): Locale[] {
  return Object.keys(ROUTES[key]) as Locale[];
}

/** Full path for a route in one locale, including the locale prefix. */
export function routePath(locale: Locale, key: RouteKey): string {
  const slug = (ROUTES[key] as Partial<Record<Locale, string>>)[locale];
  if (slug === undefined) {
    throw new Error(`Route "${key}" has no ${locale} translation — omit it from hreflang instead.`);
  }
  const clean = slug === '/' ? '' : `/${slug.replace(/^\/+|\/+$/g, '')}`;
  return `${localePrefix(locale)}${clean}` || '/';
}
