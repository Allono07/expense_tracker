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
    <div className="bottom-nav d-flex justify-content-around">
      {items.map(it => (
        <button key={it.path} className={`btn btn-sm ${location.pathname === it.path ? 'text-primary' : 'text-muted'}`} onClick={() => navigate(it.path)} style={{ minWidth: 100 }}>
          <div style={{ fontSize: 18 }}>{it.path === '/' ? '📋' : it.path === '/heatmap' ? '🗓️' : '📈'}</div>
          <div style={{ fontSize: 12 }}>{it.label}</div>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
