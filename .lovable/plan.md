

## Module 08 — QR Code généré automatiquement

### Audit

| Élément | Statut |
|---|---|
| QR code dans BookingSettingsTab | **Manquant** |
| Bouton "Copier le lien" | **OK** — déjà présent |
| Téléchargement PNG / PDF | **Manquant** |
| Personnalisation logo (plan Enterprise) | **Manquant** |

### Plan d'implémentation

#### 1. Installer `qrcode.react`

Ajouter la dépendance `qrcode.react` au projet.

#### 2. Modifier `BookingSettingsTab.tsx` — Ajouter la section QR code

Dans la Card "Lien de réservation" existante (lignes 91–116), ajouter après le bloc copier :

- Composant `QRCodeCanvas` de `qrcode.react` — taille 280×280, fond blanc, modules noirs, `ref` sur le canvas
- `useEffect` sur `slug` pour régénération automatique du QR
- Bouton **"Télécharger PNG"** : `canvas.toBlob()` → `URL.createObjectURL()` → lien `<a>` auto-download
- Bouton **"Télécharger PDF"** : via `jsPDF` (déjà installé) — page A4, QR centré, nom du business au-dessus
- Section **personnalisation logo** :
  - Lire le plan depuis `useDemoPlan()`
  - Si `plan === "enterprise"` : Toggle "Afficher mon logo au centre" + input file upload avec preview. Le logo est passé via la prop `imageSettings` de `QRCodeCanvas`
  - Si `plan !== "enterprise"` : Toggle visible mais disabled, avec Badge "Enterprise" et lien CTA "Passer à l'offre Enterprise"

### Fichiers à modifier

| Fichier | Modification |
|---|---|
| `src/components/admin/BookingSettingsTab.tsx` | Ajouter QRCodeCanvas, boutons PNG/PDF, section logo Enterprise |

### Dépendance à installer

| Package | Usage |
|---|---|
| `qrcode.react` | Génération du QR code en canvas |

