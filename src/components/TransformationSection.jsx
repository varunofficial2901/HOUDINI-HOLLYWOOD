import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TransformationSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo('.transform-title',
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

      gsap.fromTo('.transform-desc',
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

        <p className="text-xs sm:text-sm text-blue-400 mb-4 sm:mb-6 tracking-widest uppercase">
          From Beginner to Professional
        </p>

        <h2 className="transform-title text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 sm:mb-8">
          Build Skills That Actually Matter
        </h2>

        <p className="transform-desc text-slate-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 px-2">
          Learn step-by-step how to create cinematic simulations — not just watch tutorials, but actually build work that looks production-ready.
        </p>

        <p className="text-xs sm:text-sm text-slate-500">
          No fluff • Clear structure • Real learning outcomes
        </p>

      </div>
    </section>
  );
}