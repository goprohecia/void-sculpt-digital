

## Module 10 — Notifications automatiques client au changement d'étape

### Audit

| Élément | Statut |
|---|---|
| Notifications automatiques au changement d'étape | **Manquant** — `DossierTimeline.markStepComplete` affiche un toast admin mais n'envoie rien au client |
| Section "Notifications par étape" dans Paramètres | **Manquant** — l'onglet Notifications actuel ne gère que les préférences email admin |
| Templates pré-remplis par métier | **Manquant** |
| Variables cliquables {nom_client}, {date}, etc. | **Manquant** |
| Indicateur enveloppe/SMS sur les étapes | **Manquant** |

### Plan d'implémentation

#### 1. Données — Nouveau fichier `src/data/stepNotificationTemplates.ts`

Exporter un dictionnaire `STEP_NOTIFICATION_DEFAULTS: Record<string, Record<string, { message: string; canal: "sms" | "email" | "both"; enabled: boolean }>>` mappant chaque secteur à ses étapes avec messages par défaut :
- Garage / "Prêt à récupérer" → message fourni dans le brief
- Coiffure / "Confirmé" → message avec {date} {heure}
- Conciergerie / "Ménage terminé" → message fourni
- BTP / "Chantier démarré" → message fourni
- Fallback générique pour les secteurs sans template spécifique

#### 2. Nouveau composant `src/components/admin/StepNotificationSettings.tsx`

Composant affiché dans un nouvel onglet ou sous-section "Suivi client" dans AdminSettings :
- Lit le secteur actif via `useDemoPlan()` et les étapes du timeline actif via `SECTOR_TIMELINE_PRESETS`
- Pour chaque étape : toggle enabled, sélecteur canal (SMS / Email / Les deux), zone de texte message
- Variables cliquables sous chaque textarea : `{nom_client}`, `{date}`, `{heure}`, `{nom_business}` — clic = insertion au curseur
- Si message vidé → auto-reset au template par défaut du métier (via `onBlur`)
- State local persisté via `useRef` en mode démo (comme les timelines)
- Bouton "Enregistrer" avec toast de confirmation

#### 3. Intégration dans `AdminSettings.tsx`

Ajouter un nouvel onglet "Suivi client" (icône `BarChart3` ou `Bell`) dans la `TabsList` existante, avec `<TabsContent value="suivi-client">` rendant `<StepNotificationSettings />`.

#### 4. Modifier `DossierTimeline.tsx` — Simulation d'envoi

Dans `markStepComplete()` :
- Lire la config de notification pour l'étape validée
- Si enabled : afficher un toast enrichi "Notification envoyée à {nom_client} par SMS / Email" au lieu du toast générique actuel
- Ajouter une icône enveloppe (`Mail`) ou téléphone (`Phone`) sur les étapes où une notification est configurée et activée (à côté de l'icône `MessageSquare` des notes)

### Fichiers à créer / modifier

| Fichier | Action |
|---|---|
| `src/data/stepNotificationTemplates.ts` | **Créer** — templates par défaut par secteur |
| `src/components/admin/StepNotificationSettings.tsx` | **Créer** — UI config par étape |
| `src/pages/admin/AdminSettings.tsx` | **Modifier** — ajouter onglet "Suivi client" |
| `src/components/admin/DossierTimeline.tsx` | **Modifier** — toast enrichi + icônes notification |

