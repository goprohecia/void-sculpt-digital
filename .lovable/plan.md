

## Module 07 — Multi-assignation sur un même dossier

### Audit

| Élément | Statut |
|---|---|
| Checkbox multiple dans AssignModal | **OK** — déjà fonctionnel |
| Désignation explicite du responsable (étoile/radio) | **Manquant** — le responsable est implicitement le 1er coché (ordre de clic), pas de contrôle explicite |
| Validation bloquante si aucun responsable | **Manquant** — le bouton est juste disabled si 0 sélectionné |
| Auto-responsable si 1 seul coché | **Manquant** — fonctionne par hasard (index 0) mais pas explicite |
| Récap visuel "1 responsable + N renfort" | **Manquant** — juste un compteur |
| Bouton "+" ajouter pro dans vue dossier | **Manquant** — seul "Modifier l'assignation" existe |
| Bouton × retirer un pro avec confirmation | **Manquant** |
| Changement de responsable par clic étoile | **Manquant** |

### Plan d'implémentation

#### 1. Refonte `AssignModal.tsx`

Remplacer la logique "premier coché = responsable" par un état explicite :
- Ajouter `responsableId: string | null` au state
- Chaque membre coché affiche une icône étoile cliquable (pleine = responsable, vide = renfort)
- Si 1 seul coché → `responsableId` auto-set sur lui
- Si responsable décoché → reset `responsableId` à null
- Bouton Confirmer disabled si `selected.length === 0` OU `responsableId === null`
- Message d'erreur "Vous devez désigner un responsable" si sélection sans responsable
- Récap en bas : "1 responsable + N en renfort" dynamique

Accepter nouvelle prop optionnelle `filterOut?: string[]` pour le mode "ajouter" (pré-filtrer les déjà assignés).

#### 2. Enrichir la section "Équipe assignée" dans `AdminDossierDetail.tsx`

Pour chaque pro assigné :
- Ajouter icône étoile cliquable : clic sur étoile d'un renfort → le passe responsable, l'ancien responsable devient renfort (mutation directe via `assignDossier`)
- Ajouter bouton × → AlertDialog "Retirer [Prénom Nom] de ce dossier ?" → au clic confirmer, retirer du tableau assignments et appeler `assignDossier` avec le tableau filtré
- Si retrait du responsable → empêcher ou forcer la désignation d'un nouveau responsable

Ajouter bouton "+" à côté du titre "Équipe assignée" → ouvre AssignModal avec `filterOut` = IDs déjà assignés, mode ajout (les nouveaux s'ajoutent aux existants au lieu de remplacer).

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/components/admin/AssignModal.tsx` | État `responsableId` explicite, étoile cliquable, validation bloquante, récap visuel, prop `filterOut` |
| `src/pages/admin/AdminDossierDetail.tsx` | Étoile inline pour changer responsable, bouton × avec confirmation, bouton "+" pour ajout partiel |

