// start the app always with '/' route
import { Toaster as Sonner } from "@/components/ui/sonner";

import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { TooltipProvider } from "./components/ui/tooltip";

import { ThemeProvider } from "./components/layout/theme-provider";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";
import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import Wallet from "./pages/wallet";
import Referrals from "./pages/referrals";
import FAQ from "./pages/faq";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Index />} />
              <Route path='/wallet' element={<Wallet />} />
              <Route path='/referrals' element={<Referrals />} />
              <Route path='/faq' element={<FAQ />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/signup' element={<SignupForm />} />
              <Route path='/logout' element={<Logout />} />
            </Routes>
          </BrowserRouter>
          <Sonner />
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);