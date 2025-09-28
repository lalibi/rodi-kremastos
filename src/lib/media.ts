import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';

export type MediaType = 'image' | 'video';

export type MediaItem = {
  src: string; // final URL (hashed asset or public path)
  alt: string;
  type?: MediaType;
};

export type MediaFallback = {
  src: string; // filename only, to be prefixed with basePublic
  alt: string;
  type?: MediaType;
};

// Create a readable alt from a file path
export function humanizeFromPath(p: string): string {
  const file = p.split('/').pop() || '';
  const base = file.replace(/\.[^.]+$/, '');
  return base.replace(/[-_]+/g, ' ').trim();
}

export function pickAltFromMeta(meta: any): string | undefined {
  const candidates = [
    meta?.iptc?.Caption,
    meta?.iptc?.CaptionAbstract,
    meta?.iptc?.ObjectName,
    meta?.xmp?.Description,
    meta?.xmp?.Title,
    meta?.ImageDescription,
    meta?.XPTitle,
    meta?.XPComment,
    meta?.title,
    meta?.description,
  ]
    .filter((v) => typeof v === 'string')
    .map((s) => s.trim())
    .filter(Boolean);
  return candidates[0];
}

// Turn import.meta.glob modules into MediaItem[] with optional type
export function normalizeMediaFromModules(
  modules: Record<string, unknown>,
  opts?: { type?: MediaType }
): MediaItem[] {
  const assetUrl = (u: unknown): string => {
    if (typeof u === 'string') return u;
    if (u && typeof u === 'object' && 'src' in (u as any)) return (u as any).src as string;
    return String(u);
  };
  return Object.entries(modules)
    .map(([p, url]) => ({
      src: assetUrl(url),
      alt: humanizeFromPath(p),
      type: opts?.type,
    }))
    .sort((a, b) => a.src.localeCompare(b.src));
}

// Prefer bundled assets; otherwise convert public fallback items into final URLs
export function mergeAssetsOrFallback(
  assets: MediaItem[],
  fallback: MediaFallback[],
  basePublic: string
): MediaItem[] {
  if (assets.length > 0) return assets;
  const base = basePublic.endsWith('/') ? basePublic : `${basePublic}/`;
  return fallback.map((f) => ({
    src: `${base}${f.src}`,
    alt: f.alt,
    type: f.type,
  }));
}

// Discover media under src/assets/photos with metadata-derived alts
export async function discoverMedia(dir: 'about' | 'products'): Promise<MediaItem[]> {
  const imgMods = dir === 'about'
    ? import.meta.glob('../assets/photos/about/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' })
    : import.meta.glob('../assets/photos/products/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' });
  const vidMods = dir === 'about'
    ? import.meta.glob('../assets/photos/about/*.{mp4,webm,ogv}', { eager: true, import: 'default' })
    : import.meta.glob('../assets/photos/products/*.{mp4,webm,ogv}', { eager: true, import: 'default' });

  const assetUrl = (u: unknown): string => {
    if (typeof u === 'string') return u;
    if (u && typeof u === 'object' && 'src' in (u as any)) return (u as any).src as string;
    return String(u);
  };

  const images = await Promise.all(
    Object.entries(imgMods).map(async ([relPath, url]) => {
      let alt: string | undefined;
      try {
        const absUrl = new URL(relPath, import.meta.url);
        const buf = fs.readFileSync(fileURLToPath(absUrl));
        const meta = await exifr.parse(buf, { iptc: true, xmp: true, tiff: true });
        alt = pickAltFromMeta(meta);
      } catch {
        // ignore and fallback to filename
      }
      return {
        type: 'image' as const,
        src: assetUrl(url),
        alt: alt || humanizeFromPath(relPath),
      };
    })
  );

  const videos: MediaItem[] = Object.entries(vidMods).map(([relPath, url]) => ({
    type: 'video',
    src: assetUrl(url),
    alt: humanizeFromPath(relPath),
  }));

  return [...images, ...videos].sort((a, b) => a.src.localeCompare(b.src));
}
