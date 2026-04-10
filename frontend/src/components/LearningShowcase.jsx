import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CinematicCourseSection() {
    const [index, setIndex] = useState(0);

    const items = [
        {
            video: "/videos/curtain.mp4",
            title: "Pyro FX",
            desc: "Create realistic explosions and fire simulations."
        },
        {
            video: "/videos/dhamaka2.mp4",
            title: "Advanced Pyro",
            desc: "Control smoke, flames, and cinematic blast effects."
        },
        {
            video: "/videos/river.mp4",
            title: "River Simulation",
            desc: "Build flowing water systems with real-world physics."
        },
        {
            video: "/videos/each sim.mp4",
            title: "Beach FX",
            desc: "Simulate waves, shore interaction, and whitewater."
        },
        {
            video: "/videos/yacht.mp4",
            title: "Yacht Simulation",
            desc: "Simulate realistic water interaction with moving objects."
        },
        {
            video: "/videos/07.mp4",
            title: "Cinematic Smoke",
            desc: "Create cinematic smokes and particle effects."
        }
    ];

    const next = () => {
        setIndex((prev) => (prev + 1) % items.length);
    };

    const prev = () => {
        setIndex((prev) =>
            prev === 0 ? items.length - 1 : prev - 1
        );
    };

    return (
        <div className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[75vh] lg:h-[90vh] overflow-hidden">

            {/* SLIDES */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${index * 100}%)`
                }}
            >
                {items.map((item, i) => (
                    <div key={i} className="min-w-full h-full relative">

                        {/* VIDEO */}
                        <video
                            src={item.video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="none"
                            className="absolute top-0 left-0 w-full h-full object-cover"
                        />

                        <div
                            className="absolute inset-0 z-[2] pointer-events-none"
                            style={{
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                                maskImage: `
      radial-gradient(
        circle at center,
        transparent 40%,
        black 70%
      )
    `,
                                WebkitMaskImage: `
      radial-gradient(
        circle at center,
        transparent 40%,
        black 70%
      )
    `
                            }}
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

                        {/* CONTENT */}
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 py-8 sm:py-12">

                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-[Bebas_Neue] mb-3 sm:mb-4">
                                {item.title}
                            </h2>

                            <p className="max-w-xl text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 px-2">
                                {item.desc}
                            </p>

                        </div>

                    </div>
                ))}
            </div>

            {/* LEFT ARROW */}
            <button
                onClick={prev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 
                   w-10 sm:w-12 h-10 sm:h-12 rounded-full 
                   bg-black/40 backdrop-blur 
                   border border-white/20 
                   flex items-center justify-center
                   hover:bg-black/60 transition"
            >
                <ChevronLeft size={20} />
            </button>

            {/* RIGHT ARROW */}
            <button
                onClick={next}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 
                   w-10 sm:w-12 h-10 sm:h-12 rounded-full 
                   bg-black/40 backdrop-blur 
                   border border-white/20 
                   flex items-center justify-center
                   hover:bg-black/60 transition"
            >
                <ChevronRight size={20} />
            </button>

        </div>
    );
}