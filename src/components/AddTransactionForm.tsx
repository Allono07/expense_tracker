import React, { useState } from 'react';

interface AddTransactionFormProps {
  onClose: () => void;
  // Accept multiple transactions at once. All rows will use the same date.
  onAdd: (transactions: { item: string; cost: number; date: string }[]) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose, onAdd }) => {
  const [rows, setRows] = useState<{ item: string; cost: string }[]>([{ item: '', cost: '' }]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleChangeRow = (index: number, field: 'item' | 'cost', value: string) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const handleAddRow = () => setRows(prev => [...prev, { item: '', cost: '' }]);

  const handleRemoveRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactions = rows
      .map(r => ({ item: r.item.trim(), cost: parseFloat(r.cost), date }))
      .filter(r => r.item && !isNaN(r.cost));

    if (transactions.length > 0) {
      onAdd(transactions);
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
                <label htmlFor="date" className="form-label">Date (applies to all rows)</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {rows.map((r, idx) => (
                <div key={idx} className="mb-3 d-flex gap-2 align-items-start">
                  <div style={{ flex: 2 }}>
                    <label className="form-label">Item</label>
                    <input
                      type="text"
                      className="form-control"
                      value={r.item}
                      onChange={(e) => handleChangeRow(idx, 'item', e.target.value)}
                      placeholder="e.g., Groceries"
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Cost</label>
                    <input
                      type="number"
                      className="form-control"
                      value={r.cost}
                      onChange={(e) => handleChangeRow(idx, 'cost', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div style={{ width: 40, marginTop: 24 }}>
                    {rows.length > 1 && (
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveRow(idx)} aria-label="Remove row">−</button>
                    )}
                  </div>
                </div>
              ))}

              <div className="mb-3">
                <button type="button" className="btn btn-link" onClick={handleAddRow}>+ Add another item</button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                <button type="submit" className="btn btn-primary">Add all</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionForm;
