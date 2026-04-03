import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

export default function IndustryLogos() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading block animation
      gsap.fromTo('.industry-heading-block',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", 
          scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
        }
      );

      // Logo strip animation
      gsap.fromTo('.industry-logo-strip',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.3,
          scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const logos = [
    // Logo 1 — DNEG
    <div key="dneg" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div className="flex items-center">
        <div className="w-1.5 h-1.5 bg-white mr-1.5"></div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'white', letterSpacing: '-0.02em' }}>
          DNEG
        </span>
      </div>
    </div>,

    // Logo 2 — anibrain
    <div key="anibrain" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.95rem', color: 'white', border: '1.5px solid white', padding: '0.4rem 0.8rem' }}>
        <span style={{ fontWeight: 700 }}>a</span>nibrain
      </div>
    </div>,

    // Logo 3 — assemblageSTUDIO
    <div key="assemblage" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: '0.85rem', color: 'white', border: '1.5px solid white', padding: '0.4rem 1rem', letterSpacing: '0.02em' }}>
        assemblageSTUDIO
      </div>
    </div>,

    // Logo 4 — HMX
    <div key="hmx" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'white', border: '1.5px solid white', padding: '0.5rem 1.2rem', letterSpacing: '0.15em' }}>
        H M X
      </div>
    </div>,

    // Logo 5 — 88 eighty eight pictures
    <div key="88" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div className="flex flex-col items-center leading-none" style={{ color: '#c9960c' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>88</span>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.5rem', marginTop: '1px' }}>eighty eight</span>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', marginTop: '1px' }}>pictures</span>
      </div>
    </div>,

    // Logo 6 — METHOD STUDIOS
    <div key="method" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.75rem', color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.9rem', textAlign: 'center', lineHeight: 1.2 }}>
        METHOD<br/>STUDIOS
      </div>
    </div>,

    // Logo 7 — VFXWAALA
    <div key="vfxwaala" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.5rem', color: 'white', border: '1.5px solid white', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1.1 }}>
        VFX<br/>WAALA
      </div>
    </div>,

    // Logo 8 — Industrial Light & Magic
    <div key="ilm" className="industry-logo group" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 2.5rem', opacity: 0.75, filter: 'grayscale(20%)',
      transition: 'opacity 0.3s, filter 0.3s, transform 0.3s', cursor: 'default', flexShrink: 0
    }}>
      <div style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.75rem', color: 'white', border: '1.5px solid white', padding: '0.5rem 0.8rem', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '0.3rem', lineHeight: 1.2 }}>
        <span className="text-[0.9rem]">⚙</span>
        <span>Industrial<br/>Light & Magic</span>
      </div>
    </div>
  ];

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, #0d0d0d 50%, var(--bg) 100%)', padding: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logoScroll {
          0% { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
        .logo-scroller:hover .logo-strip-inner {
          animation-play-state: paused;
        }
        .industry-logo:hover {
          opacity: 1 !important;
          filter: grayscale(0%) !important;
          transform: scale(1.08) !important;
        }
        @media (max-width: 640px) {
          .industry-logo {
            transform: scale(0.85);
            margin: 0 1.5rem !important;
          }
          .industry-logo:hover {
            transform: scale(0.92) !important;
          }
        }
      `}} />

      <div className="industry-heading-block w-full" style={{
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        borderTop: '1px solid #333', borderBottom: '1px solid #333',
        padding: '1.2rem 0', textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'white',
          textShadow: '0 2px 20px rgba(255,255,255,0.1)', margin: 0
        }}>
          WHERE HOUDINI DEMAND IN INDUSTRY
        </h2>
      </div>

      <div className="industry-logo-strip logo-scroller w-full relative" style={{
        background: '#0a0a0a', borderBottom: '1px solid #222', padding: '1.8rem 0', overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)'
      }}>
        <div className="logo-strip-inner" style={{
          display: 'flex', width: 'max-content',
          animation: 'logoScroll 25s linear infinite'
        }}>
          {logos}
          {logos}
        </div>
      </div>
    </div>
  );
}
