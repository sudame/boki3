# 簿記3級 学習進捗トラッカー Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GW 期間の短期集中学習用に、簿記3級46レッスンのインプット進捗 (バーンアップチャート) と24問のアウトプット正答率を可視化するローカル React アプリを構築する。

**Architecture:** Vite + React + TypeScript の SPA。状態は React Context + useReducer、永続化は localStorage。チャートは Recharts。スタイルは CSS Modules (Tailwind 不使用)。

**Tech Stack:** Vite, React 18, TypeScript, Recharts, CSS Modules, Vitest

参考 spec: `docs/superpowers/specs/2026-05-04-boki3-design.md`

---

## File Structure

```
package.json
vite.config.ts
tsconfig.json
index.html
src/
  main.tsx                       # エントリ
  App.tsx                        # タブ切り替え
  App.module.css
  data/
    lessons.ts                   # 46レッスン静的データ
    problems.ts                  # 24問静的データ
  state/
    types.ts                     # State, ProblemAttempt 等
    storage.ts                   # localStorage I/O
    StateContext.tsx             # Provider, useReducer, useState フック
    selectors.ts                 # 進捗率/正答率/バーンアップ系列
  components/
    Header.tsx + .module.css
    Settings.tsx + .module.css
    Dashboard/
      Dashboard.tsx + .module.css
      BurnupChart.tsx
      AccuracyTrend.tsx
    Input/
      LessonList.tsx + .module.css
      LessonRow.tsx + .module.css
    Output/
      ProblemList.tsx + .module.css
      ProblemRow.tsx + .module.css
src/state/__tests__/
  storage.test.ts
  selectors.test.ts
```

ロジック (`storage`, `selectors`) は Vitest でテストする。UI コンポーネントは手動確認 + 起動確認に留める (個人用、GW 短期で過剰投資を避ける)。

---

### Task 1: プロジェクト初期化

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.module.css`, `.gitignore`

- [ ] **Step 1: Vite プロジェクトを生成**

```bash
cd /Users/sudame/workspace/github.com/sudame/boki3
npm create vite@latest . -- --template react-ts
```

プロンプトで `.` 配下に作成、既存ファイルとの上書きは許可 (docs/ は触らない)。

- [ ] **Step 2: 追加依存をインストール**

```bash
npm install recharts uuid
npm install -D @types/uuid vitest @vitest/ui jsdom
```

- [ ] **Step 3: `vite.config.ts` に Vitest 設定を追加**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 4: `package.json` の scripts に test を追加**

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: 起動確認**

```bash
npm run dev
```

ブラウザで Vite 既定ページが表示されること。Ctrl+C で停止。

- [ ] **Step 6: コミット**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS project"
```

---

### Task 2: 静的データの定義

**Files:**
- Create: `src/data/lessons.ts`, `src/data/problems.ts`

- [ ] **Step 1: `src/data/lessons.ts` を作成**

46件分。`section` は "基礎知識" | "仕訳" | "帳簿" | "決算"、`subsection` は仕訳/帳簿のみ設定。データソースは spec の参考 URL。

