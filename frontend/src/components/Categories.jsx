import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MonitorPlay, Layers, Video, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    title: 'Houdini Animation',
    icon: <MonitorPlay className="w-8 h-8 text-blue-400" />,
    link: "/course/houdini-animation",
    video: "/videos/curtain.mp4"
  },
  {
    id: 2,
    title: 'Nuke Compositing',
    icon: <Layers className="w-8 h-8 text-violet-400" />,
    link: "/course/nuke",
    video: "/videos/dhamaka2.mp4"
  },
  {
    id: 3,
    title: 'After Effects',
    icon: <Video className="w-8 h-8 text-emerald-400" />,
    link: "/course/blender",
    video: "/videos/particle.mp4"
  },
  {
    id: 4,
    title: 'PhotoShop',
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    link: "/course/unreal",
    video: "/videos/river.mp4"
  }
];

export default function Categories() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sect-title',
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.sect-title',
            start: "top 85%",
          }
        }
      );

      gsap.fromTo(
        '.category-card',
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-slate-900 border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <div className="mb-14 text-center">
          <h2 className="sect-title text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 pb-2">
            Explore Categories
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {categories.map((cat) => (
<Link
  key={cat.id}
  to={cat.link}
  className="group relative category-card h-[220px] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 bg-white/5 backdrop-blur-lg"
>

  {/* DEFAULT CONTENT */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition duration-300 group-hover:opacity-0">

    <div className="mb-4 bg-white/5 p-4 rounded-full group-hover:scale-110 transition">
      {cat.icon}
    </div>

    <h3 className="text-xl font-bold text-slate-100">
      {cat.title}
    </h3>

  </div>

  {/* VIDEO LAYER */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">

    <video
      src={cat.video}
      muted
      loop
      playsInline
      autoPlay
      className="w-full h-full object-cover"
    />

  </div>

</Link>
          ))}

        </div>
      </div>
    </section>
  );
}