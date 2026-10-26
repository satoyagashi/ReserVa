import { useState } from 'react';
import { mockCurrentUser, mockVehicles, mockReservations } from '../mockData.js';
import './student.css';

export default function Profile() {
  const [profile, setProfile] = useState(mockCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: mockCurrentUser.full_name,
    phone: mockCurrentUser.phone,
    email: mockCurrentUser.email
  });
  const [toast, setToast] = useState('');

  const userVehicles = mockVehicles.filter((v) => v.owner_id === profile.id);
  const userReservations = mockReservations.filter((r) => r.user_id === profile.id);

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...profile, ...formData });
    setIsEditing(false);
    setToast('Profile updated successfully!');
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div>
      <div className="page-head">
        <h1>User Profile</h1>
        <p>Manage your account credentials, contact information, and campus role.</p>
      </div>

      {toast && (
        <div className="alert-success">
          <span>✅ {toast}</span>
          <button type="button" className="btn btn-sm" onClick={() => setToast('')}>Dismiss</button>
        </div>
      )}

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="avatar"
            style={{ width: 100, height: 100, margin: '0 auto 12px' }}
          />

          <h2 style={{ margin: '0 0 6px 0', fontSize: '1.3rem' }}>{profile.full_name}</h2>
          <span className={`role-badge badge-${profile.role}`}>
            {profile.role.toUpperCase()}
          </span>

          <div style={{ marginTop: '20px', textAlign: 'left', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ marginBottom: '10px' }}>
              <small style={{ color: '#64748b', display: 'block' }}>Campus ID</small>
              <strong style={{ color: '#1e293b' }}>{profile.campus_id}</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <small style={{ color: '#64748b', display: 'block' }}>Email Address</small>
              <strong style={{ color: '#1e293b' }}>{profile.email}</strong>
            </div>
            <div>
              <small style={{ color: '#64748b', display: 'block' }}>Contact Phone</small>
              <strong style={{ color: '#1e293b' }}>{profile.phone}</strong>
            </div>
          </div>
        </div>

        {/* Right Details / Edit Section */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Account Information</h3>
              <button
                type="button"
                className={`btn btn-sm ${isEditing ? '' : 'btn-primary'}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave}>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button type="button" className="btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Registered Name</small>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.full_name}</span>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Verified Email</small>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.email}</span>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Phone Number</small>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.phone}</span>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Account Status</small>
                  <span className="badge badge-admin">Active / Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Summary Stats */}
          <div className="grid-2">
            <div className="card">
              <h3 style={{ margin: '0 0 10px 0' }}>Vehicles Registered</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0284c7' }}>
                {userVehicles.length}
              </div>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Vehicles associated with your student ID.
              </p>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 10px 0' }}>Total Reservations</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0284c7' }}>
                {userReservations.length}
              </div>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                Parking bookings made this academic term.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