```ts
export type Section = "基礎知識" | "仕訳" | "帳簿" | "決算";

export type Lesson = {
  id: string;
  no: number;
  section: Section;
  subsection?: string;
  title: string;
  url: string;
};

export const LESSONS: Lesson[] = [
  // 基礎知識 (1-4)
  { id: "lesson-01", no: 1, section: "基礎知識", title: "仕訳の基本", url: "https://moneyfriends-blog.com/boki3-01-journalentry/" },
  { id: "lesson-02", no: 2, section: "基礎知識", title: "勘定科目とは？勘定科目の5つのグループ", url: "https://moneyfriends-blog.com/boki3-02-fivegroup/" },
  { id: "lesson-03", no: 3, section: "基礎知識", title: "取引とは？取引の8パターン", url: "https://moneyfriends-blog.com/boki3-03-transaction/" },
  { id: "lesson-04", no: 4, section: "基礎知識", title: "簿記の全体の流れ（期中手続き・決算手続き）", url: "https://moneyfriends-blog.com/boki3-04-processflow/" },
  // 仕訳 - 商品売買 (5-8)
  { id: "lesson-05", no: 5, section: "仕訳", subsection: "商品売買", title: "商品売買-仕入①（三分法・現金仕入・買掛金）", url: "https://moneyfriends-blog.com/boki3-05-purchase1/" },
  { id: "lesson-06", no: 6, section: "仕訳", subsection: "商品売買", title: "商品売買-仕入②（仕入諸掛り・返品・前払金）", url: "https://moneyfriends-blog.com/boki3-06-purchase2/" },
  { id: "lesson-07", no: 7, section: "仕訳", subsection: "商品売買", title: "商品売買-売上①（現金売上・売掛金・クレジット売掛金）", url: "https://moneyfriends-blog.com/boki3-07-sales1/" },
  { id: "lesson-08", no: 8, section: "仕訳", subsection: "商品売買", title: "商品販売-売上②（売上諸掛り・返品・前受金・受取商品券）", url: "https://moneyfriends-blog.com/boki3-08-sales2/" },
  // 仕訳 - 現金・預金 (9-12)
  { id: "lesson-09", no: 9, section: "仕訳", subsection: "現金・預金", title: "現金（他人振出小切手・送金小切手・郵便為替証書）", url: "https://moneyfriends-blog.com/boki3-09-cash1/" },
  { id: "lesson-10", no: 10, section: "仕訳", subsection: "現金・預金", title: "現金過不足", url: "https://moneyfriends-blog.com/boki3-10-cash2/" },
  { id: "lesson-11", no: 11, section: "仕訳", subsection: "現金・預金", title: "預金（普通預金・定期預金・当座預金・小切手・当座借越）", url: "https://moneyfriends-blog.com/boki3-11-deposit/" },
  { id: "lesson-12", no: 12, section: "仕訳", subsection: "現金・預金", title: "小口現金（定額資金前渡制度/インプレスト・システム）", url: "https://moneyfriends-blog.com/boki3-12-pettycash/" },
  // 仕訳 - 債権・債務 (13-14)
  { id: "lesson-13", no: 13, section: "仕訳", subsection: "債権・債務", title: "手形（支払手形・受取手形）", url: "https://moneyfriends-blog.com/boki3-13-note/" },
  { id: "lesson-14", no: 14, section: "仕訳", subsection: "債権・債務", title: "電子記録債権・債務", url: "https://moneyfriends-blog.com/boki3-14-ermc/" },
  // 仕訳 - 貸し付け・借り入れ (15-18)
  { id: "lesson-15", no: 15, section: "仕訳", subsection: "貸し付け・借り入れ", title: "貸し付け・借り入れ（貸付金・借入金・受取利息・支払利息）", url: "https://moneyfriends-blog.com/boki3-15-loan1/" },
  { id: "lesson-16", no: 16, section: "仕訳", subsection: "貸し付け・借り入れ", title: "役員・従業員に対する貸し付け・借り入れ", url: "https://moneyfriends-blog.com/boki3-16-loan2/" },
  { id: "lesson-17", no: 17, section: "仕訳", subsection: "貸し付け・借り入れ", title: "手形による貸し付け・借り入れ（手形貸付金・手形借入金）", url: "https://moneyfriends-blog.com/boki3-17-loan3/" },
  { id: "lesson-18", no: 18, section: "仕訳", subsection: "貸し付け・借り入れ", title: "貸倒れと貸倒引当金", url: "https://moneyfriends-blog.com/boki3-18-baddebt/" },
  // 仕訳 - 固定資産 (19-22)
  { id: "lesson-19", no: 19, section: "仕訳", subsection: "固定資産", title: "固定資産① 有形固定資産の取得", url: "https://moneyfriends-blog.com/boki3-19-fixedassets1/" },
  { id: "lesson-20", no: 20, section: "仕訳", subsection: "固定資産", title: "固定資産② 減価償却", url: "https://moneyfriends-blog.com/boki3-20-fixedassets2/" },
  { id: "lesson-21", no: 21, section: "仕訳", subsection: "固定資産", title: "固定資産③ 有形固定資産の売却", url: "https://moneyfriends-blog.com/boki3-21-fixedassets3/" },
  { id: "lesson-22", no: 22, section: "仕訳", subsection: "固定資産", title: "固定資産④ 改良と修繕", url: "https://moneyfriends-blog.com/boki3-22-fixedassets4/" },
  // 仕訳 - その他の取引 (23-33)
  { id: "lesson-23", no: 23, section: "仕訳", subsection: "その他の取引", title: "建物・土地の賃貸借と差入保証金", url: "https://moneyfriends-blog.com/boki3-23-rent/" },
  { id: "lesson-24", no: 24, section: "仕訳", subsection: "その他の取引", title: "給料に関連した取引（給料・法定福利費・預り金・従業員立替金）", url: "https://moneyfriends-blog.com/boki3-24-payroll/" },
  { id: "lesson-25", no: 25, section: "仕訳", subsection: "その他の取引", title: "その他の費用・貯蔵品", url: "https://moneyfriends-blog.com/boki3-25-otherexpense/" },
  { id: "lesson-26", no: 26, section: "仕訳", subsection: "その他の取引", title: "仮払金・仮受金", url: "https://moneyfriends-blog.com/boki3-26-suspense/" },
  { id: "lesson-27", no: 27, section: "仕訳", subsection: "その他の取引", title: "繰り延べと見越し（前払費用・前受収益・未払費用・未収収益）", url: "https://moneyfriends-blog.com/boki3-27-deferredaccrued/" },
  { id: "lesson-28", no: 28, section: "仕訳", subsection: "その他の取引", title: "売上原価（繰越商品を用いた決算整理仕訳）", url: "https://moneyfriends-blog.com/boki3-28-cogs/" },
  { id: "lesson-29", no: 29, section: "仕訳", subsection: "その他の取引", title: "法人税等（中間納付時・決算時・確定申告時の仕訳）", url: "https://moneyfriends-blog.com/boki3-29-corporatetax/" },
  { id: "lesson-30", no: 30, section: "仕訳", subsection: "その他の取引", title: "消費税（消費税受け払い時・決算時・確定申告時の仕訳）", url: "https://moneyfriends-blog.com/boki3-30-consumptiontax/" },
  { id: "lesson-31", no: 31, section: "仕訳", subsection: "その他の取引", title: "純資産の取引（株式の発行、剰余金の配当・処分）", url: "https://moneyfriends-blog.com/boki3-31-netassets/" },
  { id: "lesson-32", no: 32, section: "仕訳", subsection: "その他の取引", title: "訂正仕訳", url: "https://moneyfriends-blog.com/boki3-32-correction/" },
  { id: "lesson-33", no: 33, section: "仕訳", subsection: "その他の取引", title: "証ひょう問題対策", url: "https://moneyfriends-blog.com/boki3-33-voucher/" },
  // 帳簿 - 主要簿 (34-35)
  { id: "lesson-34", no: 34, section: "帳簿", subsection: "主要簿", title: "帳簿の種類（主要簿と補助簿）", url: "https://moneyfriends-blog.com/boki3-34-books/" },
  { id: "lesson-35", no: 35, section: "帳簿", subsection: "主要簿", title: "仕訳帳と総勘定元帳", url: "https://moneyfriends-blog.com/boki3-35-mainbook/" },
  // 帳簿 - 補助簿 (36-40)
  { id: "lesson-36", no: 36, section: "帳簿", subsection: "補助簿", title: "補助簿①（現金出納帳・当座預金出納帳・小口現金出納帳）", url: "https://moneyfriends-blog.com/boki3-36-subsidiarybooks1/" },
  { id: "lesson-37", no: 37, section: "帳簿", subsection: "補助簿", title: "補助簿②（仕入帳・売上帳・買掛金元帳・売掛金元帳）", url: "https://moneyfriends-blog.com/boki3-37-subsidiarybooks2/" },
  { id: "lesson-38", no: 38, section: "帳簿", subsection: "補助簿", title: "補助簿③（商品有高帳）", url: "https://moneyfriends-blog.com/boki3-38-subsidiarybooks3/" },
  { id: "lesson-39", no: 39, section: "帳簿", subsection: "補助簿", title: "補助簿④（支払手形記入帳・受取手形記入帳）", url: "https://moneyfriends-blog.com/boki3-39-subsidiarybooks4/" },
  { id: "lesson-40", no: 40, section: "帳簿", subsection: "補助簿", title: "補助簿⑤（固定資産台帳）", url: "https://moneyfriends-blog.com/boki3-40-subsidiarybooks5/" },
  // 帳簿 - 伝票会計 (41)
  { id: "lesson-41", no: 41, section: "帳簿", subsection: "伝票会計", title: "伝票会計（伝票と仕訳日計表）", url: "https://moneyfriends-blog.com/boki3-41-slip/" },
  // 決算 (42-46)
  { id: "lesson-42", no: 42, section: "決算", title: "決算とは？", url: "https://moneyfriends-blog.com/boki3-42-closing/" },
  { id: "lesson-43", no: 43, section: "決算", title: "試算表", url: "https://moneyfriends-blog.com/boki3-43-trialbalance/" },
  { id: "lesson-44", no: 44, section: "決算", title: "決算整理", url: "https://moneyfriends-blog.com/boki3-44-adjustments/" },
  { id: "lesson-45", no: 45, section: "決算", title: "帳簿の締め切り（決算振替仕訳・各勘定の締め切り）", url: "https://moneyfriends-blog.com/boki3-45-bookclosing/" },
  { id: "lesson-46", no: 46, section: "決算", title: "財務諸表と精算表の作成", url: "https://moneyfriends-blog.com/boki3-46-fs/" },
];
```

