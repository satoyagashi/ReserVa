import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { storageService } from '../services/storageService.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageService.getUploadsDir());
  },
  filename: (req, file, cb) => {
    const randomHex = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    const cleanName = `${Date.now()}-${randomHex}${ext}`;
    cb(null, cleanName);
  }
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10)) * 1024 * 1024
  }
});
