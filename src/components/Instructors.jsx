import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const instructors = [
  { id: 1, name: 'Jason Smith', role: 'Lead FX Artist', company: 'ILM' },
  { id: 2, name: 'Sarah Connor', role: 'Senior Technical Director', company: 'Weta Digital' },
  { id: 3, name: 'David Singh', role: 'Environment TD', company: 'DNEG' },
  { id: 4, name: 'Elena Rostova', role: 'Motion Capture Lead', company: 'Sony Pictures' }
];

export default function Instructors() {
  const sectionRef = useRef(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo('.sect-title-inst', 
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.sect-title-inst',
            start: "top 85%"
          }
        }
      );

      // Instructor cards alternate left/right
      const cards = gsap.utils.toArray('.instructor-card');
      
      cards.forEach((card, i) => {
        // Even index (0, 2) from left (-100), odd index (1, 3) from right (100)
        const xOffset = i % 2 === 0 ? -100 : 100;
        
        gsap.fromTo(card,
          { opacity: 0, x: xOffset },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%"
            }
          }
        );
      });
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 bg-slate-950 relative border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-14 md:mb-16 text-center">
          <h2 className="sect-title-inst text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 pb-2">
            Meet the Masters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="instructor-card glass p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700 shrink-0 object-cover" />
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{instructor.name}</h3>
                <p className="text-sm sm:text-base text-emerald-400 font-medium mb-1">{instructor.role}</p>
                <p className="text-xs uppercase tracking-wider text-slate-400">{instructor.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
