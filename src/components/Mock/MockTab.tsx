import { MockCard } from '../Dashboard/MockCard';
import styles from './MockTab.module.css';

export const MockTab = () => (
  <div className={styles.wrap}>
    <h2 className={styles.title}>模試の記録</h2>
    <p className={styles.help}>
      受験日と合計点 (0〜100)、内訳 (第1問 0〜45 / 第2問 0〜20 / 第3問 0〜35) を入力すると、ダッシュボードのサマリと「想定」スコアに反映されます。合格基準は70点。
    </p>
    <MockCard />
  </div>
);
