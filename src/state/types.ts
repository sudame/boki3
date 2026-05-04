export type LessonProgress = { completedAt: string };

export type ProblemAttempt = {
  id: string;
  problemId: string;
  correct: boolean;
  attemptedAt: string;
};

export type AppState = {
  version: 1;
  lessonProgress: Record<string, LessonProgress>;
  problemAttempts: ProblemAttempt[];
  startDate: string;   // ISO date YYYY-MM-DD
  targetDate: string;  // ISO date YYYY-MM-DD
};
