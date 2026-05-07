import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { format } from "date-fns";

type Post = Tables<"blog_posts">;

const BlogListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const togglePublished = async (post: Post) => {
    const next = !post.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: next, published_at: next ? new Date().toISOString() : null })
      .eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Published" : "Unpublished");
    void load();
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", confirmDelete.id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    setPosts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const filtered = posts.filter((p) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Articles published on the public site."
        actions={
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="mr-2 h-4 w-4" /> New post
          </Button>
        }
      />
      <div className="mb-4">
        <Input
          placeholder="Search title, slug, category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium">{p.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">/{p.slug}</div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <button onClick={() => togglePublished(p)}>
                    <Badge variant={p.published ? "default" : "secondary"} className="cursor-pointer">
                      {p.published ? "Published" : "Draft"}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.published_at ? format(new Date(p.published_at), "PP") : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {p.published && (
                      <Button asChild size="icon" variant="ghost">
                        <Link to={`/blog`} target="_blank" rel="noreferrer" aria-label="View">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button asChild size="icon" variant="ghost">
                      <Link to={`/admin/blog/${p.id}`} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(p)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>"{confirmDelete?.title}" will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogListPage;
