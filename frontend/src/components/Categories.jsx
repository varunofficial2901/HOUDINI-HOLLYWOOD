import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    title: 'Houdini Animation',
    icon: "/photos/houd.png",
    link: "/course/houdini-animation",
    video: "/videos/curtain.mp4"
  },
  {
    id: 2,
    title: 'Nuke Compositing',
    icon: "/photos/nuke composition.png",
    link: "/course/nuke",
    video: "/videos/dhamaka2.mp4"
  },
  {
    id: 3,
    title: 'After Effects',
    icon: "/photos/animate1.png",
    link: "/course/blender",
    video: "/videos/particle.mp4"
  },
  {
    id: 4,
    title: 'PhotoShop',
    icon: "/photos/photoshop1.png",
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
      className="py-16 sm:py-20 md:py-24 bg-slate-900 border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* TITLE */}
        <div className="mb-8 sm:mb-10 md:mb-14 text-center">
          <h2 className="sect-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 pb-2">
            Explore Categories
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative category-card min-h-[180px] sm:min-h-[200px] md:h-[220px] lg:h-[240px] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 bg-white/5 backdrop-blur-lg"
            >

              {/* DEFAULT CONTENT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 transition duration-300 group-hover:opacity-0">

                {/* ICON */}
                <div className="mb-4 flex items-center justify-center">
                  <img
                    src={cat.icon}
                    alt={cat.title}
                    className="
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                      object-contain 
                      mix-blend-lighten 
                      group-hover:scale-110 
                      transition duration-300
                    "
                  />
                </div>

                {/* 🔥 COURSE TITLE (FIXED) */}
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white tracking-wide">
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

                {/* LIGHT OVERLAY */}
                {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" /> */}

              </div>

            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}




// // import React, { useLayoutEffect, useRef } from 'react';
// ///import { gsap } from 'gsap';
// //import { ScrollTrigger } from 'gsap/ScrollTrigger';
// //import { MonitorPlay, Layers, Video, Zap } from 'lucide-react';
// //import { Link } from 'react-router-dom';

// gsap.registerPlugin(ScrollTrigger);

// const categories = [
//   {
//     id: 1,
//     title: "Houdini Animation",
//     icon: "/photos/houd.png",
//     link: "/course/houdini-animation",
//     video: "/videos/curtain.mp4"
//   },
//   {
//     id: 2,
//     title: "Nuke Compositing",
//     icon: "/photos/nuke composition.png",
//     link: "/course/nuke",
//     video: "/videos/dhamaka2.mp4"
//   },
//   {
//     id: 3,
//     title: "After Effects",
//     icon: "/photos/animate.png",
//     link: "/course/blender",
//     video: "/videos/particle.mp4"
//   },
//   {
//     id: 4,
//     title: "Photoshop",
//     icon: "/photos/photoshop.png",
//     link: "/course/unreal",
//     video: "/videos/river.mp4"
//   }
// ];

// export default function Categories() {
//   const sectionRef = useRef(null);

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         '.sect-title',
//         { clipPath: "inset(100% 0 0 0)" },
//         {
//           clipPath: "inset(0% 0 0 0)",
//           duration: 0.8,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: '.sect-title',
//             start: "top 85%",
//           }
//         }
//       );

//       gsap.fromTo(
//         '.category-card',
//         { opacity: 0, scale: 0.85 },
//         {
//           opacity: 1,
//           scale: 1,
//           duration: 0.6,
//           stagger: 0.12,
//           ease: "back.out(1.2)",
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 75%",
//           }
//         }
//       );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="py-16 sm:py-20 md:py-24 bg-slate-900 border-b border-white/5 relative"
//     >
//       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

//         {/* TITLE */}
//         <div className="mb-8 sm:mb-10 md:mb-14 text-center">
//           <h2 className="sect-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 pb-2">
//             Explore Categories
//           </h2>
//         </div>

//         {/* GRID */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

//           {categories.map((cat) => (
// <Link
//   key={cat.id}
//   to={cat.link}
//   className="group relative category-card min-h-[180px] sm:min-h-[200px] md:h-[220px] lg:h-[240px] rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all duration-300 bg-white/5 backdrop-blur-lg"
// >

//   {/* DEFAULT CONTENT */}
//   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 transition duration-300 group-hover:opacity-0">
//     <div className="mb-2 sm:mb-3 md:mb-4 bg-white/5 p-3 sm:p-4 rounded-full group-hover:scale-110 transition">
//     <img src={cat.icon} alt={cat.title} className="w-8 h-8 object-contain" />
//     </div>

//     <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-100">
//       {cat.title}
//     </h3>

//   </div>

//   {/* VIDEO LAYER */}
//   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">

//     <video
//       src={cat.video}
//       muted
//       loop
//       playsInline
//       autoPlay
//       className="w-full h-full object-cover"
//     />

//   </div>

// </Link>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// }