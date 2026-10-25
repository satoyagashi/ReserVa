import { query } from '../config/db.js';

export const slotController = {
  // GET /api/slots — list slots, optionally filtered by ?zone_id=
  async getSlots(req, res) {
    try {
      const { zone_id } = req.query;
      let sql = `
        SELECT s.id, s.zone_id, s.slot_code, s.status, s.created_at,
               z.name AS zone_name, z.vehicle_type
        FROM slots s
        JOIN zones z ON z.id = s.zone_id
      `;
      const params = [];
      if (zone_id) {
        sql += ' WHERE s.zone_id = $1';
        params.push(zone_id);
      }
      sql += ' ORDER BY s.slot_code ASC';

      const result = await query(sql, params);
      return res.status(200).json({ slots: result.rows });
    } catch (err) {
      console.error('Get slots error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/slots — create a slot (admin only)
  async createSlot(req, res) {
    try {
      const { zone_id, slot_code, status } = req.body;
      if (!zone_id || !slot_code) {
        return res.status(400).json({ error: 'zone_id and slot_code are required' });
      }

      const zone = await query('SELECT id, capacity FROM zones WHERE id = $1', [zone_id]);
      if (zone.rows.length === 0) {
        return res.status(404).json({ error: 'Zone not found' });
      }

      const slotCount = await query('SELECT COUNT(*) FROM slots WHERE zone_id = $1', [zone_id]);
      if (parseInt(slotCount.rows[0].count, 10) >= zone.rows[0].capacity) {
        return res.status(400).json({ error: `Zone is at full capacity (${zone.rows[0].capacity} slots)` });
      }

      const allowedStatus = ['active', 'maintenance', 'disabled'];
      const slotStatus = status && allowedStatus.includes(status) ? status : 'active';

      const result = await query(
        `INSERT INTO slots (zone_id, slot_code, status)
         VALUES ($1, $2, $3)
         RETURNING id, zone_id, slot_code, status, created_at`,
        [zone_id, slot_code.toUpperCase().trim(), slotStatus]
      );

      return res.status(201).json({ slot: result.rows[0] });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'A slot with this code already exists' });
      }
      console.error('Create slot error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/slots/:id — update a slot (admin only)
  async updateSlot(req, res) {
    try {
      const { id } = req.params;
      const { slot_code, status, zone_id } = req.body;

      const existing = await query('SELECT id FROM slots WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      const result = await query(
        `UPDATE slots SET
           slot_code = COALESCE($1, slot_code),
           status = COALESCE($2, status),
           zone_id = COALESCE($3, zone_id)
         WHERE id = $4
         RETURNING id, zone_id, slot_code, status, created_at`,
        [slot_code?.toUpperCase().trim() || null, status || null, zone_id || null, id]
      );

      return res.status(200).json({ slot: result.rows[0] });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'A slot with this code already exists' });
      }
      console.error('Update slot error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/slots/:id — delete a slot (admin only)
  async deleteSlot(req, res) {
    try {
      const { id } = req.params;
      const existing = await query('SELECT id FROM slots WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      await query('DELETE FROM slots WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Slot deleted successfully' });
    } catch (err) {
      console.error('Delete slot error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
