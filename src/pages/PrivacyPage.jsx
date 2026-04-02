import React, { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PrivacyPolicy() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.privacy-hero-title', { 
        y: 60, opacity: 0, duration: 1, ease: 'power3.out' 
      });
      gsap.from('.privacy-hero-subtitle', { 
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
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        <div className="mb-20">
          <h1 className="privacy-hero-title text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="privacy-hero-subtitle text-lg text-[var(--muted)]">
            At creativeindiaschool.com, we are committed to protecting your privacy.
          </p>
        </div>

        <div className="text-[1.05rem] leading-[1.9] text-slate-300">

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                <span className="font-semibold text-white">Personal Information:</span> When you register for a course or fill out 
                our contact form, we collect personal details such as your name, 
                email address, phone number, date of birth, place of origin and 
                any other information you provide.
              </li>
              <li>
                <span className="font-semibold text-white">Payment Information:</span> When you make a payment, we may collect your 
                payment information such as credit card details via our secure 
                payment processor.
              </li>
              <li>
                <span className="font-semibold text-white">Usage Data:</span> We collect information about your interactions with our 
                website, such as your IP address, browser type, pages viewed, and 
                time spent on the site, to improve user experience.
              </li>
              <li>
                <span className="font-semibold text-white">Ad Data:</span> If you interact with our ads on Meta (Facebook, Instagram), 
                LinkedIn, and Reddit, we may collect information about your 
                interactions with those ads, including clicks and conversions.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                <span className="font-semibold text-white">Provide Services:</span> To manage your course registration, deliver course 
                content, and facilitate communication about updates and schedules.
              </li>
              <li>
                <span className="font-semibold text-white">Improve User Experience:</span> To analyze website traffic, diagnose 
                technical issues, and improve our website performance and content.
              </li>
              <li>
                <span className="font-semibold text-white">Marketing and Advertising:</span> We use data collected from Meta, LinkedIn, 
                Reddit, and other platforms to target and improve our advertisements, 
                including creating custom audiences for retargeting campaigns.
              </li>
              <li>
                <span className="font-semibold text-white">Respond to Inquiries:</span> When you contact us via our contact form, we 
                use your information to respond to your questions, concerns, or requests.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Cookies and Tracking Technologies
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We use cookies, pixels, and other tracking technologies to collect 
                information about your online interactions with our ads and website. 
                These technologies help us provide more relevant ads and analyze 
                website usage. You can control cookie settings via your browser, 
                but disabling cookies may affect the website's functionality.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              How We Share Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We do not sell your personal information. However, we may share 
                your information with third-party service providers who help us 
                with payment processing, website hosting, email communications, 
                and analytics.
              </li>
              <li>
                <span className="font-semibold text-white">Advertising Platforms:</span> We share information with Meta (Facebook, 
                Instagram), LinkedIn, Reddit, and other platforms to deliver 
                targeted ads and analyze campaign performance.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Data Security
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We take reasonable precautions to protect your personal data from 
                unauthorized access, use, or disclosure. However, no internet-based 
                system can be completely secure, and we cannot guarantee the absolute 
                security of your information.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Your Rights
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                <span className="font-semibold text-white">Access Your Data:</span> You can request a copy of the personal information 
                we hold about you.
              </li>
              <li>
                <span className="font-semibold text-white">Correct Your Data:</span> You can request corrections if your personal data 
                is inaccurate or incomplete.
              </li>
              <li>
                <span className="font-semibold text-white">Delete Your Data:</span> You can request that we delete your personal data, 
                subject to certain conditions.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Children's Privacy
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                Our services are not intended for individuals under the age of 16. 
                We do not knowingly collect personal information from children. If 
                you are a parent or guardian and believe your child has provided us 
                with personal data, please contact us to request deletion.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Advertising and Analytics
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We use third-party tools like Meta, LinkedIn, and Reddit to serve 
                ads based on your interactions with our website. These platforms may 
                collect additional information based on their privacy practices. You 
                can opt out of personalized ads through the ad settings provided by 
                each platform.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 border-b border-white/10 mb-20">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Changes to This Privacy Policy
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                We may update this Privacy Policy from time to time. Any changes 
                will be posted on this page, and we encourage you to review it 
                regularly. Your continued use of our services signifies your 
                acceptance of any changes.
              </li>
            </ul>
          </div>

          <div className="section-block pb-10 mb-5">
            <h2 className="text-[1.6rem] font-bold text-blue-400 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              Contact Us
            </h2>
            <ul className="list-disc pl-5 space-y-4 text-left inline-block">
              <li>
                If you have any questions or concerns about this Privacy Policy or 
                how we handle your personal information, please contact us at <span className="text-blue-400 font-medium">creativeindiaschool@gmail.com</span>.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
