import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParkwiseSidebar from './ParkwiseSidebar';
import { getVehicles, saveVehicles, createId } from './vehicleStore';
import './parkwise.css';

export default function AddVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    make: '',
    model: '',
    color: '',
    plate: '',
    owner: '',
    documentRef: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const vehicle = {
      type: formData.type.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      color: formData.color.trim(),
      plate: formData.plate.trim().toUpperCase().replace(/\s+/g, ' '),
      owner: formData.owner.trim(),
      documentRef: formData.documentRef.trim()
    };

    if (Object.values(vehicle).some((v) => !v)) {
      setMessage({
        text: 'Please complete all required fields.',
        type: 'error'
      });
      return;
    }

    if (
      vehicle.plate.length < 3 ||
      vehicle.plate.length > 15 ||
      !/^[A-Z0-9 -]+$/.test(vehicle.plate)
    ) {
      setMessage({
        text: 'Enter a valid plate number using 3–15 letters, numbers, spaces, or hyphens.',
        type: 'error'
      });
      return;
    }

    const currentVehicles = getVehicles();
    const duplicate = currentVehicles.some(
      (item) => item.plate.toUpperCase() === vehicle.plate
    );

    if (duplicate) {
      setMessage({
        text: 'This plate number is already registered in the demo.',
        type: 'error'
      });
      return;
    }

    const updated = [
      {
        ...vehicle,
        id: createId(),
        status: 'Pending',
        reason: '',
        createdAt: new Date().toISOString()
      },
      ...currentVehicles
    ];

    saveVehicles(updated);

    setMessage({
      text: 'Vehicle submitted successfully! Status: Pending verification.',
      type: 'success'
    });

    setTimeout(() => {
      navigate('/vehicles');
    }, 900);
  };

  return (
    <div className="parkwise-page">
      <ParkwiseSidebar role="student" />

      <main className="main-content">
        <Link to="/vehicles" className="back-link">← Back to My Vehicles</Link>

        <header className="top-heading">
          <div>
            <p className="eyebrow">VEHICLE REGISTRATION</p>
            <h1>Add a Vehicle</h1>
            <p className="muted">Submit your vehicle details for administrator verification.</p>
          </div>
        </header>

        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>Vehicle Information</h2>
              <p className="muted small">Fields marked * are required.</p>
            </div>
            <span className="feature-icon">＋</span>
          </div>

          {message.text && (
            <div className={`message ${message.type}`} role="status">
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <label>
                Vehicle Type *
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Make / Brand *
                <input
                  name="make"
                  maxLength={50}
                  placeholder="e.g. Toyota"
                  required
                  value={formData.make}
                  onChange={handleChange}
                />
              </label>

              <label>
                Model *
                <input
                  name="model"
                  maxLength={50}
                  placeholder="e.g. Vios"
                  required
                  value={formData.model}
                  onChange={handleChange}
                />
              </label>

              <label>
                Color *
                <input
                  name="color"
                  maxLength={30}
                  placeholder="e.g. White"
                  required
                  value={formData.color}
                  onChange={handleChange}
                />
              </label>

              <label>
                Plate Number *
                <input
                  name="plate"
                  maxLength={15}
                  placeholder="e.g. ABC 1234"
                  required
                  value={formData.plate}
                  onChange={handleChange}
                />
                <small>Letters will be converted to uppercase.</small>
              </label>

              <label>
                Registered Owner Name *
                <input
                  name="owner"
                  maxLength={100}
                  placeholder="Name on vehicle documents"
                  required
                  value={formData.owner}
                  onChange={handleChange}
                />
              </label>

              <label className="full-width">
                Registration / OR-CR Reference *
                <input
                  name="documentRef"
                  maxLength={80}
                  placeholder="Enter a demo reference"
                  required
                  value={formData.documentRef}
                  onChange={handleChange}
                />
                <small>Use sample data only. Do not enter real sensitive document information.</small>
              </label>
            </div>

            <div className="form-actions">
              <Link to="/vehicles" className="btn secondary">Cancel</Link>
              <button type="submit" className="btn primary">
                Submit for Verification →
              </button>
            </div>
          </form>
        </section>

        <section className="info-box">
          <h3>What happens next?</h3>
          <p>
            Your vehicle will be marked Pending. An administrator reviews
            the submitted details and either verifies the vehicle or rejects
            it with a reason.
          </p>
        </section>
      </main>
    </div>
  );
}
