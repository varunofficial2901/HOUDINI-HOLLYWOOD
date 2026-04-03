import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Courses() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".course-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const courses = [
    {
      title: "Houdini Animation",
      type: "LIVE CLASSES",
      desc: "Master cinematic FX, pyro, water and destruction with live mentorship.",
      price: "₹44,999",
      link: "/course/houdini-animation",
      highlight: true,
    },
    {
      title: "Nuke Composting",
      type: "RECORDED",
      desc: "Learn modeling, lighting, and rendering workflows.",
      price: "₹15,999",
      link: "/course/nuke",
      highlight: false,
    },
    {
      title: "After Effects",
      type: "RECORDED",
      desc: "Industry-level compositing and VFX integration.",
      price: "₹7,999",
      link: "/course/blender",
      highlight: false,
    },
    {
      title: "Photoshop",
      type: "RECORDED",
      desc: "Create real-time cinematic environments and effects.",
      price: "₹6,999",
      link: "/course/unreal",
      highlight: false,
    },
  ];

  return (
    <div className="bg-black text-white">

      {/* COURSES SECTION */}
      <section ref={sectionRef} className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* TITLE */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Choose Your Path
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Learn industry-level VFX workflows through live mentorship or recorded masterclasses.
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {courses.map((course, i) => {
              return (
                <Link
                  to={course.link}
                  key={i}
                  className={
                    "course-card group relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden " +
                    (course.highlight
                      ? "border-violet-500 bg-gradient-to-br from-violet-500/10 to-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10")
                  }
                >

                  {/* TAG */}
                  <span
                    className={
                      "text-xs px-3 py-1 rounded-full mb-4 inline-block " +
                      (course.highlight
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-white/10 text-slate-300")
                    }
                  >
                    {course.type}
                  </span>

                  {/* TITLE */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {course.title}
                  </h3>

                  {/* DESC */}
                  <p className="text-slate-400 mb-6">
                    {course.desc}
                  </p>

                  {/* PRICE */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {course.price}
                    </span>

                    <span className="text-sm text-slate-400 group-hover:translate-x-2 transition">
                      View →
                    </span>
                  </div>

                  {/* GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 blur-xl" />

                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <div
        className="w-full border-t border-b border-slate-800 px-5 lg:px-12 py-[5rem]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,92,53,0.15) 0%, rgba(255,190,0,0.08) 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center text-center">

          <h2
            className="font-bold text-slate-50"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
            }}
          >
            Ready to Start Your Journey?
          </h2>

          <p
            className="text-slate-400 mt-4 mb-8"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Join 500+ artists already learning at Creative India School.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

            <Link
              to="/enroll"
              className="w-full sm:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] text-white rounded-md font-bold transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Enroll Now <ChevronRight className="w-4 h-4 ml-1" />
            </Link>

            {/* <Link
              to="/pricing"
              className="w-full sm:w-auto px-10 py-4 border border-slate-700 hover:bg-slate-800 text-white rounded-md font-bold transition-colors flex items-center justify-center"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              View Pricing
            </Link> */}

          </div>
        </div>
      </div>

    </div>
  );
}