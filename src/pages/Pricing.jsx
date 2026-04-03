import React, { useState, useLayoutEffect, useRef } from 'react';
import { CheckCircle, XCircle, Minus, Lock, RefreshCw, Award, MessageCircle, ChevronDown, Infinity, Loader2, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate, Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

const PLANS = [
  {
    name: "Starter", tag: "SINGLE COURSE",
    desc: "Perfect for beginners exploring a single FX discipline.",
    priceMonthly: "4,999", priceYearly: "3,999", oldYearly: "4,999", savings: null,
    features: [
      { text: "Access to 1 Course of Your Choice", active: true },
      { text: "All Lessons in That Course", active: true },
      { text: "Lifetime Access to Recordings", active: true },
      { text: "Course Completion Certificate", active: true },
      { text: "Community Forum Access", active: true },
      { text: "Live Q&A Sessions", active: false },
      { text: "1-on-1 Mentorship", active: false },
      { text: "Placement Assistance", active: false },
    ],
    ctaText: "Get Started →", isPopular: false, variant: "default"
  },
  {
    name: "Pro", tag: "3 COURSES BUNDLE",
    desc: "The most chosen plan. Master 3 disciplines and unlock live mentorship.",
    priceMonthly: "12,999", priceYearly: "9,999", oldYearly: "12,999", savings: "3,000",
    features: [
      { text: "Access to Any 3 Courses", active: true },
      { text: "All Lessons in All 3 Courses", active: true },
      { text: "Lifetime Access to Recordings", active: true },
      { text: "Course Completion Certificate", active: true },
      { text: "Community Forum Access", active: true },
      { text: "Weekly Live Q&A Sessions", active: true },
      { text: "Priority Support via Discord", active: true },
      { text: "1-on-1 Mentorship", active: false },
      { text: "Placement Assistance", active: false },
    ],
    ctaText: "Enroll Now →", isPopular: true, variant: "primary"
  },
  {
    name: "Master", tag: "ALL ACCESS",
    desc: "The complete Houdini Hollywood experience. Every course, every discipline, full support.",
    priceMonthly: "24,999", priceYearly: "19,999", oldYearly: "24,999", savings: "5,000",
    features: [
      { text: "Access to ALL 6 Course Disciplines", active: true },
      { text: "All 78+ Lessons — Complete Library", active: true },
      { text: "Lifetime Access to Recordings", active: true },
      { text: "Course Completion Certificate", active: true },
      { text: "Community Forum Access", active: true },
      { text: "Weekly Live Q&A Sessions", active: true },
      { text: "Priority Support via Discord", active: true },
      { text: "Monthly 1-on-1 Mentorship Session", active: true },
      { text: "Placement Assistance & Studio Connect", active: true },
      { text: "Early Access to New Courses", active: true },
      { text: "Exclusive Master Community Badge", active: true },
    ],
    ctaText: "Get Full Access →", isPopular: false, variant: "master"
  }
];

const TRUST_BADGES = [
  { icon: Lock, label: "Secure Payment" },
  { icon: RefreshCw, label: "Satisfaction Guarantee" },
  { icon: Award, label: "Industry Certificate" },
  { icon: MessageCircle, label: "24/7 Support" },
  { icon: Infinity, label: "Lifetime Access" }
];

const TABLE_ROWS = [
  { feature: "Course Access", starter: "1 Course", pro: "3 Courses", master: "All 6" },
  { feature: "Total Lessons", starter: "Varies", pro: "Varies", master: "78+" },
  { feature: "Lifetime Recordings", starter: "yes", pro: "yes", master: "yes" },
  { feature: "Certificate", starter: "yes", pro: "yes", master: "yes" },
  { feature: "Community Access", starter: "yes", pro: "yes", master: "yes" },
  { feature: "Live Q&A Sessions", starter: "no", pro: "Weekly", master: "Weekly" },
  { feature: "Discord Priority", starter: "no", pro: "yes", master: "yes" },
  { feature: "1-on-1 Mentorship", starter: "no", pro: "no", master: "Monthly" },
  { feature: "Placement Assistance", starter: "no", pro: "no", master: "yes" },
  { feature: "New Course Early Access", starter: "no", pro: "no", master: "yes" },
  { feature: "Master Badge", starter: "no", pro: "no", master: "yes" },
];

const FAQS = [
  { q: "Can I switch plans later?", a: "Yes, you can upgrade or change your plan at any time. Simply contact us and we'll adjust your access accordingly with no penalty." },
  { q: "Are the courses live or pre-recorded?", a: "All courses include lifetime access to recorded sessions. Pro and Master plan members also get access to weekly live Q&A sessions with instructors." },
  { q: "What software do I need?", a: "You'll need Houdini (SideFX) for simulation courses and Nuke (Foundry) for compositing. Both offer free learning editions which are sufficient for most lessons." },
  { q: "Is there a refund policy?", a: "Course fees are non-refundable once access has been granted. Under exceptional circumstances we may consider course transfers at our discretion. Please review our Terms & Conditions for details." },
  { q: "How do I access the courses after enrolling?", a: "After enrollment, our team will contact you within 24 hours with your access details and onboarding information via the email you registered with." },
  { q: "Do I get a certificate?", a: "Yes! All plans include an industry-recognized Course Completion Certificate upon finishing your enrolled course(s)." },
  { q: "Is there EMI or installment payment available?", a: "We are working on EMI options. Please contact us at Houdinivfx@gmail.com to discuss flexible payment arrangements." }
];

export default function Pricing() {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  const handleEnroll = (planName) => {
    navigate(`/enroll?plan=${planName.toLowerCase()}&billing=${billing}`);
  };

  const [contactOpen, setContactOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [formErrors, setFormErrors] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleToggleForm = () => {
    if (!contactOpen) {
      setContactOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleCloseForm = () => {
    gsap.to('.contact-overlay', { 
      opacity: 0, duration: 0.25, ease: "power2.in" 
    });
    gsap.to(formRef.current, {
      scale: 0.9, opacity: 0, y: 20, duration: 0.25, ease: "power3.in",
      onComplete: () => {
        setContactOpen(false);
        document.body.style.overflow = "unset";
        setFormData({ email: '', message: '' });
        setFormErrors({ email: '', message: '' });
        setIsSuccess(false);
      }
    });
  };

  useLayoutEffect(() => {
    if (contactOpen) {
      gsap.fromTo('.contact-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(formRef.current,
        { scale: 0.85, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)", delay: 0.1 }
      );

      const handleEsc = (e) => {
        if (e.key === 'Escape') handleCloseForm();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [contactOpen]);

  const handleFormSubmit = () => {
    let isValid = true;
    let errors = { email: '', message: '' };

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          gsap.fromTo('.success-icon-modal', 
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: 'back.out(2)' }
          );
        }, 10);
        setTimeout(() => handleCloseForm(), 3500);
      }, 1500);
    }
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero load animations
      gsap.fromTo('.hero-label', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo('.hero-heading', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out' });
      gsap.fromTo('.hero-subtext', { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.billing-toggle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.35, ease: 'power3.out' });

      // Pricing Cards
      gsap.fromTo('.pricing-card', 
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.pricing-container', start: "top 85%" },
          onComplete: () => {
            gsap.to('.pro-card', { scale: window.innerWidth >= 900 ? 1.04 : 1, duration: 0.4, ease: 'power2.out' });
          }
        }
      );

      // Trust Badges
      gsap.fromTo('.trust-badge',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: '.trust-row', start: "top 90%" }}
      );

      // Table Rows
      gsap.fromTo('.comp-table-row',
        { opacity: 0, y: 15 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, scrollTrigger: { trigger: '.comp-table', start: "top 85%" }}
      );

      // FAQs
      gsap.fromTo('.faq-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, scrollTrigger: { trigger: '.faq-section', start: "top 85%" }}
      );

      // Bottom CTA
      gsap.fromTo('.bottom-cta',
        { scale: 0.97, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.bottom-cta', start: "top 85%" }}
      );

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const renderTableCellValue = (val) => {
    if (val === 'yes') return <CheckCircle className="w-4 h-4 mx-auto text-[var(--success)]" />;
    if (val === 'no') return <Minus className="w-4 h-4 mx-auto text-white/15" />;
    return val;
  };

  return (
    <div ref={containerRef} className="bg-[var(--bg)] min-h-screen text-[var(--text)] font-sans pb-0">

      {/* Hero Section */}
      <div 
        className="w-full relative min-h-[380px] pt-[160px] pb-[4rem] flex flex-col items-center justify-center text-center px-4"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(255,92,53,0.1) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 30%, rgba(255,190,0,0.06) 0%, transparent 50%),
            #020617
          `
        }}
      >
        <div className="hero-label flex items-center justify-center gap-4 mb-3">
          <div className="w-8 h-px bg-violet-600"></div>
          <span className="text-[0.72rem] tracking-[0.22em] text-violet-500 uppercase font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            HOUDINI HOLLYWOOD
          </span>
          <div className="w-8 h-px bg-violet-600"></div>
        </div>
        
        <h1 className="hero-heading font-[800] leading-none tracking-[-0.04em] text-[var(--text)] mt-[0.8rem]" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}>
          Invest in Your craft
        </h1>
        
        <p className="hero-subtext text-[1rem] font-[300] leading-relaxed text-[var(--muted)] max-w-[460px] mx-auto mt-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          Choose the plan that fits your goals. No hidden fees, no surprises.
        </p>

        {/* Billing Toggle */}
        <div className="billing-toggle mt-[2.5rem] bg-[var(--card)] border border-[var(--border)] rounded-full p-1 inline-flex items-center">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-[1.4rem] py-[0.5rem] rounded-full text-[0.82rem] font-[700] transition-all duration-200 border-none outline-none ${billing === 'monthly' ? 'bg-violet-600 text-white shadow-md' : 'bg-transparent text-[var(--muted)] hover:text-slate-200'}`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Monthly
          </button>
          <div className="flex items-center relative">
            <button
              onClick={() => setBilling("yearly")}
              className={`px-[1.4rem] py-[0.5rem] rounded-full text-[0.82rem] font-[700] transition-all duration-200 border-none outline-none ${billing === 'yearly' ? 'bg-violet-600 text-white shadow-md' : 'bg-transparent text-[var(--muted)] hover:text-slate-200'}`}
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Yearly
            </button>
            <span 
              className="absolute -right-[4.2rem] top-1/2 -translate-y-1/2 font-[700] text-[0.6rem] px-[0.4rem] py-[0.15rem] rounded-[3px]"
              style={{ 
                fontFamily: 'Syne, sans-serif', color: 'var(--accent2, var(--accent2))', 
                background: 'rgba(255,190,0,0.15)', border: '1px solid rgba(255,190,0,0.3)',
                whiteSpace: 'nowrap', pointerEvents: 'none'
              }}
            >
              SAVE 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="pricing-container max-w-[1200px] mx-auto px-5 lg:px-12 pt-[4rem] pb-[6rem]">
        <div className="grid grid-cols-1 custom-tab:grid-cols-3 gap-[1.5rem] items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          {PLANS.map((plan, idx) => {
            const isYearly = billing === "yearly";
            const isPro = plan.variant === 'primary';
            const isMaster = plan.variant === 'master';
            
            // Card Styles
            let cardClasses = "pricing-card flex flex-col relative rounded-xl p-[2.2rem] transition-all duration-300 w-full";
            let cardStyle = { background: '#0f172a', border: '1px solid #1e293b' }; // Default Starter style (var--card basically)
            
            if (isPro) {
              cardClasses += " pro-card z-10";
              cardStyle.borderColor = '#8b5cf6';
              cardStyle.borderWidth = '2px';
              cardStyle.boxShadow = '0 0 60px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.4)';
              // On desktop handled via GSAP scale
            } else if (isMaster) {
              cardStyle.background = 'linear-gradient(145deg, var(--card) 0%, #1a1000 100%)';
              cardStyle.borderColor = 'rgba(255,190,0,0.25)';
              cardStyle.borderWidth = '1px';
              cardStyle.boxShadow = '0 0 40px rgba(255,190,0,0.06)';
            }

            // Tag Styles
            let tagStyle = { 
              background: 'rgba(255,255,255,0.06)', border: '1px solid #1e293b', color: '#94a3b8' 
            };
            if (isPro) tagStyle = { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6' };
            if (isMaster) tagStyle = { background: 'rgba(255,190,0,0.1)', border: '1px solid rgba(255,190,0,0.3)', color: 'var(--accent2, var(--accent2))' };

            // Button Styles
            let btnClasses = "w-full py-[0.95rem] border-none rounded-md font-[700] text-[0.88rem] tracking-[0.05em] uppercase cursor-pointer mt-[2rem] transition-all duration-200 outline-none";
            let btnStyle = { fontFamily: 'Syne, sans-serif' };
            if (isPro) {
              btnClasses += " bg-violet-600 hover:bg-violet-700 text-white hover:-translate-y-[2px] shadow-[0_8px_24px_rgba(139,92,246,0)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)]";
            } else if (isMaster) {
              btnClasses += " bg-[var(--accent2)] hover:brightness-110 text-[var(--bg)] hover:-translate-y-[2px] shadow-[0_8px_24px_rgba(255,190,0,0)] hover:shadow-[0_8px_24px_rgba(255,190,0,0.3)]";
              btnStyle.fontFamily = 'Syne, sans-serif';
              btnStyle.fontWeight = '800';
            } else {
              btnClasses += " bg-transparent border border-slate-700 text-[var(--text)] hover:border-violet-500 hover:text-violet-400";
              btnClasses = btnClasses.replace('border-none', '');
            }

            // Dynamic Values
            const displayPrice = isYearly ? plan.priceYearly : plan.priceMonthly;
            const priceColor = isMaster ? 'var(--accent2, var(--accent2))' : '#f8fafc'; // Master uses accent2

            return (
              <div key={idx} className={cardClasses} style={cardStyle}>
                
                {plan.isPopular && (
                  <div 
                    className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-violet-600 text-white px-[1.2rem] py-[0.35rem] rounded-full text-[0.68rem] tracking-[0.12em] font-[800] uppercase text-center whitespace-nowrap"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    ✦ MOST POPULAR ✦
                  </div>
                )}

                <h3 className="text-[var(--text)] text-[1.1rem] font-[800]" style={{ fontFamily: 'Syne, sans-serif' }}>{plan.name}</h3>
                <div 
                  className="inline-block px-[0.7rem] py-[0.25rem] rounded-full text-[0.62rem] font-[700] tracking-[0.1em] mt-[0.4rem] self-start"
                  style={{ fontFamily: 'Syne, sans-serif', ...tagStyle }}
                >
                  {plan.tag}
                </div>
                <p className="text-[0.88rem] text-[var(--muted)] mt-[0.8rem] leading-[1.6]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  {plan.desc}
                </p>

                {/* Price Block */}
                <div className="mt-[1.8rem] relative min-h-[90px]">
                  
                  {isYearly && (
                    <div 
                      className="text-slate-500 text-[0.8rem] line-through absolute -top-[1.2rem] left-0 transition-all duration-300 opacity-80"
                      style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                      ₹{plan.oldYearly}
                    </div>
                  )}

                  <div className="flex items-start transition-all duration-300 relative">
                    <span 
                      className="text-[1.2rem] font-[700] mt-[0.5rem] mr-[0.1rem] transition-colors"
                      style={{ fontFamily: 'Syne, sans-serif', color: '#8b5cf6' }}
                    >
                      ₹
                    </span>
                    <span 
                      className="text-[3.2rem] font-[800] tracking-[-0.04em] leading-none transition-colors"
                      style={{ fontFamily: 'Syne, sans-serif', color: priceColor }}
                    >
                      {displayPrice}
                    </span>
                    <span className="text-[0.82rem] font-[300] text-slate-500 self-end mb-[0.6rem] ml-[0.3rem]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      {isYearly ? "/year" : "/month"}
                    </span>
                  </div>

                  {isYearly && plan.savings && (
                    <div 
                      className="text-[0.75rem] mt-[0.2rem] absolute top-[3.3rem] left-0 transition-all duration-300"
                      style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--accent2, var(--accent2))' }}
                    >
                      You save ₹{plan.savings}/year
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-slate-800 my-[1.8rem]"></div>

                {/* Features List */}
                <div className="flex-1 flex flex-col">
                  <div className="text-[0.72rem] font-[700] text-slate-500 tracking-[0.1em] uppercase mb-[1rem]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    What's included:
                  </div>
                  
                  <ul className="space-y-[0.8rem] flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-[0.8rem]">
                        {feature.active ? (
                          <CheckCircle className="w-[15px] h-[15px] text-[var(--success)] shrink-0 mt-[2px]" />
                        ) : (
                          <XCircle className="w-[15px] h-[15px] text-white/15 shrink-0 mt-[2px]" />
                        )}
                        <span 
                          className={`text-[0.88rem] leading-[1.5] ${feature.active ? 'text-[var(--muted)]' : 'text-white/20 line-through'}`}
                          style={{ fontFamily: '"DM Sans", sans-serif' }}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleEnroll(plan.name)}
                    className={btnClasses} 
                    style={btnStyle}
                  >
                    {plan.ctaText}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-row flex gap-[2.5rem] justify-center flex-wrap px-4 mb-[5rem]">
        {TRUST_BADGES.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div key={idx} className="trust-badge flex items-center gap-[0.5rem]">
              <Icon className="w-[15px] h-[15px] text-slate-500" />
              <span className="text-[0.8rem] text-slate-500" style={{ fontFamily: '"DM Sans", sans-serif' }}>{badge.label}</span>
            </div>
          )
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="comp-table max-w-[900px] mx-auto px-5 lg:px-12 pb-[5rem]">
        <h2 className="text-[0.72rem] tracking-[0.2em] text-violet-500 uppercase text-center mb-[2rem] font-[700]" style={{ fontFamily: 'Syne, sans-serif' }}>
          COMPARE PLANS
        </h2>
        
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[var(--card)] border-b-2 border-[var(--border)]">
                <th className="p-[1rem] px-[1.2rem] text-left text-[0.8rem] font-[700] text-slate-500" style={{ fontFamily: 'Syne, sans-serif' }}>Feature</th>
                <th className="p-[1rem] px-[1.2rem] text-center text-[0.9rem] font-[800] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>Starter</th>
                <th className="p-[1rem] px-[1.2rem] text-center text-[0.9rem] font-[800] text-violet-500" style={{ fontFamily: 'Syne, sans-serif' }}>Pro</th>
                <th className="p-[1rem] px-[1.2rem] text-center text-[0.9rem] font-[800]" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent2, var(--accent2))' }}>Master</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, idx) => (
                <tr key={idx} className={`comp-table-row border-b border-[var(--border)]/60 ${idx % 2 === 0 ? '' : 'bg-white/5'}`}>
                  <td className="p-[0.95rem] px-[1.2rem] text-left text-[0.88rem] text-[var(--muted)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    {row.feature}
                  </td>
                  <td className="p-[0.95rem] px-[1.2rem] text-center text-[0.82rem] font-[700] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {renderTableCellValue(row.starter)}
                  </td>
                  <td className="p-[0.95rem] px-[1.2rem] text-center text-[0.82rem] font-[700] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {renderTableCellValue(row.pro)}
                  </td>
                  <td className="p-[0.95rem] px-[1.2rem] text-center text-[0.82rem] font-[700] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {renderTableCellValue(row.master)}
                  </td>
                </tr>
              ))}
              {/* Price Row */}
              <tr className="comp-table-row bg-[var(--card)] border-t-2 border-[var(--border)]">
                <td className="p-[1rem] px-[1.2rem] text-left text-[0.88rem] text-[var(--muted)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  Starting Price (Monthly)
                </td>
                <td className="p-[1rem] px-[1.2rem] text-center text-[1.1rem] font-[800] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  ₹4,999
                </td>
                <td className="p-[1rem] px-[1.2rem] text-center text-[1.1rem] font-[800] text-violet-500" style={{ fontFamily: 'Syne, sans-serif' }}>
                  ₹12,999
                </td>
                <td className="p-[1rem] px-[1.2rem] text-center text-[1.1rem] font-[800]" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent2, var(--accent2))' }}>
                  ₹24,999
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section max-w-[720px] mx-auto px-5 lg:px-12 pb-[6rem]">
        <h3 className="text-[0.72rem] tracking-[0.2em] text-violet-500 uppercase text-center font-[700] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          FREQUENTLY ASKED QUESTIONS
        </h3>
        <h2 className="text-[var(--text)] font-[800] text-center mb-[3rem]" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          Got Questions?
        </h2>

        <div className="flex flex-col">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="faq-item border-b border-[var(--border)] overflow-hidden">
                <div 
                  className="flex justify-between items-center py-[1.2rem] cursor-pointer group"
                  onClick={() => toggleFaq(idx)}
                >
                  <h4 className="text-[0.95rem] font-[700] text-[var(--text)] group-hover:text-violet-500 transition-colors pr-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {faq.q}
                  </h4>
                  <ChevronDown className={`w-5 h-5 text-[var(--muted)] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-500' : ''}`} />
                </div>
                <div 
                  className="transition-all duration-300 ease-in-out origin-top"
                  style={{ 
                    maxHeight: isOpen ? '400px' : '0px',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <p className="pb-[1.2rem] text-[0.92rem] text-[var(--muted)] font-[300] leading-[1.75]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div 
        className="bottom-cta w-full border-t border-[var(--border)] px-5 lg:px-12 py-[5rem]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,92,53,0.12) 0%, rgba(255,190,0,0.07) 100%)'
        }}
      >
        <div className="max-w-[1000px] mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="font-[800] text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 3rem)' }}>
            Still Not Sure? Talk to Us.
          </h2>
          <p className="text-[1rem] font-[300] text-[var(--muted)] mt-[1rem] mb-[2rem]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            We'll help you pick the right plan for your goals. No pressure.
          </p>
          <button
            onClick={handleToggleForm}
            className="px-10 py-[0.9rem] bg-violet-600 hover:bg-violet-500 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] text-white rounded-md font-[700] transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform flex items-center justify-center gap-2 border-none outline-none cursor-pointer"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Contact Us →
          </button>
        </div>
      </div>

      {contactOpen && (
        <div 
          className="contact-overlay fixed inset-0 z-[1000] flex items-center justify-center p-[1.5rem]"
          style={{ background: 'var(--overlay)', backdropFilter: 'blur(6px)' }}
          onClick={handleCloseForm}
        >
          <div 
            ref={formRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full relative shadow-2xl"
            style={{ 
              maxWidth: '480px', background: '#0f172a', border: '1px solid #1e293b',
              borderRadius: '14px', p: 0, padding: '2.2rem'
            }}
          >
            <button 
              onClick={handleCloseForm}
              className="absolute top-[1rem] right-[1rem] w-[32px] h-[32px] rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer outline-none hover:bg-slate-700"
              style={{ background: '#1e293b', borderColor: '#1e293b', color: '#94a3b8' }}
            >
              <X className="w-4 h-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors" />
            </button>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-4">
                <CheckCircle className="success-icon-modal w-[40px] h-[40px] text-[var(--success)] mb-4" />
                <h3 className="font-[800] text-[1.1rem] text-[var(--text)] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Message Sent! ✓
                </h3>
                <p className="text-[0.85rem] text-[var(--muted)]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  We'll get back to you at {formData.email} within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-[0.5rem] tracking-[0.16em] uppercase text-[0.68rem] font-[700]" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent, #8b5cf6)' }}>
                  GET IN TOUCH
                </div>
                <h3 className="text-[1.3rem] font-[800] text-[var(--text)] mb-[0.3rem]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Send Us a Message
                </h3>
                <p className="text-[0.82rem] font-[300] text-[var(--muted)] mb-[1.6rem]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  We'll reply within 24 hours.
                </p>
                <div className="w-full border-b border-[var(--border)] mb-[1.6rem]"></div>

                <div className="mb-[1.2rem] block w-full relative">
                  <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-[var(--muted)] mb-[0.5rem] font-[700]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Your Email <span className="text-violet-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    autoFocus
                    tabIndex="0"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (formErrors.email) setFormErrors({...formErrors, email: ''});
                    }}
                    className="w-full bg-[var(--input-bg)] border border-slate-700/50 rounded-[6px] px-[1rem] py-[0.82rem] text-[var(--text)] transition-all duration-200 outline-none focus:border-violet-500 shadow-[0_0_0_0px_rgba(255,92,53,0)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)]"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.92rem' }}
                  />
                  {formErrors.email && (
                    <div className="text-[var(--error)] text-[0.72rem] mt-[0.3rem] animate-in fade-in duration-200" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      {formErrors.email}
                    </div>
                  )}
                </div>

                <div className="mb-[1.2rem] block w-full relative">
                  <label className="block text-[0.72rem] tracking-[0.1em] uppercase text-[var(--muted)] mb-[0.5rem] font-[700]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Your Message <span className="text-violet-500">*</span>
                  </label>
                  <textarea 
                    placeholder="Ask about batch dates, payment plans, course details..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({...formData, message: e.target.value});
                      if (formErrors.message) setFormErrors({...formErrors, message: ''});
                    }}
                    className="w-full bg-[var(--input-bg)] border border-slate-700/50 rounded-[6px] px-[1rem] py-[0.82rem] text-[var(--text)] transition-all duration-200 outline-none resize-y min-h-[110px] focus:border-violet-500 shadow-[0_0_0_0px_rgba(255,92,53,0)] focus:shadow-[0_0_0_3px_rgba(255,92,53,0.12)]"
                    rows="4"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.92rem' }}
                  ></textarea>
                  {formErrors.message && (
                    <div className="text-[var(--error)] text-[0.72rem] mt-[0.3rem] animate-in fade-in duration-200" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                      {formErrors.message}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-violet-600 text-white border-none py-[0.9rem] rounded-[6px] uppercase mt-[1.2rem] transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:-translate-y-[2px] shadow-[0_8px_24px_rgba(255,92,53,0)] hover:shadow-[0_8px_24px_rgba(255,92,53,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-[700] text-[0.88rem] will-change-transform"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message →"
                  )}
                </button>
                <p className="text-center text-[0.7rem] text-[var(--muted)] mt-[1.2rem]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                  🔒 We never share your information.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
