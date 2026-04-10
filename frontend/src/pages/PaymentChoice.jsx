import { useNavigate } from "react-router-dom";

export default function PaymentChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center">
        Choose Your Payment Plan
      </h1>

      <div className="flex flex-col md:flex-row gap-6">

        {/* FULL PAYMENT */}
        <button
          onClick={() => navigate("/payment?type=full")}
          className="px-10 py-6 bg-violet-600 hover:bg-violet-500 rounded-2xl text-xl font-bold transition hover:scale-105"
        >
          Pay ₹45,000 (Full)
        </button>

        {/* PARTIAL PAYMENT */}
        <button
          onClick={() => navigate("/payment?type=partial")}
          className="px-10 py-6 border border-white/20 hover:border-violet-500 rounded-2xl text-xl font-bold transition hover:scale-105"
        >
          Pay ₹20,000 Now
          <div className="text-sm text-slate-400 mt-2">
            Remaining ₹25,000 later
          </div>
        </button>

      </div>

    </div>
  );
}