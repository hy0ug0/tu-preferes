export const EMPTY_STATE_TYPES = {
  NO_QUESTIONS: "no-questions",
  ALL_ANSWERED: "all-answered",
  LOADING: "loading",
} as const;

export type EmptyStateType = (typeof EMPTY_STATE_TYPES)[keyof typeof EMPTY_STATE_TYPES];
