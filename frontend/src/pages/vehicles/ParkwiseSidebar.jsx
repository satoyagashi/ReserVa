import { NavLink, Link } from 'react-router-dom';

export default function ParkwiseSidebar({ role = 'student' }) {
  const isAdmin = role === 'admin';

  return (
    <aside className="sidebar">
      <Link to={isAdmin ? '/admin' : '/find-parking'} className="brand">
        <span className="brand-mark">P</span> PARKWISE
      </Link>
      <nav className="side-nav">
        <Link to={isAdmin ? '/admin' : '/find-parking'} className="nav-link">
          <span>⌂</span> {isAdmin ? 'Dashboard' : 'Find Parking'}
        </Link>
        <NavLink to="/vehicles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>♧</span> My Vehicles
        </NavLink>
        <NavLink to="/vehicles/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>▦</span> Add Vehicle
        </NavLink>
        <NavLink to="/admin/vehicles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span>✓</span> Vehicle Verification
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className={`user-avatar ${isAdmin ? 'admin-avatar' : ''}`}>
          {isAdmin ? 'A' : 'S'}
        </div>
        <div>
          <strong>{isAdmin ? 'Admin' : 'Student'}</strong>
          <small>{isAdmin ? 'Administrator · Demo' : 'Campus User'}</small>
        </div>
      </div>
    </aside>
  );
}
