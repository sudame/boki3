import { PROBLEMS, SOURCE_LABELS, SOURCE_ORDER, type Problem, type ProblemSource } from '../../data/problems';
import { useAppState } from '../../state/StateContext';
import { latestAttemptByProblem } from '../../state/selectors';
import { ProblemRow } from './ProblemRow';
import { ProblemSet } from './ProblemSet';
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

type Bucket = { kind: 'set' | 'single'; url: string; problems: Problem[] };

const bucketByUrl = (problems: Problem[]): Bucket[] => {
  const groups = new Map<string, Problem[]>();
  const order: string[] = [];
  for (const p of problems) {
    if (!groups.has(p.url)) {
      groups.set(p.url, []);
      order.push(p.url);
    }
    groups.get(p.url)!.push(p);
  }
  return order.map(url => {
    const ps = groups.get(url)!;
    return { kind: ps.length > 1 ? 'set' : 'single', url, problems: ps };
  });
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
              const buckets = bucketByUrl(problems);
              // カテゴリ全体が1つの多問ページに収まる場合はリンクをヘッダに置く
              const isSingleSet = buckets.length === 1 && buckets[0].kind === 'set';
              const sharedUrl = isSingleSet ? buckets[0].url : null;
              return (
                <div key={category} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>
                      {category}
                      {sharedUrl && (
                        <a className={styles.headerLink} href={sharedUrl} target="_blank" rel="noreferrer" title="ページを開く">↗</a>
                      )}
                    </span>
                    <span>{correct}/{attempted} 正解 ({attempted}/{problems.length} 着手)</span>
                  </div>
                  {isSingleSet
                    ? buckets[0].problems.map(p => (
                        <ProblemRow key={p.id} problem={p} showNumber hideLink />
                      ))
                    : buckets.map(bucket =>
                        bucket.kind === 'set' ? (
                          <ProblemSet
                            key={bucket.url}
                            title={`${bucket.problems[0].title} (${bucket.problems.length}問)`}
                            url={bucket.url}
                            problems={bucket.problems}
                            latest={latest}
                          />
                        ) : (
                          <ProblemRow key={bucket.problems[0].id} problem={bucket.problems[0]} />
                        ),
                      )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
