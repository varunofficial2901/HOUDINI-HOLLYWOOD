import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Courses() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Mobile cards animation
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
            trigger: ".mobile-section",
            start: "top 80%",
          },
        }
      );

      // Desktop cinematic animation
      gsap.utils.toArray(".cinematic-section").forEach((section) => {
        const content = section.querySelector(".content");

        gsap.fromTo(
          content,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "top 30%",
              scrub: true,
            },
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const courses = [
    {
      title: "Houdini Animation",
      type: "LIVE CLASSES",
      desc: "Master cinematic FX, pyro, water and destruction with live mentorship.",
      price: "₹44,999",
      link: "/course/houdini-animation",
      video: "/videos/all.mp4",
      highlight: true,
    },
    {
      title: "After Effects",
      type: "RECORDED",
      desc: "Industry-level compositing and VFX integration.",
      price: "₹7,999",
      link: "/course/blender",
      video: "/videos/03.mp4",
    },
    {
      title: "Nuke Compositing",
      type: "RECORDED",
      desc: "Learn compositing, lighting and rendering workflows.",
      price: "₹15,999",
      link: "/course/nuke",
      video: "/videos/dhamaka2.mp4",
    },
    {
      title: "Photoshop",
      type: "RECORDED",
      desc: "Create cinematic environments and effects.",
      price: "₹6,999",
      link: "/course/unreal",
      video: "/videos/particle.mp4",
    },
  ];

  return (
    <div ref={containerRef} className="bg-black text-white">

      {/* ================= MOBILE ================= */}
      <div className="block lg:hidden mobile-section">
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Choose Your Path
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Learn industry-level VFX workflows through live mentorship or recorded masterclasses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course, i) => (
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
                  <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block bg-white/10 text-slate-300">
                    {course.type}
                  </span>

                  <h3 className="text-2xl font-bold mb-3">
                    {course.title}
                  </h3>

                  <p className="text-slate-400 mb-6">
                    {course.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {course.price}
                    </span>

                    <span className="text-sm text-slate-400 group-hover:translate-x-2 transition">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ================= DESKTOP CINEMATIC ================= */}
      <div className="hidden lg:block snap-y snap-mandatory">

        {courses.map((course, i) => (
          <section
            key={i}
            className="cinematic-section h-screen snap-start relative flex items-center justify-center"
          >

            {/* VIDEO */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover scale-110"
            >
              <source src={course.video} type="video/mp4" />
            </video>

            {/* DARK OVERLAY */}
            {/* <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" /> */}

            {/* CONTENT */}
            <div className="content relative z-10 text-center max-w-3xl px-6">

              <span className="text-xs px-4 py-1 rounded-full bg-white/10 text-slate-300 inline-block mb-4">
                {course.type}
              </span>

              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {course.title}
              </h1>

              <p className="text-slate-300 text-lg mb-6">
                {course.desc}
              </p>

              <p className="text-3xl font-bold text-violet-400 mb-8">
                {course.price}
              </p>

              <Link
                to={course.link}
                className="inline-flex items-center gap-2 px-10 py-4 bg-violet-600 hover:bg-violet-500 transition-all duration-300 hover:scale-105 rounded-lg font-semibold shadow-lg"
              >
                View Course <ChevronRight size={18} />
              </Link>

            </div>
          </section>
        ))}

      </div>

      {/* ================= CTA ================= */}
      <div
        className="w-full border-t border-b border-slate-800 px-5 lg:px-12 py-[5rem]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,92,53,0.15) 0%, rgba(255,190,0,0.08) 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>

          <p className="text-slate-400 mb-8">
            Join 500+ artists already learning at Creative India School.
          </p>

          <Link
            to="/enroll"
            className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-md font-bold flex items-center gap-2"
          >
            Enroll Now <ChevronRight className="w-4 h-4" />
          </Link>

        </div>
      </div>

    </div>
  );
}