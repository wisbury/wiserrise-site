import type { Locale } from '../i18n/config';
import { localeHome } from '../i18n/config';
import { routePath } from '../i18n/routes';
import { CONTACT_EMAIL, COMPANY_LEGAL_NAME } from '../i18n/ui';

const SITE = 'https://wiserrise.com';

/**
 * Stable @id for the organisation entity. Every page's schema points back at
 * this node so Google merges them into one entity instead of many.
 */
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
/** Wisbury LLC, the company Wiserrise is a brand of. wisbury.com has no site yet, so the @id lives here. */
export const WISBURY_ID = `${SITE}/#wisbury`;

/**
 * Google Business Profile identifiers, read off the profile's Maps URL.
 * The CID is the second hex value in the `!1s0x…:0x…` block of a place URL,
 * converted to decimal: 0x711c7c17fd95a59 -> 509407866757143129.
 */
export const GBP_CID = '509407866757143129';
export const GBP_URL = `https://www.google.com/maps?cid=${GBP_CID}`;

/** Profiles that prove this is the same entity as the Google Business Profile. */
const SAME_AS = [
  GBP_URL,
  'https://www.linkedin.com/company/wiserrise',
  'https://www.crunchbase.com/organization/wiserrise',
  'https://www.trustpilot.com/review/wiserrise.com',
];

/** Must stay byte-identical to the number on the Google Business Profile. */
const PHONE = '+90 545 505 23 86';

// Sonuç vaadi yok: ne yaptığımızı söyler, ne olacağını söylemez.
const DESCRIPTION: Record<Locale, string> = {
  en: 'Wiserrise is a digital marketing agency offering SEO, local SEO, Google Ads, Meta Ads, link building and GEO to local businesses and brands.',
  tr: 'Wiserrise, yerel işletmeler ve markalar için SEO, Local SEO, Google Ads, Meta Ads, backlink inşası ve GEO hizmeti veren bir dijital pazarlama ajansı.',
  de: 'Wiserrise ist eine Digitalmarketing-Agentur für lokale Unternehmen und Marken: SEO, lokale SEO, Google Ads, Meta Ads, Linkaufbau und GEO.',
};

/** The six main services, in the order the services page lists them. Only those with a page carry a URL. */
const SERVICES: { name: Record<Locale, string>; route?: Parameters<typeof routePath>[1] }[] = [
  { name: { en: 'SEO', tr: 'SEO', de: 'SEO' }, route: 'services/seo' },
  { name: { en: 'Local SEO', tr: 'Local SEO', de: 'Lokale SEO' }, route: 'services/local-seo' },
  { name: { en: 'Google Ads', tr: 'Google Ads', de: 'Google Ads' } },
  { name: { en: 'Meta Ads', tr: 'Meta Ads', de: 'Meta Ads' } },
  { name: { en: 'Link building', tr: 'Backlink inşası', de: 'Linkaufbau' } },
  { name: { en: 'GEO (Generative Engine Optimization)', tr: 'GEO (Generative Engine Optimization)', de: 'GEO (Generative Engine Optimization)' }, route: 'services/geo' },
];

const CATALOG_NAME: Record<Locale, string> = {
  en: 'Digital marketing services',
  tr: 'Dijital pazarlama hizmetleri',
  de: 'Digitale Marketing-Leistungen',
};

/**
 * Melih Us, the founder. One @id for every page and every language, so Google
 * sees one person instead of one per translation. His profile page is the
 * Turkish founder page; the English and German pages are translations of it.
 */
export const PERSON_ID = `${SITE}/#melih-us`;
const PERSON_URL = `${SITE}${routePath('tr', 'about/founder')}`;
const PERSON_IMAGE = `${SITE}/images/melih-us.jpg`;
const PERSON_SAME_AS = [
  'https://www.linkedin.com/in/melih-us-8aa2281a0/',
  'https://www.instagram.com/usmelih/',
  'https://x.com/usmeliih',
];
const PERSON_KNOWS: Record<Locale, string[]> = {
  en: ['SEO', 'Local SEO', 'Google Ads', 'Meta Ads', 'Link building', 'GEO (Generative Engine Optimization)', 'Google Business Profile'],
  tr: ['SEO', 'Local SEO', 'Google Ads', 'Meta Ads', 'Backlink inşası', 'GEO (Generative Engine Optimization)', 'Google İşletme Profili'],
  de: ['SEO', 'Lokale SEO', 'Google Ads', 'Meta Ads', 'Linkaufbau', 'GEO (Generative Engine Optimization)', 'Google Unternehmensprofil'],
};

