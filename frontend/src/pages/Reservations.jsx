import { useState } from "react";
import { useParking } from "../components/ParkingContext";
import { StatusBadge, Empty } from "../components/ui";

const STATUSES = ["reserved", "occupied", "expired", "cancelled"];

export default function Reservations() {
  const { reservations, getSlot, getZone, setReservationStatus, deleteReservation } = useParking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const visible = reservations.filter((r) => {
    const q = search.toLowerCase();
    const slotCode = getSlot(r.slotId)?.code.toLowerCase() ?? "";
    const matchSearch = r.user.toLowerCase().includes(q) || r.plate.toLowerCase().includes(q) || slotCode.includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const remove = (r) => {
    if (window.confirm(`Delete the reservation of ${r.user}?`)) deleteReservation(r.id);
  };

  return (
    <section>
      <div className="page-head">
        <h1>Reservations</h1>
        <p>Review bookings and update their status.</p>
      </div>

      <div className="toolbar">
        <input placeholder="Search name, plate or slot" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card table-wrap">
        {visible.length === 0 ? (
          <Empty>No reservations found.</Empty>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>User</th><th>Plate</th><th>Slot</th><th>Zone</th>
                <th>Date</th><th>Time</th><th>Status</th><th>Change status</th><th />
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const slot = getSlot(r.slotId);
                return (
                  <tr key={r.id}>
                    <td>{r.user}</td>
                    <td>{r.plate}</td>
                    <td>{slot?.code}</td>
                    <td>{getZone(slot?.zoneId)?.name}</td>
                    <td>{r.date}</td>
                    <td>{r.start} - {r.end}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <select value={r.status} onChange={(e) => setReservationStatus(r.id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="actions">
                      <button className="btn btn-sm btn-danger" onClick={() => remove(r)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
