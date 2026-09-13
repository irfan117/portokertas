import { Router } from 'express';
import { requireAdmin } from '../auth';

export default function uploadRoutes() {
  const router = Router();
  router.post('/presign', requireAdmin, async (req, res, next) => {
    try {
      const { filename, contentType } = req.body as { filename?: string; contentType?: string };
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        return res.status(400).json({ error: 'Konfigurasi Cloudinary di .env belum lengkap.' });
      }

      if (!filename || !contentType?.startsWith('image/')) {
        return res.status(400).json({ error: 'File gambar tidak valid.' });
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const folder = 'portfolio';

      // Import crypto dynamically to generate Cloudinary signature
      const crypto = await import('crypto');
      const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

      res.json({
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        params: {
          api_key: apiKey,
          timestamp,
          folder,
          signature,
        },
      });
    } catch (error) {
      next(error);
    }
  });
  return router;
}
