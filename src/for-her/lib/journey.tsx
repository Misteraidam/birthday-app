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
}

type Action =
  | { type: "complete"; stage: StageId }
  | { type: "goTo"; stage: StageId }
  | { type: "toggleMuted" }
  | { type: "started" }
  | { type: "motionPermission"; value: MotionPermission };

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
      return stageIndex(action.stage) <= state.unlocked ? { ...state, current: action.stage } : state;
    case "toggleMuted":
      return { ...state, muted: !state.muted };
    case "started":
      return { ...state, started: true };
    case "motionPermission":
      return { ...state, motionPermission: action.value };
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
  };
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("reset")) {
      localStorage.removeItem(STORAGE_KEY);
      url.searchParams.delete("reset");
      history.replaceState(history.state, "", url);
      return fresh;
    }
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!saved) return fresh;
    const unlocked = Number.isInteger(saved.unlocked)
      ? Math.min(Math.max(saved.unlocked, 0), STAGES.length - 1)
      : 0;
    const current =
      isStageId(saved.current) && stageIndex(saved.current) <= unlocked ? saved.current : STAGES[unlocked];
    return { ...fresh, current, unlocked, muted: saved.muted === true };
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
        JSON.stringify({ current: state.current, unlocked: state.unlocked, muted: state.muted }),
      );
    } catch {
      // Private browsing: progress just won't survive a refresh
    }
  }, [state.current, state.unlocked, state.muted]);

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

  const value = useMemo<JourneyValue>(
    () => ({ ...state, complete, goTo, back, toggleMuted, startExperience }),
    [state, complete, goTo, back, toggleMuted, startExperience],
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const value = useContext(JourneyContext);
  if (!value) throw new Error("useJourney must be used inside <JourneyProvider>");
  return value;
}
