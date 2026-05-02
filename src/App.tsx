import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home.tsx";
import Wizard from "./pages/Wizard.tsx";
import Results from "./pages/Results.tsx";
import Privacy from "./pages/Privacy.tsx";
import NotFound from "./pages/NotFound.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import Guides from "./pages/Guides.tsx";
import GuideArticle from "./pages/GuideArticle.tsx";
import Guide from "./pages/Guide.tsx";
import { Navigate } from "react-router-dom";
import Checklist from "./pages/Checklist.tsx";
import Examples from "./pages/Examples.tsx";
import About from "./pages/About.tsx";
import Disclaimer from "./pages/Disclaimer.tsx";
import Contact from "./pages/Contact.tsx";
import { CookieBanner } from "@/components/ui/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Wizard />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/electrical-guide" element={<Guide />} />
          <Route path="/resources" element={<Guides />} />
          <Route path="/resources/:slug" element={<GuideArticle />} />
          {/* Legacy redirects */}
          <Route path="/guide" element={<Navigate to="/electrical-guide" replace />} />
          <Route path="/guides" element={<Navigate to="/resources" replace />} />
          <Route path="/guides/:slug" element={<GuideArticle />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
