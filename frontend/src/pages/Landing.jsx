import { Link } from 'react-router-dom';
import { mockZones, mockSlots, mockReservations } from '../mockData.js';

export default function Landing() {
  const activeSlots = mockSlots.filter((s) => s.status === 'active').length;
  const activeReservations = mockReservations.filter((r) => r.status === 'reserved' || r.status === 'occupied').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b110e', color: '#e7f5ec', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Navigation */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 32px',
        maxWidth: 1200,
        margin: '0 auto',
        borderBottom: '1px solid #1a2721'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🅿️</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3df59a', letterSpacing: '-0.02em' }}>ReserVa</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" style={{
            color: '#cbd5e1',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            border: '1px solid #23342b'
          }}>
            Sign In
          </Link>
          <Link to="/register" style={{
            background: '#3df59a',
            color: '#0a1610',
            textDecoration: 'none',
            padding: '8px 18px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px 60px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(61, 245, 154, 0.1)',
          border: '1px solid rgba(61, 245, 154, 0.25)',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: '#3df59a',
          marginBottom: '20px'
        }}>
          ✨ Next-Generation Campus Parking System
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: 800,
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #ffffff 40%, #85988c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Effortless Campus Parking Slot Reservations
        </h1>
        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: 620,
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Say goodbye to morning parking panic. Browse live campus zones, reserve your designated slot in seconds, and park with peace of mind.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" style={{
            background: '#3df59a',
            color: '#08140e',
            textDecoration: 'none',
            padding: '14px 32px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 0 24px rgba(61, 245, 154, 0.4)'
          }}>
            Reserve a Slot Now
          </Link>
          <Link to="/admin" style={{
            background: '#131e18',
            color: '#e2e8f0',
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: '999px',
            fontWeight: 600,
            fontSize: '1rem',
            border: '1px solid #23342b'
          }}>
            🛡️ Admin Overview
          </Link>
        </div>

        {/* Live Metric Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginTop: '60px',
          background: 'rgba(21, 31, 25, 0.6)',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3df59a' }}>{mockZones.length}</div>
            <div style={{ color: '#85988c', fontSize: '0.9rem' }}>Active Campus Zones</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3df59a' }}>{activeSlots}</div>
            <div style={{ color: '#85988c', fontSize: '0.9rem' }}>Available Slots</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3df59a' }}>{activeReservations}</div>
            <div style={{ color: '#85988c', fontSize: '0.9rem' }}>Active Reservations</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3df59a' }}>4 Types</div>
            <div style={{ color: '#85988c', fontSize: '0.9rem' }}>Cars, Motor, Bike, PWD</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>How ReserVa Works</h2>
          <p style={{ color: '#94a3b8' }}>Get parked in three simple steps.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#121c17', border: '1px solid #1f3026', borderRadius: '12px', padding: '28px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>1️⃣</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Register Vehicle</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Create your account with your campus credentials and register your vehicle (car, motorcycle, bicycle, or PWD accessible).
            </p>
          </div>

          <div style={{ background: '#121c17', border: '1px solid #1f3026', borderRadius: '12px', padding: '28px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>2️⃣</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Select Slot</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Filter by building zone, view real-time slot occupancy, and pick the best spot nearest to your class or department.
            </p>
          </div>

          <div style={{ background: '#121c17', border: '1px solid #1f3026', borderRadius: '12px', padding: '28px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>3️⃣</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>Park & Go</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Confirm your reservation period and arrive smoothly. No more circling around campus searching for parking!
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Built For The Campus Community</h2>
          <p style={{ color: '#94a3b8' }}>Equipped with modern tools for students, faculty, and security personnel.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#101813', border: '1px solid #1b2920', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>⚡</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Real-time Occupancy</h4>
            <p style={{ color: '#85988c', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Slots update automatically when reservations start, expire, or get checked-in.
            </p>
          </div>

          <div style={{ background: '#101813', border: '1px solid #1b2920', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>♿</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>PWD Priority Allocation</h4>
            <p style={{ color: '#85988c', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Dedicated accessible slots located beside main elevators and ramps.
            </p>
          </div>

          <div style={{ background: '#101813', border: '1px solid #1b2920', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🛡️</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Verified Vehicles</h4>
            <p style={{ color: '#85988c', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Admin approval workflow ensures campus parking safety and legitimacy.
            </p>
          </div>

          <div style={{ background: '#101813', border: '1px solid #1b2920', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📊</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Zone Analytics</h4>
            <p style={{ color: '#85988c', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Security and facility staff monitor peak hour utilization rates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #18241e',
        padding: '30px 24px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.88rem'
      }}>
        <p>© 2026 ReserVa · Campus Parking Slot Reservation System · All Rights Reserved.</p>
      </footer>
    </div>
  );
}
