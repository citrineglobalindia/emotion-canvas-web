import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  FileText,
  Layout as LayoutIcon,
  Mail,
  Image as ImageIcon,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/stories", label: "Stories", icon: Film },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/site-content", label: "Site Content", icon: LayoutIcon },
  { to: "/admin/contact", label: "Contact", icon: Mail },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/users", label: "Users", icon: Users },
];

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <button
        type="button"
        className="fixed left-3 top-3 z-50 rounded-md border bg-background p-2 shadow-sm md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-semibold tracking-tight">Emotion Canvas</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t p-3 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View public site
          </a>
          <div className="rounded-md border p-3 text-xs">
            <div className="font-medium text-foreground truncate">{user?.email ?? "—"}</div>
            <div className="text-muted-foreground">Admin</div>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
};
