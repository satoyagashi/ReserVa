import {NavLink} from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>ReserVa</h2>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/zones">Zones</NavLink>
        <NavLink to="/slots">Slots</NavLink>
        <NavLink to="/reservations">Reservations</NavLink>
      </nav>
    </aside>
  );
}