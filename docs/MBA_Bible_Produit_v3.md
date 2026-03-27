# MBA — Bible Produit v3
## Document de référence complet — Impartial Games 2026

> Ce document est la référence absolue. Chaque élément, vocabulaire et comportement UI décrit ici doit être implémenté tel quel.

---


Ce document est la référence absolue pour Lovable.
Chaque élément, chaque vocabulaire, chaque comportement UI décrit ici doit être implémenté tel quel.


## 1. VISION GLOBALE DU PRODUIT

MBA — My Business Assistant est un outil de gestion métier configurable destiné aux indépendants, TPE et PME de tous secteurs. Ce n’est pas un outil comptable. C’est un assistant business qui comprend le vocabulaire, les étapes de travail et les besoins spécifiques de chaque secteur d’activité.
MBA se structure autour de trois espaces distincts : l’espace Admin (le propriétaire / gérant), l’espace Salarié (les employés / collaborateurs), et l’espace Client (le client final).

Principe fondamental : le tronc commun
Le terme « client » ne change pas selon le corps de métier sauf exceptions définies. Ce qui change entre les secteurs, c’est uniquement le nom de l’employé et le contexte métier. Lovable ne doit JAMAIS créer des structures différentes pour chaque métier.
RÈGLE CRITIQUE LOVABLE : Toute fonctionnalité ajoutée s’applique automatiquement à TOUS les corps de métier. Il n’y a pas de fonctionnalités exclusives à un secteur — seulement des modules activés ou non.


## 2. LES TROIS OFFRES


### 2.1 Socle fixe universel (inclus dans TOUTES les offres, ne compte pas dans le quota)



### 2.2 Détail des trois offres



### 2.3 Modules verrouillés — comportement UI

Modules non disponibles : visibles mais grisés avec badge indiquant l’offre requise
Clic sur un module grisé : ouvre un modal d’upsell expliquant ce que l’offre supérieure apporte
Ne jamais masquer les fonctionnalités verrouillées. Les montrer grisées crée du désir et pousse à l’upgrade.


## 3. ONBOARDING — TUNNEL D’INSCRIPTION

4 étapes linéaires : Formule → Secteur → Modules → Compte. Retour en arrière possible à chaque étape.

Étape 1 : Choix de la formule
Afficher les 3 offres avec prix, socle fixe inclus et nombre de modules au choix. La Business est mise en avant visuellement (RECOMMANDÉE).

Étape 2 : Choix du secteur d’activité
Secteurs regroupés par catégories visuelles avec headers. Une seule page, pas de double niveau. Le nom de l’employé entre parenthèses devient automatiquement le nom du rôle employé dans tout le BO.

Catégorie 1 : Réparation & Technique

Catégorie 2 : Accompagnement & Conseil

Catégorie 3 : Créatif & Événementiel

Catégorie 4 : Commerce & Services

Conciergerie : le client s’appelle « Propriétaire » car c’est le propriétaire du bien géré, pas un client classique.

Catégorie 5 : Juridique & Administratif

Catégorie 6 : Éducation & Formation

Éducation & Formation : seule catégorie où le terme client change. « Élève » pour l’auto-école et le centre islamique, « Membre » pour l’association sportive.

Catégorie 7 : Mariage & Haute Couture

Mariage : seule catégorie avec deux employés distincts. Le client s’appelle « Mariée ».

Étape 3 : Sélection des modules
Le socle fixe est affiché séparément, clairement identifié comme « Toujours inclus ». Le système pré-sélectionne les modules recommandés selon le secteur choisi (voir section 7). L’utilisateur peut modifier dans la limite de son quota.
Modules disponibles : affichés normalement, sélectionnables
Modules indisponibles (offre insuffisante) : grisés avec badge offre requise
Modules pré-sélectionnés par le système : entourés en vert, modifiables

Étape 4 : Création du compte
Nom, prénom, email, mot de passe, nom de l’entreprise. Après validation : BO configuré avec le bon vocabulaire et des données de démonstration cohérentes avec le secteur.


## 4. STRUCTURE DES TROIS ESPACES


### 4.1 Espace Admin

Accès complet à tout : tous les clients, tous les dossiers, toutes les statistiques, la facturation, les paramètres, la gestion des employés et la configuration des autres espaces.

Navigation sidebar Admin


### 4.2 Espace Salarié

Ce que le salarié PEUT faire
Voir et gérer ses dossiers assignés
Faire passer un dossier à l’étape suivante (Business et Enterprise uniquement)
Consulter et envoyer des messages à ses clients
Consulter son calendrier personnel
Ajouter des notes sur un dossier
Uploader des photos et documents sur un dossier
Envoyer un message groupé à ses clients / sa classe / son équipe

