import { useState } from "react";
import { Mail, Send, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterFormProps {
  variant?: "default" | "compact";
}

export function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");

    toast({
      title: "Inscription réussie !",
      description: "Vous recevrez bientôt nos actualités.",
    });

    // Reset success state after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            maxLength={255}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all text-sm"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isSubscribed}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            isSubscribed
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
              : "btn-gradient text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Inscription...
            </>
          ) : isSubscribed ? (
            <>
              <Check className="h-4 w-4" />
              Inscrit !
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              S'inscrire
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-glass-dark/80 backdrop-blur-xl border border-white/10 hover:border-neon-violet/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center">
          <Mail className="h-5 w-5 text-neon-violet" />
        </div>
        <div>
          <h3 className="font-semibold">Newsletter</h3>
          <p className="text-sm text-muted-foreground">Restez informé de nos actualités</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            maxLength={255}
            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-1 focus:ring-neon-violet focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isSubscribed}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isSubscribed
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
              : "btn-gradient text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Inscription en cours...
            </>
          ) : isSubscribed ? (
            <>
              <Check className="h-5 w-5" />
              Inscription réussie !
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              S'inscrire à la newsletter
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          En vous inscrivant, vous acceptez notre{" "}
          <a href="/politique-confidentialite" className="text-neon-violet hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </form>
    </div>
  );
}