import { useState } from "react";
import { useParking } from "../components/ParkingContext";
import { Modal, Empty } from "../components/ui";

const VEHICLE_TYPES = ["Car", "Motorcycle", "Bicycle"];
const blank = { name: "", location: "", vehicleType: "Car", capacity: 1 };

export default function Zones() {
  const { zones, slots, slotStatus, addZone, updateZone, deleteZone } = useParking();
  const [form, setForm] = useState(blank); // the data inside the form (never null)
  const [isOpen, setIsOpen] = useState(false); // is the pop-up showing?
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openForm = (zone) => {
    setError("");
    setForm(zone ? { ...zone } : { ...blank });
    setIsOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    const capacity = Number(form.capacity);
    const slotCount = slots.filter((s) => s.zoneId === form.id).length;

    if (!form.name.trim() || !form.location.trim()) return setError("Name and location are required.");
    if (!Number.isInteger(capacity) || capacity < 1) return setError("Capacity must be 1 or more.");
    if (form.id && capacity < slotCount)
      return setError(`This zone already has ${slotCount} slots. Delete slots first or use a higher capacity.`);

    const data = { name: form.name.trim(), location: form.location.trim(), vehicleType: form.vehicleType, capacity };
    form.id ? updateZone(form.id, data) : addZone(data);
    setIsOpen(false);
  };

  const remove = (z) => {
    if (window.confirm(`Delete ${z.name}? Its slots and their reservations will also be deleted.`)) deleteZone(z.id);
  };

  return (
    <section>
      <div className="page-head">
        <h1>Zones</h1>
        <p>Parking areas with location, capacity and vehicle type.</p>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => openForm(null)}>Add zone</button>
      </div>

      <div className="card table-wrap">
        {zones.length === 0 ? (
          <Empty>No zones yet. Add your first zone.</Empty>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Zone</th><th>Location</th><th>Vehicle type</th>
                <th>Slots / capacity</th><th>Available now</th><th />
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => {
                const zs = slots.filter((s) => s.zoneId === z.id);
                const free = zs.filter((s) => slotStatus(s.id) === "available").length;
                return (
                  <tr key={z.id}>
                    <td><strong>{z.name}</strong></td>
                    <td>{z.location}</td>
                    <td>{z.vehicleType}</td>
                    <td>{zs.length} / {z.capacity}</td>
                    <td>{free}</td>
                    <td className="actions">
                      <button className="btn btn-sm" onClick={() => openForm(z)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(z)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isOpen && (
        <Modal title={form.id ? "Edit zone" : "Add zone"} onClose={() => setIsOpen(false)}>
          <form onSubmit={save}>
            <label className="field">Zone name
              <input name="name" value={form.name} onChange={change} placeholder="Zone D" />
            </label>
            <label className="field">Location
              <input name="location" value={form.location} onChange={change} placeholder="Near the cafeteria" />
            </label>
            <label className="field">Vehicle type
              <select name="vehicleType" value={form.vehicleType} onChange={change}>
                {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="field">Capacity (number of slots)
              <input type="number" min="1" name="capacity" value={form.capacity} onChange={change} />
            </label>
            {error && <p className="error">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setIsOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save zone</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
