import { useState } from "react";
import { useParking } from "../components/ParkingContext";
import { Modal, StatusBadge, Empty } from "../components/ui";

const blankSlot = { code: "", zoneId: "" };

export default function Slots() {
  const { zones, slots, slotStatus, getZone, addSlot, updateSlot, deleteSlot } = useParking();

  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState(blankSlot); // the data inside the form (never null)
  const [isOpen, setIsOpen] = useState(false); // is the pop-up showing?
  const [error, setError] = useState("");

  const visible = slots.filter((s) => {
    const matchSearch = s.code.toLowerCase().includes(search.toLowerCase());
    const matchZone = zoneFilter === "all" || s.zoneId === Number(zoneFilter);
    const matchStatus = statusFilter === "all" || slotStatus(s.id) === statusFilter;
    return matchSearch && matchZone && matchStatus;
  });

  const openForm = (slot) => {
    setError("");
    setForm(slot ? { ...slot } : { code: "", zoneId: zones[0]?.id ?? "" });
    setIsOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const zoneId = Number(form.zoneId);
    const zone = getZone(zoneId);

    if (!code) return setError("Slot code is required.");
    if (!zone) return setError("Choose a zone. Create a zone first if none exist.");
    if (slots.some((s) => s.code === code && s.id !== form.id)) return setError(`Slot ${code} already exists.`);

    const inZone = slots.filter((s) => s.zoneId === zoneId && s.id !== form.id).length;
    if (inZone >= zone.capacity) return setError(`${zone.name} is full (capacity ${zone.capacity}).`);

    form.id ? updateSlot(form.id, { code, zoneId }) : addSlot({ code, zoneId });
    setIsOpen(false);
  };

  const remove = (s) => {
    if (window.confirm(`Delete slot ${s.code}? Its reservations will also be deleted.`)) deleteSlot(s.id);
  };

  return (
    <section>
      <div className="page-head">
        <h1>Slots</h1>
        <p>Create, edit and track individual parking slots.</p>
      </div>

      <div className="toolbar">
        <input placeholder="Search slot code" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
          <option value="all">All zones</option>
          {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="occupied">Occupied</option>
        </select>
        <button className="btn btn-primary push" onClick={() => openForm(null)}>Add slot</button>
      </div>

      <div className="card table-wrap">
        {visible.length === 0 ? (
          <Empty>No slots match your filters.</Empty>
        ) : (
          <table className="data">
            <thead>
              <tr><th>Slot</th><th>Zone</th><th>Vehicle type</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {visible.map((s) => {
                const z = getZone(s.zoneId);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.code}</strong></td>
                    <td>{z?.name}</td>
                    <td>{z?.vehicleType}</td>
                    <td><StatusBadge status={slotStatus(s.id)} /></td>
                    <td className="actions">
                      <button className="btn btn-sm" onClick={() => openForm(s)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(s)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isOpen && (
        <Modal title={form.id ? "Edit slot" : "Add slot"} onClose={() => setIsOpen(false)}>
          <form onSubmit={save}>
            <label className="field">Slot code
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="A-06" />
            </label>
            <label className="field">Zone
              <select value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })}>
                {zones.map((z) => <option key={z.id} value={z.id}>{z.name} ({z.vehicleType})</option>)}
              </select>
            </label>
            {error && <p className="error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save slot</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
