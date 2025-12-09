import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Settings, Check } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (acceptAll: boolean = false) => {
    const finalPreferences = acceptAll
      ? { essential: true, analytics: true, marketing: true, functional: true }
      : preferences;
    
    localStorage.setItem("cookie-consent", JSON.stringify(finalPreferences));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  const rejectAll = () => {
    const minimalPreferences = { essential: true, analytics: false, marketing: false, functional: false };
    localStorage.setItem("cookie-consent", JSON.stringify(minimalPreferences));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="relative p-6 rounded-2xl bg-glass-dark/95 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <button
            onClick={rejectAll}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {!showSettings ? (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-neon-violet/20 border border-neon-violet/30">
                  <Cookie className="h-6 w-6 text-neon-violet" />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="text-lg font-semibold mb-2">Nous utilisons des cookies 🍪</h3>
                  <p className="text-sm text-muted-foreground">
                    Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et personnaliser le contenu. 
                    <Link to="/cookies" className="text-neon-violet hover:underline ml-1">
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => savePreferences(true)}
                  className="btn-gradient px-6 py-2.5 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Tout accepter
                </button>
                <button
                  onClick={rejectAll}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-foreground font-medium rounded-xl hover:bg-white/10 transition-all"
                >
                  Tout refuser
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2.5 text-muted-foreground font-medium rounded-xl hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Personnaliser
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-6">Préférences des cookies</h3>
              
              <div className="space-y-4 mb-6">
                {[
                  { key: "essential", label: "Cookies essentiels", desc: "Nécessaires au fonctionnement du site", disabled: true },
                  { key: "analytics", label: "Cookies analytiques", desc: "Mesure d'audience et statistiques", disabled: false },
                  { key: "functional", label: "Cookies fonctionnels", desc: "Mémorisation de vos préférences", disabled: false },
                  { key: "marketing", label: "Cookies marketing", desc: "Publicités personnalisées", disabled: false },
                ].map((cookie) => (
                  <div key={cookie.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium">{cookie.label}</p>
                      <p className="text-sm text-muted-foreground">{cookie.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[cookie.key as keyof CookiePreferences]}
                        disabled={cookie.disabled}
                        onChange={(e) => setPreferences({ ...preferences, [cookie.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-checked:bg-neon-violet transition-colors ${cookie.disabled ? 'bg-neon-violet/50 cursor-not-allowed' : 'bg-white/20'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${preferences[cookie.key as keyof CookiePreferences] ? 'translate-x-5' : ''}`} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => savePreferences(false)}
                  className="btn-gradient px-6 py-2.5 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Enregistrer mes choix
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 text-muted-foreground font-medium rounded-xl hover:text-foreground transition-colors"
                >
                  Retour
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  localStorage.removeItem("cookie-consent");
  window.dispatchEvent(new Event("storage"));
  window.location.reload();
}
