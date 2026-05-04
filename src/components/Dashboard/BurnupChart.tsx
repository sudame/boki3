import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { BurnupPoint } from '../../state/selectors';

type Props = {
  data: BurnupPoint[];
  goal: number;
  height?: number;
};

export const BurnupChart = ({ data, goal, height = 280 }: Props) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
      <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
      <YAxis domain={[0, goal]} />
      <Tooltip />
      <Legend />
      <Line type="linear" dataKey="ideal" name="理想" stroke="#bbb" strokeDasharray="4 4" dot={false} />
      <Line type="linear" dataKey="actual" name="実績" stroke="#0066cc" strokeWidth={2} connectNulls={false} />
      <Line type="linear" dataKey="forecast" name="予測" stroke="#e67e22" strokeDasharray="6 4" strokeWidth={2} dot={false} connectNulls={false} />
    </LineChart>
  </ResponsiveContainer>
);