Ce que le salarié NE PEUT PAS faire
Voir les informations financières globales
Accéder aux paramètres de l’entreprise
Créer ou supprimer des clients
Modifier les étapes de dossier (configuration)
Voir les dossiers des autres salariés (sauf autorisation admin)


### 4.3 Espace Client

Ce que le client PEUT faire
Voir l’avancement de son dossier étape par étape (timeline visuelle — lecture seule)
Consulter ses RDV à venir
Voir son échéancier de paiements avec statut
Télécharger ses documents (factures, contrats, fichiers livrés)
Envoyer et recevoir des messages avec l’admin / la direction
Recevoir les messages groupés envoyés par l’employé (sans pouvoir y répondre individuellement)
Soumettre un ticket de support
Modifier ses informations de profil
Consulter et valider ses devis

Ce que le client NE PEUT PAS faire
Modifier les étapes de son dossier
Voir les notes internes de l’équipe
Accéder aux informations financières globales de l’entreprise
Contacter directement l’employé assigné (sauf si l’admin l’autorise)


### 4.4 Messagerie — Règles par type d’espace

Règle clé messagerie : Le client / élève / membre ne peut pas initier une conversation directe avec l’employé assigné (professeur, entraîneur, moniteur). Il contacte uniquement la Direction / l’Admin. L’employé peut envoyer des messages GROUPÉS à ses clients / classe / équipe. Les clients reçoivent ces messages mais ne peuvent pas y répondre individuellement.



### 4.5 Fiche unifiée Admin — pas de bouton « Voir espace client »

Il n’y a PAS de bouton « Voir espace client ». La fiche dossier admin EST la vue unifiée. L’admin voit tout ce que le client voit + les informations internes. Il peut modifier et agir directement sur tout ce que le client voit, sans changer d’espace.



## 5. LA FICHE CLIENT / DOSSIER — CŒUR DU PRODUIT

La fiche client/dossier est l’écran le plus important de MBA. L’admin et le salarié y passent 80 % de leur temps. Elle est unifiée : l’admin voit tout, le salarié voit sa couche, le client voit sa couche uniquement.


### 5.1 En-tête de la fiche (toujours visible)



### 5.2 Timeline des étapes

Étape validée = verte. Étape en cours = mise en évidence. Étapes à venir = grises.



### 5.3 Blocs financiers (visibles admin uniquement)



### 5.4 Les 8 onglets obligatoires

Tous les onglets sont présents dans TOUTES les fiches. Si vide : message clair + bouton d’action. Ne jamais masquer un onglet.



### 5.5 Actions directes depuis la fiche

Envoyer un message au client
Envoyer une photo au client
Programmer un RDV (modal rapide)
Ajouter un paiement ou marquer un versement comme réglé
Faire avancer le dossier à l’étape suivante
Envoyer une notification de statut au client
Uploader un document
Ajouter une note interne


## 6. VOCABULAIRE & ÉTAPES PAR CORPS DE MÉTIER


### 6.1 Réparation & Technique


Étapes — Garage / Carrosserie

Étapes — Réparateur

Étapes — BTP / Artisan


### 6.2 Accompagnement & Conseil


Étapes — Consultant

Étapes — Coach sportif

Étapes — Formateur

Étapes — Cabinet de Recrutement

Étapes — Expert-Comptable


### 6.3 Créatif & Événementiel


Étapes — Designer

Étapes — Photographe

Étapes — DJ / Animateur

Étapes — Événementiel


### 6.4 Commerce & Services


Étapes — Magasin / Boutique

Étapes — Conciergerie / Airbnb

Étapes — Nettoyage

Étapes — Traiteur

Étapes — Salon de Coiffure / Beauté


### 6.5 Juridique & Administratif


Étapes — Cabinet d’Avocats

Étapes — Agence Immobilière

Étapes — Développeur


### 6.6 Éducation & Formation


Étapes — Auto-école

Étapes — Centre islamique

Espace Élève — Centre islamique (ce que l’élève voit)
Son niveau et sa progression (Hizb, Jouz, étape de mémorisation)
Son planning de cours (jours, horaires, salle, professeur)
Ses cotisations payées et à venir
Ses documents (supports de cours, attestations, évaluations)
Les messages groupés envoyés par son professeur (annonces, rappels, documents partagés)
Messagerie avec la Direction / Admin uniquement pour questions administratives

Modules spécifiques — Centre islamique
Gestion des cours par niveau (Coran, Arabe, Fiqh, Aqida...)
Planning professeurs avec matière enseignée
Suivi de la mémorisation (Hizb, Jouz, progression)
Gestion des cotisations mensuelles et dons
Messagerie groupée professeur → classe (pas de réponse individuelle possible)
Gestion des salles et créneaux

Étapes — Association sportive

Espace Membre — Association sportive (ce que le membre voit)
Sa fiche d’adhésion avec numéro de licence et date d’expiration
Son planning d’entraînements et matchs à venir
Ses cotisations payées et à venir avec statut
Les convocations et annonces envoyées par son entraîneur (lecture seule)
Messagerie avec la Direction / Admin du club uniquement

