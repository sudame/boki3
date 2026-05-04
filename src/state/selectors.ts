import type { AppState, ProblemAttempt } from './types';
import { LESSONS } from '../data/lessons';
import { PROBLEMS } from '../data/problems';

const TOTAL_LESSONS_GOAL = LESSONS.length;
const TOTAL_PROBLEMS_GOAL = PROBLEMS.length;
const MASTERY_GOAL = TOTAL_LESSONS_GOAL + TOTAL_PROBLEMS_GOAL;

export const inputProgress = (s: AppState) => {
  const done = Object.keys(s.lessonProgress).length;
  return { done, total: LESSONS.length, rate: LESSONS.length === 0 ? 0 : done / LESSONS.length };
};

export const latestAttemptByProblem = (s: AppState): Record<string, ProblemAttempt> => {
  const map: Record<string, ProblemAttempt> = {};
  for (const a of s.problemAttempts) {
    const prev = map[a.problemId];
    if (!prev || prev.attemptedAt < a.attemptedAt) map[a.problemId] = a;
  }
  return map;
};

export const outputAccuracy = (s: AppState) => {
  const latest = Object.values(latestAttemptByProblem(s));
  const attempted = latest.length;
  const correct = latest.filter(a => a.correct).length;
  return { attempted, correct, rate: attempted === 0 ? 0 : correct / attempted };
};

const eachDay = (startISO: string, endISO: string): string[] => {
  const out: string[] = [];
  const d = new Date(startISO + 'T00:00:00Z');
  const end = new Date(endISO + 'T00:00:00Z');
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
};

export type BurnupPoint = {
  date: string;
  actual: number | null;
  ideal: number;
  forecast: number | null;
};

const buildBurnup = (
  s: AppState,
  todayISO: string,
  goal: number,
  cumulativeAt: (date: string) => number,
): BurnupPoint[] => {
  const days = eachDay(s.startDate, s.targetDate);
  const span = days.length - 1;
  const todayActual = cumulativeAt(todayISO);
  const startMs = new Date(s.startDate + 'T00:00:00Z').getTime();
  const todayMs = new Date(todayISO + 'T00:00:00Z').getTime();
  const elapsedDays = Math.max(0, Math.round((todayMs - startMs) / 86_400_000));
  const pacePerDay = elapsedDays > 0 ? todayActual / elapsedDays : 0;

  return days.map((date, i) => {
    const ideal = span === 0 ? goal : Math.round((goal * i) / span);
    const isPastOrToday = date <= todayISO;
    const isFutureOrToday = date >= todayISO;
    const actual = isPastOrToday ? cumulativeAt(date) : null;
    let forecast: number | null = null;
    if (isFutureOrToday && elapsedDays > 0 && todayActual > 0) {
      const dayMs = new Date(date + 'T00:00:00Z').getTime();
      const daysFromToday = Math.round((dayMs - todayMs) / 86_400_000);
      forecast = Math.min(goal, todayActual + pacePerDay * daysFromToday);
    }
    return { date, actual, ideal, forecast };
  });
};

export const burnupSeries = (s: AppState, todayISO: string): BurnupPoint[] => {
  const completedDates = Object.values(s.lessonProgress)
    .map(p => p.completedAt.slice(0, 10))
    .sort();
  return buildBurnup(s, todayISO, TOTAL_LESSONS_GOAL, date => completedDates.filter(d => d <= date).length);
};

export const masteryBurnupSeries = (s: AppState, todayISO: string): BurnupPoint[] => {
  const lessonDates = Object.values(s.lessonProgress).map(p => p.completedAt.slice(0, 10)).sort();
  const attemptsByProblem = new Map<string, ProblemAttempt[]>();
  for (const a of s.problemAttempts) {
    const list = attemptsByProblem.get(a.problemId) ?? [];
    list.push(a);
    attemptsByProblem.set(a.problemId, list);
  }
  for (const list of attemptsByProblem.values()) {
    list.sort((x, y) => x.attemptedAt.localeCompare(y.attemptedAt));
  }

  const cumulativeAt = (date: string): number => {
    const lessonsDone = lessonDates.filter(d => d <= date).length;
    let problemsCorrect = 0;
    for (const list of attemptsByProblem.values()) {
      let latest: ProblemAttempt | null = null;
      for (const a of list) {
        if (a.attemptedAt.slice(0, 10) <= date) latest = a;
        else break;
      }
      if (latest?.correct) problemsCorrect += 1;
    }
    return lessonsDone + problemsCorrect;
  };

  return buildBurnup(s, todayISO, MASTERY_GOAL, cumulativeAt);
};

export const masteryProgress = (s: AppState) => {
  const lessons = Object.keys(s.lessonProgress).length;
  const correct = Object.values(latestAttemptByProblem(s)).filter(a => a.correct).length;
  const done = lessons + correct;
  return { done, total: MASTERY_GOAL, rate: MASTERY_GOAL === 0 ? 0 : done / MASTERY_GOAL };
};

export const daysRemaining = (s: AppState, todayISO: string): number => {
  const t = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const today = new Date(todayISO + 'T00:00:00Z').getTime();
  return Math.round((t - today) / (24 * 60 * 60 * 1000));
};
