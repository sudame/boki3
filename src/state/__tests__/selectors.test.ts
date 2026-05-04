import { describe, it, expect } from 'vitest';
import {
  inputProgress,
  outputAccuracy,
  burnupSeries,
  masteryBurnupSeries,
  masteryProgress,
  daysRemaining,
  latestAttemptByProblem,
} from '../selectors';
import type { AppState } from '../types';

const baseState = (overrides: Partial<AppState> = {}): AppState => ({
  version: 1,
  lessonProgress: {},
  problemAttempts: [],
  mockExams: [
    { no: 1, takenAt: null, total: null, q1: null, q2: null, q3: null },
    { no: 2, takenAt: null, total: null, q1: null, q2: null, q3: null },
    { no: 3, takenAt: null, total: null, q1: null, q2: null, q3: null },
  ],
  startDate: '2026-05-04',
  targetDate: '2026-05-10',
  ...overrides,
});

describe('inputProgress', () => {
  it('returns 0 when nothing completed', () => {
    expect(inputProgress(baseState()).done).toBe(0);
    expect(inputProgress(baseState()).total).toBe(46);
    expect(inputProgress(baseState()).rate).toBe(0);
  });
  it('counts completed lessons', () => {
    const s = baseState({ lessonProgress: { 'lesson-01': { completedAt: '2026-05-04T10:00:00Z' }, 'lesson-02': { completedAt: '2026-05-04T11:00:00Z' } } });
    expect(inputProgress(s).done).toBe(2);
    expect(inputProgress(s).rate).toBeCloseTo(2 / 46);
  });
});

describe('latestAttemptByProblem', () => {
  it('keeps the latest attempt per problem', () => {
    const s = baseState({
      problemAttempts: [
        { id: 'a', problemId: 'p1-01', correct: false, attemptedAt: '2026-05-04T10:00:00Z' },
        { id: 'b', problemId: 'p1-01', correct: true,  attemptedAt: '2026-05-04T11:00:00Z' },
        { id: 'c', problemId: 'p1-02', correct: true,  attemptedAt: '2026-05-04T10:00:00Z' },
      ],
    });
    const map = latestAttemptByProblem(s);
    expect(map['p1-01']?.correct).toBe(true);
    expect(map['p1-02']?.correct).toBe(true);
  });
});

describe('outputAccuracy', () => {
  it('returns 0 when no attempts', () => {
    expect(outputAccuracy(baseState())).toEqual({ attempted: 0, correct: 0, rate: 0 });
  });
  it('uses latest attempt per problem', () => {
    const s = baseState({
      problemAttempts: [
        { id: 'a', problemId: 'p1-01', correct: false, attemptedAt: '2026-05-04T10:00:00Z' },
        { id: 'b', problemId: 'p1-01', correct: true,  attemptedAt: '2026-05-04T11:00:00Z' },
        { id: 'c', problemId: 'p1-02', correct: false, attemptedAt: '2026-05-04T10:00:00Z' },
      ],
    });
    const acc = outputAccuracy(s);
    expect(acc.attempted).toBe(2);
    expect(acc.correct).toBe(1);
    expect(acc.rate).toBe(0.5);
  });
});

