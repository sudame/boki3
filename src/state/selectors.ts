import type { AppState, ProblemAttempt } from './types';
import { LESSONS } from '../data/lessons';

const TOTAL_LESSONS_GOAL = 46;

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

export const burnupSeries = (s: AppState, todayISO: string): BurnupPoint[] => {
  const days = eachDay(s.startDate, s.targetDate);
  const completedDates = Object.values(s.lessonProgress)
    .map(p => p.completedAt.slice(0, 10))
    .sort();
  const goal = TOTAL_LESSONS_GOAL;
  const span = days.length - 1;
  const todayActual = completedDates.filter(d => d <= todayISO).length;
  const startMs = new Date(s.startDate + 'T00:00:00Z').getTime();
  const todayMs = new Date(todayISO + 'T00:00:00Z').getTime();
  const elapsedDays = Math.max(0, Math.round((todayMs - startMs) / 86_400_000));
  const pacePerDay = elapsedDays > 0 ? todayActual / elapsedDays : 0;

  return days.map((date, i) => {
    const ideal = span === 0 ? goal : Math.round((goal * i) / span);
    const isPastOrToday = date <= todayISO;
    const isFutureOrToday = date >= todayISO;
    const actual = isPastOrToday ? completedDates.filter(d => d <= date).length : null;
    let forecast: number | null = null;
    if (isFutureOrToday && elapsedDays > 0 && todayActual > 0) {
      const dayMs = new Date(date + 'T00:00:00Z').getTime();
      const daysFromToday = Math.round((dayMs - todayMs) / 86_400_000);
      forecast = Math.min(goal, Math.round(todayActual + pacePerDay * daysFromToday));
    }
    return { date, actual, ideal, forecast };
  });
};

export const daysRemaining = (s: AppState, todayISO: string): number => {
  const t = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const today = new Date(todayISO + 'T00:00:00Z').getTime();
  return Math.round((t - today) / (24 * 60 * 60 * 1000));
};
