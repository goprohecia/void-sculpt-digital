

# Emails automatiques (simulation) et tableau de bord analytique avance

Ce plan ajoute deux fonctionnalites majeures au back-office :

1. **Systeme d'emails automatiques simule** -- historique visuel d'emails envoyes automatiquement lors d'evenements cles
2. **Tableau de bord analytique enrichi** -- graphiques interactifs pour le suivi du CA, des paiements et des demandes

Le test du flux complet (admin -> facture -> PDF -> client -> notification -> paiement) sera effectue apres implementation.

---

## 1. Systeme d'emails simules

### Principe
Pas d'envoi reel d'emails. A chaque evenement cle, un "email" est genere et stocke dans le `DemoDataContext`. Un panneau "Journal des emails" sera visible cote admin.

### Evenements declencheurs
- **Relance de facture** : quand une facture passe en retard ou est deja en retard (email au client)
- **Validation de devis** : quand l'admin envoie un devis (email au client)
- **Confirmation de paiement** : quand le client paie une facture (email au client + email de notification a l'admin)
- **Nouvelle demande** : quand le client soumet une demande (email de confirmation au client)
- **Changement de statut de demande** : quand l'admin valide ou refuse une demande (email au client)

### Nouveau type `EmailLog`
```text
id, type (relance | devis | paiement | demande | validation),
destinataire, sujet, contenu (HTML simplifie),
dateEnvoi, lu (boolean), clientId, reference
```

### Modifications
- **`DemoDataContext.tsx`** : ajouter un state `emailLogs`, un helper `pushEmail()` appele depuis les fonctions existantes (`updateFactureStatut`, `addDevis`, `addDemande`, etc.)
- **Nouveau fichier `src/components/admin/EmailLogPanel.tsx`** : composant affichant la liste des emails envoyes avec icone, destinataire, sujet, date, et possibilite d'ouvrir le contenu dans un Dialog
- **`AdminDashboard.tsx`** : ajouter une section "Derniers emails envoyes" avec les 5 derniers
- **`AdminReminders.tsx`** : ajouter un bouton "Envoyer la relance" qui genere l'email simule et change le statut

### Fichiers concernes
- `src/contexts/DemoDataContext.tsx` (modifie)
- `src/components/admin/EmailLogPanel.tsx` (nouveau)
- `src/pages/admin/AdminDashboard.tsx` (modifie -- section emails)
- `src/pages/admin/AdminReminders.tsx` (modifie -- bouton envoi)

---

## 2. Tableau de bord analytique enrichi

### Enrichissement de la page `/admin/analyse`
La page existante contient deja des graphiques CA et support. On va ajouter :

### Nouveaux graphiques
1. **Repartition des paiements** (PieChart) : payees vs en attente vs en retard, calcule dynamiquement depuis `DemoDataContext.factures`
2. **Suivi des demandes** (BarChart empile) : par mois, avec statuts (nouvelle, en_revue, validee, refusee) -- donnees mock enrichies
3. **Evolution du taux d'encaissement** (AreaChart) : ratio encaissements/CA par mois
4. **Top clients par CA** (BarChart horizontal) : les 5 clients avec le plus gros CA

### Donnees dynamiques
La page `AdminAnalytics` utilisera `useDemoData()` pour les factures et demandes, permettant de refleter les changements en temps reel (ex: une facture payee par le client met a jour le graphique).

### Section "Demandes" dans l'analytique
Ajout de KPIs :
- Nombre total de demandes
- Demandes validees vs refusees
- Taux de conversion demande -> dossier
- Graphique barres empilees par type de prestation

### Modifications
- **`AdminAnalytics.tsx`** : ajouter les nouveaux graphiques apres les sections existantes, importer `useDemoData` pour donnees dynamiques
- **`DemoDataContext.tsx`** : pas de changement structurel, on utilise les getters existants

### Fichiers concernes
- `src/pages/admin/AdminAnalytics.tsx` (modifie -- ajout sections)

---

## Details techniques

### Nouveaux fichiers
```text
src/components/admin/EmailLogPanel.tsx     -- Composant journal des emails
```

### Fichiers modifies
```text
src/contexts/DemoDataContext.tsx            -- Ajout type EmailLog, state, pushEmail()
src/pages/admin/AdminAnalytics.tsx         -- Graphiques paiements, demandes, top clients
src/pages/admin/AdminDashboard.tsx         -- Section derniers emails
src/pages/admin/AdminReminders.tsx         -- Bouton envoi relance simulee
```

### Librairies (toutes deja installees)
- `recharts` : PieChart, BarChart, AreaChart, ComposedChart
- `framer-motion` : animations
- `lucide-react` : Mail, Send, CheckCircle, etc.
- `sonner` : toasts de confirmation
- Composants Shadcn : Dialog, Tabs, Badge

### Pas de dependances supplementaires a installer.

