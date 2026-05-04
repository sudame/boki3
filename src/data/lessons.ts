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
