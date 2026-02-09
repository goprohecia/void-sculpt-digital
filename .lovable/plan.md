
# Commentaires admin visibles client + Notifications CDC + Etape CDC dans la timeline

## 1. Commentaires admin visibles cote client (lecture seule)

### Fichier : `src/pages/client/ClientDossierDetail.tsx`
- Apres la section CDC (banniere ou section cahier des charges), afficher une carte "Retours de l'equipe" si `cahier?.commentairesAdmin` existe
- Affichage en lecture seule avec icone MessageSquare et texte du commentaire
- Style discret : carte glass avec bordure subtile

### Fichier : `src/pages/client/ClientDemandes.tsx`
- Sur chaque carte de demande, si le CDC a un commentaire admin, afficher un petit indicateur "Retour equipe" cliquable
- Au clic, ouvrir un petit dialog ou toast affichant le commentaire

## 2. Notifications quand l'admin commente le CDC

### Fichier : `src/contexts/DemoDataContext.tsx`
- Modifier la fonction `updateCahierComment` pour :
  - Retrouver la demande associee au `demandeId`
  - Appeler `pushNotif` avec type `"dossier"`, titre "Nouveau commentaire CDC", description incluant le titre de la demande
  - Destinataire : `"client"` avec le `clientId` de la demande
  - Lien vers `/client/dossiers` ou `/client/demandes`
  - Envoyer aussi un email log via `pushEmail`

## 3. Etape "Cahier des charges" dans la barre de progression

### Fichiers : `src/pages/client/ClientDossierDetail.tsx` et `src/pages/admin/AdminDossierDetail.tsx`

Modifier la liste des etapes de 6 a 7 :

```text
Actuel :  Demande recue > Devis envoye > Devis accepte > En cours > Livraison > Termine
Nouveau : Demande recue > Devis envoye > Devis accepte > Cahier des charges > En cours > Livraison > Termine
```

- L'etape "Cahier des charges" (index 3) est validee uniquement quand le CDC a le statut "complet"
- Si le dossier est "en_cours" mais le CDC n'est pas complet, la progression s'arrete a l'etape 3 (Devis accepte) et l'etape 4 (CDC) est en attente
- Si le CDC est complet, l'etape 4 est validee et la progression continue normalement

Mise a jour de la fonction `getEtapeIndex` dans les deux fichiers :

```text
Client :
  en_attente -> 1
  en_cours + CDC non complet -> 2 (bloque a Devis accepte)
  en_cours + CDC complet -> 4 (En cours)
  termine -> 6

Admin :
  en_attente -> 1
  en_cours + CDC non complet -> 2
  en_cours + CDC complet -> 4
  termine -> 6
```

- L'etape "Cahier des charges" dans la timeline aura une icone FileText distincte au lieu du numero
- Cote client, l'etape affichera "A remplir" ou "Valide" en sous-texte

## Resume des fichiers concernes

| Fichier | Modifications |
|---------|--------------|
| `src/contexts/DemoDataContext.tsx` | Notification + email dans `updateCahierComment` |
| `src/pages/client/ClientDossierDetail.tsx` | Commentaire admin en lecture seule, timeline 7 etapes, logique CDC |
| `src/pages/admin/AdminDossierDetail.tsx` | Timeline 7 etapes avec etape CDC, logique adaptee |
| `src/pages/client/ClientDemandes.tsx` | Indicateur retour equipe sur les cartes |
