import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { CookieBanner } from "@/components/CookieBanner";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import { DemoDataProvider } from "@/contexts/DemoDataContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoAuthProvider>
          <DemoDataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
              <CookieBanner />
              <ScrollToTop />
            </BrowserRouter>
          </DemoDataProvider>
        </DemoAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
