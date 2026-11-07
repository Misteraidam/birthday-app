import type { ComponentType } from "react";
import { lazyWithPreload } from "../../lib/lazyWithPreload";
import type { StageId } from "../../lib/stages";
import EnvelopeStage from "./envelope/EnvelopeStage";

type StageComponent = ComponentType & { preload?: () => Promise<unknown> };

/**
 * The envelope ships with the page; every later stage is its own lazily loaded chunk.
 * The app preloads the next stage while she's on the current one, which is how the
 * heavy 3D cake gets fetched in the background during the timeline.
 */
export const stageComponents: Record<StageId, StageComponent> = {
  envelope: EnvelopeStage,
  quiz: lazyWithPreload(() => import("./quiz/QuizStage")),
  timeline: lazyWithPreload(() => import("./timeline/TimelineStage")),
  // @react-three/* may only be imported inside the cake stage, so three.js stays out of the main bundle
  cake: lazyWithPreload(() => import("./cake/CakeStage")),
  finale: lazyWithPreload(() => import("./FinaleStage")),
};
