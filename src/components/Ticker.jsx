import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Ticker() {
  const tickerRef = useRef(null);

  useLayoutEffect(() => {
    // Continuous scroll animation
    const ctx = gsap.context(() => {
      gsap.to(".ticker-track", {
        xPercent: -50,
        repeat: -1,
        ease: "linear",
        duration: 15
      });
    }, tickerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={tickerRef} className="py-3 sm:py-4 bg-violet-600/20 border-y border-white/5 overflow-hidden flex whitespace-nowrap">
      {/* Track that is twice as long so it scrolls seamlessly */}
      <div className="ticker-track flex gap-3 sm:gap-5 md:gap-8 whitespace-nowrap items-center px-3 sm:px-4 w-max">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-3 sm:gap-5 md:gap-8 items-center text-xs sm:text-sm font-bold tracking-widest text-violet-300 uppercase">
            <span>Learn from Pros</span>
            <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            <span>Master Houdini</span>
            <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            <span>Industry Standard Tools</span>
            <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            <span>Unreal Engine 5</span>
            <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            <span>Visual Effects</span>
            <span className="w-2 h-2 bg-white/20 rounded-full"></span>
            <span>Motion Design</span>
            <span className="w-2 h-2 bg-white/20 rounded-full"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