- [ ] **Step 2: `src/data/problems.ts` を作成**

```ts
export type Problem = {
  id: string;
  part: 1 | 2;
  no: number;
  title: string;
  url: string;
};

const P1_URL = "https://moneyfriends-blog.com/boki3-workbook-01/";

export const PROBLEMS: Problem[] = [
  { id: "p1-01", part: 1, no: 1, title: "仕入諸掛りと手付金（前払金）", url: P1_URL },
  { id: "p1-02", part: 1, no: 2, title: "売上（前受金・クレジット売掛金）", url: P1_URL },
  { id: "p1-03", part: 1, no: 3, title: "貸し付けと利息の受け取り", url: P1_URL },
  { id: "p1-04", part: 1, no: 4, title: "貸倒れ（前期分と当期分の混在）", url: P1_URL },
  { id: "p1-05", part: 1, no: 5, title: "土地の賃借料（地代）", url: P1_URL },
  { id: "p1-06", part: 1, no: 6, title: "収入印紙（租税公課）", url: P1_URL },
  { id: "p1-07", part: 1, no: 7, title: "法人税等の計上と中間納付", url: P1_URL },
  { id: "p1-08", part: 1, no: 8, title: "仮払金の精算と売掛金回収", url: P1_URL },
  { id: "p1-09", part: 1, no: 9, title: "決算時の当座借越", url: P1_URL },
  { id: "p1-10", part: 1, no: 10, title: "有形固定資産の売却（期首）", url: P1_URL },
  { id: "p1-11", part: 1, no: 11, title: "当期純損失の処理", url: P1_URL },
  { id: "p1-12", part: 1, no: 12, title: "手形借入金の返済", url: P1_URL },
  { id: "p1-13", part: 1, no: 13, title: "通貨代用証券による売掛金回収と売上返品", url: P1_URL },
  { id: "p1-14", part: 1, no: 14, title: "消費税の相殺と納税額確定", url: P1_URL },
  { id: "p1-15", part: 1, no: 15, title: "納品書兼請求書に基づく仕入と消費税", url: P1_URL },
  { id: "p2-01", part: 2, no: 1, title: "経過勘定", url: "https://moneyfriends-blog.com/boki3-workbook-02/" },
  { id: "p2-02", part: 2, no: 2, title: "法人税等", url: "https://moneyfriends-blog.com/boki3-workbook-03/" },
  { id: "p2-03", part: 2, no: 3, title: "純資産取引", url: "https://moneyfriends-blog.com/boki3-workbook-04/" },
  { id: "p2-04", part: 2, no: 4, title: "貯蔵品", url: "https://moneyfriends-blog.com/boki3-workbook-05/" },
  { id: "p2-05", part: 2, no: 5, title: "当座預金・貸倒引当金", url: "https://moneyfriends-blog.com/boki3-workbook-06/" },
  { id: "p2-06", part: 2, no: 6, title: "伝票記入", url: "https://moneyfriends-blog.com/boki3-workbook-07/" },
  { id: "p2-07", part: 2, no: 7, title: "固定資産台帳", url: "https://moneyfriends-blog.com/boki3-workbook-08/" },
  { id: "p2-08", part: 2, no: 8, title: "商品有高帳", url: "https://moneyfriends-blog.com/boki3-workbook-09/" },
  { id: "p2-09", part: 2, no: 9, title: "売掛金元帳・買掛金元帳", url: "https://moneyfriends-blog.com/boki3-workbook-10/" },
];
```

