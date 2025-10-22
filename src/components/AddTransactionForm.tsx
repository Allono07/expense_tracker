import React, { useState } from 'react';

interface AddTransactionFormProps {
  onClose: () => void;
  onAdd: (transaction: { item: string; cost: number; date: string }) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose, onAdd }) => {
  const [item, setItem] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const costValue = parseFloat(cost);
    if (item && !isNaN(costValue) && date) {
      onAdd({ item, cost: costValue, date });
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Transaction</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="item" className="form-label">Item</label>
                <input
                  type="text"
                  className="form-control"
                  id="item"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="cost" className="form-label">Cost</label>
                <input
                  type="number"
                  className="form-control"
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionForm;
