import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LoginPage = () => {
  const { session, isAdmin, loading, rolesLoading, signIn, signUp, claimFirstAdmin, signOut } = useAuth();
  const location = useLocation() as { state?: { unauthorized?: boolean; from?: { pathname?: string } } };
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (location.state?.unauthorized) {
      toast.error("Your account is signed in but doesn't have admin access.");
    }
  }, [location.state?.unauthorized]);

  if (!loading && !rolesLoading && session && isAdmin) {
    const dest = location.state?.from?.pathname ?? "/admin";
    return <Navigate to={dest} replace />;
  }

  const onSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      toast.success("Signed in");
    }
  };

  const onSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signUp(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    toast.success("Account created. If email confirmation is required, check your inbox.");
  };

  const onClaim = async () => {
    setClaiming(true);
    setError(null);
    const { error: err, isAdmin: claimed } = await claimFirstAdmin();
    setClaiming(false);
    if (err) {
      setError(err);
      return;
    }
    if (claimed) {
      toast.success("Admin role granted");
      navigate("/admin", { replace: true });
    } else {
      toast.error("Admin already exists. Ask an existing admin to grant your role.");
    }
  };

  const signedInButNotAdmin = Boolean(session) && !isAdmin && !rolesLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Emotion Canvas Admin</CardTitle>
          <CardDescription>Sign in to manage stories, blog, media, and contacts.</CardDescription>
        </CardHeader>
        <CardContent>
          {signedInButNotAdmin ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  You're signed in as <strong>{session?.user.email}</strong> but don't have admin access.
                  If this is the first admin for this site, you can claim the role now.
                </AlertDescription>
              </Alert>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={onClaim} disabled={claiming} className="w-full">
                {claiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Claim first-admin role
              </Button>
              <Button variant="outline" onClick={signOut} className="w-full">
                Sign out
              </Button>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-4">
                <form onSubmit={onSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={onSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The first user can claim the admin role after signing in.
                    </p>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to site</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
