# MBA — Addendum Instructions Dylan Conciergerie
## Corrections & Compléments — Impartial Games 2026

> Ce document complète la v3 sans la remplacer. Deux points : (1) correction du titre section 3, (2) spécification complète de la messagerie groupée.

---

 
 
CORRECTION 1 — Titre Section 3
Dans le document v3, la section 3 s’intitule « LES 4 ESPACES ». C’est une erreur. Le bon titre est :
 
Remplacer « LES 4 ESPACES — SPÉC FRONT » par « LES 3 ESPACES + NIVEAUX EMPLOYÉ — SPÉC FRONT »
 
Rappel de la structure correcte :
 
COMPLÉMENT — Messagerie Groupée
La messagerie groupée n’était pas spécifiée dans la v3. Voici la spécification complète à implémenter.
 
Règles générales messagerie (toute l’app MBA)
Ces règles s’appliquent à TOUS les corps de métier, pas seulement la conciergerie.
 
 
Le client ne peut PAS contacter directement l’employé assigné. Il passe toujours par l’Admin / Direction.
 
Messagerie groupée — spécification technique
Principe
Un employé (niveau manager ou agent) peut envoyer un message à un groupe de ses clients / agents
Chaque destinataire reçoit le message individuellement dans sa boîte de réception
Les destinataires voient le message mais NE PEUVENT PAS y répondre dans le fil groupé
S’ils veulent répondre, ils initient une conversation individuelle avec l’Admin uniquement
 
Cas d’usage conciergerie
 
Implémentation front — composant MessageGroupee
Créer un composant générique MessageGroupee.tsx dans src/components/messaging/
Ce composant est réutilisable pour tous les corps de métier — pas spécifique conciergerie
L’expéditeur sélectionne les destinataires depuis une liste filtrée selon son niveau
Le message est envoyé en une seule action — 1 row par destinataire en BDD (batch_id commun)
Chaque destinataire reçoit une notification push
 
Interface côté expéditeur
Bouton « Message groupé » dans la section messagerie de l’espace Employé
Modal de composition : champ destinataires (multi-select), sujet optionnel, corps du message
Filtre destinataires selon niveau : agent voit ses clients, manager voit ses agents + ses clients
Indicateur du nombre de destinataires sélectionnés avant envoi
Confirmation avant envoi : « Envoyer à X personnes »
 
Interface côté destinataire
Le message apparaît dans la boîte de réception avec un badge « Groupe » ou une icône distincte
Lecture seule — pas de bouton Répondre dans ce fil
S’il veut répondre, il utilise la messagerie individuelle vers l’Admin
 
Code — pattern à suivre
// MessageGroupee.tsx — src/components/messaging/
interface MessageGroupeeProps {
  recipients: User[];          // liste des destinataires
  senderLevel: 'agent' | 'manager' | 'director';
  onSend: (message: GroupMessage) => void;
}
 
// Structure message groupé envoyé à Supabase
// 1 row par destinataire avec batch_id commun
// is_group_message = true
// recipient_id = chaque destinataire individuellement
// read_at = null (non lu par défaut)
 
Vérification droits avant affichage
const { employeeLevel } = useAuth();
const canSendGroupMessage =
  role === 'admin' ||
  (role === 'employee' && ['agent','manager','director'].includes(employeeLevel));
 
// Bouton visible uniquement si droits suffisants
{canSendGroupMessage && <MessageGroupeeButton />}
 
Règles messagerie spécifiques conciergerie
 
 
MBA — Addendum Instructions Dylan Conciergerie
Impartial Games — 2026 — Confidentiel — Complément de MBA_Instructions_Dylan_Conciergerie_v3

---

*MBA — Addendum Instructions Dylan Conciergerie — Impartial Games 2026 — Confidentiel*