- [ ] **Step 3: コミット**

```bash
git add src/data
git commit -m "feat: add static lessons and problems data"
```

---

### Task 3: 状態の型と localStorage I/O (テスト先行)

**Files:**
- Create: `src/state/types.ts`, `src/state/storage.ts`, `src/state/__tests__/storage.test.ts`

- [ ] **Step 1: `src/state/types.ts` を作成**

```ts
export type LessonProgress = { completedAt: string };

export type ProblemAttempt = {
  id: string;
  problemId: string;
  correct: boolean;
  attemptedAt: string;
};

export type AppState = {
  version: 1;
  lessonProgress: Record<string, LessonProgress>;
  problemAttempts: ProblemAttempt[];
  startDate: string;   // ISO date (YYYY-MM-DD)
  targetDate: string;  // ISO date (YYYY-MM-DD)
};
```

- [ ] **Step 2: テストを書く (`src/state/__tests__/storage.test.ts`)**

```ts
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
```

- [ ] **Step 3: テストを実行して失敗を確認**

```bash
npm test
```

Expected: "Cannot find module '../storage'" 等で失敗。

- [ ] **Step 4: `src/state/storage.ts` を実装**

```ts
import type { AppState } from './types';

export const STORAGE_KEY = 'boki3-state-v1';

const todayISO = (): string => new Date().toISOString().slice(0, 10);

const addDaysISO = (iso: string, days: number): string => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const createInitialState = (): AppState => {
  const start = todayISO();
  return {
    version: 1,
    lessonProgress: {},
    problemAttempts: [],
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
    return parsed as AppState;
  } catch {
    return createInitialState();
  }
};

export const saveState = (state: AppState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
```

- [ ] **Step 5: テストを実行して通過を確認**

```bash
npm test
```

Expected: 4 passed.

- [ ] **Step 6: コミット**

```bash
git add src/state
git commit -m "feat: add state types and localStorage persistence"
```

---

### Task 4: セレクタ (テスト先行)

