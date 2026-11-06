import type { AuditContent } from './index';

/**
 * Deutsche Inhalte, Übersetzung von tr.ts. Die Bewertung ist bewusst offen: Jede Option
 * trägt sichtbare Punkte, das Maximum ist 100. Das Tool ist eine Diagnose; Besucher
 * erfahren ihre Schwachstellen, auch wenn sie uns nie schreiben.
 */

const groups = [
  { id: 'temel', label: 'Kategorie und Basisdaten', max: 30 },
  { id: 'yorum', label: 'Bewertungen', max: 30 },
  { id: 'tazelik', label: 'Inhalte und Aktualität', max: 20 },
  { id: 'site', label: 'Website-Verknüpfung', max: 20 },
];

const questions = [
  {
    id: 'q1',
    group: 'temel',
    question: 'Passt Ihre Hauptkategorie genau zu Ihrer Hauptleistung?',
    help: 'Die Hauptkategorie ist das stärkste Relevanzsignal im lokalen Ranking. Sie gehört zu der Hauptleistung mit dem höchsten Suchvolumen.',
    options: [
      { label: 'Ja, sie passt genau', points: 10 },
      { label: 'Nah dran, aber nicht genau', points: 5 },
      { label: 'Weiß ich nicht / nicht geprüft', points: 0 },
    ],
    advice:
      'Mit keinem anderen einzelnen Feld verändern Sie Ihr Ranking so stark wie mit der Kategorie. Ermitteln Sie die Hauptkategorien der ersten drei Wettbewerber und vergleichen Sie, bevor Sie irgendetwas anderes angehen.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q2',
    group: 'temel',
    question: 'Ist Ihre Leistungsliste gefüllt und hat jede Leistung eine Beschreibung?',
    help: 'In den meisten Profilen ist dieses Feld leer oder mit den allgemeinen Vorschlägen von Google gefüllt, also genau wie bei Ihren Wettbewerbern.',
    options: [
      { label: 'Alle eingetragen, jeweils mit Beschreibung', points: 10 },
      { label: 'Liste vorhanden, aber ohne Beschreibung', points: 5 },
      { label: 'Leer oder so, wie Google es vorschlägt', points: 0 },
    ],
    advice:
      'Benennen Sie Ihre Leistungen mit den Begriffen, nach denen Menschen wirklich suchen, und ergänzen Sie zu jeder eine Beschreibung. Verwenden Sie dieselben Namen wie auf den Leistungsseiten Ihrer Website.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q3',
    group: 'temel',
    question: 'Sind Öffnungszeiten, Telefonnummer und Website-Link aktuell?',
    help: 'Ein Profil, das geschlossen wirkt oder eine falsche Nummer zeigt, verliert diesen Kunden, auch wenn es gut rankt.',
    options: [
      { label: 'Alle drei aktuell, auch an Feiertagen', points: 10 },
      { label: 'Größtenteils aktuell, aber ich prüfe es nicht', points: 5 },
      { label: 'Etwas fehlt oder ist veraltet', points: 0 },
    ],
    advice:
      'Diese Felder wirken stärker auf Anfragen als auf das Ranking. Wer an Feiertagen Sonderöffnungszeiten einträgt, erscheint nicht als „geschlossen“ und verliert keine Kunden.',
  },
  {
    id: 'q4',
    group: 'yorum',
    question: 'Wie viele Bewertungen haben Sie?',
    options: [
      { label: '50 und mehr', points: 10 },
      { label: '20–49', points: 7 },
      { label: '5–19', points: 4 },
      { label: '0–4', points: 0 },
    ],
    advice:
      'Die Zahl der Bewertungen ist der am leichtesten messbare Teil dessen, was Google Bekanntheit nennt. Richten Sie Ihr Ziel am Durchschnitt der ersten drei Wettbewerber aus.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q5',
    group: 'yorum',
    question: 'Wie viele Bewertungen haben Sie im Vergleich zu den ersten drei Wettbewerbern?',
    help: 'Schauen Sie sich die ersten drei Unternehmen an, die bei derselben Suche auf der Karte erscheinen.',
    options: [
      { label: 'Mehr als diese', points: 10 },
      { label: 'Ungefähr gleich viele', points: 6 },
      { label: 'Deutlich weniger', points: 2 },
      { label: 'Nicht geprüft / weiß ich nicht', points: 0 },
    ],
    advice:
      'Setzen Sie kein Ziel, ohne die Bewertungszahlen Ihrer Wettbewerber zu kennen. Beziffern Sie den Abstand: In den Profilen, die wir prüfen, liegt hier am häufigsten der Grund für den Rückstand.',
    link: 'services/rank-tracking' as const,
  },
  {
    id: 'q6',
    group: 'yorum',
    question: 'Antworten Sie auf Bewertungen?',
    help: 'Antworten auf Bewertungen gehören zu den Empfehlungen von Google für das lokale Ranking. Ihre Antwort liest auch der nächste Kunde.',
    options: [
      { label: 'Auf alle, innerhalb weniger Tage', points: 10 },
      { label: 'Auf einige', points: 5 },
      { label: 'Nein', points: 0 },
    ],
    advice:
      'Antworten Sie auf alle Bewertungen. Bei einer negativen Bewertung klären Sie die Sache zuerst persönlich und schreiben dann eine kurze, ruhige Antwort.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q7',
    group: 'tazelik',
    question: 'Haben Sie in den letzten 30 Tagen einen Beitrag im Profil veröffentlicht?',
    options: [
      { label: 'Ich poste regelmäßig', points: 10 },
      { label: 'Ab und zu', points: 5 },
      { label: 'Nein', points: 0 },
    ],
    advice:
      'Ein Beitrag allein bringt Sie nicht unter die ersten drei. Er zeigt, dass das Profil lebt, und sagt dem Kunden etwas Aktuelles. Verlinken Sie jeden Beitrag mit einer Leistungsseite Ihrer Website.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q8',
    group: 'tazelik',
    question: 'Haben Sie in den letzten 90 Tagen neue Fotos hinzugefügt?',
    help: 'Regelmäßig neue Fotos wirken besser, als einmal dreißig hochzuladen und dann zwei Jahre nichts zu tun.',
    options: [
      { label: 'Ja, ich ergänze regelmäßig', points: 10 },
      { label: 'Nein, schon lange nicht mehr', points: 0 },
    ],
    advice:
      'Echte Fotos von Räumen und Team liefern ein Aktualitätssignal und schaffen Vertrauen, das Stockfotos nicht erzeugen.',
  },
  {
    id: 'q9',
    group: 'site',
    question: 'Mit welcher Seite Ihrer Website ist Ihr Profil verknüpft?',
    options: [
      { label: 'Startseite plus jede Leistung einzeln', points: 10 },
      { label: 'Nur die Startseite', points: 6 },
      { label: 'Keine Website verknüpft', points: 0 },
    ],
    advice:
      'Wenn Sie jede Leistung im Profil mit der passenden Seite Ihrer Website verknüpfen, erkennt Google beide leichter als dasselbe Unternehmen.',
    link: 'services/on-page-seo' as const,
  },
  {
    id: 'q10',
    group: 'site',
    question: 'Stimmen Firmenname und Telefonnummer auf Ihrer Website genau mit dem Profil überein?',
    help: 'NAP-Konsistenz: Dasselbe Unternehmen ist in allen Quellen gleich geschrieben.',
    options: [
      { label: 'Ja, Zeichen für Zeichen', points: 10 },
      { label: 'Es gibt kleine Abweichungen', points: 3 },
      { label: 'Nicht geprüft', points: 0 },
    ],
    advice:
      'Sind Name und Telefonnummer in jeder Quelle exakt gleich, stärkt das direkt das Vertrauen, das Google in die Echtheit des Unternehmens aufbaut. Bei Profilen ohne Adresse ist das noch wichtiger.',
    link: 'services/local-seo' as const,
  },
];

