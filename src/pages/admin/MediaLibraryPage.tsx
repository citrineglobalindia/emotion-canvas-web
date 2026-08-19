import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Copy, Upload, Search, Wand2 } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LARGE_ASSET_BYTES, MEDIA_BUCKET, MEDIA_QUERY_KEY, PLACEMENT_TAGS, mediaUrl } from "@/lib/media";
import { downscaleImage, formatBytes } from "@/lib/imageResize";
import { uploadMediaFiles } from "@/lib/mediaUpload";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import SmartImage from "@/components/SmartImage";

type Asset = Tables<"bw_media_assets">;
const BUCKET = MEDIA_BUCKET;

/** What each placement tag does, shown next to the toggles in the edit dialog. */
const PLACEMENT_HELP: Record<string, string> = {
  gallery: "Show on the Gallery page",
};

const MediaLibraryPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
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
  const [optimising, setOptimising] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bw_media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setAssets(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const publicUrl = mediaUrl;

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const { uploaded, errors, savedBytes } = await uploadMediaFiles(files, user?.id ?? null);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    errors.forEach((e) => toast.error(e));
    if (uploaded.length > 0) {
      const saved = savedBytes > 0 ? ` (${formatBytes(savedBytes)} saved by resizing)` : "";
      toast.success(`${uploaded.length} file${uploaded.length === 1 ? "" : "s"} uploaded${saved}`);
      void load();
      void queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    }
  };

  /** Assets big enough to hurt page speed — and too big for Supabase to resize. */
  const oversized = assets.filter((a) => (a.file_size ?? 0) > LARGE_ASSET_BYTES);

  /**
   * Re-encode already-uploaded photos that are too large.
   *
   * Runs in the browser under the admin's own session, and writes back to the
   * same storage path so every URL already saved in stories, blog posts and
   * site content keeps working.
   */
  const optimiseAssets = async (targets: Asset[]) => {
    let done = 0;
    let saved = 0;
    const failures: string[] = [];

    for (const asset of targets) {
      setOptimising(`${done + 1} of ${targets.length}`);
      try {
        const response = await fetch(mediaUrl(asset.file_path));
        if (!response.ok) throw new Error(`download failed (${response.status})`);
        const blob = await response.blob();
        const source = new File([blob], asset.file_name, {
          type: asset.mime_type ?? blob.type,
        });

        const { file, resized, originalBytes, bytes } = await downscaleImage(source);
        if (!resized) {
          done++;
          continue;
        }

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(asset.file_path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: true,
          });
        if (upErr) throw new Error(upErr.message);

        const { error: rowErr } = await supabase
          .from("bw_media_assets")
          .update({ file_size: file.size, mime_type: file.type })
          .eq("id", asset.id);
        if (rowErr) throw new Error(rowErr.message);

        saved += originalBytes - bytes;
        done++;
      } catch (error) {
        failures.push(`${asset.file_name}: ${String(error instanceof Error ? error.message : error)}`);
      }
    }

    setOptimising(null);
    failures.slice(0, 3).forEach((f) => toast.error(f));
    if (saved > 0) {
      toast.success(`Optimised ${done} photo${done === 1 ? "" : "s"} — ${formatBytes(saved)} saved`);
    } else if (!failures.length) {
      toast.success("Nothing needed optimising");
    }
    void load();
    void queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
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
      .from("bw_media_assets")
      .update({ alt_text: editAlt || null, caption: editCaption || null, tags })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    void load();
    void queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    const { error: stErr } = await supabase.storage.from(BUCKET).remove([confirmDelete.file_path]);
    if (stErr) toast.error(`Storage: ${stErr.message}`);
    const { error: rowErr } = await supabase.from("bw_media_assets").delete().eq("id", confirmDelete.id);
    if (rowErr) return toast.error(rowErr.message);
    toast.success("Deleted");
    void queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
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
        description="Upload photos here, then tag them to place them on the website."
        actions={
          <>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              onChange={(e) => void onFiles(e.target.files)}
            />
            {oversized.length > 0 && (
              <Button
                variant="outline"
                onClick={() => void optimiseAssets(oversized)}
                disabled={Boolean(optimising)}
                title="Re-encode oversized photos so pages load quickly"
              >
                {optimising ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {optimising ? `Optimising ${optimising}` : `Optimise ${oversized.length} large photo${oversized.length === 1 ? "" : "s"}`}
              </Button>
            )}
            <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload
            </Button>
          </>
        }
      />

      {oversized.length > 0 && (
        <Card className="mb-4 border-amber-500/40 bg-amber-500/5">
          <CardContent className="py-3 text-sm">
            <strong>{oversized.length} photo{oversized.length === 1 ? " is" : "s are"} much larger than needed</strong>{" "}
            ({formatBytes(oversized.reduce((s, a) => s + (a.file_size ?? 0), 0))} in total). Visitors
            download these in full, which makes pages scroll slowly. Click{" "}
            <em>Optimise</em> above to resize them — the pictures keep their existing
            links and stay sharp on screen.
          </CardContent>
        </Card>
      )}

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
                    <SmartImage src={url} alt={a.alt_text ?? a.file_name} width={300} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      {a.mime_type ?? "file"}
                    </div>
                  )}
                </button>
                <CardContent className="space-y-1 p-2">
                  <div className="truncate text-xs font-medium" title={a.file_name}>{a.file_name}</div>
                  {(a.file_size ?? 0) > LARGE_ASSET_BYTES && (
                    <div className="text-[11px] font-medium text-amber-600">
                      {formatBytes(a.file_size ?? 0)} — needs optimising
                    </div>
                  )}
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
              <SmartImage
                src={publicUrl(editing.file_path)}
                alt={editing.alt_text ?? editing.file_name}
                width={900}
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
                <Label>Where this image appears</Label>
                <div className="flex flex-wrap gap-2">
                  {PLACEMENT_TAGS.map((tag) => {
                    const current = editTags.split(",").map((x) => x.trim()).filter(Boolean);
                    const on = current.some((x) => x.toLowerCase() === tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setEditTags(
                            (on
                              ? current.filter((x) => x.toLowerCase() !== tag)
                              : [...current, tag]
                            ).join(", "),
                          )
                        }
                        title={PLACEMENT_HELP[tag]}
                      >
                        <Badge variant={on ? "default" : "outline"}>{PLACEMENT_HELP[tag] ?? tag}</Badge>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Any other tag becomes a filter category on the Gallery page.
                </p>
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
