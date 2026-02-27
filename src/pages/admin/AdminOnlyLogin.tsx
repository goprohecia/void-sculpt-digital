import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Eye, EyeOff, Shield } from "lucide-react";

const ADMIN_EMAIL = "admin@mybusinessassistant.com";

export default function AdminOnlyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, user } = useDemoAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Try demo auth first
    const demoSuccess = login(email, password);
    if (demoSuccess) {
      if (email.toLowerCase().includes("admin")) {
        navigate("/admin", { replace: true });
      } else {
        setError("Ce portail est réservé aux administrateurs");
      }
      return;
    }

    // 2. Check email matches admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError("Ce portail est réservé aux administrateurs");
      return;
    }

    // 3. Try real Supabase auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Identifiants incorrects");
      return;
    }

    // 4. Verify admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      setError("Ce portail est réservé aux administrateurs");
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Administration</h1>
          </div>
          <p className="text-sm text-muted-foreground">Accès réservé aux administrateurs</p>
        </div>

        <div className="glass-card p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="admin@mba.demo" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input border-0 h-11" required />
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
            <Button type="submit" className="w-full h-11 gap-2">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Démo</span>
              </div>
            </div>
            <button
              onClick={() => { setEmail("admin@mba.demo"); setPassword("demo2026"); setError(""); }}
              className="glass-button p-3 w-full text-left space-y-1 hover:border-primary/30"
            >
              <p className="text-xs font-semibold text-primary">Compte Admin démo</p>
              <p className="text-[10px] text-muted-foreground">admin@mba.demo</p>
            </button>
            <div className="text-center pt-1">
              <Link to="/client/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
