import type { AppState, MockExam } from './types';

export const STORAGE_KEY = 'boki3-state-v1';

const todayISO = (): string => new Date().toISOString().slice(0, 10);

const addDaysISO = (iso: string, days: number): string => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const createInitialMockExams = (): MockExam[] => [
  { no: 1, takenAt: null, total: null, q1: null, q2: null, q3: null },
  { no: 2, takenAt: null, total: null, q1: null, q2: null, q3: null },
  { no: 3, takenAt: null, total: null, q1: null, q2: null, q3: null },
];

export const createInitialState = (): AppState => {
  const start = todayISO();
  return {
    version: 1,
    lessonProgress: {},
    problemAttempts: [],
    mockExams: createInitialMockExams(),
    startDate: start,
    targetDate: addDaysISO(start, 6),
  };
};

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return createInitialState();
    return {
      ...createInitialState(),
      ...parsed,
      mockExams: parsed.mockExams ?? createInitialMockExams(),
    } as AppState;
  } catch {
    return createInitialState();
  }
};

export const saveState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
