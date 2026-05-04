import { useState } from 'react';
import type { Problem } from '../../data/problems';
import type { ProblemAttempt } from '../../state/types';
import { ProblemRow } from './ProblemRow';
import styles from './ProblemSet.module.css';

type Props = {
  title: string;
  url: string;
  problems: Problem[];
  latest: Record<string, ProblemAttempt>;
};

export const ProblemSet = ({ title, url, problems, latest }: Props) => {
  const [open, setOpen] = useState(true);
  const attempted = problems.filter(p => latest[p.id]).length;
  const correct = problems.filter(p => latest[p.id]?.correct).length;

  return (
    <div className={styles.set}>
      <div className={styles.setHeader} onClick={() => setOpen(o => !o)}>
        <span className={styles.caret}>{open ? '▾' : '▸'}</span>
        <span className={styles.setIcon}>📄</span>
        <span className={styles.setTitle}>{title}</span>
        <span className={styles.setCount}>{correct}/{attempted} 正解 ({attempted}/{problems.length} 着手)</span>
        <a
          className={styles.setLink}
          href={url}
          target="_blank"
          rel="noreferrer"
          title="ページを開く"
          onClick={e => e.stopPropagation()}
        >
          ↗
        </a>
      </div>
      {open && (
        <div className={styles.setBody}>
          {problems.map(p => <ProblemRow key={p.id} problem={p} showNumber hideLink />)}
        </div>
      )}
    </div>
  );
};
