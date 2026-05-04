export type LessonProgress = { completedAt: string };

export type ProblemAttempt = {
  id: string;
  problemId: string;
  correct: boolean;
  attemptedAt: string;
};

export type ExamSection = 1 | 2 | 3;

export type MockExam = {
  no: 1 | 2 | 3;
  takenAt: string | null;   // YYYY-MM-DD
  total: number | null;     // 0-100
  q1: number | null;        // 0-45
  q2: number | null;        // 0-20
  q3: number | null;        // 0-35
};

export type AppState = {
  version: 1;
  lessonProgress: Record<string, LessonProgress>;
  problemAttempts: ProblemAttempt[];
  mockExams: MockExam[];
  startDate: string;
  targetDate: string;
};
