import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Check } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleRefuse = () => {
    localStorage.setItem("cookie-consent", "refused");
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-glass-dark/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-[0_-10px_40px_rgba(139,92,246,0.15)]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center">
              <Cookie className="h-6 w-6 text-neon-violet" />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Nous utilisons des cookies</h3>
              <p className="text-sm text-muted-foreground">
                Ce site utilise des cookies pour améliorer votre expérience de navigation. 
                En continuant, vous acceptez notre{" "}
                <Link to="/cookies" className="text-neon-violet hover:underline">
                  politique de cookies
                </Link>{" "}
                et notre{" "}
                <Link to="/politique-confidentialite" className="text-neon-violet hover:underline">
                  politique de confidentialité
                </Link>.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleRefuse}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
              >
                <X className="h-4 w-4" />
                Refuser
              </button>
              <button
                onClick={handleAccept}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl btn-gradient text-white text-sm font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300"
              >
                <Check className="h-4 w-4" />
                Accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}