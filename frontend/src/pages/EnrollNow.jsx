import React, { useState, useLayoutEffect, useRef } from 'react';
import { CheckCircle, Loader2, Lock, UploadCloud, X, FileImage } from "lucide-react";
import { gsap } from 'gsap';

const COURSES = [
  { id: "houdini", name: "Houdini Animation", type: "Live Classes", price: "₹44,999" },
  { id: "aftereffects", name: "After Effects", type: "Recorded", price: "₹7,999" },
  { id: "nuke", name: "Nuke Compositing", type: "Recorded", price: "₹15,999" },
  { id: "PhotoShop", name: "PhotoShop (COMING SOON)", type: "Recorded", price: "₹6,999" }
];

const PAYMENT_TYPES = ["full", "installment"];

export default function EnrollNow() {
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: '', paymentType: 'full'
  });

  const [selectedCourse, setSelectedCourse] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useLayoutEffect(() => {
    gsap.fromTo('.enroll-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    if (errors.screenshot) setErrors(prev => ({ ...prev, screenshot: null }));
  };

  const removeFile = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit number";
    if (!selectedCourse) newErrors.course = "Please select a course";
    if (!screenshot) newErrors.screenshot = "Payment receipt is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", `${formData.firstName} ${formData.lastName}`);
      fd.append("email", formData.email);
      fd.append("course", selectedCourse);
      fd.append("payment_type", formData.paymentType);
      fd.append("screenshot", screenshot);

      const res = await fetch("/api/enrollments/payment-submit", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();
      setEnrollmentId(data.enrollment_id);
      setIsSuccess(true);
    } catch (err) {
      setErrors({ submit: "Submission failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black py-24 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mt-10 mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Enroll Now</h1>
          <p className="text-slate-400">Take your first step into professional animation.</p>
        </div>

        <div className="enroll-card bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">Congratulations 🎉</h2>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-left space-y-2 max-w-md mx-auto">
                <p className="text-slate-300">
                  <span className="text-slate-500">Name:</span> {formData.firstName} {formData.lastName}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Email:</span> {formData.email}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500">Course:</span>{" "}
                  <span className="text-violet-400 font-semibold">
                    {COURSES.find(c => c.id === selectedCourse)?.name}
                  </span>
                </p>
              </div>
              <p className="text-xs text-slate-500">
                We will review your payment and contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
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
                      ? "bg-violet-600 text-white border-violet-600"
                      : "border-white/10 text-slate-400"}`}>
                    {g}
                  </button>
                ))}
              </div>

              {/* COURSE */}
              <div>
                <p className="text-sm text-slate-400 mb-3">Select Course *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COURSES.map(course => {
                    const isSelected = selectedCourse === course.id;
                    return (
                      <div key={course.id} onClick={() => setSelectedCourse(course.id)}
                        className={`cursor-pointer p-5 rounded-xl border transition-all ${isSelected
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/30"}`}>
                        <h3 className="font-semibold text-white">{course.name}</h3>
                        <p className="text-xs text-slate-400">{course.type}</p>
                        <div className="mt-2 text-violet-400 font-bold">{course.price}</div>
                      </div>
                    );
                  })}
                </div>
                {errors.course && <p className="error mt-2">{errors.course}</p>}
              </div>

              {/* PAYMENT TYPE */}
              <div>
                <p className="text-sm text-slate-400 mb-3">Payment Type</p>
                <div className="flex gap-3">
                  {PAYMENT_TYPES.map(pt => (
                    <button key={pt} onClick={() => handleChange("paymentType", pt)}
                      className={`px-4 py-2 rounded-full border capitalize ${formData.paymentType === pt
                        ? "bg-violet-600 text-white border-violet-600"
                        : "border-white/10 text-slate-400"}`}>
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* PAYMENT RECEIPT UPLOAD */}
              <div>
                <p className="text-sm text-slate-400 mb-3">Payment Receipt / Screenshot *</p>
                {!screenshotPreview ? (
                  <label className={`flex flex-col items-center justify-center gap-2 w-full py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all
                    ${errors.screenshot ? "border-red-500 bg-red-500/5" : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/5"}`}>
                    <UploadCloud className="w-8 h-8 text-slate-400" />
                    <span className="text-sm text-slate-400">Click to upload receipt</span>
                    <span className="text-xs text-slate-600">PNG, JPG, JPEG (max 10MB)</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    <img src={screenshotPreview} alt="Payment receipt" className="w-full max-h-64 object-contain bg-black/40" />
                    <button onClick={removeFile}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-2 bg-black/60">
                      <FileImage className="w-4 h-4 text-violet-400" />
                      <span className="text-xs text-slate-400 truncate">{screenshot?.name}</span>
                    </div>
                  </div>
                )}
                {errors.screenshot && <p className="error mt-2">{errors.screenshot}</p>}
              </div>

              {errors.submit && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* SUBMIT */}
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 rounded-xl font-semibold transition text-white">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Submit Enrollment →"}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                Secure & Safe
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
        .input:focus {
          border-color: rgba(139, 92, 246, 0.5);
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





































