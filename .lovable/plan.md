
# Corrections pour le fonctionnement en mode reel

## Probleme principal : RLS bloque les notifications et email_logs

Les tables `notifications` et `email_logs` n'autorisent l'insertion qu'aux admins. Quand un client soumet une demande ou signe un devis, les notifications et logs echouent silencieusement.

### Tableau des problemes

| Situation | Utilisateur connecte | Table cible | Resultat actuel |
|-----------|---------------------|-------------|-----------------|
| Client soumet une demande | Client | notifications + email_logs | ECHEC (RLS) |
| Client signe un devis | Client | notifications + email_logs | ECHEC (RLS) |
| Admin cree un dossier | Admin | notifications | OK |
| Admin cree un devis | Admin | notifications + email_logs | OK |
| Admin cree une facture | Admin | notifications + email_logs | OK |

### Solution

Ajouter des policies RLS qui autorisent les clients a inserer des notifications et email_logs lies a leur propre compte :

**Table `notifications`** : ajouter une policy INSERT pour les clients authentifies qui inserent des notifications liees a leur propre `client_id`, OU des notifications destinataire "admin" quand ils sont authentifies.

**Table `email_logs`** : ajouter une policy INSERT pour les clients authentifies qui inserent des logs lies a leur propre `client_id`.

---

## Detail technique

### Migration SQL

```sql
-- Permettre aux clients d'inserer des notifications (pour eux-memes ou vers admin)
CREATE POLICY "Clients can insert notifications"
ON notifications FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    destinataire = 'admin'
    OR (
      destinataire = 'client'
      AND client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
    )
  )
);

-- Permettre aux clients d'inserer des email_logs lies a leur compte
CREATE POLICY "Clients can insert email_logs"
ON email_logs FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
);
```

### Fichiers a verifier (aucun changement de code necessaire)

Les 4 hooks (`use-demandes.ts`, `use-devis.ts`, `use-factures.ts`, `use-dossiers.ts`) ont deja le bon code avec les `Promise.all` et `try/catch`. Seule la base de donnees bloquait.

---

## Impact

- Les demandes clients genereront correctement des notifications admin + client + email_logs
- Les signatures de devis par les clients genereront des notifications admin + email_logs
- Toutes les actions admin continueront de fonctionner comme avant
- Aucun risque de securite : les clients ne peuvent inserer que des notifications/logs lies a leur propre `client_id`
