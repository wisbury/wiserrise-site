import type { AuditContent } from './index';

/**
 * English content, a translation of tr.ts. Scoring is deliberately transparent: every
 * option carries a visible point value and the total is 100. The tool is a diagnosis;
 * visitors learn what is weak even if they never write to us.
 */

const groups = [
  { id: 'temel', label: 'Category and basics', max: 30 },
  { id: 'yorum', label: 'Reviews', max: 30 },
  { id: 'tazelik', label: 'Content and freshness', max: 20 },
  { id: 'site', label: 'Website link', max: 20 },
];

const questions = [
  {
    id: 'q1',
    group: 'temel',
    question: 'Does your primary category match your main service exactly?',
    help: 'The primary category is the heaviest relevance signal in local ranking. It belongs to your main service with the highest search volume.',
    options: [
      { label: 'Yes, it matches exactly', points: 10 },
      { label: 'Close, but not exact', points: 5 },
      { label: 'Not sure / haven’t checked', points: 0 },
    ],
    advice:
      'The category is the biggest ranking change you can make with a single field. Before you start anything else, list the primary categories of the top three competitors and compare them with yours.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q2',
    group: 'temel',
    question: 'Is your service list filled in, with a description for every service?',
    help: 'On most profiles this field is either empty or full of the generic labels Google suggests, which makes it identical to your competitors’.',
    options: [
      { label: 'All written, each with a description', points: 10 },
      { label: 'There’s a list but no descriptions', points: 5 },
      { label: 'Empty, or as Google suggested it', points: 0 },
    ],
    advice:
      'Name your services with the words people actually search for, and add a description to each one. Keep these names identical to the service pages on your website.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q3',
    group: 'temel',
    question: 'Are your opening hours, phone number and website link up to date?',
    help: 'A profile that shows as closed or lists the wrong phone number loses that customer, even with a good ranking.',
    options: [
      { label: 'All three up to date, holidays included', points: 10 },
      { label: 'Mostly up to date, but I don’t check', points: 5 },
      { label: 'Some information is missing or old', points: 0 },
    ],
    advice:
      'These fields affect conversions more than rankings. Setting special hours for public holidays in particular keeps you from showing as “closed” and losing customers.',
  },
  {
    id: 'q4',
    group: 'yorum',
    question: 'How many reviews do you have?',
    options: [
      { label: '50 or more', points: 10 },
      { label: '20-49', points: 7 },
      { label: '5-19', points: 4 },
      { label: '0-4', points: 0 },
    ],
    advice:
      'Your review count is the easiest part to measure of what Google calls prominence. Set your target by the average of your top three competitors.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q5',
    group: 'yorum',
    question: 'How does your review volume compare with your top three competitors?',
    help: 'Look at the first three businesses that show up on the map for the same search.',
    options: [
      { label: 'More than theirs', points: 10 },
      { label: 'About the same', points: 6 },
      { label: 'Clearly fewer', points: 2 },
      { label: 'Haven’t looked / don’t know', points: 0 },
    ],
    advice:
      'Don’t set a target before you know your competitors’ review counts. Put a number on the gap; in the profiles we review, this is the most common reason a business falls behind.',
    link: 'services/rank-tracking' as const,
  },
  {
    id: 'q6',
    group: 'yorum',
    question: 'Do you reply to the reviews you get?',
    help: 'Replying to reviews is one of Google’s own recommendations for local ranking. Your next customer reads your reply too.',
    options: [
      { label: 'All of them, within a few days', points: 10 },
      { label: 'Some of them', points: 5 },
      { label: 'No', points: 0 },
    ],
    advice:
      'Reply to every review. With a negative review, make it right in private first, then write a short, calm reply.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q7',
    group: 'tazelik',
    question: 'Have you published a post on your profile in the last 30 days?',
    options: [
      { label: 'I post regularly', points: 10 },
      { label: 'Now and then', points: 5 },
      { label: 'No', points: 0 },
    ],
    advice:
      'Posts alone won’t get you into the top three. They show that the profile is active and give customers something current to read. Link each post to a service page on your website.',
    link: 'services/gbp' as const,
  },
  {
    id: 'q8',
    group: 'tazelik',
    question: 'Have you added new photos in the last 90 days?',
    help: 'Adding photos regularly works better than uploading thirty at once and leaving them untouched for two years.',
    options: [
      { label: 'Yes, I add them regularly', points: 10 },
      { label: 'No, not for a long time', points: 0 },
    ],
    advice:
      'Real photos of your premises and your team send a freshness signal and build the trust that stock images can’t.',
  },
  {
    id: 'q9',
    group: 'site',
    question: 'Which page of your website does your profile link to?',
    options: [
      { label: 'Homepage, plus each service linked separately', points: 10 },
      { label: 'Homepage only', points: 6 },
      { label: 'No website linked', points: 0 },
    ],
    advice:
      'Linking each service on the profile to its matching page on your website makes it easier for Google to match the two as the same business.',
    link: 'services/on-page-seo' as const,
  },
  {
    id: 'q10',
    group: 'site',
    question: 'Are the business name and phone number on your website exactly the same as on your profile?',
    help: 'NAP consistency: the same business written the same way in every source.',
    options: [
      { label: 'Yes, letter for letter', points: 10 },
      { label: 'There are small differences', points: 3 },
      { label: 'I haven’t checked', points: 0 },
    ],
    advice:
      'A name and phone number that match exactly in every source directly affect the trust Google builds up that your business is real. On profiles without a public address, this matters even more.',
    link: 'services/local-seo' as const,
  },
];

const bands = [
  {
    min: 80,
    title: 'Your foundation is solid',
    text: 'We see no root problem on the profile side. The next job is to find out, with measurement across your area, in which districts you fall behind. At this level the race is in the corners of the map where competition is heaviest.',
  },
  {
    min: 55,
    title: 'There are clear gaps',
    text: 'The profile works, but you’re behind your competitors in a few areas. Start with the weak points below.',
  },
  {
    min: 0,
    title: 'There are critical gaps',
    text: 'The profile has gaps that directly hold your ranking back. The good news: you can fix most of the items below yourself, and most of your competitors don’t look at these areas.',
  },
];

export const en: AuditContent = {
  groups,
  questions,
  bands,
  ui: {
    answered: 'questions answered',
    adviceHeading: 'Fix these first',
    adviceLink: 'How to fix it →',
    ctaLabel: 'Get a free analysis',
  },
};
