import Lenis from "@studio-freight/lenis";
import React, { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPage';
import EnrollNow from './pages/EnrollNow';
import Courses from './pages/Courses';
// import Pricing from './pages/Pricing';
import Community from './pages/Community';
// import Checkout from "./pages/Checkout";
import HoudiniCourse from './pages/HoudiniCourse'
import BlenderCourse from './pages/BlenderCourse'
import NukeCourse from './pages/NukeCourse'
import UnrealCourse from './pages/UnrealCourse'
import Contact from './components/Contact'
import FAQ from './pages/FAQ'


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

    // 🔥 INIT LENIS
    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 🔥 SYNC GSAP WITH LENIS
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 🔥 CLEANUP
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
    };

  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          {/* <Route path="/pricing" element={<Pricing />} /> */}
          <Route path="/community" element={<Community />} />
          <Route path="/enroll" element={<EnrollNow />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/course/houdini-animation" element={<HoudiniCourse />} />
          <Route path="/course/blender" element={<BlenderCourse />} />
          <Route path="/course/nuke" element={<NukeCourse />} />
          <Route path="/course/unreal" element={<UnrealCourse />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
