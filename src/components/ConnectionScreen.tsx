import React, { useState } from 'react';

interface ConnectionScreenProps {
  onConnect: (spreadsheetId: string) => void;
}

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onConnect }) => {
  const [spreadsheetId, setSpreadsheetId] = useState('');

  const handleConnect = () => {
    if (spreadsheetId) {
      onConnect(spreadsheetId);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6 text-center">
          <h1 className="mb-4">Expense Tracker</h1>
          <p className="mb-4">Connect your Google Sheet to start tracking your expenses.</p>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Google Sheet ID"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleConnect} disabled={!spreadsheetId}>
            Connect to Google Sheets
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionScreen;