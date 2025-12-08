import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Studio from "./pages/Studio";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import WebService from "./pages/services/WebService";
import MobileService from "./pages/services/MobileService";
import BackofficeService from "./pages/services/BackofficeService";
import FullStackService from "./pages/services/FullStackService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/web" element={<WebService />} />
          <Route path="/services/mobile" element={<MobileService />} />
          <Route path="/services/backoffice" element={<BackofficeService />} />
          <Route path="/services/360" element={<FullStackService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
