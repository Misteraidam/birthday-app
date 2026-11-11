/**
 * ALL personal content for the birthday journey lives in this file.
 * Components never hardcode names, letters, photos or memories: edit here only.
 *
 * Your own files (photos, music, video) go in /public/for-her/ and are referenced
 * from the site root, e.g. a file at public/for-her/photos/first-date.jpg becomes
 * "/for-her/photos/first-date.jpg". Until a photo exists, a soft placeholder shows instead.
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
  /** Optional free text shown above the title ("June 2023"). Leave out to show no date. */
  date?: string;
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
  /** Typed out on the opening letter. Blank lines start new paragraphs. */
  welcomeLetter: string;
  quiz: QuizItem[];
  quizVerdicts: QuizVerdicts;
  memories: Memory[];
  /** Closing line after the last memory */
  timelineOutro: string;
  /**
   * The candles on the cake, one per character, blown out left to right.
   * "3" and "0" are sculpted gold number candles; any other character gets a classic candle.
   */
  candleNumber: string;
  /** Appears under the cake once the candles are out */
  cakeMessage: string;
  /** Fades in before the video */
  finaleIntro: string;
  /** Video message (an .mp4 works best on phones). If the file doesn't exist, the video step is skipped. */
  finaleVideoUrl: string;
  /** Still image shown on the video before it plays. If missing, a soft gradient shows instead. */
  finaleVideoPoster: string;
  /** Revealed line by line. Each line break is a new line; a blank line adds a pause/gap. */
  finaleLetter: string;
  /** Sealed letters she can open any time after the finale */
  openWhen: OpenWhenLetter[];
  /** Looping background music. If the file doesn't exist, the journey runs silently. */
  musicUrl: string;
  /**
   * The live site's address, no trailing slash. Link previews (WhatsApp, iMessage) need the
   * full URL of the preview image. Change it if you move to a custom domain.
   */
  siteUrl: string;
}

