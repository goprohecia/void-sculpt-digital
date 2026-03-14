import { AVAILABLE_FONTS, type WhiteLabelConfig } from "@/hooks/use-white-label";

interface WhiteLabelPreviewProps {
  config: WhiteLabelConfig;
}

export function WhiteLabelPreview({ config }: WhiteLabelPreviewProps) {
  const fontFamily = config.fontFamily
    ? `'${config.fontFamily}', sans-serif`
    : "inherit";

  return (
    <div className="sticky top-6 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Prévisualisation en direct
      </p>

      {/* Mini sidebar preview */}
      <div className="rounded-xl border border-border/40 overflow-hidden shadow-sm">
        <div className="flex">
          {/* Sidebar mock */}
          <div
            className="w-16 min-h-[220px] flex flex-col items-center py-4 gap-3"
            style={{ backgroundColor: config.bgColor || "#0a0a0f" }}
          >
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt="Logo"
                className="h-8 w-8 rounded-md object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: config.primaryColor || "#6366f1" }}
              >
                {config.brandShort?.charAt(0) || "M"}
              </div>
            )}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-2 w-8 rounded-full opacity-30"
                style={{
                  backgroundColor: i === 1 ? config.primaryColor : "#fff",
                }}
              />
            ))}
          </div>

          {/* Content area mock */}
          <div className="flex-1 bg-background p-4 space-y-3">
            <p
              className="text-sm font-semibold"
              style={{ fontFamily }}
            >
              {config.brandName || "My Business Assistant"}
            </p>

            <p
              className="text-xs text-muted-foreground leading-relaxed"
              style={{ fontFamily }}
            >
              Ceci est un aperçu du texte avec la police{" "}
              <span className="font-medium text-foreground">
                {config.fontFamily || "par défaut"}
              </span>
              .
            </p>

            {/* Button preview */}
            <button
              className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-transform hover:scale-105"
              style={{
                backgroundColor: config.primaryColor || "#6366f1",
                fontFamily,
              }}
            >
              Bouton principal
            </button>

            {/* Accent element */}
            <div className="flex gap-2 items-center">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: config.accentColor || "#8b5cf6" }}
              />
              <span
                className="text-[11px] text-muted-foreground"
                style={{ fontFamily }}
              >
                Élément d'accent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Font samples */}
      {config.fontFamily && (
        <div
          className="p-4 rounded-xl border border-border/30 bg-muted/10 space-y-2"
          style={{ fontFamily }}
        >
          <p className="text-xs text-muted-foreground font-medium">
            Aperçu typographie — {config.fontFamily}
          </p>
          <p className="text-lg font-bold">Titre principal</p>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore.
          </p>
          <p className="text-xs text-muted-foreground">
            0123456789 — ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </p>
        </div>
      )}
    </div>
  );
}
