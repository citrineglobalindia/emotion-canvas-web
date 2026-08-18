import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { MEDIA_BUCKET, mediaUrl } from "@/lib/media";
import { uploadMediaFiles } from "@/lib/mediaUpload";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import SmartImage from "@/components/SmartImage";

type Asset = Tables<"bw_media_assets">;

/**
 * Browse-or-upload picker for any admin field that stores an image URL.
 *
 * Before this existed, every image field was a bare text input, so an admin had
 * to go to Media, copy a URL, come back and paste it — and a typo silently
 * produced a broken image on the live site. Picking from the library guarantees
 * the URL is real.
 */
export const MediaPickerDialog = ({
  onSelect,
  trigger,
}: {
  onSelect: (url: string) => void;
  trigger: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open) void load();
  }, [open]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const { uploaded, errors } = await uploadMediaFiles(files, user?.id ?? null);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    errors.forEach((e) => toast.error(e));
    if (uploaded.length) {
      toast.success(`${uploaded.length} file${uploaded.length === 1 ? "" : "s"} uploaded`);
      // Uploading from the picker means "use this one" — select it immediately.
      onSelect(uploaded[0].url);
      setOpen(false);
    }
  };

  const q = filter.trim().toLowerCase();
  const filtered = assets.filter((a) =>
    !q
      ? true
      : a.file_name.toLowerCase().includes(q) ||
        (a.alt_text ?? "").toLowerCase().includes(q) ||
        (a.caption ?? "").toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose an image</DialogTitle>
          <DialogDescription>
            Pick from the media library, or upload a new file to use straight away.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search filename, caption, tag…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => void onFiles(e.target.files)}
          />
          <Button variant="outline" onClick={() => fileInput.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {assets.length ? "Nothing matches that search." : "No media uploaded yet."}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {filtered.map((a) => {
                const url = mediaUrl(a.file_path);
                return (
                  <button
                    key={a.id}
                    type="button"
                    title={a.file_name}
                    onClick={() => {
                      onSelect(url);
                      setOpen(false);
                    }}
                    className="group overflow-hidden rounded-md border bg-muted transition-colors hover:border-primary"
                  >
                    <span className="block aspect-square">
                      <SmartImage
                        src={url}
                        alt={a.alt_text ?? a.file_name}
                        width={240}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="block truncate px-1.5 py-1 text-left text-[11px]">
                      {a.file_name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Labelled image field: preview + picker + the underlying URL, still editable
 * by hand for images hosted outside the library.
 */
export const ImageField = ({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  help?: string;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex gap-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
        {value ? (
          <SmartImage src={value} alt="" width={200} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImagePlus className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <Input
          value={value}
          placeholder={`https://…/${MEDIA_BUCKET}/photo.jpg`}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs"
        />
        <div className="flex gap-2">
          <MediaPickerDialog
            onSelect={onChange}
            trigger={
              <Button type="button" variant="outline" size="sm">
                <ImagePlus className="mr-2 h-4 w-4" /> Choose image
              </Button>
            }
          />
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
    </div>
    {help && <p className="text-xs text-muted-foreground">{help}</p>}
  </div>
);

export default MediaPickerDialog;
