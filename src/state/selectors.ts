import type { AppState, ProblemAttempt } from './types';
import { LESSONS } from '../data/lessons';
import { PROBLEMS, EXAM_SECTION_MAX, examSectionOf, type ExamSection } from '../data/problems';

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

export type SectionAccuracy = { attempted: number; total: number; correct: number; rate: number };

export const examSectionAccuracy = (s: AppState): Record<ExamSection, SectionAccuracy> => {
  const latest = latestAttemptByProblem(s);
  const result: Record<ExamSection, SectionAccuracy> = {
    1: { attempted: 0, total: 0, correct: 0, rate: 0 },
    2: { attempted: 0, total: 0, correct: 0, rate: 0 },
    3: { attempted: 0, total: 0, correct: 0, rate: 0 },
  };
  for (const p of PROBLEMS) {
    const sec = examSectionOf(p);
    result[sec].total += 1;
    const a = latest[p.id];
    if (a) {
      result[sec].attempted += 1;
      if (a.correct) result[sec].correct += 1;
    }
  }
  for (const sec of [1, 2, 3] as ExamSection[]) {
    const r = result[sec];
    r.rate = r.attempted === 0 ? 0 : r.correct / r.attempted;
  }
  return result;
};

// 練習問題の正答率を本試験配点で重み付けした想定本番得点 (未着手セクションは 0 点扱い)
export const projectedExamScore = (s: AppState): number => {
  const acc = examSectionAccuracy(s);
  let score = 0;
  for (const sec of [1, 2, 3] as ExamSection[]) {
    score += acc[sec].rate * EXAM_SECTION_MAX[sec];
  }
  return score;
};

// 直近の模試 (受験済み) の最高得点。なければ null
export const latestMockTotal = (s: AppState): number | null => {
  const taken = s.mockExams.filter(m => m.total !== null && m.takenAt !== null);
  if (taken.length === 0) return null;
  taken.sort((a, b) => (a.takenAt! < b.takenAt! ? 1 : -1));
  return taken[0].total!;
};

export const bestMockTotal = (s: AppState): number | null => {
  const taken = s.mockExams.filter(m => m.total !== null);
  if (taken.length === 0) return null;
  return Math.max(...taken.map(m => m.total!));
};

// 準備度: 模試があれば最新模試、なければ練習問題ベースの予想
export const readinessScore = (s: AppState): { score: number; source: 'mock' | 'practice' | 'none' } => {
  const mock = latestMockTotal(s);
  if (mock !== null) return { score: mock, source: 'mock' };
  const proj = projectedExamScore(s);
  if (proj > 0) return { score: proj, source: 'practice' };
  return { score: 0, source: 'none' };
};

// 残日数を踏まえた1日あたり必要ペース
export const requiredDailyPace = (s: AppState, todayISO: string) => {
  const lessonsTotal = LESSONS.length;
  const problemsTotal = PROBLEMS.length;
  const lessonsDone = Object.keys(s.lessonProgress).length;
  const problemsAttempted = Object.keys(latestAttemptByProblem(s)).length;
  const lessonsRemaining = Math.max(0, lessonsTotal - lessonsDone);
  const problemsRemaining = Math.max(0, problemsTotal - problemsAttempted);
  const tMs = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const todayMs = new Date(todayISO + 'T00:00:00Z').getTime();
  // 「今日を含めて残り何日で消化するか」: 目標日まで含めるので +1
  const daysLeftInclusive = Math.max(0, Math.round((tMs - todayMs) / 86_400_000) + 1);
  const lessonsPerDay = daysLeftInclusive === 0 ? lessonsRemaining : lessonsRemaining / daysLeftInclusive;
  const problemsPerDay = daysLeftInclusive === 0 ? problemsRemaining : problemsRemaining / daysLeftInclusive;
  return {
    lessonsRemaining,
    problemsRemaining,
    daysLeftInclusive,
    lessonsPerDay,
    problemsPerDay,
  };
};

// 直近 N 日に間違えた問題の最新誤答 (再挑戦キュー用)
export const recentWrongs = (s: AppState, todayISO: string, days: number = 7): ProblemAttempt[] => {
  const latest = latestAttemptByProblem(s);
  const cutoff = new Date(todayISO + 'T00:00:00Z');
  cutoff.setUTCDate(cutoff.getUTCDate() - days + 1);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  return Object.values(latest)
    .filter(a => !a.correct && a.attemptedAt.slice(0, 10) >= cutoffISO)
    .sort((a, b) => (a.attemptedAt < b.attemptedAt ? 1 : -1));
};

export const daysRemaining = (s: AppState, todayISO: string): number => {
  const t = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const today = new Date(todayISO + 'T00:00:00Z').getTime();
  return Math.round((t - today) / (24 * 60 * 60 * 1000));
};
