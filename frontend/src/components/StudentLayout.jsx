import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { mockCurrentUser } from '../mockData.js';
import '../pages/student.css';

export default function StudentLayout() {
  const navigate = useNavigate();

  return (
    <div className="student-layout">
      <header className="student-nav">
        <div className="nav-brand">
          <Link to="/find-parking">
            <span>🅿️</span>
            <span>ReserVa</span>
          </Link>
        </div>

        <nav className="nav-links">
          <NavLink to="/find-parking">Find Parking</NavLink>
          <NavLink to="/my-reservations">My Reservations</NavLink>
          <NavLink to="/my-vehicles">My Vehicles</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/admin" style={{ color: '#38bdf8' }}>
            🛡️ Admin Portal
          </NavLink>
        </nav>

        <div className="nav-user">
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <img
              src={mockCurrentUser.avatar_url}
              alt={mockCurrentUser.full_name}
              width={34}
              height={34}
              style={{ borderRadius: '50%', border: '2px solid #38bdf8' }}
            />
            <span style={{ fontWeight: 600 }}>{mockCurrentUser.full_name.split(' ')[0]}</span>
            <span className="user-badge">{mockCurrentUser.role}</span>
          </Link>

          <button
            type="button"
            className="logout-btn"
            onClick={() => navigate('/login')}
            title="Sign out and return to Login"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="student-content">
        <Outlet />
      </main>
    </div>
  );
}
