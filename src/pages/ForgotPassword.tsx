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
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-xl font-bold">My Business Assistant</h2>
          <div className="glass-card p-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Email envoyé !</h2>
            <p className="text-muted-foreground text-sm">
              Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants.
            </p>
            <p className="text-muted-foreground text-xs">Pensez à vérifier vos spams.</p>
            <Link to="/client/login" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
          <p className="text-muted-foreground text-sm">Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>

        <div className="glass-card p-8">
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
                maxLength={255}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
              <Mail className="h-4 w-4" />
              {loading ? "Envoi en cours…" : "Envoyer le lien"}
            </Button>
          </form>
          <div className="text-center pt-4">
            <Link to="/client/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
