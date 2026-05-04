# 簿記3級 学習進捗トラッカー — 設計書

作成日: 2026-05-04

## 目的

GW (2026-05-04 〜 2026-05-06 想定) を利用した短期集中学習で、日商簿記3級合格に向けたインプット (テキスト読了) とアウトプット (問題演習) の進捗を可視化する個人用ローカル Web アプリ。

参考テキスト: <https://moneyfriends-blog.com/boki3-top/>
参考問題集: <https://moneyfriends-blog.com/boki3-workbook-top/>

## 要件

- **インプット**: 全46レッスン中の完了数を進捗率として、バーンアップチャートで日次推移を可視化する
- **アウトプット**: 全24問 (第1問対策15問 + 第2問対策9問) について1問ごとに正誤を記録し、正答率を算出する
- ローカル端末 (`npm run dev`) のみで動作する。サーバ・認証・同期なし
- データは localStorage に永続化する

## 技術スタック

- Vite + React + TypeScript
- React Context + `useReducer` (外部状態ライブラリは導入しない)
- Recharts (チャート描画)
- CSS Modules (Tailwind は使用しない)
- localStorage (キー: `boki3-state-v1`)

## データモデル

### 静的データ (コード同梱)

```ts
type Lesson = {
  id: string;          // "lesson-01" .. "lesson-46"
  no: number;          // 1..46
  section: "基礎知識" | "仕訳" | "帳簿" | "決算";
  subsection?: string; // 例: "商品売買" (仕訳/帳簿のみ)
  title: string;
  url: string;
};

type Problem = {
  id: string;          // "p1-01".."p1-15", "p2-01".."p2-09"
  part: 1 | 2;
  no: number;
  title: string;
  url: string;
};
```

レッスン46件・問題24件の中身は `src/data/lessons.ts` `src/data/problems.ts` にハードコード。ソースは `WebFetch` で事前に取得済み目次・問題一覧。

### 動的データ (localStorage)

```ts
type State = {
  version: 1;
  lessonProgress: Record<string, { completedAt: string }>;
  problemAttempts: ProblemAttempt[];
  startDate: string;   // ISO date、初回起動時に当日を自動設定
  targetDate: string;  // ISO date、デフォルト 2026-05-06、編集可
};

type ProblemAttempt = {
  id: string;          // uuid
  problemId: string;
  correct: boolean;
  attemptedAt: string; // ISO datetime
};
```

`problemAttempts` は履歴として全件残す。1問につき複数回の試行を許容する。

### 派生計算 (`selectors.ts`)

- インプット進捗率: `Object.keys(lessonProgress).length / 46`
- アウトプット正答率: 各問題の最新試行を取り、`correct` の比率を出す。最新試行のない問題は集計対象外
- バーンアップ系列: `startDate` から `targetDate` までの各日について、その日終了時点 (`completedAt <= 当日23:59`) で完了済みのレッスン累積数を返す
- 理想ライン: `startDate` で 0、`targetDate` で 46 の直線補間

## 画面構成

単一ページで、ヘッダ + タブ切り替えの3ビュー。

### ヘッダ (常時表示)
- タイトル「簿記3級ダッシュボード」
- サマリチップ3つ: インプット進捗 (`12/46 (26%)`)、アウトプット正答率 (`78%`)、`targetDate` までの残日数
- 設定アイコン → モーダルで `targetDate` を編集

### Tab 1: ダッシュボード
- バーンアップチャート (Recharts `LineChart`)
  - X 軸: 日付 (`startDate` 〜 `targetDate`)
  - Y 軸: 累積完了レッスン数 (0 〜 46)
  - 系列: 理想ライン (灰の点線)、実績ライン (実線)
- 直近7日の正答率推移 (簡易折れ線)

### Tab 2: インプット
- 4 セクション (基礎知識 / 仕訳 / 帳簿 / 決算) を見出しに表示
- 仕訳・帳簿は subsection で折りたたみ可能
- 各レッスン行: チェックボックス、第N回、タイトル、元ページへのリンクアイコン
- チェック切替で `lessonProgress[id]` を toggle (チェック時 `completedAt = 現在時刻`、外す時 削除)

### Tab 3: アウトプット
- 第1問対策 (15問) と 第2問対策 (9問) のセクション
- 各問題行: 問題タイトル、直近結果バッジ (○ / × / 未着手)、「○」「×」ボタン2つ、元ページリンク
- ボタン押下で `problemAttempts` に新しい試行を追記
- 行クリックで展開、過去全試行 (日付・正誤) を表示

## ディレクトリ構成

```
src/
  data/
    lessons.ts
    problems.ts
  state/
    StateContext.tsx
    storage.ts          // load/save、不正データ時は初期化
    selectors.ts
  components/
    Header.tsx
    Settings.tsx
    Dashboard/
      BurnupChart.tsx
      AccuracyTrend.tsx
    Input/
      LessonList.tsx
      LessonRow.tsx
    Output/
      ProblemList.tsx
      ProblemRow.tsx
  App.tsx
  main.tsx
```

## エラー処理 / エッジケース

- localStorage パース失敗時: 黙って初期 state にフォールバック (個人用なので警告のみ console)
- `version` フィールドで将来のマイグレーション余地を確保 (現時点では v1 のみ)
- `targetDate < startDate` を入力できないようにバリデーション

## スコープ外 (YAGNI)

- 第3問対策 (元サイトで未公開)
- 複数ユーザー / 同期 / バックアップエクスポート
- レッスン・問題の追加編集 UI (静的データのみ)
- ダークモード、レスポンシブ対応 (デスクトップ前提)

## 受け入れ基準

- `npm run dev` で起動し、3タブが切り替わる
- レッスンチェック → 進捗率と バーンアップ実績ラインが更新される
- 問題に ○/× を付けると正答率が更新される
- ブラウザ再読み込み後も状態が保持される
