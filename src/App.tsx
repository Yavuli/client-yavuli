import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Explore from "./pages/Explore";
import ProductDetails from "./pages/ProductDetails";
import Sell from "./pages/Sell";
import Callback from "./components/auth/Callback";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import NotFound from "./pages/NotFound";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import { ChatPage } from './pages/ChatPage'
import { Inbox } from "./pages/Inbox";
import SEO from "@/components/SEO";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <SEO />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <CartProvider>
            <TooltipProvider>
              <Sonner />
              <BrowserRouter future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/messages/:id" element={<ChatPage />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/auth/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/auth/callback" element={<Callback />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failure" element={<PaymentFailure />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;