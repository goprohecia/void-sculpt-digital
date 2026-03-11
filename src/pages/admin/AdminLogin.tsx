import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Eye, EyeOff, CheckCircle } from "lucide-react";
import { CompleteProfileDialog } from "@/components/CompleteProfileDialog";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [googleUserId, setGoogleUserId] = useState("");
  const { login, isAuthenticated, user } = useDemoAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verified = searchParams.get("verified") === "1";

  useEffect(() => {
    if (isAuthenticated) {
      const dest = user?.role === "superadmin" ? "/superadmin" : user?.role === "employee" ? "/employee" : user?.role === "client" ? "/client" : "/admin";
      navigate(dest, { replace: true });
      return;
    }
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nom")
          .eq("user_id", session.user.id)
          .single();

        if (profile && (!profile.nom || profile.nom === "")) {
          setGoogleUserId(session.user.id);
          setShowCompleteProfile(true);
        } else {
          navigate("/client", { replace: true });
        }
      }
    };
    checkSession();
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const demoSuccess = login(email, password);
    if (demoSuccess) {
      const low = email.toLowerCase();
      const dest = low.includes("superadmin") ? "/superadmin" : low.includes("employee") ? "/employee" : low.includes("client") ? "/client" : "/admin";
      navigate(dest, { replace: true });
      return;
      return;
    }

    if (email.toLowerCase() === "admin@mybusinessassistant.com") {
      setError("Ce compte est réservé à l'espace administrateur");
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Identifiants incorrects");
      return;
    }

    if (data.user) {
      navigate("/client", { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/client/login",
    });
    if (error) {
      setError("Erreur lors de la connexion avec Google");
    }
  };

  const fillDemo = (type: "admin" | "client" | "employee") => {
    const emails = { admin: "admin@mba.demo", client: "client@mba.demo", employee: "employee@mba.demo" };
    setEmail(emails[type]);
    setPassword("demo2026");
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "hsl(90 14% 95%)",
        backgroundImage: "radial-gradient(circle, hsl(142 72% 42% / 0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-[440px] space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-mba-green-500 to-mba-green-900 bg-clip-text text-transparent">
            MBA
          </h1>
          <p className="text-sm text-muted-foreground">My Business Assistant</p>
        </div>

        {/* Verified banner */}
        {verified && (
          <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-mba-green-100 bg-mba-green-50 p-4">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">Votre compte a été vérifié avec succès ! Vous pouvez maintenant vous connecter.</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-card rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] border border-border p-8 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Connectez-vous</h2>
            <p className="text-sm text-muted-foreground">Accédez à votre espace de gestion</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-[var(--radius-xl)] border border-border bg-card hover:shadow-[var(--shadow-md)] transition-all text-sm font-medium text-foreground"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-secondary border-border rounded-[var(--radius-md)] focus:border-primary focus:ring-primary/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-secondary border-border rounded-[var(--radius-md)] pr-10 focus:border-primary focus:ring-primary/10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
            <Button type="submit" className="w-full h-11 gap-2">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Comptes de démonstration</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => fillDemo("admin")} className="bg-secondary border border-border rounded-[var(--radius-md)] p-3 text-left space-y-1 hover:border-primary transition-colors">
                <p className="text-xs font-semibold text-primary">Admin</p>
                <p className="text-[10px] text-muted-foreground">admin@mba.demo</p>
              </button>
              <button onClick={() => fillDemo("employee")} className="bg-secondary border border-border rounded-[var(--radius-md)] p-3 text-left space-y-1 hover:border-primary transition-colors">
                <p className="text-xs font-semibold text-primary">Salarié</p>
                <p className="text-[10px] text-muted-foreground">employee@mba.demo</p>
              </button>
              <button onClick={() => fillDemo("client")} className="bg-secondary border border-border rounded-[var(--radius-md)] p-3 text-left space-y-1 hover:border-primary transition-colors">
                <p className="text-xs font-semibold text-primary">Client</p>
                <p className="text-[10px] text-muted-foreground">client@mba.demo</p>
              </button>
              <button onClick={() => { setEmail("superadmin@mba.demo"); setPassword("demo2026"); setError(""); }} className="bg-secondary border border-border rounded-[var(--radius-md)] p-3 text-left space-y-1 hover:border-primary transition-colors">
                <p className="text-xs font-semibold text-primary">Super Admin</p>
                <p className="text-[10px] text-muted-foreground">superadmin@mba.demo</p>
              </button>
            </div>
            <div className="text-center pt-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">Créer un compte client</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <CompleteProfileDialog
        open={showCompleteProfile}
        userId={googleUserId}
        onComplete={() => {
          setShowCompleteProfile(false);
          navigate("/client", { replace: true });
        }}
      />
    </div>
  );
}
