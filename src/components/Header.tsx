import { useAppState } from '../state/StateContext';
import { inputProgress, outputAccuracy, daysRemaining, readinessScore } from '../state/selectors';
import styles from './Header.module.css';

type Props = { onOpenSettings: () => void };

export const Header = ({ onOpenSettings }: Props) => {
  const { state } = useAppState();
  const ip = inputProgress(state);
  const oa = outputAccuracy(state);
  const today = new Date().toISOString().slice(0, 10);
  const left = daysRemaining(state, today);
  const readiness = readinessScore(state);
  const readinessLabel =
    readiness.source === 'none'
      ? '—'
      : `${Math.round(readiness.score)}点${readiness.source === 'mock' ? ' (模試)' : ' (予測)'}`;
  const readinessClass =
    readiness.source === 'none' ? styles.chip
    : readiness.score >= 70 ? `${styles.chip} ${styles.chipPass}`
    : `${styles.chip} ${styles.chipFail}`;
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>簿記3級ダッシュボード</h1>
      <div className={styles.chips}>
        <span className={styles.chip}>進捗 {ip.done}/{ip.total} ({Math.round(ip.rate * 100)}%)</span>
        <span className={styles.chip}>正答率 {oa.attempted === 0 ? '—' : `${Math.round(oa.rate * 100)}%`} ({oa.correct}/{oa.attempted})</span>
        <span className={readinessClass} title="模試があれば最新模試、なければ練習正答率を本試験配点で重み付け">
          想定 {readinessLabel}
        </span>
        <span className={styles.chip}>残り {left}日</span>
      </div>
      <button className={styles.settingsBtn} onClick={onOpenSettings} aria-label="設定">⚙</button>
    </header>
  );
};
