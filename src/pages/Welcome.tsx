import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { CustomVariants } from 'framer-motion';
import { SplineSceneBasic } from "@/components/ui/demo";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { 
  Sparkles, 
  ShoppingBag, 
  Shield, 
  Users, 
  Rocket, 
  ArrowRight, 
  CheckCircle,
  Star,
  Zap,
  TrendingUp
} from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('Welcome component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams));
    
    // Check if this is an OAuth callback
    const code = searchParams.get('code');
    const sessionState = searchParams.get('state');
    
    console.log('Code from URL:', code);
    console.log('State from URL:', sessionState);
    
    if (code || sessionState) {
      console.log('Starting OAuth processing...');
      setIsProcessing(true);
      setDebugInfo('Processing OAuth...');
      
      // Wait for Supabase to process the OAuth code
      const handleOAuthCallback = async () => {
        try {
          console.log('Waiting for session to be established...');
          setDebugInfo('Waiting for session...');
          
          // Wait longer for the session to be established by Supabase
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          console.log('Checking for session...');
          setDebugInfo('Checking session...');
          
          // Check if session was established
          const { data: { session }, error } = await supabase.auth.getSession();
          
          console.log('Session check result:', { session: !!session, error });
          setDebugInfo(`Session: ${session ? 'Found' : 'Not found'}`);
          
          if (session) {
            console.log('Session found! Redirecting to explore...');
            navigate('/explore', { replace: true });
          } else {
            console.log('No session found. Redirecting to login...');
            navigate('/login', { replace: true });
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          setDebugInfo(`Error: ${error}`);
          navigate('/login', { replace: true });
        }
      };

      // Set a timeout to force redirect after 10 seconds
      const timeoutId = setTimeout(() => {
        console.log('Timeout: Forcing redirect to login');
        navigate('/login', { replace: true });
      }, 10000);

      handleOAuthCallback().finally(() => {
        clearTimeout(timeoutId);
        setIsProcessing(false);
      });
    }
  }, [searchParams, navigate]);

  // Show loading screen while processing OAuth
  if (isProcessing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative z-50">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Processing your login...</h2>
            <p className="text-white/70 text-lg">Please wait while we verify your credentials.</p>
            {debugInfo && <p className="text-white/50 text-sm mt-4">{debugInfo}</p>}
          </div>
        </div>
      </div>
    );
  }
  const containerVariants: CustomVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
} as const;

  const itemVariants: CustomVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
} as const;

  const scrollVariants: CustomVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1]
    }
  }
} as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Dark gradient overlay with accents */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
      
      {/* Floating Particles - Subtle and Dark */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        className="w-full max-w-full px-0 min-h-screen flex items-center justify-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-full px-0 space-y-16 py-20">
          {/* Header Section */}
          <motion.div className="text-center space-y-8" variants={containerVariants}>
            {/* Spline 3D Scene - Full Width */}
            <motion.div 
              className="w-full relative mx-auto px-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <SplineSceneBasic />
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => navigate('/explore')}
                size="lg" 
                className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg font-semibold py-7 px-12 rounded-2xl overflow-hidden group border-0 font-poppins cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                <div className="relative z-10 flex items-center">
                  <Rocket className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span>Explore Marketplace</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </Button>
            </motion.div>
            
            <motion.div className="flex gap-4" variants={itemVariants}>
              <div>
                <Button 
                  onClick={() => window.location.href = '/login'}
                  size="lg" 
                  variant="outline" 
                  className="bg-white/20 backdrop-blur-xl text-white border-white/40 hover:bg-white/30 hover:border-white/60 hover:text-white transition-all duration-300 font-medium py-7 px-10 rounded-2xl shadow-lg font-poppins border-2 cursor-pointer"
                >
                  Login
                </Button>
              </div>
              
              <div>
                <Button 
                  onClick={() => window.location.href = '/signup'}
                  size="lg" 
                  className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold py-7 px-14 rounded-2xl group overflow-hidden border-0 font-poppins cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                  <div className="relative z-10 flex items-center">
                    <Sparkles className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span>Get Started Today</span>
                  </div>
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 px-4 md:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.1
                }
              }
            }}
          >
            {[
              {
                icon: ShoppingBag,
                title: "Smart Trading",
                description: "Buy & sell with campus-exclusive deals and secure payments",
                features: ["Secure Payments", "Campus-Only Deals", "Easy Listings"],
                gradient: "from-amber-400 to-orange-500",
                bgGradient: "from-amber-400/10 to-orange-500/10"
              },
              {
                icon: Shield,
                title: "Verified Safety",
                description: "College email verification ensures a trusted community",
                features: ["Email Verification", "Safe Meetings", "Community Guidelines"],
                gradient: "from-indigo-400 to-purple-500",
                bgGradient: "from-indigo-400/10 to-purple-500/10"
              },
              {
                icon: Users,
                title: "Community First",
                description: "Built by students, for students with campus-specific features",
                features: ["Campus Groups", "Student Support", "Local Pickups"],
                gradient: "from-emerald-400 to-teal-500",
                bgGradient: "from-emerald-400/10 to-teal-500/10"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className={`p-8 rounded-3xl bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group`}
                variants={scrollVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-white mb-4 font-poppins tracking-tight">{feature.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed font-light">
                    {feature.description}
                  </p>
                  <div className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-center text-sm text-white/90 font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 text-amber-300 mr-3 transition-transform duration-300 group-hover:scale-110" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div 
            className="max-w-2xl mx-auto pt-16 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={scrollVariants}
          >
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              <motion.div 
                className="flex items-center justify-center mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: star * 0.1, duration: 0.4 }}
                  >
                    <Star className="h-7 w-7 text-amber-300 fill-current mx-1 transition-transform duration-300 hover:scale-110" />
                  </motion.div>
                ))}
              </motion.div>
              <blockquote className="text-xl text-white/90 italic mb-6 text-center leading-relaxed font-light">
                "Yavuli made it so easy to sell my textbooks and find affordable furniture for my dorm. The campus-only community makes everything feel safe and trustworthy!"
              </blockquote>
              <div className="text-center">
                <div className="text-lg font-semibold text-white font-poppins">Sarah M.</div>
                <div className="text-white/70 font-light">Computer Science Student</div>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div 
            className="text-center pt-12 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={scrollVariants}
          >
            <p className="text-white/80 text-xl mb-8 font-light tracking-wide">
              Ready to join thousands of students buying and selling on campus?
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/explore')}
                size="lg" 
                className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold py-7 px-14 rounded-2xl overflow-hidden group border-0 font-poppins cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                <div className="relative z-10 flex items-center">
                  <Sparkles className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span>Get Started Today</span>
                </div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p className="text-white/60 font-light text-sm tracking-wide">
          Connecting Students • Empowering Trades • Building Communities
        </p>
      </motion.div>
    </div>
  );
};

export default Welcome;