import { promises as fs } from "fs";
import path from "path";

/** Read all images in public/assets/img/<slug>/ sorted by filename (facade/stairs first via naming). */
export async function getPhotos(slug) {
  const dir = path.join(process.cwd(), "public", "assets", "img", slug);
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/assets/img/${slug}/${f}`);
  } catch {
    return [];
  }
}
