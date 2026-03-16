

# Plan P2 — Refonte OnboardingWizard en 4 étapes Bible v3

## Résumé

Réécriture complète de `OnboardingWizard.tsx` pour passer de l'ancien flux (Secteur → Taille équipe → Rôles → Récap) au nouveau flux Bible v3 (Formule → Secteur par catégorie → Modules → Compte/Récap).

## Architecture

Le wizard reste dans `src/components/onboarding/OnboardingWizard.tsx`, appelé par `AdminLayout.tsx` (pas de changement d'intégration). On extrait chaque étape en sous-composant pour la lisibilité.

## Fichiers à créer / modifier

### 1. Nouveau fichier `src/data/sectorCategories.ts`

Données statiques des 7 catégories avec secteurs ordonnés, emojis, et rôles employé/client entre parenthèses :

```text
Catégorie 1 — Réparation & Technique
  🔧 Garage (Mécanicien / Client)
  📱 Réparateur (Technicien / Client)
  🏗️ BTP (Ouvrier / Client)

Catégorie 2 — Accompagnement & Conseil
  🧠 Consultant · 💪 Coach sportif · 🤝 Cabinet de Recrutement
  📚 Formateur · 📊 Expert-Comptable

Catégorie 3 — Créatif & Événementiel
  🎨 Designer · 📷 Photographe · 🎤 DJ/Animateur
  🎉 Événementiel · 📱 Community Manager

Catégorie 4 — Commerce & Services
  🛑 Boutique · 🏡 Conciergerie · 🧹 Nettoyage
  🍽️ Traiteur · ✂️ Coiffure

Catégorie 5 — Juridique & Administratif
  ⚖️ Cabinet d'Avocats · 🏠 Immobilier · 💻 Développeur

Catégorie 6 — Éducation & Formation
  🚗 Auto-école (Moniteur / Élève)
  🕌 Centre islamique (Professeur / Élève)
  ⚽ Association sportive (Entraîneur / Membre)

Catégorie 7 — Mariage & Haute Couture
  👗 Mariage (Conseillère + Retoucheuse / Mariée)
```

Ajout de 2 nouveaux secteurs dans `SECTORS` de `DemoPlanContext.tsx` : `centre-islamique` et `association-sportive`.

### 2. Réécriture `OnboardingWizard.tsx`

4 étapes avec état local : `plan`, `sector`, `selectedModules`, `formData`.

**Étape 1 — Choix de la formule** :
- 3 cartes : Starter 150€ / Business 250€ (badge "Recommandée", border primary) / Enterprise 500€
- Chaque carte affiche : prix, badge socle fixe, quota modules, 3 fonctionnalités clés
- Import `DEFAULT_PLAN_PRICES`, `QUOTA_LIMITS`, `SOCLE_FIXE` depuis `DemoPlanContext`

**Étape 2 — Secteur par catégorie** :
- Import `SECTOR_CATEGORIES` depuis `sectorCategories.ts`
- Affichage en sections avec headers visuels (emoji catégorie + titre)
- Chaque secteur = bouton avec emoji + label + `(rôle employé / rôle client)` en dessous
- Scroll vertical, pas de sous-navigation

**Étape 3 — Sélection des modules** :
- Section "Toujours inclus" : les 4 modules du socle fixe, non cliquables, avec badge "Inclus"
- Section "Modules additionnels" : tous les modules hors socle
- Pré-cochage automatique via `DEFAULT_SECTOR_RECOMMENDATIONS[sector]` (tronqué au quota)
- Compteur visible : `X / 3 modules sélectionnés`
- Modules au-delà du quota : grisés avec badge "Disponible en Business" ou "Enterprise"
- Bouton "Modifier ma formule" → retour étape 1

**Étape 4 — Création du compte** :
- Formulaire gauche : Prénom, Nom, Email, Mot de passe, Nom de l'entreprise
- Récap droite : formule + secteur + modules sélectionnés
- Bouton "Valider et démarrer" → appel `generate-account-structure` existant avec `sector`, `plan`, `modules`
- Après succès : `onComplete()`

### 3. Mises à jour mineures

- **`DemoPlanContext.tsx`** : ajouter `centre-islamique` et `association-sportive` dans `SECTORS` et `DEFAULT_SECTOR_RECOMMENDATIONS`
- **`sectorModules.ts`** : ajouter overrides pour les 2 nouveaux secteurs + entries dans `SECTOR_ROLE_LABELS`
- **`onboardingRoles.ts`** : ajouter les rôles pour les 2 nouveaux secteurs

### 4. Ce qui ne change PAS

- `AdminLayout.tsx` : même appel `<OnboardingWizard onComplete={markComplete} />`
- `use-onboarding.ts` : inchangé
- Edge Function `generate-account-structure` : inchangée (on lui passe les mêmes données + plan + modules en plus)
- Aucune migration DB

## Section technique

L'état du wizard :
```typescript
const [step, setStep] = useState(0);
const [plan, setPlan] = useState<SubscriptionPlan>("business");
const [sector, setSector] = useState<SectorKey | null>(null);
const [selectedModules, setSelectedModules] = useState<string[]>([]);
const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", company: "" });
```

La logique de sélection de modules respecte le quota :
```typescript
const quota = QUOTA_LIMITS[plan];
const canSelect = quota === null || selectedModules.length < quota;
```

Le pré-cochage à l'entrée de l'étape 3 :
```typescript
useEffect(() => {
  if (step === 2 && sector) {
    const recommended = DEFAULT_SECTOR_RECOMMENDATIONS[sector] || [];
    const quota = QUOTA_LIMITS[plan];
    setSelectedModules(quota === null ? recommended : recommended.slice(0, quota));
  }
}, [step]);
```

