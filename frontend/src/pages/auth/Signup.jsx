import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field, { PersonIcon, LockIcon } from './Field';
import { validateSignup } from './validation';
import './auth.css';

export default function Signup({ onSwitch }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: '',
    campusId: '',
    email: '',
    password: '',
    repeatPassword: '',
    role: 'student'
  });
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
    const result = validateSignup(values);
    setErrors(result);
    if (result.messages.length === 0) {
      alert(`Registration simulated for ${values.firstname}! Directing to Student Portal.`);
      navigate('/find-parking');
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <h1>ReserVa</h1>
        <p className="auth-subtitle">Create Your Campus Account</p>
        <p id="error-message">{errors.messages.join('. ')}</p>

        <form id="form" onSubmit={handleSubmit} noValidate>
          <Field
            id="firstname-input"
            name="firstname"
            placeholder="Full Name"
            icon={<PersonIcon />}
            value={values.firstname}
            onChange={handleChange}
            invalid={errors.invalid.firstname}
          />

          <Field
            id="campusid-input"
            name="campusId"
            placeholder="Campus ID (e.g. 2023-00123)"
            icon={<span>🆔</span>}
            value={values.campusId}
            onChange={handleChange}
            invalid={errors.invalid.campusId}
          />

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

          <div style={{ width: '100%', display: 'flex' }}>
            <label htmlFor="role-select" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </label>
            <select
              id="role-select"
              name="role"
              value={values.role}
              onChange={handleChange}
              style={{
                flexGrow: 1,
                borderRadius: '0 10px 10px 0',
                border: '1px solid var(--border-color)',
                borderLeft: 'none',
                background: 'var(--surface-color)',
                color: 'var(--text-color)',
                padding: '0.8em 1em',
                font: 'inherit'
              }}
            >
              <option value="student">Student</option>
              <option value="staff">Staff / Faculty</option>
            </select>
          </div>

          <Field
            id="password-input"
            name="password"
            type="password"
            placeholder="Password (min 8 chars)"
            icon={<LockIcon />}
            value={values.password}
            onChange={handleChange}
            invalid={errors.invalid.password}
          />

          <Field
            id="repeat-password-input"
            name="repeatPassword"
            type="password"
            placeholder="Confirm Password"
            icon={<LockIcon />}
            value={values.repeatPassword}
            onChange={handleChange}
            invalid={errors.invalid.repeatPassword}
          />

          <button type="submit">Create Account</button>
        </form>

        <p style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          {onSwitch ? (
            <a href="#login" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
              Sign In
            </a>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </p>

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
        </div>
      </div>
    </div>
  );
}
