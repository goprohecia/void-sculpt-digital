// [MBA] Séparation Superadmin — page de connexion dédiée
// URL: /superadmin/login — non visible dans l'UI utilisateur
// Seule l'équipe MBA connaît cette URL
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoAuth } from "@/contexts/DemoAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Eye, EyeOff, Shield } from "lucide-react";
import logoMba from "@/assets/logo-mba.png";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, user } = useDemoAuth();
  const navigate = useNavigate();

  if (isAuthenticated && user?.role === "superadmin") {
    navigate("/superadmin", { replace: true });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      if (email.toLowerCase().includes("superadmin")) {
        navigate("/superadmin", { replace: true });
      } else {
        setError("Accès réservé à l'administration MBA");
      }
    } else {
      setError("Identifiants incorrects");
    }
  };

  const fillDemo = () => {
    setEmail("superadmin@mba.demo");
    setPassword("demo2026");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="w-full max-w-sm space-y-6">
        {/* [MBA] Séparation Superadmin — design sobre et distinct */}
        <div className="text-center space-y-2">
          <img src={logoMba} alt="MBA" className="h-12 mx-auto opacity-80" />
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">Administration</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Email</label>
              <Input
                type="email"
                placeholder="admin@mybusinessassistant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Mot de passe</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-sm bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600 pr-9 focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" className="w-full h-10 gap-2 text-sm bg-green-700 hover:bg-green-600 text-white">
              <LogIn className="h-3.5 w-3.5" /> Se connecter
            </Button>
          </form>

          {/* [MBA] Compte démo superadmin */}
          <div className="pt-3 border-t border-gray-800">
            <button onClick={fillDemo} className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-left hover:border-green-700 transition-colors">
              <p className="text-[11px] font-medium text-gray-300">Compte démo</p>
              <p className="text-[9px] text-gray-500">superadmin@mba.demo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
