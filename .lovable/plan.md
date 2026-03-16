

# AUDIT MBA — Bible Produit v3 vs. État Actuel

## Méthodologie

Comparaison systématique de chaque section de la Bible Produit v3 avec le code existant. Verdict par section : **OK** (conforme), **PARTIEL** (existe mais incomplet), **MANQUANT** (à développer).

---

## 1. VISION GLOBALE — Tronc commun

| Point Bible | État | Détail |
|---|---|---|
| Principe « tronc commun unique » — pas de structures par métier | **PARTIEL** | Le code a un système de module overrides par secteur (`sectorModules.ts`) qui renomme les labels, mais la structure technique est bien unique. Conforme en architecture. |
| Règle « toute fonctionnalité s'applique à tous les secteurs » | **OK** | Les modules sont les mêmes pour tous, seuls les labels changent. |

---

## 2. LES TROIS OFFRES

| Point Bible | État | Détail |
|---|---|---|
| Starter 150€ / Business 250€ / Enterprise 500€ | **OK** | `DEFAULT_PLAN_PRICES` dans `DemoPlanContext.tsx` correspond. |
| Socle fixe = Clients & Dossiers + Analyse (toujours inclus, hors quota) | **PARTIEL** | `clients` et `dossiers` sont dans les plans mais comptés dans le quota. `analyse` n'est pas listée comme « toujours incluse hors quota ». Il faut les exclure du décompte. |
| Starter = socle + 3 modules au choix | **PARTIEL** | Le code a `["clients", "dossiers", "facturation"]` — 3 modules mais inclut clients/dossiers dans le quota au lieu de les traiter comme socle fixe. |
| Business = socle + 6 modules au choix | **PARTIEL** | Même problème — 6 modules listés incluent clients/dossiers. |
| Enterprise = socle + TOUS les modules | **OK** | Valeur `"all"`. |
| Modules verrouillés grisés avec badge offre requise | **PARTIEL** | Le système d'upsell existe dans `AdminModulesSection.tsx` mais le comportement « grisé + modal d'upsell au clic » n'est pas systématique dans la sidebar et les pages. |
| Nom du module « Clients & Dossiers » adapté au secteur | **PARTIEL** | Les overrides existent mais séparément pour `clients` et `dossiers` — la Bible demande UN module fusionné « Clients & Dossiers ». |

---

## 3. ONBOARDING — Tunnel d'inscription

| Point Bible | État | Détail |
|---|---|---|
| 4 étapes : Formule → Secteur → Modules → Compte | **NON CONFORME** | L'onboarding actuel a 4 étapes mais différentes : Secteur → Taille équipe → Rôles → Récap. Il manque le choix de formule (étape 1) et la sélection des modules (étape 3). La création du compte n'est pas dans le wizard. |
| Étape 1 — Choix de la formule avec 3 offres | **MANQUANT** | Pas de sélection de plan dans l'onboarding. |
| Étape 2 — Secteurs regroupés par catégories avec headers | **MANQUANT** | Les secteurs sont affichés en grille plate sans catégories (Réparation & Technique, Accompagnement & Conseil, etc.). |
| 7 catégories avec emojis spécifiques par secteur | **PARTIEL** | Les emojis existent dans `SECTORS` mais ne correspondent pas tous à la Bible (ex: Boutique = 🛍️ au lieu de 🛑). |
| Nom employé et nom client par secteur | **MANQUANT** | Aucune donnée `nom_employe` / `nom_client` n'est stockée dans `SECTORS`. La Bible définit précisément ces termes (Mécanicien, Moniteur, Élève, Mariée, Propriétaire, etc.). |
| 3 secteurs manquants : Centre islamique, Association sportive, Salle de Sport/Coach (distinct de coach-sportif) | **MANQUANT** | `centre-islamique` et `association-sportive` n'existent pas dans `SECTORS`. |
| Étape 3 — Sélection des modules avec socle fixe séparé | **MANQUANT** | Pas de sélection de modules dans l'onboarding. |
| Modules pré-sélectionnés par secteur (section 7 de la Bible) | **PARTIEL** | `DEFAULT_SECTOR_RECOMMENDATIONS` existe mais ne correspond pas exactement aux pré-sélections de la Bible. |
| Étape 4 — Création du compte (nom, prénom, email, mdp, entreprise) | **MANQUANT** | L'onboarding se fait post-connexion, pas à l'inscription. |

---

## 4. STRUCTURE DES TROIS ESPACES

| Point Bible | État | Détail |
|---|---|---|
| Espace Admin — navigation sidebar conforme | **PARTIEL** | La sidebar existe mais ne correspond pas exactement aux sections PRINCIPAL / COMMERCIAL / OUTILS / GESTION / ESPACES PERSONNALISÉS / BAS DE SIDEBAR. |
| Espace Salarié — droits définis (voir/gérer ses dossiers, avancer timeline Business+) | **PARTIEL** | L'espace employé existe mais la restriction « avancer timeline seulement Business/Enterprise » n'est pas implémentée. |
| Espace Client — droits définis (lecture timeline, RDV, paiements, docs, messages) | **PARTIEL** | L'espace client existe mais pas tous les éléments listés. |
| Messagerie — règles par rôle (client → Admin uniquement, employé → groupés) | **PARTIEL** | La messagerie existe mais les restrictions strictes ne sont pas implémentées. |
| Fiche unifiée Admin — pas de bouton « Voir espace client » | **À VÉRIFIER** | Le concept de fiche unifiée n'est pas clairement implémenté. |

---

## 5. FICHE CLIENT / DOSSIER

