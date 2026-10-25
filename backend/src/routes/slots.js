import { Router } from 'express';
import { slotController } from '../controllers/slotController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, slotController.getSlots);
router.post('/', requireAdmin, slotController.createSlot);
router.put('/:id', requireAdmin, slotController.updateSlot);
router.delete('/:id', requireAdmin, slotController.deleteSlot);

export default router;
