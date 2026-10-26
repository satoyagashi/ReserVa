import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field, { LockIcon } from './Field';
import { validateLogin } from './validation';
import './auth.css';

export default function Login({ onSwitch }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: 'juan.saavedra@campus.edu.ph', password: 'password123' });
  const [errors, setErrors] = useState({ messages: [], invalid: {} });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors.invalid[name]) {
      setErrors({ messages: [], invalid: { ...errors.invalid, [name]: false } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateLogin(values);
    setErrors(result);
    if (result.messages.length === 0) {
      // For demo, if admin email or password contains admin, route to admin
      if (values.email.includes('admin') || values.email.includes('espiritu') || values.email.includes('tarro')) {
        navigate('/admin');
      } else {
        navigate('/find-parking');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <h1>ReserVa</h1>
        <p className="auth-subtitle">Campus Parking Slot Reservation</p>
        <p id="error-message">{errors.messages.join('. ')}</p>

        <form id="form" onSubmit={handleSubmit} noValidate>
          <Field
            id="email-input"
            name="email"
            type="email"
            placeholder="Campus Email"
            icon={<span>@</span>}
            value={values.email}
            onChange={handleChange}
            invalid={errors.invalid.email}
          />
          <Field
            id="password-input"
            name="password"
            type="password"
            placeholder="Password"
            icon={<LockIcon />}
            value={values.password}
            onChange={handleChange}
            invalid={errors.invalid.password}
          />
          <button type="submit">Sign In</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
          <p>
            Don't have an account?{' '}
            {onSwitch ? (
              <a href="#signup" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
                Create an Account
              </a>
            ) : (
              <Link to="/register">Create an Account</Link>
            )}
          </p>
          <p>
            <Link to="/forgot-password" style={{ color: 'var(--muted-color)', fontSize: '0.85rem' }}>
              Forgot password?
            </Link>
          </p>
        </div>

        <div className="auth-demo-links">
          <span>Quick Demo Access:</span>
          <div className="demo-btn-group">
            <button
              type="button"
              className="demo-btn"
              onClick={() => navigate('/find-parking')}
            >
              🚗 Student Portal
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => navigate('/admin')}
            >
              🛡️ Admin Backoffice
            </button>
          </div>
          <p style={{ marginTop: '4px' }}>
            <Link to="/landing" style={{ fontSize: '0.8rem', color: 'var(--muted-color)' }}>
              View Public Landing Page →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
