import { useState } from "react";
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

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const price = type === "full" ? "₹45,000" : "₹20,000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.file) {
      alert("Please upload payment screenshot");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("course", form.course);
      data.append("payment_type", type || "partial");
      data.append("screenshot", form.file);

      await fetch("http://localhost:8000/api/enrollments/payment-submit", {
        method: "POST",
        body: data,
      });

      setSubmitted(true);
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

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-3xl">✅</p>
            <h2 className="text-xl font-bold text-white">Payment Submitted!</h2>
            <p className="text-slate-400">
              Our team will review your payment and send you a WhatsApp link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-3 rounded bg-black/50 border border-white/10"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 rounded bg-black/50 border border-white/10"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <select
              className="w-full p-3 rounded bg-black/50 border border-white/10"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
            >
              <option>Houdini Animation</option>
              <option>After Effects</option>
              <option>Nuke Compositing</option>
              <option>Photoshop</option>
            </select>

            <div className="text-center text-xl font-bold text-violet-400">
              {price}
            </div>

            <input
              type="file"
              required
              className="w-full text-sm"
              onChange={(e) =>
                setForm({ ...form, file: e.target.files?.[0] || null })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

























// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";

// export default function PaymentPanel() {
//   const [params] = useSearchParams();
//   const type = params.get("type");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     course: "Houdini Animation",
//     file: null
//   });

//   const price = type === "full" ? "₹45,000" : "₹20,000";

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.file) {
//       alert("Please upload payment screenshot ❌");
//       return;
//     }

//     const [submitted, setSubmitted] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!form.file) {
//         alert("Please upload payment screenshot");
//         return;
//       }
//       setLoading(true);
//       try {
//         const data = new FormData();
//         data.append("name", form.name);
//         data.append("email", form.email);
//         data.append("course", form.course);
//         data.append("payment_type", type);
//         data.append("screenshot", form.file);
//         await fetch("http://localhost:8000/api/enrollments/payment-submit", {
//           method: "POST",
//           body: data,
//         });
//         setSubmitted(true); 
//       } catch (err) {
//         alert("Something went wrong. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

//       <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur">

//         <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
//           Welcome to Creative India School
//         </h1>
 
//         {/* QR CODE */}
//         <div className="flex flex-col items-center mb-6">
//           <img
//             src="\photos\qr.jpeg"
//             alt="UPI QR"
//             className="w-48 h-48 object-contain rounded-lg"
//           />
//           <p className="text-sm text-slate-400 mt-2 text-center">
//             Scan & pay using any UPI app
//           </p>
//         </div>

//         {/* FORM */}
//         {submitted ? (
//           <div className="text-center py-10 space-y-4">
//             <p className="text-3xl">✅</p>
//             <h2 className="text-xl font-bold text-white">Payment Submitted!</h2>
//             <p className="text-slate-400">
//               Our team will review your payment and send you a WhatsApp link shortly.
//               </p>
//             </div>
//           ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">

//           <input
//             type="text"
//             placeholder="Full Name"
//             required
//             className="w-full p-3 rounded bg-black/50 border border-white/10"
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             required
//             className="w-full p-3 rounded bg-black/50 border border-white/10"
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />

//           {/* COURSE */}
//           <select
//             className="w-full p-3 rounded bg-black/50 border border-white/10"
//             onChange={(e) => setForm({ ...form, course: e.target.value })}
//           >
//             <option>Houdini Animation</option>
//             <option>After Effects</option>
//             <option>Nuke Compositing</option>
//             <option>Photoshop</option>
//           </select>

//           {/* PRICE */}
//           <div className="text-center text-xl font-bold text-violet-400">
//             {price}
//           </div>

//           {/* FILE UPLOAD */}
//           <input
//             type="file"
//             required
//             className="w-full text-sm"
//             onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
//           />

//           {/* SUBMIT */}
//           <button
//             type="submit"
//             className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition"
//           >
//             Submit Payment
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// }