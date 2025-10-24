import React from 'react';
import { Transaction, calculateMetrics } from '../services/analytics';

interface WeeklyBreakdownProps {
  transactions: Transaction[];
  onBack: () => void;
}

const WeeklyBreakdown: React.FC<WeeklyBreakdownProps> = ({ transactions, onBack }) => {
  const metrics = calculateMetrics(transactions);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>7-Day Breakdown</h1>
        <button className="btn btn-secondary" onClick={onBack}>Back to Dashboard</button>
      </div>

      {/* 7-Day Daily Breakdown Table */}
      <div className="mb-4">
        <table className="table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {metrics.dailyBreakdown.map((day, index) => (
              <tr key={index}>
                <td><strong>{day.label}</strong></td>
                <td>{day.date}</td>
                <td>${day.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Weekly Summary</h5>
          <p className="card-text">Total Spent (7 days): ${metrics.last7Days.toFixed(2)}</p>
          <p className="card-text">Average per day: ${(metrics.last7Days / 7).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBreakdown;
