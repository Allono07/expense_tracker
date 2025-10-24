import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Dashboard from './components/Dashboard';
import WeeklyBreakdown from './components/WeeklyBreakdown';
import { Transaction } from './services/analytics';
import './App.css';

// Read Google OAuth client ID from environment. For Create React App, env vars must start with REACT_APP_
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const HARDCODED_SHEET_ID = '1xNI8jwWQq5MDhKtwSL4P1PjL5uwMrqCDh7kKxKKDu1s'; // hardcoded sheet ID

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'weekly'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const spreadsheetId = HARDCODED_SHEET_ID;

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('accessToken', tokenResponse.access_token);
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: SCOPES,
    flow: 'implicit', // use implicit flow for auto-redirect
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    } else {
      // auto-login if no token stored (first time or token cleared)
      // delay slightly to ensure GoogleOAuthProvider is ready
      setTimeout(() => {
        login();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    // It's good practice to also revoke the token if possible, 
    // but for this flow, just clearing it locally is the main step.
  };

  const handleTokenExpired = () => {
    // Token expired, clear it and prompt re-login
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    // Delay slightly to ensure state updates, then trigger login
    setTimeout(() => {
      login();
    }, 300);
  };

  return (
    <div>
      {accessToken && spreadsheetId ? (
        currentPage === 'dashboard' ? (
          <Dashboard 
            onSignOut={handleSignOut} 
            spreadsheetId={spreadsheetId} 
            accessToken={accessToken} 
            onTokenExpired={handleTokenExpired}
            onViewWeekly={(txs) => {
              setTransactions(txs);
              setCurrentPage('weekly');
            }}
          />
        ) : (
          <WeeklyBreakdown 
            transactions={transactions}
            onBack={() => setCurrentPage('dashboard')}
          />
        )
      ) : (
        <div style={{ padding: 20 }}>
          <p>Authenticating with Google...</p>
        </div>
      )}
    </div>
  );
}

const WrappedApp = () => {
  if (!CLIENT_ID) {
    // Render an explicit, user-friendly message when the env var is missing.
    return (
      <div style={{ padding: 20 }}>
        <h2>Missing Google OAuth Client ID</h2>
        <p>
          The environment variable <code>REACT_APP_GOOGLE_CLIENT_ID</code> is not set.
          Copy <code>.env.example</code> to <code>.env</code>, set the value, and restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  );
};

export default WrappedApp;