/**
 * ALL personal content for the birthday journey lives in this file.
 * Components never hardcode names, letters, photos or memories: edit here only.
 *
 * Your own files (photos, music, video) go in /public/for-her/ and are referenced
 * from the site root, e.g. a file at public/for-her/photos/first-date.jpg becomes
 * "/for-her/photos/first-date.jpg".
 */

export interface QuizItem {
  question: string;
  /** 2–4 answers work best on a phone screen */
  options: string[];
  /** Index into `options` of the right answer (0 = first option) */
  correctIndex: number;
  /** Shown when she picks a wrong answer: keep it playful */
  wrongReaction: string;
  /** Photo revealed when she gets it right */
  unlockPhoto: string;
  unlockCaption: string;
}

/** Results-card verdicts, picked by how many she got right on the first try */
export interface QuizVerdicts {
  /** Every question right first try */
  perfect: string;
  /** At least half right first try */
  great: string;
  /** Fewer than half */
  needMoreDates: string;
}

export interface Memory {
  /** Free text, shown as-is: "June 2023", "Our first Christmas", ... */
  date: string;
  title: string;
  caption: string;
  photo: string;
}

export interface OpenWhenLetter {
  /** Shown on the sealed envelope, e.g. "Open when you miss me" */
  label: string;
  letter: string;
}

export interface BirthdayConfig {
  herName: string;
  myName: string;
  /** YYYY-MM-DD */
  birthdayDate: string;
  /** Typed out on the opening letter. Blank lines start new paragraphs. */
  welcomeLetter: string;
  quiz: QuizItem[];
  quizVerdicts: QuizVerdicts;
  memories: Memory[];
  /** Closing line after the last memory */
  timelineOutro: string;
  /** Candles on the cake (1–24) */
  candleCount: number;
  /** Appears under the cake once the candles are out */
  cakeMessage: string;
  /** Fades in before the video */
  finaleIntro: string;
  /** Video message. An .mp4 in public/for-her/video/ works best on phones. "" = no video step. */
  finaleVideoUrl: string;
  /** Still image shown on the video before it plays */
  finaleVideoPoster: string;
  /** Revealed line by line. Each line break is a new line; a blank line adds a pause/gap. */
  finaleLetter: string;
  /** Sealed letters she can open any time after the finale */
  openWhen: OpenWhenLetter[];
  /** Looping background music. Leave as "" for no music. */
  musicUrl: string;
  /**
   * The live site's address, no trailing slash. Link previews (WhatsApp, iMessage) need the
   * full URL of the preview image. Change it if you move to a custom domain.
   */
  siteUrl: string;
}

