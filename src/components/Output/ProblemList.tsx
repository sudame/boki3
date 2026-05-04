import { PROBLEMS, SOURCE_LABELS, SOURCE_ORDER, type Problem, type ProblemSource } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import { latestAttemptByProblem } from '../../state/selectors';
import { ProblemRow } from './ProblemRow';
import { ReviewQueue } from './ReviewQueue';
import styles from './ProblemList.module.css';

const groupByCategory = (problems: Problem[]): Map<string, Problem[]> => {
  const m = new Map<string, Problem[]>();
  for (const p of problems) {
    if (!m.has(p.category)) m.set(p.category, []);
    m.get(p.category)!.push(p);
  }
  return m;
};

export const ProblemList = () => {
  const { state } = useAppState();
  const latest = latestAttemptByProblem(state);
  return (
    <div>
      <ReviewQueue />
      {SOURCE_ORDER.map((source: ProblemSource) => {
        const sourceProblems = PROBLEMS.filter(p => p.source === source);
        const categories = groupByCategory(sourceProblems);
        const totalAttempted = sourceProblems.filter(p => latest[p.id]).length;
        const totalCorrect = sourceProblems.filter(p => latest[p.id]?.correct).length;
        return (
          <div key={source} className={styles.source}>
            <h2 className={styles.sourceTitle}>
              <span>{SOURCE_LABELS[source]}</span>
              <span className={styles.sourceCount}>
                {totalCorrect}/{totalAttempted} 正解 ({totalAttempted}/{sourceProblems.length} 着手)
              </span>
            </h2>
            {[...categories.entries()].map(([category, problems]) => {
              const attempted = problems.filter(p => latest[p.id]).length;
              const correct = problems.filter(p => latest[p.id]?.correct).length;
              return (
                <div key={category} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span>{category}</span>
                    <span>{correct}/{attempted} 正解 ({attempted}/{problems.length} 着手)</span>
                  </div>
                  {problems.map(p => <ProblemRow key={p.id} problem={p} />)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
