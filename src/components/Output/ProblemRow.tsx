import { useState } from 'react';
import type { Problem } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import styles from './ProblemRow.module.css';

type Props = { problem: Problem };

export const ProblemRow = ({ problem }: Props) => {
  const { state, dispatch } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const attempts = state.problemAttempts
    .filter(a => a.problemId === problem.id)
    .sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
  const latest = attempts[0];
  const badgeClass = !latest ? styles.badgeNone : latest.correct ? styles.badgeOk : styles.badgeNg;
  const badgeText = !latest ? '—' : latest.correct ? '○' : '×';

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <span className={styles.no}>{problem.no}.</span>
        <span className={`${styles.badge} ${badgeClass}`}>{badgeText}</span>
        <span className={styles.title} onClick={() => setExpanded(e => !e)}>{problem.title}</span>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnOk}`} onClick={() => dispatch({ type: 'recordAttempt', problemId: problem.id, correct: true })}>○</button>
          <button className={`${styles.btn} ${styles.btnNg}`} onClick={() => dispatch({ type: 'recordAttempt', problemId: problem.id, correct: false })}>×</button>
        </div>
        <a className={styles.link} href={problem.url} target="_blank" rel="noreferrer" title="問題を開く">↗</a>
      </div>
      {expanded && attempts.length > 0 && (
        <div className={styles.history}>
          {attempts.map(a => (
            <div key={a.id} className={styles.histItem}>
              {new Date(a.attemptedAt).toLocaleString('ja-JP')} — {a.correct ? '○' : '×'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
