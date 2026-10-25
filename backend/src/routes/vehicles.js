import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All vehicle routes require authentication
router.get('/', requireAuth, vehicleController.listMyVehicles);
router.post('/', requireAuth, vehicleController.addVehicle);

export default router;
