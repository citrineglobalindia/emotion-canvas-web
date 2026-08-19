/**
 * Downscale images in the browser before they reach storage.
 *
 * The media library had accumulated straight-off-the-camera JPEGs — several
 * over 25MB — which were then served to visitors as thumbnails. Besides the
 * download, decoding a 45-megapixel photo costs a few hundred megabytes of
 * memory, which is what made scrolling stutter. Anything this size is also too
 * big for Supabase to generate resized copies from, so the originals could not
 * even be optimised on delivery.
 *
 * Resizing at upload keeps the stored file useful for print-scale display while
 * staying comfortably inside the transform limit.
 */

/** Longest edge kept after resizing. Ample for full-bleed hero images. */
export const MAX_EDGE = 2560;

const OUTPUT_TYPE = "image/jpeg";
const OUTPUT_QUALITY = 0.82;

/** Formats we should not touch: re-encoding these loses more than it saves. */
const PASS_THROUGH = ["image/svg+xml", "image/gif", "image/avif"];

export type ResizeResult = {
  file: File;
  resized: boolean;
  originalBytes: number;
  bytes: number;
};

const loadBitmap = async (blob: Blob): Promise<ImageBitmap> => {
  // `createImageBitmap` decodes off the main thread where supported.
  if (typeof createImageBitmap === "function") return createImageBitmap(blob);
  throw new Error("createImageBitmap is unavailable");
};

const toBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, OUTPUT_TYPE, OUTPUT_QUALITY));

/**
 * Returns a resized copy, or the original when resizing would not help —
 * an unsupported format, an already-small image, or an encode that came out
 * bigger than what we started with.
 */
export const downscaleImage = async (
  file: File,
  maxEdge = MAX_EDGE,
): Promise<ResizeResult> => {
  const unchanged: ResizeResult = {
    file,
    resized: false,
    originalBytes: file.size,
    bytes: file.size,
  };

  if (!file.type.startsWith("image/") || PASS_THROUGH.includes(file.type)) return unchanged;

  let bitmap: ImageBitmap;
  try {
    bitmap = await loadBitmap(file);
  } catch {
    // A format the browser cannot decode is safer left exactly as uploaded.
    return unchanged;
  }

  const { width, height } = bitmap;
  const longest = Math.max(width, height);
  if (longest <= maxEdge) {
    bitmap.close?.();
    return unchanged;
  }

  const scale = maxEdge / longest;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return unchanged;
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const blob = await toBlob(canvas);
  // Free the backing store promptly rather than waiting for GC.
  canvas.width = 0;
  canvas.height = 0;
  if (!blob || blob.size >= file.size) return unchanged;

  const name = file.name.replace(/\.(png|webp|tiff?|bmp|heic|heif)$/i, ".jpg");
  return {
    file: new File([blob], name, { type: OUTPUT_TYPE, lastModified: file.lastModified }),
    resized: true,
    originalBytes: file.size,
    bytes: blob.size,
  };
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
