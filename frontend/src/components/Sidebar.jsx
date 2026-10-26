import { NavLink, Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', color: '#3df59a' }}>ReserVa</h2>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Admin Backoffice
        </div>
      </div>

      <nav>
        <NavLink to="/admin" end>📊 Dashboard</NavLink>
        <NavLink to="/admin/zones">📍 Zones</NavLink>
        <NavLink to="/admin/slots">🅿️ Slots</NavLink>
        <NavLink to="/admin/reservations">📋 Reservations</NavLink>
        <NavLink to="/admin/vehicles">🚘 Vehicle Verification</NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          to="/find-parking"
          style={{
            fontSize: '0.85rem',
            color: '#38bdf8',
            textDecoration: 'none',
            padding: '8px 10px',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.1)'
          }}
        >
          🚗 Switch to Student View
        </Link>
        <Link
          to="/login"
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            textDecoration: 'none',
            padding: '8px 10px'
          }}
        >
          🚪 Sign Out
        </Link>
      </div>
    </aside>
  );
}
