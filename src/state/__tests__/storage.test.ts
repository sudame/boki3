import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, STORAGE_KEY, createInitialState } from '../storage';

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial state when storage is empty', () => {
    const s = loadState();
    expect(s.version).toBe(1);
    expect(s.lessonProgress).toEqual({});
    expect(s.problemAttempts).toEqual([]);
    expect(s.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(s.targetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('round-trips state through save/load', () => {
    const s = createInitialState();
    s.lessonProgress['lesson-01'] = { completedAt: '2026-05-04T10:00:00.000Z' };
    s.problemAttempts.push({ id: 'a1', problemId: 'p1-01', correct: true, attemptedAt: '2026-05-04T10:01:00.000Z' });
    saveState(s);
    const loaded = loadState();
    expect(loaded).toEqual(s);
  });

  it('falls back to initial state on malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    const s = loadState();
    expect(s.lessonProgress).toEqual({});
  });

  it('falls back to initial state on wrong version', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99 }));
    const s = loadState();
    expect(s.version).toBe(1);
    expect(s.lessonProgress).toEqual({});
  });
});
