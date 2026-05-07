import { useEffect, useMemo, useState } from "react";
import { Loader2, Trash2, Mail, Phone, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { format } from "date-fns";

type Submission = Tables<"contact_submissions">;

const STATUSES = ["new", "in_progress", "responded", "archived"] as const;
const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  in_progress: "secondary",
  responded: "outline",
  archived: "outline",
};

const ContactSubmissionsPage = () => {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [active, setActive] = useState<Submission | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<string>("new");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Submission | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!filter.trim()) return true;
      const q = filter.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.message ?? "").toLowerCase().includes(q) ||
        (s.service ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, filter, statusFilter]);

  const openItem = (s: Submission) => {
    setActive(s);
    setEditNotes(s.notes ?? "");
    setEditStatus(s.status);
  };

  const onSave = async () => {
    if (!active) return;
    setSaving(true);
    const { error } = await supabase
      .from("contact_submissions")
      .update({
        notes: editNotes || null,
        status: editStatus,
        responded_at: editStatus === "responded" && !active.responded_at ? new Date().toISOString() : active.responded_at,
      })
      .eq("id", active.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    void load();
    setActive(null);
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setItems((prev) => prev.filter((i) => i.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Contact submissions"
        description="Inquiries from the public contact form."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search name, email, message..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No submissions match.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => openItem(s)}>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(s.created_at), "PP p")}
                </TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-sm">{s.email}</TableCell>
                <TableCell className="text-sm">{s.service ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[s.status] ?? "outline"}>{s.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(s);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.name}</SheetTitle>
                <SheetDescription>
                  Received {format(new Date(active.created_at), "PPpp")}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div className="space-y-1">
                  <a
                    className="flex items-center gap-2 text-foreground hover:underline"
                    href={`mailto:${active.email}`}
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" /> {active.email}
                  </a>
                  {active.phone && (
                    <a
                      className="flex items-center gap-2 text-foreground hover:underline"
                      href={`tel:${active.phone}`}
                    >
                      <Phone className="h-4 w-4 text-muted-foreground" /> {active.phone}
                    </a>
                  )}
                  {active.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {active.location}
                    </div>
                  )}
                </div>
                {active.service && (
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Service</Label>
                    <p className="mt-1">{active.service}</p>
                  </div>
                )}
                {active.message && (
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Message</Label>
                    <p className="mt-1 whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-sm">
                      {active.message}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Internal notes</Label>
                  <Textarea
                    rows={5}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Notes about follow-up, quoted price, next steps..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setActive(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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

export default ContactSubmissionsPage;
