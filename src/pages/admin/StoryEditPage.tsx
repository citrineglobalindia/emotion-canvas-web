import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";

type Story = Tables<"stories">;
type Section = Tables<"story_sections">;
type GalleryItem = Tables<"story_gallery_items">;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const emptyStory: Partial<Story> = {
  title: "",
  slug: "",
  couple_names: "",
  location: "",
  year_label: "",
  duration_label: "",
  excerpt: "",
  intro: "",
  cover_image_url: "",
  film_url: "",
  published: false,
  sort_order: 0,
};

const StoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [story, setStory] = useState<Partial<Story>>(emptyStory);
  const [sections, setSections] = useState<Section[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [storyId, setStoryId] = useState<string | null>(isNew ? null : id ?? null);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      const [{ data: s, error: sErr }, { data: secs, error: secErr }, { data: gal, error: galErr }] =
        await Promise.all([
          supabase.from("stories").select("*").eq("id", id!).maybeSingle(),
          supabase.from("story_sections").select("*").eq("story_id", id!).order("sort_order"),
          supabase.from("story_gallery_items").select("*").eq("story_id", id!).order("sort_order"),
        ]);
      if (sErr || secErr || galErr) {
        toast.error(sErr?.message ?? secErr?.message ?? galErr?.message ?? "Failed to load story");
        setLoading(false);
        return;
      }
      if (!s) {
        toast.error("Story not found");
        navigate("/admin/stories", { replace: true });
        return;
      }
      setStory(s);
      setSections(secs ?? []);
      setGallery(gal ?? []);
      setLoading(false);
    };
    void load();
  }, [id, isNew, navigate]);

  const update = (patch: Partial<Story>) => setStory((prev) => ({ ...prev, ...patch }));

  const onSaveStory = async () => {
    if (!story.title?.trim()) return toast.error("Title is required");
    if (!story.couple_names?.trim()) return toast.error("Couple names are required");
    const slug = (story.slug?.trim() || slugify(story.title)).trim();
    if (!slug) return toast.error("Slug is required");

    setSaving(true);
    if (isNew) {
      const insert: TablesInsert<"stories"> = {
        title: story.title!,
        slug,
        couple_names: story.couple_names!,
        location: story.location || null,
        year_label: story.year_label || null,
        duration_label: story.duration_label || null,
        excerpt: story.excerpt || null,
        intro: story.intro || null,
        cover_image_url: story.cover_image_url || null,
        film_url: story.film_url || null,
        published: Boolean(story.published),
        sort_order: Number(story.sort_order) || 0,
      };
      const { data, error } = await supabase.from("stories").insert(insert).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Story created");
      setStoryId(data.id);
      setStory(data);
      navigate(`/admin/stories/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase
        .from("stories")
        .update({
          title: story.title,
          slug,
          couple_names: story.couple_names,
          location: story.location,
          year_label: story.year_label,
          duration_label: story.duration_label,
          excerpt: story.excerpt,
          intro: story.intro,
          cover_image_url: story.cover_image_url,
          film_url: story.film_url,
          published: Boolean(story.published),
          sort_order: Number(story.sort_order) || 0,
        })
        .eq("id", id!);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: `tmp-${Date.now()}`,
        story_id: storyId ?? "",
        title: "",
        body: "",
        sort_order: prev.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Section,
    ]);
  };

  const updateSection = (idx: number, patch: Partial<Section>) =>
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((s, i) => ({ ...s, sort_order: i }));
    });
  };

  const removeSection = async (idx: number) => {
    const target = sections[idx];
    if (!target) return;
    if (!String(target.id).startsWith("tmp-")) {
      const { error } = await supabase.from("story_sections").delete().eq("id", target.id);
      if (error) return toast.error(error.message);
    }
    setSections((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sort_order: i })));
  };

  const saveSections = async () => {
    if (!storyId) return toast.error("Save the story first");
    setSaving(true);
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (!sec.title?.trim() || !sec.body?.trim()) continue;
      const isNewRow = String(sec.id).startsWith("tmp-");
      if (isNewRow) {
        const { data, error } = await supabase
          .from("story_sections")
          .insert({ story_id: storyId, title: sec.title, body: sec.body, sort_order: i })
          .select()
          .single();
        if (error) {
          setSaving(false);
          return toast.error(error.message);
        }
        setSections((prev) => prev.map((s, idx) => (idx === i ? data! : s)));
      } else {
        const { error } = await supabase
          .from("story_sections")
          .update({ title: sec.title, body: sec.body, sort_order: i })
          .eq("id", sec.id);
        if (error) {
          setSaving(false);
          return toast.error(error.message);
        }
      }
    }
    setSaving(false);
    toast.success("Sections saved");
  };

  const addGalleryItem = () => {
    setGallery((prev) => [
      ...prev,
      {
        id: `tmp-${Date.now()}`,
        story_id: storyId ?? "",
        image_url: "",
        alt_text: "",
        sort_order: prev.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as GalleryItem,
    ]);
  };

  const updateGalleryItem = (idx: number, patch: Partial<GalleryItem>) =>
    setGallery((prev) => prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)));

  const moveGalleryItem = (idx: number, dir: -1 | 1) => {
    setGallery((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((g, i) => ({ ...g, sort_order: i }));
    });
  };

  const removeGalleryItem = async (idx: number) => {
    const target = gallery[idx];
    if (!target) return;
    if (!String(target.id).startsWith("tmp-")) {
      const { error } = await supabase.from("story_gallery_items").delete().eq("id", target.id);
      if (error) return toast.error(error.message);
    }
    setGallery((prev) => prev.filter((_, i) => i !== idx).map((g, i) => ({ ...g, sort_order: i })));
  };

  const saveGallery = async () => {
    if (!storyId) return toast.error("Save the story first");
    setSaving(true);
    for (let i = 0; i < gallery.length; i++) {
      const item = gallery[i];
      if (!item.image_url?.trim()) continue;
      const isNewRow = String(item.id).startsWith("tmp-");
      if (isNewRow) {
        const { data, error } = await supabase
          .from("story_gallery_items")
          .insert({
            story_id: storyId,
            image_url: item.image_url,
            alt_text: item.alt_text,
            sort_order: i,
          })
          .select()
          .single();
        if (error) {
          setSaving(false);
          return toast.error(error.message);
        }
        setGallery((prev) => prev.map((g, idx) => (idx === i ? data! : g)));
      } else {
        const { error } = await supabase
          .from("story_gallery_items")
          .update({ image_url: item.image_url, alt_text: item.alt_text, sort_order: i })
          .eq("id", item.id);
        if (error) {
          setSaving(false);
          return toast.error(error.message);
        }
      }
    }
    setSaving(false);
    toast.success("Gallery saved");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isNew ? "New story" : "Edit story"}
        description={story.slug ? `/${story.slug}` : "Build a wedding story page."}
        actions={
          <Button variant="outline" onClick={() => navigate("/admin/stories")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        }
      />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="sections" disabled={isNew}>Sections</TabsTrigger>
          <TabsTrigger value="gallery" disabled={isNew}>Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={story.title ?? ""}
                  onChange={(e) =>
                    update({
                      title: e.target.value,
                      slug: !story.slug || isNew ? slugify(e.target.value) : story.slug,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={story.slug ?? ""} onChange={(e) => update({ slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="couple">Couple names</Label>
                <Input
                  id="couple"
                  value={story.couple_names ?? ""}
                  onChange={(e) => update({ couple_names: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={story.location ?? ""}
                  onChange={(e) => update({ location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={story.year_label ?? ""}
                  onChange={(e) => update({ year_label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={story.duration_label ?? ""}
                  onChange={(e) => update({ duration_label: e.target.value })}
                  placeholder="e.g. 4 min film"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort">Sort order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={story.sort_order ?? 0}
                  onChange={(e) => update({ sort_order: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cover">Cover image URL</Label>
                <Input
                  id="cover"
                  value={story.cover_image_url ?? ""}
                  onChange={(e) => update({ cover_image_url: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="film">Film URL</Label>
                <Input
                  id="film"
                  value={story.film_url ?? ""}
                  onChange={(e) => update({ film_url: e.target.value })}
                  placeholder="YouTube/Vimeo link"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  value={story.excerpt ?? ""}
                  onChange={(e) => update({ excerpt: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="intro">Intro</Label>
                <Textarea
                  id="intro"
                  rows={4}
                  value={story.intro ?? ""}
                  onChange={(e) => update({ intro: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Switch
                  id="published"
                  checked={Boolean(story.published)}
                  onCheckedChange={(v) => update({ published: v })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="md:col-span-2">
                <Button onClick={onSaveStory} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isNew ? "Create story" : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="mt-4 space-y-3">
          {sections.map((sec, idx) => (
            <Card key={sec.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Section {idx + 1}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => moveSection(idx, -1)} disabled={idx === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeSection(idx)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input
                  placeholder="Section title"
                  value={sec.title}
                  onChange={(e) => updateSection(idx, { title: e.target.value })}
                />
                <Textarea
                  rows={4}
                  placeholder="Section body (markdown allowed)"
                  value={sec.body}
                  onChange={(e) => updateSection(idx, { body: e.target.value })}
                />
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" onClick={addSection}>
              <Plus className="mr-2 h-4 w-4" /> Add section
            </Button>
            <Button onClick={saveSections} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save sections
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="mt-4 space-y-3">
          {gallery.map((g, idx) => (
            <Card key={g.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Image {idx + 1}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => moveGalleryItem(idx, -1)} disabled={idx === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => moveGalleryItem(idx, 1)} disabled={idx === gallery.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeGalleryItem(idx)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-[1fr_120px]">
                <div className="space-y-2">
                  <Input
                    placeholder="Image URL"
                    value={g.image_url}
                    onChange={(e) => updateGalleryItem(idx, { image_url: e.target.value })}
                  />
                  <Input
                    placeholder="Alt text"
                    value={g.alt_text ?? ""}
                    onChange={(e) => updateGalleryItem(idx, { alt_text: e.target.value })}
                  />
                </div>
                {g.image_url && (
                  <img
                    src={g.image_url}
                    alt={g.alt_text ?? ""}
                    className="h-24 w-full rounded-md border object-cover"
                  />
                )}
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" onClick={addGalleryItem}>
              <Plus className="mr-2 h-4 w-4" /> Add image
            </Button>
            <Button onClick={saveGallery} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save gallery
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoryEditPage;