export const config: BirthdayConfig = {
  herName: "[HER NAME]",
  myName: "[YOUR NAME]",
  birthdayDate: "2026-12-01",

  welcomeLetter:
    "[YOUR WELCOME LETTER — replace this]\n\n" +
    "I made you a small world for today, one page at a time. Take it slowly. Every page you open unlocks the next.\n\n" +
    "There's music, a few questions only you can answer, some of our favourite moments, and something at the very end I've been saving for you.\n\n" +
    "Ready when you are.",

  quiz: [
    {
      question: "[QUESTION 1] Where did we first meet?",
      options: ["[Right answer]", "[Wrong answer]", "[Wrong answer]"],
      correctIndex: 0,
      wrongReaction: "[Playful reaction] Excuse me?? Try again 😤",
      unlockPhoto: "https://picsum.photos/seed/quiz-1/800/1000",
      unlockCaption: "[Caption for the photo this unlocks]",
    },
    {
      question: "[QUESTION 2] What did I order on our first date?",
      options: ["[Wrong answer]", "[Right answer]", "[Wrong answer]"],
      correctIndex: 1,
      wrongReaction: "[Playful reaction] I'm wounded. Deeply.",
      unlockPhoto: "https://picsum.photos/seed/quiz-2/800/1000",
      unlockCaption: "[Caption for the photo this unlocks]",
    },
    {
      question: "[QUESTION 3] Which song is 'ours'?",
      options: ["[Wrong answer]", "[Wrong answer]", "[Right answer]"],
      correctIndex: 2,
      wrongReaction: "[Playful reaction] We need to talk about this.",
      unlockPhoto: "https://picsum.photos/seed/quiz-3/800/1000",
      unlockCaption: "[Caption for the photo this unlocks]",
    },
    {
      question: "[QUESTION 4] Who said 'I love you' first?",
      options: ["[Right answer]", "[Wrong answer]"],
      correctIndex: 0,
      wrongReaction: "[Playful reaction] Rewriting history, are we? 👀",
      unlockPhoto: "https://picsum.photos/seed/quiz-4/800/1000",
      unlockCaption: "[Caption for the photo this unlocks]",
    },
    {
      question: "[QUESTION 5] What's my favourite thing about you?",
      options: ["[Wrong answer]", "[Wrong answer]", "[Wrong answer]", "[Right answer]"],
      correctIndex: 3,
      wrongReaction: "[Playful reaction] Close… but there's something I love even more.",
      unlockPhoto: "https://picsum.photos/seed/quiz-5/800/1000",
      unlockCaption: "[Caption for the photo this unlocks]",
    },
  ],

  quizVerdicts: {
    perfect: "[PERFECT SCORE] Flawless. You clearly pay attention. 😌",
    great: "[GREAT SCORE] Pretty impressive. I'll let the misses slide… this time.",
    needMoreDates: "[LOW SCORE] Okay. We clearly need more dates. Lots more. 💌",
  },

  // Oldest first: the timeline reads top to bottom
  memories: [
    {
      date: "[DATE e.g. June 2023]",
      title: "[MEMORY TITLE] The day we met",
      caption: "[One or two sentences about this moment: what you remember, how it felt.]",
      photo: "https://picsum.photos/seed/memory-1/800/1000",
    },
    {
      date: "[DATE e.g. June 2023]",
      title: "[MEMORY TITLE] Our first date",
      caption: "[One or two sentences about this moment: what you remember, how it felt.]",
      photo: "https://picsum.photos/seed/memory-2/800/1000",
    },
    {
      date: "[DATE e.g. June 2023]",
      title: "[MEMORY TITLE] Our first trip together",
      caption: "[One or two sentences about this moment: what you remember, how it felt.]",
      photo: "https://picsum.photos/seed/memory-3/800/1000",
    },
    {
      date: "[DATE e.g. June 2023]",
      title: "[MEMORY TITLE] A small moment I loved",
      caption: "[One or two sentences about this moment: what you remember, how it felt.]",
      photo: "https://picsum.photos/seed/memory-4/800/1000",
    },
    {
      date: "[DATE e.g. June 2023]",
      title: "[MEMORY TITLE] A hard season, and how we got through it",
      caption: "[One or two sentences about this moment: what you remember, how it felt.]",
      photo: "https://picsum.photos/seed/memory-5/800/1000",
    },
    {
      date: "[DATE e.g. June 2023]",
      title: "[MEMORY TITLE] Today",
      caption: "[One or two sentences about this moment: what you remember, how it felt.]",
      photo: "https://picsum.photos/seed/memory-6/800/1000",
    },
  ],

  timelineOutro: "...and this is only the beginning 💛",

  candleCount: 5,
  cakeMessage: "[CAKE MESSAGE] Make a wish, then blow out the candles.",

  finaleIntro: "I have something to tell you...",
  // Placeholder: a short public-domain sample clip so you can see the video step. Replace with yours.
  finaleVideoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  finaleVideoPoster: "/for-her/video/poster.jpg",

  finaleLetter:
    "[YOUR FINAL LOVE LETTER — replace this]\n" +
    "Each line appears one at a time,\n" +
    "so write it the way you'd say it out loud.\n" +
    "\n" +
    "A blank line makes a small pause.\n" +
    "\n" +
    "Write the thing you most want her to read last.",

  openWhen: [
    { label: "Open when you miss me", letter: "[LETTER] What to read when I'm not there." },
    { label: "Open when you can't sleep", letter: "[LETTER] Something soft for 2am." },
    { label: "Open when you need a laugh", letter: "[LETTER] That story you always make me retell." },
    { label: "Open when you're having a bad day", letter: "[LETTER] Reminders of how amazing you are." },
  ],

  musicUrl: "/for-her/music.mp3",
  siteUrl: "https://birthday-app-alpha-seven.vercel.app",
};
