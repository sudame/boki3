import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { BurnupSeries } from '../../state/selectors';

type Props = {
  series: BurnupSeries;
  height?: number;
};

const formatDate = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const formatDateTime = (ms: number): string => {
  const d = new Date(ms);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${m}/${day} ${h}:${min}`;
};

// 1日刻みでX軸の目盛りを生成
const dailyTicks = (startMs: number, endMs: number): number[] => {
  const start = new Date(startMs);
  start.setHours(0, 0, 0, 0);
  const ticks: number[] = [];
  for (let t = start.getTime(); t <= endMs; t += 86_400_000) ticks.push(t);
  return ticks;
};

export const BurnupChart = ({ series, height = 280 }: Props) => {
  const ticks = dailyTicks(series.domain[0], series.domain[1]);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={series.points}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          dataKey="ts"
          type="number"
          scale="time"
          domain={series.domain}
          ticks={ticks}
          tickFormatter={formatDate}
        />
        <YAxis domain={[0, series.goal]} />
        <Tooltip labelFormatter={(label) => formatDateTime(Number(label))} />
        <Legend />
        <Line type="linear" dataKey="ideal" name="理想" stroke="#bbb" strokeDasharray="4 4" dot={false} connectNulls />
        <Line type="linear" dataKey="actual" name="実績" stroke="#0066cc" strokeWidth={2} connectNulls dot={{ r: 2 }} />
        <Line type="linear" dataKey="forecast" name="予測" stroke="#e67e22" strokeDasharray="6 4" strokeWidth={2} dot={false} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
};