const bands = [
  {
    min: 80,
    title: 'Ihr Fundament steht',
    text: 'Am Profil sehen wir keinen grundlegenden Fehler. Der nächste Schritt: mit einer Messung in Ihrem Umkreis herausfinden, in welchen Stadtteilen Sie zurückliegen. Auf diesem Niveau wird der Wettbewerb in den umkämpften Ecken der Karte entschieden.',
  },
  {
    min: 55,
    title: 'Es gibt deutliche Lücken',
    text: 'Das Profil funktioniert, aber in einigen Bereichen liegen Sie hinter Ihren Wettbewerbern. Beginnen Sie mit den Schwachstellen unten. Die erste Bewegung auf der Karte sehen wir bei den meisten Unternehmen nach 4 bis 8 Wochen.',
  },
  {
    min: 0,
    title: 'Es gibt kritische Lücken',
    text: 'Im Profil fehlt etwas, das Ihr Ranking direkt bremst. Die gute Nachricht: Die meisten Punkte unten können Sie selbst beheben, und die Mehrheit Ihrer Wettbewerber kümmert sich nicht um diese Bereiche.',
  },
];

export const de: AuditContent = {
  groups,
  questions,
  bands,
  ui: {
    answered: 'Fragen beantwortet',
    adviceHeading: 'Das sollten Sie zuerst beheben',
    adviceLink: 'So beheben Sie es →',
    ctaLabel: 'Kostenlose Analyse anfordern',
  },
};
