import { describe, it, expect } from 'vitest';
import {
  inputProgress,
  outputAccuracy,
  burnupSeries,
  daysRemaining,
  latestAttemptByProblem,
} from '../selectors';
import type { AppState } from '../types';

const baseState = (overrides: Partial<AppState> = {}): AppState => ({
  version: 1,
  lessonProgress: {},
  problemAttempts: [],
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

describe('burnupSeries', () => {
  it('produces one point per day from start to target', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-06' });
    const series = burnupSeries(s, '2026-05-06');
    expect(series).toHaveLength(3);
    expect(series[0].date).toBe('2026-05-04');
    expect(series[2].date).toBe('2026-05-06');
  });
  it('cumulative actual increments on completion days, up to today', () => {
    const s = baseState({
      startDate: '2026-05-04',
      targetDate: '2026-05-06',
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-04T10:00:00Z' },
        'lesson-02': { completedAt: '2026-05-05T10:00:00Z' },
        'lesson-03': { completedAt: '2026-05-05T11:00:00Z' },
      },
    });
    const series = burnupSeries(s, '2026-05-06');
    expect(series[0].actual).toBe(1);
    expect(series[1].actual).toBe(3);
    expect(series[2].actual).toBe(3);
  });
  it('actual is null after today', () => {
    const s = baseState({
      startDate: '2026-05-04',
      targetDate: '2026-05-10',
      lessonProgress: { 'lesson-01': { completedAt: '2026-05-04T10:00:00Z' } },
    });
    const series = burnupSeries(s, '2026-05-05');
    expect(series[0].actual).toBe(1);
    expect(series[1].actual).toBe(1);
    expect(series[2].actual).toBeNull();
    expect(series[6].actual).toBeNull();
  });
  it('ideal interpolates linearly from 0 to 46', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-06' });
    const series = burnupSeries(s, '2026-05-06');
    expect(series[0].ideal).toBe(0);
    expect(series[2].ideal).toBe(46);
    expect(series[1].ideal).toBe(23);
  });
  it('forecast projects from today using current pace', () => {
    const s = baseState({
      startDate: '2026-05-01',
      targetDate: '2026-05-08',
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-01T10:00:00Z' },
        'lesson-02': { completedAt: '2026-05-02T10:00:00Z' },
        'lesson-03': { completedAt: '2026-05-03T10:00:00Z' },
        'lesson-04': { completedAt: '2026-05-04T10:00:00Z' },
      },
    });
    // today=2026-05-04, elapsed=3 days, done=4 → pace=4/3 per day
    const series = burnupSeries(s, '2026-05-04');
    // past dates have no forecast
    expect(series[0].forecast).toBeNull();
    expect(series[2].forecast).toBeNull();
    // today is anchor
    const today = series.find(p => p.date === '2026-05-04')!;
    expect(today.forecast).toBe(4);
    // +1 day → 4 + 4/3 ≈ 5.33 → 5
    const tomorrow = series.find(p => p.date === '2026-05-05')!;
    expect(tomorrow.forecast).toBe(5);
    // +4 days → 4 + 16/3 ≈ 9.33 → 9
    const target = series.find(p => p.date === '2026-05-08')!;
    expect(target.forecast).toBe(9);
  });
  it('forecast is null when nothing done yet (no pace)', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-10' });
    const series = burnupSeries(s, '2026-05-05');
    expect(series.every(p => p.forecast === null)).toBe(true);
  });
});

describe('daysRemaining', () => {
  it('counts inclusive days from today to target', () => {
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-10' }) }, '2026-05-04')).toBe(6);
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-04' }) }, '2026-05-04')).toBe(0);
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-01' }) }, '2026-05-04')).toBe(-3);
  });
});
