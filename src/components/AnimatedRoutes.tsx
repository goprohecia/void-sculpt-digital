import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
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
import NotFound from "@/pages/NotFound";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/studio" element={<PageTransition><Studio /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/services/web" element={<PageTransition><WebService /></PageTransition>} />
        <Route path="/services/mobile" element={<PageTransition><MobileService /></PageTransition>} />
        <Route path="/services/backoffice" element={<PageTransition><BackofficeService /></PageTransition>} />
        <Route path="/services/360" element={<PageTransition><FullStackService /></PageTransition>} />
        <Route path="/cgu" element={<PageTransition><CGU /></PageTransition>} />
        <Route path="/cgv" element={<PageTransition><CGV /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />
        <Route path="/mentions-legales" element={<PageTransition><MentionsLegales /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
