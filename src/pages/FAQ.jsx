import { useState, useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  const faqs = [
    {
      q: "How do I access courses after enrollment?",
      a: "You will get access instructions after enrolling. Recorded courses are available on the platform and live classes are shared through private groups."
    },
    {
      q: "Are the courses beginner friendly?",
      a: "Yes, we start from fundamentals and gradually move to advanced production-level workflows."
    },
    {
      q: "Do I get lifetime access?",
      a: "Yes, recorded courses come with lifetime access so you can revisit anytime."
    },
    {
      q: "How are live classes conducted?",
      a: "Live sessions are conducted through scheduled classes and you will receive joining details after enrollment."
    },
    {
      q: "Will I get project files?",
      a: "Yes, important project files and setups are provided during the course."
    },
    {
      q: "What system requirements are needed?",
      a: "A decent system with GPU support is recommended for smooth simulation workflows."
    },
    {
      q: "Is there mentorship support?",
      a: "Yes, we provide continuous support through community and direct interaction."
    },
    {
      q: "Can I access the course on mobile?",
      a: "Yes, you can access recorded lectures on mobile, but for simulations a desktop is recommended."
    },
    {
      q: "Will I get a certificate?",
      a: "Yes, you will receive a certificate after completing the course."
    },
    {
      q: "Can I ask doubts during the course?",
      a: "Yes, you can ask questions anytime and get guidance from mentors."
    }
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggle = (i) => {
    setActive(active === i ? null : i);
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white px-4 sm:px-6 md:px-12 py-24"
    >

      {/* TITLE */}
      <div className="text-center max-w-3xl mt-20 mx-auto mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Everything You Need to Know
        </h1>
        <p className="text-slate-400 text-lg">
          Everything you need to know before getting started.
        </p>
      </div>

      {/* FAQ GRID */}
      <div className="max-w-4xl mx-auto space-y-5">

        {faqs.map((item, i) => (
          <div
            key={i}
            className="faq-card bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg transition hover:border-violet-500/40"
          >

            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span className="text-lg font-medium">
                {item.q}
              </span>

              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  active === i ? "rotate-180 text-violet-400" : ""
                }`}
              />
            </button>

            <div
              className={`px-6 text-slate-400 text-sm transition-all duration-300 ${
                active === i
                  ? "max-h-40 pb-5 opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              {item.a}
            </div>

          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="text-center mt-24">

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Still have questions?
        </h2>

        <p className="text-slate-400 mb-10">
          We’re here to help you. Reach out and we’ll guide you.
        </p>

        <Link
          to="/contact"
          className="inline-block px-10 py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-lg transition-all hover:scale-105"
        >
          Contact Us
        </Link>

      </div>

    </div>
  );
}