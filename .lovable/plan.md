

## Plan : Capturer des screenshots réels du backoffice

### Problème
Les 8 images de la page Fonctionnalités (`src/assets/screenshots/*.jpg`) sont des placeholders fictifs. L'utilisateur veut les remplacer par de vraies captures d'écran du backoffice admin existant.

### Approche

1. **Naviguer avec le browser** vers chaque page admin du backoffice en mode démo :
   - `/admin` → dashboard.jpg
   - `/admin/clients` → clients.jpg
   - `/admin/dossiers` → dossiers.jpg
   - `/admin/facturation` → facturation.jpg
   - `/admin/messagerie` → messagerie.jpg
   - `/admin/support` → support.jpg
   - `/admin/stock` → stock.jpg
   - `/admin/analyse` → analyse.jpg

2. **Prendre un screenshot** de chaque page à une résolution desktop (1280x800 ou similaire) pour un rendu propre.

3. **Sauvegarder chaque capture** dans `src/assets/screenshots/` en remplacement des fichiers existants.

4. **Aucun changement de code** nécessaire dans `Fonctionnalites.tsx` — les imports pointent déjà vers ces fichiers.

### Prérequis
- Les pages admin doivent être accessibles en mode démo (sans authentification réelle). Si un écran de login bloque, il faudra d'abord se connecter dans le preview.

### Résultat
Les 8 screenshots de la page Fonctionnalités refléteront fidèlement l'interface réelle du backoffice avec les données de démonstration.

