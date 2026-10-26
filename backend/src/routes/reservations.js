import { Router } from 'express';
import { reservationController } from '../controllers/reservationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All reservation routes require authentication; admin vs. user distinction is inside the controller
router.get('/', requireAuth, reservationController.listReservations);
router.get('/mine', requireAuth, reservationController.listReservations);
router.post('/', requireAuth, reservationController.createReservation);
router.patch('/:id/cancel', requireAuth, reservationController.cancelReservation);

export default router;
