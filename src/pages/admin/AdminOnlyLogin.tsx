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

    const demoSuccess = login(email, password);
    if (demoSuccess) {
      if (email.toLowerCase().includes("admin")) {
        navigate("/admin", { replace: true });
      } else {
        setError("Ce portail est réservé aux administrateurs");
      }
      return;
    }

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError("Ce portail est réservé aux administrateurs");
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Identifiants incorrects");
      return;
    }

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "#14532d",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="w-full max-w-[440px] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-[#22c55e]" />
            <h1 className="text-2xl font-bold text-white">Administration</h1>
          </div>
          <p className="text-sm text-white/60">Accès réservé aux administrateurs</p>
        </div>

        <div className="bg-white rounded-[var(--radius-xl)] shadow-[0_24px_64px_rgba(0,0,0,0.3)] border border-white/15 p-10 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#4a5e46]">Email</label>
              <Input
                type="email"
                placeholder="admin@mba.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-[#f7f8f5] border-[1.5px] border-[#e4e8df] rounded-[var(--radius-md)] focus:border-[#22c55e] focus:ring-[3px] focus:ring-[rgba(34,197,94,0.15)]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#4a5e46]">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-[#f7f8f5] border-[1.5px] border-[#e4e8df] rounded-[var(--radius-md)] pr-10 focus:border-[#22c55e] focus:ring-[3px] focus:ring-[rgba(34,197,94,0.15)]"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a2318]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-[#dc2626]">{error}</p>}
            <Button type="submit" className="w-full h-12 gap-2 text-[15px]">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#e4e8df]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#9ca3af]">Démo</span>
              </div>
            </div>
            <button
              onClick={() => { setEmail("admin@mba.demo"); setPassword("demo2026"); setError(""); }}
              className="bg-[#f7f8f5] border-[1.5px] border-[#e4e8df] rounded-[var(--radius-md)] p-3 w-full text-left space-y-1 hover:border-[#22c55e] hover:bg-[#f0fdf4] transition-colors"
            >
              <p className="text-xs font-bold text-[#14532d]">Compte Admin démo</p>
              <p className="text-[10px] text-[#9ca3af]">admin@mba.demo</p>
            </button>
            <div className="text-center pt-1">
              <Link to="/client/login" className="inline-flex items-center gap-1.5 text-sm text-[#9ca3af] hover:text-[#22c55e] transition-colors">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
