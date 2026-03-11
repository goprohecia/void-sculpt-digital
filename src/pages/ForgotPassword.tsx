import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || email.length > 255) {
      setError("Email invalide");
      return;
    }

    setLoading(true);
    try {
      const res = await supabase.functions.invoke("send-password-reset", {
        body: { email: email.trim().toLowerCase() },
      });

      if (res.error) {
        setError("Une erreur est survenue. Veuillez réessayer.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: "#14532d",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="w-full max-w-[440px] space-y-6 text-center">
          <h2 className="text-xl font-bold text-white">My Business Assistant</h2>
          <div className="bg-white rounded-[var(--radius-xl)] shadow-[0_24px_64px_rgba(0,0,0,0.3)] border border-white/15 p-10 space-y-4">
            <CheckCircle className="h-12 w-12 text-[#22c55e] mx-auto" />
            <h2 className="text-xl font-bold text-[#1a2318]">Email envoyé !</h2>
            <p className="text-[#9ca3af] text-sm">
              Si un compte existe avec l'adresse <strong className="text-[#1a2318]">{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants.
            </p>
            <p className="text-[#9ca3af] text-xs">Pensez à vérifier vos spams.</p>
            <Link to="/client/login" className="inline-flex items-center gap-1.5 text-sm text-[#22c55e] hover:underline font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
          <p className="text-white/60 text-sm">Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>

        <div className="bg-white rounded-[var(--radius-xl)] shadow-[0_24px_64px_rgba(0,0,0,0.3)] border border-white/15 p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#4a5e46]">Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-[#f7f8f5] border-[1.5px] border-[#e4e8df] rounded-[var(--radius-md)] focus:border-[#22c55e] focus:ring-[3px] focus:ring-[rgba(34,197,94,0.15)]"
                required
                maxLength={255}
              />
            </div>
            {error && <p className="text-sm text-[#dc2626]">{error}</p>}
            <Button type="submit" className="w-full h-12 gap-2 text-[15px]" disabled={loading}>
              <Mail className="h-4 w-4" />
              {loading ? "Envoi en cours…" : "Envoyer le lien"}
            </Button>
          </form>
          <div className="text-center pt-4">
            <Link to="/client/login" className="inline-flex items-center gap-1.5 text-sm text-[#9ca3af] hover:text-[#22c55e] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
