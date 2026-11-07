import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { config } from "../content/config";
import { requestMotionPermission, type MotionPermission } from "./motionPermission";
import { setMusicMuted, startMusic } from "./music";
import { STAGES, isStageId, stageIndex, type StageId } from "./stages";

/** Bump the version suffix if the saved shape ever changes. */
const STORAGE_KEY = "for-her-journey-v1";
const HISTORY_KEY = "forHerStage";

interface JourneyState {
  current: StageId;
  /** Index of the furthest stage she has reached; everything up to it is revisitable */
  unlocked: number;
  muted: boolean;
  /** True once the first tap has started music and asked for motion access */
  started: boolean;
  motionPermission: MotionPermission;
  /** Per question: did she get it right first try? null until the quiz is finished */
  quizFirstTry: boolean[] | null;
  /** All candles blown out */
  cakeDone: boolean;
  /** She has read the final letter to the end */
  finaleSeen: boolean;
  /** Indexes of the "open when" letters she has opened */
  openedLetters: number[];
  /** Returning after finishing: show the welcome-back screen instead of a stage */
  welcomeBack: boolean;
  /** Where the finale should start; set by the welcome-back screen */
  finaleEntry: FinaleEntry;
}

export type FinaleEntry = "auto" | "video" | "letters";

type Action =
  | { type: "complete"; stage: StageId }
  | { type: "goTo"; stage: StageId }
  | { type: "toggleMuted" }
  | { type: "started" }
  | { type: "motionPermission"; value: MotionPermission }
  | { type: "quizFinished"; firstTry: boolean[] }
  | { type: "cakeFinished" }
  | { type: "finaleSeen" }
  | { type: "letterOpened"; index: number }
  | { type: "relive" }
  | { type: "revisitFinale"; entry: FinaleEntry };

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case "complete": {
      const index = stageIndex(action.stage);
      const next = STAGES[index + 1];
      if (!next) return state;
      return { ...state, current: next, unlocked: Math.max(state.unlocked, index + 1) };
    }
    case "goTo":
      // Linear progress: anything already reached, nothing beyond it
      return stageIndex(action.stage) <= state.unlocked
        ? { ...state, current: action.stage, finaleEntry: "auto" }
        : state;
    case "toggleMuted":
      return { ...state, muted: !state.muted };
    case "started":
      return { ...state, started: true };
    case "motionPermission":
      return { ...state, motionPermission: action.value };
    case "quizFinished":
      return { ...state, quizFirstTry: action.firstTry };
    case "cakeFinished":
      return { ...state, cakeDone: true };
    case "finaleSeen":
      return { ...state, finaleSeen: true };
    case "letterOpened":
      return state.openedLetters.includes(action.index)
        ? state
        : { ...state, openedLetters: [...state.openedLetters, action.index] };
    case "relive":
      // The whole journey again from the sealed envelope. The finale and her opened letters stay unlocked.
      return {
        ...state,
        current: "envelope",
        unlocked: 0,
        quizFirstTry: null,
        cakeDone: false,
        welcomeBack: false,
        finaleEntry: "auto",
      };
    case "revisitFinale":
      return { ...state, current: "finale", unlocked: STAGES.length - 1, welcomeBack: false, finaleEntry: action.entry };
  }
}

/** Restores saved progress so a refresh doesn't send her back to the start. `?reset` clears it. */
function loadInitialState(): JourneyState {
  const fresh: JourneyState = {
    current: "envelope",
    unlocked: 0,
    muted: false,
    started: false,
    motionPermission: "unknown",
    quizFirstTry: null,
    cakeDone: false,
    finaleSeen: false,
    openedLetters: [],
    welcomeBack: false,
    finaleEntry: "auto",
  };
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("reset")) {
      localStorage.removeItem(STORAGE_KEY);
      url.searchParams.delete("reset");
      history.replaceState(history.state, "", url);
      return fresh;
    }
    // Dev-only shortcut for testing: ?stage=timeline jumps straight there
    const jumpTo = url.searchParams.get("stage");
    if (import.meta.env.DEV && isStageId(jumpTo)) {
      return { ...fresh, current: jumpTo, unlocked: stageIndex(jumpTo) };
    }
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!saved) return fresh;
    const unlocked = Number.isInteger(saved.unlocked)
      ? Math.min(Math.max(saved.unlocked, 0), STAGES.length - 1)
      : 0;
    const current =
      isStageId(saved.current) && stageIndex(saved.current) <= unlocked ? saved.current : STAGES[unlocked];
    // Discard a saved score if the questions in config.ts have changed since
    const quizFirstTry =
      Array.isArray(saved.quizFirstTry) &&
      saved.quizFirstTry.length === config.quiz.length &&
      saved.quizFirstTry.every((v: unknown) => typeof v === "boolean")
        ? saved.quizFirstTry
        : null;
    const openedLetters = Array.isArray(saved.openedLetters)
      ? saved.openedLetters.filter((i: unknown) => Number.isInteger(i) && (i as number) < config.openWhen.length)
      : [];
    const finaleSeen = saved.finaleSeen === true;
    return {
      ...fresh,
      current,
      unlocked,
      muted: saved.muted === true,
      quizFirstTry,
      cakeDone: saved.cakeDone === true,
      finaleSeen,
      openedLetters,
      // She finished it on an earlier visit: greet her instead of dropping her mid-stage
      welcomeBack: finaleSeen,
    };
  } catch {
    return fresh;
  }
}

