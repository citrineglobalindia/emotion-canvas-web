import { useState, type ImgHTMLAttributes } from "react";
import { sizedImageUrl } from "@/lib/media";

type SmartImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string | null | undefined;
  alt: string;
  /** Rendered width in CSS pixels at the largest breakpoint. */
  width: number;
  /** `sizes` attribute; defaults to the fixed width above. */
  sizes?: string;
  quality?: number;
};

/**
 * An <img> that asks Supabase for a display-sized copy instead of the original.
 *
 * Two safeguards, because the media library still contains oversized originals:
 *
 *  - Supabase will not transform a source image beyond its size limit, and
 *    answers with an error instead of a picture. If the transformed URL fails
 *    we fall back to the original so a photo never silently disappears.
 *  - `decoding="async"` keeps JPEG decoding off the thread that handles
 *    scrolling, which is what made the Instagram strip stutter.
 *
 * Images outside this project's storage (bundled assets, external URLs) pass
 * straight through untouched.
 */
export const SmartImage = ({
  src,
  alt,
  width,
  sizes,
  quality = 72,
  loading = "lazy",
  ...rest
}: SmartImageProps) => {
  const [failed, setFailed] = useState(false);
  if (!src) return null;

  const optimised = sizedImageUrl(src, width, quality);
  const isTransformed = optimised !== src;
  const finalSrc = failed || !isTransformed ? src : optimised;

  // Offer a 2x copy for high-density screens, but only when transforming —
  // pointing srcSet at a 30MB original would defeat the purpose.
  const srcSet =
    !failed && isTransformed
      ? `${optimised} 1x, ${sizedImageUrl(src, width * 2, quality)} 2x`
      : undefined;

  return (
    <img
      {...rest}
      src={finalSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

export default SmartImage;
