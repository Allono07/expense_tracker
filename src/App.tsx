import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import ConnectionScreen from './components/ConnectionScreen';
import MainApp from './MainApp';
import './App.css';

// Read Google OAuth client ID from environment. For Create React App, env vars must start with REACT_APP_
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    const storedSheetId = localStorage.getItem('spreadsheetId');
    const storedToken = localStorage.getItem('accessToken');
    if (storedSheetId && storedToken) {
      setSpreadsheetId(storedSheetId);
      setAccessToken(storedToken);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('accessToken', tokenResponse.access_token);
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: SCOPES,
  });

  const handleConnect = (id: string) => {
    setSpreadsheetId(id);
    localStorage.setItem('spreadsheetId', id);
    login();
  };

  const handleSignOut = () => {
    localStorage.removeItem('spreadsheetId');
    localStorage.removeItem('accessToken');
    setSpreadsheetId(null);
    setAccessToken(null);
    // It's good practice to also revoke the token if possible, 
    // but for this flow, just clearing it locally is the main step.
  };

  return (
    <div>
      {accessToken && spreadsheetId ? (
        <MainApp onSignOut={handleSignOut} spreadsheetId={spreadsheetId} accessToken={accessToken} />
      ) : (
        <ConnectionScreen onConnect={handleConnect} />
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