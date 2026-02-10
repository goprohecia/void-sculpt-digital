

# Plan : Verification et tests des emails

## Contexte

Apres analyse du code, voici les constats :

1. **Welcome email (creation de compte admin)** : Le template `create-client-account` est complet avec mot de passe temporaire, logo, badge de bienvenue et resume des fonctionnalites. Le mot de passe est genere via `generatePassword()` (12 caracteres cryptographiquement aleatoires) et envoye via Resend.

2. **Email "mot de passe oublie"** : Il n'existe aucune fonctionnalite de reinitialisation de mot de passe dans l'application. Aucune page, aucun lien "mot de passe oublie", et aucune edge function dediee. C'est une fonctionnalite manquante.

3. **Les 6 templates existants** ont tous le logo et le bon expediteur `studio@impartialgames.com`.

## Actions prevues

### 1. Tester tous les emails existants (7 envois)
Envoyer un exemple de chaque email a `studio@impartialgames.com` pour verifier le rendu :
- **Welcome email** (create-client-account) - avec mot de passe temporaire
- **Relance** (send-relance)
- **Devis** (send-devis)
- **Paiement** (send-paiement)
- **Reception demande** (send-demande-reception)
- **Statut demande validee** (send-demande-statut)
- **Statut demande refusee** (send-demande-statut)

### 2. Creer la fonctionnalite "Mot de passe oublie"
Puisqu'il n'existe pas encore, il faut :

- **Creer une edge function `send-password-reset`** qui utilise `supabase.auth.admin.generateLink()` pour generer un lien de reinitialisation, puis envoie un email premium via Resend avec le meme design que les autres templates (logo, card dark, CTA violet).

- **Ajouter un lien "Mot de passe oublie ?"** sur les pages de login (`AdminLogin.tsx` et `ClientSignup.tsx` / page login client).

- **Creer une page `/reset-password`** qui permet a l'utilisateur de saisir son nouveau mot de passe apres avoir clique sur le lien dans l'email.

## Details techniques

### Edge function `send-password-reset`
- Recoit `{ email }` en POST (pas besoin d'auth)
- Utilise `supabase.auth.admin.generateLink({ type: 'recovery', email })` pour obtenir un token
- Envoie un email Resend avec le template premium Impartial
- Le lien pointe vers `/reset-password?token=...`

### Page `/reset-password`
- Lit le token depuis l'URL
- Affiche un formulaire nouveau mot de passe + confirmation
- Appelle `supabase.auth.updateUser({ password })` une fois la session etablie via le token

### Modifications des pages login
- Ajouter un lien "Mot de passe oublie ?" sous le champ mot de passe
- Ce lien ouvre un dialog ou navigue vers une page dediee avec saisie email + envoi

### Test du welcome email
- Le `create-client-account` necessite un token admin pour fonctionner (verification du role admin)
- On verifiera que le mot de passe temporaire est bien genere et inclus dans l'email

