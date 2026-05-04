import { useAppState } from '../../state/StateContext';
import { requiredDailyPace } from '../../state/selectors';
import styles from './PaceCard.module.css';

const fmt = (n: number) => (n === 0 ? '0' : n < 10 ? n.toFixed(1) : Math.ceil(n).toString());

export const PaceCard = () => {
  const { state } = useAppState();
  const today = new Date().toISOString().slice(0, 10);
  const pace = requiredDailyPace(state, today);
  const overdue = pace.daysLeftInclusive === 0 && (pace.lessonsRemaining > 0 || pace.problemsRemaining > 0);

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.metric}>
          <span className={styles.label}>残日数 (今日含む)</span>
          <span className={`${styles.value} ${overdue ? styles.valueWarn : ''}`}>{pace.daysLeftInclusive}日</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>レッスン / 日</span>
          <span className={styles.value}>{fmt(pace.lessonsPerDay)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>問題 / 日</span>
          <span className={styles.value}>{fmt(pace.problemsPerDay)}</span>
        </div>
      </div>
      <div className={styles.detail}>
        残り: レッスン {pace.lessonsRemaining}/{46}、問題 {pace.problemsRemaining} 件未着手
      </div>
    </div>
  );
};
