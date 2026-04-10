/**
 * src/App.jsx  ← REPLACE your existing App.jsx with this
 *
 * Changes from your original:
 *   1. Import AuthProvider from context/AuthContext
 *   2. Wrap <MainApp /> with <AuthProvider>
 *   Everything else is identical to your original.
 */
import Lenis from "@studio-freight/lenis";
import React, { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── NEW IMPORT ────────────────────────────────────────────
import { AuthProvider } from './context/AuthContext';
// ─────────────────────────────────────────────────────────

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPage';
import EnrollNow from './pages/EnrollNow';
import Courses from './pages/Courses';
import Community from './pages/Community';
import HoudiniCourse from './pages/HoudiniCourse';
import BlenderCourse from './pages/BlenderCourse';
import NukeCourse from './pages/NukeCourse';
import UnrealCourse from './pages/UnrealCourse';
import Contact from './components/Contact';
import FAQ from './pages/FAQ';
import PaymentChoice from "./pages/PaymentChoice";
import PaymentPanel from "./pages/PaymentPanel";


gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainApp() {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                         element={<Home />} />
          <Route path="/courses"                  element={<Courses />} />
          <Route path="/community"                element={<Community />} />
          <Route path="/enroll"                   element={<EnrollNow />} />
          <Route path="/terms"                    element={<TermsAndConditions />} />
          <Route path="/privacy"                  element={<PrivacyPolicy />} />
          <Route path="/course/houdini-animation" element={<HoudiniCourse />} />
          <Route path="/course/blender"           element={<BlenderCourse />} />
          <Route path="/course/nuke"              element={<NukeCourse />} />
          <Route path="/course/unreal"            element={<UnrealCourse />} />
          <Route path="/contact"                  element={<Contact />} />
          <Route path="/faq"                      element={<FAQ />} />
          <Route path="/payment-choice"           element={<PaymentChoice />} />
          <Route path="/payment"                  element={<PaymentPanel />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* ── AuthProvider wraps everything so any component can call useAuth() ── */}
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

