import React, { useState } from 'react';
import { writeSheet } from '../api/googleSheets';
import { Transaction, calculateMetrics } from '../services/analytics';
import AddTransactionForm from './AddTransactionForm';

interface DashboardProps {
  onSignOut: () => void;
  spreadsheetId: string;
  accessToken: string;
  transactions: Transaction[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ onSignOut, spreadsheetId, accessToken, transactions, loading, onRefresh }) => {
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTransaction = async (transactionsToAdd: { item: string; cost: number; date: string }[] | { item: string; cost: number; date: string }) => {
    setShowAddForm(false);
    if (!accessToken) {
      setError('Access token not found.');
      return;
    }

    const txs = Array.isArray(transactionsToAdd) ? transactionsToAdd : [transactionsToAdd];
    const values = txs.map(t => [t.item, t.cost, t.date]);
    const result = await writeSheet(spreadsheetId, values, accessToken);
    if (result) {
      await onRefresh(); // ask parent to refresh data
    } else {
      setError('Failed to add transaction.');
    }
  };

  const metrics = calculateMetrics(transactions);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button className="btn btn-danger" onClick={onSignOut}>Disconnect</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Metrics Cards */}
      <div className="row mb-4">
        {/* Current Month */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Current Month</h5>
              <p className="card-text">Total: ${metrics.currentMonth.total.toFixed(2)}</p>
              <p className="card-text">Max Spend: {metrics.currentMonth.maxItem} (${metrics.currentMonth.maxItemCost.toFixed(2)})</p>
              <p className="card-text">Max Date: {metrics.currentMonth.maxDate}</p>
            </div>
          </div>
        </div>
        {/* Previous Month */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Previous Month</h5>
              <p className="card-text">Total: ${metrics.previousMonth.total.toFixed(2)}</p>
              <p className="card-text">Max Spend: {metrics.previousMonth.maxItem} (${metrics.previousMonth.maxItemCost.toFixed(2)})</p>
              <p className="card-text">Max Date: {metrics.previousMonth.maxDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <h2 className="mb-3">Recent Transactions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cost</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 10).map((tr, index) => {
            const isMaxDate = tr.date === metrics.currentMonth.maxDate;
            return (
              <tr key={index} className={isMaxDate ? 'table-warning' : ''}>
                <td>{tr.item}</td>
                <td>${tr.cost.toFixed(2)}</td>
                <td>{tr.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Transaction FAB */}
      <button 
        className="btn btn-primary btn-lg rounded-circle position-fixed"
        style={{ right: '2rem', bottom: '2rem', zIndex: 1050 }}
        onClick={() => setShowAddForm(true)}
      >
        +
      </button>

      {showAddForm && (
        <AddTransactionForm 
          onClose={() => setShowAddForm(false)} 
          onAdd={handleAddTransaction} 
        />
      )}

    </div>
  );
};

export default Dashboard;