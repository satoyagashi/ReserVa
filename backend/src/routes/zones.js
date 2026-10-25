import { Router } from 'express';
import { zoneController } from '../controllers/zoneController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, zoneController.getZones);
router.post('/', requireAdmin, zoneController.createZone);
router.put('/:id', requireAdmin, zoneController.updateZone);
router.delete('/:id', requireAdmin, zoneController.deleteZone);

export default router;
