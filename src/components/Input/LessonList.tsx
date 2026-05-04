import { LESSONS, type Lesson, type Section } from '../../data/lessons';
import { useAppState } from '../../state/StateContext';
import { LessonRow } from './LessonRow';
import styles from './LessonList.module.css';

const SECTIONS: Section[] = ['基礎知識', '仕訳', '帳簿', '決算'];

const groupBySubsection = (lessons: Lesson[]) => {
  const groups = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const key = l.subsection ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(l);
  }
  return groups;
};

export const LessonList = () => {
  const { state } = useAppState();
  return (
    <div>
      {SECTIONS.map(section => {
        const sectionLessons = LESSONS.filter(l => l.section === section);
        const doneCount = sectionLessons.filter(l => state.lessonProgress[l.id]).length;
        const groups = groupBySubsection(sectionLessons);
        return (
          <div key={section} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span>{section}</span>
              <span>{doneCount}/{sectionLessons.length}</span>
            </div>
            {[...groups.entries()].map(([sub, lessons]) => (
              <div key={sub}>
                {sub && <div className={styles.subsection}>{sub}</div>}
                {lessons.map(l => <LessonRow key={l.id} lesson={l} />)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
