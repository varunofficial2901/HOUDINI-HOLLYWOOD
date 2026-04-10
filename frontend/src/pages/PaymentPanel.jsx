import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentPanel() {
  const [params] = useSearchParams();
  const type = params.get("type");

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "Houdini Animation",
    file: null
  });

  const price = type === "full" ? "₹45,000" : "₹20,000";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.file) {
      alert("Please upload payment screenshot ❌");
      return;
    }

    alert("✅ Payment Submitted! Wait for admin approval.");

    // 👉 WhatsApp link (backend will control later)
    window.location.href = "https://chat.whatsapp.com/IJ6voqFQc4U7y3HwR7kvjl?mode=gi_t";
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur">

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Welcome to Creative India School
        </h1>

        {/* QR CODE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="\photos\qr.jpeg"
            alt="UPI QR"
            className="w-48 h-48 object-contain rounded-lg"
          />
          <p className="text-sm text-slate-400 mt-2 text-center">
            Scan & pay using any UPI app
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 rounded bg-black/50 border border-white/10"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded bg-black/50 border border-white/10"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* COURSE */}
          <select
            className="w-full p-3 rounded bg-black/50 border border-white/10"
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option>Houdini Animation</option>
            <option>After Effects</option>
            <option>Nuke Compositing</option>
            <option>Photoshop</option>
          </select>

          {/* PRICE */}
          <div className="text-center text-xl font-bold text-violet-400">
            {price}
          </div>

          {/* FILE UPLOAD */}
          <input
            type="file"
            required
            className="w-full text-sm"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition"
          >
            Submit Payment
          </button>

        </form>

      </div>
    </div>
  );
}