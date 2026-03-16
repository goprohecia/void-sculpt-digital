import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { CompleteProfileDialog } from "@/components/CompleteProfileDialog";
import logoMba from "@/assets/logo-mba.png";
import { useSectorRoleLabels } from "@/hooks/use-sector-role-labels";

export default function AdminLogin() {
  const { clientLabel, employeeLabel } = useSectorRoleLabels();
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

  const fillDemo = (type: "admin" | "client" | "employee" | "superadmin") => {
    const emails = { admin: "admin@mba.demo", client: "client@mba.demo", employee: "employee@mba.demo", superadmin: "superadmin@mba.demo" };
    setEmail(emails[type]);
    setPassword("demo2026");
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "#f0f2ec",
      }}
    >
      <div className="w-full max-w-[400px] space-y-5">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>

        {/* Logo */}
        <div className="text-center space-y-1.5">
          <img src={logoMba} alt="MBA" className="h-20 mx-auto" />
          <p className="text-xs text-[#9ca3af] tracking-wide">My Business Assistant</p>
        </div>

        {/* Verified banner */}
        {verified && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#bbf7d0] bg-white p-3 shadow-sm">
            <CheckCircle className="h-4 w-4 text-[#22c55e] shrink-0" />
            <p className="text-xs text-[#1a2318]">Compte vérifié ! Connectez-vous maintenant.</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#e4e8df] p-7 space-y-4">
          <div className="text-center space-y-0.5">
            <h2 className="text-lg font-bold text-[#1a2318]">Connectez-vous</h2>
            <p className="text-xs text-[#9ca3af]">Accédez à votre espace de gestion</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2.5 h-10 rounded-full border border-[#e4e8df] bg-white hover:shadow-md transition-all text-sm font-medium text-[#1a2318]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e4e8df]" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-white px-2 text-[#9ca3af]">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4a5e46]">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4a5e46]">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 text-sm bg-[#f7f8f5] border border-[#e4e8df] rounded-lg pr-9 focus:border-[#22c55e] focus:ring-2 focus:ring-[rgba(34,197,94,0.12)]"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a2318]">
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-[10px] text-[#9ca3af] hover:text-[#22c55e] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
            {error && <p className="text-xs text-[#dc2626]">{error}</p>}
            <Button type="submit" className="w-full h-10 gap-2 text-sm rounded-xl">
              <LogIn className="h-3.5 w-3.5" />
              Se connecter
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="space-y-2.5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#e4e8df]" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-white px-2 text-[#9ca3af]">Comptes de démonstration</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { type: "admin" as const, label: "Admin", email: "admin@mba.demo" },
                { type: "employee" as const, label: employeeLabel, email: "employee@mba.demo" },
                { type: "client" as const, label: clientLabel, email: "client@mba.demo" },
                { type: "superadmin" as const, label: "Super Admin", email: "superadmin@mba.demo" },
              ]).map((d) => (
                <button key={d.type} onClick={() => fillDemo(d.type)} className="bg-[#f7f8f5] border border-[#e4e8df] rounded-lg p-2.5 text-left hover:border-[#22c55e] hover:bg-[#f0fdf4] transition-colors">
                  <p className="text-[11px] font-bold text-[#14532d]">{d.label}</p>
                  <p className="text-[9px] text-[#9ca3af]">{d.email}</p>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-[#9ca3af]">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-[#22c55e] hover:underline font-medium">Créer un compte</Link>
            </p>
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
