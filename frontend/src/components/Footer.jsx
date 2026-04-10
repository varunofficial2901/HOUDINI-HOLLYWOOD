import React, { useLayoutEffect, useRef } from 'react';
import { PlayCircle, Globe, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-links",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-white/5 bg-[var(--card)]/50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/photos/logonew.jpeg" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
                Creative India School
              </span>
            </div>

            <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
              Empowering creators with premium animation courses. Learn from the best, become the best.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="#" className="text-[var(--muted)] hover:text-white transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="text-[var(--muted)] hover:text-white transition">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="text-[var(--muted)] hover:text-white transition">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COURSES + SUPPORT */}
          <div className="col-span-2">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-24 text-sm">

              {/* COURSES */}
              <div className="footer-links">
                <h4 className="text-white text-base font-semibold mb-6 tracking-wide">
                  Courses
                </h4>

                <ul className="space-y-4 text-slate-400">
                  {[
                    { name: "Houdini Animation", link: "/course/houdini-animation" },
                    { name: "After Effects", link: "/course/blender" },
                    { name: "Nuke Compositing", link: "/course/nuke" },
                    { name: "Photoshop", link: "/course/unreal" },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.link}
                        className="group flex items-center gap-2 hover:text-white transition duration-300"
                      >
                        <span className="w-0 group-hover:w-4 h-[2px] bg-violet-500 transition-all duration-300"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SUPPORT */}
              <div className="footer-links">
                <h4 className="text-white text-base font-semibold mb-6 tracking-wide">
                  Support
                </h4>

                <ul className="space-y-4 text-slate-400">
                  {[
                    { name: "Contact Us", link: "/contact" },
                    { name: "FAQs", link: "/faq" },
                    { name: "Terms & Conditions", link: "/terms" },
                    { name: "Privacy Policy", link: "/privacy" },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.link}
                        className="group flex items-center gap-2 hover:text-white transition duration-300"
                      >
                        <span className="w-0 group-hover:w-4 h-[2px] bg-violet-500 transition-all duration-300"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © 2026 Creative India School. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <Link to="/terms" className="hover:text-slate-300 transition">
              Terms
            </Link>
            <span className="text-white/10">|</span>
            <Link to="/privacy" className="hover:text-slate-300 transition">
              Privacy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}