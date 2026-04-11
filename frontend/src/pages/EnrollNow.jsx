import React, { useState, useLayoutEffect, useRef } from 'react';
import { CheckCircle, Loader2, Lock, UploadCloud, X, FileImage, ChevronRight, ArrowLeft } from "lucide-react";
import { gsap } from 'gsap';

const COURSES = [
  { id: "houdini", name: "Houdini Animation", type: "Live Classes", price: "₹44,999" },
  { id: "aftereffects", name: "After Effects", type: "Recorded", price: "₹7,999" },
  { id: "nuke", name: "Nuke Compositing", type: "Recorded", price: "₹15,999" },
  { id: "PhotoShop", name: "PhotoShop (COMING SOON)", type: "Recorded", price: "₹6,999" }
];

// ── Step Bar (only for Houdini flow) ──────────────────────
function StepBar({ step }) {
  const steps = ["Details", "Payment", "Upload"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = step === idx;
        const done = step > idx;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${done ? "bg-violet-600 text-white" : active ? "bg-violet-600 text-white ring-4 ring-violet-600/30" : "bg-white/10 text-slate-500"}`}>
                {done ? <CheckCircle className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-xs font-semibold ${active || done ? "text-violet-400" : "text-slate-600"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-px mb-5 transition-all duration-500 ${done ? "bg-violet-600" : "bg-white/10"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function EnrollNow() {
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: ''
  });
  const [selectedCourse, setSelectedCourse] = useState("");
  const [errors, setErrors] = useState({});

  // Houdini-specific state
  const [houdiniStep, setHoudiniStep] = useState(1); // 1=details, 2=payment, 3=upload
  const [paymentType, setPaymentType] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // General state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useLayoutEffect(() => {
    gsap.fromTo('.enroll-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 });
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateDetails = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone)) e.phone = "Enter a valid 10-digit number";
    if (!selectedCourse) e.course = "Please select a course";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (file) => {
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const removeFile = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  // For non-Houdini courses — original simple submit
  const handleSimpleSubmit = () => {
    if (!validateDetails()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Houdini Step 1 → 2
  const handleHoudiniNext1 = () => {
    if (!validateDetails()) return;
    setHoudiniStep(2);
  };

  // Houdini Step 3 — final submit
  const handleHoudiniSubmit = async () => {
    if (!screenshot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("name", `${formData.firstName} ${formData.lastName}`);
      fd.append("email", formData.email);
      fd.append("course", "houdini");
      fd.append("payment_type", paymentType);
      fd.append("screenshot", screenshot);

      const res = await fetch("/api/enrollments/payment-submit", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Failed");
      setIsSuccess(true);
    } catch {
      setSubmitError("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isHoudini = selectedCourse === "houdini";

  // ── Success Screen ───────────────────────────────────────
  if (isSuccess) {
    return (
      <div ref={containerRef} className="min-h-screen bg-black py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mt-10 mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">Enroll Now</h1>
            <p className="text-slate-400">Take your first step into professional animation.</p>
          </div>
          <div className="enroll-card bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"
              style={{ border: "1px solid rgba(34,197,94,0.3)" }}>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isHoudini ? "You're Enrolled! 🎉" : "Congratulations 🎉"}
            </h2>
            <div className="p-5 rounded-xl text-left space-y-2 max-w-sm mx-auto"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <p className="text-slate-300 text-sm"><span className="text-slate-500">Name:</span> {formData.firstName} {formData.lastName}</p>
              <p className="text-slate-300 text-sm"><span className="text-slate-500">Email:</span> {formData.email}</p>
              <p className="text-slate-300 text-sm">
                <span className="text-slate-500">Course:</span>{" "}
                <span className="text-violet-400 font-semibold">{COURSES.find(c => c.id === selectedCourse)?.name}</span>
              </p>
              {isHoudini && (
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-500">Plan:</span>{" "}
                  {paymentType === "full" ? "Full Payment · ₹44,999" : "Installment · ₹20,000 now + ₹25,000 later"}
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isHoudini
                ? "Our team will verify your payment and send you a WhatsApp group link within 24 hours."
                : "We will contact you shortly with further details."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black py-24 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mt-10 mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Enroll Now</h1>
          <p className="text-slate-400">Take your first step into professional animation.</p>
        </div>

        <div className="enroll-card bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

          {/* ── Houdini Multi-Step Flow ── */}
          {isHoudini && houdiniStep > 1 ? (
            <>
              <StepBar step={houdiniStep} />

              {/* Step 2: Payment */}
              {houdiniStep === 2 && (
                <div className="space-y-6">
                  <p className="text-slate-400 text-sm text-center">Choose your payment plan</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div onClick={() => setPaymentType("full")}
                      className={`cursor-pointer p-5 rounded-xl border transition-all ${paymentType === "full"
                        ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Full Payment</span>
                        {paymentType === "full" && <CheckCircle className="w-4 h-4 text-violet-400" />}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">₹44,999</div>
                      <p className="text-xs text-slate-500">One-time payment · Full access</p>
                    </div>

                    <div onClick={() => setPaymentType("installment")}
                      className={`cursor-pointer p-5 rounded-xl border transition-all ${paymentType === "installment"
                        ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Installment</span>
                        {paymentType === "installment" && <CheckCircle className="w-4 h-4 text-violet-400" />}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">₹20,000 <span className="text-sm font-normal text-slate-400">now</span></div>
                      <p className="text-xs text-slate-500">+ ₹25,000 later · Split in 2 parts</p>
                    </div>
                  </div>

                  {paymentType && (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.05)" }}>
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.2)" }}>
                        <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
                          Scan & Pay — {paymentType === "full" ? "₹44,999" : "₹20,000 (First Installment)"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-6 gap-4">
                        <div className="rounded-xl overflow-hidden p-2 bg-white shadow-lg">
                          <img src="/photos/qr.jpeg" alt="Payment QR Code" className="w-48 h-48 object-contain" />
                        </div>
                        <p className="text-xs text-slate-400">Scan using PhonePe · GPay · Paytm · BHIM</p>
                        {paymentType === "installment" && (
                          <div className="w-full px-4 py-3 rounded-lg text-xs text-center"
                            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                            ⚠️ Pay ₹20,000 now. Remaining ₹25,000 to be paid later as instructed.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setHoudiniStep(1)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm text-slate-400 hover:text-white transition-all"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => paymentType && setHoudiniStep(3)} disabled={!paymentType}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition text-white flex items-center justify-center gap-2">
                      I've Paid — Upload Receipt <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Receipt */}
              {houdiniStep === 3 && (
                <div className="space-y-5">
                  <p className="text-slate-400 text-sm text-center">Upload your payment screenshot as proof</p>

                  {!screenshotPreview ? (
                    <label className="flex flex-col items-center justify-center gap-3 w-full py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/5">
                      <UploadCloud className="w-10 h-10 text-slate-500" />
                      <div className="text-center">
                        <p className="text-sm text-slate-300 font-medium">Click to upload your receipt</p>
                        <p className="text-xs text-slate-600 mt-1">PNG, JPG, JPEG supported</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => e.target.files[0] && handleFileChange(e.target.files[0])} />
                    </label>
                  ) : (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.3)" }}>
                      <div className="relative">
                        <img src={screenshotPreview} alt="Receipt" className="w-full max-h-64 object-contain bg-black/40" />
                        <button onClick={removeFile}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2"
                        style={{ background: "rgba(139,92,246,0.08)", borderTop: "1px solid rgba(139,92,246,0.2)" }}>
                        <FileImage className="w-4 h-4 text-violet-400" />
                        <span className="text-xs text-slate-400 truncate">{screenshot?.name}</span>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 rounded-lg text-sm"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setHoudiniStep(2)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm text-slate-400 hover:text-white transition-all"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={handleHoudiniSubmit} disabled={!screenshot || submitting}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition text-white">
                      {submitting ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Submit Enrollment →"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <Lock className="w-3 h-3" /> Secure & Safe
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ── Original Form (all courses) ── */}

              {/* NAME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input placeholder="First Name *" className={`input ${errors.firstName ? "border-red-500" : ""}`}
                    onChange={(e) => handleChange("firstName", e.target.value)} />
                  {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>
                <div>
                  <input placeholder="Last Name *" className={`input ${errors.lastName ? "border-red-500" : ""}`}
                    onChange={(e) => handleChange("lastName", e.target.value)} />
                  {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <input placeholder="Email *" className={`input ${errors.email ? "border-red-500" : ""}`}
                  onChange={(e) => handleChange("email", e.target.value)} />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              {/* PHONE */}
              <div>
                <input placeholder="Phone *" className={`input ${errors.phone ? "border-red-500" : ""}`}
                  onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))} />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>

              {/* GENDER */}
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map(g => (
                  <button key={g} onClick={() => handleChange("gender", g)}
                    className={`px-4 py-2 rounded-full border ${formData.gender === g
                      ? "bg-violet-600 text-white" : "border-white/10 text-slate-400"}`}>
                    {g}
                  </button>
                ))}
              </div>

              {/* COURSE CARDS */}
              <div>
                <p className="text-sm text-slate-400 mb-3">Select Course *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COURSES.map(course => {
                    const isSelected = selectedCourse === course.id;
                    return (
                      <div key={course.id} onClick={() => setSelectedCourse(course.id)}
                        className={`cursor-pointer p-5 rounded-xl border transition-all ${isSelected
                          ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                        <h3 className="font-semibold text-white">{course.name}</h3>
                        <p className="text-xs text-slate-400">{course.type}</p>
                        <div className="mt-2 text-violet-400 font-bold">{course.price}</div>
                        {course.id === "houdini" && (
                          <p className="text-xs mt-2 text-violet-300/60">Includes payment flow →</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors.course && <p className="error mt-2">{errors.course}</p>}
              </div>

              {/* SUBMIT */}
              <button
                onClick={isHoudini ? handleHoudiniNext1 : handleSimpleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition text-white flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : (
                  isHoudini ? <><span>Continue to Payment</span><ChevronRight className="w-4 h-4" /></> : "Enroll Now →"
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" /> Secure & Safe
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
        }
        .input:focus { border-color: rgba(139,92,246,0.5); }
        .error { color: #f87171; font-size: 12px; margin-top: 4px; }
      `}</style>
    </div>
  );
}





























// import React, { useState, useLayoutEffect, useRef } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Loader2, Lock, Check } from "lucide-react";
// import { gsap } from 'gsap';

// const COURSES = [
//   { id: "houdini", name: "Houdini Animation", type: "Live Classes", price: "₹44,999" },
//   { id: "aftereffects", name: "After Effects", type: "Recorded", price: "₹7,999" },
//   { id: "nuke", name: "Nuke Compositing", type: "Recorded", price: "₹15,999" },
//   { id: "PhotoShop", name: "PhotoShop (COMING SOON)", type: "Recorded", price: "₹6,999" }
// ];

// export default function EnrollNow() {
//   const containerRef = useRef(null);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', phone: '', gender: ''
//   });

//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useLayoutEffect(() => {
//     gsap.fromTo('.enroll-card',
//       { opacity: 0, y: 40 },
//       { opacity: 1, y: 0, duration: 0.8 }
//     );
//   }, []);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
//       newErrors.email = "Enter a valid email";
//     }
//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^[0-9]{10}$/.test(formData.phone)) {
//       newErrors.phone = "Enter a valid 10-digit number";
//     }
//     if (!selectedCourses.length) {
//       newErrors.course = "Please select at least one course";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//     setIsSubmitting(true);

//     // Store form data in sessionStorage so payment panel can use it later if needed
//     sessionStorage.setItem("enrollData", JSON.stringify({
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       phone: formData.phone,
//       gender: formData.gender,
//       course: selectedCourses[0],
//     }));

//     // Redirect to payment choice
//     navigate("/payment-choice");
//   };

//   return (
//     <div ref={containerRef} className="min-h-screen bg-black py-24 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* HEADER */}
//         <div className="text-center mt-10 mb-12">
//           <h1 className="text-4xl font-bold text-white mb-4">
//             Enroll Now
//           </h1>
//           <p className="text-slate-400">
//             Take your first step into professional animation.
//           </p>
//         </div>

//         {/* FORM CARD */}
//         <div className="enroll-card bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

//           {/* NAME */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <input
//                 placeholder="First Name *"
//                 className={`input ${errors.firstName ? "border-red-500" : ""}`}
//                 onChange={(e) => handleChange("firstName", e.target.value)}
//               />
//               {errors.firstName && <p className="error">{errors.firstName}</p>}
//             </div>
//             <div>
//               <input
//                 placeholder="Last Name *"
//                 className={`input ${errors.lastName ? "border-red-500" : ""}`}
//                 onChange={(e) => handleChange("lastName", e.target.value)}
//               />
//               {errors.lastName && <p className="error">{errors.lastName}</p>}
//             </div>
//           </div>

//           {/* EMAIL */}
//           <div>
//             <input
//               placeholder="Email *"
//               className={`input ${errors.email ? "border-red-500" : ""}`}
//               onChange={(e) => handleChange("email", e.target.value)}
//             />
//             {errors.email && <p className="error">{errors.email}</p>}
//           </div>

//           {/* PHONE */}
//           <div>
//             <input
//               placeholder="Phone *"
//               className={`input ${errors.phone ? "border-red-500" : ""}`}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "");
//                 handleChange("phone", value);
//               }}
//             />
//             {errors.phone && <p className="error">{errors.phone}</p>}
//           </div>

//           {/* GENDER */}
//           <div className="flex gap-3">
//             {["Male", "Female", "Other"].map(g => (
//               <button
//                 key={g}
//                 onClick={() => handleChange("gender", g)}
//                 className={`px-4 py-2 rounded-full border ${
//                   formData.gender === g
//                     ? "bg-violet-600 text-white"
//                     : "border-white/10 text-slate-400"
//                 }`}
//               >
//                 {g}
//               </button>
//             ))}
//           </div>

//           {/* COURSE CARDS */}
//           <div>
//             <p className="text-sm text-slate-400 mb-3">Select Course *</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {COURSES.map(course => {
//                 const isSelected = selectedCourses.includes(course.id);
//                 return (
//                   <div
//                     key={course.id}
//                     onClick={() => {
//                       setSelectedCourses(prev =>
//                         prev.includes(course.id)
//                           ? prev.filter(id => id !== course.id)
//                           : [...prev, course.id]
//                       );
//                     }}
//                     className={`cursor-pointer p-5 rounded-xl border transition-all relative ${
//                       isSelected
//                         ? "border-violet-500 bg-violet-500/10"
//                         : "border-white/10 bg-white/5 hover:border-white/30"
//                     }`}
//                   >
//                     {isSelected && (
//                       <Check className="absolute top-2 right-2 w-5 h-5 text-violet-400" />
//                     )}
//                     <h3 className="font-semibold text-white">{course.name}</h3>
//                     <p className="text-xs text-slate-400">{course.type}</p>
//                     <div className="mt-2 text-violet-400 font-bold">{course.price}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             {errors.course && <p className="error mt-2">{errors.course}</p>}
//           </div>

//           {/* SUBMIT */}
//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition text-white"
//           >
//             {isSubmitting ? (
//               <Loader2 className="animate-spin mx-auto" />
//             ) : (
//               "Proceed to Payment →"
//             )}
//           </button>

//           {/* SAFE NOTE */}
//           <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
//             <Lock className="w-3 h-3" />
//             Secure & Safe
//           </div>

//         </div>
//       </div>

//       <style>{`
//         .input {
//           width: 100%;
//           padding: 12px;
//           border-radius: 10px;
//           background: rgba(255,255,255,0.05);
//           border: 1px solid rgba(255,255,255,0.1);
//           color: white;
//           outline: none;
//         }
//         .error {
//           color: #f87171;
//           font-size: 12px;
//           margin-top: 4px;
//         }
//       `}</style>
//     </div>
//   );
// }





































