import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockReservations, mockCurrentUser, mockSlots, mockVehicles, STATUS_COLORS } from '../mockData.js';
import './student.css';

export default function MyReservations() {
  const [reservations, setReservations] = useState(() =>
    mockReservations.filter((r) => r.user_id === mockCurrentUser.id)
  );
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');

  const getSlot = (id) => mockSlots.find((s) => s.id === id);
  const getVehicle = (id) => mockVehicles.find((v) => v.id === id);

  const handleCancel = (resId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setReservations(reservations.map((r) => r.id === resId ? { ...r, status: 'cancelled' } : r));
      setToast('Reservation successfully cancelled.');
      setTimeout(() => setToast(''), 4000);
    }
  };

  const filtered = reservations.filter((r) => {
    if (filter === 'active') return r.status === 'reserved' || r.status === 'occupied';
    if (filter === 'past') return r.status === 'completed' || r.status === 'expired' || r.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>My Reservations</h1>
          <p>Review current and past campus parking slot reservations.</p>
        </div>

        <Link to="/find-parking" className="btn btn-primary">
          ➕ Book New Slot
        </Link>
      </div>

      {toast && (
        <div className="alert-success">
          <span>✅ {toast}</span>
          <button type="button" className="btn btn-sm" onClick={() => setToast('')}>Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="toolbar">
        <button
          type="button"
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({reservations.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active / Upcoming
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === 'past' ? 'btn-primary' : ''}`}
          onClick={() => setFilter('past')}
        >
          Past / Cancelled
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty">
          <p>No reservations found for this filter.</p>
          <Link to="/find-parking" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
            Browse Available Slots
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((res) => {
            const slot = getSlot(res.slot_id);
            const vehicle = getVehicle(res.vehicle_id);
            const badgeStyle = STATUS_COLORS[res.status] || STATUS_COLORS.reserved;
            const canCancel = res.status === 'reserved';

            return (
              <div key={res.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}>
                    <span>🅿️</span>
                    <span style={{ fontSize: '0.85rem' }}>{slot?.slot_code || 'SLOT'}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Slot {slot?.slot_code || res.slot_id}</h3>
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

                    <div style={{ color: '#64748b', fontSize: '0.88rem' }}>
                      📅 <strong>{new Date(res.start_time).toLocaleDateString()}</strong> • {new Date(res.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(res.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div style={{ color: '#475569', fontSize: '0.84rem', marginTop: '2px' }}>
                      Vehicle: <strong>{vehicle ? `${vehicle.plate_number} (${vehicle.make} ${vehicle.model})` : 'Registered Vehicle'}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  {canCancel && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(res.id)}
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
