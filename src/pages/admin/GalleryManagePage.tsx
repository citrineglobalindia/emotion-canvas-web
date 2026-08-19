import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import SmartImage from "@/components/SmartImage";
import { MEDIA_BUCKET, MEDIA_QUERY_KEY, mediaUrl } from "@/lib/media";
import { uploadMediaFiles } from "@/lib/mediaUpload";
import { formatBytes } from "@/lib/imageResize";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Asset = Tables<"bw_media_assets">;

const PLACEMENT = "gallery";

/**
 * The Gallery page, managed directly.
 *
 * Gallery photographs are media-library assets carrying the `gallery` tag; any
 * further tag becomes a filter category on the public page. Doing that by hand
 * in the media library meant uploading, reopening each file and typing tags —
 * this page uploads straight into the gallery and edits the category inline.
 */
const GalleryManagePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Asset | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bw_media_assets")
      .select("*")
      .contains("tags", [PLACEMENT])
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setAssets(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const refresh = () => queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    // Tagged on the way in, so an upload here is immediately on the page.
    const { uploaded, errors, savedBytes } = await uploadMediaFiles(files, user?.id ?? null, [PLACEMENT]);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    errors.forEach((e) => toast.error(e));
    if (uploaded.length) {
      const saved = savedBytes > 0 ? ` (${formatBytes(savedBytes)} saved by resizing)` : "";
      toast.success(`${uploaded.length} photo${uploaded.length === 1 ? "" : "s"} added${saved}`);
      void load();
      void refresh();
    }
  };

  /** Everything except the placement tag is a filter category. */
  const categoryOf = (a: Asset) => (a.tags ?? []).find((t) => t !== PLACEMENT) ?? "";

  const setCategory = (id: string, category: string) =>
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, tags: [PLACEMENT, ...(category.trim() ? [category.trim()] : [])] } : a,
      ),
    );

  const saveCategory = async (asset: Asset) => {
    setSavingId(asset.id);
    const { error } = await supabase
      .from("bw_media_assets")
      .update({ tags: asset.tags, alt_text: asset.alt_text })
      .eq("id", asset.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("Saved");
  };

  const remove = async () => {
    if (!confirmDelete) return;
    const { error: stErr } = await supabase.storage.from(MEDIA_BUCKET).remove([confirmDelete.file_path]);
    if (stErr) toast.error(`Storage: ${stErr.message}`);
    const { error } = await supabase.from("bw_media_assets").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    setAssets((prev) => prev.filter((a) => a.id !== confirmDelete.id));
    setConfirmDelete(null);
    await refresh();
    toast.success("Photograph deleted");
  };

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Photographs shown at /gallery. Give a photo a category and it becomes a filter button there."
        actions={
          <>
            <input ref={fileInput} type="file" accept="image/*" multiple hidden
              onChange={(e) => void onFiles(e.target.files)} />
            <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading ? "Uploading…" : "Upload photos"}
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : assets.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No photographs in the gallery yet, so the page is showing its built-in samples. Click{" "}
            <strong>Upload photos</strong> to add your own — you can select many at once.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted">
                <SmartImage src={mediaUrl(a.file_path)} alt={a.alt_text ?? a.file_name} width={500}
                  className="h-full w-full object-cover" />
              </div>
              <CardContent className="space-y-3 p-3">
                <div className="truncate text-xs text-muted-foreground" title={a.file_name}>
                  {a.file_name}
                  {a.file_size ? <Badge variant="secondary" className="ml-2">{formatBytes(a.file_size)}</Badge> : null}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Input value={categoryOf(a)} placeholder="e.g. Weddings"
                    onChange={(e) => setCategory(a.id, e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Input value={a.alt_text ?? ""} placeholder="Describes the photo for screen readers"
                    onChange={(e) =>
                      setAssets((prev) => prev.map((x) => (x.id === a.id ? { ...x, alt_text: e.target.value } : x)))
                    } />
                </div>
                <div className="flex justify-between gap-2">
                  <Button size="sm" onClick={() => void saveCategory(a)} disabled={savingId === a.id}>
                    {savingId === a.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(a)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photograph?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete?.file_name} will be removed from the gallery and deleted from storage.
              Anywhere else it is used will show a broken image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryManagePage;
