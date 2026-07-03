import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";

type Row = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

type FormState = {
  name: string;
  role: string;
  quote: string;
  image_url: string;
  published: boolean;
  sort_order: number | string;
};

const EMPTY: FormState = { name: "", role: "", quote: "", image_url: "", published: true, sort_order: 0 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (supabase as any).from("bw_testimonials");

const TestimonialsListPage = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db().select("*").order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };
  useEffect(() => {
    void load();
  }, []);

  const startAdd = () => {
    setForm(EMPTY);
    setEditing("new");
  };
  const startEdit = (r: Row) => {
    setForm({
      name: r.name,
      role: r.role ?? "",
      quote: r.quote,
      image_url: r.image_url ?? "",
      published: r.published,
      sort_order: r.sort_order,
    });
    setEditing(r.id);
  };
  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const save = async () => {
    if (!form.name.trim() || !form.quote.trim()) {
      toast.error("Name and quote are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || null,
      quote: form.quote.trim(),
      image_url: form.image_url.trim() || null,
      published: form.published,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } =
      editing === "new" ? await db().insert(payload) : await db().update(payload).eq("id", editing);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    cancel();
    void load();
  };

  const remove = async (r: Row) => {
    if (!confirm(`Delete testimonial from ${r.name}?`)) return;
    const { error } = await db().delete().eq("id", r.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    setRows((p) => p.filter((x) => x.id !== r.id));
  };

  const togglePublish = async (r: Row) => {
    const { error } = await db().update({ published: !r.published }).eq("id", r.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((p) => p.map((x) => (x.id === r.id ? { ...x, published: !r.published } : x)));
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Client quotes shown on the homepage. Lower sort order appears first."
        actions={
          <Button onClick={startAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add testimonial
          </Button>
        }
      />

      {editing && (
        <div className="mb-6 space-y-4 rounded-lg border bg-background p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Priya & Arjun" />
            </div>
            <div className="space-y-2">
              <Label>Role / Location</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Udaipur" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quote *</Label>
            <Textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label>Image URL (optional)</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="divide-y rounded-md border bg-background">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No testimonials yet. Add your first one.</div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="flex items-start gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  {r.role && <span className="text-xs text-muted-foreground">· {r.role}</span>}
                  <Badge variant={r.published ? "default" : "secondary"}>{r.published ? "Published" : "Hidden"}</Badge>
                  <span className="text-[10px] text-muted-foreground">#{r.sort_order}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.quote}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => togglePublish(r)} title={r.published ? "Hide" : "Publish"}>
                  {r.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => startEdit(r)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(r)} title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsListPage;
