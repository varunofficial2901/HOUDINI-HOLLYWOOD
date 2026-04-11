import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { enrollApi } from '../api/client';

export default function PaymentPanel() {
  const [params] = useSearchParams();
  const type = params.get("type");

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "Houdini Animation",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [whatsappMessage, setWhatsappMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const pollRef = useRef(null);

  const price = type === "full" ? "45,000" : "20,000";

  useEffect(() => {
    if (!enrollmentId) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await enrollApi.checkStatus(enrollmentId);
        const data = res.data;
        if (data.status === "confirmed") {
          setStatus("confirmed");
          setWhatsappLink(data.whatsapp_link);
          setWhatsappMessage(data.message);
          clearInterval(pollRef.current);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [enrollmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      alert("Please upload your payment screenshot");
      return;
    }
    setLoading(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("course", form.course);
      fd.append("payment_type", type);
      fd.append("screenshot", form.file);

      const res = await enrollApi.submitPayment(fd);
      setEnrollmentId(res.data.enrollment_id);
      setStatus("pending");
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur">

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Welcome to Creative India School
        </h1>

        {!enrollmentId && (
          <div>
            <div className="flex flex-col items-center mb-6">
              <img
                src="/photos/qr.jpeg"
                alt="UPI QR"
                className="w-48 h-48 object-contain rounded-lg"
              />
              <p className="text-sm text-slate-400 mt-2 text-center">
                Scan and pay using any UPI app
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500 transition-colors"
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                <option value="Houdini Animation">Houdini Animation</option>
                <option value="After Effects">After Effects</option>
                <option value="Nuke Compositing">Nuke Compositing</option>
                <option value="Photoshop">Photoshop</option>
              </select>

              <div className="text-center text-xl font-bold text-violet-400">
                Rs. {price}
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">Upload Payment Screenshot</p>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-600 file:text-white file:cursor-pointer hover:file:bg-violet-500"
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                />
              </div>

              {submitError && (
                <div className="p-3 rounded-lg text-sm text-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-white"
              >
                {loading ? "Submitting..." : "Submit Payment"}
              </button>
            </form>
          </div>
        )}

        {enrollmentId && status === "pending" && (
          <div className="text-center py-10 space-y-5">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Payment Submitted!</h2>
            <p className="text-slate-400">
              Our team is reviewing your payment. This page will update automatically once confirmed.
            </p>
          </div>
        )}

        {enrollmentId && status === "confirmed" && (
          <div className="text-center py-10 space-y-5">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Payment Confirmed!</h2>
            <p className="text-slate-400">Welcome to Creative India School 🎉</p>
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white transition-colors">
                Join WhatsApp Group →
              </a>
            )}
            {whatsappMessage && (
              <p className="text-xs text-slate-500">{whatsappMessage}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}








 
//     name: "",
//     email: "",
//     course: "Houdini Animation",
//     file: null,
//   });

//   const [loading, setLoading] = useState(false);
//   const [enrollmentId, setEnrollmentId] = useState(null);
//   const [status, setStatus] = useState("pending");
//   const [whatsappLink, setWhatsappLink] = useState(null);
//   const [whatsappMessage, setWhatsappMessage] = useState(null);
//   const pollRef = useRef(null);

//   const price = type === "full" ? "45,000" : "20,000";

//   useEffect(() => {
//     if (!enrollmentId) return;

//     pollRef.current = setInterval(async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/enrollments/payment-status/${enrollmentId}`
//         );
//         const data = await res.json();
//         if (data.status === "confirmed") {
//           setStatus("confirmed");
//           setWhatsappLink(data.whatsapp_link);
//           setWhatsappMessage(data.message);
//           clearInterval(pollRef.current);
//         }
//       } catch (err) {
//         console.error("Polling error", err);
//       }
//     }, 5000);

//     return () => clearInterval(pollRef.current);
//   }, [enrollmentId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.file) {
//       alert("Please upload your payment screenshot");
//       return;
//     }
//     setLoading(true);
//     try {
//       const data = new FormData();
//       data.append("name", form.name);
//       data.append("email", form.email);
//       data.append("course", form.course);
//       data.append("payment_type", type);
//       data.append("screenshot", form.file);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/enrollments/payment-submit`,
//         { method: "POST", body: data }
//       );
//       const result = await res.json();
//       setEnrollmentId(result.enrollment_id);
//       setStatus("pending");
//     } catch (err) {
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
//       <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur">

//         <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
//           Welcome to Creative India School
//         </h1>

//         {/* STEP 1 — Payment Form */
//         {!enrollmentId && (
//           <div>
//             <div className="flex flex-col items-center mb-6">
//               <img
//                 src="/photos/qr.jpeg"
//                 alt="UPI QR"
//                 className="w-48 h-48 object-contain rounded-lg"
//               />
//               <p className="text-sm text-slate-400 mt-2 text-center">
//                 Scan and pay using any UPI app
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">

//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 required
//                 className="w-full p-3 rounded bg-black/50 border border-white/10 text-white"
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />

//               <input
//                 type="email"
//                 placeholder="Email"
//                 required
//                 className="w-full p-3 rounded bg-black/50 border border-white/10 text-white"
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//               />

//               <select
//                 className="w-full p-3 rounded bg-black/50 border border-white/10 text-white"
//                 onChange={(e) => setForm({ ...form, course: e.target.value })}
//               >
//                 <option>Houdini Animation</option>
//                 <option>After Effects</option>
//                 <option>Nuke Compositing</option>
//                 <option>Photoshop</option>
//               </select>

//               <div className="text-center text-xl font-bold text-violet-400">
//                 Rs. {price}
//               </div>

//               <div>
//                 <p className="text-sm text-slate-400 mb-2">
//                   Upload Payment Screenshot
//                 </p>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   required
//                   className="w-full text-sm text-slate-400"
//                   onChange={(e) =>
//                     setForm({ ...form, file: e.target.files[0] })
//                   }
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition disabled:opacity-60"
//               >
//                 {loading ? "Submitting..." : "Submit Payment"}
//               </button>

//             </form>
//           </div>
//         )}

//         {/* STEP 2 — Waiting for Approval */}
//         {enrollmentId && status === "pending" && (
//           <div className="text-center py-10 space-y-5">
//             <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
//             <h2 className="text-xl font-bold text-white">
//               Payment Submitted!
//             </h2>
//             <p className="text-slate-400">
//               Our team is reviewing your payment.
//             </p>
//             <p className="text-slate-400">
//               This page will update automatically once approved.
//             </p>
//             <p className="text-xs text-slate-600">
//               Please keep this page open.
//             </p>
//           </div>
//         )}

//         {/* STEP 3 — Approved, show WhatsApp link */}
//         {status === "confirmed" && whatsappLink && (
//           <div className="text-center py-10 space-y-5">
//             <div className="text-5xl">🎉</div>
//             <h2 className="text-2xl font-bold text-white">
//               You are Approved!
//             </h2>
//             <p className="text-slate-400">
//               Welcome to Creative India School.
//             </p>
//             <a
//               href={whatsappLink}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-block px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition"
//             >
//               Join WhatsApp Group
//             </a>
          
//             <p className="text-sm text-slate-400">
//               {whatsappMessage}
//             </p>
//           </div>
//         )}

//   
