import { useAppState } from '../../state/StateContext';
import { recentWrongs } from '../../state/selectors';
import { PROBLEMS } from '../../data/problems';
import styles from './ReviewQueue.module.css';

const PROBLEM_BY_ID = new Map(PROBLEMS.map(p => [p.id, p]));

export const ReviewQueue = () => {
  const { state } = useAppState();
  const today = new Date().toISOString().slice(0, 10);
  const wrongs = recentWrongs(state, today, 7);

  return (
    <div className={styles.queue}>
      <h3 className={styles.title}>復習キュー: 直近7日で不正解だった問題 ({wrongs.length})</h3>
      {wrongs.length === 0 ? (
        <p className={styles.empty}>該当なし。順調です。</p>
      ) : (
        <div className={styles.list}>
          {wrongs.map(a => {
            const p = PROBLEM_BY_ID.get(a.problemId);
            if (!p) return null;
            return (
              <div key={a.id} className={styles.item}>
                <span className={styles.no}>{p.no}.</span>
                <span className={styles.cat}>{p.category}</span>
                <a className={styles.linkTitle} href={p.url} target="_blank" rel="noreferrer">{p.title}</a>
                <span className={styles.date}>{a.attemptedAt.slice(0, 10)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
