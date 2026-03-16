import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// Public pages
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Fonctionnalites from "@/pages/Fonctionnalites";
import NotFound from "@/pages/NotFound";
import DemoTour from "@/pages/DemoTour";

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
import Developpeur from "@/pages/secteurs/Developpeur";
import Designer from "@/pages/secteurs/Designer";
import Photographe from "@/pages/secteurs/Photographe";
import CommunityManager from "@/pages/secteurs/CommunityManager";
import Reparateur from "@/pages/secteurs/Reparateur";
import Consultant from "@/pages/secteurs/Consultant";
import CoachSportif from "@/pages/secteurs/CoachSportif";
import Formateur from "@/pages/secteurs/Formateur";
import Boutique from "@/pages/secteurs/Boutique";
import Traiteur from "@/pages/secteurs/Traiteur";
import DjAnimateur from "@/pages/secteurs/DjAnimateur";
import AutoEcole from "@/pages/secteurs/AutoEcole";

// Public pages (booking)
import BookingPage from "@/pages/public/BookingPage";

// Auth pages
import AdminLogin from "@/pages/admin/AdminLogin";

import ClientSignup from "@/pages/admin/ClientSignup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminClients from "@/pages/admin/AdminClients";
import AdminDossiers from "@/pages/admin/AdminDossiers";
import AdminDossierDetail from "@/pages/admin/AdminDossierDetail";
import AdminDemandes from "@/pages/admin/AdminDemandes";
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
import AdminTaches from "@/pages/admin/AdminTaches";
import AdminAgenda from "@/pages/admin/AdminAgenda";
import AdminRapports from "@/pages/admin/AdminRapports";
import AdminDocuments from "@/pages/admin/AdminDocuments";
import AdminTemps from "@/pages/admin/AdminTemps";
import AdminAutomatisations from "@/pages/admin/AdminAutomatisations";
import AdminNotes from "@/pages/admin/AdminNotes";
import AdminPipeline from "@/pages/admin/AdminPipeline";
import AdminIA from "@/pages/admin/AdminIA";
import AdminFournisseurs from "@/pages/admin/AdminFournisseurs";
import AdminAnnonces from "@/pages/admin/AdminAnnonces";

// Super Admin pages
import SuperAdminDashboard from "@/pages/superadmin/SuperAdminDashboard";
import SuperAdminEntreprises from "@/pages/superadmin/SuperAdminEntreprises";
import SuperAdminAbonnements from "@/pages/superadmin/SuperAdminAbonnements";
import SuperAdminStats from "@/pages/superadmin/SuperAdminStats";
import SuperAdminFormules from "@/pages/superadmin/SuperAdminFormules";
import SuperAdminSecteurs from "@/pages/superadmin/SuperAdminSecteurs";
import SuperAdminEntrepriseDetail from "@/pages/superadmin/SuperAdminEntrepriseDetail";

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
import AdminUpgrade from "@/pages/admin/AdminUpgrade";

// Employee pages
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import EmployeeClients from "@/pages/employee/EmployeeClients";
import EmployeeDossiers from "@/pages/employee/EmployeeDossiers";
import EmployeeCalendrier from "@/pages/employee/EmployeeCalendrier";
import EmployeeMessaging from "@/pages/employee/EmployeeMessaging";
import EmployeeFacturation from "@/pages/employee/EmployeeFacturation";
import EmployeeRelances from "@/pages/employee/EmployeeRelances";
import EmployeeEmails from "@/pages/employee/EmployeeEmails";
import EmployeeRendezVous from "@/pages/employee/EmployeeRendezVous";
import EmployeeSupport from "@/pages/employee/EmployeeSupport";
import EmployeeStock from "@/pages/employee/EmployeeStock";
import EmployeeAnalyse from "@/pages/employee/EmployeeAnalyse";
import EmployeeProfile from "@/pages/employee/EmployeeProfile";

