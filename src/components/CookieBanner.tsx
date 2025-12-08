import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Check, Settings, ChevronDown } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

// Custom event for opening cookie preferences
const OPEN_COOKIE_PREFERENCES_EVENT = "openCookiePreferences";

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES_EVENT));
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  const openBanner = useCallback(() => {
    // Load saved preferences if they exist
    const savedConsent = localStorage.getItem("cookie-consent");
    if (savedConsent && savedConsent !== "refused") {
      try {
        const savedPrefs = JSON.parse(savedConsent);
        setPreferences(savedPrefs);
      } catch {
        setPreferences(defaultPreferences);
      }
    }
    setShowPreferences(true);
    setIsVisible(true);
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenPreferences = () => openBanner();
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
  }, [openBanner]);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setShowPreferences(false);
    }, 300);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRefuseAll = () => {
    savePreferences(defaultPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-glass-dark/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_-10px_40px_rgba(139,92,246,0.15)] overflow-hidden">
          {/* Main Banner */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-neon-violet/10 border border-neon-violet/30 flex items-center justify-center">
                <Cookie className="h-6 w-6 text-neon-violet" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Nous utilisons des cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Ce site utilise des cookies pour améliorer votre expérience.{" "}
                  <Link to="/cookies" className="text-neon-violet hover:underline">
                    En savoir plus
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Settings className="h-4 w-4" />
                  Personnaliser
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showPreferences ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={handleRefuseAll}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Refuser
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-gradient text-white text-sm font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                  <Check className="h-4 w-4" />
                  Tout accepter
                </button>
              </div>
            </div>
          </div>

          {/* Preferences Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showPreferences ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <div className="border-t border-white/10 p-6 space-y-4">
              <h4 className="font-semibold text-sm text-neon-violet">Gérer vos préférences</h4>

              {/* Essential Cookies */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-emerald-400">Cookies essentiels</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Requis
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-6 rounded-full bg-emerald-500/30 border border-emerald-500/50 flex items-center justify-end px-1 cursor-not-allowed">
                    <div className="w-4 h-4 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-violet/30 transition-colors">
                <div className="flex-1">
                  <span className="font-medium text-neon-violet">Cookies analytiques</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                  </p>
                </div>
                <button
                  onClick={() => togglePreference("analytics")}
                  className="flex-shrink-0"
                >
                  <div
                    className={`w-12 h-6 rounded-full border flex items-center px-1 transition-all duration-200 cursor-pointer ${
                      preferences.analytics
                        ? "bg-neon-violet/30 border-neon-violet/50 justify-end"
                        : "bg-white/10 border-white/20 justify-start"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-colors ${
                        preferences.analytics ? "bg-neon-violet" : "bg-gray-400"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-colors">
                <div className="flex-1">
                  <span className="font-medium text-rose-400">Cookies marketing</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilisés pour vous proposer des publicités pertinentes.
                  </p>
                </div>
                <button
                  onClick={() => togglePreference("marketing")}
                  className="flex-shrink-0"
                >
                  <div
                    className={`w-12 h-6 rounded-full border flex items-center px-1 transition-all duration-200 cursor-pointer ${
                      preferences.marketing
                        ? "bg-rose-500/30 border-rose-500/50 justify-end"
                        : "bg-white/10 border-white/20 justify-start"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-colors ${
                        preferences.marketing ? "bg-rose-400" : "bg-gray-400"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
                <div className="flex-1">
                  <span className="font-medium text-violet-400">Cookies fonctionnels</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permettent de mémoriser vos préférences (langue, région, etc.).
                  </p>
                </div>
                <button
                  onClick={() => togglePreference("functional")}
                  className="flex-shrink-0"
                >
                  <div
                    className={`w-12 h-6 rounded-full border flex items-center px-1 transition-all duration-200 cursor-pointer ${
                      preferences.functional
                        ? "bg-violet-500/30 border-violet-500/50 justify-end"
                        : "bg-white/10 border-white/20 justify-start"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-colors ${
                        preferences.functional ? "bg-violet-400" : "bg-gray-400"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-gradient text-white text-sm font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                  <Check className="h-4 w-4" />
                  Enregistrer mes préférences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}