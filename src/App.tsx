import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CookieBanner } from "@/components/CookieBanner";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DemoAuthProvider } from "@/contexts/DemoAuthContext";
import { DemoDataProvider } from "@/contexts/DemoDataContext";
import { WhiteLabelProvider } from "@/hooks/use-white-label";

const queryClient = new QueryClient();

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoAuthProvider>
          <DemoDataProvider>
            <WhiteLabelProvider>
              <LoadingScreen onComplete={() => setIsLoaded(true)} />
              <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AnimatedRoutes />
                  <CookieBanner />
                  <ScrollToTop />
                </BrowserRouter>
              </div>
            </WhiteLabelProvider>
          </DemoDataProvider>
        </DemoAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
