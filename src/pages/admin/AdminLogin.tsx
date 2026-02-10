import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Eye, EyeOff, Home } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";
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

  // Check if returning from Google OAuth with incomplete profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "client" ? "/client" : "/admin", { replace: true });
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
      const account = email.toLowerCase().includes("client") ? "/client" : "/admin";
      navigate(account, { replace: true });
      return;
    }

    // Block admin email from client login
    if (email.toLowerCase() === "studio@impartialgames.com") {
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

  const fillDemo = (type: "admin" | "client") => {
    setEmail(type === "admin" ? "admin@impartial.demo" : "client@impartial.demo");
    setPassword("demo2026");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link to="/">
            <img src={logoHero} alt="Impartial" className="h-14 w-auto mx-auto drop-shadow-[0_0_10px_rgba(139,92,246,0.4)] hover:scale-105 transition-transform cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold">Back-office Impartial</h1>
        </div>

        {/* Form */}
        <div className="glass-card p-8 space-y-5">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-medium"
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
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input border-0 h-11" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input border-0 h-11 pr-10" required />
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
              <button onClick={() => fillDemo("admin")} className="glass-button p-3 text-left space-y-1 hover:border-primary/30">
                <p className="text-xs font-semibold text-primary">Admin</p>
                <p className="text-[10px] text-muted-foreground">admin@impartial.demo</p>
              </button>
              <button onClick={() => fillDemo("client")} className="glass-button p-3 text-left space-y-1 hover:border-primary/30">
                <p className="text-xs font-semibold text-neon-blue">Client</p>
                <p className="text-[10px] text-muted-foreground">client@impartial.demo</p>
              </button>
            </div>
            <div className="text-center pt-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">Créer un compte client</Link>
              </p>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-3.5 w-3.5" />
                Retour à l'accueil
              </Link>
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
