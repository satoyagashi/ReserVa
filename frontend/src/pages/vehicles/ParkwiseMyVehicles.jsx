import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParkwiseSidebar from './ParkwiseSidebar';
import { getVehicles, saveVehicles, vehicleIcon, formatDate } from './vehicleStore';
import './parkwise.css';

export default function ParkwiseMyVehicles() {
  const [vehicles, setVehicles] = useState(getVehicles);
  const [keyword, setKeyword] = useState('');

  const syncVehicles = () => {
    setVehicles(getVehicles());
  };

  useEffect(() => {
    window.addEventListener('storage', syncVehicles);
    return () => window.removeEventListener('storage', syncVehicles);
  }, []);

  const totalCount = vehicles.length;
  const verifiedCount = vehicles.filter((v) => v.status === 'Verified').length;
  const pendingCount = vehicles.filter((v) => v.status === 'Pending').length;

  const filtered = vehicles.filter((v) => {
    const term = keyword.trim().toLowerCase();
    if (!term) return true;
    return [v.plate, v.make, v.model, v.type].some((val) =>
      String(val || '').toLowerCase().includes(term)
    );
  });

  const handleDelete = (vehicle) => {
    if (!window.confirm(`Remove ${vehicle.plate} from this demo?`)) {
      return;
    }
    const updated = vehicles.filter((v) => v.id !== vehicle.id);
    setVehicles(updated);
    saveVehicles(updated);
  };

  return (
    <div className="parkwise-page">
      <ParkwiseSidebar role="student" />

      <main className="main-content">
        <header className="top-heading">
          <div>
            <p className="eyebrow">STUDENT PORTAL / VEHICLES</p>
            <h1>My Vehicles</h1>
            <p className="muted">Manage vehicles registered to your campus account.</p>
          </div>
          <Link to="/vehicles/add" className="btn primary">＋ Add Vehicle</Link>
        </header>

        <section className="stats-row">
          <div className="stat-card">
            <span>Total Vehicles</span>
            <strong>{totalCount}</strong>
          </div>
          <div className="stat-card">
            <span>Verified</span>
            <strong>{verifiedCount}</strong>
          </div>
          <div className="stat-card">
            <span>Pending Review</span>
            <strong>{pendingCount}</strong>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Registered Vehicles</h2>
              <p className="muted small">Only verified vehicles should be used for reservations.</p>
            </div>
            <input
              type="search"
              placeholder="Search plate or make..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
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

                    <div className="vehicle-meta">
                      {vehicle.type} · {vehicle.color}<br />
                      Registered: {formatDate(vehicle.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="vehicle-actions">
                  <span className="plate">
                    {vehicle.plate}
                  </span>

                  <span className={`status ${vehicle.status.toLowerCase()}`}>
                    {vehicle.status}
                  </span>

                  <button
                    className="text-button"
                    type="button"
                    onClick={() => handleDelete(vehicle)}
                  >
                    Remove
                  </button>
                </div>

                {vehicle.reason && (
                  <div className="vehicle-meta">
                    Admin note: {vehicle.reason}
                  </div>
                )}
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-symbol">▱</div>
              <h3>No vehicles found</h3>
              <p className="muted">Add a vehicle to get started.</p>
              <Link to="/vehicles/add" className="btn primary">Add Vehicle</Link>
            </div>
          )}
        </section>

        <div className="notice">
          Vehicle data is stored in this browser for demonstration purposes.
        </div>
      </main>
    </div>
  );
}
