import { useRef, useState } from "react";
import { Film, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMediaFiles } from "@/lib/mediaUpload";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isPlayableFile } from "@/lib/videoEmbed";

/** Uploads beyond this are likely to be rejected or painfully slow to load. */
const WARN_BYTES = 50 * 1024 * 1024;

/**
 * Video source for a film tile: upload a file, or paste a YouTube/Vimeo link.
 *
 * Uploaded videos go to the same storage bucket as photographs, so they are
 * managed and deleted in the same place.
 */
export const VideoField = ({
  label = "Video",
  value,
  onChange,
  help,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  help?: string;
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (file.size > WARN_BYTES) {
      toast.warning(
        `${file.name} is ${(file.size / 1048576).toFixed(0)}MB. Large videos are slow for visitors — a compressed web export is better.`,
      );
    }

    setUploading(true);
    const { uploaded, errors } = await uploadMediaFiles([file], user?.id ?? null);
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    errors.forEach((e) => toast.error(e));
    if (uploaded.length) {
      onChange(uploaded[0].url);
      toast.success("Video uploaded");
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && isPlayableFile(value) ? (
        <video
          src={value}
          className="aspect-video w-full rounded-md border bg-black object-contain"
          controls
          preload="metadata"
        />
      ) : null}
      <Input
        value={value}
        placeholder="Paste any YouTube/Vimeo link, or upload a file"
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-xs"
      />
      <div className="flex gap-2">
        <input
          ref={fileInput}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => void onFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Upload video"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        )}
        {!value && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Film className="h-3.5 w-3.5" /> Without a video the tile is just a picture
          </span>
        )}
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
};

export default VideoField;