| Point Bible | État | Détail |
|---|---|---|
| En-tête avec nom, badge type, email, tel, employé assigné, boutons action | **PARTIEL** | La fiche dossier existe (`AdminDossierDetail.tsx`) mais pas tous les éléments requis. |
| Timeline des étapes (verte/en cours/grise) | **OK** | Système de timeline avec `sectorTimelines.ts` et `dossier_timeline`. |
| Blocs financiers (montant total, encaissé, restant dû) — admin uniquement | **PARTIEL** | Champs `montant` sur dossier mais pas les blocs visuels complets. |
| 8 onglets obligatoires (Résumé, RDV, Paiements, Documents, Photos, Mesures, Messages, Notes) | **MANQUANT** | L'onglet « Mesures » n'existe pas. Les 8 onglets ne sont pas tous présents dans la fiche. |
| États vides avec message + bouton d'action | **PARTIEL** | Pas systématique. |

---

## 6. VOCABULAIRE & ÉTAPES PAR MÉTIER

| Point Bible | État | Détail |
|---|---|---|
| Étapes de timeline par secteur (Garage: 7 étapes, BTP: 7 étapes, etc.) | **PARTIEL** | `sectorTimelines.ts` existe avec des étapes mais ne correspond pas exactement aux étapes de la Bible pour chaque secteur. |
| Vocabulaire client/employé par secteur | **MANQUANT** | Le système `metier_vocabulaire` existe en DB mais n'a pas les mappings nom employé/nom client de la Bible. |
| Secteurs « Éducation & Formation » avec client → Élève/Membre | **MANQUANT** | Les cas spéciaux (Élève pour auto-école/centre islamique, Membre pour asso sportive, Mariée pour mariage, Propriétaire pour conciergerie) ne sont pas implémentés. |

---

## 7. MODULES PRÉ-SÉLECTIONNÉS PAR SECTEUR

| Point Bible | État | Détail |
|---|---|---|
| Liste de 6 modules recommandés par secteur (27 secteurs) | **PARTIEL** | `DEFAULT_SECTOR_RECOMMENDATIONS` existe pour 24 secteurs mais les modules listés ne correspondent pas toujours à la Bible (ex: la Bible liste « Signature électronique » pour beaucoup de secteurs, absent du code). |

---

## 8. CATALOGUE COMPLET DES MODULES

| Point Bible | État | Détail |
|---|---|---|
| 28 modules listés dans la Bible | **PARTIEL** | `ALL_MODULE_KEYS` a 22 modules. Modules manquants : Facturation jalons, Messagerie groupée, Signature électronique, Formulaires, Avis client auto, Abonnement récurrent, Livrables, Sprints & Tickets, Time Tracking, Dashboard métier, White Label, Intelligence IA. Certains existent sous d'autres noms. |
| Droits par module (Admin/Salarié/Client) | **PARTIEL** | Le système de permissions existe mais pas le mapping fin module→droits par rôle. |

---

## 9. DONNÉES DE DÉMONSTRATION

| Point Bible | État | Détail |
|---|---|---|
| Données démo cohérentes par secteur (noms, montants, étapes) | **PARTIEL** | Quelques données démo existent (ex: `mockMariageData.ts`) mais pas pour tous les secteurs et pas systématiquement cohérentes. |

---

## 10. COMPORTEMENTS UI OBLIGATOIRES

| Point Bible | État | Détail |
|---|---|---|
| Tout élément « lien » cliquable et fonctionnel | **PARTIEL** | |
| États vides avec message + action | **PARTIEL** | |
| Feedback utilisateur (toast, spinner, confirmation destructeur) | **OK** | Sonner + toasts en place. |
| Responsive et mobile | **OK** | `MobileBottomNav` + sidebar collapsible en place. |

---

## 11. ESPACES PERSONNALISÉS (Business & Enterprise)

| Point Bible | État | Détail |
|---|---|---|
| Table `custom_spaces` avec modules activés | **OK** | Table existe en DB. |
| Espaces recommandés par secteur (Conseillère, Retoucheuse, etc.) | **MANQUANT** | Pas de pré-configuration d'espaces personnalisés par secteur. |

---

## RÉSUMÉ DES ÉCARTS CRITIQUES

### À créer / refondre entièrement :
1. **Onboarding 4 étapes** conforme à la Bible (Formule → Secteur par catégorie → Modules → Compte)
2. **Secteurs par catégories** avec headers visuels (7 catégories)
3. **2 secteurs manquants** : Centre islamique, Association sportive
4. **Mapping nom employé / nom client** par secteur (Mécanicien, Moniteur, Élève, Mariée, Propriétaire, etc.)
5. **Socle fixe hors quota** : Clients & Dossiers + Analyse ne comptent pas dans le quota de modules
6. **Module fusionné « Clients & Dossiers »** au lieu de 2 modules séparés
7. **8 onglets obligatoires** dans la fiche dossier (dont Mesures)
8. **Modules manquants** dans le catalogue (Signature électronique, Messagerie groupée, etc.)

### À modifier / compléter :
1. **Étapes de timeline** par secteur à aligner avec la Bible
2. **Modules pré-sélectionnés** par secteur à aligner avec la Bible
3. **Modules verrouillés grisés** systématiquement dans la sidebar + modal upsell
4. **Restrictions de droits** par plan (avancer timeline = Business+ pour salarié)
5. **Règles messagerie** strictes (client → Admin uniquement)
6. **Fiche unifiée** Admin avec couches d'information par rôle

### Déjà conforme :
1. Architecture multi-tenant avec `compte_id`
2. Système de permissions granulaires (F-03)
3. Prix des 3 offres
4. Système de swap de modules
5. Feedback UI (toasts, spinners)
6. Responsive mobile

---

Ce document servira de référence pour les prochains développements. Envoyez-moi le premier module/section à implémenter et nous commencerons.

