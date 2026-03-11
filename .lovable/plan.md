

## Plan : Remplacer tous les fonds blancs par Chalk White `#F6F5F2`

Le changement sera centralisé au maximum via les CSS variables et les classes globales dans `index.css`, puis appliqué aux composants qui utilisent `bg-white` en dur.

### 1. CSS Variables (`src/index.css`)
- Changer `--bg-surface: 0 0% 100%` → `40 20% 96%` (HSL de #F6F5F2)
- Changer `--card: 0 0% 100%` → `40 20% 96%`
- Changer `--popover: 0 0% 100%` → `40 20% 96%`
- Remplacer toutes les occurrences de `#ffffff` par `#F6F5F2` (~15 occurrences dans les classes `.mba-app`)

### 2. Composant Card (`src/components/ui/card.tsx`)
- Remplacer `bg-white` par `bg-[#F6F5F2]`

### 3. Sidebars (4 fichiers)
- `AdminSidebar.tsx`, `EmployeeSidebar.tsx`, `ClientSidebar.tsx`, `SuperAdminSidebar.tsx` : `!bg-white` → `!bg-[#F6F5F2]`

### 4. Layouts — Headers (4 fichiers)
- `AdminLayout.tsx`, `EmployeeLayout.tsx`, `ClientLayout.tsx`, `SuperAdminLayout.tsx` : `bg-white` → `bg-[#F6F5F2]` dans les `<header>`

### 5. Site public — Pages avec `bg-white` en fond de section
- `Contact.tsx` : `bg-white` → `bg-[#F6F5F2]` (hero + section contact)
- `Fonctionnalites.tsx`, `DemoTour.tsx`, `AdminLogin.tsx`, `ClientSignup.tsx`, et autres pages publiques qui utilisent `bg-white` comme fond
- Inputs avec `bg-white` dans les formulaires

### 6. Composants admin divers
- `MobileBottomNav.tsx`, `DashboardKPI.tsx`, `AdminLayout.tsx` (upgrade banner), `BookingSettingsTab.tsx`

### 7. Sections landing page
- Toutes les sections du site public (`ServicesSection`, `CiblesSection`, etc.) qui utilisent `bg-white` ou `bg-gray-50` comme fond → `bg-[#F6F5F2]`

### Fichiers à modifier (~25 fichiers)
- `src/index.css` (centralise la majorité des changements)
- `src/components/ui/card.tsx`
- 4 sidebars + 4 layouts
- Pages publiques (Contact, Login, Signup, etc.)
- Composants admin (MobileBottomNav, DashboardKPI, etc.)
- Sections landing page avec bg-white

