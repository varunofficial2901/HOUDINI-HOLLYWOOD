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
        <div className="relative w-full h-[90vh] overflow-hidden">

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
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" /> */}

                        {/* CONTENT */}
                        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">

                            <h2 className="text-4xl md:text-6xl font-[Bebas_Neue] mb-4">
                                {item.title}
                            </h2>

                            <p className="max-w-xl text-sm md:text-lg text-gray-300">
                                {item.desc}
                            </p>

                        </div>

                    </div>
                ))}
            </div>

            {/* LEFT ARROW */}
            <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 
                   w-12 h-12 rounded-full 
                   bg-black/40 backdrop-blur 
                   border border-white/20 
                   flex items-center justify-center"
            >
                <ChevronLeft />
            </button>

            {/* RIGHT ARROW */}
            <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 
                   w-12 h-12 rounded-full 
                   bg-black/40 backdrop-blur 
                   border border-white/20 
                   flex items-center justify-center"
            >
                <ChevronRight />
            </button>

        </div>
    );
}