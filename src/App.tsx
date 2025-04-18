import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Communities from "./pages/Communities";
import NotFound from "./pages/NotFound";
import ProjectDetails from "./pages/ProjectDetails";
// import AdminEditProject from "./pages/AdminEditProject"; // Removed import
import AuthCallback from "./pages/AuthCallback";
// import Profile from "./pages/Profile"; // Remove import
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                {/* <Route path="/admin/edit-project/:id" element={<AdminEditProject />} /> */}{/* Removed route */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* <Route path="/profile" element={<Profile />} /> */}{/* Remove route */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
