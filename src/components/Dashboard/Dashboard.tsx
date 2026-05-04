import { BurnupChart } from './BurnupChart';
import { AccuracyTrend } from './AccuracyTrend';
import { useAppState } from '../../state/StateContext';
import { burnupSeries, masteryBurnupSeries } from '../../state/selectors';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { state } = useAppState();
  const today = new Date().toISOString().slice(0, 10);
  const inputData = burnupSeries(state, today);
  const masteryData = masteryBurnupSeries(state, today);
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>総合バーンアップ (レッスン完了 + 問題正解 / 70)</h2>
        <BurnupChart data={masteryData} goal={70} />
      </div>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>インプット バーンアップ (レッスン完了 / 46)</h2>
        <BurnupChart data={inputData} goal={46} />
      </div>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>直近7日の正答率</h2>
        <AccuracyTrend />
      </div>
    </div>
  );
};
