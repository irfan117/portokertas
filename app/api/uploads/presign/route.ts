import { NextResponse } from 'next/server';
import { requireAdmin } from '@/src/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Login admin diperlukan.' }, { status: 401 });
    }

    const body = await req.json();
    const { filename, contentType } = body as { filename?: string; contentType?: string };
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Konfigurasi Cloudinary di Environment Variables belum lengkap.' }, { status: 400 });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!filename || (!contentType?.startsWith('image/') && !allowedTypes.includes(contentType || ''))) {
      return NextResponse.json({ error: 'File gambar tidak valid. Format yang didukung: PNG, JPG, WEBP, GIF.' }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'portfolio';

    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      params: {
        api_key: apiKey,
        timestamp,
        folder,
        signature,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload presign gagal.' },
      { status: 500 }
    );
  }
}
