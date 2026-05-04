import { useState } from 'react';
import type { Problem } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import styles from './ProblemRow.module.css';

type Props = {
  problem: Problem;
  showNumber?: boolean;  // multi-problem-page では問N、それ以外は非表示
  hideLink?: boolean;    // 親 (ProblemSet) がリンクを持つ場合
};

export const ProblemRow = ({ problem, showNumber = false, hideLink = false }: Props) => {
  const { state, dispatch } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const attempts = state.problemAttempts
    .filter(a => a.problemId === problem.id)
    .sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
  const latest = attempts[0];
  const badgeNode = !latest ? null : (
    <span className={`${styles.badge} ${latest.correct ? styles.badgeOk : styles.badgeNg}`}>
      {latest.correct ? '○' : '×'}
    </span>
  );

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        {showNumber && <span className={styles.no}>問{problem.no}</span>}
        <span className={styles.badgeSlot}>{badgeNode}</span>
        <span className={styles.title} onClick={() => setExpanded(e => !e)}>{problem.title}</span>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnOk}`} onClick={() => dispatch({ type: 'recordAttempt', problemId: problem.id, correct: true })}>○</button>
          <button className={`${styles.btn} ${styles.btnNg}`} onClick={() => dispatch({ type: 'recordAttempt', problemId: problem.id, correct: false })}>×</button>
        </div>
        {!hideLink && (
          <a className={styles.link} href={problem.url} target="_blank" rel="noreferrer" title="問題を開く">↗</a>
        )}
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