export function AnimatedRoutes() {
  const location = useLocation();
  useScrollToTop();

  // Use stable keys for layout-wrapped routes so the sidebar doesn't unmount/remount
  const getRouteKey = (pathname: string) => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/client")) return "client";
    if (pathname.startsWith("/employee")) return "employee";
    if (pathname.startsWith("/superadmin")) return "superadmin";
    return pathname;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={getRouteKey(location.pathname)}>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/fonctionnalites" element={<Fonctionnalites />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/demo" element={<DemoTour />} />

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
        <Route path="/secteurs/developpeur" element={<Developpeur />} />
        <Route path="/secteurs/designer" element={<Designer />} />
        <Route path="/secteurs/photographe" element={<Photographe />} />
        <Route path="/secteurs/community-manager" element={<CommunityManager />} />
        <Route path="/secteurs/reparateur" element={<Reparateur />} />
        <Route path="/secteurs/consultant" element={<Consultant />} />
        <Route path="/secteurs/coach-sportif" element={<CoachSportif />} />
        <Route path="/secteurs/formateur" element={<Formateur />} />
        <Route path="/secteurs/boutique" element={<Boutique />} />
        <Route path="/secteurs/traiteur" element={<Traiteur />} />
        <Route path="/secteurs/dj-animateur" element={<DjAnimateur />} />
        <Route path="/secteurs/auto-ecole" element={<AutoEcole />} />

        {/* Auth routes */}
        <Route path="/client/login" element={<AdminLogin />} />
        
        <Route path="/signup" element={<ClientSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/dossiers" element={<AdminDossiers />} />
        <Route path="/admin/dossiers/:id" element={<AdminDossierDetail />} />
        <Route path="/admin/demandes" element={<AdminDemandes />} />
        <Route path="/admin/messagerie" element={<AdminMessaging />} />
        <Route path="/admin/facturation" element={<AdminBilling />} />
        <Route path="/admin/relances" element={<AdminReminders />} />
        <Route path="/admin/emails" element={<AdminEmails />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/rendez-vous" element={<AdminRendezVous />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/stock" element={<AdminStock />} />
        <Route path="/admin/analyse" element={<AdminAnalytics />} />
        <Route path="/admin/taches" element={<AdminTaches />} />
        <Route path="/admin/agenda" element={<AdminAgenda />} />
        <Route path="/admin/rapports" element={<AdminRapports />} />
        <Route path="/admin/documents" element={<AdminDocuments />} />
        <Route path="/admin/temps" element={<AdminTemps />} />
        <Route path="/admin/automatisations" element={<AdminAutomatisations />} />
        <Route path="/admin/notes" element={<AdminNotes />} />
        <Route path="/admin/pipeline" element={<AdminPipeline />} />
        <Route path="/admin/ia" element={<AdminIA />} />
        <Route path="/admin/fournisseurs" element={<AdminFournisseurs />} />
        <Route path="/admin/annonces" element={<AdminAnnonces />} />
        <Route path="/admin/parametres" element={<AdminSettings />} />
        <Route path="/admin/upgrade" element={<AdminUpgrade />} />
        <Route path="/admin/espace/:spaceId" element={<AdminCustomSpace />} />

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
        <Route path="/employee/clients" element={<EmployeeClients />} />
        <Route path="/employee/dossiers" element={<EmployeeDossiers />} />
        <Route path="/employee/calendrier" element={<EmployeeCalendrier />} />
        <Route path="/employee/messagerie" element={<EmployeeMessaging />} />
        <Route path="/employee/facturation" element={<EmployeeFacturation />} />
        <Route path="/employee/relances" element={<EmployeeRelances />} />
        <Route path="/employee/emails" element={<EmployeeEmails />} />
        <Route path="/employee/rendez-vous" element={<EmployeeRendezVous />} />
        <Route path="/employee/support" element={<EmployeeSupport />} />
        <Route path="/employee/stock" element={<EmployeeStock />} />
        <Route path="/employee/analyse" element={<EmployeeAnalyse />} />
        <Route path="/employee/profil" element={<EmployeeProfile />} />

        {/* Super Admin routes */}
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/entreprises" element={<SuperAdminEntreprises />} />
        <Route path="/superadmin/entreprises/:id" element={<SuperAdminEntrepriseDetail />} />
        <Route path="/superadmin/abonnements" element={<SuperAdminAbonnements />} />
        <Route path="/superadmin/formules" element={<SuperAdminFormules />} />
        <Route path="/superadmin/stats" element={<SuperAdminStats />} />
        <Route path="/superadmin/secteurs" element={<SuperAdminSecteurs />} />

        {/* Public booking */}
        <Route path="/rdv/:slug" element={<BookingPage />} />

        {/* Legacy redirects */}
        <Route path="/services/*" element={<Navigate to="/" replace />} />
        <Route path="/portfolio/*" element={<Navigate to="/" replace />} />
        <Route path="/studio" element={<Navigate to="/" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
