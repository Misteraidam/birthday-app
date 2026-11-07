export const STAGES = ["envelope", "quiz", "timeline", "cake", "finale"] as const;

export type StageId = (typeof STAGES)[number];

export const STAGE_LABELS: Record<StageId, string> = {
  envelope: "Letter",
  quiz: "Quiz",
  timeline: "Our story",
  cake: "Cake",
  finale: "Finale",
};

export const stageIndex = (id: StageId) => STAGES.indexOf(id);

export const isStageId = (value: unknown): value is StageId =>
  typeof value === "string" && (STAGES as readonly string[]).includes(value);
