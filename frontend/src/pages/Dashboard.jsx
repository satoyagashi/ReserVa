import { useParking } from "../components/ParkingContext";
import { StatusBadge } from "../components/ui";

export default function Dashboard() {
  const { zones, slots, reservations, slotStatus, getSlot } = useParking();

  const count = (s) => slots.filter((x) => slotStatus(x.id) === s).length;
  const expired = reservations.filter((r) => r.status === "expired").length;

  const stats = [
    { label: "Total slots", value: slots.length },
    { label: "Available", value: count("available") },
    { label: "Reserved", value: count("reserved") },
    { label: "Occupied", value: count("occupied") },
    { label: "Expired reservations", value: expired },
  ];

  const recent = [...reservations].slice(-5).reverse();

  return (
    <section>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>Live overview of parking availability.</p>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <div className="card stat" key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Zone usage</h3>
          {zones.length === 0 && <p className="empty">No zones yet.</p>}
          {zones.map((z) => {
            const zs = slots.filter((s) => s.zoneId === z.id);
            const used = zs.filter((s) => slotStatus(s.id) !== "available").length;
            const pct = zs.length ? Math.round((used / zs.length) * 100) : 0;
            return (
              <div className="usage" key={z.id}>
                <div className="usage-row">
                  <span>{z.name} <small>({z.vehicleType})</small></span>
                  <span>{used}/{zs.length} in use</span>
                </div>
                <div className="bar"><div style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h3>Recent reservations</h3>
          <table className="data">
            <thead>
              <tr><th>User</th><th>Slot</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id}>
                  <td>{r.user}</td>
                  <td>{getSlot(r.slotId)?.code ?? "-"}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
