
# Espace Rendez-vous Calendly -- Client et Admin

## Ce qui sera mis en place

### 1. Pop-up de bienvenue avec Calendly (premiere connexion client)
Quand un client se connecte pour la premiere fois a son espace, un dialog s'affiche automatiquement pour l'inviter a prendre rendez-vous via l'iframe Calendly deja en place sur le site (`https://calendly.com/yannis-bezriche/impartial-games`). Le client peut fermer le pop-up s'il ne souhaite pas prendre rendez-vous tout de suite. L'etat "premiere visite" sera stocke en localStorage pour ne pas re-afficher le pop-up.

### 2. Page "Rendez-vous" dans l'espace client (`/client/rendez-vous`)
Une nouvelle page accessible depuis la sidebar client avec :
- Un bouton "Prendre un rendez-vous" qui ouvre l'iframe Calendly dans un dialog
- Une liste de rendez-vous (donnees mock pour la demo) avec date, heure, statut (a venir / passe / annule)
- Possibilite de reprogrammer (redirige vers Calendly)

### 3. Page "Rendez-vous" dans l'espace admin (`/admin/rendez-vous`)
Une nouvelle page accessible depuis la sidebar admin avec :
- Un calendrier visuel (vue mensuelle) affichant les rendez-vous des clients
- Liste des rendez-vous a venir avec nom du client, date, heure et statut
- Vue d'ensemble des prochains rendez-vous

---

## Details techniques

### Fichiers a creer
- `src/pages/client/ClientRendezVous.tsx` -- Page rendez-vous client avec iframe Calendly et liste mock
- `src/pages/admin/AdminRendezVous.tsx` -- Page admin avec calendrier et liste des RDV
- `src/components/admin/CalendlyBookingDialog.tsx` -- Dialog reutilisable avec iframe Calendly
- `src/components/admin/WelcomeBookingDialog.tsx` -- Pop-up premiere connexion client

### Fichiers a modifier
- `src/components/AnimatedRoutes.tsx` -- Ajouter les routes `/client/rendez-vous` et `/admin/rendez-vous`
- `src/components/admin/ClientSidebar.tsx` -- Ajouter l'entree "Rendez-vous" avec icone `CalendarDays`
- `src/components/admin/AdminSidebar.tsx` -- Ajouter l'entree "Rendez-vous" avec icone `CalendarDays`
- `src/data/mockData.ts` -- Ajouter les donnees mock de rendez-vous (interface `RendezVous` + tableau)
- `src/pages/client/ClientDashboard.tsx` -- Integrer le `WelcomeBookingDialog` pour la premiere connexion

### Donnees mock
```text
Interface RendezVous {
  id, clientId, clientNom, date, heure, sujet, statut (a_venir | passe | annule)
}
```
5-6 rendez-vous mock repartis entre passes et a venir.

### Logique premiere connexion
- Verification de `localStorage.getItem("impartial_first_visit_done")`
- Si absent : afficher le dialog de bienvenue avec Calendly
- Au clic "Fermer" ou "Plus tard" : stocker la cle pour ne plus afficher

### URL Calendly utilisee
`https://calendly.com/yannis-bezriche/impartial-games` (deja en place sur le site)
