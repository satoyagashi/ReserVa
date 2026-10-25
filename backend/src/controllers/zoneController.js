import { query } from '../config/db.js';

export const zoneController = {
  // GET /api/zones — list all active zones (public; any logged-in user)
  async getZones(req, res) {
    try {
      const result = await query(
        'SELECT id, name, location, vehicle_type, capacity, is_active, created_at FROM zones ORDER BY name ASC'
      );
      return res.status(200).json({ zones: result.rows });
    } catch (err) {
      console.error('Get zones error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/zones — create a zone (admin only)
  async createZone(req, res) {
    try {
      const { name, location, vehicle_type, capacity } = req.body;
      if (!name || !location || !vehicle_type || !capacity) {
        return res.status(400).json({ error: 'name, location, vehicle_type, and capacity are required' });
      }

      const cap = parseInt(capacity, 10);
      if (isNaN(cap) || cap < 1) {
        return res.status(400).json({ error: 'capacity must be a positive integer' });
      }

      const result = await query(
        `INSERT INTO zones (name, location, vehicle_type, capacity)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, location, vehicle_type, capacity, is_active, created_at`,
        [name.trim(), location.trim(), vehicle_type, cap]
      );

      return res.status(201).json({ zone: result.rows[0] });
    } catch (err) {
      console.error('Create zone error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/zones/:id — update a zone (admin only)
  async updateZone(req, res) {
    try {
      const { id } = req.params;
      const { name, location, vehicle_type, capacity, is_active } = req.body;

      const existing = await query('SELECT id FROM zones WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Zone not found' });
      }

      const cap = capacity !== undefined ? parseInt(capacity, 10) : undefined;
      if (cap !== undefined && (isNaN(cap) || cap < 1)) {
        return res.status(400).json({ error: 'capacity must be a positive integer' });
      }

      const result = await query(
        `UPDATE zones SET
           name = COALESCE($1, name),
           location = COALESCE($2, location),
           vehicle_type = COALESCE($3, vehicle_type),
           capacity = COALESCE($4, capacity),
           is_active = COALESCE($5, is_active)
         WHERE id = $6
         RETURNING id, name, location, vehicle_type, capacity, is_active, created_at`,
        [name?.trim() || null, location?.trim() || null, vehicle_type || null, cap || null, is_active ?? null, id]
      );

      return res.status(200).json({ zone: result.rows[0] });
    } catch (err) {
      console.error('Update zone error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/zones/:id — delete a zone and its slots/reservations (admin only)
  async deleteZone(req, res) {
    try {
      const { id } = req.params;
      const existing = await query('SELECT id FROM zones WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Zone not found' });
      }

      // Cascade delete handled by FK ON DELETE CASCADE on slots → reservations
      await query('DELETE FROM zones WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Zone deleted successfully' });
    } catch (err) {
      console.error('Delete zone error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
