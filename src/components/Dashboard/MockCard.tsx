import { useAppState } from '../../state/StateContext';
import { bestMockTotal } from '../../state/selectors';
import type { MockExam } from '../../state/types';
import styles from './MockCard.module.css';

const PASS_LINE = 70;

const SectionInput = ({
  label,
  max,
  value,
  onChange,
}: {
  label: string;
  max: number;
  value: number | null;
  onChange: (v: number | null) => void;
}) => (
  <label className={styles.field}>
    {label} (/{max})
    <input
      className={styles.input}
      type="number"
      min={0}
      max={max}
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
    />
  </label>
);

const MockSlot = ({ mock }: { mock: MockExam }) => {
  const { dispatch } = useAppState();
  const update = (patch: Partial<Omit<MockExam, 'no'>>) =>
    dispatch({ type: 'updateMockExam', no: mock.no, patch });

  const passBadge =
    mock.total === null ? <span className={styles.badgeNone}>未受験</span>
    : mock.total >= PASS_LINE ? <span className={styles.badgePass}>合格 {mock.total}点</span>
    : <span className={styles.badgeFail}>不合格 {mock.total}点</span>;

  return (
    <div className={styles.slot}>
      <div className={styles.slotHeader}>
        <span className={styles.slotTitle}>模試 {mock.no}</span>
        {passBadge}
      </div>
      <div className={styles.fields}>
        <label className={styles.field}>
          受験日
          <input
            className={styles.input}
            type="date"
            value={mock.takenAt ?? ''}
            onChange={e => update({ takenAt: e.target.value || null })}
          />
        </label>
        <SectionInput label="合計" max={100} value={mock.total} onChange={v => update({ total: v })} />
        <SectionInput label="第1問" max={45} value={mock.q1} onChange={v => update({ q1: v })} />
        <SectionInput label="第2問" max={20} value={mock.q2} onChange={v => update({ q2: v })} />
        <SectionInput label="第3問" max={35} value={mock.q3} onChange={v => update({ q3: v })} />
      </div>
      <div className={styles.actions}>
        <button className={styles.btnSmall} onClick={() => dispatch({ type: 'clearMockExam', no: mock.no })}>
          クリア
        </button>
      </div>
    </div>
  );
};

export const MockCard = () => {
  const { state } = useAppState();
  const best = bestMockTotal(state);
  const taken = state.mockExams.filter(m => m.total !== null);
  const avg = taken.length === 0 ? null : Math.round((taken.reduce((s, m) => s + m.total!, 0) / taken.length) * 10) / 10;

  return (
    <div>
      <div className={styles.list}>
        {state.mockExams.map(m => <MockSlot key={m.no} mock={m} />)}
      </div>
      <div className={styles.summary}>
        <span>受験回数: <strong>{taken.length}/3</strong></span>
        <span>平均点: <strong>{avg ?? '—'}</strong></span>
        <span>最高点: <strong>{best ?? '—'}</strong></span>
        <span>合格基準: <strong>{PASS_LINE}点</strong></span>
      </div>
    </div>
  );
};
