
# Page /admin/emails et exports CSV analytiques

## 1. Page /admin/emails -- Historique complet des emails simules

### Nouvelle page `src/pages/admin/AdminEmails.tsx`
Page dediee affichant l'historique complet des emails simules depuis `useDemoData().emailLogs`, avec :

- **En-tete** : titre "Journal des emails", compteur total, bouton "Exporter CSV"
- **Filtres** : barre de boutons filtrant par type d'email (Tous, Relance, Devis, Paiement, Demande, Validation) -- utilise les types de `EmailLogType`
- **Barre de recherche** : filtre texte sur destinataire, sujet ou reference
- **Liste** : reutilise le composant `EmailLogPanel` existant sans `maxItems` (affichage complet), avec le Dialog de detail deja integre
- **Export CSV emails** : bouton generant un CSV (id, type, destinataire, sujet, date, reference)

### Navigation sidebar
- Ajouter l'entree "Emails" dans `AdminSidebar.tsx` avec l'icone `Mail` de lucide-react, positionnee entre "Relances" et "Support"

### Route
- Ajouter la route `/admin/emails` dans `AnimatedRoutes.tsx`

## 2. Exports CSV analytiques

### Utilitaire `src/lib/exportCsv.ts` (nouveau fichier)
Fonction generique reutilisable :
```text
exportCsv(filename: string, headers: string[], rows: string[][])
```
- Genere un fichier CSV avec encodage UTF-8 BOM (pour Excel)
- Declenche le telechargement via un lien temporaire

### Boutons d'export dans `AdminAnalytics.tsx`
Ajouter 3 boutons d'export a cote du bouton PDF existant :
- **Export Factures CSV** : reference, client, montant, statut, date emission, echeance
- **Export Demandes CSV** : reference, client, titre, type prestation, statut, date creation
- **Export Clients CSV** : nom, prenom, email, entreprise, statut, date creation, nombre dossiers

Les donnees sont prises depuis `useDemoData()` (factures, demandes) et `clients` (import mockData).

## Details techniques

### Fichiers crees
```
src/pages/admin/AdminEmails.tsx    -- Page historique emails avec filtres
src/lib/exportCsv.ts               -- Utilitaire CSV generique
```

### Fichiers modifies
```
src/components/admin/AdminSidebar.tsx  -- Ajout entree "Emails" (icone Mail)
src/components/AnimatedRoutes.tsx      -- Ajout route /admin/emails
src/pages/admin/AdminAnalytics.tsx     -- Ajout boutons export CSV
```

### Aucune dependance supplementaire
Tout utilise les APIs natives (Blob, URL.createObjectURL) et les composants/librairies deja installes.
