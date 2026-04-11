import { useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";

const COURSES = [
  {
    id: "houdini",
    name: "Houdini Animation",
    type: "LIVE CLASSES",
    price: "₹44,999",
    desc: "Master cinematic FX, simulations, and destruction with live mentorship.",
    available: true,
  },
  {
    id: "aftereffects",
    name: "After Effects",
    type: "RECORDED",
    price: "₹7,999",
    desc: "Industry-level compositing and VFX integration.",
    available: true,
  },
  {
    id: "nuke",
    name: "Nuke Compositing",
    type: "RECORDED",
    price: "₹15,999",
    desc: "Learn compositing, lighting and rendering workflows.",
    available: true,
  },
  {
    id: "photoshop",
    name: "Photoshop",
    type: "COMING SOON",
    price: "₹6,999",
    desc: "Create cinematic environments and effects.",
    available: false,
  },
];

export default function EnrollNow() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    gsap.fromTo(
      ".course-card",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
    );
  }, []);

  const handleCourseSelect = (course) => {
    if (!course.available) return;
    // Save selected course to sessionStorage
    sessionStorage.setItem("selectedCourse", course.name);
    navigate("/payment-choice");
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mt-10 mb-16">
          <h1 className="text-5xl font-bold mb-4">Choose Your Course</h1>
          <p className="text-slate-400 text-lg">
            Select a course to begin your enrollment
          </p>
        </div>

        {/* COURSE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {COURSES.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseSelect(course)}
              className={`course-card p-8 rounded-2xl border transition-all duration-300 relative
                ${course.available
                  ? "cursor-pointer border-white/10 bg-white/5 hover:border-violet-500 hover:bg-violet-500/10 hover:scale-[1.02]"
                  : "cursor-not-allowed border-white/5 bg-white/2 opacity-50"
                }
              `}
            >
              {/* BADGE */}
              <span className={`text-xs px-3 py-1 rounded-full font-bold mb-4 inline-block
                ${course.type === "LIVE CLASSES"
                  ? "bg-red-500 text-white"
                  : course.type === "COMING SOON"
                  ? "bg-white/10 text-slate-400"
                  : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                {course.type === "LIVE CLASSES" && (
                  <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping mr-1" />
                )}
                {course.type}
              </span>

              <h3 className="text-2xl font-bold mb-3 text-white">
                {course.name}
              </h3>

              <p className="text-slate-400 mb-6 text-sm">
                {course.desc}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-violet-400">
                  {course.price}
                </span>
                {course.available && (
                  <span className="text-sm text-slate-400">
                    Enroll →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
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





































