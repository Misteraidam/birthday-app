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
  cakeMessage: string;
  finaleLetter: string;
  /** An .mp4 in public/for-her/ works best on phones */
  finaleVideoUrl: string;
  /** Looping background music. Leave as "" for no music. */
  musicUrl: string;
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

  memories: [
    {
      date: "[DATE]",
      title: "[MEMORY TITLE] The day we met",
      caption: "[One or two sentences about this moment.]",
      photo: "https://picsum.photos/seed/memory-1/800/1000",
    },
    {
      date: "[DATE]",
      title: "[MEMORY TITLE] Our first trip",
      caption: "[One or two sentences about this moment.]",
      photo: "https://picsum.photos/seed/memory-2/800/1000",
    },
    {
      date: "[DATE]",
      title: "[MEMORY TITLE] A small moment I loved",
      caption: "[One or two sentences about this moment.]",
      photo: "https://picsum.photos/seed/memory-3/800/1000",
    },
    {
      date: "[DATE]",
      title: "[MEMORY TITLE] Today",
      caption: "[One or two sentences about this moment.]",
      photo: "https://picsum.photos/seed/memory-4/800/1000",
    },
  ],

  cakeMessage: "[CAKE MESSAGE] Make a wish, then blow out the candles.",

  finaleLetter:
    "[YOUR FINAL LOVE LETTER — replace this]\n\n" +
    "Write the thing you most want her to read last.",

  finaleVideoUrl: "/for-her/video/message.mp4",
  musicUrl: "/for-her/music.mp3",
};
