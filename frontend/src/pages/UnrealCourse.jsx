import { Link } from "react-router-dom";
import { ChevronRight, Lock } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useIsEnrolled } from "../hooks/useIsEnrolled";

gsap.registerPlugin(ScrollTrigger);

export default function UnrealCourse() {
  const containerRef = useRef(null);
  const isEnrolled = useIsEnrolled('PhotoShop');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".card-item",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cards-container",
            start: "top 80%",
          },
        }
      );

      gsap.utils.toArray(".fade-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const learningTopics = [
    "Layer Masking & Selection Tools",
    "Professional Retouching Techniques",
    "Advanced Compositing",
    "Typography & Text Effects",
    "Photo Manipulation Workflows",
    "Non-Destructive Editing",
  ];

  const highlights = [
    { label: "Duration", value: "8 Weeks" },
    { label: "Videos", value: "40+ Videos" },
    { label: "Skill Level", value: "Beginner to Advanced" },
    { label: "Certificate", value: "Included" },
  ];

  const forWhom = [
    "Complete Beginners wanting to master digital art",
    "Graphic Designers expanding their photoshop skills",
    "Photographers wanting professional retouching",
    "Content Creators needing advanced image editing",
  ];

  return (
    <div ref={containerRef} className="bg-slate-950 text-white min-h-screen">
      {/* COMING SOON BANNER */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <p className="text-sm sm:text-base font-semibold">🚀 Coming Soon - This course will be available shortly</p>
        </div>
      </div>

      {/* SPACER FOR BANNER */}
      <div className="h-14 sm:h-16" />

      {!isEnrolled && (
        <>
          {/* LANDING HERO */}
          <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden min-h-screen sm:min-h-[70vh] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-40 pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10 text-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Master Photoshop
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 px-2">
                  Learn professional photo editing and digital art from beginner to advanced retouching techniques used by top photographers and designers worldwide.
                </p>

                <div className="mb-8 sm:mb-12 space-y-3 sm:space-y-4 px-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">What's Included:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl mx-auto text-sm sm:text-base">
                    <div className="text-left">✓ 40+ Video Lessons</div>
                    <div className="text-left">✓ Real-World Projects</div>
                    <div className="text-left">✓ Professional Techniques</div>
                    <div className="text-left">✓ Retouching Workflows</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled
                  className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-5 bg-slate-700 text-slate-400 rounded-xl font-bold text-sm sm:text-base transition-all cursor-not-allowed opacity-60"
                >
                  Coming Soon <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* WHAT YOU WILL LEARN */}
          <section className="fade-section py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-blue-500/5">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                What You Will Learn
              </h2>

              <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {learningTopics.map((topic, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="card-item p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-blue-500/20 backdrop-blur-lg hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-white">{topic}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* COURSE HIGHLIGHTS */}
          <section className="fade-section py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                Course Highlights
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {highlights.map((highlight, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="card-item p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 text-center"
                  >
                    <p className="text-xs sm:text-sm text-slate-400 mb-2">{highlight.label}</p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-400">{highlight.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* WHO IS THIS FOR */}
          <section className="fade-section py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-white/5">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                Who Is This For?
              </h2>

              <div className="max-w-3xl mx-auto">
                <div className="cards-container space-y-3 sm:space-y-4">
                  {forWhom.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="card-item p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-lg hover:border-blue-500/50 transition-all duration-300 flex items-center gap-4"
                    >
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 flex-shrink-0" />
                      <p className="text-sm sm:text-base md:text-lg text-white">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="fade-section py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-blue-500/10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
                Ready to Master Photoshop?
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-8 sm:mb-12 px-2">
                Get access to comprehensive video lessons, project files, and professional resources to become a Photoshop expert.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled
                className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-5 bg-slate-700 text-slate-400 rounded-xl font-bold text-sm sm:text-base transition-all cursor-not-allowed opacity-60"
              >
                Coming Soon <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </section>
        </>
      )}

      {isEnrolled && (
        <>
          <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-40 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8 sm:mb-12"
              >
                <div className="inline-block mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-400">
                    📹 RECORDED
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-4 tracking-tight px-2">
                  Photoshop Mastery
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6 sm:mb-8 px-2">
                  From Basics to Professional Retouching
                </p>
                
                <p className="text-slate-300 max-w-3xl mx-auto text-sm sm:text-base md:text-lg mb-8 sm:mb-10 px-2">
                  Master Adobe Photoshop from fundamentals to advanced techniques. Create stunning digital art, professional retouching, and compelling visual designs.
                </p>

                <Link
                  to="/enroll"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 shadow-lg"
                >
                  Enroll Now <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
            </div>
          </section>

          {/* WHAT YOU WILL LEARN */}
          <section className="fade-section py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-blue-500/5">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                What You Will Learn
              </h2>

              <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {learningTopics.map((topic, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="card-item p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-blue-500/20 backdrop-blur-lg hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-white">{topic}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* COURSE HIGHLIGHTS */}
          <section className="fade-section py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                Course Highlights
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {highlights.map((highlight, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="card-item p-3 sm:p-6 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 text-center"
                  >
                    <p className="text-xs sm:text-sm text-slate-400 mb-2">{highlight.label}</p>
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-400">{highlight.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* WHO IS THIS FOR */}
          <section className="fade-section py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-white/5">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
                Who Is This For?
              </h2>

              <div className="max-w-3xl mx-auto">
                <div className="cards-container space-y-3 sm:space-y-4">
                  {forWhom.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="card-item p-4 sm:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-lg hover:border-blue-500/50 transition-all duration-300 flex items-center gap-4"
                    >
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 flex-shrink-0" />
                      <p className="text-sm sm:text-base md:text-lg text-white">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="fade-section py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-blue-500/10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
                Ready to Master Photoshop?
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-8 sm:mb-12 px-2">
                Get lifetime access to video lessons, project files, and resources to become a professional Photoshop artist.
              </p>

              <Link
                to="/enroll"
                className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 shadow-lg"
              >
                Enroll Now <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}