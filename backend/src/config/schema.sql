-- ============================================================
-- ReserVa Database Schema
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student', -- 'student' | 'staff' | 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add role column if upgrading an existing DB without role (safe to run repeatedly)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'student';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Sessions table for express-session (connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
) WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Files table for tracking local uploads
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    uploaded_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_filename ON files(filename);

-- ============================================================
-- Vehicles table
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(30) NOT NULL, -- 'car' | 'motorcycle' | 'bicycle' | 'pwd'
    model VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_user ON vehicles(user_id);

-- ============================================================
-- Zones table
-- ============================================================
CREATE TABLE IF NOT EXISTS zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(30) NOT NULL, -- 'car' | 'motorcycle' | 'bicycle' | 'pwd'
    capacity INT NOT NULL CHECK (capacity >= 1),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Slots table
-- ============================================================
CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    slot_code VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active' | 'maintenance' | 'disabled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slots_zone ON slots(zone_id);

-- ============================================================
-- Reservations table
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    slot_id INT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'reserved', -- 'reserved' | 'occupied' | 'completed' | 'expired' | 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_reservation_times CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_slot ON reservations(slot_id);

-- ============================================================
-- Sample seed data (runs only if no zones exist yet)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM zones LIMIT 1) THEN

    -- Sample admin user (password: admin1234)
    INSERT INTO users (name, email, password_hash, role)
    VALUES (
      'ReserVa Admin',
      'admin@reserva.edu.ph',
      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt of 'admin1234'
      'admin'
    ) ON CONFLICT (email) DO NOTHING;

    -- Zones
    INSERT INTO zones (name, location, vehicle_type, capacity) VALUES
      ('Zone A - CEA Building',          'North Campus, beside CEA Building',           'car',        20),
      ('Zone B - Student Activity Center','South Campus, near Gym',                     'motorcycle',  40),
      ('Zone C - Main Admin & Library',  'Central Oval, front of Admin Building',       'pwd',         10),
      ('Zone D - Eco Trail Bike Rack',   'East Gate, near Sports Complex',              'bicycle',     30);

    -- Slots for Zone A (id=1)
    INSERT INTO slots (zone_id, slot_code, status) VALUES
      (1, 'A-01', 'active'),
      (1, 'A-02', 'active'),
      (1, 'A-03', 'active'),
      (1, 'A-04', 'maintenance'),
      (1, 'A-05', 'active'),
      (1, 'A-06', 'disabled');

    -- Slots for Zone B (id=2)
    INSERT INTO slots (zone_id, slot_code, status) VALUES
      (2, 'B-01', 'active'),
      (2, 'B-02', 'active'),
      (2, 'B-03', 'active'),
      (2, 'B-04', 'active');

    -- Slots for Zone C (id=3)
    INSERT INTO slots (zone_id, slot_code, status) VALUES
      (3, 'C-01', 'active'),
      (3, 'C-02', 'active');

    -- Slots for Zone D (id=4)
    INSERT INTO slots (zone_id, slot_code, status) VALUES
      (4, 'D-01', 'active'),
      (4, 'D-02', 'active');

  END IF;
END $$;
