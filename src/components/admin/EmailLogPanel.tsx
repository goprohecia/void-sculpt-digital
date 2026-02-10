import { useState } from "react";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { Mail, Eye, Send, CheckCircle, FileText, AlertTriangle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { EmailLog } from "@/contexts/DemoDataContext";

const typeConfig: Record<EmailLog["type"], { icon: typeof Mail; label: string; color: string }> = {
  relance: { icon: AlertTriangle, label: "Relance", color: "hsl(0, 84%, 60%)" },
  devis: { icon: FileText, label: "Devis", color: "hsl(200, 100%, 50%)" },
  paiement: { icon: CheckCircle, label: "Paiement", color: "hsl(155, 100%, 45%)" },
  demande: { icon: Send, label: "Demande", color: "hsl(45, 93%, 55%)" },
  validation: { icon: CheckCircle, label: "Validation", color: "hsl(265, 85%, 60%)" },
};

interface EmailLogPanelProps {
  emails: EmailLog[];
  maxItems?: number;
  compact?: boolean;
}

export function EmailLogPanel({ emails, maxItems, compact = false }: EmailLogPanelProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const displayed = maxItems ? emails.slice(0, maxItems) : emails;

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
          <Mail className="h-5 w-5 text-primary/60" />
        </div>
        <p className="text-xs text-muted-foreground">Aucun email envoyé</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {displayed.map((email) => {
          const cfg = typeConfig[email.type];
          const Icon = cfg.icon;
          return (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className="w-full text-left p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg" style={{ backgroundColor: `${cfg.color}20` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{email.sujet}</p>
                    {!compact && (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    À : {email.destinataire}
                    {!compact && ` — ${new Date(email.dateEnvoi).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" />
              {selectedEmail?.sujet}
            </DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <span>À : <strong className="text-foreground">{selectedEmail.destinataire}</strong></span>
                <span>Type : <strong className="text-foreground capitalize">{typeConfig[selectedEmail.type].label}</strong></span>
                <span>Date : <strong className="text-foreground">{new Date(selectedEmail.dateEnvoi).toLocaleString("fr-FR")}</strong></span>
                {selectedEmail.reference && <span>Réf : <strong className="text-foreground">{selectedEmail.reference}</strong></span>}
              </div>
              <div className="border-t border-border/50 pt-3">
                <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEmail.contenu, { ALLOWED_TAGS: ['p','strong','em','br','a','table','tr','td','th','tbody','thead','div','span','h1','h2','h3','img','ul','ol','li'], ALLOWED_ATTR: ['href','style','class','src','alt','width','height','align','cellpadding','cellspacing','role'] }) }} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
