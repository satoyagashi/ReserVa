import { useState } from 'react';
import { mockZones, mockSlots, mockVehicles, mockCurrentUser, VEHICLE_TYPES } from '../mockData.js';
import './student.css';

const VEHICLE_ICONS = {
  car: '🚗',
  motorcycle: '🏍️',
  bicycle: '🚲',
  pwd: '♿'
};

export default function FindParking() {
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState(mockZones[0]?.id || null);
  const [reservingSlot, setReservingSlot] = useState(null);
  const [userVehicles, setUserVehicles] = useState(() =>
    mockVehicles.filter((v) => v.owner_id === mockCurrentUser.id)
  );
  const [reservationForm, setReservationForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    startTime: '08:00',
    endTime: '12:00',
    vehicleId: userVehicles[0]?.id || ''
  });
  const [successToast, setSuccessToast] = useState('');

  // Filtered zones
  const filteredZones = mockZones.filter((z) => {
    const matchSearch = z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.location.toLowerCase().includes(search.toLowerCase());
    const matchType = vehicleFilter === 'all' || z.allowed_vehicle === vehicleFilter;
    return matchSearch && matchType;
  });

  // Calculate zone stats
  const getZoneSlots = (zoneId) => mockSlots.filter((s) => s.zone_id === zoneId);

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    setSuccessToast(`Slot ${reservingSlot.slot_code} successfully reserved for ${reservationForm.date} (${reservationForm.startTime} - ${reservationForm.endTime})!`);
    setReservingSlot(null);
    setTimeout(() => setSuccessToast(''), 6000);
  };

  return (
    <div>
      <div className="page-head">
        <h1>Find Campus Parking</h1>
        <p>Explore designated parking zones, inspect live slot availability, and book your spot.</p>
      </div>

      {successToast && (
        <div className="alert-success">
          <span>✅ {successToast}</span>
          <button type="button" className="btn btn-sm" onClick={() => setSuccessToast('')}>Dismiss</button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by zone name or building..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '280px' }}
        />

        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
          <option value="all">All Vehicle Types</option>
          {VEHICLE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {VEHICLE_ICONS[t.value]} {t.label}
            </option>
          ))}
        </select>

        <span className="push" style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Showing <strong>{filteredZones.length}</strong> zone{filteredZones.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Zones Grid */}
      <div className="zone-grid">
        {filteredZones.map((zone) => {
          const zoneSlots = getZoneSlots(zone.id);
          const activeSlots = zoneSlots.filter((s) => s.status === 'active');
          const isSelected = selectedZone === zone.id;
          const pctAvailable = zoneSlots.length ? Math.round((activeSlots.length / zoneSlots.length) * 100) : 0;

          return (
            <div
              key={zone.id}
              className="card"
              style={{
                borderColor: isSelected ? '#0284c7' : '#e2e8f0',
                borderWidth: isSelected ? '2px' : '1px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{VEHICLE_ICONS[zone.allowed_vehicle] || '🅿️'}</span>
                  <span className={`badge ${zone.is_active ? 'badge-admin' : 'badge-student'}`}>
                    {zone.is_active ? 'Open' : 'Closed'}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>{zone.name}</h3>
                <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.88rem' }}>
                  📍 {zone.location}
                </p>

                <div style={{ margin: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                    <span style={{ color: '#166534' }}>{activeSlots.length} available</span>
                    <span style={{ color: '#64748b' }}>{zoneSlots.length} total slots</span>
                  </div>
                  <div className="bar">
                    <div style={{ width: `${pctAvailable}%`, backgroundColor: '#16a34a' }} />
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '8px 0 16px' }}>
                  {zone.description}
                </p>
              </div>

              <button
                type="button"
                className={`btn ${isSelected ? 'btn-primary' : ''}`}
                style={{ width: '100%' }}
                onClick={() => setSelectedZone(isSelected ? null : zone.id)}
              >
                {isSelected ? 'Hide Slots' : `View Slots (${activeSlots.length} Available)`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Expanded Slot Selection Area */}
      {selectedZone && (
        <div className="card" style={{ marginTop: '24px', borderColor: '#0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', textAlign: 'left' }}>
                Slots in {mockZones.find((z) => z.id === selectedZone)?.name}
              </h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                Select an active green slot to book a reservation.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#86efac' }} /> Active / Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fde047' }} /> Maintenance
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#cbd5e1' }} /> Disabled
              </span>
            </div>
          </div>

          <div className="slot-grid">
            {getZoneSlots(selectedZone).map((slot) => {
              const isSlotActive = slot.status === 'active';
              return (
                <button
                  key={slot.id}
                  type="button"
                  className={`slot-pill ${slot.status}`}
                  disabled={!isSlotActive}
                  onClick={() => setReservingSlot(slot)}
                  title={isSlotActive ? `Click to reserve ${slot.slot_code}` : `Slot ${slot.status}`}
                >
                  <div>{slot.slot_code}</div>
                  <small style={{ fontSize: '0.7rem', fontWeight: 500 }}>{slot.status}</small>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reservation Popup Modal */}
      {reservingSlot && (
        <div className="reserve-modal" onClick={() => setReservingSlot(null)}>
          <div className="reserve-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', textAlign: 'left' }}>
                Reserve Slot {reservingSlot.slot_code}
              </h2>
              <button type="button" className="btn btn-sm" onClick={() => setReservingSlot(null)}>✕</button>
            </div>

            <form onSubmit={handleConfirmReservation}>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={reservationForm.date}
                  onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="field">
                  <label>Start Time</label>
                  <input
                    type="time"
                    required
                    value={reservationForm.startTime}
                    onChange={(e) => setReservationForm({ ...reservationForm, startTime: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>End Time</label>
                  <input
                    type="time"
                    required
                    value={reservationForm.endTime}
                    onChange={(e) => setReservationForm({ ...reservationForm, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Vehicle to Park</label>
                <select
                  required
                  value={reservationForm.vehicleId}
                  onChange={(e) => setReservationForm({ ...reservationForm, vehicleId: e.target.value })}
                >
                  {userVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate_number} - {v.make} {v.model} ({v.type})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => setReservingSlot(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
