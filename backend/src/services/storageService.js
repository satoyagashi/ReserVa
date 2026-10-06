import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, '../../storage/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const storageService = {
  getUploadsDir() {
    return UPLOADS_DIR;
  },

  getFilePath(filename) {
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename');
    }
    const resolvedPath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(resolvedPath)) {
      return null;
    }
    return resolvedPath;
  },

  async recordFileMetadata({ filename, originalName, mimeType, sizeBytes, storagePath, uploadedBy }) {
    const res = await query(
      `INSERT INTO files (filename, original_name, mime_type, size_bytes, storage_path, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, filename, original_name, mime_type, size_bytes, created_at`,
      [filename, originalName, mimeType, sizeBytes, storagePath, uploadedBy || null]
    );
    return res.rows[0];
  },

  async deleteFile(filename) {
    const filePath = this.getFilePath(filename);
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
    await query('DELETE FROM files WHERE filename = $1', [filename]);
    return true;
  },

  async listFiles(limit = 50, offset = 0) {
    const res = await query(
      'SELECT id, filename, original_name, mime_type, size_bytes, created_at FROM files ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return res.rows;
  }
};
