import { useAppState } from '../../state/StateContext';
import {
  readinessScore,
  daysRemaining,
  burnupSeries,
  masteryBurnupSeries,
} from '../../state/selectors';
import styles from './StatusBanner.module.css';

type Verdict = { tone: 'green' | 'yellow' | 'red' | 'gray'; headline: string; detail: string };

const computeVerdict = (
  readiness: { score: number; source: 'mock' | 'practice' | 'none' },
  paceGap: number | null,
  daysLeft: number,
): Verdict => {
  if (readiness.source === 'none') {
    return { tone: 'gray', headline: 'データ収集中', detail: '練習問題を解くと想定点とペースが計算されます。' };
  }
  const score = readiness.score;
  const sourceLabel = readiness.source === 'mock' ? '模試' : '予測';
  const onPace = paceGap === null ? null : paceGap >= 0;
  const fmtGap = paceGap === null ? '' : paceGap >= 0 ? `+${paceGap.toFixed(0)}` : paceGap.toFixed(0);

  if (score >= 75 && onPace !== false) {
    return { tone: 'green', headline: '合格圏', detail: `想定 ${Math.round(score)}点 (${sourceLabel})。ペース ${fmtGap}。残り ${daysLeft}日、このまま維持。` };
  }
  if (score >= 65 || onPace === true) {
    return { tone: 'yellow', headline: 'もう一息', detail: `想定 ${Math.round(score)}点 (${sourceLabel})。${onPace === false ? `ペース不足 ${fmtGap}。 ` : ''}残り ${daysLeft}日。` };
  }
  return { tone: 'red', headline: '要注意', detail: `想定 ${Math.round(score)}点 (${sourceLabel})。${onPace === false ? `ペース不足 ${fmtGap}。 ` : ''}残り ${daysLeft}日。` };
};

export const StatusBanner = () => {
  const { state } = useAppState();
  const today = new Date().toISOString().slice(0, 10);
  const readiness = readinessScore(state);
  const daysLeft = daysRemaining(state, today);

  // ペースギャップ: 総合バーンアップで「目標日の forecast - ideal」 = どれだけ早く/遅く到達しそうか
  const mastery = masteryBurnupSeries(state, today);
  const inputs = burnupSeries(state, today);
  const lastMastery = mastery[mastery.length - 1];
  const lastInput = inputs[inputs.length - 1];
  const paceGap = lastMastery?.forecast === null || lastMastery?.forecast === undefined
    ? null
    : lastMastery.forecast - lastMastery.ideal;

  const verdict = computeVerdict(readiness, paceGap, daysLeft);

  const projForecast = lastMastery?.forecast === null || lastMastery?.forecast === undefined
    ? null
    : Math.round(lastMastery.forecast);
  const inputForecast = lastInput?.forecast === null || lastInput?.forecast === undefined
    ? null
    : Math.round(lastInput.forecast);

  return (
    <div className={`${styles.banner} ${styles[verdict.tone]}`}>
      <span className={`${styles.dot} ${styles['dot' + verdict.tone[0].toUpperCase() + verdict.tone.slice(1)]}`} />
      <div className={styles.body}>
        <span className={styles.headline}>{verdict.headline}</span>
        <span className={styles.detail}>{verdict.detail}</span>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>想定本番得点</span>
          <span className={styles.metricValue}>{readiness.source === 'none' ? '—' : Math.round(readiness.score)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>総合到達予測 (目標日)</span>
          <span className={styles.metricValue}>{projForecast ?? '—'}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>インプット到達予測</span>
          <span className={styles.metricValue}>{inputForecast ?? '—'}</span>
        </div>
      </div>
    </div>
  );
};
