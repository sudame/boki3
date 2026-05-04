import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useAppState } from '../../state/StateContext';
import { burnupSeries } from '../../state/selectors';

export const BurnupChart = () => {
  const { state } = useAppState();
  const today = new Date().toISOString().slice(0, 10);
  const data = burnupSeries(state, today);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
        <YAxis domain={[0, 46]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ideal" name="理想" stroke="#bbb" strokeDasharray="4 4" dot={false} />
        <Line type="monotone" dataKey="actual" name="実績" stroke="#0066cc" strokeWidth={2} connectNulls={false} />
        <Line type="monotone" dataKey="forecast" name="予測" stroke="#e67e22" strokeDasharray="6 4" strokeWidth={2} dot={false} connectNulls={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};
