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
