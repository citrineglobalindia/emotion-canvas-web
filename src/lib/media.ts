/**
 * Media library layer.
 *
 * Images uploaded in Admin → Media live in the `bw-media-library` storage
 * bucket with a matching row in `bw_media_assets`. `tags` is what drives
 * placement on the public site: an asset tagged `gallery` shows up in the
 * gallery grid, and any additional tag becomes a filter category there.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const MEDIA_BUCKET = "bw-media-library";

export type MediaAsset = Tables<"bw_media_assets">;

export type MediaItem = {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  tags: string[];
};

/** Public URL for a path inside the media bucket. */
export const mediaUrl = (path: string) =>
  supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;

export const MEDIA_QUERY_KEY = ["media-assets"] as const;

const fetchMedia = async (): Promise<MediaAsset[]> => {
  const { data, error } = await supabase
    .from("bw_media_assets")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const toMediaItem = (asset: MediaAsset): MediaItem => ({
  id: asset.id,
  url: mediaUrl(asset.file_path),
  alt: asset.alt_text?.trim() || asset.caption?.trim() || asset.file_name,
  caption: asset.caption,
  tags: asset.tags ?? [],
});

export const useMediaAssets = () =>
  useQuery({
    queryKey: MEDIA_QUERY_KEY,
    queryFn: fetchMedia,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

/**
 * Media placed in a named area of the site (`gallery`, `home-photos`, …).
 * Returns `managed: false` when the admin has not tagged anything for the
 * area, so the caller can keep its bundled fallback images.
 */
export const useTaggedMedia = (tag: string): { items: MediaItem[]; managed: boolean } => {
  const { data } = useMediaAssets();
  const items = (data ?? [])
    .filter((asset) => (asset.tags ?? []).some((t) => t.toLowerCase() === tag.toLowerCase()))
    .map(toMediaItem);
  return { items, managed: items.length > 0 };
};

/** Tag namespace used to place assets. Anything else is treated as a category. */
export const PLACEMENT_TAGS = ["gallery"] as const;
export type PlacementTag = (typeof PLACEMENT_TAGS)[number];

/** Categories an admin has used on the given assets, for filter buttons. */
export const categoriesOf = (items: MediaItem[]): string[] => {
  const set = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) {
      if (!(PLACEMENT_TAGS as readonly string[]).includes(tag.toLowerCase())) set.add(tag);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
};

/**
 * Rewrite a media-library URL to Supabase's image transform endpoint so the
 * browser downloads a display-sized image instead of the camera original.
 *
 * The originals in this library are full-resolution JPEGs — several are 20-30MB
 * — and were being decoded into thumbnails a couple of hundred pixels wide.
 * That is what made scrolling stutter: the download is bad enough, but decoding
 * a 45-megapixel JPEG also costs hundreds of megabytes of memory per image.
 *
 * Only URLs that point at this project's storage are rewritten; bundled assets
 * and third-party URLs are returned untouched.
 */
export const sizedImageUrl = (
  url: string | null | undefined,
  width: number,
  quality = 72,
): string => {
  if (!url) return "";
  const marker = "/storage/v1/object/public/";
  const at = url.indexOf(marker);
  if (at === -1) return url;
  const [base, rest] = [url.slice(0, at), url.slice(at + marker.length)];
  const [path, query] = rest.split("?");
  const params = new URLSearchParams(query);
  params.set("width", String(width));
  params.set("quality", String(quality));
  params.set("resize", params.get("resize") ?? "contain");
  return `${base}/storage/v1/render/image/public/${path}?${params.toString()}`;
};

/** Above this, an asset is worth re-encoding before it reaches a visitor. */
export const LARGE_ASSET_BYTES = 2 * 1024 * 1024;

/**
 * Supabase refuses to transform very large source images, so those still have
 * to be served as-is until they are re-encoded (Admin → Media → Optimise).
 */
export const TRANSFORM_SOURCE_LIMIT_BYTES = 25 * 1024 * 1024;