/**
 * Service-area business: no public street address, so we declare the areas served.
 * Per language: the German pages are written for businesses in Germany, so they declare Germany only.
 */
const AREA_SERVED: Record<Locale, Record<string, string>[]> = {
  tr: [
    { '@type': 'Country', name: 'Türkiye' },
    { '@type': 'City', name: 'Antalya' },
  ],
  en: [
    { '@type': 'Country', name: 'Türkiye' },
    { '@type': 'City', name: 'Antalya' },
  ],
  de: [{ '@type': 'Country', name: 'Deutschland' }],
};

/**
 * Pages keep plain dates ("2026-11-04"); Google wants a time and a time zone
 * on Article and ProfilePage dates. Türkiye is UTC+3 all year.
 */
function withTime(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00+03:00` : date;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Schema for a service page: the service itself, its FAQ, and the breadcrumb
 * trail. All of it hangs off the one organisation node via `provider`.
 */
export function servicePageSchema(opts: {
  locale: Locale;
  url: string;
  name: string;
  description: string;
  faq?: FaqEntry[];
  breadcrumb: Crumb[];
}) {
  const graph: Record<string, unknown>[] = [
    organizationNode(opts.locale),
    {
      '@type': 'Service',
      '@id': `${SITE}${opts.url}#service`,
      name: opts.name,
      description: opts.description,
      serviceType: opts.name,
      provider: { '@id': ORG_ID },
      areaServed: AREA_SERVED[opts.locale],
      inLanguage: opts.locale,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE}${opts.url}#breadcrumb`,
      itemListElement: opts.breadcrumb.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: `${SITE}${c.href}`,
      })),
    },
  ];

  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}${opts.url}#faq`,
      mainEntity: opts.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * Schema for a guide page. Informational content is an Article, not a Service —
 * marking a how-to guide as a Service misrepresents what the page is.
 *
 * Dates are passed in explicitly rather than taken from the build, so that
 * `dateModified` does not change every time the site is redeployed.
 */
