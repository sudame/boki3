import type { Lesson } from '../../data/lessons';
import { useAppState } from '../../state/StateContext';
import styles from './LessonRow.module.css';

type Props = { lesson: Lesson };

export const LessonRow = ({ lesson }: Props) => {
  const { state, dispatch } = useAppState();
  const progress = state.lessonProgress[lesson.id];
  const done = !!progress;
  const completedDate = progress ? progress.completedAt.slice(0, 10) : '';

  return (
    <div className={styles.row}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => dispatch({ type: 'toggleLesson', lessonId: lesson.id })}
        aria-label={`第${lesson.no}回 完了`}
      />
      <span className={styles.no}>第{lesson.no}回</span>
      <span className={`${styles.title} ${done ? styles.titleDone : ''}`}>{lesson.title}</span>
      {done && (
        <input
          type="date"
          className={styles.dateInput}
          value={completedDate}
          onChange={e => dispatch({ type: 'setLessonCompletedAt', lessonId: lesson.id, date: e.target.value })}
          title="完了日"
          aria-label={`第${lesson.no}回 完了日`}
        />
      )}
      <a className={styles.link} href={lesson.url} target="_blank" rel="noreferrer" title="テキストを開く">↗</a>
    </div>
  );
};
