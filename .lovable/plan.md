

# Audit complet des 10 Modules MBA

## Synthese rapide

| # | Module | Statut | Manques |
|---|--------|--------|---------|
| 01 | Assignation globale | ✅ 95% | Manque : `assignation_enabled` n'est pas un booleen dans la config mock du metier mais une fonction separee (`isAssignationEnabled`) — fonctionnellement OK |
| 02 | Lien reservation + acompte | ✅ 100% | Complet |
| 03 | Notifications push/SMS a l'assignation | ⚠️ 70% | Manque : preferences notif dans l'espace Pro (toggles in-app / SMS + champ telephone) |
| 04 | Verrou de creneau | ✅ 100% | Complet |
| 05 | Regles annulation et remboursement | ⚠️ 85% | Manque : bouton "Annuler la reservation" dans la vue dossier Admin avec modale de confirmation et calcul du remboursement |
| 06 | Disponibilites par pro | ⚠️ 90% | Manque : clic sur un pro dans le calendrier admin ouvre bien son panneau ✅, mais les disponibilites ne filtrent pas reellement les creneaux sur la page `/rdv/[slug]` (le filtrage est fait mais de maniere generique) |
| 07 | Multi-assignation | ✅ 100% | Complet — etoile responsable, badges, retrait avec confirmation, changement de responsable inline |
| 08 | QR code auto | ✅ 100% | Complet |
| 09 | Limite de charge | ⚠️ 85% | Manque : champ "Capacite maximale" editable dans les parametres de chaque pro (actuellement c'est un champ mock statique, pas un input configurable). Manque aussi : notification/alerte a l'admin si un pro depasse sa limite |
| 10 | Notifications client par etape | ✅ 100% | Complet |

---

## Detail par module

### Module 01 — Assignation globale
- ✅ AssignModal avec cards, avatars, checkboxes multiples
- ✅ Premier coche = responsable auto, suivants = renfort
- ✅ Bouton "Confirmer l'assignation"
- ✅ Vue detail dossier : avatars + badges RESPONSABLE/RENFORT
- ✅ Bouton "Modifier l'assignation" / "Assigner"
- ✅ Espace Pro "Mes dossiers" filtre par assignation
- ✅ Badges RESPONSABLE/RENFORT dans l'espace Pro
- ✅ Conditionne par `isAssignationEnabled(demoSector)` — si false, elements masques
- ✅ Metiers configures : Garage, BTP, Conciergerie, Immobilier, Coach-sportif, Cabinets, Boutique, Auto-ecole

### Module 02 — Lien de reservation unique + acompte
- ✅ Route `/rdv/:slug` publique sans connexion
- ✅ En-tete avec nom business et avatar
- ✅ Grille creneaux avec etats disponible/verrouille/reserve
- ✅ Formulaire pre-RDV optionnel (conditionne par booleen)
- ✅ Etape recap + montant acompte
- ✅ Bouton "Payer l'acompte" (UI simulee)
- ✅ Stepper multi-etapes (Choix > Formulaire > Recap > Confirmation)
- ✅ Config admin : slug, acompte fixe/pourcentage, toggle formulaire, champs custom

### Module 03 — Notifications push/SMS a l'assignation
- ✅ Toast in-app a chaque assignation avec icone
- ✅ Badge compteur sur icone cloche (incremente)
- ✅ Panneau NotificationPanel (dropdown) avec liste, statut lu/non lu, heure relative
- ✅ Clic sur notification → navigation + marque comme lue
- ✅ Bouton "Tout marquer comme lu"
- ✅ Canal SMS affiche visuellement dans les notifications
- ❌ **MANQUANT** : Espace Pro > page Preferences notifications avec :
  - Toggle "Notifications in-app" active/desactive
  - Toggle "SMS" active/desactive + champ numero de telephone
  - Actuellement le `EmployeeProfile.tsx` ne contient que les infos basiques, pas de preferences de notification

### Module 04 — Verrou de creneau
- ✅ 3 etats visuels : disponible, verrouille ("En cours..."), reserve (✓)
- ✅ Au clic → etat verrouille + timer 10 min
- ✅ BookingCountdown visible en permanence pendant le formulaire
- ✅ Expiration → creneau redevient disponible + toast erreur
- ✅ Confirmation → creneau passe "reserve" definitivement

### Module 05 — Regles d'annulation et remboursement
- ✅ Config admin : delai numerique + selecteur heures/jours
- ✅ 3 options radio : total / partiel (+ input %) / aucun
- ✅ Zone de texte message pre-rempli, modifiable
- ✅ Apercu en temps reel du bloc conditions
- ✅ Bloc "Conditions d'annulation" sur page /rdv avant paiement
- ✅ Checkbox obligatoire "J'ai lu et j'accepte..." — bouton "Payer" disabled tant que non coche
- ❌ **MANQUANT** : Bouton "Annuler la reservation" dans la vue dossier Admin avec modale de confirmation et affichage du montant rembourse calcule

### Module 06 — Disponibilites par pro
- ✅ Espace Pro : page "Mes disponibilites" avec 3 onglets (Horaires, Exceptions, Conges)
- ✅ Grille semaine lun-dim avec plages ajoutables/supprimables
- ✅ Exceptions : date picker + toggle disponible/indisponible + liste
- ✅ Conges : date range + liste avec suppression
- ✅ Admin : vue calendrier globale equipe avec couleurs par pro
- ✅ Clic sur un pro → ouvre panneau modifiable (Sheet)
- ✅ Congés et exceptions affiches dans la grille admin
- ⚠️ Page /rdv/[slug] : utilise `MOCK_DISPONIBILITES` pour generer les creneaux — **OK fonctionnellement** mais le lien entre modifications par le pro et la page booking est simule (pas reactif entre les deux contextes)

### Module 07 — Multi-assignation
- ✅ Checkbox multiple sans limite
- ✅ Etoile pour designer 1 responsable (obligatoire, validation bloquante)
- ✅ 1 seul coche → auto-responsable
- ✅ Recap "1 responsable + N en renfort"
- ✅ Vue detail dossier : carte par pro avec avatar + badge
- ✅ Bouton "+" pour ajouter un pro (rouvre AssignModal filtre)
- ✅ Bouton × pour retirer avec AlertDialog de confirmation
- ✅ Changement de responsable inline via etoile (sans rouvrir la modale)
- ✅ Promotion automatique du premier restant si le responsable est retire

### Module 08 — QR code auto
- ✅ Lien en lecture seule + bouton Copier
- ✅ QRCodeCanvas 280×280, fond blanc, modules noirs
- ✅ Bouton "Telecharger PNG" via canvas.toBlob()
- ✅ Bouton "Telecharger PDF" via jsPDF A4 centre
- ✅ Toggle logo au centre (Enterprise only)
- ✅ Upload logo PNG/JPG avec preview
- ✅ Plan ≠ enterprise : toggle disabled + badge Enterprise + CTA upgrade
- ✅ QR regenere via React (le composant rerender quand slug change)

### Module 09 — Limite de charge par pro
- ✅ `capaciteMax` sur TeamMember (null = pas de limite)
- ✅ Barre de progression coloree (vert/orange/rouge) dans AssignModal
- ✅ Texte "X / Y dossiers"
- ✅ Pro a 100% : carte grisee + badge "CHARGE MAX"
- ✅ Clic sur pro grise → AlertDialog "Forcer l'assignation ?"
- ✅ Widget "Charge de l'equipe" sur dashboard admin avec tableau
- ✅ Lignes en rouge si depassement
- ❌ **MANQUANT** : Input editable "Capacite maximale" dans les parametres de chaque pro (actuellement valeurs statiques dans mockData)
- ❌ **MANQUANT** : Notification/alerte automatique a l'admin si un pro depasse sa limite

### Module 10 — Notifications client par etape
- ✅ Liste de toutes les etapes avec toggle, selecteur canal, zone de texte
- ✅ Messages pre-remplis par metier (garage, coiffure, conciergerie, BTP, auto-ecole, coach, immobilier, photographe, evenementiel, mariage)
- ✅ Variables cliquables {nom_client}, {date}, {heure}, {nom_business}
- ✅ Auto-reset du message si vide (onBlur → remet le template par defaut)
- ✅ Onglet "Suivi client" dans AdminSettings
- ✅ Stepper horizontal dans DossierTimeline
- ✅ Toast enrichi "Notification envoyee au client par SMS/Email" a la validation
- ✅ Icones Mail/Phone sur les etapes avec notification active

---

## Elements a corriger (4 manques identifies)

### 1. Module 03 — Preferences de notification dans l'espace Pro
**Fichier** : `src/pages/employee/EmployeeProfile.tsx`
Ajouter une section "Preferences de notifications" avec :
- Toggle "Notifications in-app"
- Toggle "SMS" + champ numero de telephone (UI seulement)

### 2. Module 05 — Bouton "Annuler la reservation" dans la vue dossier
**Fichier** : `src/pages/admin/AdminDossierDetail.tsx`
Ajouter un bouton "Annuler la reservation" qui ouvre une modale de confirmation affichant le montant rembourse calcule selon la politique configuree (simulation visuelle).

### 3. Module 09 — Input editable pour la capacite maximale
**Fichier** : A ajouter dans les parametres Admin (settings equipe ou page employes)
Champ numerique "Nombre max de dossiers actifs simultanes" par pro, editable par l'admin.

### 4. Module 09 — Alerte depassement de limite
Notification automatique dans le panneau de notifications quand un pro depasse sa limite apres une assignation.

