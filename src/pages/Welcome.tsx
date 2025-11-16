// Welcome.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Spline from '@splinetool/react-spline';
import './Welcome.css';
import type { CustomVariants } from 'framer-motion';

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

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Enhanced Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
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
              className="w-full h-[500px] md:h-[600px] relative -mt-16 md:-mt-24 mx-auto px-0"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 w-full h-full">
                <Spline
                  scene="https://prod.spline.design/8j4wWMLIqsBOGK-o/scene.splinecode"
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 text-center pb-8 z-20">
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow-lg font-poppins"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Experience Your Campus in
                  <span className="block mt-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent font-extrabold tracking-tight">
                    A Whole New Dimension
                  </span>
                </motion.h2>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/explore">
                <Button 
                  asChild
                  size="lg" 
                  className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg font-semibold py-7 px-12 rounded-2xl overflow-hidden group border-0 font-poppins"
                >
                  <div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    <div className="relative z-10 flex items-center">
                      <Rocket className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                      <span>Explore Marketplace</span>
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                  </div>
                </Button>
              </Link>
            </motion.div>
            
            <motion.div className="flex gap-4" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/20 backdrop-blur-xl text-white border-white/40 hover:bg-white/30 hover:border-white/60 hover:text-white transition-all duration-300 font-medium py-7 px-10 rounded-2xl shadow-lg font-poppins border-2"
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold py-7 px-14 rounded-2xl group overflow-hidden border-0 font-poppins"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    <div className="relative z-10 flex items-center">
                      <Sparkles className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                      <span>Get Started Today</span>
                    </div>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 px-4 md:px-8"
            variants={containerVariants}
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
                variants={itemVariants}
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
                      <div key={idx} className="flex items-center text-sm text-white/90 font-medium">
                        <CheckCircle className="h-4 w-4 text-amber-300 mr-3 transition-transform duration-300 group-hover:scale-110" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div 
            className="max-w-2xl mx-auto pt-16 px-4"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-7 w-7 text-amber-300 fill-current mx-1 transition-transform duration-300 hover:scale-110" />
                ))}
              </div>
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
            variants={itemVariants}
          >
            <p className="text-white/80 text-xl mb-8 font-light tracking-wide">
              Ready to join thousands of students buying and selling on campus?
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup">
                <Button 
                  asChild
                  size="lg" 
                  className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold py-7 px-14 rounded-2xl overflow-hidden group border-0 font-poppins"
                >
                  <div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    <div className="relative z-10 flex items-center">
                      <Sparkles className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                      <span>Get Started Today</span>
                    </div>
                  </div>
                </Button>
              </Link>
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