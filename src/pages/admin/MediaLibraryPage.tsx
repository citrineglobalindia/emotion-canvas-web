import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Copy, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Asset = Tables<"media_assets">;
const BUCKET = "media-library";

const MediaLibraryPage = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editTags, setEditTags] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Asset | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setAssets(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const publicUrl = (path: string) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let succeeded = 0;
    for (const file of Array.from(files)) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
      });
      if (upErr) {
        toast.error(`${file.name}: ${upErr.message}`);
        continue;
      }
      const { error: insErr } = await supabase.from("media_assets").insert({
        bucket_id: BUCKET,
        file_name: file.name,
        file_path: path,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: user?.id ?? null,
        is_public: true,
      });
      if (insErr) {
        toast.error(`${file.name}: ${insErr.message}`);
        await supabase.storage.from(BUCKET).remove([path]);
        continue;
      }
      succeeded++;
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    if (succeeded > 0) {
      toast.success(`${succeeded} file${succeeded === 1 ? "" : "s"} uploaded`);
      void load();
    }
  };

  const onCopy = async (asset: Asset) => {
    const url = publicUrl(asset.file_path);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const openEdit = (a: Asset) => {
    setEditing(a);
    setEditAlt(a.alt_text ?? "");
    setEditCaption(a.caption ?? "");
    setEditTags((a.tags ?? []).join(", "));
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase
      .from("media_assets")
      .update({ alt_text: editAlt || null, caption: editCaption || null, tags })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    void load();
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    const { error: stErr } = await supabase.storage.from(BUCKET).remove([confirmDelete.file_path]);
    if (stErr) toast.error(`Storage: ${stErr.message}`);
    const { error: rowErr } = await supabase.from("media_assets").delete().eq("id", confirmDelete.id);
    if (rowErr) return toast.error(rowErr.message);
    toast.success("Deleted");
    setAssets((prev) => prev.filter((a) => a.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const filtered = assets.filter((a) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      a.file_name.toLowerCase().includes(q) ||
      (a.caption ?? "").toLowerCase().includes(q) ||
      (a.alt_text ?? "").toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <PageHeader
        title="Media library"
        description="Images and assets stored in the public media-library bucket."
        actions={
          <>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              onChange={(e) => void onFiles(e.target.files)}
            />
            <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search filename, caption, tag..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No media yet. Click <strong>Upload</strong> to add files.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((a) => {
            const url = publicUrl(a.file_path);
            const isImage = (a.mime_type ?? "").startsWith("image/");
            return (
              <Card key={a.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => openEdit(a)}
                  className="block aspect-square w-full bg-muted"
                  title={a.file_name}
                >
                  {isImage ? (
                    <img src={url} alt={a.alt_text ?? a.file_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      {a.mime_type ?? "file"}
                    </div>
                  )}
                </button>
                <CardContent className="space-y-1 p-2">
                  <div className="truncate text-xs font-medium" title={a.file_name}>{a.file_name}</div>
                  <div className="flex justify-between gap-1">
                    <Button size="icon" variant="ghost" onClick={() => onCopy(a)} aria-label="Copy URL">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(a)} aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit asset</DialogTitle>
            <DialogDescription className="font-mono text-xs">{editing?.file_path}</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <img
                src={publicUrl(editing.file_path)}
                alt={editing.alt_text ?? editing.file_name}
                className="aspect-video w-full rounded-md border object-contain bg-muted"
              />
              <div className="space-y-2">
                <Label>Public URL</Label>
                <div className="flex gap-2">
                  <Input value={publicUrl(editing.file_path)} readOnly className="font-mono text-xs" />
                  <Button variant="outline" onClick={() => onCopy(editing)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">Alt text</Label>
                <Input id="alt" value={editAlt} onChange={(e) => setEditAlt(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cap">Caption</Label>
                <Textarea id="cap" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={editTags} onChange={(e) => setEditTags(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={onSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete?.file_name} will be removed from the storage bucket and the asset record deleted.
              References to its URL elsewhere will break.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibraryPage;
