import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HoudiniCourse() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".course-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="min-h-screen bg-black text-white px-6 md:px-16 py-20">

      {/* HERO */}
      <div className="text-center mt-20 mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Houdini Animation
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Master cinematic FX, simulations, and destruction with live mentorship.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">

        {/* WATER */}
        <div className="course-card p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-[1.03] transition">
          <h2 className="text-2xl font-bold mb-4">Water & FLIP Simulation</h2>
          <ul className="text-slate-400 space-y-2">
            <li>River Simulation & Rendering</li>
            <li>Flip Tank & Narrow Band</li>
            <li>Boundary Layer & Splash</li>
            <li>Ocean Spectrum & Whitewater</li>
          </ul>
        </div>

        {/* PYRO */}
        <div className="course-card p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-[1.03] transition">
          <h2 className="text-2xl font-bold mb-4">Pyro FX</h2>
          <ul className="text-slate-400 space-y-2">
            <li>Velocity & Divergence</li>
            <li>Explosion Setup</li>
            <li>Vortex & Disturbance</li>
            <li>Realistic Fire</li>
          </ul>
        </div>

        {/* VELLUM */}
        <div className="course-card p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-[1.03] transition">
          <h2 className="text-2xl font-bold mb-4">Vellum & Cloth</h2>
          <ul className="text-slate-400 space-y-2">
            <li>Cloth Constraints</li>
            <li>Soft Bodies</li>
            <li>Peeling & Tearing</li>
            <li>Grains Simulation</li>
          </ul>
        </div>

        {/* POP */}
        <div className="course-card p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-[1.03] transition">
          <h2 className="text-2xl font-bold mb-4">Particle FX (POP)</h2>
          <ul className="text-slate-400 space-y-2">
            <li>Velocity & Forces</li>
            <li>Rain & Debris</li>
            <li>Disintegration</li>
            <li>Fireworks</li>
          </ul>
        </div>

        {/* RBD */}
        <div className="course-card p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:scale-[1.03] transition md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Destruction (RBD)</h2>
          <ul className="text-slate-400 space-y-2 grid md:grid-cols-2">
            <li>Fracturing Techniques</li>
            <li>Ground Destruction</li>
            <li>Constraints & Clusters</li>
            <li>Building Destruction</li>
          </ul>
        </div>

      </div>

      {/* CTA */}
      <div className="mt-28 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Become a Houdini Artist?
        </h2>

        <p className="text-slate-400 mb-10 text-lg">
          Learn from real production workflows and build industry-level FX.
        </p>

        <Link
          to="/payment-choice"
          className="inline-flex items-center gap-2 px-12 py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105"
        >
          Enroll Now <ChevronRight />
        </Link>
      </div>

    </div>
  );
}