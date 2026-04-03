import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PhotoshopCourse() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(".fade-up", 
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          }
        }
      );

    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >

      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-indigo-900/20 blur-2xl" />

      {/* CONTENT */}
      <div className="relative z-10 text-center max-w-3xl">

        {/* TAG */}
        <div className="fade-up inline-block px-4 py-1 mb-6 rounded-full bg-violet-500/20 text-violet-400 text-sm tracking-wide">
          COMING SOON
        </div>

        {/* TITLE */}
        <h1 className="fade-up text-5xl md:text-7xl font-bold mb-6">
          Photoshop Mastery
        </h1>

        {/* SUBTEXT */}
        <p className="fade-up text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
          We are crafting a high-quality Photoshop course focused on cinematic design, compositing, 
          and industry-level workflows. Stay tuned for something powerful.
        </p>

        {/* FEATURES PREVIEW */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="fade-up p-5 rounded-xl bg-white/5 border border-white/10">
            Cinematic Compositing
          </div>

          <div className="fade-up p-5 rounded-xl bg-white/5 border border-white/10">
            Advanced Color Grading
          </div>

          <div className="fade-up p-5 rounded-xl bg-white/5 border border-white/10">
            Industry Workflows
          </div>

        </div>

        {/* CTA */}
        <Link
          to="/enroll"
          className="fade-up inline-flex items-center gap-2 px-10 py-4 bg-violet-600 hover:bg-violet-500 transition-all duration-300 hover:scale-105 rounded-lg font-semibold shadow-lg"
        >
          Get Early Access <ChevronRight size={18} />
        </Link>

      </div>

      {/* LIGHT GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-violet-600/20 blur-[150px] rounded-full bottom-[-100px] right-[-100px]" />

    </div>
  );
}