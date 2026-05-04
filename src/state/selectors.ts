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

// --- Burnup (event-based) ---

export type BurnupPoint = {
  ts: number;                 // ms since epoch
  actual: number | null;
  ideal: number | null;
  forecast: number | null;
};

export type BurnupSeries = {
  points: BurnupPoint[];      // sorted by ts
  domain: [number, number];   // [startMs, targetMs]
  goal: number;
  projectedAtTarget: number | null;
};

type ValueEvent = { ts: number; value: number };

const lessonValueEvents = (s: AppState): ValueEvent[] => {
  const sorted = Object.values(s.lessonProgress)
    .map(p => new Date(p.completedAt).getTime())
    .sort((a, b) => a - b);
  return sorted.map((ts, i) => ({ ts, value: i + 1 }));
};

// 各イベント時点での「累積マスタリ数 (完了レッスン + 最新試行が正解の問題数)」
const masteryValueEvents = (s: AppState): ValueEvent[] => {
  type Ev =
    | { ts: number; kind: 'lesson'; lessonId: string }
    | { ts: number; kind: 'attempt'; attempt: ProblemAttempt };
  const all: Ev[] = [];
  for (const [lessonId, p] of Object.entries(s.lessonProgress)) {
    all.push({ ts: new Date(p.completedAt).getTime(), kind: 'lesson', lessonId });
  }
  for (const a of s.problemAttempts) {
    all.push({ ts: new Date(a.attemptedAt).getTime(), kind: 'attempt', attempt: a });
  }
  all.sort((x, y) => x.ts - y.ts);

  const completedLessons = new Set<string>();
  const latestPerProblem: Record<string, ProblemAttempt> = {};
  let correctCount = 0;
  const out: ValueEvent[] = [];

  for (const ev of all) {
    if (ev.kind === 'lesson') {
      completedLessons.add(ev.lessonId);
    } else {
      const prev = latestPerProblem[ev.attempt.problemId];
      if (prev?.correct) correctCount -= 1;
      latestPerProblem[ev.attempt.problemId] = ev.attempt;
      if (ev.attempt.correct) correctCount += 1;
    }
    out.push({ ts: ev.ts, value: completedLessons.size + correctCount });
  }
  return out;
};

const buildEventSeries = (
  s: AppState,
  nowMs: number,
  goal: number,
  events: ValueEvent[],
): BurnupSeries => {
  const startMs = new Date(s.startDate + 'T00:00:00Z').getTime();
  const targetMs = new Date(s.targetDate + 'T23:59:59Z').getTime();

  // 「今」までに発生したイベントから現在の actual を決める
  const eventsBeforeNow = events.filter(e => e.ts <= nowMs);
  const currentActual = eventsBeforeNow.length > 0
    ? eventsBeforeNow[eventsBeforeNow.length - 1].value
    : 0;

  const elapsedMs = Math.max(0, nowMs - startMs);
  const pacePerMs = elapsedMs > 0 && currentActual > 0 ? currentActual / elapsedMs : 0;

  // 行を ts でマージ
  const rows = new Map<number, BurnupPoint>();
  const get = (ts: number): BurnupPoint => {
    let r = rows.get(ts);
    if (!r) { r = { ts, actual: null, ideal: null, forecast: null }; rows.set(ts, r); }
    return r;
  };

  // 実績イベント
  get(startMs).actual = 0;
  for (const e of events) {
    if (e.ts <= nowMs) get(e.ts).actual = e.value;
  }
  // 「今」の点を追加: 直近イベントが now より前なら、横ばい線で today まで延ばす
  if (eventsBeforeNow.length === 0 || eventsBeforeNow[eventsBeforeNow.length - 1].ts < nowMs) {
    get(nowMs).actual = currentActual;
  }

  // 理想線 (始点〜目標日)
  get(startMs).ideal = 0;
  get(targetMs).ideal = goal;

  // 予測線: 現在ペースで線形外挿し、ゴールに到達したら平坦に折れ曲がる
  let projectedAtTarget: number | null = null;
  if (pacePerMs > 0 && currentActual < goal) {
    const remainingToGoal = goal - currentActual;
    const msToGoal = remainingToGoal / pacePerMs;
    const tHitGoal = nowMs + msToGoal;
    get(nowMs).forecast = currentActual;
    if (tHitGoal <= targetMs) {
      // ペースが間に合っている: ゴール到達時刻で折れ曲がり、その後平坦
      get(tHitGoal).forecast = goal;
      get(targetMs).forecast = goal;
      projectedAtTarget = goal;
    } else {
      // ペース不足: 目標日に届かない値で終わる
      const v = currentActual + pacePerMs * (targetMs - nowMs);
      get(targetMs).forecast = v;
      projectedAtTarget = v;
    }
  } else if (currentActual >= goal) {
    projectedAtTarget = goal;
  }

  const points = [...rows.values()].sort((a, b) => a.ts - b.ts);
  return { points, domain: [startMs, targetMs], goal, projectedAtTarget };
};

