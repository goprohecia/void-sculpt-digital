import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/components/admin/AdminPageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AvocatStepper } from "./AvocatStepper";
import { toast } from "sonner";
import { MOCK_AFFAIRES, MOCK_COLLABORATEURS, AVOCAT_STEPS } from "@/data/mockAvocatData";
import {
  Scale, FileText, Euro, CalendarDays, MessageSquare,
  Lock, Send, User,
} from "lucide-react";

const CURRENT_CLIENT_AFFAIRE_ID = "aff-1";

export function AvocatClientView() {
  const affaire = MOCK_AFFAIRES.find(a => a.id === CURRENT_CLIENT_AFFAIRE_ID)!;
  const avocat = MOCK_COLLABORATEURS.find(c => c.id === affaire.avocatId)!;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "avocat", content: "Bonjour, je vous confirme que l'audience est fixée au 20 mars. Merci de vous rendre disponible.", date: "2026-03-08 10:30" },
    { role: "client", content: "Merci Maître. Je serai présent. Avez-vous besoin de documents supplémentaires ?", date: "2026-03-08 11:15" },
    { role: "avocat", content: "Non, le dossier est complet. Je vous tiendrai informé après l'audience.", date: "2026-03-08 14:00" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "client", content: message, date: new Date().toISOString().replace("T", " ").slice(0, 16) }]);
    setMessage("");
    toast.success("Message envoyé à votre avocat (simulé)");
  };

  const restant = affaire.honorairesFactures - affaire.honorairesPaies;

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          Suivi de votre affaire
        </h1>
        <p className="text-muted-foreground text-sm">Bienvenue {affaire.clientPrenom}, suivez l'avancement de votre dossier</p>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avancement de l'affaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvocatStepper currentStep={affaire.etape - 1} />
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-xs text-muted-foreground">Type de litige</p>
              <p className="text-sm font-medium">{affaire.typeLitige}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avocat en charge */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">{avocat.prenom} {avocat.nom}</p>
              <p className="text-xs text-muted-foreground">{avocat.specialite}</p>
              <p className="text-xs text-muted-foreground">{avocat.telephone}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prochaine audience */}
      {affaire.prochaineAudience && (
        <motion.div variants={staggerItem}>
          <Card className="glass-card border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Prochaine audience</p>
                  <p className="text-xs text-muted-foreground">Votre présence peut être requise</p>
                </div>
              </div>
              <p className="text-sm font-bold text-primary">{affaire.prochaineAudience}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Documents */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Mes documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {affaire.documentsPartages.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/20">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm">{doc}</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">Accessible</Badge>
              </div>
            ))}
            {/* Confidential docs are hidden */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/20">
              <Lock className="h-3 w-3" />
              <span>Certains documents restent confidentiels et ne sont accessibles qu'après validation de votre avocat.</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messagerie sécurisée */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Messagerie sécurisée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${m.role === "client" ? "bg-primary/10 ml-8" : "bg-muted/30 mr-8"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium">{m.role === "client" ? "Vous" : avocat.prenom}</span>
                    <span className="text-[10px] text-muted-foreground">{m.date}</span>
                  </div>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrire à votre avocat..."
                rows={2}
                className="flex-1"
              />
              <Button size="sm" className="self-end" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Échanges chiffrés et confidentiels
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Honoraires */}
      <motion.div variants={staggerItem}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4 text-primary" />
              Honoraires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm">Provision versée</span>
              <span className="text-sm font-medium">{affaire.honorairesProvision.toLocaleString()} €</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm">Notes d'honoraires</span>
              <span className="text-sm font-medium">{affaire.honorairesFactures.toLocaleString()} €</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm">Payé</span>
              <span className="text-sm font-medium text-emerald-400">{affaire.honorairesPaies.toLocaleString()} €</span>
            </div>
            {restant > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm font-medium">Reste dû</span>
                <span className="text-sm font-bold text-amber-400">{restant.toLocaleString()} €</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