interface JourneyValue extends JourneyState {
  /** Marks a stage finished, unlocks the next one and moves to it */
  complete: (stage: StageId) => void;
  goTo: (stage: StageId) => void;
  back: () => void;
  toggleMuted: () => void;
  finishQuiz: (firstTry: boolean[]) => void;
  finishCake: () => void;
  markFinaleSeen: () => void;
  markLetterOpened: (index: number) => void;
  /** Welcome-back: the whole journey again from the start */
  relive: () => void;
  /** Welcome-back: straight to the video or the letters */
  revisitFinale: (entry: FinaleEntry) => void;
  /** Call synchronously from her first tap: starts music and asks for gyroscope access */
  startExperience: () => void;
}

const JourneyContext = createContext<JourneyValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const startedRef = useRef(false);
  const mutedRef = useRef(state.muted);

  const startExperience = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    // Both must begin inside the gesture, before anything async happens
    startMusic(mutedRef.current);
    const permission = requestMotionPermission();
    dispatch({ type: "started" });
    permission.then((value) => dispatch({ type: "motionPermission", value }));
  }, []);

  useEffect(() => {
    mutedRef.current = state.muted;
    setMusicMuted(state.muted);
  }, [state.muted]);

  // On a fresh visit the envelope tap starts everything. If she's returning mid-journey,
  // there is no envelope to tap, so her first tap anywhere does it instead.
  useEffect(() => {
    if (state.started || state.unlocked === 0) return;
    const onGesture = () => startExperience();
    window.addEventListener("click", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener("click", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [state.started, state.unlocked, startExperience]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          current: state.current,
          unlocked: state.unlocked,
          muted: state.muted,
          quizFirstTry: state.quizFirstTry,
          cakeDone: state.cakeDone,
          finaleSeen: state.finaleSeen,
          openedLetters: state.openedLetters,
        }),
      );
    } catch {
      // Private browsing: progress just won't survive a refresh
    }
  }, [state.current, state.unlocked, state.muted, state.quizFirstTry, state.cakeDone, state.finaleSeen, state.openedLetters]);

  // Each stage gets a history entry, so the phone's back gesture steps back a stage
  // instead of leaving the site.
  useEffect(() => {
    const saved = history.state?.[HISTORY_KEY];
    if (saved === undefined) history.replaceState({ ...history.state, [HISTORY_KEY]: state.current }, "");
    else if (saved !== state.current) history.pushState({ [HISTORY_KEY]: state.current }, "");
  }, [state.current]);

  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      const stage = event.state?.[HISTORY_KEY];
      if (isStageId(stage)) dispatch({ type: "goTo", stage });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const complete = useCallback((stage: StageId) => dispatch({ type: "complete", stage }), []);
  const goTo = useCallback((stage: StageId) => dispatch({ type: "goTo", stage }), []);
  const back = useCallback(() => {
    const previous = STAGES[stageIndex(state.current) - 1];
    if (previous) dispatch({ type: "goTo", stage: previous });
  }, [state.current]);
  const toggleMuted = useCallback(() => dispatch({ type: "toggleMuted" }), []);
  const finishQuiz = useCallback((firstTry: boolean[]) => dispatch({ type: "quizFinished", firstTry }), []);
  const finishCake = useCallback(() => dispatch({ type: "cakeFinished" }), []);
  const markFinaleSeen = useCallback(() => dispatch({ type: "finaleSeen" }), []);
  const markLetterOpened = useCallback((index: number) => dispatch({ type: "letterOpened", index }), []);
  const relive = useCallback(() => dispatch({ type: "relive" }), []);
  const revisitFinale = useCallback((entry: FinaleEntry) => dispatch({ type: "revisitFinale", entry }), []);

  const value = useMemo<JourneyValue>(
    () => ({
      ...state,
      complete,
      goTo,
      back,
      toggleMuted,
      finishQuiz,
      finishCake,
      markFinaleSeen,
      markLetterOpened,
      relive,
      revisitFinale,
      startExperience,
    }),
    [state, complete, goTo, back, toggleMuted, finishQuiz, finishCake, markFinaleSeen, markLetterOpened, relive, revisitFinale, startExperience],
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const value = useContext(JourneyContext);
  if (!value) throw new Error("useJourney must be used inside <JourneyProvider>");
  return value;
}
