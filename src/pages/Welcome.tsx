import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Users,
  ArrowRight,
  User,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Footer from "@/components/Footer";

import YavuliLogoAnimation from "@/components/YavuliLogoAnimation";

const Welcome = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="relative min-h-screen w-full bg-white overflow-x-hidden selection:bg-primary/20">
      <SEO
        title="Yavuli | The Ultimate Student Marketplace"
        description="Yavuli is the smart, centralized marketplace for everything in your college life. Buy, sell, and connect with students."
        keywords="student marketplace, college buy sell, textbooks, college essentials"
      />
      {/* Background layer */}
      <div className="fixed inset-0 z-0">
        <TheInfiniteGrid />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
          <div className="w-40 cursor-pointer" onClick={() => navigate('/')}>
            <YavuliLogoAnimation />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-transparent font-semibold" onClick={() => navigate('/explore')}>
                Explore
              </Button>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-transparent font-semibold" onClick={() => {
                if (user) { navigate('/sell'); } else { toast.info("Please sign in to start selling"); navigate('/login'); }
              }}>
                Sell
              </Button>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-transparent font-semibold" onClick={() => navigate('/how-to-use')}>
                How to Use
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden sm:inline-flex text-slate-500 hover:text-slate-900 hover:bg-transparent transition-colors">
                  Support <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 border-slate-100 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Us</div>
                <a href="tel:+918000363769" className="block">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900 transition-colors">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Phone className="h-4 w-4" />
                      <span>Call Support</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">+91 8000363769</span>
                  </DropdownMenuItem>
                </a>
                <div className="h-px bg-slate-100 my-2 mx-1" />
                <a href="mailto:founder@yavuli.app" className="block">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900 transition-colors">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Mail className="h-4 w-4" />
                      <span>Email Us</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 break-all">founder@yavuli.app</span>
                  </DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 h-9 w-9">
                    <Avatar className="h-8 w-8 border border-slate-200">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl backdrop-blur-xl bg-white/95 shadow-2xl border-slate-100 mt-2">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-slate-900">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-slate-500 font-medium truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 my-1" />
                  <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-slate-50 focus:bg-slate-50 p-3 transition-colors font-medium" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4 text-slate-500" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 my-1" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 rounded-xl p-3 transition-colors font-bold"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-500 hover:text-slate-900 font-bold">
                Sign In
              </Button>
            )}
            <Button onClick={() => navigate('/explore')} className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all active:scale-95">
              Explore
            </Button>
          </div>
        </div>
      </nav>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-4 min-h-[85vh] pt-32 pb-20 max-w-5xl mx-auto space-y-12">


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[1] select-none">
              Buy what you <span className="text-primary italic">need,</span><br />
              sell what you <span className="text-slate-300 font-light">don't.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Yavuli is the smart, centralized marketplace for everything in your college life.
              From textbooks to gear, find your campus essentials in one secure spot.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 pt-4"
          >
            <Button
              size="lg"
              className="px-12 h-16 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
              onClick={() => navigate('/explore')}
            >
              Start Browsing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-12 h-16 text-lg font-bold rounded-2xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors text-slate-600"
              onClick={() => {
                if (user) {
                  navigate('/sell');
                } else {
                  toast.info("Please sign up or sign in to start selling");
                  navigate('/login');
                }
              }}
            >
              Start Selling
            </Button>
          </motion.div>
        </section>

        {/* Value Prop Section */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Everything College</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Whether it's lab coats, project parts, or last semester's notes, we have a place for everything that matters in your student journey.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Verified Community</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                No random strangers. Access is limited to verified college emails, ensuring you're only trading with fellow students you can trust.
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Fast Payments</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Experience smooth transitions and instant listings. Our platform is built for speed so you can get back to what matters—your studies.
              </p>
            </div>
          </div>
        </section>

        {/* Presenting Section */}
        <section className="bg-slate-50/50 py-40 border-y border-slate-100 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Presenting Yavuli.</h2>
            <p className="text-xl md:text-2xl text-slate-600 font-bold leading-normal">
              A dedicated marketplace designed specifically for the unique rhythm of campus life.
              We're building a community-driven economy where students support students,
              making college affordable and convenient for everyone.
            </p>
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900">100%</div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Student Focused</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900">Secure</div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Verified</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900">Free</div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">To Join</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-48 text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic text-slate-900">Ready to declutter?</h2>
            <p className="text-xl text-slate-500 font-medium">Join the thousands of students already trading on Yavuli.</p>
          </div>
          <Button size="lg" className="px-16 h-20 text-xl font-black rounded-[2rem] shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-2 active:scale-95 bg-primary text-primary-foreground"
            onClick={() => {
              if (user) {
                navigate('/sell');
              } else {
                navigate('/signup');
              }
            }}>
            {user ? "Sell your item" : "Join Early Today"} <Sparkles className="ml-3 h-6 w-6" />
          </Button>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Welcome;