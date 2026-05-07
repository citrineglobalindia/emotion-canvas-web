import { useEffect, useMemo, useState } from "react";
import { Loader2, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Profile = Tables<"profiles">;
type RoleRow = Tables<"user_roles">;
type AppRole = "admin" | "editor" | "user";

const ROLES: AppRole[] = ["admin", "editor", "user"];

const UsersPage = () => {
  const { user: me } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, AppRole[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [addRole, setAddRole] = useState<Record<string, AppRole>>({});

  const load = async () => {
    setLoading(true);
    const [{ data: profs, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    if (pErr) toast.error(pErr.message);
    if (rErr) toast.error(rErr.message);
    setProfiles(profs ?? []);
    const map: Record<string, AppRole[]> = {};
    for (const r of (roles ?? []) as RoleRow[]) {
      const arr = map[r.user_id] ?? [];
      arr.push(r.role as AppRole);
      map[r.user_id] = arr;
    }
    setRolesByUser(map);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (!filter.trim()) return true;
      const q = filter.toLowerCase();
      return (
        (p.username ?? "").toLowerCase().includes(q) ||
        (p.display_name ?? "").toLowerCase().includes(q) ||
        p.user_id.toLowerCase().includes(q)
      );
    });
  }, [profiles, filter]);

  const grantRole = async (userId: string, role: AppRole) => {
    if ((rolesByUser[userId] ?? []).includes(role)) {
      return toast.message("User already has this role");
    }
    setBusy(`${userId}:${role}`);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    setRolesByUser((prev) => ({ ...prev, [userId]: [...(prev[userId] ?? []), role] }));
  };

  const revokeRole = async (userId: string, role: AppRole) => {
    if (userId === me?.id && role === "admin") {
      const remainingAdmins = Object.values(rolesByUser).filter((roles) => roles.includes("admin")).length;
      if (remainingAdmins <= 1) return toast.error("Can't remove the last admin");
      if (!confirm("Revoke your own admin role? You'll be locked out of the panel.")) return;
    }
    setBusy(`${userId}:${role}`);
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Revoked ${role}`);
    setRolesByUser((prev) => ({ ...prev, [userId]: (prev[userId] ?? []).filter((r) => r !== role) }));
  };

  return (
    <div>
      <PageHeader
        title="Users & roles"
        description="Profiles auto-create on first sign-in (where applicable). Grant the admin role to allow panel access."
      />
      <div className="mb-4">
        <Input
          placeholder="Search username, display name, user id..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-[260px]">Grant role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                  No users found. (Profile rows are created when users self-register or you provision them.)
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => {
              const userRoles = rolesByUser[p.user_id] ?? [];
              const pickedRole = addRole[p.user_id] ?? "editor";
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.display_name || p.username}</div>
                    <div className="text-xs text-muted-foreground">@{p.username}</div>
                    <div className="font-mono text-[10px] text-muted-foreground/70">{p.user_id}</div>
                    {p.user_id === me?.id && (
                      <Badge variant="outline" className="mt-1">You</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {userRoles.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {userRoles.map((r) => (
                          <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="gap-1">
                            <Shield className="h-3 w-3" /> {r}
                            <button
                              className="ml-1 text-xs opacity-70 hover:opacity-100"
                              onClick={() => revokeRole(p.user_id, r)}
                              disabled={busy === `${p.user_id}:${r}`}
                              title={`Revoke ${r}`}
                            >
                              {busy === `${p.user_id}:${r}` ? "…" : "×"}
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={pickedRole}
                        onValueChange={(v) => setAddRole((prev) => ({ ...prev, [p.user_id]: v as AppRole }))}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => grantRole(p.user_id, pickedRole)}
                        disabled={busy === `${p.user_id}:${pickedRole}` || userRoles.includes(pickedRole)}
                      >
                        {busy === `${p.user_id}:${pickedRole}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldOff className="mr-2 h-4 w-4" />
                        )}
                        Grant
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;
