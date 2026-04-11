import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

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
  const pollRef = useRef(null);

  const price = type === "full" ? "45,000" : "20,000";

  useEffect(() => {
    if (!enrollmentId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/enrollments/payment-status/${enrollmentId}`
        );
        const data = await res.json();
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
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("course", form.course);
      data.append("payment_type", type);
      data.append("screenshot", form.file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments/payment-submit`,
        { method: "POST", body: data }
      );
      const result = await res.json();
      setEnrollmentId(result.enrollment_id);
      setStatus("pending");
    } catch (err) {
      alert("Something went wrong. Please try again.");
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

        {/* STEP 1 — Payment Form */}
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
                className="w-full p-3 rounded bg-black/50 border border-white/10 text-white"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 rounded bg-black/50 border border-white/10 text-white"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <select
                className="w-full p-3 rounded bg-black/50 border border-white/10 text-white"
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                <option>Houdini Animation</option>
                <option>After Effects</option>
                <option>Nuke Compositing</option>
                <option>Photoshop</option>
              </select>

              <div className="text-center text-xl font-bold text-violet-400">
                Rs. {price}
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">
                  Upload Payment Screenshot
                </p>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full text-sm text-slate-400"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Payment"}
              </button>

            </form>
          </div>
        )}

        {/* STEP 2 — Waiting for Approval */}
        {enrollmentId && status === "pending" && (
          <div className="text-center py-10 space-y-5">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">
              Payment Submitted!
            </h2>
            <p className="text-slate-400">
              Our team is reviewing your payment.
            </p>
            <p className="text-slate-400">
              This page will update automatically once approved.
            </p>
            <p className="text-xs text-slate-600">
              Please keep this page open.
            </p>
          </div>
        )}

        {/* STEP 3 — Approved, show WhatsApp link */}
        {status === "confirmed" && whatsappLink && (
          <div className="text-center py-10 space-y-5">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-white">
              You are Approved!
            </h2>
            <p className="text-slate-400">
              Welcome to Creative India School.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition"
            >
              Join WhatsApp Group
            </a>
          
            <p className="text-sm text-slate-400">
              {whatsappMessage}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}






















// // Add this import at top
// import { enrollApi } from "../api/client";
// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";

// export default function PaymentPanel() {
//   const [params] = useSearchParams();
//   const type = params.get("type");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     course: "Houdini Animation",
//     file: null,
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const price = type === "full" ? "₹45,000" : "₹20,000";

//   // Replace the entire handleSubmit function with this
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.file) {
//       alert("Please upload payment screenshot");
//       return;
//     }
//     setLoading(true);
//     try {
//       const data = new FormData();
//       data.append("name", form.name);
//       data.append("email", form.email);
//       data.append("course", form.course);
//       data.append("payment_type", type); // "full" or "partial"
//       data.append("screenshot", form.file);
//       await enrollApi.submitPayment(data);
//       setSubmitted(true);
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

//         <div className="flex flex-col items-center mb-6">
//           <img
//             src="/photos/qr.jpeg"
//             alt="UPI QR"
//             className="w-48 h-48 object-contain rounded-lg"
//           />
//           <p className="text-sm text-slate-400 mt-2 text-center">
//             Scan and pay using any UPI app
//           </p>
//         </div>

//         {submitted ? (
//           <div className="text-center py-10 space-y-4">
//             <p className="text-4xl">✅</p>
//             <h2 className="text-xl font-bold text-white">Payment Submitted!</h2>
//             <p className="text-slate-400">
//               Our team will review and send you a WhatsApp link shortly.
//             </p>
//         </div>
//         ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//           type="text"
//           placeholder="Full Name"
//           required
//           className="w-full p-3 rounded bg-black/50 border border-white/10"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <input
//               type="email"
//               placeholder="Email"
//               required
//               className="w-full p-3 rounded bg-black/50 border border-white/10"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//             />
//             <select
//             className="w-full p-3 rounded bg-black/50 border border-white/10"
//             value={form.course}
//             onChange={(e) => setForm({ ...form, course: e.target.value })}
//             >
//               <option>Houdini Animation</option>
//               <option>After Effects</option>
//               <option>Nuke Compositing</option>
//               <option>Photoshop</option>
//               </select>
//               <div className="text-center text-xl font-bold text-violet-400">
//                 {price}
                
//                 </div>
//                 <input
//                 type="file"
//                 required
//                 className="w-full text-sm"
//                 onChange={(e) =>
//                   setForm({ ...form, file: e.target.files?.[0] || null })
//                 }
//                 />

//             <button type="submit" disabled={loading}
//             className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition">
//               {loading ? "Submitting..." : "Submit Payment"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

























