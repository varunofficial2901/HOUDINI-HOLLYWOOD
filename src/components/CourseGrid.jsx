import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CourseGrid() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Title animation
      gsap.fromTo('.sect-title-course',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // Paragraph animation
      gsap.fromTo('.sect-desc-course',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-32 relative overflow-hidden border-b border-white/5 text-center bg-slate-950"
    >

      {/* Background Glow */}
      <div className="absolute top-0 right-[-100px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">

        {/* TOP LINE */}
        <p className="text-xs sm:text-sm text-violet-400 mb-4 sm:mb-6 tracking-widest uppercase">
          Built for Future VFX Artists
        </p>

        {/* MAIN HEADLINE */}
        <h2 className="sect-title-course text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 sm:mb-8">
          No Theory. Only Real Simulations.
        </h2>

        {/* DESCRIPTION */}
        <p className="sect-desc-course text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 px-2">
          Skip the boring theory — start building real fire, water, and destruction systems used in professional VFX workflows.
        </p>

        {/* TRUST LINE */}
        <p className="text-xs sm:text-sm text-slate-500">
          Beginner friendly • Step-by-step guidance • Real production techniques
        </p>

      </div>
    </section>
  );
}