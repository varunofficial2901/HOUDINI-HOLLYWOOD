export default function CinematicPanel() {
    return (
        <div className="relative w-full h-[90vh] overflow-hidden">

            {/* 🎬 VIDEO */}
            <video
                src="/videos/03.mp4" // change to any video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                style={{
                    filter: "brightness(1) contrast(1.1) saturate(1.2)"
                }}
            />

            {/* 🌫 EDGE BLUR (your signature style 🔥) */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    maskImage: "radial-gradient(circle at center, transparent 40%, black 75%)",
                    WebkitMaskImage: "radial-gradient(circle at center, transparent 40%, black 75%)"
                }}
            />

            {/* 🌑 LIGHT OVERLAY (for readability only) */}
            {/* <div className="absolute inset-0 bg-black/30 z-[2]" /> */}

            {/* 🎯 CONTENT */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

                <h2 className="text-4xl md:text-6xl font-[Bebas_Neue] mb-4">
                    Create Hollywood-Level Visual Effects
                </h2>

                <p className="max-w-xl text-gray-300 mb-6 text-sm md:text-lg">
                    Master the exact techniques used in real production — from explosions to ocean simulations — even if you're starting from zero.
                </p>

                {/* <button className="px-6 py-3 bg-[var(--accent)] rounded-lg text-white font-semibold hover:scale-105 transition">
                    Explore Course →
                </button> */}

            </div>

        </div>
    );
}