import { routePath } from '../i18n/routes';
import type { Locale } from '../i18n/config';
import { formatDate } from '../i18n/v2';

/** KVKK ve çerez sayfalarının ortak bilgileri. Adres ve e-posta, portaldaki gizlilik metniyle aynıdır. */
export const KVKK_EMAIL = 'kvkk@wiserrise.com';
export const COMPANY_ADDRESS = '1209 Mountain Road Pl NE, Ste N, Albuquerque, NM 87110, ABD';
/** Adresin İngilizce ve Almanca sayfalardaki yazımı. */
export const COMPANY_ADDRESS_INTL = '1209 Mountain Road Pl NE, Ste N, Albuquerque, NM 87110, USA';
/** Şirket kaydı ve temsil; künye ve gizlilik metinleri bunu kullanır (2026-11-24, Padişah). USt-IdNr. ve EIN yazılmaz. */
export const COMPANY_REGISTER = { name: 'New Mexico Secretary of State', id: '0008117782' };
export const COMPANY_REPRESENTATIVE = { name: 'Melih Us', role: 'Managing Member' };
/** Künyedeki tek hat. */
export const COMPANY_PHONE = { display: '+90 545 505 23 86', href: '+905455052386' };
export const LEGAL_UPDATED_ISO = '2026-11-24';
export const LEGAL_UPDATED = formatDate('tr', LEGAL_UPDATED_ISO);

const LABELS: Record<Locale, [string, string]> = {
  tr: ['KVKK Aydınlatma Metni', 'Çerez Politikası'],
  en: ['Privacy Notice', 'Cookie Policy'],
  de: ['Datenschutzerklärung', 'Cookie-Richtlinie'],
};

/** Alt bilgilerdeki ve formlardaki yasal bağlantılar; ilk eleman aydınlatma metni. */
export const legalLinksFor = (locale: Locale) => [
  { href: routePath(locale, 'legal/kvkk'), label: LABELS[locale][0] },
  { href: routePath(locale, 'legal/cookies'), label: LABELS[locale][1] },
  // Künye yalnız Almanca sayfalarda zorunlu (§ 5 DDG).
  ...(locale === 'de' ? [{ href: routePath('de', 'legal/impressum'), label: 'Impressum' }] : []),
];

/** Türkçe bağlantılar (eski tasarımın alt bilgisi bunu kullanıyor). */
export const legalLinks = legalLinksFor('tr');
