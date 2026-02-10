

# Audit du Back-Office : Flux, Notifications et Emails

## Resultat de l'audit

### 1. Flux Demande -> Dossier -> Devis -> Facture

Le chainage fonctionnel est en place :
- **Demande -> Dossier** : fonctionne via `handleTransformDemande` dans `AdminDossiers.tsx`
- **Dossier -> Devis** : les devis peuvent etre associes a un dossier via `dossierId` dans `AdminBilling.tsx`
- **Dossier -> Facture** : idem, les factures sont liees aux dossiers
- **Vue dossier** : `AdminDossierDetail.tsx` affiche bien les devis et factures associes

Pas de probleme sur le chainage des donnees.

---

### 2. Probleme majeur : Notifications et Email Logs absents en mode reel

En **mode demo**, tout est parfaitement integre : chaque action (nouvelle demande, changement de statut, paiement, devis, etc.) cree automatiquement des notifications ET des logs email via le `DemoDataContext`.

En **mode reel (base de donnees)**, ces mecanismes sont **absents** :

| Action | Email Edge Function | Notification creee | Email Log cree |
|--------|--------------------|--------------------|----------------|
| Nouvelle demande | Oui (send-demande-reception) | NON | NON |
| Statut demande (validee/refusee) | Oui (send-demande-statut) | NON | NON |
| Nouveau devis | Oui (send-devis) | NON | NON |
| Signature devis | Non | NON | NON |
| Facture payee | Oui (send-paiement) | NON | NON |
| Nouvelle facture | Non | NON | NON |
| Changement statut dossier | Non | NON | NON |
| Relance envoyee | Oui (send-relance) | Non | OUI (seul cas correct) |

**Seules les relances** utilisent correctement `pushEmail` du hook `useEmailLogs` en mode reel.

---

### 3. Plan de correction

Ajouter dans chaque hook reel les appels a `addNotification` et `pushEmail` qui existent deja en mode demo :

#### Fichier `src/hooks/use-demandes.ts`
- `addDemande` : apres l'envoi de l'email Edge Function, creer une notification admin ("Nouvelle demande") + notification client ("Demande envoyee") + log email
- `updateStatut` : apres l'envoi de l'email statut, creer une notification client ("Demande validee/refusee") + log email

#### Fichier `src/hooks/use-devis.ts`
- `addDevis` : creer une notification client ("Nouveau devis disponible") + log email
- `updateSignature` : creer une notification admin ("Devis signe par le client") + log email
- `updateStatut` : creer une notification selon le nouveau statut

#### Fichier `src/hooks/use-factures.ts`
- `addFacture` : creer une notification client ("Nouvelle facture") + log email
- `updateStatut` (payee) : apres l'envoi de l'email paiement, creer une notification admin ("Paiement recu") + notification client ("Paiement confirme") + log email

#### Fichier `src/hooks/use-dossiers.ts`
- `updateStatut` : creer une notification client quand le statut change
- `addDossier` : creer une notification admin + client

#### Approche technique

Chaque hook devra importer et utiliser `supabase.from("notifications").insert(...)` et `supabase.from("email_logs").insert(...)` directement (sans passer par les hooks React, car on est deja dans un `mutationFn`). Les insertions seront faites en parallele avec `Promise.all` pour ne pas ralentir le flux principal, et enveloppees dans des try/catch pour ne pas bloquer l'action principale en cas d'echec.

Le modele a suivre est exactement celui du `DemoDataContext` qui definit deja tous les messages, titres et contenus pour chaque evenement.

---

### 4. Estimation

- 6 fichiers a modifier (4 hooks + verification des 2 pages admin)
- ~15-20 insertions de notifications/emails a ajouter
- Aucune modification de schema necessaire (les tables `notifications` et `email_logs` existent deja avec les bonnes colonnes et RLS)

