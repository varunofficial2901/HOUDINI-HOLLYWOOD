import React, { useLayoutEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CareerSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo('.career-title',
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

      gsap.fromTo('.career-desc',
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
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-32 bg-slate-950 text-center border-b border-white/5">

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">

        <p className="text-xs sm:text-sm text-violet-400 mb-4 sm:mb-6 tracking-widest uppercase">
          Turn Skills Into Opportunities
        </p>

        <h2 className="career-title text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 sm:mb-8">
          Start Your Journey in VFX
        </h2>

        <p className="career-desc text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 px-2">
          Whether you want to freelance, work in studios, or build your own creative projects — these skills give you a real starting point.
        </p>

        <p className="text-xs sm:text-sm text-slate-500">
          Freelancing • Studio roles • Creative independence
        </p>

       <Link
  to="/enroll"
  className="inline-block px-6 m-4 sm:m-7 py-2 sm:py-3 bg-[var(--accent)] rounded-lg text-white text-sm sm:text-base font-semibold hover:scale-105 transition"
>
  ENROLL NOW →
</Link>

      </div>
    </section>
  );
}