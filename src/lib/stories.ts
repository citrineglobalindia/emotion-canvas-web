/**
 * Stories layer.
 *
 * `/stories` and `/stories/:slug` render whatever an admin has published in
 * Admin → Stories. The bundled demo stories in `src/data/stories.ts` are used
 * only while the table has no published rows, so the live site never renders an
 * empty portfolio — but as soon as one real story is published, the demo set
 * disappears rather than sitting alongside it.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stories as demoStories } from "@/data/stories";
import storyPlaceholder from "@/assets/story-1.jpg";

export type StoryMoment = { title: string; body: string };

export type PublicStory = {
  slug: string;
  title: string;
  couple: string;
  location: string;
  excerpt: string;
  intro: string;
  year: string;
  duration: string;
  image: string;
  videoUrl: string | null;
  gallery: string[];
  moments: StoryMoment[];
};

const STORIES_KEY = ["stories"] as const;

/** Demo content, normalised to the same shape as database-backed stories. */
const demo: PublicStory[] = demoStories.map((s) => ({
  slug: s.slug,
  title: s.title,
  couple: s.couple,
  location: s.location,
  excerpt: s.excerpt,
  intro: s.intro,
  year: s.year,
  duration: s.duration,
  image: s.image,
  videoUrl: s.videoUrl,
  gallery: [...s.gallery],
  moments: s.moments.map((m) => ({ title: m.title, body: m.body })),
}));

const fetchStories = async () => {
  const { data, error } = await supabase
    .from("bw_stories")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

const fetchStoryExtras = async (storyIds: string[]) => {
  if (!storyIds.length) return { sections: [], gallery: [] };
  const [sections, gallery] = await Promise.all([
    supabase.from("bw_story_sections").select("*").in("story_id", storyIds).order("sort_order"),
    supabase.from("bw_story_gallery_items").select("*").in("story_id", storyIds).order("sort_order"),
  ]);
  if (sections.error) throw sections.error;
  if (gallery.error) throw gallery.error;
  return { sections: sections.data ?? [], gallery: gallery.data ?? [] };
};

const fetchPublicStories = async (): Promise<PublicStory[]> => {
  const rows = await fetchStories();
  if (!rows.length) return [];
  const { sections, gallery } = await fetchStoryExtras(rows.map((r) => r.id));

  return rows.map((row) => {
    const images = gallery.filter((g) => g.story_id === row.id).map((g) => g.image_url);
    return {
      slug: row.slug,
      title: row.title,
      couple: row.couple_names,
      location: row.location?.trim() || "",
      excerpt: row.excerpt?.trim() || "",
      intro: row.intro?.trim() || row.excerpt?.trim() || "",
      year: row.year_label?.trim() || "",
      duration: row.duration_label?.trim() || "",
      // Cover falls back to the first gallery image so a story is never a
      // broken <img> just because the admin skipped the cover field.
      image: row.cover_image_url?.trim() || images[0] || storyPlaceholder,
      videoUrl: row.film_url?.trim() || null,
      gallery: images,
      moments: sections
        .filter((s) => s.story_id === row.id)
        .map((s) => ({ title: s.title, body: s.body })),
    };
  });
};

/**
 * All stories for the public site. `managed` is true when the list came from
 * the database rather than the bundled demo content.
 */
export const usePublicStories = (): {
  stories: PublicStory[];
  managed: boolean;
  isLoading: boolean;
} => {
  const { data, isLoading } = useQuery({
    queryKey: STORIES_KEY,
    queryFn: fetchPublicStories,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const managed = Boolean(data?.length);
  return { stories: managed ? data! : demo, managed, isLoading };
};

export const findStory = (stories: PublicStory[], slug: string | undefined) =>
  stories.find((s) => s.slug === slug);
