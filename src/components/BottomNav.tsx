import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/', label: 'Transactions' },
    { path: '/heatmap', label: 'Heatmap' },
    { path: '/trend', label: 'Trend' },
  ];

  return (
    <div className="bottom-nav d-flex justify-content-around border-top bg-light" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '0.5rem 0' }}>
      {items.map(it => (
        <button key={it.path} className={`btn btn-link ${location.pathname === it.path ? 'text-primary' : ''}`} onClick={() => navigate(it.path)}>{it.label}</button>
      ))}
    </div>
  );
};

export default BottomNav;
