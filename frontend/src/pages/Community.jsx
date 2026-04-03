import React, { useLayoutEffect } from 'react';
import { motion, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Layers, Shield, ChevronDown } from "lucide-react";

export default function Community() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  return (
    <div className="min-h-screen text-[var(--text)] relative overflow-hidden" style={{ fontFamily: '"var(--font-heading)", var(--font-body)', background: 'var(--bg, #050505)' }}>
      {/* 10. SCROLL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[200] w-full"
        style={{
          scaleX, transformOrigin: "left",
          background: "linear-gradient(90deg, var(--accent, var(--accent)), var(--accent2, var(--accent2)))"
        }}
      />

      {/* 3. PAGE HERO */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-[160px] pb-[6rem] px-4"
        style={{
          background: "radial-gradient(ellipse at 20% 60%, rgba(255,92,53,0.1) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(255,190,0,0.06) 0%, transparent 50%), var(--bg, #050505)",
        }}
      >
        {/* FLOATING BACKGROUND ORBS */}
        <motion.div
          className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,92,53,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[30%] right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,190,0,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
          animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[40%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(100,100,255,0.05) 0%, transparent 70%)", filter: "blur(70px)" }}
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        <div className="relative z-10 max-w-[900px] w-full mx-auto text-center flex-1 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4 text-[0.72rem] tracking-[0.22em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-heading), var(--font-body)', color: 'var(--accent, var(--accent))' }}
          >
            <div className="w-8 h-px bg-[var(--accent)] opacity-50"></div>
            OUR COMMUNITY
            <div className="w-8 h-px bg-[var(--accent)] opacity-50"></div>
          </motion.div>

          <div className="flex flex-col items-center justify-center font-[800] text-[clamp(3rem,7vw,6.5rem)] tracking-[-0.04em] leading-[1.0] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
            {["We Don't Just", "Teach. We", "Build Artists."].map((line, index) => (
              <div key={index} className="overflow-hidden py-1">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: index * 0.15 }}
                >
                  {index === 2 ? (
                    <span>Build <span style={{ color: 'var(--accent, var(--accent))' }}>Artists.</span></span>
                  ) : line}
                </motion.div>
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-[600px] mx-auto mt-8 text-[1.1rem] leading-[1.85] text-[var(--muted)] font-[300]"
          >
            Houdini Hollywood is not a school.
            It's a movement. A space where serious artists
            come to push boundaries, master the hardest
            tools in the industry, and become part of
            something larger than a course.
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-[2rem] text-slate-500 text-[1.2rem]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown />
        </motion.div>
      </section>

      {/* 4. WHAT IS HOUDINI */}
      <section className="w-full py-[7rem] px-[5vw] mx-auto max-w-[1100px]" style={{ background: 'var(--surface, #0f172a)' }}>
        <div className="flex flex-col md:flex-row gap-[4rem] items-center">
          <div className="w-full md:w-[55%]">
            <div className="text-[0.72rem] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent, var(--accent))' }}>WHAT IS HOUDINI</div>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[clamp(1.8rem,3vw,2.8rem)] font-[800] leading-[1.15] mb-6 text-[var(--text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              The Software That Powers<br />Hollywood's Biggest Films.
            </motion.h2>

            {[
              "Houdini is a 3D animation and VFX software developed by SideFX. It is the industry standard for visual effects in film, television, and games — used by studios like Industrial Light & Magic, DNEG, Method Studios, and Weta Digital to create the impossible.",
              "What makes Houdini unique is its procedural, node-based workflow. Every effect — from ocean simulations and pyro explosions to rigid body destruction and cloth dynamics — is built as a network of nodes that can be modified, shared, and reused. This gives artists unparalleled control and flexibility.",
              "Houdini is not easy to learn. It demands dedication, a deep understanding of physics, mathematics, and creative problem solving. That is exactly why artists who master it are among the most sought-after professionals in the VFX industry."
            ].map((text, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="text-[var(--muted)] font-[300] leading-[1.75] text-[0.95rem] mb-4"
              >
                {text}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="w-full md:w-[45%] relative"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="absolute inset-[-1px] rounded-[12px] blur-[20px] -z-10" style={{ background: 'linear-gradient(135deg, rgba(255,92,53,0.15), rgba(255,190,0,0.08))' }}></div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[12px] p-8 overflow-hidden relative" style={{ background: 'var(--card, #0f172a)' }}>
              <div className="text-[0.8rem] font-[700] tracking-[0.1em] uppercase text-slate-500 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Houdini in Numbers</div>

              {[
                { num: "25+", label: "Years in Production" },
                { num: "300+", label: "AAA Films & Series" },
                { num: "10,000+", label: "Artists Worldwide" },
                { num: "#1", label: "FX Tool in Film Industry" }
              ].map((stat, idx, arr) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  className={`${idx !== arr.length - 1 ? 'border-b border-[var(--border)] pb-4 mb-4' : ''}`}
                >
                  <div className="text-[2rem] font-[800] leading-none mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent, var(--accent))' }}>{stat.num}</div>
                  <div className="text-[0.8rem] text-[var(--muted)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. WHAT IS ANIMATION */}
      <section className="relative w-full py-[7rem] px-[5vw] mx-auto max-w-[1100px]">
        <div className="text-center md:text-left text-[0.72rem] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent, var(--accent))' }}>WHAT IS ANIMATION</div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[clamp(1.8rem,3vw,2.8rem)] font-[800] leading-[1.15] mb-[3rem] text-center text-[var(--text)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          The Art of Making<br />the Impossible Move.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Visual Effects", emoji: "🎬", iconBg: "rgba(255,92,53,0.1)", iconBorder: "rgba(255,92,53,0.2)", hoverColor: "var(--accent)", desc: "Visual effects is the craft of creating imagery that cannot be captured on camera. From photorealistic water simulations to city-scale destruction — VFX artists blend the boundary between reality and imagination." },
            { title: "3D Animation", emoji: "🎭", iconBg: "rgba(255,190,0,0.1)", iconBorder: "rgba(255,190,0,0.2)", hoverColor: "var(--accent2)", desc: "3D animation brings characters, worlds, and stories to life through the illusion of motion. It is the foundation of modern filmmaking, gaming, and digital storytelling — a craft where technical precision meets artistic soul." },
            { title: "Motion Design", emoji: "✨", iconBg: "rgba(100,200,255,0.1)", iconBorder: "rgba(100,200,255,0.2)", hoverColor: "#64c8ff", desc: "Motion design is the language of visual communication in the digital age. It shapes how brands, ideas, and stories move across screens — combining design, animation, and sound into a unified visual experience." }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-[var(--card)] rounded-[10px] p-8 relative overflow-hidden flex flex-col transition-colors duration-300"
              style={{ border: "1px solid var(--border, #1e293b)", cursor: "default", background: 'var(--card, #0f172a)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = card.hoverColor}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border, #1e293b)"}
            >
              <div className="w-[48px] h-[48px] rounded-[8px] flex items-center justify-center text-[1.4rem] mb-[1.2rem]" style={{ background: card.iconBg, border: `1px solid ${card.iconBorder}` }}>
                {card.emoji}
              </div>
              <h3 className="font-[700] text-[1.1rem] mb-[0.8rem] text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>{card.title}</h3>
              <p className="text-[var(--muted)] font-[300] text-[0.88rem] leading-[1.75]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. OUR PHILOSOPHY */}
      <section className="w-full py-[8rem] px-[5vw]" style={{ background: 'var(--surface, #0f172a)' }}>
        <div className="max-w-[800px] mx-auto">
          <div className="text-center text-[0.72rem] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent, var(--accent))' }}>OUR PHILOSOPHY</div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-[800] leading-[1.15] mb-[4rem] text-center text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Built Different.<br />By Design.
          </h2>

          <div className="flex flex-col">
            {[
              { num: "01", title: "We Teach Differently", body: "Forget everything you know about online courses. At Houdini Hollywood, every lesson is designed around real production workflows. We don't teach theory for its own sake — we teach what actually works on the job. Our curriculum is shaped by artists who have worked on real productions, for real studios." },
              { num: "02", title: "7 Days. No Questions Asked.", body: "We offer 7 days of free demo classes — fully unrestricted access to our teaching style, our instructors, and our community. After those 7 days, the choice is entirely yours. We will not chase you, we will not pressure you, and we will not flood your inbox. Your decision is respected. Always." },
              { num: "03", title: "A Community, Not a Classroom", body: "When you join Houdini Hollywood, you don't just get access to lessons. You enter a community of artists who are on the same journey — sharing breakdowns, critiquing work, celebrating milestones, and growing together. The relationships built here outlast any course." },
              { num: "04", title: "Transparency is Our Standard", body: "We are confident in what we teach. That confidence is why we give you 7 days before asking for any commitment. We have nothing to hide — our methods, our results, and our community speak for themselves. No false promises. No inflated claims." },
              { num: "05", title: "Your Privacy is Sacred", body: "We believe a student's time and attention are precious. We will never spam you, never share your data, and never use manipulative tactics to retain you. If this community is right for you, you will feel it. We trust that." },
              { num: "06", title: "Excellence Over Everything", body: "We hold ourselves to an industry standard. Every course, every session, every piece of feedback is delivered with the same level of care that goes into a Hollywood production. Because that is the standard we are preparing you for." }
            ].map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                className="relative border-b border-[var(--border)] py-[2.5rem] w-full"
              >
                <div
                  className="absolute left-[-1rem] md:left-[-2rem] top-[-1rem] text-[5rem] font-[800] select-none -z-10"
                  style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255,92,53,0.05)' }}
                >
                  {point.num}
                </div>
                <h3 className="font-[700] text-[1.3rem] mb-3 text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>{point.title}</h3>
                <p className="text-[var(--muted)] font-[300] text-[0.95rem] leading-[1.85]">{point.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREE DEMO SECTION */}
      <section className="w-full py-[6rem] px-[5vw]">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-[var(--card)] rounded-[16px] py-[4rem] px-[2rem] md:px-[3rem] text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,92,53,0.1) 0%, rgba(255,190,0,0.06) 100%)',
              border: '1px solid rgba(255,92,53,0.2)'
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(4rem,10vw,8rem)] font-[800] whitespace-nowrap pointer-events-none select-none z-0"
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(255,92,53,0.04)', letterSpacing: '-0.05em' }}
            >
              7 DAYS FREE
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-[7rem] font-[800] leading-none mb-1"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent, var(--accent))' }}
              >
                7
              </motion.div>
              <h3 className="text-[1.5rem] font-[800] mb-[1.5rem] text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>Days Free Demo</h3>

              <p className="text-[var(--muted)] font-[300] text-[1rem] leading-[1.8] max-w-[520px] mx-auto mb-[2.5rem]">
                Join our free 7-day demo classes and experience Houdini Hollywood before making any commitment. No credit card. No pressure. No follow-up messages. Just pure, honest learning.
              </p>

              <div className="flex gap-4 justify-center flex-wrap mb-[2.5rem]">
                {["✓ No Credit Card", "✓ No Pressure", "✓ No Follow-ups"].map((feat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-slate-700/50 rounded-full py-[0.45rem] px-[1.1rem] text-[0.82rem] text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {feat}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 12px 30px rgba(255,92,53,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/enroll")}
                className="text-white font-[700] text-[0.95rem] py-[1rem] px-[2.5rem] rounded-[6px] border-none cursor-pointer"
                style={{ fontFamily: 'var(--font-heading)', background: 'var(--accent, var(--accent))' }}
              >
                Claim Your Free Demo →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. COMMUNITY NUMBERS SECTION */}
      <section className="w-full py-[6rem] px-[5vw] max-w-[1100px] mx-auto" style={{ background: 'var(--bg, #050505)' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(1.8rem,3vw,2.8rem)] font-[800] leading-[1.15] mb-[3.5rem] text-center text-[var(--text)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          The Community in Numbers
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { num: "500+", label: "Students Enrolled", icon: Users, color: "var(--accent)" },
            { num: "7", label: "Days Free Demo", icon: Calendar, color: "var(--accent2)" },
            { num: "6", label: "FX Disciplines", icon: Layers, color: "#00d4aa" },
            { num: "100%", label: "Transparency", icon: Shield, color: "#a855f7" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -4 }}
                className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-[2rem] px-[1rem] md:px-[1.5rem] text-center flex flex-col items-center justify-center transition-transform"
                style={{ background: 'var(--card, #0f172a)' }}
              >
                <div className="w-[44px] h-[44px] rounded-[8px] flex items-center justify-center mb-[1rem]" style={{ background: `rgba(${hexToRgb(stat.color)}, 0.1)`, border: `1px solid rgba(${hexToRgb(stat.color)}, 0.2)` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-[2.5rem] font-[800] mb-[0.3rem] text-[var(--text)] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>{stat.num}</div>
                <div className="text-[0.82rem] text-[var(--muted)]">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="w-full py-[8rem] px-[5vw]" style={{ background: 'var(--surface, #0f172a)' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-[700px] mx-auto text-center"
        >
          <div className="text-[0.72rem] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent, var(--accent))' }}>READY TO JOIN?</div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-[800] leading-[1.15] my-4 text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Journey Starts<br />With One Decision.
          </h2>
          <p className="text-[var(--muted)] font-[300] text-[1rem] leading-[1.8] mb-[2.5rem]">
            Every artist in our community started exactly where you are right now. The only difference between where you are and where you want to be is the decision to begin.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/enroll")}
              className="text-white font-[700] text-[0.95rem] py-[0.95rem] px-[2.2rem] rounded-[6px] border-none cursor-pointer"
              style={{ fontFamily: 'var(--font-heading)', background: 'var(--accent, var(--accent))' }}
            >
              Start Free Demo →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/courses")}
              className="bg-transparent text-[var(--text)] font-[700] text-[0.95rem] py-[0.95rem] px-[2.2rem] rounded-[6px] border border-slate-700 cursor-pointer"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              View Courses
            </motion.button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

// Simple hex to rgb helper for the stat icons dynamic background opacity
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}
