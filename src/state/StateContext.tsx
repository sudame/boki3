import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { AppState, ProblemAttempt } from './types';
import { loadState, saveState } from './storage';

type Action =
  | { type: 'toggleLesson'; lessonId: string }
  | { type: 'recordAttempt'; problemId: string; correct: boolean }
  | { type: 'setTargetDate'; date: string };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'toggleLesson': {
      const next = { ...state.lessonProgress };
      if (next[action.lessonId]) {
        delete next[action.lessonId];
      } else {
        next[action.lessonId] = { completedAt: new Date().toISOString() };
      }
      return { ...state, lessonProgress: next };
    }
    case 'recordAttempt': {
      const attempt: ProblemAttempt = {
        id: crypto.randomUUID(),
        problemId: action.problemId,
        correct: action.correct,
        attemptedAt: new Date().toISOString(),
      };
      return { ...state, problemAttempts: [...state.problemAttempts, attempt] };
    }
    case 'setTargetDate':
      return { ...state, targetDate: action.date };
  }
};

type Ctx = { state: AppState; dispatch: React.Dispatch<Action> };
const StateCtx = createContext<Ctx | null>(null);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  useEffect(() => { saveState(state); }, [state]);
  return <StateCtx.Provider value={{ state, dispatch }}>{children}</StateCtx.Provider>;
};

export const useAppState = (): Ctx => {
  const v = useContext(StateCtx);
  if (!v) throw new Error('StateProvider missing');
  return v;
};
