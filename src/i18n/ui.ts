import type { Locale } from './config';

/**
 * Chrome strings (nav + footer). Page body copy stays in the page files —
 * only shell text that every page repeats lives here.
 */
export const ui = {
  en: {
    nav: {
      beforeAfter: 'Before / After',
      process: 'How it Works',
      faq: 'FAQ',
      audit: 'Free Audit',
      services: 'Services',
      industries: 'Industries',
      cases: 'Case Studies',
      guides: 'Guides',
      tool: 'Free profile audit',
    },
    footer: {
      tagline: 'Local SEO & Google Maps Growth for ambitious businesses.',
      sub: 'Built for local businesses that want real ranking movement.',
      rights: 'All rights reserved.',
      brandOf: 'Wiserrise is a brand of Wisbury LLC.',
      claim: 'Own Your City on Google',
    },
    menuLabel: 'Open menu',
  },
  tr: {
    nav: {
      beforeAfter: 'Öncesi / Sonrası',
      process: 'Nasıl Çalışıyor',
      faq: 'SSS',
      audit: 'Ücretsiz Analiz',
      services: 'Hizmetler',
      industries: 'Sektörler',
      cases: 'Vakalar',
      guides: 'Rehber',
      tool: 'Ücretsiz profil denetimi',
    },
    footer: {
      tagline: 'Hedefi olan işletmeler için Local SEO & Google Maps büyümesi.',
      sub: 'Gerçek sıralama artışı isteyen yerel işletmeler için.',
      rights: 'Tüm hakları saklıdır.',
      brandOf: 'Wiserrise, Wisbury LLC’nin bir markasıdır.',
      claim: 'Google’da kendi Şehrinde ilk 3 - Garantili',
    },
    menuLabel: 'Menüyü aç',
  },
  de: {
    nav: {
      beforeAfter: 'Vorher / Nachher',
      process: "So funktioniert's",
      faq: 'FAQ',
      audit: 'Kostenlose Analyse',
      services: 'Leistungen',
      industries: 'Branchen',
      cases: 'Fallstudien',
      guides: 'Ratgeber',
      tool: 'Kostenlose Profilanalyse',
    },
    footer: {
      tagline: 'Lokale SEO & Google Maps Wachstum für ambitionierte Unternehmen.',
      sub: 'Für lokale Unternehmen, die echte Ranking-Bewegung wollen.',
      rights: 'Alle Rechte vorbehalten.',
      brandOf: 'Wiserrise ist eine Marke der Wisbury LLC.',
      claim: 'Beherrschen Sie Ihre Stadt bei Google',
    },
    menuLabel: 'Menü öffnen',
  },
} as const satisfies Record<Locale, unknown>;

export function t(locale: Locale) {
  return ui[locale];
}

/**
 * Legal entity behind the Wiserrise brand. Copyright, contracts and invoices
 * are in this name; the brand itself is not a company.
 */
export const COMPANY_LEGAL_NAME = 'Wisbury LLC';

/** Contact address differs per locale on the live site. */
export const CONTACT_EMAIL: Record<Locale, string> = {
  en: 'audit@wiserrise.com',
  tr: 'melih@wiserrise.com',
  de: 'melih@wiserrise.com',
};

/**
 * Visible phone number, per locale.
 *
 * Only Turkish gets one: a Turkish mobile number on the English and German
 * pages would read as a dead end for those visitors. The number still lives in
 * the Organization schema for every locale, because that describes one business
 * entity rather than what a given page shows.
 *
 * `display` matches the Google Business Profile character for character — that
 * is the whole point of NAP consistency. `href` stays in E.164 so tapping it
 * dials correctly from abroad too.
 */
export const CONTACT_PHONE: Partial<Record<Locale, { display: string; href: string }>> = {
  tr: { display: '0545 505 23 86', href: '+905455052386' },
};
