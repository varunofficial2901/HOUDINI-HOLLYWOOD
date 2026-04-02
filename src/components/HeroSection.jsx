import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [showToast, setShowToast] = useState(false);
  const heroRef = useRef(null);

  const handlePreRegister = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo('.hero-title',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );

      // Subtitle
      gsap.fromTo('.hero-subtitle',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );

      // Buttons
      gsap.fromTo('.hero-buttons',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );

      // Visual / Floating elements
      gsap.fromTo('.hero-visual',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]">
      {/* Background gradients */}
      {/* 🎬 VIDEO BACKGROUND */}
      <video
        src="/videos/02.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-100"
      />
      {/* 🌑 DARK OVERLAY */}
      {/* <div className="absolute inset-0 z-[1]" */}
      {/* style={{
        background: `
      linear-gradient(
        to bottom,
        rgba(10,10,15,0.3) 0%,
        rgba(10,10,15,0.5) 60%,
        rgba(10,10,15,0.75) 100%
      )
    `
      }}
      /> */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-[2]" />
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none z-[2]" /> */}

      {/* Animated Visual Elements */}
      <div className="hero-visual absolute top-40 right-20 lg:right-40 z-0">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl opacity-20 blur-xl"
        />
      </div>
      <div className="hero-visual absolute bottom-40 left-10 lg:left-32 z-0 hidden md:block">
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full opacity-20 blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium tracking-wide">Master the Art of Motion</span>
        </motion.div>

        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500">Cinematic FX School</span>
        </h1>

        <p className="hero-subtitle max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10">
          Learn elite animation techniques from industry pros. Whether you are a beginner or a seasoned designer, take your skills to the next level.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/courses"
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)] inline-block text-center"
          >
            Explore Courses
          </Link>

          <Link
            to="/enroll"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-colors inline-block text-center"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}