export function articlePageSchema(opts: {
  locale: Locale;
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  faq?: FaqEntry[];
  breadcrumb: Crumb[];
  /**
   * The founder wrote the page (the site's only named author). `jobTitle` is in
   * the page's language. Without it the organisation is the author.
   */
  author?: { name: string; jobTitle: string };
  /** Page-specific image (absolute path from the site root). */
  image?: string;
  /** The page is about the founder: a ProfilePage whose main entity is him, with the Article inside it. */
  profile?: boolean;
}) {
  const pageUrl = `${SITE}${opts.url}`;
  const webpageId = `${pageUrl}#webpage`;
  const graph: Record<string, unknown>[] = [
    organizationNode(opts.locale),
    {
      '@type': 'Article',
      '@id': `${SITE}${opts.url}#article`,
      headline: opts.headline,
      description: opts.description,
      // Article'da görsel Google'ın önerdiği alanlardan; sayfaya özel görsel
      // yoksa markanın OG kartı kullanılıyor.
      image: `${SITE}${opts.image ?? (opts.locale === 'tr' ? '/images/og-image-tr.png' : '/images/og-image.png')}`,
      inLanguage: opts.locale,
      datePublished: withTime(opts.datePublished),
      dateModified: withTime(opts.dateModified ?? opts.datePublished),
      author: { '@id': opts.author ? PERSON_ID : ORG_ID },
      publisher: { '@id': ORG_ID },
      // On a profile page the person is the main entity, so the Article sits inside the page instead.
      ...(opts.profile
        ? { isPartOf: { '@id': webpageId }, about: { '@id': PERSON_ID } }
        : { mainEntityOfPage: pageUrl }),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE}${opts.url}#breadcrumb`,
      itemListElement: opts.breadcrumb.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: `${SITE}${c.href}`,
      })),
    },
  ];

  if (opts.profile) {
    graph.push({
      '@type': 'ProfilePage',
      '@id': webpageId,
      url: pageUrl,
      name: opts.headline,
      inLanguage: opts.locale,
      dateCreated: withTime(opts.datePublished),
      dateModified: withTime(opts.dateModified ?? opts.datePublished),
      mainEntity: { '@id': PERSON_ID },
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      ...(opts.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}${opts.image}` } } : {}),
    });
  }

  if (opts.author) {
    graph.push({
      ...founderRef(opts.locale),
      jobTitle: opts.author.jobTitle,
    });
  }

  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}${opts.url}#faq`,
      mainEntity: opts.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * The organisation node itself.
 *
 * Every page embeds this, not just the homepage. Structured data is evaluated
 * per page: a `provider`/`author` that points at an @id defined on some *other*
 * page resolves to nothing, so the reference would be silently empty.
 */
export function organizationNode(locale: Locale) {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'Wiserrise',
    legalName: COMPANY_LEGAL_NAME,
    alternateName: 'Wiserrise Dijital Pazarlama',
    url: `${SITE}${localeHome(locale)}`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}/images/logo.png`,
    },
    image: `${SITE}${locale === 'tr' ? '/images/og-image-tr.png' : '/images/og-image.png'}`,
    email: CONTACT_EMAIL[locale],
    telephone: PHONE,
    description: DESCRIPTION[locale],
    // serviceType belongs to Service, not to an organisation; the services are listed here instead.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: CATALOG_NAME[locale],
      url: `${SITE}${routePath(locale, 'services')}`,
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name[locale],
          ...(s.route ? { url: `${SITE}${routePath(locale, s.route)}` } : {}),
        },
      })),
    },
    areaServed: AREA_SERVED[locale],
    knowsLanguage: ['tr', 'en', 'de'],
    sameAs: SAME_AS,
    // Embedded on every page for the same reason as this node: an @id alone would resolve to nothing elsewhere.
    founder: founderRef(locale),
    // "Wiserrise, Wisbury LLC’nin bir markasıdır." Both directions are stated, and the founder is his on both.
    parentOrganization: {
      '@type': 'Organization',
      '@id': WISBURY_ID,
      name: COMPANY_LEGAL_NAME,
      legalName: COMPANY_LEGAL_NAME,
      founder: { '@id': PERSON_ID },
      subOrganization: { '@id': ORG_ID },
    },
  };
}

/** Who the founder is, carried by every page. The founder page adds his job title in its own language. */
function founderRef(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Melih Us',
    url: PERSON_URL,
    image: PERSON_IMAGE,
    worksFor: { '@id': ORG_ID },
    sameAs: PERSON_SAME_AS,
    knowsAbout: PERSON_KNOWS[locale],
  };
}

export function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE,
    name: 'Wiserrise',
    inLanguage: locale,
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Schema for the home page.
 *
 * Semrush ("ideas" export, 2026-09-18) asked for an `aggregateRating` on this
 * page to win review stars. That is NOT implemented, deliberately: Google's
 * structured-data policy requires rating markup to reflect genuine reviews
 * that are visible on the page, and self-serving reviews about your own
 * business have not been rich-result eligible since 2019. Inventing a rating
 * to earn stars is spammy structured markup and risks a manual action.
 *
 * What this does instead is the legitimate half of the same recommendation:
 * the home page had no `WebPage` node at all, and its FAQ block was not marked
 * up. Both are real rich-result opportunities that cost nothing in risk.
 */
export function homeSchema(opts: {
  locale: Locale;
  name: string;
  description: string;
  faq?: FaqEntry[];
}) {
  const url = `${SITE}${localeHome(opts.locale)}`;
  const graph: Record<string, unknown>[] = [
    organizationNode(opts.locale),
    websiteNode(opts.locale),
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: opts.name,
      description: opts.description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
      inLanguage: opts.locale,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE}${opts.locale === 'tr' ? '/images/og-image-tr.png' : '/images/og-image.png'}`,
      },
    },
  ];

  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: opts.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
