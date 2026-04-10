/**
 * src/pages/EnrollNow.jsx  ← REPLACE your existing EnrollNow.jsx
 *
 * Changes from your original:
 *   1. Import enrollApi from api/client
 *   2. handleSubmit sends real POST /api/enrollments to backend
 *   3. Shows specific backend error if submission fails
 *   4. All UI, animations, course cards, validation unchanged
 */
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { CheckCircle, Loader2, Lock, Check } from "lucide-react";
import { gsap } from 'gsap';
import { enrollApi } from '../api/client';

const COURSES = [
  { id: "houdini", name: "Houdini Animation", type: "Live Classes", price: "₹44,999" },
  { id: "aftereffects", name: "After Effects", type: "Recorded", price: "₹7,999" },
  { id: "nuke", name: "Nuke Compositing", type: "Recorded", price: "₹15,999" },
  { id: "PhotoShop", name: "PhotoShop (COMING SOON)", type: "Recorded", price: "₹6,999" }
];

export default function EnrollNow() {
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: ''
  });

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useLayoutEffect(() => {
    gsap.fromTo('.enroll-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit number";
    }

    if (!selectedCourses.length) {
      newErrors.course = "Please select at least one course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await enrollApi.submit({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        courseId: selectedCourses[0],
      });
      setIsSuccess(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      alert(typeof detail === "string" ? detail : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div ref={containerRef} className="min-h-screen bg-black py-24 px-4">

      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="text-center mt-10 mb-12">
          <Link to="/payment-choice">
          Enroll Now →
          </Link>
          <p className="text-slate-400">
            Take your first step into professional animation.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="enroll-card bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

          {isSuccess ? (
            <div className="text-center py-10 space-y-4">

              <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />

              <h2 className="text-2xl font-bold text-white">
                Congratulations 🎉
              </h2>

              <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-left space-y-2 max-w-md mx-auto">

                <p className="text-slate-300">
                  <span className="text-slate-500">Name:</span>{" "}
                  {formData.firstName} {formData.lastName}
                </p>

                <p className="text-slate-300">
                  <span className="text-slate-500">Email:</span>{" "}
                  {formData.email}
                </p>

                <p className="text-slate-300">
                  <span className="text-slate-500">Courses:</span>{" "}
                  <span className="text-violet-400 font-semibold">
                    {selectedCourses.map(id => COURSES.find(c => c.id === id)?.name).join(", ")}
                  </span>
                </p>

              </div>

              <p className="text-xs text-slate-500">
                We will contact you shortly with further details.
              </p>

            </div>
          ) : (
            <>

              {/* NAME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="First Name *"
                    className={`input ${errors.firstName ? "border-red-500" : ""}`}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>

                <div>
                  <input
                    placeholder="Last Name *"
                    className={`input ${errors.lastName ? "border-red-500" : ""}`}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <input
                  placeholder="Email *"
                  className={`input ${errors.email ? "border-red-500" : ""}`}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              {/* PHONE */}
              <div>
                <input
                  placeholder="Phone *"
                  className={`input ${errors.phone ? "border-red-500" : ""}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("phone", value);
                  }}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>

              {/* GENDER */}
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map(g => (
                  <button
                    key={g}
                    onClick={() => handleChange("gender", g)}
                    className={`px-4 py-2 rounded-full border ${
                      formData.gender === g
                        ? "bg-violet-600 text-white"
                        : "border-white/10 text-slate-400"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* COURSE CARDS */}
              <div>
                <p className="text-sm text-slate-400 mb-3">
                  Select Course *
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {COURSES.map(course => {
                    const isSelected = selectedCourses.includes(course.id);

                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourses(prev =>
                            prev.includes(course.id)
                              ? prev.filter(id => id !== course.id)
                              : [...prev, course.id]
                          );
                        }}
                        className={`cursor-pointer p-5 rounded-xl border transition-all relative ${
                          isSelected
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <Check className="absolute top-2 right-2 w-5 h-5 text-violet-400" />
                        )}
                        <h3 className="font-semibold text-white">
                          {course.name}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {course.type}
                        </p>

                        <div className="mt-2 text-violet-400 font-bold">
                          {course.price}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.course && (
                  <p className="error mt-2">{errors.course}</p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Submit →"
                )}
              </button>

              {/* SAFE NOTE */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                Secure & Safe
              </div>

            </>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
        }

        .error {
          color: #f87171;
          font-size: 12px;
          margin-top: 4px;
        }
      `}</style>

    </div>
  );
}







// {/* C) DIVIDER */}
//         <div className="relative flex items-center justify-center margin-top my-[4rem] mb-[3rem]">
//           <div className="absolute w-full h-px bg-slate-800"></div>
//           <span 
//             className="relative bg-[var(--bg)] px-4 text-[0.75rem] tracking-[0.18em] text-slate-500 uppercase font-bold"
//             style={{ fontFamily: 'Syne, sans-serif' }}
//           >
//             ✦ Why Join Us ✦
//           </span>
//         </div>

//         {/* D) WHY JOIN US SECTION */}
//         <div className="flex flex-col">
//           {benefits.map((benefit, idx) => {
//             const IconComponent = benefit.icon;
//             const isLast = idx === benefits.length - 1;
            
//             return (
//               <div 
//                 key={idx} 
//                 className={`benefit-row flex items-start gap-4 flex-row ${!isLast ? 'border-b border-[var(--border)] pb-[1.2rem] mb-[1.2rem]' : ''}`}
//               >
//                 <div 
//                   className="w-[36px] h-[36px] rounded-md flex items-center justify-center shrink-0 border"
//                   style={{ background: 'rgba(255,92,53,0.1)', borderColor: 'rgba(255,92,53,0.2)' }}
//                 >
//                   <IconComponent className="w-4 h-4 text-violet-500" />
//                 </div>
//                 <div className="flex flex-col pt-[0.1rem]">
//                   <h4 className="text-[var(--text)] text-[0.92rem] font-[700]" style={{ fontFamily: 'Syne, sans-serif' }}>
//                     {benefit.title}
//                   </h4>
//                   <p className="text-[var(--muted)] text-[0.82rem] leading-[1.6] mt-[0.2rem] max-w-[400px]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
//                     {benefit.desc}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
        // </div>
        //<h1 className="text-5xl font-bold mb-4 text-white">
            //Enroll Now
          //</h1>