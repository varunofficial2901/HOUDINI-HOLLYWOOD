import React, { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TermsAndConditions() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.terms-hero-title', { 
        y: 60, opacity: 0, duration: 1, ease: 'power3.out' 
      });
      gsap.from('.terms-hero-subtitle', { 
        opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 
      });

      // Match media for responsive animations
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Desktop: slide from left/right
        const sections = gsap.utils.toArray('.section-block');
        sections.forEach((sec, i) => {
          const xOffset = i % 2 === 0 ? -120 : 120;
          gsap.from(sec, {
            x: xOffset,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%"
            }
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile: fade up only
        const sections = gsap.utils.toArray('.section-block');
        sections.forEach((sec) => {
          gsap.from(sec, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%"
            }
          });
        });
      });

    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[120px] pb-[80px] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        <div className="mb-20">
          <h1 className="terms-hero-title text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Terms & Conditions
          </h1>
          <p className="terms-hero-subtitle text-lg text-[var(--muted)]">
            Please read carefully before enrolling in any course.
          </p>
        </div>

        <div className="text-[1.05rem] leading-[1.9] text-slate-300">
          
          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <p>
              Welcome to creativeindiaschool.com! By accessing and using our website 
              and services, you agree to the following terms and conditions.
            </p>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Enrollment and Payment Terms
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                To enroll in a course, you must complete the registration process 
                and make the necessary payments. All fees must be paid in full 
                before accessing any live classes or materials.
              </li>
              <li>
                We offer live online courses via Zoom. Once enrolled, you will 
                receive access details for live sessions.
              </li>
              <li>
                Course fees are non-refundable unless otherwise stated. However, 
                under exceptional circumstances (such as technical issues), we may 
                consider partial refunds or course transfers at our discretion.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Course Access and Intellectual Property
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                Access to the course is limited to the registered student. Sharing 
                your login credentials or course materials with others is strictly 
                prohibited.
              </li>
              <li>
                Course materials, including recordings, presentations, and 
                supplementary resources, are the intellectual property of 
                creativeindiaschool.com and are provided for personal, educational use only. 
                Redistribution, resale, or reproduction of these materials in any 
                form is not allowed without explicit permission.
              </li>
              <li>
                Any free content, such as YouTube tutorials, remains the property 
                of creativeindiaschool.com, and no rights are granted to alter or 
                distribute this content.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Student Conduct
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                All students are expected to maintain professional conduct during 
                live sessions, on chat platforms, and in any interactions with 
                instructors or peers. Any form of harassment, inappropriate 
                behavior, or disruption may result in removal from the course 
                without refund.
              </li>
              <li>
                Students must not engage in any illegal activities or misuse of 
                the website, including the use of bots, hacking, or any form of 
                exploitation of our platform.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Liability and Disclaimer
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We strive to provide high-quality education, but we do not 
                guarantee specific results from any course, including job 
                placements or career advancement.
              </li>
              <li>
                Technical issues, such as internet connectivity problems during 
                live classes, are the responsibility of the student, and we cannot 
                be held liable for any interruptions or delays caused by such issues.
              </li>
              <li>
                While we make every effort to ensure accuracy, creativeindiaschool.com is 
                not responsible for errors, omissions, or outdated content on our 
                website or during live sessions.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Course Modifications
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We reserve the right to make changes to course content, schedules, 
                instructors, or other elements at our discretion. In the event of 
                significant changes, students will be notified in advance.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Privacy Policy
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                By using our website and enrolling in our courses, you agree to our 
                data collection practices. We collect personal information such as 
                name, email address, date of birth, city of origin and payment 
                details to facilitate course registration and communication.
              </li>
              <li>
                Your data will not be shared with third parties except where 
                required by law. Please review our Privacy Policy for more details.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Placement Services
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We provide student placement support where applicable, but we do 
                not guarantee job placement. We offer guidance, but students are 
                responsible for their own job search efforts.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 mb-5">
            <h2 className="text-[1.6rem] font-bold text-violet-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Changes to Terms
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                creativeindiaschool.com reserves the right to update or modify these Terms 
                and Conditions at any time. Any changes will be posted on this page, 
                and it is your responsibility to review them regularly.
              </li>
            </ul>
            
            <p className="mt-12">
              If you have any questions, please contact us at <span className="text-violet-400 font-medium">creativeindiaschool@gmail.com</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
