import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, user } = useDemoAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate(user?.role === "client" ? "/client" : "/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Try demo login first
    const demoSuccess = login(email, password);
    if (demoSuccess) {
      const account = email.toLowerCase().includes("client") ? "/client" : "/admin";
      navigate(account, { replace: true });
      return;
    }

    // Try Supabase auth
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

  const fillDemo = (type: "admin" | "client") => {
    setEmail(type === "admin" ? "admin@impartial.demo" : "client@impartial.demo");
    setPassword("demo2026");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 neon-glow-violet">
            <span className="text-xl font-bold text-primary">IM</span>
          </div>
          <h1 className="text-2xl font-bold">Back-office Impartial</h1>
          <p className="text-muted-foreground text-sm">Connexion à l'espace d'administration</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input border-0 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input border-0 h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 gap-2">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Comptes de démonstration</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillDemo("admin")}
                className="glass-button p-3 text-left space-y-1 hover:border-primary/30"
              >
                <p className="text-xs font-semibold text-primary">Admin</p>
                <p className="text-[10px] text-muted-foreground">admin@impartial.demo</p>
              </button>
              <button
                onClick={() => fillDemo("client")}
                className="glass-button p-3 text-left space-y-1 hover:border-primary/30"
              >
                <p className="text-xs font-semibold text-neon-blue">Client</p>
                <p className="text-[10px] text-muted-foreground">client@impartial.demo</p>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Créer un compte client
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
