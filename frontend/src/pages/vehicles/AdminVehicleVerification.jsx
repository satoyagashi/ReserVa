import { useState, useEffect } from 'react';
import ParkwiseSidebar from './ParkwiseSidebar';
import { getVehicles, saveVehicles, vehicleIcon, formatDate } from './vehicleStore';
import './parkwise.css';

export default function AdminVehicleVerification() {
  const [vehicles, setVehicles] = useState(getVehicles);
  const [statusFilter, setStatusFilter] = useState('All');
  const [rejectModalVehicleId, setRejectModalVehicleId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const syncVehicles = () => {
    setVehicles(getVehicles());
  };

  useEffect(() => {
    window.addEventListener('storage', syncVehicles);
    return () => window.removeEventListener('storage', syncVehicles);
  }, []);

  const pendingCount = vehicles.filter((v) => v.status === 'Pending').length;
  const verifiedCount = vehicles.filter((v) => v.status === 'Verified').length;
  const rejectedCount = vehicles.filter((v) => v.status === 'Rejected').length;

  const filtered = vehicles.filter((v) =>
    statusFilter === 'All' ? true : v.status === statusFilter
  );

  const handleApprove = (id) => {
    const updated = vehicles.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          status: 'Verified',
          reason: '',
          reviewedAt: new Date().toISOString()
        };
      }
      return v;
    });
    setVehicles(updated);
    saveVehicles(updated);
  };

  const openRejectModal = (id) => {
    setRejectModalVehicleId(id);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectModalVehicleId(null);
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      alert('Please enter a rejection reason.');
      return;
    }
    const updated = vehicles.map((v) => {
      if (v.id === rejectModalVehicleId) {
        return {
          ...v,
          status: 'Rejected',
          reason: trimmed,
          reviewedAt: new Date().toISOString()
        };
      }
      return v;
    });
    setVehicles(updated);
    saveVehicles(updated);
    closeRejectModal();
  };

  return (
    <div className="parkwise-page">
      <ParkwiseSidebar role="admin" />

      <main className="main-content">
        <header className="top-heading">
          <div>
            <p className="eyebrow">ADMINISTRATION / REVIEW QUEUE</p>
            <h1>Vehicle Verification</h1>
            <p className="muted">Review vehicle submissions before parking reservations.</p>
          </div>
          <span className="online-badge"><span></span> ADMIN DEMO</span>
        </header>

        <section className="stats-row">
          <div className="stat-card">
            <span>Awaiting Review</span>
            <strong>{pendingCount}</strong>
          </div>
          <div className="stat-card">
            <span>Verified Vehicles</span>
            <strong>{verifiedCount}</strong>
          </div>
          <div className="stat-card">
            <span>Rejected Vehicles</span>
            <strong>{rejectedCount}</strong>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Submitted Vehicles</h2>
              <p className="muted small">Review the vehicle and registration information.</p>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="vehicle-list">
            {filtered.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-info">
                  <div className="vehicle-icon">
                    {vehicleIcon(vehicle.type)}
                  </div>

                  <div>
                    <div className="vehicle-name">
                      {vehicle.make} {vehicle.model}
                    </div>

                    <p>
                      <span className="plate">
                        {vehicle.plate}
                      </span>
                    </p>

                    <span className={`status ${vehicle.status.toLowerCase()}`}>
                      {vehicle.status}
                    </span>

                    <div className="vehicle-meta">
                      Type: {vehicle.type}<br />
                      Color: {vehicle.color}<br />
                      Registered owner: {vehicle.owner}<br />
                      Document reference: {vehicle.documentRef}<br />
                      Submitted: {formatDate(vehicle.createdAt)}
                      {vehicle.reason && (
                        <>
                          <br />Rejection reason: {vehicle.reason}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-buttons">
                  <button
                    type="button"
                    className="btn primary"
                    disabled={vehicle.status === 'Verified'}
                    onClick={() => handleApprove(vehicle.id)}
                  >
                    ✓ Verify
                  </button>

                  <button
                    type="button"
                    className="btn danger"
                    disabled={vehicle.status === 'Rejected'}
                    onClick={() => openRejectModal(vehicle.id)}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-symbol">✓</div>
              <h3>No submissions found</h3>
              <p className="muted">Try a different filter or submit a demo vehicle.</p>
            </div>
          )}
        </section>

        <div className="notice">
          <strong>Security notice:</strong> This page is not protected by real
          administrator authentication. Production permissions must be enforced
          by the backend and database.
        </div>
      </main>

      {rejectModalVehicleId && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRejectModal();
          }}
        >
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="rejectTitle">
            <p className="eyebrow">ADMIN REVIEW</p>
            <h2 id="rejectTitle">Reject Vehicle</h2>
            <p className="muted">Enter a clear reason for rejecting this submission.</p>

            <label htmlFor="rejectReason">Rejection Reason *</label>
            <textarea
              id="rejectReason"
              rows={4}
              maxLength={300}
              placeholder="Explain what needs to be corrected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />

            <div className="form-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={closeRejectModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={handleConfirmReject}
              >
                Confirm Rejection
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
