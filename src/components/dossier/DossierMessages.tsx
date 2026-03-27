// [MBA] Messagerie dossier — bible v3 section 4.4
// Admin/Employé: peut envoyer à ce client
// Client: peut écrire à l'admin/direction UNIQUEMENT, PAS à l'employé
// Employé: peut envoyer groupé, pièces jointes, photos
// Client reçoit les messages groupés sans pouvoir répondre
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Paperclip, Image, FileIcon, X, Lock, Megaphone } from "lucide-react";
import { toast } from "sonner";
import type { DemoRole } from "@/contexts/DemoAuthContext";

interface Attachment {
  name: string;
  type: "file" | "photo";
  size: number;
  url?: string; // ObjectURL for photo preview
}

interface Msg {
  id: string;
  contenu: string;
  role: "admin" | "employee" | "client";
  date: string;
  attachment?: Attachment;
  // [MBA] Message groupé — bible v3 section 4.4
  is_group_message?: boolean;
}

interface Props {
  dossierId: string;
  clientNom: string;
  // [MBA] Rôle de l'utilisateur courant pour appliquer les droits messagerie
  userRole?: DemoRole;
  // [MBA] Client ne peut pas contacter l'employé directement
  canContactEmployee?: boolean;
  // [MBA] Label du rôle employé pour le badge message groupé (ex: "Coach", "Professeur")
  employeeRoleLabel?: string;
}

export function DossierMessages({ dossierId, clientNom, userRole = "admin", canContactEmployee = true, employeeRoleLabel = "Salarié" }: Props) {
  // [MBA] Déterminer le rôle d'envoi du message
  const senderRole: "admin" | "employee" | "client" = userRole === "employee" ? "employee" : userRole === "client" ? "client" : "admin";
  const isClientUser = userRole === "client";
  const isEmployeeUser = userRole === "employee";
  // [MBA] Client peut écrire mais uniquement à l'admin/direction
  const canSendAttachments = !isClientUser; // Client ne peut pas envoyer de fichiers/photos
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    if (!input.trim() && !attachment) return;
    // [MBA] Le rôle du message correspond au rôle réel de l'utilisateur
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      contenu: input.trim(),
      role: senderRole,
      date: new Date().toISOString(),
      attachment: attachment || undefined,
    }]);
    setInput("");
    setAttachment(null);
    toast.success(attachment ? "Message avec pièce jointe envoyé" : "Message envoyé");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachment({ name: file.name, type: "file", size: file.size });
    e.target.value = "";
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    setAttachment({ name: file.name, type: "photo", size: file.size, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  if (messages.length === 0 && !input && !attachment) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground mb-3">Aucun message pour ce dossier</p>
        {/* [MBA] Client voit un message adapté — bible v3 section 4.3 */}
        <p className="text-xs text-muted-foreground mb-4">
          {isClientUser
            ? "Envoyez un message à la direction"
            : `Envoyez un message, un fichier ou une photo à ${clientNom}`
          }
        </p>
        {/* [MBA] Client ne peut pas contacter l'employé — avertissement si nécessaire */}
        {isClientUser && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-3 px-3 py-1.5 rounded-lg bg-muted/30 border">
            <Lock className="h-3 w-3" />
            <span>Vous communiquez avec la direction uniquement</span>
          </div>
        )}
        <div className="w-full max-w-md space-y-2">
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={isClientUser ? "Écrire à la direction..." : `Écrire à ${clientNom}...`} rows={3} />
          <div className="flex gap-2">
            <Button onClick={send} disabled={!input.trim()} className="gap-1.5"><Send className="h-4 w-4" /> Envoyer</Button>
            {/* [MBA] Client ne peut pas envoyer de fichiers/photos */}
            {canSendAttachments && (
              <>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5"><Paperclip className="h-4 w-4" /> Fichier</Button>
                <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()} className="gap-1.5"><Image className="h-4 w-4" /> Photo</Button>
              </>
            )}
          </div>
        </div>
        {canSendAttachments && (
          <>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
          </>
        )}
      </div>
    );
  }

  // [MBA] Si tous les messages sont groupés, le client ne peut pas répondre
  const allGroupMessages = messages.length > 0 && messages.every(m => m.is_group_message);
  const clientCanReply = isClientUser ? !allGroupMessages : true;

  return (
    <div className="space-y-3">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {/* [MBA] Client voit un rappel — bible v3 section 4.4 */}
        {isClientUser && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2 px-3 py-1.5 rounded-lg bg-muted/30 border">
            <Lock className="h-3 w-3" />
            <span>Vous communiquez avec la direction uniquement</span>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === senderRole ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.role === senderRole ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {/* [MBA] Badge message groupé — bible v3 section 4.4 */}
              {m.is_group_message && (
                <Badge variant="secondary" className="mb-1.5 text-[10px] gap-1">
                  <Megaphone className="h-3 w-3" />
                  {isClientUser ? `Message de votre ${employeeRoleLabel}` : "Message groupé"}
                </Badge>
              )}
              {m.contenu && <p>{m.contenu}</p>}
              {m.attachment && (
                <div className={`mt-1.5 p-2 rounded ${m.role === senderRole ? "bg-primary-foreground/10" : "bg-background/50"} flex items-center gap-2`}>
                  {m.attachment.type === "photo" && m.attachment.url ? (
                    <img src={m.attachment.url} alt={m.attachment.name} className="max-w-[200px] max-h-[150px] rounded object-cover" />
                  ) : (
                    <>
                      <FileIcon className="h-4 w-4 shrink-0" />
                      <span className="text-xs truncate">{m.attachment.name}</span>
                      <span className="text-[10px] opacity-70">{formatSize(m.attachment.size)}</span>
                    </>
                  )}
                </div>
              )}
              <p className={`text-[10px] mt-1 ${m.role === senderRole ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {new Date(m.date).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* [MBA] Bible v3 section 4.4 — client ne peut pas répondre aux messages groupés */}
      {isClientUser && !clientCanReply && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-2 px-3 rounded-lg bg-muted/30 border">
          <Lock className="h-3 w-3" />
          <span>Vous ne pouvez pas répondre aux messages groupés</span>
        </div>
      )}

      {/* Attachment preview */}
      {clientCanReply && attachment && (
        <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 text-sm">
          {attachment.type === "photo" ? <Image className="h-4 w-4 text-primary" /> : <FileIcon className="h-4 w-4 text-primary" />}
          <span className="truncate flex-1">{attachment.name}</span>
          <span className="text-xs text-muted-foreground">{formatSize(attachment.size)}</span>
          <button type="button" onClick={() => setAttachment(null)} className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* [MBA] Input bar — client n'a pas de boutons fichier/photo, masqué si groupé-only */}
      {clientCanReply && (
        <div className="flex gap-2 items-end">
          {canSendAttachments && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => fileInputRef.current?.click()} title="Joindre un fichier">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => photoInputRef.current?.click()} title="Envoyer une photo">
                <Image className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={isClientUser ? "Écrire à la direction..." : `Écrire à ${clientNom}...`} rows={2} className="flex-1" onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <Button onClick={send} disabled={!input.trim() && !attachment} className="self-end"><Send className="h-4 w-4" /></Button>
        </div>
      )}
      {canSendAttachments && (
        <>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
        </>
      )}
    </div>
  );
}
