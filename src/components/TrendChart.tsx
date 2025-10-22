import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  transactions: { date: string; cost: number }[];
}

const TrendChart: React.FC<Props> = ({ transactions }) => {
  // aggregate by month
  const map: Record<string, number> = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + t.cost;
  });

  const data = Object.keys(map).sort().map(k => ({ month: k, total: map[k] }));

  return (
    <div className="p-3">
      <h3>Expense Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