**Files:**
- Create: `src/state/selectors.ts`, `src/state/__tests__/selectors.test.ts`

- [ ] **Step 1: テストを書く**

```ts
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
    const series = burnupSeries(s);
    expect(series).toHaveLength(3);
    expect(series[0].date).toBe('2026-05-04');
    expect(series[2].date).toBe('2026-05-06');
  });
  it('cumulative actual increments on completion days', () => {
    const s = baseState({
      startDate: '2026-05-04',
      targetDate: '2026-05-06',
      lessonProgress: {
        'lesson-01': { completedAt: '2026-05-04T10:00:00Z' },
        'lesson-02': { completedAt: '2026-05-05T10:00:00Z' },
        'lesson-03': { completedAt: '2026-05-05T11:00:00Z' },
      },
    });
    const series = burnupSeries(s);
    expect(series[0].actual).toBe(1);
    expect(series[1].actual).toBe(3);
    expect(series[2].actual).toBe(3);
  });
  it('ideal interpolates linearly from 0 to 46', () => {
    const s = baseState({ startDate: '2026-05-04', targetDate: '2026-05-06' });
    const series = burnupSeries(s);
    expect(series[0].ideal).toBe(0);
    expect(series[2].ideal).toBe(46);
    expect(series[1].ideal).toBe(23);
  });
});

describe('daysRemaining', () => {
  it('counts inclusive days from today to target', () => {
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-10' }) }, '2026-05-04')).toBe(6);
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-04' }) }, '2026-05-04')).toBe(0);
    expect(daysRemaining({ ...baseState({ targetDate: '2026-05-01' }) }, '2026-05-04')).toBe(-3);
  });
});
```

- [ ] **Step 2: テスト失敗を確認**

```bash
npm test
```

- [ ] **Step 3: `src/state/selectors.ts` を実装**

```ts
import type { AppState, ProblemAttempt } from './types';
import { LESSONS } from '../data/lessons';

const TOTAL_LESSONS = 46;
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
```

- [ ] **Step 4: テスト通過を確認**

```bash
npm test
```

Expected: All passed.

- [ ] **Step 5: コミット**

```bash
git add src/state
git commit -m "feat: add selectors for progress, accuracy, burnup"
```

---

### Task 5: StateContext (Provider + アクション)

**Files:**
- Create: `src/state/StateContext.tsx`

- [ ] **Step 1: 実装**

```tsx
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
```

- [ ] **Step 2: コミット**

```bash
git add src/state/StateContext.tsx
git commit -m "feat: add StateContext provider with reducer"
```

---

### Task 6: Header と App シェル

**Files:**
- Replace: `src/App.tsx`, `src/App.module.css`, `src/main.tsx`
- Create: `src/components/Header.tsx`, `src/components/Header.module.css`

