import { useState } from 'react';
import { mockVehicles, mockCurrentUser, STATUS_COLORS, VEHICLE_TYPES } from '../mockData.js';
import './student.css';

const TYPE_ICONS = {
  car: '🚗',
  motorcycle: '🏍️',
  bicycle: '🚲',
  pwd: '♿'
};

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState(() =>
    mockVehicles.filter((v) => v.owner_id === mockCurrentUser.id)
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    plate_number: '',
    type: 'car',
    make: '',
    model: '',
    color: ''
  });
  const [toast, setToast] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newVehicle = {
      id: `veh_${Date.now()}`,
      owner_id: mockCurrentUser.id,
      plate_number: form.plate_number.toUpperCase(),
      type: form.type,
      make: form.make,
      model: form.model,
      color: form.color,
      verification: 'pending',
      rejection_reason: null,
      created_at: new Date().toISOString()
    };

    setVehicles([newVehicle, ...vehicles]);
    setShowAddModal(false);
    setForm({ plate_number: '', type: 'car', make: '', model: '', color: '' });
    setToast(`Vehicle ${newVehicle.plate_number} submitted! Pending Admin verification.`);
    setTimeout(() => setToast(''), 6000);
  };

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>My Registered Vehicles</h1>
          <p>Manage your campus parking permits and register additional vehicles.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Register New Vehicle
        </button>
      </div>

      {toast && (
        <div className="alert-success">
          <span>✅ {toast}</span>
          <button type="button" className="btn btn-sm" onClick={() => setToast('')}>Dismiss</button>
        </div>
      )}

      {/* Vehicle Grid */}
      <div className="vehicle-grid">
        {vehicles.map((v) => {
          const badgeStyle = STATUS_COLORS[v.verification] || STATUS_COLORS.pending;
          return (
            <div key={v.id} className="card vehicle-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '2rem' }}>{TYPE_ICONS[v.type] || '🚗'}</span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: badgeStyle.bg,
                    color: badgeStyle.text,
                    border: `1px solid ${badgeStyle.border}`
                  }}
                >
                  {badgeStyle.label}
                </span>
              </div>

              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', letterSpacing: '0.04em', textAlign: 'left' }}>
                {v.plate_number}
              </h2>
              <div style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '12px' }}>
                {v.make} {v.model} • <span style={{ textTransform: 'capitalize' }}>{v.color}</span>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '0.82rem', color: '#64748b' }}>
                Vehicle Type: <strong style={{ textTransform: 'capitalize', color: '#334155' }}>{v.type}</strong>
              </div>

              {v.verification === 'rejected' && v.rejection_reason && (
                <div className="rejection-notice">
                  <strong>Verification Rejected:</strong>
                  <div style={{ marginTop: '4px' }}>{v.rejection_reason}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="reserve-modal" onClick={() => setShowAddModal(false)}>
          <div className="reserve-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', textAlign: 'left' }}>
                Register Campus Vehicle
              </h2>
              <button type="button" className="btn btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="field">
                <label>Plate Number / Conduction Sticker</label>
                <input
                  type="text"
                  placeholder="e.g. ABC-1234 or MV-8899"
                  required
                  value={form.plate_number}
                  onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Vehicle Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {TYPE_ICONS[t.value]} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="field">
                  <label>Make / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota, Yamaha"
                    required
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Vios, NMAX"
                    required
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Color</label>
                <input
                  type="text"
                  placeholder="e.g. Pearl White, Silver"
                  required
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit For Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
