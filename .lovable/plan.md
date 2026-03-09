

## Module 05 — Règles d'annulation et remboursement d'acompte

### Audit

| Élément | Statut |
|---|---|
| Section "Politique d'annulation" dans BookingSettingsTab | **Manquant** |
| Bloc conditions + checkbox sur BookingStepRecap | **Manquant** — texte statique "vous acceptez les CGV" existe mais sans checkbox ni conditions réelles |
| Bouton "Annuler la réservation" côté admin | **Manquant** |

### Plan d'implémentation

#### 1. Ajouter la config annulation dans `BookingSettingsTab.tsx`

Nouvelle Card "Politique d'annulation" après la card Acompte :
- Input numérique "Délai d'annulation" + Select heures/jours
- 3 RadioGroup options : Remboursement total / Partiel (+ input %) / Aucun
- Textarea "Message affiché au client" pré-rempli dynamiquement selon la politique choisie
- Aperçu en temps réel du bloc tel que vu par le client (card preview)

#### 2. Ajouter la config annulation dans `MOCK_CONFIG` de `BookingPage.tsx`

```typescript
annulation: {
  delai: 24,
  unite: "heures" as const,
  politique: "total" as const,
  pourcentagePartiel: 50,
  messageClient: "Annulation gratuite jusqu'à 24h avant le rendez-vous. Remboursement intégral de l'acompte.",
}
```

#### 3. Modifier `BookingStepRecap.tsx` — Bloc conditions + checkbox

- Ajouter props `cancellationMessage: string`
- Remplacer le texte statique par un vrai bloc "Conditions d'annulation" avec le message admin
- Ajouter une checkbox "J'ai lu et j'accepte les conditions d'annulation" avec `useState`
- Bouton "Payer l'acompte" `disabled` tant que checkbox non cochée (visuellement grisé)

#### 4. Modifier `AdminDossierDetail.tsx` — Bouton annulation + modale

- Ajouter un bouton "Annuler la réservation" dans la vue dossier (visible si dossier pas déjà annulé)
- AlertDialog de confirmation affichant :
  - Le montant de l'acompte payé
  - Le montant remboursé calculé selon la politique (total/partiel/aucun)
  - Message de confirmation
- Au clic "Confirmer" : passer le statut du dossier à `"annule"` + toast

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/components/admin/BookingSettingsTab.tsx` | Nouvelle card politique d'annulation avec radio, input, textarea, aperçu |
| `src/components/booking/BookingStepRecap.tsx` | Bloc conditions + checkbox obligatoire + bouton disabled |
| `src/pages/public/BookingPage.tsx` | Ajouter config annulation au MOCK_CONFIG, passer le message au Recap |
| `src/pages/admin/AdminDossierDetail.tsx` | Bouton "Annuler la réservation" + AlertDialog avec calcul remboursement |

