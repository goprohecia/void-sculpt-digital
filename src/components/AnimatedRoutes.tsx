import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition3D } from "./PageTransition3D";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import Index from "@/pages/Index";
import Studio from "@/pages/Studio";
import Contact from "@/pages/Contact";
import Portfolio from "@/pages/Portfolio";
import WebService from "@/pages/services/WebService";
import MobileService from "@/pages/services/MobileService";
import BackofficeService from "@/pages/services/BackofficeService";
import FullStackService from "@/pages/services/FullStackService";
import CGU from "@/pages/legal/CGU";
import CGV from "@/pages/legal/CGV";
import Cookies from "@/pages/legal/Cookies";
import MentionsLegales from "@/pages/legal/MentionsLegales";
import PolitiqueConfidentialite from "@/pages/legal/PolitiqueConfidentialite";
import NotFound from "@/pages/NotFound";

// Portfolio project pages
import WeCloseProject from "@/pages/portfolio/WeCloseProject";
import AltarysProject from "@/pages/portfolio/AltarysProject";
import PropheciaProject from "@/pages/portfolio/PropheciaProject";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminClients from "@/pages/admin/AdminClients";
import AdminDossiers from "@/pages/admin/AdminDossiers";
import AdminMessaging from "@/pages/admin/AdminMessaging";
import AdminBilling from "@/pages/admin/AdminBilling";
import AdminReminders from "@/pages/admin/AdminReminders";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientDossiers from "@/pages/client/ClientDossiers";
import ClientDevis from "@/pages/client/ClientDevis";
import ClientFactures from "@/pages/client/ClientFactures";
import ClientMessaging from "@/pages/client/ClientMessaging";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientSupport from "@/pages/client/ClientSupport";
import AdminSupport from "@/pages/admin/AdminSupport";
export function AnimatedRoutes() {
  const location = useLocation();
  useScrollToTop();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition3D><Index /></PageTransition3D>} />
        <Route path="/studio" element={<PageTransition3D><Studio /></PageTransition3D>} />
        <Route path="/portfolio" element={<PageTransition3D><Portfolio /></PageTransition3D>} />
        <Route path="/portfolio/weclose" element={<PageTransition3D><WeCloseProject /></PageTransition3D>} />
        <Route path="/portfolio/altarys" element={<PageTransition3D><AltarysProject /></PageTransition3D>} />
        <Route path="/portfolio/prophecia" element={<PageTransition3D><PropheciaProject /></PageTransition3D>} />
        <Route path="/contact" element={<PageTransition3D><Contact /></PageTransition3D>} />
        <Route path="/services/web" element={<PageTransition3D><WebService /></PageTransition3D>} />
        <Route path="/services/mobile" element={<PageTransition3D><MobileService /></PageTransition3D>} />
        <Route path="/services/backoffice" element={<PageTransition3D><BackofficeService /></PageTransition3D>} />
        <Route path="/services/360" element={<PageTransition3D><FullStackService /></PageTransition3D>} />
        <Route path="/cgu" element={<PageTransition3D><CGU /></PageTransition3D>} />
        <Route path="/cgv" element={<PageTransition3D><CGV /></PageTransition3D>} />
        <Route path="/cookies" element={<PageTransition3D><Cookies /></PageTransition3D>} />
        <Route path="/mentions-legales" element={<PageTransition3D><MentionsLegales /></PageTransition3D>} />
        <Route path="/politique-confidentialite" element={<PageTransition3D><PolitiqueConfidentialite /></PageTransition3D>} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/clients" element={<AdminClients />} />
        <Route path="/admin/dossiers" element={<AdminDossiers />} />
        <Route path="/admin/messagerie" element={<AdminMessaging />} />
        <Route path="/admin/facturation" element={<AdminBilling />} />
        <Route path="/admin/relances" element={<AdminReminders />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/analyse" element={<AdminAnalytics />} />
        
        {/* Client routes */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/dossiers" element={<ClientDossiers />} />
        <Route path="/client/devis" element={<ClientDevis />} />
        <Route path="/client/factures" element={<ClientFactures />} />
        <Route path="/client/messagerie" element={<ClientMessaging />} />
        <Route path="/client/support" element={<ClientSupport />} />
        <Route path="/client/profil" element={<ClientProfile />} />
        
        <Route path="*" element={<PageTransition3D><NotFound /></PageTransition3D>} />
      </Routes>
    </AnimatePresence>
  );
}
