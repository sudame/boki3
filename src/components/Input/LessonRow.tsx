import type { Lesson } from '../../data/lessons';
import { useAppState } from '../../state/StateContext';
import styles from './LessonRow.module.css';

type Props = { lesson: Lesson };

export const LessonRow = ({ lesson }: Props) => {
  const { state, dispatch } = useAppState();
  const done = !!state.lessonProgress[lesson.id];
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
      <a className={styles.link} href={lesson.url} target="_blank" rel="noreferrer" title="テキストを開く">↗</a>
    </div>
  );
};