const parseNow = (nowISO: string): number => {
  // 'YYYY-MM-DD' or full ISO datetime をどちらも受け取る
  const hasTime = nowISO.includes('T');
  return new Date(hasTime ? nowISO : nowISO + 'T00:00:00').getTime();
};

export const burnupSeries = (s: AppState, nowISO: string): BurnupSeries =>
  buildEventSeries(s, parseNow(nowISO), TOTAL_LESSONS_GOAL, lessonValueEvents(s));

export const masteryBurnupSeries = (s: AppState, nowISO: string): BurnupSeries =>
  buildEventSeries(s, parseNow(nowISO), MASTERY_GOAL, masteryValueEvents(s));

export const masteryProgress = (s: AppState) => {
  const lessons = Object.keys(s.lessonProgress).length;
  const correct = Object.values(latestAttemptByProblem(s)).filter(a => a.correct).length;
  const done = lessons + correct;
  return { done, total: MASTERY_GOAL, rate: MASTERY_GOAL === 0 ? 0 : done / MASTERY_GOAL };
};

// --- 配点・採点系 ---

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

export const projectedExamScore = (s: AppState): number => {
  const acc = examSectionAccuracy(s);
  let score = 0;
  for (const sec of [1, 2, 3] as ExamSection[]) {
    score += acc[sec].rate * EXAM_SECTION_MAX[sec];
  }
  return score;
};

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

export const readinessScore = (s: AppState): { score: number; source: 'mock' | 'practice' | 'none' } => {
  const mock = latestMockTotal(s);
  if (mock !== null) return { score: mock, source: 'mock' };
  const proj = projectedExamScore(s);
  if (proj > 0) return { score: proj, source: 'practice' };
  return { score: 0, source: 'none' };
};

export const requiredDailyPace = (s: AppState, todayISO: string) => {
  const lessonsTotal = LESSONS.length;
  const problemsTotal = PROBLEMS.length;
  const lessonsDone = Object.keys(s.lessonProgress).length;
  const problemsAttempted = Object.keys(latestAttemptByProblem(s)).length;
  const lessonsRemaining = Math.max(0, lessonsTotal - lessonsDone);
  const problemsRemaining = Math.max(0, problemsTotal - problemsAttempted);
  const tMs = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const todayMs = new Date(todayISO + 'T00:00:00Z').getTime();
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

export const recentWrongs = (s: AppState, todayISO: string, days: number = 7): ProblemAttempt[] => {
  const latest = latestAttemptByProblem(s);
  const cutoff = new Date(todayISO + 'T00:00:00Z');
  cutoff.setUTCDate(cutoff.getUTCDate() - days + 1);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  return Object.values(latest)
    .filter(a => !a.correct && a.attemptedAt.slice(0, 10) >= cutoffISO)
    .sort((a, b) => (a.attemptedAt < b.attemptedAt ? 1 : -1));
};

// 今日を含めた残り日数 (PaceCard と一致)
export const daysRemaining = (s: AppState, todayISO: string): number => {
  const t = new Date(s.targetDate + 'T00:00:00Z').getTime();
  const today = new Date(todayISO + 'T00:00:00Z').getTime();
  return Math.round((t - today) / 86_400_000) + 1;
};
