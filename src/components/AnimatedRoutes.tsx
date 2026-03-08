import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// Public pages
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Fonctionnalites from "@/pages/Fonctionnalites";
import NotFound from "@/pages/NotFound";

// Sector pages
import Conciergerie from "@/pages/secteurs/Conciergerie";
import Immobilier from "@/pages/secteurs/Immobilier";
import Garages from "@/pages/secteurs/Garages";
import BTP from "@/pages/secteurs/BTP";
import Mariage from "@/pages/secteurs/Mariage";
import Coiffure from "@/pages/secteurs/Coiffure";
import Cabinets from "@/pages/secteurs/Cabinets";
import Evenementiel from "@/pages/secteurs/Evenementiel";
import Nettoyage from "@/pages/secteurs/Nettoyage";

// Auth pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminOnlyLogin from "@/pages/admin/AdminOnlyLogin";
import ClientSignup from "@/pages/admin/ClientSignup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminClients from "@/pages/admin/AdminClients";
import AdminDossiers from "@/pages/admin/AdminDossiers";
import AdminDossierDetail from "@/pages/admin/AdminDossierDetail";
import AdminMessaging from "@/pages/admin/AdminMessaging";
import AdminBilling from "@/pages/admin/AdminBilling";
import AdminReminders from "@/pages/admin/AdminReminders";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSupport from "@/pages/admin/AdminSupport";
import AdminEmails from "@/pages/admin/AdminEmails";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminRendezVous from "@/pages/admin/AdminRendezVous";
import AdminEmployees from "@/pages/admin/AdminEmployees";
import AdminStock from "@/pages/admin/AdminStock";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientDossiers from "@/pages/client/ClientDossiers";
import ClientDossierDetail from "@/pages/client/ClientDossierDetail";
import ClientDemandes from "@/pages/client/ClientDemandes";
import ClientDevis from "@/pages/client/ClientDevis";
import ClientFactures from "@/pages/client/ClientFactures";
import ClientMessaging from "@/pages/client/ClientMessaging";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientSupport from "@/pages/client/ClientSupport";
import ClientPaiement from "@/pages/client/ClientPaiement";
import ClientSettings from "@/pages/client/ClientSettings";
import ClientRendezVous from "@/pages/client/ClientRendezVous";

// Employee pages
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import EmployeeDossiers from "@/pages/employee/EmployeeDossiers";
import EmployeeCalendrier from "@/pages/employee/EmployeeCalendrier";
import EmployeeMessaging from "@/pages/employee/EmployeeMessaging";
import EmployeeProfile from "@/pages/employee/EmployeeProfile";
import EmployeeStock from "@/pages/employee/EmployeeStock";

export function AnimatedRoutes() {
  const location = useLocation();
  useScrollToTop();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/fonctionnalites" element={<Fonctionnalites />} />
        <Route path="/contact" element={<Contact />} />

        {/* Sectors */}
        <Route path="/secteurs/conciergerie" element={<Conciergerie />} />
        <Route path="/secteurs/immobilier" element={<Immobilier />} />
        <Route path="/secteurs/garages" element={<Garages />} />
        <Route path="/secteurs/btp" element={<BTP />} />
        <Route path="/secteurs/mariage" element={<Mariage />} />
        <Route path="/secteurs/coiffure" element={<Coiffure />} />
        <Route path="/secteurs/cabinets" element={<Cabinets />} />
        <Route path="/secteurs/evenementiel" element={<Evenementiel />} />
        <Route path="/secteurs/nettoyage" element={<Nettoyage />} />

        {/* Auth routes */}
        <Route path="/client/login" element={<AdminLogin />} />
        <Route path="/admin/access" element={<AdminOnlyLogin />} />
        <Route path="/signup" element={<ClientSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/dossiers" element={<AdminDossiers />} />
        <Route path="/admin/dossiers/:id" element={<AdminDossierDetail />} />
        <Route path="/admin/messagerie" element={<AdminMessaging />} />
        <Route path="/admin/facturation" element={<AdminBilling />} />
        <Route path="/admin/relances" element={<AdminReminders />} />
        <Route path="/admin/emails" element={<AdminEmails />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/rendez-vous" element={<AdminRendezVous />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/stock" element={<AdminStock />} />
        <Route path="/admin/analyse" element={<AdminAnalytics />} />
        <Route path="/admin/parametres" element={<AdminSettings />} />

        {/* Client routes */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/dossiers" element={<ClientDossiers />} />
        <Route path="/client/dossiers/:id" element={<ClientDossierDetail />} />
        <Route path="/client/demandes" element={<ClientDemandes />} />
        <Route path="/client/devis" element={<ClientDevis />} />
        <Route path="/client/factures" element={<ClientFactures />} />
        <Route path="/client/paiement/:factureId" element={<ClientPaiement />} />
        <Route path="/client/messagerie" element={<ClientMessaging />} />
        <Route path="/client/support" element={<ClientSupport />} />
        <Route path="/client/rendez-vous" element={<ClientRendezVous />} />
        <Route path="/client/profil" element={<ClientProfile />} />
        <Route path="/client/parametres" element={<ClientSettings />} />

        {/* Employee routes */}
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/dossiers" element={<EmployeeDossiers />} />
        <Route path="/employee/calendrier" element={<EmployeeCalendrier />} />
        <Route path="/employee/messagerie" element={<EmployeeMessaging />} />
        <Route path="/employee/stock" element={<EmployeeStock />} />
        <Route path="/employee/profil" element={<EmployeeProfile />} />

        {/* Legacy redirects */}
        <Route path="/services/*" element={<Navigate to="/" replace />} />
        <Route path="/portfolio/*" element={<Navigate to="/" replace />} />
        <Route path="/studio" element={<Navigate to="/" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
