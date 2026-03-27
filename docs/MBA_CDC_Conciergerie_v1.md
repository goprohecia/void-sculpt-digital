# MBA — Cahier des Charges Conciergerie / Ménage
## Étape 4 — Corps de métier prioritaire n°1 — Impartial Games 2026

> Ce document définit les fonctionnalités spécifiques au corps de métier Conciergerie / Ménage. Il s'utilise en complément de la MBA Bible Produit v3 (tronc commun) et des Instructions Claude Code.

---




## 1. POSITIONNEMENT & OBJECTIF


### 1.1 Concurrents visés



### 1.2 Proposition de valeur unique MBA

4 espaces distincts et connectés : Admin, Propriétaire, Manager, Prestataire ménage
Suivi ménage avec preuves de travail (photos horodatées et géolocalisées)
Remplacement complet de WhatsApp pour la coordination d’équipe
Facturation automatique par logement et par prestation
Tracking des prestataires : heure début/fin, validation de mission


## 2. LES 4 ESPACES / RÔLES

Architecture à 4 rôles — chaque espace a ses propres droits et son propre vocabulaire. Cette architecture dépasse le modèle Admin/Salarié/Client de la bible v3 de base. Pour ce corps de métier spécifiquement, un 4ème rôle est ajouté : le Manager régional.



### 2.1 Espace Admin — Vue complète

Dashboard admin
Nombre de missions du jour / semaine / mois
CA total et bénéfices
Nombre de logements actifs
Activité par ville / région
Prestataires disponibles vs occupés en temps réel
Alertes : missions non validées, paiements en retard, logements sans prestataire assigné

Gestion des logements
Créer / modifier / archiver un logement
Fiche logement : adresse, type, capacité, photos, notes spéciales ménage
Lien Airbnb et Booking associés au logement
Historique complet des interventions par logement
Assigné à un propriétaire / conciergerie

Gestion des missions
Planning global de toutes les missions
Créer une mission manuellement ou automatiquement après check-out
Assigner un prestataire à une mission
Suivi statut en temps réel : En attente / Assignée / En cours / Terminée / Validée
Accès aux photos et preuves de travail uploadées par le prestataire

Gestion des prestataires
Liste de tous les prestataires avec statut (disponible / indisponible / en mission)
Fiche prestataire : coordonnées, zone d’intervention, performances, notes
Historique des missions par prestataire
Système de notation des prestataires

Facturation & Paiements
Génération automatique de factures par logement / par prestation
Abonnement mensuel par unité de logement
Export PDF des factures
Suivi des paiements en retard avec relances automatiques
Paiement des prestataires : montants dus, historique


### 2.2 Espace Propriétaire / Conciergerie

Le client s’appelle « Propriétaire » dans cet espace. Le module fusionné s’appelle « Propriétaires & Dossiers ».

Ce que le propriétaire voit
Ses logements avec statut en temps réel
Calendrier des réservations de ses biens
Planning des interventions ménage programmées
Photos après ménage avec horodatage — preuve de qualité
Historique complet des prestations par logement
Ses factures et échéances de paiement
Rapport ménage : heure début/fin, prestataire, photos, note

Ce que le propriétaire peut faire
Consulter ses logements et réservations
Télécharger ses factures et rapports
Envoyer un message à l’Admin uniquement
Valider ou signaler un problème sur une prestation
Voir les performances de ses logements (note moyenne, taux occupation)

Ce que le propriétaire ne peut PAS faire
Voir les informations des autres propriétaires
Modifier les missions ou assigner les prestataires
Accéder aux informations financières globales de la conciergerie


### 2.3 Espace Manager Régional

Le Manager régional est un espace personnalisé basé sur le rôle Salarié avec des modules étendus. Il gère une zone géographique définie par l’Admin.

Ce que le manager voit
Toutes les missions de sa région
Liste de ses prestataires avec disponibilité
Ses statistiques de performance régionales
Alertes missions non assignées dans sa région
Ses commissions du mois

Ce que le manager peut faire
Assigner des prestataires aux missions de sa région
Valider la qualité des prestations (photos, notes)
Recruter et ajouter des prestataires dans sa région
Envoyer des messages groupés à ses prestataires
Suivre et gérer les conciergeries de sa zone
Voir ses commissions et le système de parrainage


### 2.4 Espace Prestataire Ménage

C’est l’espace le plus opérationnel. Le prestataire l’utilise principalement sur mobile. Inspiration UX : Turno et Taskbird.

Ce que le prestataire voit
Ses missions du jour avec heure, adresse et détails logement
Check-list ménage spécifique à chaque logement
Ses missions à venir (semaine)
Son historique de missions et revenus

Ce que le prestataire peut faire
Démarrer une mission — horodatage automatique
Suivre la check-list ménage étape par étape
Uploader des photos après ménage avec horodatage et géolocalisation automatiques
Terminer une mission — horodatage automatique
Signaler un problème sur le logement (dégât, anomalie)
Envoyer les photos directement au manager ou à l’admin
Recevoir les messages groupés de son manager

Ce que le prestataire ne peut PAS faire
Voir les informations financières (tarifs, factures, CA)
Accéder aux informations des autres prestataires
Modifier les missions ou les assignées
Contacter directement le propriétaire


## 3. FONCTIONNALITÉS SPÉCIFIQUES À CE CORPS DE MÉTIER


### 3.1 Suivi ménage avec preuves de travail

C’est LA fonctionnalité différenciante face aux concurrents. Elle doit être irréprochable.

