// [MBA] Addendum messagerie groupée — composant GÉNÉRIQUE réutilisable tous corps de métier
// Règles:
// - Admin → peut envoyer à n'importe qui
// - Employé (agent/manager/director) → peut envoyer à ses clients assignés + ses agents (si manager+)
// - Client → NE PEUT PAS envoyer de message groupé
// - 1 message envoyé = 1 row par destinataire en BDD (batch_id commun, is_group_message = true)
// - Destinataires voient le message mais NE PEUVENT PAS répondre dans le fil groupé
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Megaphone, Send, Users, X, Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// [MBA] Addendum messagerie groupée — interface destinataire
export interface GroupRecipient {
  id: string;
  nom: string;
  prenom: string;
  role: "client" | "employee";
  /** Pour filtrage : ex. "agent", "manager", "proprietaire" */
  subType?: string;
  /** Pour filtrage géographique (conciergerie) */
  region?: string;
}

// [MBA] Addendum messagerie groupée — message envoyé
export interface GroupMessage {
  batchId: string;
  contenu: string;
  sujet?: string;
  recipientIds: string[];
  senderRole: "admin" | "employee";
  senderLevel?: "agent" | "manager" | "director";
  timestamp: string;
}

interface MessageGroupeeProps {
  /** Liste des destinataires filtrés selon le niveau de l'expéditeur */
  recipients: GroupRecipient[];
  /** Niveau de l'expéditeur pour le filtrage */
  senderLevel: "agent" | "manager" | "director" | "admin";
  /** Callback d'envoi — en production: insert Supabase avec batch_id */
  onSend: (message: GroupMessage) => void;
  /** Label affiché pour les destinataires (ex: "propriétaires", "agents", "membres") */
  recipientsLabel?: string;
  /** Trigger: le bouton qui ouvre la modal */
  trigger?: React.ReactNode;
}

// [MBA] Addendum messagerie groupée — composant principal
export function MessageGroupee({
  recipients,
  senderLevel,
  onSend,
  recipientsLabel = "destinataires",
  trigger,
}: MessageGroupeeProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const filteredRecipients = recipients.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return `${r.prenom} ${r.nom}`.toLowerCase().includes(q);
  });

  const toggleRecipient = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredRecipients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecipients.map((r) => r.id)));
    }
  };

  const handleSend = () => {
    if (!contenu.trim()) { toast.error("Le message ne peut pas être vide"); return; }
    if (selectedIds.size === 0) { toast.error("Sélectionnez au moins un destinataire"); return; }

    const message: GroupMessage = {
      batchId: `grp-${Date.now()}`,
      contenu: contenu.trim(),
      sujet: sujet.trim() || undefined,
      recipientIds: Array.from(selectedIds),
      senderRole: senderLevel === "admin" ? "admin" : "employee",
      senderLevel: senderLevel === "admin" ? undefined : senderLevel,
      timestamp: new Date().toISOString(),
    };

    onSend(message);
    toast.success(`Message groupé envoyé à ${selectedIds.size} ${recipientsLabel}`);
    setOpen(false);
    setSelectedIds(new Set());
    setSujet("");
    setContenu("");
    setShowConfirm(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShowConfirm(false);
  };

  return (
    <>
      {/* [MBA] Addendum messagerie groupée — trigger bouton */}
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <Button size="sm" variant="outline" className="gap-2" onClick={() => setOpen(true)}>
          <Megaphone className="h-4 w-4" /> Message groupé
        </Button>
      )}

      {/* [MBA] Addendum messagerie groupée — modal de composition */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-green-600" />
              Message groupé
            </DialogTitle>
            <DialogDescription>
              Envoyer un message à plusieurs {recipientsLabel}. Les destinataires ne pourront pas répondre dans ce fil.
            </DialogDescription>
          </DialogHeader>

          {!showConfirm ? (
            <div className="space-y-4 py-2">
              {/* Sélection destinataires */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Destinataires
                    {selectedIds.size > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">{selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}</Badge>
                    )}
                  </label>
                  <button type="button" onClick={selectAll} className="text-xs text-green-600 hover:underline">
                    {selectedIds.size === filteredRecipients.length ? "Tout désélectionner" : "Tout sélectionner"}
                  </button>
                </div>

                {/* Recherche */}
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Rechercher un ${recipientsLabel.replace(/s$/, "")}...`}
                    className="pl-8 h-9 text-sm"
                  />
                </div>

                {/* Liste destinataires */}
                <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
                  {filteredRecipients.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-3">Aucun {recipientsLabel.replace(/s$/, "")} trouvé</p>
                  ) : (
                    filteredRecipients.map((r) => (
                      <label key={r.id} className="flex items-center gap-2.5 p-1.5 rounded hover:bg-gray-50 cursor-pointer">
                        <Checkbox
                          checked={selectedIds.has(r.id)}
                          onCheckedChange={() => toggleRecipient(r.id)}
                        />
                        <span className="text-sm text-gray-700">{r.prenom} {r.nom}</span>
                        {r.subType && (
                          <Badge variant="outline" className="text-[9px] ml-auto">{r.subType}</Badge>
                        )}
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Sujet optionnel */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Sujet (optionnel)</label>
                <Input
                  value={sujet}
                  onChange={(e) => setSujet(e.target.value)}
                  placeholder="Ex: Changement de planning"
                  className="h-9 text-sm"
                />
              </div>

              {/* Corps du message */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Message</label>
                <Textarea
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  placeholder={`Votre message pour les ${recipientsLabel}...`}
                  rows={4}
                />
              </div>
            </div>
          ) : (
            /* [MBA] Addendum messagerie groupée — écran de confirmation */
            <div className="py-4 space-y-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mx-auto">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Envoyer à {selectedIds.size} {recipientsLabel} ?
                </p>
                {sujet && <p className="text-sm text-gray-500 mt-1">Sujet : {sujet}</p>}
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{contenu}</p>
              </div>
              <div className="flex items-center gap-1.5 justify-center text-xs text-gray-400">
                <AlertTriangle className="h-3 w-3" />
                <span>Les destinataires ne pourront pas répondre à ce message</span>
              </div>
            </div>
          )}

          <DialogFooter>
            {!showConfirm ? (
              <>
                <Button variant="outline" onClick={handleClose}>Annuler</Button>
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={selectedIds.size === 0 || !contenu.trim()}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="h-4 w-4" /> Envoyer à {selectedIds.size} {recipientsLabel}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowConfirm(false)}>Modifier</Button>
                <Button onClick={handleSend} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <Megaphone className="h-4 w-4" /> Confirmer l'envoi
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// [MBA] Addendum messagerie groupée — badge pour les messages reçus (côté destinataire)
export function GroupMessageBadge() {
  return (
    <Badge variant="secondary" className="text-[10px] gap-1">
      <Megaphone className="h-3 w-3" /> Groupe
    </Badge>
  );
}
