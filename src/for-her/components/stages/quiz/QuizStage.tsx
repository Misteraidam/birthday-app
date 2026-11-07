import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../../content/config";
import { useJourney } from "../../../lib/journey";
import { HeartProgress } from "./HeartProgress";
import { QuestionView } from "./QuestionView";
import { QuizResults } from "./QuizResults";

/** Alternating resting angles for the unlocked polaroids */
const TILTS = [-4, 3, -2.5, 4, -3.5, 2];

export default function QuizStage() {
  const { quizFirstTry, finishQuiz, complete } = useJourney();
  const questions = config.quiz;
  const [index, setIndex] = useState(0);
  /** Filled in question by question: true = right on the first try */
  const [firstTry, setFirstTry] = useState<boolean[]>([]);

  // Fetch every unlock photo up front so each polaroid develops straight away
  useEffect(() => {
    questions.forEach((q) => {
      new Image().src = q.unlockPhoto;
    });
  }, [questions]);

  const next = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else finishQuiz(firstTry);
  };

  // Already finished (now or on an earlier visit): results only, never the questions again
  const finished = quizFirstTry !== null;

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5"
      style={{
        paddingTop: "calc(max(12px, env(safe-area-inset-top)) + 60px)",
        paddingBottom: "max(28px, env(safe-area-inset-bottom))",
      }}
    >
      <AnimatePresence mode="wait">
        {finished ? (
          <QuizResults key="results" firstTry={quizFirstTry} onContinue={() => complete("quiz")} />
        ) : (
          <motion.div key="questions" className="flex flex-1 flex-col" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
            <p className="text-center font-display text-sm uppercase tracking-[0.3em] text-gold-ink">
              How well do you know us?
            </p>
            <div className="mb-6 mt-3">
              <HeartProgress total={questions.length} answered={firstTry.length} current={index} />
            </div>

            <AnimatePresence mode="wait">
              <QuestionView
                key={index}
                item={questions[index]}
                tilt={TILTS[index % TILTS.length]}
                onAnswered={(right) => setFirstTry((prev) => [...prev.slice(0, index), right])}
                onNext={next}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
