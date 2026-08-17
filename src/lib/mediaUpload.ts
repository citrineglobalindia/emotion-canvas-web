/**
 * Shared upload path for the media library, used by both Admin → Media and the
 * inline media picker, so an image uploaded from either place lands in the same
 * bucket with the same `bw_media_assets` row.
 */
import { supabase } from "@/integrations/supabase/client";
import { MEDIA_BUCKET } from "@/lib/media";

export type UploadResult = {
  uploaded: { path: string; url: string }[];
  errors: string[];
};

export const uploadMediaFiles = async (
  files: FileList | File[],
  uploadedBy: string | null,
  tags: string[] = [],
): Promise<UploadResult> => {
  const result: UploadResult = { uploaded: [], errors: [] };

  for (const file of Array.from(files)) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const { error: upErr } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
    });
    if (upErr) {
      result.errors.push(`${file.name}: ${upErr.message}`);
      continue;
    }

    const { error: insErr } = await supabase.from("bw_media_assets").insert({
      bucket_id: MEDIA_BUCKET,
      file_name: file.name,
      file_path: path,
      mime_type: file.type,
      file_size: file.size,
      uploaded_by: uploadedBy,
      is_public: true,
      tags,
    });
    if (insErr) {
      // Don't leave an orphaned object behind if the row insert is rejected.
      await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      result.errors.push(`${file.name}: ${insErr.message}`);
      continue;
    }

    result.uploaded.push({
      path,
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl,
    });
  }

  return result;
};
