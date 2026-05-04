import { useState } from 'react';
import { useAppState } from '../state/StateContext';
import styles from './Settings.module.css';

type Props = { onClose: () => void };

export const Settings = ({ onClose }: Props) => {
  const { state, dispatch } = useAppState();
  const [startDate, setStartDate] = useState(state.startDate);
  const [targetDate, setTargetDate] = useState(state.targetDate);
  const error = targetDate < startDate ? '目標日は開始日以降にしてください' : '';

  const save = () => {
    if (error) return;
    if (startDate !== state.startDate) dispatch({ type: 'setStartDate', date: startDate });
    if (targetDate !== state.targetDate) dispatch({ type: 'setTargetDate', date: targetDate });
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>設定</h2>
        <div className={styles.row}>
          <label className={styles.label}>開始日</label>
          <input className={styles.input} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>目標日</label>
          <input className={styles.input} type="date" value={targetDate} min={startDate} onChange={e => setTargetDate(e.target.value)} />
          {error && <span className={styles.error}>{error}</span>}
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={onClose}>キャンセル</button>
          <button className={`${styles.btn} ${styles.primary}`} onClick={save} disabled={!!error}>保存</button>
        </div>
      </div>
    </div>
  );
};
