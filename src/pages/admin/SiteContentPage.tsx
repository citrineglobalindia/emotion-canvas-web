import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown, ChevronUp, Loader2, Plus, RotateCcw, Save, Trash2, ArrowDown, ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageField } from "@/components/admin/MediaPicker";
import {
  CONTENT_SCHEMA, findSectionDef, type FieldDef, type SectionDef,
} from "@/lib/contentSchema";
import { SITE_CONTENT_QUERY_KEY } from "@/lib/siteContent";
import { toast } from "sonner";
import SmartImage from "@/components/SmartImage";

type Block = Tables<"bw_site_content">;
type Meta = Record<string, string>;

const COLUMN_LABELS: Record<string, string> = {
  heading: "Heading",
  subheading: "Subheading",
  body: "Body",
  image_url: "Image",
  cta_label: "Button label",
  cta_href: "Button link",
};

const asMeta = (value: Block["metadata"]): Meta => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, v == null ? "" : String(v)]),
  );
};

const SiteContentPage = () => {
  const queryClient = useQueryClient();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<Block | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bw_site_content")
      .select("*")
      .order("page_key")
      .order("section_key")
      .order("sort_order");
    if (error) toast.error(error.message);
    setBlocks(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  /** Public pages cache site content — drop that cache after any write. */
  const refreshPublicSite = () =>
    queryClient.invalidateQueries({ queryKey: SITE_CONTENT_QUERY_KEY });

  const updateLocal = (id: string, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const onSaveBlock = async (b: Block) => {
    setSaving(b.id);
    const { error } = await supabase
      .from("bw_site_content")
      .update({
        page_key: b.page_key,
        section_key: b.section_key,
        heading: b.heading,
        subheading: b.subheading,
        body: b.body,
        image_url: b.image_url,
        cta_label: b.cta_label,
        cta_href: b.cta_href,
        metadata: b.metadata,
        sort_order: b.sort_order,
        published: b.published,
      })
      .eq("id", b.id);
    setSaving(null);
    if (error) return toast.error(error.message);
    await refreshPublicSite();
    toast.success("Saved — the live site is updated");
  };

  const createBlock = async (
    pageKey: string,
    sectionKey: string,
    def: SectionDef | undefined,
    withDefaults: boolean,
    sortOrder = 0,
  ) => {
    const key = `${pageKey}.${sectionKey}.new`;
    setBusy(key);
    const d = withDefaults ? def?.defaults : undefined;
    const insert: TablesInsert<"bw_site_content"> = {
      page_key: pageKey,
      section_key: sectionKey,
      heading: d?.heading ?? null,
      subheading: d?.subheading ?? null,
      body: d?.body ?? null,
      image_url: d?.image ?? null,
      cta_label: d?.ctaLabel ?? null,
      cta_href: d?.ctaHref ?? null,
      metadata: d?.meta ?? {},
      sort_order: sortOrder,
      published: true,
    };
    const { data, error } = await supabase
      .from("bw_site_content")
      .insert(insert)
      .select()
      .single();
    setBusy(null);
    if (error) return toast.error(error.message);
    setBlocks((prev) => [...prev, data!]);
    setExpanded((prev) => ({ ...prev, [data!.id]: true }));
    await refreshPublicSite();
    toast.success("Section created");
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("bw_site_content").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    setBlocks((prev) => prev.filter((b) => b.id !== confirmDelete.id));
    setConfirmDelete(null);
    await refreshPublicSite();
    toast.success("Removed — that section falls back to the built-in design");
  };

  const move = async (row: Block, siblings: Block[], direction: -1 | 1) => {
    const ordered = [...siblings].sort((a, b) => a.sort_order - b.sort_order);
    const index = ordered.findIndex((b) => b.id === row.id);
    const target = ordered[index + direction];
    if (!target) return;
    setBusy(row.id);
    const [a, b] = [row.sort_order, target.sort_order];
    const results = await Promise.all([
      supabase.from("bw_site_content").update({ sort_order: b }).eq("id", row.id),
      supabase.from("bw_site_content").update({ sort_order: a }).eq("id", target.id),
    ]);
    setBusy(null);
    const failed = results.find((r) => r.error);
    if (failed?.error) return toast.error(failed.error.message);
    setBlocks((prev) =>
      prev.map((x) =>
        x.id === row.id ? { ...x, sort_order: b } : x.id === target.id ? { ...x, sort_order: a } : x,
      ),
    );
    await refreshPublicSite();
  };

  /** Rows whose page/section pair is not in the schema — legacy or hand-made. */
  const unknownBlocks = useMemo(
    () => blocks.filter((b) => !findSectionDef(b.page_key, b.section_key)),
    [blocks],
  );

  const renderField = (block: Block, field: FieldDef) => {
    const value = (block[field.name] as string | null) ?? "";
    const label = field.label ?? COLUMN_LABELS[field.name] ?? field.name;

    if (field.type === "image") {
      return (
        <div key={field.name} className="md:col-span-2">
          <ImageField
            label={label}
            value={value}
            help={field.help}
            onChange={(url) => updateLocal(block.id, { [field.name]: url } as Partial<Block>)}
          />
        </div>
      );
    }

    const isLong = field.type === "textarea";
    return (
      <div key={field.name} className={`space-y-2 ${isLong ? "md:col-span-2" : ""}`}>
        <Label>{label}</Label>
        {isLong ? (
          <Textarea
            rows={5}
            value={value}
            onChange={(e) => updateLocal(block.id, { [field.name]: e.target.value } as Partial<Block>)}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => updateLocal(block.id, { [field.name]: e.target.value } as Partial<Block>)}
          />
        )}
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </div>
    );
  };

  const renderMetaFields = (block: Block, def: SectionDef) => {
    if (!def.meta?.length) return null;
    const meta = asMeta(block.metadata);
    return def.meta.map((m) => (
      <div key={m.name} className="space-y-2">
        <Label>{m.label}</Label>
        <Input
          value={meta[m.name] ?? ""}
          onChange={(e) =>
            updateLocal(block.id, { metadata: { ...meta, [m.name]: e.target.value } })
          }
        />
        {m.help && <p className="text-xs text-muted-foreground">{m.help}</p>}
      </div>
    ));
  };

  const blockForm = (block: Block, def: SectionDef | undefined, siblings: Block[]) => (
    <CardContent className="grid gap-4 border-t pt-4 md:grid-cols-2">
      {def
        ? def.fields.map((f) => renderField(block, f))
        : (["heading", "subheading", "body", "image_url", "cta_label", "cta_href"] as const).map(
            (name) =>
              renderField(block, {
                name,
                label: COLUMN_LABELS[name],
                type: name === "body" ? "textarea" : name === "image_url" ? "image" : "text",
              }),
          )}
      {def && renderMetaFields(block, def)}

      <div className="flex items-center gap-3">
        <Switch
          checked={block.published}
          onCheckedChange={(v) => updateLocal(block.id, { published: v })}
        />
        <Label>Visible on the site</Label>
      </div>

      {def?.list && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy === block.id}
            onClick={() => void move(block, siblings, -1)}
          >
            <ArrowUp className="mr-1 h-4 w-4" /> Move up
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy === block.id}
            onClick={() => void move(block, siblings, 1)}
          >
            <ArrowDown className="mr-1 h-4 w-4" /> Move down
          </Button>
        </div>
      )}

      <div className="md:col-span-2">
        <Button onClick={() => void onSaveBlock(block)} disabled={saving === block.id}>
          {saving === block.id ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </CardContent>
  );

  const blockCard = (
    block: Block,
    def: SectionDef | undefined,
    siblings: Block[],
    title: string,
    subtitle?: string,
  ) => {
    const isOpen = !!expanded[block.id];
    return (
      <Card key={block.id}>
        <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
          <button
            type="button"
            className="flex flex-1 items-center gap-3 text-left"
            onClick={() => setExpanded((prev) => ({ ...prev, [block.id]: !prev[block.id] }))}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {block.image_url && (
              <SmartImage
                src={block.image_url}
                alt=""
                width={72}
                className="h-9 w-9 shrink-0 rounded object-cover"
              />
            )}
            <div className="min-w-0">
              <div className="truncate font-medium">{title}</div>
              {subtitle && (
                <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
              )}
            </div>
            <Badge variant={block.published ? "default" : "secondary"} className="ml-auto shrink-0">
              {block.published ? "Live" : "Hidden"}
            </Badge>
          </button>
          <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(block)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </CardHeader>
        {isOpen && blockForm(block, def, siblings)}
      </Card>
    );
  };

  return (
    <div>
      <PageHeader
        title="Site content"
        description="Every editable section of the public website. Anything you don't set here keeps the original design."
      />

      {loading && (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && (
        <div className="space-y-10">
          {CONTENT_SCHEMA.map((page) => (
            <div key={page.key}>
              <div className="mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {page.label}
                </h2>
                {page.help && <p className="text-xs text-muted-foreground">{page.help}</p>}
              </div>

              <div className="space-y-4">
                {page.sections.map((def) => {
                  const rows = blocks
                    .filter((b) => b.page_key === page.key && b.section_key === def.key)
                    .sort((a, b) => a.sort_order - b.sort_order);

                  if (def.list) {
                    return (
                      <div key={def.key} className="rounded-lg border p-3">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium">{def.label}</div>
                            {def.help && (
                              <p className="text-xs text-muted-foreground">{def.help}</p>
                            )}
                            {!rows.length && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                Nothing added — the site shows its built-in items.
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy === `${page.key}.${def.key}.new`}
                            onClick={() =>
                              void createBlock(
                                page.key,
                                def.key,
                                def,
                                false,
                                (rows.at(-1)?.sort_order ?? -1) + 1,
                              )
                            }
                          >
                            <Plus className="mr-1 h-4 w-4" /> Add item
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {rows.map((row) =>
                            blockCard(
                              row,
                              def,
                              rows,
                              row.heading?.trim() || row.subheading?.trim() || "Untitled item",
                              `Position ${row.sort_order}`,
                            ),
                          )}
                        </div>
                      </div>
                    );
                  }

                  const row = rows[0];
                  if (!row) {
                    return (
                      <Card key={def.key}>
                        <CardHeader className="flex flex-row items-center justify-between gap-3 py-3">
                          <div>
                            <div className="font-medium">{def.label}</div>
                            <p className="text-xs text-muted-foreground">
                              {def.help ? `${def.help} ` : ""}Currently showing the built-in design.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            disabled={busy === `${page.key}.${def.key}.new`}
                            onClick={() => void createBlock(page.key, def.key, def, true)}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Edit this section
                          </Button>
                        </CardHeader>
                      </Card>
                    );
                  }

                  return blockCard(row, def, rows, def.label, def.help);
                })}
              </div>
            </div>
          ))}

          {unknownBlocks.length > 0 && (
            <div>
              <div className="mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Other blocks
                </h2>
                <p className="text-xs text-muted-foreground">
                  Content rows that don't match any section on the site. They are stored but not
                  displayed anywhere — safe to delete unless you added them deliberately.
                </p>
              </div>
              <div className="space-y-2">
                {unknownBlocks.map((b) =>
                  blockCard(b, undefined, unknownBlocks, `${b.page_key} / ${b.section_key}`, b.heading ?? undefined),
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this content?</AlertDialogTitle>
            <AlertDialogDescription>
              {findSectionDef(confirmDelete?.page_key ?? "", confirmDelete?.section_key ?? "")
                ? "The section will go back to the design's built-in content. You can edit it again at any time."
                : `${confirmDelete?.page_key}/${confirmDelete?.section_key} will be permanently removed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              <RotateCcw className="mr-2 h-4 w-4" /> Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SiteContentPage;
