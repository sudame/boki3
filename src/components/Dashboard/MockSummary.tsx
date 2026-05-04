import { useAppState } from '../../state/StateContext';
import { bestMockTotal } from '../../state/selectors';
import styles from './MockSummary.module.css';

const PASS_LINE = 70;

export const MockSummary = () => {
  const { state } = useAppState();
  const best = bestMockTotal(state);
  const taken = state.mockExams.filter(m => m.total !== null);
  const avg = taken.length === 0 ? null : Math.round((taken.reduce((s, m) => s + m.total!, 0) / taken.length) * 10) / 10;

  return (
    <div>
      <div className={styles.list}>
        {state.mockExams.map(m => {
          const scoreClass =
            m.total === null ? `${styles.score} ${styles.scoreNone}`
            : m.total >= PASS_LINE ? `${styles.score} ${styles.scorePass}`
            : `${styles.score} ${styles.scoreFail}`;
          const breakdown = [m.q1, m.q2, m.q3].some(v => v !== null)
            ? `第1問 ${m.q1 ?? '—'} / 第2問 ${m.q2 ?? '—'} / 第3問 ${m.q3 ?? '—'}`
            : null;
          return (
            <div key={m.no} className={styles.slot}>
              <span className={styles.slotTitle}>模試 {m.no}</span>
              <span className={scoreClass}>{m.total === null ? '未受験' : `${m.total}点`}</span>
              {breakdown && <span className={styles.breakdown}>{breakdown}</span>}
              {m.takenAt && <span className={styles.date}>{m.takenAt}</span>}
            </div>
          );
        })}
      </div>
      <div className={styles.summary}>
        <span>受験回数: <strong>{taken.length}/3</strong></span>
        <span>平均点: <strong>{avg ?? '—'}</strong></span>
        <span>最高点: <strong>{best ?? '—'}</strong></span>
        <span>合格基準: <strong>{PASS_LINE}点</strong></span>
      </div>
    </div>
  );
};
