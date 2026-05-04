export type ProblemSource = 'moneyfriends' | 'inuboki';

export type Problem = {
  id: string;
  source: ProblemSource;
  category: string;
  no: number;
  title: string;
  url: string;
};

export const SOURCE_LABELS: Record<ProblemSource, string> = {
  moneyfriends: 'マネーフレンズ 簿記3級問題集',
  inuboki: '犬でもわかる簿記 無料問題集',
};

export const SOURCE_ORDER: ProblemSource[] = ['moneyfriends', 'inuboki'];

export type ExamSection = 1 | 2 | 3;

// 簿記3級本試験の配点
export const EXAM_SECTION_MAX: Record<ExamSection, number> = { 1: 45, 2: 20, 3: 35 };

// カテゴリ → 想定本試験セクション (粒度がカテゴリ単位なので近似)
export const CATEGORY_TO_EXAM_SECTION: Record<string, ExamSection> = {
  '第1問対策': 1,
  '第2問対策': 2,
  'テーマ別 商品売買': 1,
  'テーマ別 現金・預金': 1,
  'テーマ別 手形・電子記録債権': 1,
  'テーマ別 貸付金・借入金': 1,
  'テーマ別 貸倒れと貸倒引当金': 1,
  'テーマ別 有形固定資産': 1,
  '現金預金': 1,
  '商品売買①': 1,
  '商品売買②': 2,
  '有形固定資産': 1,
  'その他の取引': 1,
  '決算手続き': 3,
  '伝票・証憑': 2,
  '理論等': 2,
};

export const examSectionOf = (problem: Problem): ExamSection =>
  CATEGORY_TO_EXAM_SECTION[problem.category] ?? 1;

const MF_P1_URL = 'https://moneyfriends-blog.com/boki3-workbook-01/';

