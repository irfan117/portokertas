import { WorkProject } from '../types';

export const DEFAULT_PROJECT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';

/**
 * Memeriksa apakah URL adalah placeholder Unsplash bawaan template.
 */
export function isDefaultPlaceholder(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  return trimmed.includes('images.unsplash.com');
}

/**
 * Mengambil daftar gambar galeri asli untuk project,
 * dengan memprioritaskan gambar upload (Cloudinary dsb) dan
 * mengeliminasi gambar placeholder Unsplash jika sudah ada gambar asli dari database.
 */
export function getProjectGallery(project: WorkProject): string[] {
  const realUploadedImages: string[] = [];

  // 1. Kumpulkan gambar dari array images yang bukan placeholder
  if (Array.isArray(project.images)) {
    for (const img of project.images) {
      const trimmed = img?.trim();
      if (trimmed && !isDefaultPlaceholder(trimmed) && !realUploadedImages.includes(trimmed)) {
        realUploadedImages.push(trimmed);
      }
    }
  }

  // 2. Kumpulkan img cover jika bukan placeholder
  const cover = project.img?.trim();
  if (cover && !isDefaultPlaceholder(cover)) {
    if (!realUploadedImages.includes(cover)) {
      // Jadikan cover di urutan pertama jika ada
      realUploadedImages.unshift(cover);
    }
  }

  // Jika sudah ada gambar asli dari database, kembalikan gambar asli saja (tanpa dummy placeholder!)
  if (realUploadedImages.length > 0) {
    return realUploadedImages;
  }

  // Jika belum ada gambar asli sama sekali, fallback ke apa yang ada
  const fallbackImages: string[] = [];
  if (cover) fallbackImages.push(cover);
  if (Array.isArray(project.images)) {
    for (const img of project.images) {
      const trimmed = img?.trim();
      if (trimmed && !fallbackImages.includes(trimmed)) {
        fallbackImages.push(trimmed);
      }
    }
  }

  return fallbackImages;
}

/**
 * Mengambil gambar utama (cover/display) untuk ditampilkan di kartu project (Work page / Grid / Admin).
 * Selalu memprioritaskan gambar asli yang diunggah/dari DB dibandingkan gambar placeholder bawaan.
 */
export function getProjectDisplayImage(project: WorkProject): string {
  const gallery = getProjectGallery(project);
  if (gallery.length > 0) {
    return gallery[0];
  }
  return project.img || DEFAULT_PROJECT_PLACEHOLDER;
}

