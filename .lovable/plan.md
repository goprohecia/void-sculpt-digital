

# Plan — Mise à jour contenu vitrine + cohérence modules admin/salarié

## Analyse des écarts

### A. Landing page — contenu manquant par rapport aux screenshots

| Element | Statut actuel | Action |
|---|---|---|
| Section "Le concept clé : espaces et modules" | Absente | Créer nouvelle section |
| 12 modules dans RealisationsSection | Seulement 7 affichés | Ajouter les 5 manquants (Vue d'ensemble, Salariés, Rendez-vous, Relances, Emails) |
| Prix annuels | 1500/2500/4000 | Corriger → 1260/2100/3360 |
| Engagement Enterprise | Non mentionné | Ajouter "6 mois minimum" |
| "Inclus dans toutes les offres" | Partiellement présent | Ajouter sous-domaine exemple, mises à jour, prise de RDV |
| Section "Cibles prioritaires" | Absente | Créer section avec tableau 3 colonnes |
| Section "Pourquoi MBA vs concurrence" | Absente | Créer section problème/solution |

### B. Cohérence modules admin ↔ salarié

Actuellement l'espace salarié n'a que 6 modules hardcodés (overview, dossiers, calendrier, messagerie, stock, profil). Il devrait pouvoir accéder aux mêmes modules que l'admin (facturation, support, rendez-vous, relances, analyse, emails) si l'admin les active.

---

## Taches

### 1. Corriger les prix dans OffresSection

- `priceAnnual`: 1500→1260, 2500→2100, 4000→3360
- Ajouter ligne "Engagement" : Starter/Business = "Sans engagement", Enterprise = "6 mois minimum"
- Mettre à jour features Enterprise: ajouter "Module sur mesure (sur devis)"

### 2. Compléter RealisationsSection (12 modules)

Ajouter les 5 modules manquants avec icônes :
- Vue d'ensemble (LayoutDashboard)
- Salariés (Users)
- Rendez-vous (CalendarDays)
- Relances (Bell)
- Emails (Mail)

### 3. Créer section "ConceptSection" — Le concept clé

Nouvelle section entre ProofStrip et ServicesSection dans Index.tsx :
- Titre "Le concept clé : les espaces et les modules"
- Explication du système d'espaces personnalisables
- Exemple concret (magasin de robes de mariée → 4 espaces)
- Grille des 12 modules disponibles

### 4. Créer section "CiblesSection" — Nos cibles prioritaires

Tableau 3 colonnes (Tech & Digital / Services & Conseil / Commerce & Événementiel) avec les métiers listés dans le screenshot. Placée après OffresSection.

### 5. Créer section "ArgumentsSection" — Pourquoi MBA

Tableau comparatif problème/solution (6 lignes) : coût, multi-outils, généricité, espace client, facturation, paiement. Remplace ou complète PrincipesSection.

### 6. Mettre à jour "Inclus dans toutes les offres"

Dans OffresSection, ajouter :
- Sous-domaine personnalisé (ex : monentreprise.mybusinessassistant.com)
- Mises à jour incluses
- Prise de RDV en ligne

### 7. Enrichir les modules salarié (cohérence admin)

**`use-app-settings.ts`** : Étendre `ALL_EMPLOYEE_MODULES` pour inclure tous les modules que l'admin peut activer :
- Ajouter : clients, facturation, relances, emails, rendez-vous, support, analyse

**`EmployeeSidebar.tsx`** : Ajouter les nav items correspondants (avec les mêmes icônes que l'admin).

**Pages salarié** : Créer les pages manquantes (ou réutiliser les pages admin en read-only) :
- `EmployeeClients.tsx`, `EmployeeFacturation.tsx`, `EmployeeRelances.tsx`, `EmployeeEmails.tsx`, `EmployeeRendezVous.tsx`, `EmployeeSupport.tsx`, `EmployeeAnalyse.tsx`

**`AnimatedRoutes.tsx`** : Ajouter les routes employee correspondantes.

**`AdminSettings.tsx`** : La section "Modules visibles côté salarié" affichera automatiquement les nouveaux modules puisqu'elle itère sur `ALL_EMPLOYEE_MODULES`. L'admin pourra activer/désactiver chaque module pour ses salariés, et seuls les modules que l'admin a lui-même activés seront proposables (filtre supplémentaire).

### 8. Contrainte d'abonnement sur les modules salarié/client

Dans `AdminSettings.tsx`, filtrer les modules salarié/client affichables : un module ne peut être activé côté salarié/client que si l'admin l'a lui-même activé dans son plan. Afficher un badge "Désactivé côté admin" pour les modules non activés.

---

## Fichiers impactés

| Fichier | Action |
|---|---|
| `OffresSection.tsx` | Prix, engagement, inclus |
| `RealisationsSection.tsx` | 12 modules |
| `src/components/sections/ConceptSection.tsx` | **Créer** |
| `src/components/sections/CiblesSection.tsx` | **Créer** |
| `src/components/sections/ArgumentsSection.tsx` | **Créer** |
| `src/components/sections/index.ts` | Exporter nouvelles sections |
| `src/pages/Index.tsx` | Ajouter nouvelles sections |
| `use-app-settings.ts` | Étendre ALL_EMPLOYEE_MODULES |
| `EmployeeSidebar.tsx` | Ajouter nav items |
| `AdminSettings.tsx` | Filtre cohérence admin→salarié |
| `src/pages/employee/Employee*.tsx` | **Créer** ~7 pages |
| `AnimatedRoutes.tsx` | Routes employee |

