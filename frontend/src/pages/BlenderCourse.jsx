import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BlenderCourse() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".card", { y: 80, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: { trigger: ref.current, start: "top 80%" }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-black text-white px-6 md:px-16 py-20">

      <h1 className="text-5xl md:text-7xl font-bold text-center mt-20 mb-20">
        After Effects
      </h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto">

        <div className="card p-8 bg-white/5 border border-white/10 rounded-2xl">
  <h2 className="text-2xl font-bold mb-4">Motion Graphics</h2>
  <p className="text-slate-400">Create dynamic animations using keyframes, graphs, and professional motion techniques.</p>
</div>

<div className="card p-8 bg-white/5 border border-white/10 rounded-2xl">
  <h2 className="text-2xl font-bold mb-4">Compositing</h2>
  <p className="text-slate-400">Combine multiple elements seamlessly with masks, blending modes, and advanced compositing workflows.</p>
</div>

<div className="card p-8 bg-white/5 border border-white/10 rounded-2xl">
  <h2 className="text-2xl font-bold mb-4">VFX & Effects</h2>
  <p className="text-slate-400">Build cinematic visual effects including particles, glow, distortions, and real-world simulations.</p>
</div>

<div className="card p-8 bg-white/5 border border-white/10 rounded-2xl">
  <h2 className="text-2xl font-bold mb-4">Rendering & Export</h2>
  <p className="text-slate-400">Optimize render settings and export high-quality videos for production and delivery.</p>
</div>

      </div>

      <div className="text-center mt-24">
        <Link to="/enroll" className="px-10 py-4 bg-violet-600 rounded-xl font-bold">
          Enroll Now <ChevronRight className="inline ml-2" />
        </Link>
      </div>

    </div>
  );
}