import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo('.sect-title-test',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );

      gsap.fromTo('.sect-desc-test',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-slate-950 text-center border-b border-white/5 relative overflow-hidden"
    >

      {/* Background glow */}
      <div className="absolute left-[-100px] top-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* TOP LINE */}
        <p className="text-sm text-amber-400 mb-6 tracking-widest uppercase">
          Real Results. Real Growth.
        </p>

        {/* MAIN HEADLINE */}
        <h2 className="sect-title-test text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
          Built to Get You Industry Ready
        </h2>

        {/* DESCRIPTION */}
        <p className="sect-desc-test text-slate-300 text-lg md:text-xl leading-relaxed mb-10">
          This isn’t just another course — it’s a structured path designed to help you create production-level simulations and build skills that actually matter in real-world projects.
        </p>

        {/* TRUST LINE */}
        <p className="text-sm text-slate-500">
          Practical training • Real workflows • Designed for serious learners
        </p>

      </div>
    </section>
  );
}