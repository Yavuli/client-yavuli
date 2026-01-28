import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const Welcome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // OAuth Logic
    const code = searchParams.get('code');
    const sessionState = searchParams.get('state');

    if (code || sessionState) {
      setIsProcessing(true);
      setDebugInfo('Processing OAuth...');

      const handleOAuthCallback = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            navigate('/explore', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        } catch (error) {
          navigate('/login', { replace: true });
        }
      };

      const timeoutId = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 10000);

      handleOAuthCallback().finally(() => {
        clearTimeout(timeoutId);
        setIsProcessing(false);
      });
    }
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white relative z-50">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing your login...</h2>
            <p className="text-slate-500 font-medium">Please wait while we verify your credentials.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-white overflow-x-hidden selection:bg-primary/20">
      {/* Background layer */}
      <div className="fixed inset-0 z-0">
        <TheInfiniteGrid />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
          <div className="text-2xl font-black tracking-tighter text-slate-900 select-none cursor-pointer" onClick={() => navigate('/')}>
            YAVULI
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden sm:inline-flex text-slate-500 hover:text-slate-900 hover:bg-transparent transition-colors">
                  Support <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 border-slate-100 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Us</div>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-default rounded-xl hover:bg-slate-50">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Phone className="h-4 w-4" />
                    <span>Call Support</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">+91 8000363769</span>
                </DropdownMenuItem>
                <div className="h-px bg-slate-100 my-2 mx-1" />
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-default rounded-xl hover:bg-slate-50">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Mail className="h-4 w-4" />
                    <span>Email Us</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 break-all">kishlayamishra@gmail.com</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-500 hover:text-slate-900">
              Sign In
            </Button>
            <Button onClick={() => navigate('/explore')} className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all active:scale-95">
              Explore
            </Button>
          </div>
        </div>
      </nav>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-4 pt-48 pb-32 max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold tracking-wide mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span>EXCLUSIVELY FOR STUDENTS</span>
          </motion.div>

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
            <Button size="lg" className="px-12 h-16 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95" onClick={() => navigate('/explore')}>
              Start Browsing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-12 h-16 text-lg font-bold rounded-2xl bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-slate-50 transition-colors text-slate-600" onClick={() => navigate('/sell')}>
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
          <Button size="lg" className="px-16 h-20 text-xl font-black rounded-[2rem] shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-2 active:scale-95 bg-primary text-primary-foreground" onClick={() => navigate('/signup')}>
            Join Early Today <Sparkles className="ml-3 h-6 w-6" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="relative z-20 border-t border-slate-100 py-20 px-6 bg-white/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <div className="text-3xl font-black tracking-tighter text-slate-900">YAVULI</div>
              <p className="text-slate-400 font-medium max-w-xs uppercase text-xs tracking-[0.2em]">
                The premier marketplace for the next generation of students.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Navigation</h4>
                <ul className="space-y-2 text-sm text-slate-500 font-medium">
                  <li><button onClick={() => navigate('/explore')} className="hover:text-primary transition-colors">Explore</button></li>
                  <li><button onClick={() => navigate('/sell')} className="hover:text-primary transition-colors">Sell Items</button></li>
                  <li><button onClick={() => navigate('/login')} className="hover:text-primary transition-colors">Sign In</button></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Policy</h4>
                <ul className="space-y-2 text-sm text-slate-500 font-medium">
                  <li><button className="hover:text-primary transition-colors">Safety Tips</button></li>
                  <li><button className="hover:text-primary transition-colors">Privacy</button></li>
                  <li><button className="hover:text-primary transition-colors">Terms</button></li>
                </ul>
              </div>
              <div className="space-y-4 col-span-2 lg:col-span-1">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Contact</h4>
                <div className="space-y-2 text-sm text-slate-500 font-medium">
                  <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> +91 8000363769</p>
                  <p className="flex items-center gap-2 max-w-[200px] break-all"><Mail className="h-3 w-3" /> kishlayamishra@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-20 text-center">
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.5em] uppercase opacity-50">
              © 2026 Yavuli Marketplace • Built For Students
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;