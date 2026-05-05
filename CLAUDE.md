# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

簿記3級 (日商簿記3級) 合格に向けた **個人用・短期集中型の学習進捗トラッカー**。GW のような数日〜2週間の短いウィンドウで使うことを想定している。デプロイ先: <http://sudame.net/boki3/> (GitHub Pages)。

学習素材は外部 (moneyfriends-blog.com / inuboki.com) のページで、本アプリは進捗 (どのレッスンを読んだか / どの問題を○×で解いたか / 模試の点数) を記録・可視化することに専念する。

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173/)
npm run build     # tsc + vite build
npm run preview   # built artifact preview
npm test          # vitest run
npm run test:watch
npx tsc --noEmit  # type check only
```

Single test: `npm test -- -t "<pattern>"` または `npx vitest run path/to/file.test.ts`.

## Architecture

### Data flow

State is a single tree persisted to `localStorage` under key `boki3-state-v1`. There is no backend.

```
data/lessons.ts + data/problems.ts   ← 静的カタログ (コードに同梱)
            ↓
state/StateContext.tsx (useReducer)
            ↓
state/storage.ts (load/save localStorage)
state/selectors.ts (派生計算)
            ↓
components/* (View)
```

`AppState` の主なフィールド: `lessonProgress` (id → completedAt)、`problemAttempts` (試行履歴を全件保持、最新試行が結果として有効)、`mockExams` (3スロット固定)、`startDate` / `targetDate`。

### 重要な設計判断

**問題の正答状態は「最新試行」で判定する** (`latestAttemptByProblem`)。○ → × への変更も履歴に追記され、その問題の状態が×に戻る。総合バーンアップは時刻順に全イベントを再生して各時点の正答数を再計算するので、フリップによる線の上下も忠実に描画される。

**バーンアップはイベントベース** (時刻スケール、X軸のラベルだけ日付)。`burnupSeries` / `masteryBurnupSeries` は `BurnupSeries { points, domain, goal, projectedAtTarget }` を返し、`BurnupChart` がそれをそのまま受け取る。予測線は `現在ペース (= currentActual / 経過ms)` で線形外挿し、ゴールに到達する時刻で水平に折れ曲がる (3 点構成)。

**問題の表示は2パターン** に分岐する (`ProblemList`):
- 同一 URL に複数問題: セクションヘッダにリンク、行に `問N` バッジ (例: 第1問対策の15問、テーマ別6種)
- 1 URL = 1問: バッジなしのシンプル行 (例: 第2問対策、inuboki 全部)

**カテゴリ → 本試験セクション** の対応は `data/problems.ts` の `CATEGORY_TO_EXAM_SECTION` で持つ。配点は第1問45/第2問20/第3問35。`projectedExamScore` はカテゴリ別正答率 × 配点で「想定本番得点」を出す。模試があれば `readinessScore` はそちらを優先。

### コンポーネント階層

- `App.tsx` — タブ (`dashboard` / `input` / `output` / `mock`) + 設定モーダル
- `components/Dashboard/` — Tier 1 (StatusBanner + Burnup×2) → Tier 2 (AccuracyTrend + PaceCard) → Tier 3 (MockSummary + Heatmap)。**ダッシュボードは表示専用**。模試の入力は `components/Mock/MockTab.tsx` に分離 (内部では `Dashboard/MockCard.tsx` を流用)。
- `components/Input/` — レッスンチェックリスト。チェック後に完了日付を編集できる
- `components/Output/` — `ProblemList` → `ProblemSet` (多問1ページ用、折りたたみ) / `ProblemRow`、先頭に `ReviewQueue` (直近7日の不正解問題)

## Conventions

- **CSS Modules を使う。Tailwind は使わない。** スタイルは各コンポーネントの隣に `*.module.css` で置く
- ロジックの単位 (`storage`, `selectors`) は Vitest でテスト先行で書く。UI コンポーネントはテストせず、起動 + 手動確認に留める (個人用・短期集中の費用対効果)
- 静的カタログ (lessons / problems) を増やす時は既存の `id` を変更しない。localStorage の試行履歴が紐付いているため
- localStorage のスキーマ拡張は `loadState` の default-fill で互換性を保つ (`version: 1` を据え置きで OK)
- node 25 の experimental localStorage が jsdom と競合するため、テストは `vitest.setup.ts` の Storage shim に依存している

## Deploy

`main` への push で `.github/workflows/deploy.yml` が動き、`npm test` → `vite build` → GitHub Pages にデプロイ。`vite.config.ts` の `base: '/boki3/'` に依存しているのでサブパスを変えるなら同時に直す。
