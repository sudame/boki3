import { useAppState } from '../../state/StateContext';
import { latestAttemptByProblem } from '../../state/selectors';
import { PROBLEMS, SOURCE_LABELS, SOURCE_ORDER, examSectionOf, EXAM_SECTION_MAX, type ExamSection } from '../../data/problems';
import styles from './Heatmap.module.css';

const colorFor = (rate: number, attempted: boolean): string => {
  if (!attempted) return '#e5e5ea';
  if (rate >= 0.8) return '#1c8c1c';
  if (rate >= 0.6) return '#7cb342';
  if (rate >= 0.4) return '#f5a623';
  return '#c0392b';
};

type Row = { key: string; label: string; correct: number; attempted: number; total: number };

export const Heatmap = () => {
  const { state } = useAppState();
  const latest = latestAttemptByProblem(state);

  const buildRows = (filter: (p: typeof PROBLEMS[number]) => boolean): Row[] => {
    const m = new Map<string, Row>();
    for (const p of PROBLEMS) {
      if (!filter(p)) continue;
      const key = p.category;
      const r = m.get(key) ?? { key, label: p.category, correct: 0, attempted: 0, total: 0 };
      r.total += 1;
      const a = latest[p.id];
      if (a) {
        r.attempted += 1;
        if (a.correct) r.correct += 1;
      }
      m.set(key, r);
    }
    return [...m.values()];
  };

  return (
    <div className={styles.grid}>
      <div className={styles.sectionLabel}>カテゴリ別 (ソース別)</div>
      {SOURCE_ORDER.map(source => {
        const rows = buildRows(p => p.source === source);
        return (
          <div key={source}>
            <div className={styles.sectionLabel}>{SOURCE_LABELS[source]}</div>
            {rows.map(r => {
              const rate = r.attempted === 0 ? 0 : r.correct / r.attempted;
              const fillPct = r.attempted === 0 ? 0 : (r.attempted / r.total) * 100;
              const color = colorFor(rate, r.attempted > 0);
              return (
                <div key={r.key} className={styles.row}>
                  <span className={styles.label} title={r.label}>{r.label}</span>
                  <div className={styles.bar}>
                    <div className={styles.fill} style={{ width: `${fillPct}%`, background: color }} />
                  </div>
                  <span className={styles.value}>
                    {r.attempted === 0 ? '—' : `${Math.round(rate * 100)}% (${r.correct}/${r.attempted})`}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className={styles.sectionLabel}>本試験セクション別 (配点重み)</div>
      {([1, 2, 3] as ExamSection[]).map(sec => {
        const rows = buildRows(p => examSectionOf(p) === sec);
        const correct = rows.reduce((s, r) => s + r.correct, 0);
        const attempted = rows.reduce((s, r) => s + r.attempted, 0);
        const total = rows.reduce((s, r) => s + r.total, 0);
        const rate = attempted === 0 ? 0 : correct / attempted;
        const expected = rate * EXAM_SECTION_MAX[sec];
        const color = colorFor(rate, attempted > 0);
        return (
          <div key={sec} className={styles.row}>
            <span className={styles.label}>第{sec}問 ({EXAM_SECTION_MAX[sec]}点満点)</span>
            <div className={styles.bar}>
              <div className={styles.fill} style={{ width: `${attempted === 0 ? 0 : (attempted / total) * 100}%`, background: color }} />
            </div>
            <span className={styles.value}>
              {attempted === 0 ? '—' : `${Math.round(rate * 100)}% → ${expected.toFixed(1)}点`}
            </span>
          </div>
        );
      })}

      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.swatch} style={{ background: '#e5e5ea' }} />未着手</span>
        <span className={styles.legendItem}><span className={styles.swatch} style={{ background: '#c0392b' }} />〜40%</span>
        <span className={styles.legendItem}><span className={styles.swatch} style={{ background: '#f5a623' }} />40-60%</span>
        <span className={styles.legendItem}><span className={styles.swatch} style={{ background: '#7cb342' }} />60-80%</span>
        <span className={styles.legendItem}><span className={styles.swatch} style={{ background: '#1c8c1c' }} />80%+</span>
      </div>
    </div>
  );
};
