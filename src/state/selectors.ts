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

export type BurnupPoint = { date: string; actual: number; ideal: number };

export const burnupSeries = (s: AppState): BurnupPoint[] => {
  const days = eachDay(s.startDate, s.targetDate);
  const completedDates = Object.values(s.lessonProgress)
    .map(p => p.completedAt.slice(0, 10))
    .sort();
  const goal = TOTAL_LESSONS_GOAL;
  const span = days.length - 1;
  return days.map((date, i) => {
    const actual = completedDates.filter(d => d <= date).length;
    const ideal = span === 0 ? goal : Math.round((goal * i) / span);
    return { date, actual, ideal };
  });
};

export const daysRemaining = (s: AppState, todayISO: string): number => {
  const t = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const today = new Date(todayISO + 'T00:00:00Z').getTime();
  return Math.round((t - today) / (24 * 60 * 60 * 1000));
};
