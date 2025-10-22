import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { useEffect, useState } from 'react';
import { Transaction } from './services/analytics';
import { readSheet } from './api/googleSheets';
import CalendarHeatmap from './components/CalendarHeatmap';
import TrendChart from './components/TrendChart';
import BottomNav from './components/BottomNav';

interface Props {
  spreadsheetId: string;
  accessToken: string;
  onSignOut: () => void;
}

const MainApp: React.FC<Props> = ({ spreadsheetId, accessToken, onSignOut }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!accessToken) return;
    setLoading(true);
    const data = await readSheet(spreadsheetId, accessToken);
    if (data) {
      const formatted: Transaction[] = data.slice(1).map((row: any[]) => ({ item: row[0], cost: parseFloat(row[1]), date: row[2] }));
      setTransactions(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreadsheetId, accessToken]);

  return (
    <BrowserRouter>
      <div style={{ paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard spreadsheetId={spreadsheetId} accessToken={accessToken} onSignOut={onSignOut} onRefresh={fetchTransactions} transactions={transactions} loading={loading} />} />
          <Route path="/heatmap" element={<CalendarHeatmap transactions={transactions} />} />
          <Route path="/trend" element={<TrendChart transactions={transactions} />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  );
};

export default MainApp;
