import { Router } from 'express';
import { fileController } from '../controllers/fileController.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/upload', uploadMiddleware.single('file'), fileController.upload);
router.get('/', fileController.list);
router.get('/:filename', fileController.getFile);
router.delete('/:filename', fileController.deleteFile);

export default router;
