'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { CustomVariants } from 'framer-motion';

const textVariants: CustomVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  })
} as const;

const containerVariants: CustomVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
} as const;
 
export function SplineSceneBasic() {
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Setup mouse tracking for Spline
    const handleMouseMove = (e: MouseEvent) => {
      const container = splineContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Send mouse position to Spline iframe
      try {
        const splineIframe = container.querySelector('iframe');
        if (splineIframe && splineIframe.contentWindow) {
          splineIframe.contentWindow.postMessage(
            {
              type: 'MOUSE_MOVE',
              x: x / rect.width,
              y: y / rect.height
            },
            '*'
          );
        }
      } catch (err) {
        // Silently handle if iframe is not accessible
      }
    };

    const container = splineContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <Card 
      className="w-full h-auto md:h-[600px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden border-0 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content - Enhanced Yavuli Section */}
        <motion.div 
          className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center items-start space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Gradient accent line */}
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-transparent rounded-full"
            variants={textVariants}
            custom={0}
          />
          
          {/* Main Title with Animation */}
          <motion.div className="space-y-4" variants={containerVariants}>
            <motion.h1 
              className="text-6xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 leading-tight tracking-tighter"
              variants={textVariants}
              custom={1}
              animate={{ 
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              YAVULI
            </motion.h1>
            
            {/* Subtitle with smooth animation */}
            <motion.p 
              className="text-2xl lg:text-3xl font-bold text-white/95 leading-tight max-w-lg"
              variants={textVariants}
              custom={2}
            >
              Experience Your Campus In A Whole New Dimension
            </motion.p>
            
            {/* Description */}
            <motion.p 
              className="text-lg text-white/70 max-w-lg leading-relaxed font-light mt-4"
              variants={textVariants}
              custom={3}
            >
              The ultimate student marketplace connecting campus needs with real opportunities. Buy, sell, and trade with verified students from your university.
            </motion.p>
          </motion.div>
          
          {/* Feature pills */}
          <motion.div 
            className="flex flex-wrap gap-3 pt-4"
            variants={containerVariants}
            custom={4}
          >
            {['Verified Students', 'Campus-Only', 'Secure Trades'].map((feature, i) => (
              <motion.div 
                key={i} 
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-white/80 text-sm font-medium"
                variants={textVariants}
                custom={5 + i}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(251, 146, 60, 0.3)',
                  borderColor: 'rgba(251, 191, 36, 0.5)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right content - Spline Scene */}
        <div 
          ref={splineContainerRef}
          className="flex-1 relative block md:flex-1"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-indigo-900/5 to-transparent pointer-events-none" />
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
