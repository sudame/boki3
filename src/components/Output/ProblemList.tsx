import { PROBLEMS } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import { latestAttemptByProblem } from '../../state/selectors';
import { ProblemRow } from './ProblemRow';
import styles from './ProblemList.module.css';

export const ProblemList = () => {
  const { state } = useAppState();
  const latest = latestAttemptByProblem(state);
  return (
    <div>
      {[1, 2].map(part => {
        const problems = PROBLEMS.filter(p => p.part === part);
        const attempted = problems.filter(p => latest[p.id]).length;
        const correct = problems.filter(p => latest[p.id]?.correct).length;
        return (
          <div key={part} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span>第{part}問対策</span>
              <span>{correct}/{attempted} 正解 ({attempted}/{problems.length} 着手)</span>
            </div>
            {problems.map(p => <ProblemRow key={p.id} problem={p} />)}
          </div>
        );
      })}
    </div>
  );
};
