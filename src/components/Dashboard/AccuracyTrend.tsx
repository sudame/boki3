import { useAppState } from '../../state/StateContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const AccuracyTrend = () => {
  const { state } = useAppState();
  const today = new Date();
  const days: { date: string; rate: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const dayAttempts = state.problemAttempts.filter(a => a.attemptedAt.slice(0, 10) === iso);
    const rate = dayAttempts.length === 0 ? null : dayAttempts.filter(a => a.correct).length / dayAttempts.length;
    days.push({ date: iso, rate: rate === null ? null : Math.round(rate * 100) });
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={days}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
        <YAxis domain={[0, 100]} unit="%" />
        <Tooltip />
        <Line type="monotone" dataKey="rate" name="正答率" stroke="#1c8c1c" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
};
