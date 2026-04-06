import { Link } from "react-router-dom";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, Clock, BookOpen } from "lucide-react";
import { coursesApi } from "../api/client";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_COURSES = [
  {
    id: 1,
    category: "Houdini Animation",
    tag: "LIVE CLASSES",
    icon: "🎬",
    level: "Advanced",
    color: "#8b5cf6",
    lessons: [
      { id: 1, title: "Pyro FX & Explosions", duration: "2h 15m" },
      { id: 2, title: "Water & FLIP Simulation", duration: "1h 45m" },
      { id: 3, title: "RBD Destruction", duration: "2h 00m" },
    ],
    total_lessons: 12,
    highlight: true,
  },
  {
    id: 2,
    category: "After Effects",
    tag: "RECORDED",
    icon: "✨",
    level: "Intermediate",
    color: "#3b82f6",
    lessons: [
      { id: 1, title: "Motion Graphics Basics", duration: "1h 30m" },
      { id: 2, title: "Compositing Workflows", duration: "1h 45m" },
    ],
    total_lessons: 8,
    highlight: false,
  },
  {
    id: 3,
    category: "Nuke Compositing",
    tag: "RECORDED",
    icon: "🎥",
    level: "Intermediate",
    color: "#00cfff",
    lessons: [
      { id: 1, title: "Node-based Compositing", duration: "2h 00m" },
      { id: 2, title: "ACES Workflow", duration: "1h 45m" },
    ],
    total_lessons: 10,
    highlight: false,
  },
  {
    id: 4,
    category: "Photoshop",
    tag: "RECORDED",
    icon: "🖼️",
    level: "Beginner",
    color: "#ffbe00",
    lessons: [
      { id: 1, title: "Layer Basics", duration: "1h 00m" },
      { id: 2, title: "VFX Matte Painting", duration: "1h 30m" },
    ],
    total_lessons: 6,
    highlight: false,
  },
];

export default function Courses() {
  const sectionRef = useRef(null);
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    coursesApi.list()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCourses(res.data);
        }
      })
      .catch(() => {
        // backend offline — keeps FALLBACK_COURSES
      })
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="bg-black text-white">

      <section ref={sectionRef} className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Choose Your Path
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Learn industry-level VFX workflows through live mentorship or recorded masterclasses.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg mb-2">Could not load courses.</p>
              <p className="text-sm">Please make sure the backend is running.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((course, i) => {
                const isHighlight = i === 0;
                return (
                  <div
                    key={course.id || i}
                    className={
                      "course-card group relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden " +
                      (isHighlight
                        ? "border-violet-500 bg-gradient-to-br from-violet-500/10 to-indigo-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10")
                    }
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{course.icon}</span>
                      <span className={
                        "text-xs px-3 py-1 rounded-full " +
                        (isHighlight ? "bg-violet-500/20 text-violet-400" : "bg-white/10 text-slate-300")
                      }>
                        {course.tag}
                      </span>
                      <span
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: `${course.color}22`,
                          color: course.color,
                          border: `1px solid ${course.color}44`
                        }}
                      >
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      {course.category}
                    </h3>

                    <div className="flex flex-col gap-1 mb-6">
                      {(course.lessons || []).slice(0, 2).map((lesson) => (
                        <p key={lesson.id} className="text-slate-400 text-sm flex items-center gap-2">
                          <Clock className="w-3 h-3 shrink-0" />
                          {lesson.title} — {lesson.duration}
                        </p>
                      ))}
                      {(course.lessons || []).length > 2 && (
                        <p className="text-slate-500 text-xs mt-1">
                          +{course.lessons.length - 2} more lessons
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.total_lessons || course.lessons?.length || 0} lessons</span>
                      </div>
                      <span className="text-sm text-slate-400 group-hover:translate-x-2 transition">
                        View →
                      </span>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 blur-xl" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div
        className="w-full border-t border-b border-slate-800 px-5 lg:px-12 py-[5rem]"
        style={{ background: "linear-gradient(135deg, rgba(255,92,53,0.15) 0%, rgba(255,190,0,0.08) 100%)" }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="font-bold text-slate-50" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-400 mt-4 mb-8" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            Join 500+ artists already learning at Creative India School.
          </p>
          <Link
            to="/enroll"
            className="w-full sm:w-auto px-10 py-4 bg-violet-600 hover:bg-violet-500 hover:-translate-y-1 text-white rounded-md font-bold transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Enroll Now <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

    </div>
  );
}