describe('burnupSeries (event-based)', () => {
  const startMs = (iso: string) => new Date(iso + 'T00:00:00Z').getTime();
  const targetMs = (iso: string) => new Date(iso + 'T23:59:59Z').getTime();

  it('exposes domain and goal', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-06' });
    const series = burnupSeries(s, '2026-05-06');
    expect(series.goal).toBe(46);
    expect(series.domain[0]).toBe(startMs('2026-05-04'));
    expect(series.domain[1]).toBe(targetMs('2026-05-06'));
  });

  it('ideal endpoints anchor 0 → goal at start/target', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-06' });
    const { points, domain, goal } = burnupSeries(s, '2026-05-06');
    const idealAtStart = points.find(p => p.ts === domain[0])!.ideal;
    const idealAtTarget = points.find(p => p.ts === domain[1])!.ideal;
    expect(idealAtStart).toBe(0);
    expect(idealAtTarget).toBe(goal);
  });

  it('emits one actual point per completion event with cumulative value', () => {
    const s = baseState({
      startDate: '2026-05-04',
      targetDate: '2026-05-10',
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-04T10:00:00Z' },
        'lesson-02': { completedAt: '2026-05-05T10:00:00Z' },
        'lesson-03': { completedAt: '2026-05-05T11:00:00Z' },
      },
    });
    const { points } = burnupSeries(s, '2026-05-06T00:00:00Z');
    const actualPts = points.filter(p => p.actual !== null).map(p => ({ ts: p.ts, v: p.actual }));
    // start (0) + 3 events + now (3) = 5 points
    expect(actualPts.length).toBeGreaterThanOrEqual(5);
    const event1 = actualPts.find(p => p.ts === new Date('2026-05-04T10:00:00Z').getTime());
    const event2 = actualPts.find(p => p.ts === new Date('2026-05-05T10:00:00Z').getTime());
    const event3 = actualPts.find(p => p.ts === new Date('2026-05-05T11:00:00Z').getTime());
    expect(event1?.v).toBe(1);
    expect(event2?.v).toBe(2);
    expect(event3?.v).toBe(3);
  });

  it('extends actual line to "now" with current value when last event is in the past', () => {
    const s = baseState({
      startDate: '2026-05-04',
      targetDate: '2026-05-10',
      lessonProgress: { 'lesson-01': { completedAt: '2026-05-04T10:00:00Z' } },
    });
    const nowMs = new Date('2026-05-05T12:00:00Z').getTime();
    const { points } = burnupSeries(s, '2026-05-05T12:00:00Z');
    const nowPt = points.find(p => p.ts === nowMs);
    expect(nowPt?.actual).toBe(1);
  });

  it('forecast at target uses current pace', () => {
    const s = baseState({
      startDate: '2026-05-01',
      targetDate: '2026-05-08',
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-01T00:00:00Z' },
        'lesson-02': { completedAt: '2026-05-02T00:00:00Z' },
        'lesson-03': { completedAt: '2026-05-03T00:00:00Z' },
        'lesson-04': { completedAt: '2026-05-04T00:00:00Z' },
      },
    });
    // now=2026-05-04T00:00 → elapsed=3 days, done=4 → pace=4/3 per day
    // target=2026-05-08T23:59:59 → ~4.999 days from now → 4 + 4/3 * 4.999 ≈ 10.66 (clamped at goal=46 → 10.66)
    const series = burnupSeries(s, '2026-05-04T00:00:00Z');
    expect(series.projectedAtTarget).not.toBeNull();
    expect(series.projectedAtTarget!).toBeGreaterThan(10);
    expect(series.projectedAtTarget!).toBeLessThan(11);
  });

  it('forecast is null when no events have happened', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-10' });
    const series = burnupSeries(s, '2026-05-05');
    expect(series.projectedAtTarget).toBeNull();
    expect(series.points.every(p => p.forecast === null)).toBe(true);
  });
});

describe('masteryBurnupSeries (event-based)', () => {
  it('actual reflects historically accurate latest-correct status', () => {
    const s = baseState({
      startDate: '2026-05-01',
      targetDate: '2026-05-10',
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-01T10:00:00Z' },
      },
      problemAttempts: [
        { id: 'a', problemId: 'p1-01', correct: true,  attemptedAt: '2026-05-02T10:00:00Z' },
        { id: 'b', problemId: 'p1-02', correct: true,  attemptedAt: '2026-05-02T11:00:00Z' },
        { id: 'c', problemId: 'p1-02', correct: false, attemptedAt: '2026-05-04T10:00:00Z' },
      ],
    });
    const { points } = masteryBurnupSeries(s, '2026-05-05');
    const at = (iso: string) => points.find(p => p.ts === new Date(iso).getTime());
    expect(at('2026-05-01T10:00:00Z')?.actual).toBe(1);
    expect(at('2026-05-02T10:00:00Z')?.actual).toBe(2);
    expect(at('2026-05-02T11:00:00Z')?.actual).toBe(3);
    // p1-02 flips to wrong → drops to 2
    expect(at('2026-05-04T10:00:00Z')?.actual).toBe(2);
  });
  it('ideal endpoints reach lessons + problems total', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-06' });
    const series = masteryBurnupSeries(s, '2026-05-06');
    const idealAtTarget = series.points.find(p => p.ts === series.domain[1])!.ideal!;
    expect(idealAtTarget).toBeGreaterThanOrEqual(70);
    expect(idealAtTarget).toBe(series.goal);
  });
});

describe('masteryProgress', () => {
  it('counts completed lessons + problems whose latest attempt is correct', () => {
    const s = baseState({
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-04T10:00:00Z' },
        'lesson-02': { completedAt: '2026-05-04T11:00:00Z' },
      },
      problemAttempts: [
        { id: 'a', problemId: 'p1-01', correct: true, attemptedAt: '2026-05-04T10:00:00Z' },
        { id: 'b', problemId: 'p1-02', correct: false, attemptedAt: '2026-05-04T10:00:00Z' },
        { id: 'c', problemId: 'p1-03', correct: true, attemptedAt: '2026-05-04T10:00:00Z' },
        { id: 'd', problemId: 'p1-03', correct: false, attemptedAt: '2026-05-04T11:00:00Z' },
      ],
    });
    const m = masteryProgress(s);
    expect(m.done).toBe(3);
    expect(m.total).toBeGreaterThanOrEqual(70);
  });
});

describe('daysRemaining', () => {
  it('counts inclusive days from today to target', () => {
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-10' }) }, '2026-05-04')).toBe(6);
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-04' }) }, '2026-05-04')).toBe(0);
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-01' }) }, '2026-05-04')).toBe(-3);
  });
});
