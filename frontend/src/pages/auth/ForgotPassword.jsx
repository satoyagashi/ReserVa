import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your campus email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <h1>ReserVa</h1>
        <p className="auth-subtitle">Password Recovery</p>

        {submitted ? (
          <div style={{ padding: '20px', maxWidth: '380px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✉️</div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-color)', marginBottom: '8px' }}>
              Check Your Inbox
            </h2>
            <p style={{ color: 'var(--muted-color)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
              We sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>. Follow the instructions to reset your password.
            </p>
            <Link to="/login" className="demo-btn" style={{ padding: '10px 24px', display: 'inline-block' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <p id="error-message">{error}</p>
            <p style={{ color: 'var(--muted-color)', fontSize: '0.9rem', maxWidth: '340px', marginBottom: '10px' }}>
              Enter your registered campus email and we will send you a reset link.
            </p>
            <form id="form" onSubmit={handleSubmit} noValidate>
              <div style={{ width: '100%', display: 'flex' }}>
                <label htmlFor="reset-email" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  @
                </label>
                <input
                  id="reset-email"
                  type="email"
                  placeholder="Campus Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
              <button type="submit">Send Reset Link</button>
            </form>

            <p style={{ fontSize: '0.9rem' }}>
              Remembered your credentials? <Link to="/login">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
