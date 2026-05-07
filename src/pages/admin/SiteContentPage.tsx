import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";

type Block = Tables<"site_content">;

const SiteContentPage = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<Block | null>(null);

  const [creating, setCreating] = useState(false);
  const [newBlock, setNewBlock] = useState<Partial<Block>>({
    page_key: "",
    section_key: "",
    heading: "",
    sort_order: 0,
    published: true,
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("page_key")
      .order("sort_order")
      .order("section_key");
    if (error) toast.error(error.message);
    setBlocks(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const grouped = useMemo(() => {
    const m = new Map<string, Block[]>();
    for (const b of blocks) {
      const arr = m.get(b.page_key) ?? [];
      arr.push(b);
      m.set(b.page_key, arr);
    }
    return Array.from(m.entries());
  }, [blocks]);

  const updateLocal = (id: string, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const onSaveBlock = async (b: Block) => {
    setSaving(b.id);
    const { error } = await supabase
      .from("site_content")
      .update({
        page_key: b.page_key,
        section_key: b.section_key,
        heading: b.heading,
        subheading: b.subheading,
        body: b.body,
        image_url: b.image_url,
        cta_label: b.cta_label,
        cta_href: b.cta_href,
        sort_order: b.sort_order,
        published: b.published,
      })
      .eq("id", b.id);
    setSaving(null);
    if (error) return toast.error(error.message);
    toast.success("Block saved");
  };

  const onCreate = async () => {
    if (!newBlock.page_key?.trim() || !newBlock.section_key?.trim()) {
      return toast.error("page_key and section_key are required");
    }
    const insert: TablesInsert<"site_content"> = {
      page_key: newBlock.page_key!,
      section_key: newBlock.section_key!,
      heading: newBlock.heading || null,
      sort_order: Number(newBlock.sort_order) || 0,
      published: newBlock.published ?? true,
    };
    const { data, error } = await supabase.from("site_content").insert(insert).select().single();
    if (error) return toast.error(error.message);
    toast.success("Block created");
    setBlocks((prev) => [...prev, data!]);
    setExpanded((prev) => ({ ...prev, [data!.id]: true }));
    setCreating(false);
    setNewBlock({ page_key: "", section_key: "", heading: "", sort_order: 0, published: true });
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("site_content").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Block deleted");
    setBlocks((prev) => prev.filter((b) => b.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Site content"
        description="Editable content blocks scoped by page and section keys."
        actions={
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New content block</DialogTitle>
                <DialogDescription>
                  Each block is identified by <code>page_key</code> + <code>section_key</code>.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="pk">Page key</Label>
                    <Input
                      id="pk"
                      placeholder="home"
                      value={newBlock.page_key ?? ""}
                      onChange={(e) => setNewBlock((p) => ({ ...p, page_key: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sk">Section key</Label>
                    <Input
                      id="sk"
                      placeholder="hero"
                      value={newBlock.section_key ?? ""}
                      onChange={(e) => setNewBlock((p) => ({ ...p, section_key: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heading">Heading</Label>
                  <Input
                    id="heading"
                    value={newBlock.heading ?? ""}
                    onChange={(e) => setNewBlock((p) => ({ ...p, heading: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort order</Label>
                  <Input
                    id="sort"
                    type="number"
                    value={newBlock.sort_order ?? 0}
                    onChange={(e) => setNewBlock((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
                <Button onClick={onCreate}>Create</Button>
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

      {!loading && blocks.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No blocks yet. Click <strong>New block</strong> to add the first one.
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {grouped.map(([pageKey, items]) => (
          <div key={pageKey}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {pageKey}
            </h2>
            <div className="space-y-2">
              {items.map((b) => {
                const isOpen = !!expanded[b.id];
                return (
                  <Card key={b.id}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
                      <button
                        type="button"
                        className="flex flex-1 items-center gap-3 text-left"
                        onClick={() => setExpanded((prev) => ({ ...prev, [b.id]: !prev[b.id] }))}
                      >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <div>
                          <div className="font-medium">{b.section_key}</div>
                          <div className="text-xs text-muted-foreground">
                            {b.heading || "—"}{" "}
                            <span className="ml-2 text-muted-foreground/70">order: {b.sort_order}</span>
                          </div>
                        </div>
                        <Badge variant={b.published ? "default" : "secondary"} className="ml-auto">
                          {b.published ? "Published" : "Hidden"}
                        </Badge>
                      </button>
                      <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(b)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="grid gap-3 border-t pt-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Page key</Label>
                          <Input value={b.page_key} onChange={(e) => updateLocal(b.id, { page_key: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Section key</Label>
                          <Input
                            value={b.section_key}
                            onChange={(e) => updateLocal(b.id, { section_key: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Heading</Label>
                          <Input
                            value={b.heading ?? ""}
                            onChange={(e) => updateLocal(b.id, { heading: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Subheading</Label>
                          <Input
                            value={b.subheading ?? ""}
                            onChange={(e) => updateLocal(b.id, { subheading: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Body</Label>
                          <Textarea
                            rows={5}
                            value={b.body ?? ""}
                            onChange={(e) => updateLocal(b.id, { body: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Image URL</Label>
                          <Input
                            value={b.image_url ?? ""}
                            onChange={(e) => updateLocal(b.id, { image_url: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA label</Label>
                          <Input
                            value={b.cta_label ?? ""}
                            onChange={(e) => updateLocal(b.id, { cta_label: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA href</Label>
                          <Input
                            value={b.cta_href ?? ""}
                            onChange={(e) => updateLocal(b.id, { cta_href: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Sort order</Label>
                          <Input
                            type="number"
                            value={b.sort_order}
                            onChange={(e) => updateLocal(b.id, { sort_order: Number(e.target.value) })}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={b.published}
                            onCheckedChange={(v) => updateLocal(b.id, { published: v })}
                          />
                          <Label>Published</Label>
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={() => onSaveBlock(b)} disabled={saving === b.id}>
                            {saving === b.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save block
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this block?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete?.page_key}/{confirmDelete?.section_key} will be permanently removed.
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

export default SiteContentPage;
