/**
 * Site content layer.
 *
 * Every editable section of the public site is backed by a row in
 * `bw_site_content`, addressed by `page_key` + `section_key`. Components ask for
 * a section and pass the design's original copy as `fallback`; whatever the
 * admin has filled in wins, field by field, and anything left blank keeps the
 * fallback. That means an empty database renders exactly the site we shipped,
 * and the site degrades gracefully if a single field is cleared in the admin.
 *
 * The whole table is small (tens of rows), so it is fetched once and cached by
 * React Query rather than issuing a request per section.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ContentBlock = Tables<"bw_site_content">;

export const SITE_CONTENT_QUERY_KEY = ["site-content"] as const;

const fetchSiteContent = async (): Promise<ContentBlock[]> => {
  const { data, error } = await supabase
    .from("bw_site_content")
    .select("*")
    .eq("published", true)
    .order("page_key")
    .order("section_key")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
};

export const useSiteContent = () =>
  useQuery({
    queryKey: SITE_CONTENT_QUERY_KEY,
    queryFn: fetchSiteContent,
    staleTime: 5 * 60 * 1000,
    // Never let a content fetch failure blank out the site — components fall
    // back to their built-in copy when the query has no data.
    retry: 1,
  });

/** Treat null / whitespace-only strings as "not set" so blanks fall back. */
const filled = (value: string | null | undefined): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export type SectionFallback = {
  heading?: string;
  subheading?: string;
  body?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Whether the design's built-in demo photographs, stories and quotes may be
 * used to fill an empty section.
 *
 * They exist so a fresh site never looks broken, but they are baked into the
 * code rather than stored in the database — so deleting the last real item made
 * them reappear, which reads as mock data that cannot be deleted. Turning this
 * off in Admin → Site content → Global → Demo content leaves empty sections
 * genuinely empty.
 */
export const useDemoContentAllowed = (): boolean => {
  const { data } = useSiteContent();
  const settings = data?.find((b) => b.page_key === "site" && b.section_key === "settings");
  const meta = (settings?.metadata as Record<string, unknown> | null) ?? {};
  return String(meta.demo_content ?? "shown").toLowerCase() !== "hidden";
};

export type SectionContent = SectionFallback & {
  /** True once the admin has created a row for this section. */
  managed: boolean;
  metadata: Record<string, unknown>;
};

const merge = (block: ContentBlock | undefined, fallback: SectionFallback): SectionContent => ({
  heading: filled(block?.heading) ?? fallback.heading,
  subheading: filled(block?.subheading) ?? fallback.subheading,
  body: filled(block?.body) ?? fallback.body,
  image: filled(block?.image_url) ?? fallback.image,
  ctaLabel: filled(block?.cta_label) ?? fallback.ctaLabel,
  ctaHref: filled(block?.cta_href) ?? fallback.ctaHref,
  managed: Boolean(block),
  metadata: (block?.metadata as Record<string, unknown> | null) ?? {},
});

/**
 * A single editable section, merged over the design's original copy.
 *
 * ```ts
 * const hero = useSection("home", "hero", { heading: "stories", body: "..." });
 * ```
 */
export const useSection = (
  pageKey: string,
  sectionKey: string,
  fallback: SectionFallback = {},
): SectionContent => {
  const { data } = useSiteContent();
  const block = data?.find((b) => b.page_key === pageKey && b.section_key === sectionKey);
  return merge(block, fallback);
};

/**
 * A repeating section (gallery strips, stat tiles, film categories…). Returns
 * the admin's rows in `sort_order`, or the supplied fallback list when the
 * admin has not added any.
 */
export const useSectionList = <T,>(
  pageKey: string,
  sectionKey: string,
  fallback: T[],
  map: (block: ContentBlock) => T,
): { items: T[]; managed: boolean } => {
  const { data } = useSiteContent();
  const demoAllowed = useDemoContentAllowed();
  const blocks = (data ?? [])
    .filter((b) => b.page_key === pageKey && b.section_key === sectionKey)
    .sort((a, b) => a.sort_order - b.sort_order);
  if (!blocks.length) return { items: demoAllowed ? fallback : [], managed: false };
  return { items: blocks.map(map), managed: true };
};

/** Read a typed value out of a block's JSON `metadata` column. */
export const metaString = (
  content: SectionContent,
  key: string,
  fallback?: string,
): string | undefined => {
  const raw = content.metadata[key];
  return typeof raw === "string" && raw.trim().length ? raw.trim() : fallback;
};

export const metaNumber = (
  content: SectionContent,
  key: string,
  fallback?: number,
): number | undefined => {
  const raw = content.metadata[key];
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "" && Number.isFinite(Number(raw))) {
    return Number(raw);
  }
  return fallback;
};
