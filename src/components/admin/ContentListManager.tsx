import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ImageField } from "@/components/admin/MediaPicker";
import VideoField from "@/components/admin/VideoField";
import SmartImage from "@/components/SmartImage";
import { SITE_CONTENT_QUERY_KEY } from "@/lib/siteContent";
import { toast } from "sonner";

type Block = Tables<"bw_site_content">;

export type TextFieldDef = {
  column: "heading" | "subheading" | "cta_label";
  label: string;
  placeholder?: string;
};

/**
 * Manages one repeating section of the site — the home films grid, the photo
 * strip, the Films page — as an ordered list of cards with upload, reorder and
 * delete.
 *
 * These all live in the same `bw_site_content` table, so rather than three
 * near-identical screens the shape of each one is described by props.
 */
export const ContentListManager = ({
  pageKey,
  sectionKey,
  itemNoun,
  textFields = [],
  withImage = true,
  withVideo = false,
  imageLabel = "Image",
  emptyHint,
}: {
  pageKey: string;
  sectionKey: string;
  /** Singular noun used in buttons and messages, e.g. "film". */
  itemNoun: string;
  textFields?: TextFieldDef[];
  withImage?: boolean;
  withVideo?: boolean;
  imageLabel?: string;
  emptyHint?: string;
}) => {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Block | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bw_site_content")
      .select("*")
      .eq("page_key", pageKey)
      .eq("section_key", sectionKey)
      .order("sort_order");
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, sectionKey]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: SITE_CONTENT_QUERY_KEY });

  const patch = (id: string, changes: Partial<Block>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));

  const add = async () => {
    setSaving("new");
    const { data, error } = await supabase
      .from("bw_site_content")
      .insert({
        page_key: pageKey,
        section_key: sectionKey,
        sort_order: (rows.at(-1)?.sort_order ?? -1) + 1,
        published: true,
      })
      .select()
      .single();
    setSaving(null);
    if (error) return toast.error(error.message);
    setRows((prev) => [...prev, data!]);
    void refresh();
  };

  const save = async (row: Block) => {
    setSaving(row.id);
    const { error } = await supabase
      .from("bw_site_content")
      .update({
        heading: row.heading,
        subheading: row.subheading,
        cta_label: row.cta_label,
        cta_href: row.cta_href,
        image_url: row.image_url,
        metadata: row.metadata,
        sort_order: row.sort_order,
        published: row.published,
      })
      .eq("id", row.id);
    setSaving(null);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("Saved — the live site is updated");
  };

  const remove = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("bw_site_content").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    setRows((prev) => prev.filter((r) => r.id !== confirmDelete.id));
    setConfirmDelete(null);
    await refresh();
    toast.success(`${itemNoun[0].toUpperCase()}${itemNoun.slice(1)} deleted`);
  };

  const move = async (row: Block, direction: -1 | 1) => {
    const ordered = [...rows].sort((a, b) => a.sort_order - b.sort_order);
    const index = ordered.findIndex((r) => r.id === row.id);
    const target = ordered[index + direction];
    if (!target) return;
    setSaving(row.id);
    const [a, b] = [row.sort_order, target.sort_order];
    const results = await Promise.all([
      supabase.from("bw_site_content").update({ sort_order: b }).eq("id", row.id),
      supabase.from("bw_site_content").update({ sort_order: a }).eq("id", target.id),
    ]);
    setSaving(null);
    const failed = results.find((r) => r.error);
    if (failed?.error) return toast.error(failed.error.message);
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, sort_order: b } : r.id === target.id ? { ...r, sort_order: a } : r,
      ),
    );
    await refresh();
  };

  const ordered = [...rows].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {ordered.length
            ? `${ordered.length} ${itemNoun}${ordered.length === 1 ? "" : "s"} — shown in this order`
            : emptyHint ?? `No ${itemNoun}s yet.`}
        </p>
        <Button onClick={() => void add()} disabled={saving === "new"}>
          {saving === "new" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add {itemNoun}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {ordered.map((row, i) => (
            <Card key={row.id}>
              <CardContent className="grid gap-4 pt-6 md:grid-cols-[110px_1fr_auto]">
                <div className="h-24 w-full overflow-hidden rounded-md border bg-muted md:w-[110px]">
                  {row.image_url ? (
                    <SmartImage src={row.image_url} alt="" width={240} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {textFields.map((f) => (
                      <div key={f.column} className="space-y-1.5">
                        <Label>{f.label}</Label>
                        <Input
                          value={(row[f.column] as string | null) ?? ""}
                          placeholder={f.placeholder}
                          onChange={(e) => patch(row.id, { [f.column]: e.target.value } as Partial<Block>)}
                        />
                      </div>
                    ))}
                  </div>

                  {withImage && (
                    <ImageField
                      label={imageLabel}
                      value={row.image_url ?? ""}
                      onChange={(url) => patch(row.id, { image_url: url })}
                    />
                  )}

                  {withVideo && (
                    <VideoField
                      value={row.cta_href ?? ""}
                      onChange={(url) => patch(row.id, { cta_href: url })}
                      help="Leave empty for a still image with no play button."
                    />
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={row.published}
                        onCheckedChange={(v) => patch(row.id, { published: v })}
                      />
                      <Label className="text-sm">Visible</Label>
                    </div>
                    <Badge variant="secondary">Position {i + 1}</Badge>
                    <Button size="sm" onClick={() => void save(row)} disabled={saving === row.id}>
                      {saving === row.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  </div>
                </div>

                <div className="flex flex-row gap-1 md:flex-col">
                  <Button size="icon" variant="ghost" title="Move up"
                    disabled={i === 0 || saving === row.id} onClick={() => void move(row, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Move down"
                    disabled={i === ordered.length - 1 || saving === row.id} onClick={() => void move(row, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title={`Delete this ${itemNoun}`}
                    onClick={() => setConfirmDelete(row)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {!ordered.length && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Nothing here yet. Click <strong>Add {itemNoun}</strong> to create the first one.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {itemNoun}?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the website straight away. The photo or video itself stays in
              your media library.
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

export default ContentListManager;
