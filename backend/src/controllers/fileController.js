import { storageService } from '../services/storageService.js';

export const fileController = {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileRecord = await storageService.recordFileMetadata({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        storagePath: req.file.path,
        uploadedBy: req.session?.userId || null
      });

      return res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          ...fileRecord,
          url: `/uploads/${req.file.filename}`
        }
      });
    } catch (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'File upload failed' });
    }
  },

  async getFile(req, res) {
    try {
      const { filename } = req.params;
      const filePath = storageService.getFilePath(filename);
      if (!filePath) {
        return res.status(404).json({ error: 'File not found' });
      }
      return res.sendFile(filePath);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async deleteFile(req, res) {
    try {
      const { filename } = req.params;
      await storageService.deleteFile(filename);
      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const files = await storageService.listFiles();
      return res.status(200).json({ files });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
