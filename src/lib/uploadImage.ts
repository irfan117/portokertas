import { getApiBase } from './apiBase';

const API_BASE = getApiBase();

export async function uploadImage(file: File): Promise<string> {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  if (!file.type.startsWith('image/') && !allowedTypes.includes(file.type)) {
    throw new Error('File harus berupa gambar (PNG, JPG, WEBP, GIF).');
  }
  const presignResponse = await fetch(`${API_BASE}/uploads/presign`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  if (!presignResponse.ok) {
    const err = await presignResponse.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal meminta URL upload Cloudinary. Pastikan sudah login admin.');
  }
  
  const { uploadUrl, params } = await presignResponse.json();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', params.api_key);
  formData.append('timestamp', params.timestamp.toString());
  formData.append('folder', params.folder);
  formData.append('signature', params.signature);

  const uploadResponse = await fetch(uploadUrl, { method: 'POST', body: formData });
  if (!uploadResponse.ok) throw new Error('Gagal mengunggah gambar ke Cloudinary.');
  
  const data = await uploadResponse.json();
  return data.secure_url;
}
