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
