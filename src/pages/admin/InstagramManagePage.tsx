import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Loader2, ExternalLink, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";

// Instagram feed items are stored as rows in site_content, scoped to this
// page/section pair. image_url = the photo shown; cta_href = where clicking goes.
const PAGE_KEY = "home";
const SECTION_KEY = "instagram";

type Item = Tables<"site_content">;

const InstagramManagePage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);

  const [creating, setCreating] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLink, setNewLink] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bw_site_content")
      .select("*")
      .eq("page_key", PAGE_KEY)
      .eq("section_key", SECTION_KEY)
      .order("sort_order");
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const updateLocal = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const onCreate = async () => {
    if (!newImageUrl.trim()) return toast.error("Image URL is required");
    const nextOrder = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
    const insert = {
      page_key: PAGE_KEY,
      section_key: SECTION_KEY,
      image_url: newImageUrl.trim(),
      cta_href: newLink.trim() || null,
      sort_order: nextOrder,
      published: true,
    };
    const { data, error } = await supabase
      .from("bw_site_content")
      .insert(insert as never)
      .select()
      .single();
    if (error) return toast.error(error.message);
    toast.success("Photo added");
    setItems((prev) => [...prev, data as Item]);
    setCreating(false);
    setNewImageUrl("");
    setNewLink("");
  };

  const onSave = async (b: Item) => {
    setSaving(b.id);
    const { error } = await supabase
      .from("bw_site_content")
      .update({
        image_url: b.image_url,
        cta_href: b.cta_href,
        sort_order: b.sort_order,
        published: b.published,
      })
      .eq("id", b.id);
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("bw_site_content").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Photo removed");
    setItems((prev) => prev.filter((b) => b.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Instagram feed"
        description={'Photos shown in the "Follow Along" grid on the home page. Add a direct image URL for each photo, and optionally the Instagram post it links to.'}
        actions={
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Instagram photo</DialogTitle>
                <DialogDescription>
                  Paste a <strong>direct image URL</strong> (ends in .jpg/.png/.webp). On Instagram,
                  open the photo, right-click it and choose "Copy image address".
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label htmlFor="img">Image URL</Label>
                  <Input
                    id="img"
                    placeholder="https://.../photo.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Instagram post link (optional)</Label>
                  <Input
                    id="link"
                    placeholder="https://www.instagram.com/p/..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                </div>
                {newImageUrl.trim() && (
                  <div className="overflow-hidden rounded-md border">
                    <img
                      src={newImageUrl}
                      alt="Preview"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
                <Button onClick={onCreate}>Add photo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {loading && (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No photos yet — the public site shows its built-in defaults until you add some.
            Click <strong>Add photo</strong> to start.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex gap-4 p-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                {b.image_url ? (
                  <img
                    src={b.image_url}
                    alt="Instagram"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={b.published ? "default" : "secondary"}>
                    {b.published ? "Shown" : "Hidden"}
                  </Badge>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(b)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={b.image_url ?? ""}
                    onChange={(e) => updateLocal(b.id, { image_url: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Instagram link</Label>
                  <Input
                    value={b.cta_href ?? ""}
                    onChange={(e) => updateLocal(b.id, { cta_href: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Order</Label>
                    <Input
                      type="number"
                      className="h-8 w-16"
                      value={b.sort_order}
                      onChange={(e) => updateLocal(b.id, { sort_order: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={b.published}
                      onCheckedChange={(v) => updateLocal(b.id, { published: v })}
                    />
                    <Label className="text-xs">Shown</Label>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" onClick={() => onSave(b)} disabled={saving === b.id}>
                    {saving === b.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save
                  </Button>
                  {b.cta_href && (
                    <a
                      href={b.cta_href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              It will no longer appear in the Instagram grid on the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstagramManagePage;
