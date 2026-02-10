

# Corriger la connexion admin pour les vrais comptes

## Probleme identifie

La page `/admin/access` utilise uniquement le systeme de demo (`useDemoAuth`) pour authentifier les utilisateurs. Elle ne fait jamais appel a l'authentification reelle via la base de donnees. Le compte `contact@impartialgames.com` existe bien en base, mais la page ne sait pas le verifier.

## Solution

Modifier `AdminOnlyLogin.tsx` pour ajouter l'authentification reelle en complement du mode demo, comme c'est deja fait dans `AdminLogin.tsx` (la page `/client/login`).

## Modifications prevues

### Fichier : `src/pages/admin/AdminOnlyLogin.tsx`

1. **Importer le client Supabase** pour acceder a l'authentification reelle
2. **Rendre `handleSubmit` asynchrone** pour pouvoir appeler l'API d'authentification
3. **Ajouter la logique d'authentification reelle** :
   - D'abord essayer le login demo (comptes de demonstration)
   - Si le demo echoue, tenter `supabase.auth.signInWithPassword({ email, password })`
   - En cas de succes, verifier que l'utilisateur a bien le role `admin` dans la table `user_roles`
   - Si le role est confirme, rediriger vers `/admin`
   - Sinon, afficher un message d'erreur "Ce portail est reserve aux administrateurs"

### Details techniques

```text
Flux d'authentification mis a jour :

[Formulaire] --> [1. Essai demo auth]
                    |
              Succes? --> Oui --> [Verifier role admin] --> Redirection /admin
                    |
                   Non --> [2. Essai Supabase auth]
                              |
                        Succes? --> Oui --> [Verifier role admin en BDD] --> Redirection /admin
                              |
                             Non --> "Identifiants incorrects"
```

- Import de `supabase` depuis `@/integrations/supabase/client`
- Appel a `supabase.auth.signInWithPassword()` si le login demo echoue
- Verification du role admin via une requete sur `user_roles` apres authentification reelle
- Deconnexion automatique si l'utilisateur authentifie n'a pas le role admin

