import { BurnupChart } from './BurnupChart';
import { AccuracyTrend } from './AccuracyTrend';
import { MockSummary } from './MockSummary';
import { PaceCard } from './PaceCard';
import { Heatmap } from './Heatmap';
import { StatusBanner } from './StatusBanner';
import { useAppState } from '../../state/StateContext';
import { burnupSeries, masteryBurnupSeries, masteryProgress, inputProgress } from '../../state/selectors';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { state } = useAppState();
  const today = new Date().toISOString().slice(0, 10);
  const inputData = burnupSeries(state, today);
  const masteryData = masteryBurnupSeries(state, today);
  const ip = inputProgress(state);
  const mp = masteryProgress(state);

  return (
    <div className={styles.grid}>
      {/* Tier 1: 結論 */}
      <StatusBanner />
      <div className={styles.row2}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>総合バーンアップ ({mp.total})</h2>
          <BurnupChart data={masteryData} goal={mp.total} />
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>インプット バーンアップ ({ip.total})</h2>
          <BurnupChart data={inputData} goal={ip.total} />
        </div>
      </div>

      {/* Tier 2: トレンドと運用 */}
      <div className={styles.tier}>Trends &amp; Pace</div>
      <div className={styles.row2}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>直近7日の正答率</h2>
          <AccuracyTrend />
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>必要ペース</h2>
          <PaceCard />
        </div>
      </div>

      {/* Tier 3: 詳細 */}
      <div className={styles.tier}>Details</div>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>模試サマリ (CPA 3回)</h2>
        <MockSummary />
      </div>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>セクション別 習熟度ヒートマップ</h2>
        <Heatmap />
      </div>
    </div>
  );
};
