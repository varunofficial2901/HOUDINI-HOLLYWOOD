import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form); // later connect backend

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setForm({ email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 py-16 opacity-0 animate-fadeIn">

      <div className="w-full max-w-xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-slate-400">
            Have a question? We’ll get back to you as soon as possible.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >

          {/* EMAIL */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">
              Email Address
            </label>

            <div className="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-3 bg-black/40 focus-within:border-violet-500 transition">
              <Mail className="w-4 h-4 text-slate-400" />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="bg-transparent outline-none w-full text-white text-sm"
              />
            </div>
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">
              Your Message
            </label>

            <div className="flex gap-2 border border-white/10 rounded-xl px-4 py-3 bg-black/40 focus-within:border-violet-500 transition">
              <MessageSquare className="w-4 h-4 text-slate-400 mt-1" />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Type your question here..."
                className="bg-transparent outline-none w-full text-white text-sm resize-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            Send Message
          </button>

        </form>

      </div>

      {/* SUCCESS POPUP */}
      {submitted && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-black px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
          We will reach you ASAP 🚀
        </div>
      )}

    </div>
  );
}