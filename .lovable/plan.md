
# Demandes client, gestion avancee des dossiers, edition devis/factures et paiement

Ce plan couvre 3 grandes fonctionnalites interconnectees :

1. **Formulaire de demande client** -- le client soumet un projet, visible ensuite cote admin
2. **Edition de devis/factures** cote admin avec association client/dossier et validation cote client
3. **Page de paiement** pour les factures, avec mise a jour du statut dans les deux espaces

---

## 1. Demande de projet (espace client)

### Nouvelle page : `/client/demandes`
- Formulaire "Nouvelle demande" avec champs : titre du projet, type de prestation (select : Site web, App mobile, E-commerce, Back-office, 360, Autre), description detaillee, budget estimatif (optionnel)
- Liste des demandes deja soumises avec leur statut (nouvelle | en_revue | validee | refusee)
- Chaque demande affiche : titre, type, date, statut (StatusBadge)

### Donnees mock
- Nouveau type `Demande` : id, reference, clientId, clientNom, titre, typePrestation, description, budget, statut (nouvelle | en_revue | validee | refusee), dateCreation, dateMiseAJour
- 2-3 demandes fictives pour le client demo (c3)
- Helper `getDemandesByClient(clientId)`
- Nouveaux statuts dans StatusBadge : `nouvelle`, `en_revue`, `validee`, `refusee`

### Visibilite admin
- Les demandes apparaissent dans la page **Clients** (detail client) et dans la page **Dossiers** via un onglet/section "Demandes"
- L'admin peut cliquer sur une demande pour voir le detail complet et changer le statut (en_revue, validee, refusee)
- Quand une demande est validee, l'admin peut la transformer en dossier (ajout dans la liste dossiers)

---

## 2. Page detail dossier (`/admin/dossiers/:id` et `/client/dossiers/:id`)

### Admin : `/admin/dossiers/:id`
- En-tete avec reference, client, prestation, montant, statut
- Timeline/progres du dossier avec etapes (Demande recue, Devis envoye, Devis accepte, En cours, Livraison, Termine)
- Section "Documents associes" : liste des devis et factures lies a ce dossier
- Possibilite de changer le statut du dossier
- Bouton pour creer un devis ou une facture directement associe a ce dossier

### Client : `/client/dossiers/:id`
- Vue similaire mais en lecture seule
- Visualisation de l'avancement, des devis et factures lies
- Acces direct au paiement depuis les factures listees

---

## 3. Edition devis et factures (espace admin)

### Admin Facturation -- Onglets Devis / Factures
- Refonte de la page `/admin/facturation` avec 2 onglets : **Factures** et **Devis**
- Bouton "Nouveau devis" : Dialog avec champs client (select), dossier (select filtre par client), description/titre, lignes de prestation (description + montant), date de validite
- Bouton "Nouvelle facture" : Dialog avec champs client (select), dossier (select), montant, date d'echeance
- Les devis et factures crees apparaissent dans les listes respectives

### Validation cote client
- Dans `/client/devis` : bouton "Accepter" / "Refuser" sur les devis en attente, avec confirmation (Dialog)
- Dans `/client/factures` : bouton "Payer" sur les factures en attente, qui redirige vers la page de paiement

---

## 4. Page de paiement (`/client/paiement/:factureId`)

- Page dediee accessible depuis l'espace client (factures)
- Affiche le recapitulatif : reference facture, client, dossier associe, montant, echeance
- Formulaire de paiement simule (en mode demo) : choix methode (carte bancaire, virement), champs carte (numero, expiration, CVV -- pre-remplis en demo)
- Bouton "Confirmer le paiement" avec animation de validation
- Apres paiement : statut de la facture passe a "payee" dans le state local
- La facture apparait comme "Payee" dans l'espace client ET dans l'espace admin (via state partage en memoire)

---

## Details techniques

### Nouveaux fichiers
```text
src/pages/client/ClientDemandes.tsx           -- Page demandes client
src/pages/client/ClientPaiement.tsx           -- Page paiement facture
src/pages/client/ClientDossierDetail.tsx      -- Detail dossier cote client
src/pages/admin/AdminDossierDetail.tsx        -- Detail dossier cote admin
```

### Fichiers modifies
```text
src/data/mockData.ts                          -- Types Demande, donnees mock, helpers
src/components/admin/StatusBadge.tsx          -- Statuts nouvelle, en_revue, validee, refusee
src/components/admin/ClientSidebar.tsx        -- Lien "Demandes" avec icone Send/PlusCircle
src/components/AnimatedRoutes.tsx             -- Routes /client/demandes, /client/paiement/:id, /client/dossiers/:id, /admin/dossiers/:id
src/pages/admin/AdminBilling.tsx              -- Onglets Devis/Factures + formulaires creation
src/pages/admin/AdminDossiers.tsx             -- Liens vers detail dossier + section demandes
src/pages/admin/AdminClients.tsx              -- Affichage demandes dans detail client
src/pages/client/ClientDossiers.tsx           -- Liens vers detail dossier
src/pages/client/ClientDevis.tsx              -- Boutons Accepter/Refuser
src/pages/client/ClientFactures.tsx           -- Bouton Payer (lien vers page paiement)
src/pages/client/ClientDashboard.tsx          -- KPI demandes + lien rapide
```

### Gestion d'etat
- Toutes les donnees restent en mock (pas de base de donnees)
- Pour permettre la synchronisation entre espaces admin et client en mode demo, on utilisera un **state global leger** via un contexte React (`DemoDataContext`) qui wrappera les donnees mutables (factures, devis, demandes, dossiers)
- Ce contexte exposera des fonctions : `updateFactureStatut()`, `updateDevisStatut()`, `addDemande()`, `updateDemandeStatut()`, `addDevis()`, `addFacture()`, `addDossier()`
- Les pages existantes seront mises a jour pour lire depuis ce contexte au lieu d'importer directement les tableaux mock

### Librairies utilisees (toutes deja installees)
- `framer-motion` pour les animations
- `lucide-react` pour les icones (Send, CreditCard, CheckCircle, etc.)
- Composants Shadcn : Dialog, Tabs, Select, Input, Textarea
- `react-router-dom` pour les routes dynamiques (useParams)
- `sonner` pour les toasts de confirmation