export const config: BirthdayConfig = {
  herName: "Olive ❤️",
  myName: "Babe ❤️",

  welcomeLetter:
    "I took my time to put together these memories for you, something you can come back to at any point in your life.\n\n" +
    "Everything here is sincere. It's how I really think about you, and how happy I am to celebrate this day with you.",

  quiz: [
    {
      question: "Where did we first meet?",
      options: ["In NH1 hall", "At SSNIT Hostel", "Under a tree close to the chemistry lab", "At a party"],
      correctIndex: 2,
      wrongReaction: "Hmm… are you sure that wasn't your other boyfriend? 😂 Try again!",
      unlockPhoto: "/for-her/photos/quiz1.jpg",
      unlockCaption: "That tree has no idea what it started 🌳❤️",
    },
    {
      question: "What did I order on our first date?",
      options: ["Fried rice", "Banku and tilapia", "Pizza, Coke and fruit juice", "Waakye"],
      correctIndex: 2,
      wrongReaction: "Babe… I was trying to impress you, not fill my stomach 😂",
      unlockPhoto: "/for-her/photos/quiz2.jpg",
      unlockCaption: "Pizza, Coke, juice… and the best company 🍕",
    },
    {
      question: "What song is “our song”?",
      options: ["Perfect by Ed Sheeran", "A love song from the radio", "We don't have one… yet 😂", "Every song when we're together"],
      correctIndex: 2,
      wrongReaction: "Nice try 😂 Tell me when you heard us agree on that!",
      unlockPhoto: "/for-her/photos/quiz3.jpg",
      unlockCaption: "No song yet. Maybe we pick one today? 🎶",
    },
    {
      question: "Who said “I love you” first?",
      options: ["I did", "You did", "We said it at the same time"],
      correctIndex: 0,
      wrongReaction: "Lies! 😂 I remember exactly who was brave first.",
      unlockPhoto: "/for-her/photos/quiz4.jpg",
      unlockCaption: "I said it first, and I'd say it first again 💛",
    },
    {
      question: "What's my favourite thing about you?",
      options: ["Your smile", "The way you love me", "Your thoughtfulness", "All of the above"],
      correctIndex: 3,
      wrongReaction: "Close… but it's not just one thing, babe 😌",
      unlockPhoto: "/for-her/photos/quiz5.jpg",
      unlockCaption: "Your smile, your love, your thoughtfulness: all of you ❤️",
    },
  ],

  quizVerdicts: {
    perfect: "You know us by heart 💛 I'm impressed, babe.",
    great: "Almost perfect! I'll let the small slips slide… this time 😌",
    needMoreDates: "Okay… we clearly need more dates 😂 I'm taking notes.",
  },

  // Oldest first: the timeline reads top to bottom
  memories: [
    {
      title: "Under the Trees",
      caption:
        "You were walking by, saw me and called me “Elijah.” It was my name, but I told you it wasn't, because I didn't like being called that 😂 Somehow, that's how it all began. I still remember your smile and that innocent face. Now you just call me Babe ❤️",
      photo: "/for-her/photos/memory1.jpg",
    },
    {
      title: "Our First Date at Akayet",
      caption:
        "I'd had a rough day after trailing a course, but I didn't want anything to ruin our date, and nothing did. I enjoyed every bit of it… even when the car taking us home broke down 😂 You remember!",
      photo: "/for-her/photos/memory2.jpg",
    },
    {
      title: "Our First Trip: Prampram",
      caption:
        "Our first getaway together, and it felt like such a relief. The nights, the silly things we did… I loved every bit of it. We're doing another one soon, I promise.",
      photo: "/for-her/photos/memory3.jpg",
    },
    {
      title: "When I Wanted to Resign",
      caption:
        "When I was ready to give up on that job, you came all the way to me, just to look out for me. I'll never forget that.",
      photo: "/for-her/photos/memory4.jpg",
    },
    {
      title: "All Night, Right Beside Me",
      caption:
        "When I trailed that course, you stayed up the whole night with me while I studied. You didn't have to, but you did. That's who you are.",
      photo: "/for-her/photos/memory5.jpg",
    },
    {
      title: "That Kiss at Savanna",
      caption: "Some moments just stay with you. That kiss at Savanna is one of mine 💋",
      photo: "/for-her/photos/memory6.jpg",
    },
    {
      title: "The Hard Season",
      caption:
        "We went days without talking, and meeting up at Printex wasn't easy. But we came through it, together. And I'm so proud of where we are now.",
      photo: "/for-her/photos/memory7.jpg",
    },
  ],

  timelineOutro: "…and this is only the beginning 💛",

  candleNumber: "30",
  cakeMessage:
    "Whatever you wished for, I hope it finds you, and I'll be right here helping it come true. Happy Birthday, Olive 🎂",

  finaleIntro: "I have something to tell you…",
  finaleVideoUrl: "/for-her/video.mp4",
  finaleVideoPoster: "/for-her/video-poster.jpg",

  finaleLetter:
    "Olive,\n" +
    "\n" +
    "From the day you called me “Elijah” under those trees and I pretended that wasn't my name, my life has been better with you in it. You found a better name for me anyway: Babe ❤️\n" +
    "\n" +
    "You've seen me on my good days and on my hard ones. You stayed up all night when I was struggling, you came all the way to me when I wanted to give up, and even when we went through our hard season, we found our way back to each other. That means everything to me.\n" +
    "\n" +
    "I love your smile, your thoughtfulness, the way you love me, and how you always find a way to make me laugh. I don't say it enough, but I see all of it, and I'm grateful for you every day.\n" +
    "\n" +
    "Today you turn 30, and I hope this year brings you everything you've been praying for. I hope I get to be right beside you for all of it.\n" +
    "\n" +
    "Happy Birthday, my love. ❤️",

  openWhen: [
    {
      label: "Open when you miss me",
      letter:
        "Close your eyes and think about Prampram: the nights, the silly things we did, how free it felt. That's us. Wherever I am, I'm thinking about you too, and I'm already counting down to our next trip. Call me. I'll pick up. ❤️",
    },
    {
      label: "Open when you can't sleep",
      letter:
        "If you're awake right now, I hope you're smiling a little, because somewhere I'm probably dreaming about you 😌 Remember that night you stayed up with me while I studied? Tonight, I'm staying up with you in this letter. Breathe slowly, rest your mind, and know you're loved. Goodnight, my love 🌙",
    },
    {
      label: "Open when you need a laugh",
      letter:
        "Remember when you tickled me and I couldn't stop laughing? 😂 I was completely helpless, and you were enjoying every second of it. Or when you called me “Elijah” and I acted like that wasn't my name? Or when the car broke down after our first date at Akayet? Our story is full of moments like these, and I wouldn't trade a single one. Now go find me so I can get my revenge 😂😂",
    },
    {
      label: "Open when you're having a bad day",
      letter:
        "Today might be hard, but you are not. You're thoughtful, strong and beautiful, and you've carried me through my own bad days without even being asked. Let me carry you through this one. Whatever it is, we'll get through it together, like we always do. I'm proud of you, always. 💛",
    },
  ],

  musicUrl: "/for-her/music.mp3",
  siteUrl: "https://birthday-app-alpha-seven.vercel.app",
};
