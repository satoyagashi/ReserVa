import { query } from '../config/db.js';

export const reservationController = {
  // GET /api/reservations — list reservations
  // Admins see all; regular users see only their own
  async listReservations(req, res) {
    try {
      let sql, params;

      if (req.user.role === 'admin') {
        sql = `
          SELECT r.id, r.user_id, r.vehicle_id, r.slot_id,
                 r.start_time, r.end_time, r.status, r.created_at,
                 u.name AS user_name, u.email AS user_email,
                 v.plate_number, v.vehicle_type,
                 s.slot_code, z.name AS zone_name
          FROM reservations r
          JOIN users u ON u.id = r.user_id
          JOIN vehicles v ON v.id = r.vehicle_id
          JOIN slots s ON s.id = r.slot_id
          JOIN zones z ON z.id = s.zone_id
          ORDER BY r.created_at DESC
        `;
        params = [];
      } else {
        sql = `
          SELECT r.id, r.user_id, r.vehicle_id, r.slot_id,
                 r.start_time, r.end_time, r.status, r.created_at,
                 v.plate_number, v.vehicle_type,
                 s.slot_code, z.name AS zone_name
          FROM reservations r
          JOIN vehicles v ON v.id = r.vehicle_id
          JOIN slots s ON s.id = r.slot_id
          JOIN zones z ON z.id = s.zone_id
          WHERE r.user_id = $1
          ORDER BY r.created_at DESC
        `;
        params = [req.user.id];
      }

      const result = await query(sql, params);
      return res.status(200).json({ reservations: result.rows });
    } catch (err) {
      console.error('List reservations error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/reservations — create a reservation
  async createReservation(req, res) {
    try {
      const { vehicle_id, slot_id, start_time, end_time } = req.body;
      if (!vehicle_id || !slot_id || !start_time || !end_time) {
        return res.status(400).json({ error: 'vehicle_id, slot_id, start_time, and end_time are required' });
      }

      const start = new Date(start_time);
      const end = new Date(end_time);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'start_time and end_time must be valid ISO dates' });
      }
      if (end <= start) {
        return res.status(400).json({ error: 'end_time must be after start_time' });
      }

      // Verify the vehicle belongs to the requesting user
      const vehicleCheck = await query('SELECT id FROM vehicles WHERE id = $1 AND user_id = $2', [vehicle_id, req.user.id]);
      if (vehicleCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Vehicle not found or does not belong to you' });
      }

      // Verify slot exists and is active
      const slotCheck = await query("SELECT id, status FROM slots WHERE id = $1", [slot_id]);
      if (slotCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      if (slotCheck.rows[0].status !== 'active') {
        return res.status(400).json({ error: 'Slot is not available (maintenance or disabled)' });
      }

      // Double-booking check: reject if any active reservation overlaps with this time window
      const overlap = await query(
        `SELECT id FROM reservations
         WHERE slot_id = $1
           AND status IN ('reserved', 'occupied')
           AND start_time < $3
           AND end_time > $2`,
        [slot_id, start.toISOString(), end.toISOString()]
      );
      if (overlap.rows.length > 0) {
        return res.status(409).json({ error: 'Slot is already reserved during this time period' });
      }

      const result = await query(
        `INSERT INTO reservations (user_id, vehicle_id, slot_id, start_time, end_time, status)
         VALUES ($1, $2, $3, $4, $5, 'reserved')
         RETURNING id, user_id, vehicle_id, slot_id, start_time, end_time, status, created_at`,
        [req.user.id, vehicle_id, slot_id, start.toISOString(), end.toISOString()]
      );

      return res.status(201).json({ reservation: result.rows[0] });
    } catch (err) {
      console.error('Create reservation error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PATCH /api/reservations/:id/cancel — cancel a reservation
  async cancelReservation(req, res) {
    try {
      const { id } = req.params;

      const existing = await query('SELECT id, user_id, status FROM reservations WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      const reservation = existing.rows[0];

      // Only the owner or an admin can cancel
      if (reservation.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: You can only cancel your own reservations' });
      }

      if (reservation.status === 'cancelled') {
        return res.status(400).json({ error: 'Reservation is already cancelled' });
      }
      if (reservation.status === 'completed') {
        return res.status(400).json({ error: 'Completed reservations cannot be cancelled' });
      }

      const result = await query(
        `UPDATE reservations SET status = 'cancelled' WHERE id = $1
         RETURNING id, user_id, vehicle_id, slot_id, start_time, end_time, status`,
        [id]
      );

      return res.status(200).json({ reservation: result.rows[0] });
    } catch (err) {
      console.error('Cancel reservation error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
