import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Post = Tables<"blog_posts">;

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const empty: Partial<Post> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  category: "General",
  read_time: "5 min read",
  published: false,
};

const BlogEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Partial<Post>>(empty);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id!).maybeSingle();
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        toast.error("Post not found");
        navigate("/admin/blog", { replace: true });
        return;
      }
      setPost(data);
      setLoading(false);
    };
    void load();
  }, [id, isNew, navigate]);

  const update = (patch: Partial<Post>) => setPost((prev) => ({ ...prev, ...patch }));

  const onSave = async () => {
    if (!post.title?.trim()) return toast.error("Title is required");
    const slug = (post.slug?.trim() || slugify(post.title)).trim();
    if (!slug) return toast.error("Slug is required");

    setSaving(true);
    const wasUnpublished = !post.published;
    const willPublish = Boolean(post.published);
    const publishedAt = willPublish && wasUnpublished ? new Date().toISOString() : post.published_at ?? null;

    if (isNew) {
      const insert: TablesInsert<"blog_posts"> = {
        title: post.title!,
        slug,
        excerpt: post.excerpt || null,
        content: post.content || null,
        image_url: post.image_url || null,
        category: post.category || "General",
        read_time: post.read_time || null,
        published: willPublish,
        published_at: willPublish ? new Date().toISOString() : null,
      };
      const { data, error } = await supabase.from("blog_posts").insert(insert).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Post created");
      navigate(`/admin/blog/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: post.title,
          slug,
          excerpt: post.excerpt,
          content: post.content,
          image_url: post.image_url,
          category: post.category,
          read_time: post.read_time,
          published: willPublish,
          published_at: publishedAt,
        })
        .eq("id", id!);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
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
        title={isNew ? "New post" : "Edit post"}
        description={post.slug ? `/blog/${post.slug}` : "Markdown is supported in the body."}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/admin/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isNew ? "Create" : "Save"}
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={post.title ?? ""}
              onChange={(e) =>
                update({
                  title: e.target.value,
                  slug: !post.slug || isNew ? slugify(e.target.value) : post.slug,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={post.slug ?? ""} onChange={(e) => update({ slug: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={post.category ?? ""}
              onChange={(e) => update({ category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readtime">Read time</Label>
            <Input
              id="readtime"
              value={post.read_time ?? ""}
              onChange={(e) => update({ read_time: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Cover image URL</Label>
            <Input
              id="image"
              value={post.image_url ?? ""}
              onChange={(e) => update({ image_url: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={2}
              value={post.excerpt ?? ""}
              onChange={(e) => update({ excerpt: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Content (markdown)</Label>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-2">
                <Textarea
                  rows={16}
                  value={post.content ?? ""}
                  onChange={(e) => update({ content: e.target.value })}
                  className="font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="prose prose-sm dark:prose-invert max-w-none rounded-md border bg-muted/40 p-4">
                  <ReactMarkdown>{post.content || "_Nothing to preview_"}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              id="published"
              checked={Boolean(post.published)}
              onCheckedChange={(v) => update({ published: v })}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditPage;