- [ ] **Step 1: `src/main.tsx` を上書き**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { StateProvider } from './state/StateContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>,
);
```

- [ ] **Step 2: `src/index.css` を最小化** (既存のVite既定スタイルを置換)

```css
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif;
  background: #f5f5f7;
  color: #1d1d1f;
}
a { color: #0066cc; }
button { font: inherit; cursor: pointer; }
```

- [ ] **Step 3: `src/components/Header.module.css` を作成**

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e5ea;
}
.title { font-size: 18px; font-weight: 600; margin: 0; }
.chips { display: flex; gap: 12px; }
.chip {
  padding: 6px 12px;
  background: #f0f0f3;
  border-radius: 999px;
  font-size: 13px;
}
.settingsBtn {
  border: none;
  background: transparent;
  font-size: 18px;
  padding: 6px 10px;
}
```

- [ ] **Step 4: `src/components/Header.tsx` を作成**

```tsx
import { useAppState } from '../state/StateContext';
import { inputProgress, outputAccuracy, daysRemaining } from '../state/selectors';
import styles from './Header.module.css';

type Props = { onOpenSettings: () => void };

export const Header = ({ onOpenSettings }: Props) => {
  const { state } = useAppState();
  const ip = inputProgress(state);
  const oa = outputAccuracy(state);
  const today = new Date().toISOString().slice(0, 10);
  const left = daysRemaining(state, today);
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>簿記3級ダッシュボード</h1>
      <div className={styles.chips}>
        <span className={styles.chip}>進捗 {ip.done}/{ip.total} ({Math.round(ip.rate * 100)}%)</span>
        <span className={styles.chip}>正答率 {oa.attempted === 0 ? '—' : `${Math.round(oa.rate * 100)}%`} ({oa.correct}/{oa.attempted})</span>
        <span className={styles.chip}>残り {left}日</span>
      </div>
      <button className={styles.settingsBtn} onClick={onOpenSettings} aria-label="設定">⚙</button>
    </header>
  );
};
```

- [ ] **Step 5: `src/App.module.css` を作成**

```css
.shell { min-height: 100vh; display: flex; flex-direction: column; }
.tabs {
  display: flex;
  gap: 4px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e5e5ea;
}
.tab {
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
}
.tabActive { border-bottom-color: #0066cc; color: #0066cc; }
.main { padding: 24px; max-width: 1100px; margin: 0 auto; width: 100%; }
```

- [ ] **Step 6: `src/App.tsx` を上書き** (タブはまだプレースホルダ)

```tsx
import { useState } from 'react';
import { Header } from './components/Header';
import styles from './App.module.css';

type Tab = 'dashboard' | 'input' | 'output';

export const App = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={styles.shell}>
      <Header onOpenSettings={() => setShowSettings(true)} />
      <nav className={styles.tabs}>
        {(['dashboard', 'input', 'output'] as const).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'dashboard' ? 'ダッシュボード' : t === 'input' ? 'インプット' : 'アウトプット'}
          </button>
        ))}
      </nav>
      <main className={styles.main}>
        {tab === 'dashboard' && <div>Dashboard placeholder</div>}
        {tab === 'input' && <div>Input placeholder</div>}
        {tab === 'output' && <div>Output placeholder</div>}
      </main>
      {showSettings && <div onClick={() => setShowSettings(false)}>(settings placeholder — click to close)</div>}
    </div>
  );
};
```

- [ ] **Step 7: `npm run dev` で起動確認** (3タブが切替可能)

- [ ] **Step 8: コミット**

```bash
git add -A
git commit -m "feat: add header and tabbed app shell"
```

---

### Task 7: インプットビュー (LessonList / LessonRow)

**Files:**
- Create: `src/components/Input/LessonList.tsx` + `.module.css`, `src/components/Input/LessonRow.tsx` + `.module.css`
- Modify: `src/App.tsx` (placeholder を差し替え)

- [ ] **Step 1: `LessonRow.module.css`**

```css
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f3;
}
.row:hover { background: #fafafc; }
.no { color: #888; font-variant-numeric: tabular-nums; min-width: 48px; }
.title { flex: 1; }
.titleDone { text-decoration: line-through; color: #888; }
.link { text-decoration: none; padding: 0 8px; }
```

- [ ] **Step 2: `LessonRow.tsx`**

```tsx
import type { Lesson } from '../../data/lessons';
import { useAppState } from '../../state/StateContext';
import styles from './LessonRow.module.css';

type Props = { lesson: Lesson };

export const LessonRow = ({ lesson }: Props) => {
  const { state, dispatch } = useAppState();
  const done = !!state.lessonProgress[lesson.id];
  return (
    <div className={styles.row}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => dispatch({ type: 'toggleLesson', lessonId: lesson.id })}
        aria-label={`第${lesson.no}回 完了`}
      />
      <span className={styles.no}>第{lesson.no}回</span>
      <span className={`${styles.title} ${done ? styles.titleDone : ''}`}>{lesson.title}</span>
      <a className={styles.link} href={lesson.url} target="_blank" rel="noreferrer" title="テキストを開く">↗</a>
    </div>
  );
};
```

- [ ] **Step 3: `LessonList.module.css`**

```css
.section { background: #fff; border-radius: 8px; margin-bottom: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.sectionHeader { padding: 12px 16px; font-weight: 600; background: #fafafc; border-bottom: 1px solid #e5e5ea; display: flex; justify-content: space-between; }
.subsection { padding: 8px 16px 4px; font-size: 13px; color: #666; }
```

- [ ] **Step 4: `LessonList.tsx`**

```tsx
import { LESSONS, type Lesson, type Section } from '../../data/lessons';
import { useAppState } from '../../state/StateContext';
import { LessonRow } from './LessonRow';
import styles from './LessonList.module.css';

const SECTIONS: Section[] = ['基礎知識', '仕訳', '帳簿', '決算'];

const groupBySubsection = (lessons: Lesson[]) => {
  const groups = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const key = l.subsection ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(l);
  }
  return groups;
};

export const LessonList = () => {
  const { state } = useAppState();
  return (
    <div>
      {SECTIONS.map(section => {
        const sectionLessons = LESSONS.filter(l => l.section === section);
        const doneCount = sectionLessons.filter(l => state.lessonProgress[l.id]).length;
        const groups = groupBySubsection(sectionLessons);
        return (
          <div key={section} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span>{section}</span>
              <span>{doneCount}/{sectionLessons.length}</span>
            </div>
            {[...groups.entries()].map(([sub, lessons]) => (
              <div key={sub}>
                {sub && <div className={styles.subsection}>{sub}</div>}
                {lessons.map(l => <LessonRow key={l.id} lesson={l} />)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 5: `App.tsx` の input placeholder を `<LessonList />` に差し替え** (import 追加)

- [ ] **Step 6: `npm run dev` でチェック切替が動作 → ヘッダ進捗が変化することを確認**

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "feat: add lesson list with toggle"
```

---

### Task 8: アウトプットビュー (ProblemList / ProblemRow)

**Files:**
- Create: `src/components/Output/ProblemList.tsx` + `.module.css`, `src/components/Output/ProblemRow.tsx` + `.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: `ProblemRow.module.css`**

```css
.row { padding: 8px 12px; border-bottom: 1px solid #f0f0f3; }
.row:hover { background: #fafafc; }
.main { display: flex; align-items: center; gap: 12px; }
.no { color: #888; font-variant-numeric: tabular-nums; min-width: 36px; }
.title { flex: 1; cursor: pointer; }
.badge { width: 22px; text-align: center; font-weight: 600; }
.badgeOk { color: #1c8c1c; }
.badgeNg { color: #c0392b; }
.badgeNone { color: #ccc; }
.actions { display: flex; gap: 6px; }
.btn { padding: 4px 10px; border-radius: 6px; border: 1px solid #d0d0d5; background: #fff; }
.btnOk { color: #1c8c1c; border-color: #1c8c1c; }
.btnNg { color: #c0392b; border-color: #c0392b; }
.link { text-decoration: none; padding: 0 6px; }
.history { padding: 6px 12px 6px 60px; font-size: 12px; color: #666; }
.histItem { padding: 2px 0; }
```

- [ ] **Step 2: `ProblemRow.tsx`**

```tsx
import { useState } from 'react';
import type { Problem } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import styles from './ProblemRow.module.css';

type Props = { problem: Problem };

export const ProblemRow = ({ problem }: Props) => {
  const { state, dispatch } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const attempts = state.problemAttempts
    .filter(a => a.problemId === problem.id)
    .sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
  const latest = attempts[0];
  const badgeClass = !latest ? styles.badgeNone : latest.correct ? styles.badgeOk : styles.badgeNg;
  const badgeText = !latest ? '—' : latest.correct ? '○' : '×';

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <span className={styles.no}>{problem.no}.</span>
        <span className={`${styles.badge} ${badgeClass}`}>{badgeText}</span>
        <span className={styles.title} onClick={() => setExpanded(e => !e)}>{problem.title}</span>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnOk}`} onClick={() => dispatch({ type: 'recordAttempt', problemId: problem.id, correct: true })}>○</button>
          <button className={`${styles.btn} ${styles.btnNg}`} onClick={() => dispatch({ type: 'recordAttempt', problemId: problem.id, correct: false })}>×</button>
        </div>
        <a className={styles.link} href={problem.url} target="_blank" rel="noreferrer" title="問題を開く">↗</a>
      </div>
      {expanded && attempts.length > 0 && (
        <div className={styles.history}>
          {attempts.map(a => (
            <div key={a.id} className={styles.histItem}>
              {new Date(a.attemptedAt).toLocaleString('ja-JP')} — {a.correct ? '○' : '×'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 3: `ProblemList.module.css`**

```css
.section { background: #fff; border-radius: 8px; margin-bottom: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.sectionHeader { padding: 12px 16px; font-weight: 600; background: #fafafc; border-bottom: 1px solid #e5e5ea; display: flex; justify-content: space-between; }
```

- [ ] **Step 4: `ProblemList.tsx`**

```tsx
import { PROBLEMS } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import { latestAttemptByProblem } from '../../state/selectors';
import { ProblemRow } from './ProblemRow';
import styles from './ProblemList.module.css';

export const ProblemList = () => {
  const { state } = useAppState();
  const latest = latestAttemptByProblem(state);
  return (
    <div>
      {[1, 2].map(part => {
        const problems = PROBLEMS.filter(p => p.part === part);
        const attempted = problems.filter(p => latest[p.id]).length;
        const correct = problems.filter(p => latest[p.id]?.correct).length;
        return (
          <div key={part} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span>第{part}問対策</span>
              <span>{correct}/{attempted} 正解 ({attempted}/{problems.length} 着手)</span>
            </div>
            {problems.map(p => <ProblemRow key={p.id} problem={p} />)}
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 5: `App.tsx` の output placeholder を `<ProblemList />` に差し替え**

- [ ] **Step 6: `npm run dev` で ○/× ボタン → ヘッダ正答率が変化することを確認**

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "feat: add problem list with attempt recording"
```

---

### Task 9: ダッシュボード (BurnupChart / AccuracyTrend)

**Files:**
- Create: `src/components/Dashboard/Dashboard.tsx` + `.module.css`, `src/components/Dashboard/BurnupChart.tsx`, `src/components/Dashboard/AccuracyTrend.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: `Dashboard.module.css`**

```css
.grid { display: grid; gap: 24px; }
.card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.cardTitle { margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #333; }
```

- [ ] **Step 2: `BurnupChart.tsx`**

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useAppState } from '../../state/StateContext';
import { burnupSeries } from '../../state/selectors';

export const BurnupChart = () => {
  const { state } = useAppState();
  const data = burnupSeries(state);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
        <YAxis domain={[0, 46]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ideal" name="理想" stroke="#bbb" strokeDasharray="4 4" dot={false} />
        <Line type="monotone" dataKey="actual" name="実績" stroke="#0066cc" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

- [ ] **Step 3: `AccuracyTrend.tsx`** (直近7日のその日の正答率)

```tsx
import { useAppState } from '../../state/StateContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const AccuracyTrend = () => {
  const { state } = useAppState();
  const today = new Date();
  const days: { date: string; rate: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const dayAttempts = state.problemAttempts.filter(a => a.attemptedAt.slice(0, 10) === iso);
    const rate = dayAttempts.length === 0 ? null : dayAttempts.filter(a => a.correct).length / dayAttempts.length;
    days.push({ date: iso, rate: rate === null ? null : Math.round(rate * 100) });
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={days}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
        <YAxis domain={[0, 100]} unit="%" />
        <Tooltip />
        <Line type="monotone" dataKey="rate" name="正答率" stroke="#1c8c1c" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

- [ ] **Step 4: `Dashboard.tsx`**

```tsx
import { BurnupChart } from './BurnupChart';
import { AccuracyTrend } from './AccuracyTrend';
import styles from './Dashboard.module.css';

export const Dashboard = () => (
  <div className={styles.grid}>
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>インプット バーンアップ</h2>
      <BurnupChart />
    </div>
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>直近7日の正答率</h2>
      <AccuracyTrend />
    </div>
  </div>
);
```

- [ ] **Step 5: `App.tsx` の dashboard placeholder を `<Dashboard />` に差し替え**

- [ ] **Step 6: `npm run dev` で2つのチャートが描画されることを確認**

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "feat: add dashboard with burnup chart and accuracy trend"
```

---

### Task 10: Settings モーダル (targetDate 編集)

**Files:**
- Create: `src/components/Settings.tsx` + `.module.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: `Settings.module.css`**

```css
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 10; }
.dialog { background: #fff; border-radius: 8px; padding: 24px; min-width: 320px; }
.title { margin: 0 0 16px; font-size: 16px; }
.row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.label { font-size: 13px; color: #555; }
.input { padding: 8px; border: 1px solid #d0d0d5; border-radius: 6px; font-size: 14px; }
.error { color: #c0392b; font-size: 12px; }
.actions { display: flex; justify-content: flex-end; gap: 8px; }
.btn { padding: 8px 16px; border-radius: 6px; border: 1px solid #d0d0d5; background: #fff; }
.primary { background: #0066cc; color: #fff; border-color: #0066cc; }
```

- [ ] **Step 2: `Settings.tsx`**

```tsx
import { useState } from 'react';
import { useAppState } from '../state/StateContext';
import styles from './Settings.module.css';

type Props = { onClose: () => void };

export const Settings = ({ onClose }: Props) => {
  const { state, dispatch } = useAppState();
  const [date, setDate] = useState(state.targetDate);
  const error = date < state.startDate ? '目標日は開始日以降にしてください' : '';

  const save = () => {
    if (error) return;
    dispatch({ type: 'setTargetDate', date });
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>設定</h2>
        <div className={styles.row}>
          <label className={styles.label}>開始日 (自動)</label>
          <input className={styles.input} type="date" value={state.startDate} disabled />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>目標日</label>
          <input className={styles.input} type="date" value={date} min={state.startDate} onChange={e => setDate(e.target.value)} />
          {error && <span className={styles.error}>{error}</span>}
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={onClose}>キャンセル</button>
          <button className={`${styles.btn} ${styles.primary}`} onClick={save} disabled={!!error}>保存</button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: `App.tsx` の settings placeholder を `<Settings onClose={...} />` に差し替え**

- [ ] **Step 4: `npm run dev` で設定保存 → ヘッダ残日数とバーンアップ X 軸が変化することを確認**

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "feat: add settings dialog for target date"
```

---

### Task 11: 仕上げ確認

- [ ] **Step 1: テスト全実行**

```bash
npm test
```

Expected: storage と selectors の全テスト通過。

- [ ] **Step 2: ビルド確認**

```bash
npm run build
```

Expected: 型エラーなくビルド成功。

- [ ] **Step 3: 受け入れ基準を手動で確認**

- 3タブが切り替わる
- レッスンチェック → 進捗率と バーンアップ実績ラインが更新される
- 問題に ○/× を付けると正答率が更新される
- ブラウザ再読み込み後も状態が保持される

- [ ] **Step 4: README 追加** (任意 — `npm install && npm run dev` の起動手順のみ)

- [ ] **Step 5: 最終コミット**

```bash
git add -A
git commit -m "chore: project ready for use"
```
