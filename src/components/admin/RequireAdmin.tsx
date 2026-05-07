import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const FullPageSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { session, loading, rolesLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading || (session && rolesLoading)) return <FullPageSpinner />;
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/admin/login" state={{ unauthorized: true }} replace />;
  return <>{children}</>;
};
