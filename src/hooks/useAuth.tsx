import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "editor" | "user";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  roles: AppRole[];
  isAdmin: boolean;
  isEditor: boolean;
  loading: boolean;
  rolesLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  claimFirstAdmin: () => Promise<{ error: string | null; isAdmin: boolean }>;
  refreshRoles: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const lastUserId = useRef<string | null>(null);

  const fetchRoles = useCallback(async (userId: string | null) => {
    if (!userId) {
      setRoles([]);
      return;
    }
    setRolesLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) {
      console.error("Failed to load roles", error);
      setRoles([]);
    } else {
      setRoles((data ?? []).map((r) => r.role as AppRole));
    }
    setRolesLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
      const uid = data.session?.user?.id ?? null;
      lastUserId.current = uid;
      void fetchRoles(uid);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      const uid = newSession?.user?.id ?? null;
      if (uid !== lastUserId.current) {
        lastUserId.current = uid;
        void fetchRoles(uid);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [fetchRoles]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setRoles([]);
  }, []);

  const claimFirstAdmin = useCallback(async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) return { error: error.message, isAdmin: false };
    if (session?.user?.id) await fetchRoles(session.user.id);
    return { error: null, isAdmin: Boolean(data) };
  }, [fetchRoles, session?.user?.id]);

  const refreshRoles = useCallback(async () => {
    await fetchRoles(session?.user?.id ?? null);
  }, [fetchRoles, session?.user?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      roles,
      isAdmin: roles.includes("admin"),
      isEditor: roles.includes("editor") || roles.includes("admin"),
      loading,
      rolesLoading,
      signIn,
      signUp,
      signOut,
      claimFirstAdmin,
      refreshRoles,
    }),
    [session, roles, loading, rolesLoading, signIn, signUp, signOut, claimFirstAdmin, refreshRoles],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