export const PROBLEMS: Problem[] = [
  // moneyfriends 第1問対策 (15問、IDは既存と互換: p1-01..p1-15)
  { id: 'p1-01', source: 'moneyfriends', category: '第1問対策', no: 1, title: '仕入諸掛りと手付金（前払金）', url: MF_P1_URL },
  { id: 'p1-02', source: 'moneyfriends', category: '第1問対策', no: 2, title: '売上（前受金・クレジット売掛金）', url: MF_P1_URL },
  { id: 'p1-03', source: 'moneyfriends', category: '第1問対策', no: 3, title: '貸し付けと利息の受け取り', url: MF_P1_URL },
  { id: 'p1-04', source: 'moneyfriends', category: '第1問対策', no: 4, title: '貸倒れ（前期分と当期分の混在）', url: MF_P1_URL },
  { id: 'p1-05', source: 'moneyfriends', category: '第1問対策', no: 5, title: '土地の賃借料（地代）', url: MF_P1_URL },
  { id: 'p1-06', source: 'moneyfriends', category: '第1問対策', no: 6, title: '収入印紙（租税公課）', url: MF_P1_URL },
  { id: 'p1-07', source: 'moneyfriends', category: '第1問対策', no: 7, title: '法人税等の計上と中間納付', url: MF_P1_URL },
  { id: 'p1-08', source: 'moneyfriends', category: '第1問対策', no: 8, title: '仮払金の精算と売掛金回収', url: MF_P1_URL },
  { id: 'p1-09', source: 'moneyfriends', category: '第1問対策', no: 9, title: '決算時の当座借越', url: MF_P1_URL },
  { id: 'p1-10', source: 'moneyfriends', category: '第1問対策', no: 10, title: '有形固定資産の売却(期首)', url: MF_P1_URL },
  { id: 'p1-11', source: 'moneyfriends', category: '第1問対策', no: 11, title: '当期純損失の処理', url: MF_P1_URL },
  { id: 'p1-12', source: 'moneyfriends', category: '第1問対策', no: 12, title: '手形借入金の返済', url: MF_P1_URL },
  { id: 'p1-13', source: 'moneyfriends', category: '第1問対策', no: 13, title: '通貨代用証券による売掛金回収と売上返品', url: MF_P1_URL },
  { id: 'p1-14', source: 'moneyfriends', category: '第1問対策', no: 14, title: '消費税の相殺と納税額確定', url: MF_P1_URL },
  { id: 'p1-15', source: 'moneyfriends', category: '第1問対策', no: 15, title: '納品書兼請求書に基づく仕入と消費税', url: MF_P1_URL },

  // moneyfriends 第2問対策 (9問)
  { id: 'p2-01', source: 'moneyfriends', category: '第2問対策', no: 1, title: '経過勘定', url: 'https://moneyfriends-blog.com/boki3-workbook-02/' },
  { id: 'p2-02', source: 'moneyfriends', category: '第2問対策', no: 2, title: '法人税等', url: 'https://moneyfriends-blog.com/boki3-workbook-03/' },
  { id: 'p2-03', source: 'moneyfriends', category: '第2問対策', no: 3, title: '純資産取引', url: 'https://moneyfriends-blog.com/boki3-workbook-04/' },
  { id: 'p2-04', source: 'moneyfriends', category: '第2問対策', no: 4, title: '貯蔵品', url: 'https://moneyfriends-blog.com/boki3-workbook-05/' },
  { id: 'p2-05', source: 'moneyfriends', category: '第2問対策', no: 5, title: '当座預金・貸倒引当金', url: 'https://moneyfriends-blog.com/boki3-workbook-06/' },
  { id: 'p2-06', source: 'moneyfriends', category: '第2問対策', no: 6, title: '伝票記入', url: 'https://moneyfriends-blog.com/boki3-workbook-07/' },
  { id: 'p2-07', source: 'moneyfriends', category: '第2問対策', no: 7, title: '固定資産台帳', url: 'https://moneyfriends-blog.com/boki3-workbook-08/' },
  { id: 'p2-08', source: 'moneyfriends', category: '第2問対策', no: 8, title: '商品有高帳', url: 'https://moneyfriends-blog.com/boki3-workbook-09/' },
  { id: 'p2-09', source: 'moneyfriends', category: '第2問対策', no: 9, title: '売掛金元帳・買掛金元帳', url: 'https://moneyfriends-blog.com/boki3-workbook-10/' },

  // moneyfriends テーマ別① 商品売買 (15問)
  { id: 'mft1-01', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 1, title: '仕入諸掛りの処理', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-02', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 2, title: '買掛金の支払い', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-03', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 3, title: '仕入れた商品の返品', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-04', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 4, title: '売上諸掛りの処理', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-05', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 5, title: '売掛金の回収', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-06', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 6, title: '販売した商品の返品', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-07', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 7, title: '仕入諸掛りの立替払い', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-08', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 8, title: '仕入の手付金支払い', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-09', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 9, title: '手付金と商品受け取り', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-10', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 10, title: 'クレジット払いによる売上', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-11', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 11, title: 'クレジット売掛金の回収', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-12', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 12, title: '手付金の受け取り', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-13', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 13, title: '手付金と商品引き渡し', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-14', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 14, title: '商品券による売上', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },
  { id: 'mft1-15', source: 'moneyfriends', category: 'テーマ別 商品売買', no: 15, title: '商品券の精算（現金化）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-01/' },

  // moneyfriends テーマ別② 現金・預金 (13問)
  { id: 'mft2-01', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 1, title: '小切手・郵便為替証書の受け取り', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-02', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 2, title: '普通預金による支払い（手数料付き）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-03', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 3, title: '普通預金への入金（手数料差引）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-04', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 4, title: '普通預金利息の受け取り', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-05', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 5, title: '小切手の振り出し', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-06', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 6, title: '自己振出小切手の受け取り', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-07', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 7, title: '当座借越の処理', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-08', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 8, title: '複数銀行口座の定期預金満期', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-09', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 9, title: '現金過不足（原因不明）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-10', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 10, title: '現金過不足の決算処理①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-11', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 11, title: '小口現金の支払報告', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-12', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 12, title: '現金過不足の決算処理②（複数原因）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },
  { id: 'mft2-13', source: 'moneyfriends', category: 'テーマ別 現金・預金', no: 13, title: '小口現金の支払報告と補給', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-02/' },

  // moneyfriends テーマ別③ 手形・電子記録債権 (9問)
  { id: 'mft3-01', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 1, title: '約束手形の振り出し①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-02', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 2, title: '約束手形の決済（代金の支払い）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-03', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 3, title: '約束手形の受け取り', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-04', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 4, title: '約束手形の決済（代金の受け取り）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-05', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 5, title: '電子記録債務の発生', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-06', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 6, title: '電子記録債務の消滅（代金の支払い）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-07', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 7, title: '電子記録債権の発生', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-08', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 8, title: '電子記録債権の消滅（代金の受け取り）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },
  { id: 'mft3-09', source: 'moneyfriends', category: 'テーマ別 手形・電子記録債権', no: 9, title: '約束手形の振り出し②（郵送代金を含む）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-03/' },

  // moneyfriends テーマ別④ 貸付金・借入金 (12問)
  { id: 'mft4-01', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 1, title: '貸し付け時の仕訳', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-02', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 2, title: '借り入れ時の仕訳', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-03', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 3, title: '役員に対する貸し付け', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-04', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 4, title: '従業員に対する貸し付け', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-05', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 5, title: '役員からの借り入れ', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-06', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 6, title: '手形による貸し付け①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-07', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 7, title: '手形による借り入れ①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-08', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 8, title: '貸付金の回収（利息計算付き）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-09', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 9, title: '借入金の返済①（利息計算付き）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-10', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 10, title: '借入金の返済②（日割計算付き）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-11', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 11, title: '手形による貸し付け②（利息先引き）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },
  { id: 'mft4-12', source: 'moneyfriends', category: 'テーマ別 貸付金・借入金', no: 12, title: '手形による借り入れ②（利息先引き）', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-04/' },

  // moneyfriends テーマ別⑤ 貸倒れと貸倒引当金 (8問)
  { id: 'mft5-01', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 1, title: '当期貸倒れ時の仕訳', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-02', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 2, title: '貸倒引当金の設定①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-03', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 3, title: '貸倒引当金の設定②', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-04', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 4, title: '前期以前の債権貸倒れ①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-05', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 5, title: '前期以前の債権貸倒れ②', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-06', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 6, title: '貸倒処理済み債権の回収', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-07', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 7, title: '前期以前の債権貸倒れ③', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },
  { id: 'mft5-08', source: 'moneyfriends', category: 'テーマ別 貸倒れと貸倒引当金', no: 8, title: '複合期間の債権貸倒れ', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-05/' },

  // moneyfriends テーマ別⑥ 有形固定資産 (10問)
  { id: 'mft6-01', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 1, title: '建物の取得', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-02', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 2, title: '土地の取得', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-03', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 3, title: '備品の取得', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-04', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 4, title: '賃貸借料の支払い', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-05', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 5, title: '敷金と仲介手数料', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-06', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 6, title: '複数固定資産の取得', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-07', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 7, title: '固定資産の売却①', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-08', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 8, title: '固定資産の売却②', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-09', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 9, title: '改良と修繕', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },
  { id: 'mft6-10', source: 'moneyfriends', category: 'テーマ別 有形固定資産', no: 10, title: '賃貸借契約解約', url: 'https://moneyfriends-blog.com/boki3-siwakemondai-06/' },

  // inuboki 1. 現金預金 (8問)
  { id: 'iv-1-01', source: 'inuboki', category: '現金預金', no: 1, title: '現金過不足の問題１', url: 'https://inuboki.com/3q-mondai/3q-mondai1-01/' },
  { id: 'iv-1-02', source: 'inuboki', category: '現金預金', no: 2, title: '現金過不足の問題２', url: 'https://inuboki.com/3q-mondai/3q-mondai1-02/' },
  { id: 'iv-1-03', source: 'inuboki', category: '現金預金', no: 3, title: '現金過不足の問題３', url: 'https://inuboki.com/3q-mondai/3q-mondai1-03/' },
  { id: 'iv-1-04', source: 'inuboki', category: '現金預金', no: 4, title: '現金過不足の問題４', url: 'https://inuboki.com/3q-mondai/3q-mondai1-04/' },
  { id: 'iv-1-05', source: 'inuboki', category: '現金預金', no: 5, title: '現金過不足の問題５', url: 'https://inuboki.com/3q-mondai/3q-mondai1-05/' },
  { id: 'iv-1-06', source: 'inuboki', category: '現金預金', no: 6, title: '当座借越と複数口座を開設している場合の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai1-06/' },
  { id: 'iv-1-07', source: 'inuboki', category: '現金預金', no: 7, title: '小口現金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai1-07/' },
  { id: 'iv-1-08', source: 'inuboki', category: '現金預金', no: 8, title: '小口現金出納帳の読み取り問題', url: 'https://inuboki.com/3q-mondai/3q-mondai1-08/' },

  // inuboki 2. 商品売買① (6問)
  { id: 'iv-2-01', source: 'inuboki', category: '商品売買①', no: 1, title: '基本的な商品売買の仕訳問題１', url: 'https://inuboki.com/3q-mondai/3q-mondai2-01/' },
  { id: 'iv-2-02', source: 'inuboki', category: '商品売買①', no: 2, title: '基本的な商品売買の仕訳問題２', url: 'https://inuboki.com/3q-mondai/3q-mondai2-02/' },
  { id: 'iv-2-03', source: 'inuboki', category: '商品売買①', no: 3, title: '商品売買の付随費用に関する問題', url: 'https://inuboki.com/3q-mondai/3q-mondai2-03/' },
  { id: 'iv-2-04', source: 'inuboki', category: '商品売買①', no: 4, title: '約束手形・商品券に関する仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai2-04/' },
  { id: 'iv-2-05', source: 'inuboki', category: '商品売買①', no: 5, title: '電子記録債権債務・クレジット払いの仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai2-05/' },
  { id: 'iv-2-06', source: 'inuboki', category: '商品売買①', no: 6, title: '消費税(税抜方式)に関する一連の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai2-06/' },

  // inuboki 3. 商品売買② (6問)
  { id: 'iv-3-01', source: 'inuboki', category: '商品売買②', no: 1, title: '商品売買の勘定分析問題', url: 'https://inuboki.com/3q-mondai/3q-mondai3-01/' },
  { id: 'iv-3-02', source: 'inuboki', category: '商品売買②', no: 2, title: '商品有高帳(移動平均法)に関する問題', url: 'https://inuboki.com/3q-mondai/3q-mondai3-02/' },
  { id: 'iv-3-03', source: 'inuboki', category: '商品売買②', no: 3, title: '先入先出法による商品売買', url: 'https://inuboki.com/3q-mondai/3q-mondai3-03/' },
  { id: 'iv-3-04', source: 'inuboki', category: '商品売買②', no: 4, title: '売掛金元帳等の記入問題', url: 'https://inuboki.com/3q-mondai/3q-mondai3-04/' },
  { id: 'iv-3-06', source: 'inuboki', category: '商品売買②', no: 5, title: '商品売買の勘定連絡', url: 'https://inuboki.com/3q-mondai/3q-mondai3-06/' },
  { id: 'iv-3-07', source: 'inuboki', category: '商品売買②', no: 6, title: '売掛金元帳と売掛金勘定', url: 'https://inuboki.com/3q-mondai/3q-mondai3-07/' },

  // inuboki 4. 有形固定資産 (9問)
  { id: 'iv-4-00', source: 'inuboki', category: '有形固定資産', no: 1, title: '減価償却費の計算', url: 'https://inuboki.com/3q-mondai/3q-mondai4-00/' },
  { id: 'iv-4-01', source: 'inuboki', category: '有形固定資産', no: 2, title: '固定資産の取得に関する仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai4-01/' },
  { id: 'iv-4-02', source: 'inuboki', category: '有形固定資産', no: 3, title: '固定資産の一連の処理', url: 'https://inuboki.com/3q-mondai/3q-mondai4-02/' },
  { id: 'iv-4-03', source: 'inuboki', category: '有形固定資産', no: 4, title: '減価償却の勘定記入問題', url: 'https://inuboki.com/3q-mondai/3q-mondai4-03/' },
  { id: 'iv-4-04', source: 'inuboki', category: '有形固定資産', no: 5, title: '固定資産に関する後T/B作成問題1', url: 'https://inuboki.com/3q-mondai/3q-mondai4-04/' },
  { id: 'iv-4-05', source: 'inuboki', category: '有形固定資産', no: 6, title: '固定資産に関する後T/B作成問題2', url: 'https://inuboki.com/3q-mondai/3q-mondai4-05/' },
  { id: 'iv-4-06', source: 'inuboki', category: '有形固定資産', no: 7, title: '固定資産台帳に関する問題', url: 'https://inuboki.com/3q-mondai/3q-mondai4-06/' },
  { id: 'iv-4-07', source: 'inuboki', category: '有形固定資産', no: 8, title: '固定資産に関する後T/B作成問題3', url: 'https://inuboki.com/3q-mondai/3q-mondai4-07/' },
  { id: 'iv-4-08', source: 'inuboki', category: '有形固定資産', no: 9, title: '固定資産に関する後T/B作成問題4', url: 'https://inuboki.com/3q-mondai/3q-mondai4-08/' },

  // inuboki 5. その他の取引 (9問)
  { id: 'iv-5-01', source: 'inuboki', category: 'その他の取引', no: 1, title: '貸付金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-01/' },
  { id: 'iv-5-02', source: 'inuboki', category: 'その他の取引', no: 2, title: '借入金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-02/' },
  { id: 'iv-5-03', source: 'inuboki', category: 'その他の取引', no: 3, title: '前払金と前受金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-03/' },
  { id: 'iv-5-04', source: 'inuboki', category: 'その他の取引', no: 4, title: '仮払金と仮受金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-04/' },
  { id: 'iv-5-05', source: 'inuboki', category: 'その他の取引', no: 5, title: '立替金と預り金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-05/' },
  { id: 'iv-5-06', source: 'inuboki', category: 'その他の取引', no: 6, title: '諸経費の支払い等の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-06/' },
  { id: 'iv-5-07', source: 'inuboki', category: 'その他の取引', no: 7, title: '株式会社の設立・増資、剰余金の処分に関する仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-07/' },
  { id: 'iv-5-08', source: 'inuboki', category: 'その他の取引', no: 8, title: '法人税等の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-08/' },
  { id: 'iv-5-09', source: 'inuboki', category: 'その他の取引', no: 9, title: '差入保証金と役員貸付金の仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai5-09/' },

  // inuboki 6. 決算手続き (18問)
  { id: 'iv-6-01', source: 'inuboki', category: '決算手続き', no: 1, title: '売上原価の計算および仕訳問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-01/' },
  { id: 'iv-6-01-2', source: 'inuboki', category: '決算手続き', no: 2, title: '売上原価の計算', url: 'https://inuboki.com/3q-mondai/3q-mondai6-01-2/' },
  { id: 'iv-6-02', source: 'inuboki', category: '決算手続き', no: 3, title: '売上原価勘定の記入問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-02/' },
  { id: 'iv-6-03-1', source: 'inuboki', category: '決算手続き', no: 4, title: '貸倒引当金に関する問題1', url: 'https://inuboki.com/3q-mondai/3q-mondai6-03-1/' },
  { id: 'iv-6-03', source: 'inuboki', category: '決算手続き', no: 5, title: '貸倒引当金に関する問題2', url: 'https://inuboki.com/3q-mondai/3q-mondai6-03/' },
  { id: 'iv-6-04', source: 'inuboki', category: '決算手続き', no: 6, title: '貸倒引当金に関する問題3', url: 'https://inuboki.com/3q-mondai/3q-mondai6-04/' },
  { id: 'iv-6-05', source: 'inuboki', category: '決算手続き', no: 7, title: '貯蔵品に関する勘定記入問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-05/' },
  { id: 'iv-6-06', source: 'inuboki', category: '決算手続き', no: 8, title: '貯蔵品に関する後T/B作成問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-06/' },
  { id: 'iv-6-07', source: 'inuboki', category: '決算手続き', no: 9, title: '経過勘定項目に関する問題1', url: 'https://inuboki.com/3q-mondai/3q-mondai6-07/' },
  { id: 'iv-6-08', source: 'inuboki', category: '決算手続き', no: 10, title: '経過勘定項目に関する問題2', url: 'https://inuboki.com/3q-mondai/3q-mondai6-08/' },
  { id: 'iv-6-08-2', source: 'inuboki', category: '決算手続き', no: 11, title: '経過勘定項目に関する問題3', url: 'https://inuboki.com/3q-mondai/3q-mondai6-08-2/' },
  { id: 'iv-6-08-3', source: 'inuboki', category: '決算手続き', no: 12, title: '経過勘定項目に関する問題4', url: 'https://inuboki.com/3q-mondai/3q-mondai6-08-3/' },
  { id: 'iv-6-08-4', source: 'inuboki', category: '決算手続き', no: 13, title: '経過勘定項目に関する問題5', url: 'https://inuboki.com/3q-mondai/3q-mondai6-08-4/' },
  { id: 'iv-6-09', source: 'inuboki', category: '決算手続き', no: 14, title: '訂正仕訳の問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-09/' },
  { id: 'iv-6-10', source: 'inuboki', category: '決算手続き', no: 15, title: '税金に関する後T/B作成問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-10/' },
  { id: 'iv-6-11', source: 'inuboki', category: '決算手続き', no: 16, title: '繰越利益剰余金勘定の記入問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-11/' },
  { id: 'iv-6-12', source: 'inuboki', category: '決算手続き', no: 17, title: '決算振替仕訳に関する問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-12/' },
  { id: 'iv-6-13', source: 'inuboki', category: '決算手続き', no: 18, title: '精算表の作成問題', url: 'https://inuboki.com/3q-mondai/3q-mondai6-13/' },

  // inuboki 7. 伝票・証憑 (10問)
  { id: 'iv-7-01', source: 'inuboki', category: '伝票・証憑', no: 1, title: '伝票の記入問題1', url: 'https://inuboki.com/3q-mondai/3q-mondai7-01/' },
  { id: 'iv-7-02', source: 'inuboki', category: '伝票・証憑', no: 2, title: '伝票の記入問題2', url: 'https://inuboki.com/3q-mondai/3q-mondai7-02/' },
  { id: 'iv-7-03', source: 'inuboki', category: '伝票・証憑', no: 3, title: '仕訳日計表の作成問題', url: 'https://inuboki.com/3q-mondai/3q-mondai7-03/' },
  { id: 'iv-7-04', source: 'inuboki', category: '伝票・証憑', no: 4, title: '証憑から仕訳を導く問題1', url: 'https://inuboki.com/3q-mondai/3q-mondai7-04/' },
  { id: 'iv-7-05', source: 'inuboki', category: '伝票・証憑', no: 5, title: '証憑から仕訳を導く問題2', url: 'https://inuboki.com/3q-mondai/3q-mondai7-05/' },
  { id: 'iv-7-06', source: 'inuboki', category: '伝票・証憑', no: 6, title: '証憑から仕訳を導く問題3', url: 'https://inuboki.com/3q-mondai/3q-mondai7-06/' },
  { id: 'iv-7-07', source: 'inuboki', category: '伝票・証憑', no: 7, title: '証憑から仕訳を導く問題4', url: 'https://inuboki.com/3q-mondai/3q-mondai7-07/' },
  { id: 'iv-7-08', source: 'inuboki', category: '伝票・証憑', no: 8, title: '証憑から仕訳を導く問題5', url: 'https://inuboki.com/3q-mondai/3q-mondai7-08/' },
  { id: 'iv-7-09', source: 'inuboki', category: '伝票・証憑', no: 9, title: '証憑から仕訳を導く問題6', url: 'https://inuboki.com/3q-mondai/3q-mondai7-09/' },
  { id: 'iv-7-10', source: 'inuboki', category: '伝票・証憑', no: 10, title: '証憑から仕訳を導く問題7', url: 'https://inuboki.com/3q-mondai/3q-mondai7-10/' },

  // inuboki 8. 理論等 (3問)
  { id: 'iv-8-01', source: 'inuboki', category: '理論等', no: 1, title: '語句記入問題1', url: 'https://inuboki.com/3q-mondai/3q-mondai8-01/' },
  { id: 'iv-8-02', source: 'inuboki', category: '理論等', no: 2, title: '語句記入問題2', url: 'https://inuboki.com/3q-mondai/3q-mondai8-02/' },
  { id: 'iv-8-03', source: 'inuboki', category: '理論等', no: 3, title: '補助簿の選択問題', url: 'https://inuboki.com/3q-mondai/3q-mondai8-03/' },
];
