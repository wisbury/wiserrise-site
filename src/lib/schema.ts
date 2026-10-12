import type { Locale } from '../i18n/config';
import { localeHome } from '../i18n/config';
import { CONTACT_EMAIL, COMPANY_LEGAL_NAME } from '../i18n/ui';

const SITE = 'https://wiserrise.com';

/**
 * Stable @id for the organisation entity. Every page's schema points back at
 * this node so Google merges them into one entity instead of many.
 */
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

/**
 * Google Business Profile identifiers, read off the profile's Maps URL.
 * The CID is the second hex value in the `!1s0x…:0x…` block of a place URL,
 * converted to decimal: 0x711c7c17fd95a59 -> 509407866757143129.
 */
export const GBP_CID = '509407866757143129';
export const GBP_URL = `https://www.google.com/maps?cid=${GBP_CID}`;

/** Profiles that prove this is the same entity as the Google Business Profile. */
const SAME_AS = [GBP_URL];

/** Must stay byte-identical to the number on the Google Business Profile. */
const PHONE = '+90 545 505 23 86';

const DESCRIPTION: Record<Locale, string> = {
  en: 'Wiserrise helps local businesses rank higher on Google Maps, outrank nearby competitors, and turn visibility into real leads.',
  tr: 'Wiserrise, yerel işletmelerin Google Haritalar’da üst sıralara çıkmasını, yakın rakiplerini geçmesini ve görünürlüğü gerçek müşteriye dönüştürmesini sağlar.',
  de: 'Wiserrise hilft lokalen Unternehmen, bei Google Maps besser zu ranken, Wettbewerber in der Nähe zu überholen und Sichtbarkeit in echte Anfragen zu verwandeln.',
};

/** Service-area business: no public street address, so we declare the areas served. */
const AREA_SERVED = [
  { '@type': 'Country', name: 'Türkiye' },
  { '@type': 'City', name: 'Antalya' },
];

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
      areaServed: AREA_SERVED,
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
}) {
  const graph: Record<string, unknown>[] = [
    organizationNode(opts.locale),
    {
      '@type': 'Article',
      '@id': `${SITE}${opts.url}#article`,
      headline: opts.headline,
      description: opts.description,
      // Article'da görsel Google'ın önerdiği alanlardan; sayfaya özel görsel
      // olmadığı için markanın OG kartı kullanılıyor.
      image: `${SITE}${opts.locale === 'tr' ? '/images/og-image-tr.png' : '/images/og-image.png'}`,
      inLanguage: opts.locale,
      datePublished: opts.datePublished,
      dateModified: opts.dateModified ?? opts.datePublished,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      mainEntityOfPage: `${SITE}${opts.url}`,
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
    serviceType: 'Local SEO & Google Maps Optimization',
    areaServed: AREA_SERVED,
    knowsLanguage: ['tr', 'en', 'de'],
    sameAs: SAME_AS,
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
