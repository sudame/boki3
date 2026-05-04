import { useAppState } from '../state/StateContext';
import { inputProgress, outputAccuracy, daysRemaining } from '../state/selectors';
import styles from './Header.module.css';

type Props = { onOpenSettings: () => void };

export const Header = ({ onOpenSettings }: Props) => {
  const { state } = useAppState();
  const ip = inputProgress(state);
  const oa = outputAccuracy(state);
  const today = new Date().toISOString().slice(0, 10);
  const left = daysRemaining(state, today);
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>簿記3級ダッシュボード</h1>
      <div className={styles.chips}>
        <span className={styles.chip}>進捗 {ip.done}/{ip.total} ({Math.round(ip.rate * 100)}%)</span>
        <span className={styles.chip}>正答率 {oa.attempted === 0 ? '—' : `${Math.round(oa.rate * 100)}%`} ({oa.correct}/{oa.attempted})</span>
        <span className={styles.chip}>残り {left}日</span>
      </div>
      <button className={styles.settingsBtn} onClick={onOpenSettings} aria-label="設定">⚙</button>
    </header>
  );
};
