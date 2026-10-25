import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './config/db.js';
import { storageService } from './services/storageService.js';
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/files.js';
import vehicleRoutes from './routes/vehicles.js';
import zoneRoutes from './routes/zones.js';
import slotRoutes from './routes/slots.js';
import reservationRoutes from './routes/reservations.js';

const PgSession = connectPgSimple(session);

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'reserva_dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  })
);

// Serve uploaded files statically
app.use('/uploads', express.static(storageService.getUploadsDir()));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
