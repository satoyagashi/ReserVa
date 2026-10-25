import { query } from '../config/db.js';

export const vehicleController = {
  // POST /api/vehicles — add a vehicle for the logged-in user
  async addVehicle(req, res) {
    try {
      const { plate_number, vehicle_type, model } = req.body;
      if (!plate_number || !vehicle_type) {
        return res.status(400).json({ error: 'plate_number and vehicle_type are required' });
      }

      const allowedTypes = ['car', 'motorcycle', 'bicycle', 'pwd'];
      if (!allowedTypes.includes(vehicle_type)) {
        return res.status(400).json({ error: `vehicle_type must be one of: ${allowedTypes.join(', ')}` });
      }

      const existing = await query('SELECT id FROM vehicles WHERE plate_number = $1', [plate_number.toUpperCase().trim()]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'A vehicle with this plate number is already registered' });
      }

      const result = await query(
        `INSERT INTO vehicles (user_id, plate_number, vehicle_type, model)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, plate_number, vehicle_type, model, created_at`,
        [req.user.id, plate_number.toUpperCase().trim(), vehicle_type, model?.trim() || null]
      );

      return res.status(201).json({ vehicle: result.rows[0] });
    } catch (err) {
      console.error('Add vehicle error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/vehicles — list vehicles owned by the logged-in user
  async listMyVehicles(req, res) {
    try {
      const result = await query(
        'SELECT id, plate_number, vehicle_type, model, created_at FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
      return res.status(200).json({ vehicles: result.rows });
    } catch (err) {
      console.error('List vehicles error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
