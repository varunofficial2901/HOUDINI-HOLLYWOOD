import React, { useState, useLayoutEffect, useRef } from 'react';
import { CheckCircle, Loader2, Lock, UploadCloud, X, FileImage, ChevronRight, User, CreditCard, ImageIcon, ArrowLeft } from "lucide-react";
import { gsap } from 'gsap';

// ── Only Houdini Animation ─────────────────────────────────
const COURSE = { id: "houdini", name: "Houdini Animation", type: "Live Classes" };
const FULL_PRICE = 44999;
const HALF_PRICE_1 = 20000;
const HALF_PRICE_2 = 25000;

// ── Step indicator ─────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Details", "Payment", "Upload"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
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

// ── Step 1: Personal Details ───────────────────────────────
function StepDetails({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.firstName.trim()) e.firstName = "Required";
    if (!data.lastName.trim()) e.lastName = "Required";
    if (!data.email.trim()) e.email = "Required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) e.email = "Invalid email";
    if (!data.phone.trim()) e.phone = "Required";
    else if (!/^[0-9]{10}$/.test(data.phone)) e.phone = "10 digits required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Houdini Animation · Live Classes</span>
        </div>
        <p className="text-slate-400 text-sm">Fill in your personal details to get started</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input placeholder="First Name *" value={data.firstName}
            className={`input ${errors.firstName ? "border-red-500" : ""}`}
            onChange={e => { onChange("firstName", e.target.value); if (errors.firstName) setErrors(p => ({...p, firstName: null})); }} />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div>
          <input placeholder="Last Name *" value={data.lastName}
            className={`input ${errors.lastName ? "border-red-500" : ""}`}
            onChange={e => { onChange("lastName", e.target.value); if (errors.lastName) setErrors(p => ({...p, lastName: null})); }} />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <input placeholder="Email *" value={data.email}
          className={`input ${errors.email ? "border-red-500" : ""}`}
          onChange={e => { onChange("email", e.target.value); if (errors.email) setErrors(p => ({...p, email: null})); }} />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div>
        <input placeholder="Phone *" value={data.phone}
          className={`input ${errors.phone ? "border-red-500" : ""}`}
          onChange={e => { onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10)); if (errors.phone) setErrors(p => ({...p, phone: null})); }} />
        {errors.phone && <p className="error">{errors.phone}</p>}
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-2">Gender (optional)</p>
        <div className="flex gap-3">
          {["Male", "Female", "Other"].map(g => (
            <button key={g} type="button" onClick={() => onChange("gender", g)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${data.gender === g
                ? "bg-violet-600 text-white border-violet-600"
                : "border-white/10 text-slate-400 hover:border-white/30"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => validate() && onNext()}
        className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition text-white flex items-center justify-center gap-2">
        Continue to Payment <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Step 2: Payment Choice ─────────────────────────────────
function StepPayment({ paymentType, onChange, onNext, onBack }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <p className="text-slate-400 text-sm">Choose your payment plan</p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full */}
        <div onClick={() => onChange("full")}
          className={`cursor-pointer p-5 rounded-xl border transition-all ${paymentType === "full"
            ? "border-violet-500 bg-violet-500/10"
            : "border-white/10 bg-white/5 hover:border-white/30"}`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Full Payment</span>
            {paymentType === "full" && (
              <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">₹44,999</div>
          <p className="text-xs text-slate-500">One-time payment · Full access</p>
        </div>

        {/* Installment */}
        <div onClick={() => onChange("installment")}
          className={`cursor-pointer p-5 rounded-xl border transition-all ${paymentType === "installment"
            ? "border-violet-500 bg-violet-500/10"
            : "border-white/10 bg-white/5 hover:border-white/30"}`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Installment</span>
            {paymentType === "installment" && (
              <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-1">₹20,000 <span className="text-sm font-normal text-slate-400">now</span></div>
          <p className="text-xs text-slate-500">+ ₹25,000 later · Split in 2 parts</p>
        </div>
      </div>

      {/* QR Code section */}
      {paymentType && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.05)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(139,92,246,0.2)" }}>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Scan & Pay — {paymentType === "full" ? "₹44,999" : "₹20,000 (First Installment)"}
            </p>
          </div>
          <div className="flex flex-col items-center p-6 gap-4">
            <div className="rounded-xl overflow-hidden p-2 bg-white shadow-lg shadow-violet-900/20">
              <img src="/photos/qr.jpeg" alt="Payment QR Code"
                className="w-48 h-48 object-contain" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-400">Scan the QR code using any UPI app</p>
              <p className="text-xs text-slate-500">PhonePe · GPay · Paytm · BHIM</p>
            </div>
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
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm text-slate-400 hover:text-white transition-all"
          style={{ border: "1px solid var(--border, rgba(255,255,255,0.1))" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onNext} disabled={!paymentType}
          className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition text-white flex items-center justify-center gap-2">
          I've Paid — Upload Receipt <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Upload Receipt ─────────────────────────────────
function StepUpload({ screenshot, onFileChange, onRemove, onSubmit, onBack, submitting, submitError }) {
  const [dragOver, setDragOver] = useState(false);
  const preview = screenshot ? URL.createObjectURL(screenshot) : null;

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileChange(file);
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <p className="text-slate-400 text-sm">Upload your payment screenshot as proof</p>
      </div>

      {!preview ? (
        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 w-full py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${dragOver ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/5"}`}>
          <UploadCloud className={`w-10 h-10 ${dragOver ? "text-violet-400" : "text-slate-500"}`} />
          <div className="text-center">
            <p className="text-sm text-slate-300 font-medium">Click or drag & drop your receipt</p>
            <p className="text-xs text-slate-600 mt-1">PNG, JPG, JPEG supported</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && onFileChange(e.target.files[0])} />
        </label>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(139,92,246,0.3)" }}>
          <div className="relative">
            <img src={preview} alt="Receipt preview" className="w-full max-h-64 object-contain bg-black/40" />
            <button onClick={onRemove}
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
        <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm text-slate-400 hover:text-white transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={onSubmit} disabled={!screenshot || submitting}
          className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition text-white">
          {submitting ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Submit Enrollment →"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
        <Lock className="w-3 h-3" /> Secure & Safe
      </div>
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────
function SuccessScreen({ name, paymentType }) {
  return (
    <div className="text-center py-8 space-y-5">
      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"
        style={{ border: "1px solid rgba(34,197,94,0.3)" }}>
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">You're Enrolled! 🎉</h2>
        <p className="text-slate-400 text-sm">Your payment receipt has been submitted for review.</p>
      </div>
      <div className="p-5 rounded-xl text-left space-y-2 max-w-sm mx-auto"
        style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
        <p className="text-slate-300 text-sm"><span className="text-slate-500">Name:</span> {name}</p>
        <p className="text-slate-300 text-sm"><span className="text-slate-500">Course:</span> <span className="text-violet-400 font-semibold">Houdini Animation</span></p>
        <p className="text-slate-300 text-sm"><span className="text-slate-500">Plan:</span> {paymentType === "full" ? "Full Payment · ₹44,999" : "Installment · ₹20,000 now"}</p>
      </div>
      <p className="text-xs text-slate-500 max-w-xs mx-auto">
        Our team will verify your payment and send you a WhatsApp group link within 24 hours.
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function EnrollNow() {
  const cardRef = useRef(null);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [screenshot, setScreenshot] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: ''
  });
  const [paymentType, setPaymentType] = useState("");

  useLayoutEffect(() => {
    gsap.fromTo('.enroll-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 });
  }, []);

  // Animate step change
  const goTo = (s) => {
    gsap.to('.step-content', { opacity: 0, y: 10, duration: 0.15, onComplete: () => {
      setStep(s);
      gsap.fromTo('.step-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 });
    }});
  };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!screenshot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("name", `${formData.firstName} ${formData.lastName}`);
      fd.append("email", formData.email);
      fd.append("course", COURSE.id);
      fd.append("payment_type", paymentType);
      fd.append("screenshot", screenshot);

      const res = await fetch("/api/enrollments/payment-submit", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setSubmitError("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-24 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mt-10 mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Enroll Now</h1>
          <p className="text-slate-400">Take your first step into professional animation.</p>
        </div>

        <div className="enroll-card bg-white/5 border border-white/10 rounded-2xl p-8">
          {done ? (
            <SuccessScreen name={`${formData.firstName} ${formData.lastName}`} paymentType={paymentType} />
          ) : (
            <>
              <StepBar step={step} />
              <div className="step-content">
                {step === 1 && (
                  <StepDetails data={formData} onChange={handleChange} onNext={() => goTo(2)} />
                )}
                {step === 2 && (
                  <StepPayment paymentType={paymentType} onChange={setPaymentType}
                    onNext={() => goTo(3)} onBack={() => goTo(1)} />
                )}
                {step === 3 && (
                  <StepUpload
                    screenshot={screenshot}
                    onFileChange={setScreenshot}
                    onRemove={() => setScreenshot(null)}
                    onSubmit={handleSubmit}
                    onBack={() => goTo(2)}
                    submitting={submitting}
                    submitError={submitError}
                  />
                )}
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
          transition: border-color 0.2s;
        }
        .input:focus { border-color: rgba(139,92,246,0.5); }
        .input.border-red-500 { border-color: #ef4444; }
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





































