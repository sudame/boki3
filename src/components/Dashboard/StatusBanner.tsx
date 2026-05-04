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
  const nowISO = new Date().toISOString();
  const readiness = readinessScore(state);
  const daysLeft = daysRemaining(state, today);

  const mastery = masteryBurnupSeries(state, nowISO);
  const inputs = burnupSeries(state, nowISO);

  const paceGap = mastery.projectedAtTarget === null
    ? null
    : mastery.projectedAtTarget - mastery.goal;

  const verdict = computeVerdict(readiness, paceGap, daysLeft);

  const projForecast = mastery.projectedAtTarget === null ? null : Math.round(mastery.projectedAtTarget);
  const inputForecast = inputs.projectedAtTarget === null ? null : Math.round(inputs.projectedAtTarget);

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
