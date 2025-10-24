import React, { useState, useEffect } from 'react';
import { readSheet, writeSheet } from '../api/googleSheets';
import { Transaction, calculateMetrics } from '../services/analytics';
import AddTransactionForm from './AddTransactionForm';

interface DashboardProps {
  onSignOut: () => void;
  spreadsheetId: string;
  accessToken: string;
  transactions?: Transaction[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
  onTokenExpired?: () => void; // Callback when token expires
  onViewWeekly?: (transactions: Transaction[]) => void; // Callback to view weekly breakdown
}

const Dashboard: React.FC<DashboardProps> = ({ onSignOut, spreadsheetId, accessToken, transactions: txFromParent, loading: loadingFromParent, onRefresh: onRefreshFromParent, onTokenExpired, onViewWeekly }) => {
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(txFromParent || []);
  const [loading, setLoading] = useState<boolean>(loadingFromParent ?? !txFromParent);

  const handleAddTransaction = async (transactionsToAdd: { item: string; cost: number; date: string }[] | { item: string; cost: number; date: string }) => {
    setShowAddForm(false);
    const txs = Array.isArray(transactionsToAdd) ? transactionsToAdd : [transactionsToAdd];
    const values = txs.map(t => [t.item, t.cost, t.date]);
    if (!accessToken) {
      setError('Access token not found.');
      return;
    }
    const result = await writeSheet(spreadsheetId, values, accessToken);
    // Check if token expired
    if (result && result.error === 'token_expired') {
      setError('Your login session expired. Please refresh and log in again.');
      if (onTokenExpired) onTokenExpired();
      return;
    }
    if (result) {
      if (onRefreshFromParent) {
        await onRefreshFromParent();
      } else {
        // fallback: fetch data locally
        const data = await readSheet(spreadsheetId, accessToken);
        if (data && data.error === 'token_expired') {
          setError('Your login session expired. Please refresh and log in again.');
          if (onTokenExpired) onTokenExpired();
          return;
        }
        if (data) {
          const formattedData: Transaction[] = data.slice(1).map((row: any[]) => ({ item: row[0], cost: parseFloat(row[1]), date: row[2] }));
          setTransactions(formattedData);
        }
      }
    } else {
      setError('Failed to add transaction.');
    }
  };

  useEffect(() => {
    // If parent didn't provide transactions, fetch locally on mount
    const fetchLocal = async () => {
      if (txFromParent) return;
      if (!accessToken) return;
      setLoading(true);
      const data = await readSheet(spreadsheetId, accessToken);
      // Check if token expired
      if (data && data.error === 'token_expired') {
        setError('Your login session expired. Please refresh and log in again.');
        if (onTokenExpired) onTokenExpired();
        setLoading(false);
        return;
      }
      if (data) {
        const formattedData: Transaction[] = data.slice(1).map((row: any[]) => ({ item: row[0], cost: parseFloat(row[1]), date: row[2] }));
        setTransactions(formattedData);
      }
      setLoading(false);
    };

    fetchLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {/* Today */}
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Today</h5>
              <p className="card-text">Total: ${metrics.today.toFixed(2)}</p>
            </div>
          </div>
        </div>
        {/* Current Month */}
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Current Month</h5>
              <p className="card-text">Total: ${metrics.currentMonth.total.toFixed(2)}</p>
              <p className="card-text">Max Spend: {metrics.currentMonth.maxItem}</p>
              <p className="card-text">Max Date: {metrics.currentMonth.maxDate}</p>
            </div>
          </div>
        </div>
        {/* Previous Month */}
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Previous Month</h5>
              <p className="card-text">Total: ${metrics.previousMonth.total.toFixed(2)}</p>
              <p className="card-text">Max Spend: {metrics.previousMonth.maxItem}</p>
              <p className="card-text">Max Date: {metrics.previousMonth.maxDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Weekly Breakdown Button */}
      <div className="mb-4">
        <button 
          className="btn btn-info"
          onClick={() => onViewWeekly && onViewWeekly(transactions)}
        >
          View 7-Day Breakdown
        </button>
      </div>

      {/* All Transactions */}
      <h2 className="mb-3">All Transactions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Cost</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tr, index) => {
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
        className="btn btn-primary btn-lg rounded-circle fab"
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