Modules spécifiques — Association sportive
Gestion des équipes par discipline et catégorie d’âge
Planning des entraînements et matchs
Suivi des présences aux entraînements
Gestion des licences fédérales avec dates d’expiration
Cotisations annuelles avec suivi des paiements
Convocations matchs envoyées en groupe depuis la messagerie entraîneur


### 6.7 Mariage & Haute Couture


Étapes — Mariage

Modules spécifiques — Mariage
Onglet Mesures : tour de poitrine, tour de taille, tour de hanches, longueur, pointure
Onglet Photos : photos de la robe à chaque étape
Planning essayages visible sur le dashboard admin
Commandes robes : vue globale de toutes les robes en production
Espace Mariée : compte à rebours jusqu’au grand jour + suivi de la robe étape par étape


## 7. MODULES PRÉ-SÉLECTIONNÉS PAR SECTEUR

Ces modules sont pré-cochés automatiquement à l’onboarding selon le secteur choisi. L’utilisateur peut les modifier dans la limite de son quota. Le socle fixe (Clients & Dossiers + Analyse) n’apparaît pas dans cette liste car il est toujours inclus.



## 8. CATALOGUE COMPLET DES MODULES



## 9. DONNÉES DE DÉMONSTRATION COCHÉRENTES

Les noms de clients correspondent au secteur
Les montants sont réalistes pour le secteur
Les étapes utilisent le vocabulaire du secteur, jamais des termes génériques
Les noms d’employés correspondent aux rôles du secteur
Les dates sont cohérentes avec la réalité métier



## 10. COMPORTEMENTS UI OBLIGATOIRES


### 10.1 Navigation et cliquabilité

Tout élément qui ressemble à un lien DOIT être cliquable et fonctionnel
Les noms de clients dans les listes DOIVENT ouvrir leur fiche au clic
Les étapes de la timeline DOIVENT être cliquables
Les montants dans le dashboard DOIVENT ouvrir le détail
Les alertes de paiement en retard DOIVENT avoir un bouton d’action direct


### 10.2 États vides

Onglet vide : message clair + bouton d’action (ex : « Aucune photo — Ajouter une photo »)
Ne jamais laisser une section vide sans indication ni action


### 10.3 Feedback utilisateur

Toute action génère un feedback visuel (toast de confirmation, spinner)
Les boutons destructeurs demandent une confirmation


### 10.4 Cohérence des espaces

Modifications admin se reflètent immédiatement dans l’espace client
L’espace client n’affiche jamais les notes internes, finances globales ni infos autres clients


### 10.5 Responsive et mobile

Toutes les vues sont utilisables sur mobile
La sidebar est collapsible sur mobile
Les boutons d’action sont assez grands pour être tapés confortablement


## 11. ESPACES PERSONNALISÉS (Business & Enterprise)

L’admin peut créer des espaces personnalisés basés sur le rôle Salarié avec des modules activés au choix.



## 12. CHECKLIST DE VALIDATION FINALE

Onboarding
Les 4 étapes fonctionnent avec retour en arrière possible
Secteurs regroupés par catégorie avec header visuel
Socle fixe clairement identifié comme inclus, séparé des modules au choix
Modules indisponibles grisés avec badge et upsell au clic
BO configuré avec bon vocabulaire et données de démo cohérentes après inscription

Offres
Starter : socle fixe + 3 modules, étapes non modifiables
Business : socle fixe + 6 modules, étapes personnalisables, salarié peut avancer la timeline
Enterprise : tout inclus, vocabulaire et noms entièrement personnalisables

Fiche client / dossier
Clic sur un client → fiche complète avec en-tête, timeline, blocs financiers, 8 onglets
Tous les boutons d’action fonctionnels (Notifier, Contacter, Étape précédente, Dossier terminé)
Actions directes depuis la fiche (message, photo, RDV, paiement, note, document)
Admin voit tout. Salarié voit sa couche. Client voit sa couche uniquement.

Messagerie
Client ne peut pas contacter directement l’employé assigné
Employé peut envoyer des messages groupés à ses clients / classe / équipe
Clients reçoivent les messages groupés mais ne peuvent pas y répondre individuellement

Vocabulaire
Client ne change pas sauf : Élève (auto-école, centre islamique), Membre (asso sportive), Mariée (mariage), Propriétaire (conciergerie)
Nom employé = nom entre parenthèses du secteur sélectionné
Module Clients & Dossiers prend le nom adapté au secteur
Données de démo cohérentes — jamais de mélange entre secteurs


MBA — My Business Assistant
Impartial Games — 2026 — Document confidentiel

---

*MBA — My Business Assistant — Impartial Games 2026 — Document confidentiel*
