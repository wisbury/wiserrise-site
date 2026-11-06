import { routePath, type RouteKey } from '../i18n/routes';
import type { Locale } from '../i18n/config';

/** Yerel SEO rehberleri: rehber sayfası hepsini, alt bilgideki Makalelerimiz `featured` olanları listeler. */
const KEYS: { key: RouteKey; featured: boolean }[] = [
  { key: 'guides/not-showing', featured: true },
  { key: 'guides/create-profile', featured: false },
  { key: 'guides/rank-higher', featured: true },
  { key: 'guides/more-reviews', featured: true },
  { key: 'guides/verification', featured: false },
];

const COPY: Record<Locale, { label: string; title: string; text: string }[]> = {
  tr: [
    { label: 'GÖRÜNÜRLÜK', title: 'İşletmeniz Google’da neden çıkmıyor?', text: 'Sekiz sebebi, en hızlı kontrol edilenden başlayarak sırayla eleyen bir teşhis akışı.' },
    { label: 'PROFİL AÇMA', title: 'Google İşletme Profili nasıl açılır?', text: 'Form on dakika sürer. Asıl iş, sonradan düzeltmesi zor iki karar: adresi göstermek ve birincil kategori.' },
    { label: 'HARİTA SIRALAMASI', title: 'Google Haritalar’da üst sıraya nasıl çıkılır?', text: 'Google sırayı alaka, mesafe ve bilinirliğe göre verir. Değiştirebildiğiniz iki etkende hangi sırayla çalışacağınız.' },
    { label: 'YORUMLAR', title: 'Google yorumları nasıl artırılır?', text: 'Yorumu ne zaman ve nasıl isteyeceğiniz, kurala aykırı yollar ve olumsuz yoruma nasıl yanıt vereceğiniz.' },
    { label: 'DOĞRULAMA', title: 'Doğrulama sorunları nasıl çözülür?', text: 'Kart gelmedi, video reddedildi, profil askıya alındı. Her durumda ne yapacağınız ve neden yeni profil açmamanız gerektiği.' },
  ],
  en: [
    { label: 'VISIBILITY', title: 'Why isn’t your business showing up on Google?', text: 'A diagnostic flow that rules out eight causes one by one, starting with the quickest to check.' },
    { label: 'CREATING A PROFILE', title: 'How do you create a Google Business Profile?', text: 'The form takes ten minutes. The real work is two decisions that are hard to undo: showing your address and the primary category.' },
    { label: 'MAP RANKINGS', title: 'How do you rank higher on Google Maps?', text: 'Google ranks by relevance, distance and prominence. The order to work on the two factors you can change.' },
    { label: 'REVIEWS', title: 'How do you get more Google reviews?', text: 'When and how to ask for a review, the shortcuts that break the rules and how to reply to a negative review.' },
    { label: 'VERIFICATION', title: 'How do you fix verification problems?', text: 'The postcard never came, the video was rejected, the profile was suspended. What to do in each case and why you should not open a new profile.' },
  ],
  de: [
    { label: 'SICHTBARKEIT', title: 'Warum erscheint Ihr Unternehmen nicht bei Google?', text: 'Ein Diagnoseablauf, der acht Ursachen nacheinander ausschließt, beginnend mit der schnellsten Prüfung.' },
    { label: 'PROFIL ERSTELLEN', title: 'Wie erstellt man ein Google-Unternehmensprofil?', text: 'Das Formular dauert zehn Minuten. Die eigentliche Arbeit sind zwei Entscheidungen, die sich schwer ändern lassen: Adresse anzeigen und Hauptkategorie.' },
    { label: 'KARTEN-RANKING', title: 'Wie rankt man bei Google Maps höher?', text: 'Google sortiert nach Relevanz, Entfernung und Bekanntheit. In welcher Reihenfolge Sie an den zwei Faktoren arbeiten, die Sie ändern können.' },
    { label: 'BEWERTUNGEN', title: 'Wie bekommt man mehr Google-Bewertungen?', text: 'Wann und wie Sie um eine Bewertung bitten, welche Abkürzungen gegen die Regeln verstoßen und wie Sie auf Kritik antworten.' },
    { label: 'VERIFIZIERUNG', title: 'Wie löst man Probleme bei der Verifizierung?', text: 'Die Postkarte kam nicht, das Video wurde abgelehnt, das Profil wurde gesperrt. Was in jedem Fall zu tun ist und warum Sie kein neues Profil anlegen sollten.' },
  ],
};

export const guidesFor = (locale: Locale) =>
  KEYS.map((g, i) => ({ href: routePath(locale, g.key), featured: g.featured, ...COPY[locale][i] }));

export const guides = guidesFor('tr');