Upload de photos par le prestataire depuis l’app mobile
Horodatage automatique de chaque photo (date + heure exacte)
Géolocalisation intégrée à chaque photo (confirme la présence sur place)
Photos organisées par pièce si possible (salon, cuisine, salle de bain, chambres)
Rapport ménage généré automatiquement avec toutes les photos + heure début/fin
Rapport envoyé automatiquement au propriétaire après validation
Possibilité d’exporter le rapport en PDF


### 3.2 Gestion des logements

Fiche logement complète : adresse, type (appartement, villa, studio...), capacité, étage, code d’accès
Instructions spéciales ménage par logement (notes visibles par le prestataire uniquement)
Check-list ménage personnalisable par logement
Photos de référence du logement (pour que le prestataire sache l’état attendu)
Lien Airbnb / Booking associé au logement
Historique complet des interventions par logement


### 3.3 Calendrier des réservations et missions

Vue calendrier par logement avec réservations (check-in / check-out)
Génération automatique d’une mission ménage après chaque check-out
Planning global de toutes les missions par jour / semaine
Vue par prestataire : son planning personnel
Code couleur par statut : en attente (orange), assignée (bleu), en cours (vert), terminée (gris), problème (rouge)


### 3.4 Synchronisation channel manager

Fonctionnalité avancée — à implémenter en phase 2 si complexe. En phase 1 : import manuel des réservations.

Phase 1 — Import manuel des réservations (date check-in/check-out, logement, nombre de voyageurs)
Phase 2 — Synchronisation automatique via iCal (Airbnb et Booking supportent l’export iCal)
Phase 3 — API native Airbnb / Booking si possible


### 3.5 Messagerie et communication équipe

Messagerie groupée par ville / région pour remplacer WhatsApp
Admin et Manager peuvent envoyer des messages groupés à leurs prestataires
Prestataires reçoivent les messages mais répondent uniquement en individuel à leur manager
Partage de photos et vidéos dans la messagerie
Notifications push sur mobile pour les nouvelles missions et messages


### 3.6 Système de commissions et parrainage (Manager)

Chaque manager a un taux de commission configurable par l’admin
Commission calculée automatiquement sur le CA généré dans sa région
Tableau de bord commissions : du mois, cumul, historique
Système de parrainage : un manager peut recruter d’autres managers et toucher une commission sur leur activité
Suivi des conciergeries apportées par chaque manager


## 4. VOCABULAIRE & ÉTAPES DE DOSSIER


### 4.1 Vocabulaire spécifique



### 4.2 Étapes de dossier — Conciergerie



### 4.3 Étapes de dossier — Nettoyage (contrats récurrents)



## 5. MODULES ACTIVÉS PAR DÉFAUT


Les modules Signature électronique, Support tickets et Emails sont recommandés en offre Enterprise pour les conciergeries qui ont plusieurs propriétaires.


## 6. DONNÉES MOCK — mockConciergerieData.ts

Les données de démonstration doivent être 100% cohérentes avec ce corps de métier. Voici les spécifications pour mockConciergerieData.ts.


### 6.1 Propriétaires (clients)



### 6.2 Logements



### 6.3 Employés / Prestataires



### 6.4 Missions / Dossiers



## 7. FICHE DOSSIER ENRICHIE — SPÉCIFICITÉS CONCIERGERIE

En plus des 8 onglets standard définis en bible v3 section 5, la fiche dossier pour ce corps de métier a des contenus spécifiques.


### 7.1 En-tête spécifique

Nom du propriétaire + nom du logement concerné
Type de ménage (standard, départ, grand ménage)
Date et heure de la mission
Prestataire assigné avec statut (disponible / en route / sur place)


### 7.2 Onglet Photos — spécifique

Photos organisées en deux catégories : Avant intervention / Après intervention
Chaque photo affiche : horodatage exact + icône géolocalisation
Bouton « Envoyer le rapport au propriétaire » — génère et envoie le PDF automatiquement
Le propriétaire voit les photos après ménage dans son espace


### 7.3 Onglet Check-list — nouveau pour ce métier

Check-list ménage personnalisable par logement
Tâches cochées par le prestataire depuis son mobile
Visible par l’admin et le manager en temps réel
Exemples de tâches : Aspirateur salon, Laver sol cuisine, Changer draps, Vérifier équipements, Sortir poubelles


## 8. CHECKLIST DE VALIDATION

Tous ces points doivent être validés avant de considérer ce corps de métier comme prêt à être vendu.

Espaces et rôles
Les 4 espaces sont créés et fonctionnels (Admin, Propriétaire, Manager, Prestataire)
Chaque espace affiche uniquement les informations qui lui sont destinées
L’espace Prestataire est optimisé mobile
Le Manager voit uniquement sa région

Suivi ménage
Upload photos avec horodatage automatique fonctionnel
Rapport ménage généré et envoyé automatiquement au propriétaire
Check-list ménage visible et cochable depuis l’espace prestataire
Tracking heure début/fin de mission fonctionnel

Vocabulaire et données
Le terme « Propriétaire » s’affiche partout à la place de « Client »
Le module s’appelle « Propriétaires & Dossiers »
Les données mock sont cohérentes (logements, villes, prestataires, missions réalistes)
Aucune donnée générique (TechSolutions, GreenLeaf...) n’apparaît

Fonctionnalités clés
Calendrier missions fonctionnel avec code couleur par statut
Messagerie groupée par ville / région
Facturation par logement / abonnement mensuel
Système de commissions manager visible

MBA — Cahier des charges Conciergerie / Ménage
Impartial Games — 2026 — Confidentiel — Étape 4 corps de métier prioritaire n°1

---

*MBA — Cahier des charges Conciergerie / Ménage — Impartial Games 2026 — Confidentiel*
