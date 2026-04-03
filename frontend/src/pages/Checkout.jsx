import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lock, Award, RefreshCw, Star } from "lucide-react";
import gsap from "gsap";

const PLANS = {
    starter: { name: "Starter", emoji: "🎯", monthly: 4999, yearly: 3999 },
    pro: { name: "Pro", emoji: "⚡", monthly: 12999, yearly: 9999 },
    master: { name: "Master", emoji: "👑", monthly: 24999, yearly: 19999 }
};

const COURSES = {
    "FLIP & River Simulation": ["River Simulation / Meshing / Render"],
    "Pyro": ["Realistic Fire"],
    "Vellum": ["Cloth Working"],
    "POP": ["POP Fireworks"],
    "RBD": ["Building Destruction"],
    "Nuke": ["ACES Workflow"]
};

export default function Checkout() {
    const [searchParams] = useSearchParams();

    const containerRef = useRef();
    const priceRef = useRef();

    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [billing, setBilling] = useState("monthly");

    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    const [category, setCategory] = useState("");
    const [course, setCourse] = useState("");

    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", gender: "" });
    const [errors, setErrors] = useState({});

    const [couponOpen, setCouponOpen] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const plan = searchParams.get("plan") || "pro";
        const bill = searchParams.get("billing") || "monthly";
        setSelectedPlan(plan);
        setBilling(bill);
    }, [searchParams]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
                else return { hours: 23, minutes: 59, seconds: 59 };
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // GSAP ENTRY ANIMATION
    useEffect(() => {
        gsap.from(containerRef.current.children, {
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out"
        });
    }, []);

    const plan = PLANS[selectedPlan];

    let basePrice = billing === "monthly" ? plan.monthly : plan.yearly;

    if (couponApplied) basePrice = Math.round(basePrice * 0.9);

    const gst = Math.round(basePrice * 0.18);
    const total = basePrice + gst;

    // PRICE ANIMATION
    useEffect(() => {
        if (!priceRef.current) return;
        gsap.fromTo(priceRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4 }
        );
    }, [billing, couponApplied]);

    const validate = () => {
        const e = {};
        if (!form.firstName) e.firstName = "Required";
        if (!form.lastName) e.lastName = "Required";
        if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        if (!form.phone || form.phone.length < 10) e.phone = "Invalid phone";
        if (!category) e.category = "Required";
        if (!course) e.course = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    return (
        <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "Nunito" }}>
            <Navbar />

            <div style={{ paddingTop: "140px", textAlign: "center" }}>
                <p style={{ color: "var(--accent)", letterSpacing: "0.2em" }}>SECURE CHECKOUT</p>
                <h1 style={{ fontFamily: "Bebas Neue", fontSize: "3rem" }}>Complete Your Enrollment</h1>
                <p style={{ color: "var(--muted)" }}>You are one step away from mastering Houdini.</p>
            </div>

            <div ref={containerRef} style={{ display: "flex", gap: "2rem", padding: "2rem", flexWrap: "wrap" }}>

                <div style={{ flex: "1 1 60%" }}>
                    <div style={card}>
                        <h2>{plan.emoji} {plan.name}</h2>

                        <select value={billing} onChange={e => setBilling(e.target.value)} style={input}>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>

                        <h3 ref={priceRef}>₹{basePrice}</h3>

                        <p>Offer ends in: {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S</p>
                    </div>

                    <div style={card}>
                        <h3>Select Your Course</h3>
                        <select style={input} onChange={e => setCategory(e.target.value)}>
                            <option value="">Category</option>
                            {Object.keys(COURSES).map(c => <option key={c}>{c}</option>)}
                        </select>

                        {category && (
                            <select style={input} onChange={e => setCourse(e.target.value)}>
                                {COURSES[category].map(c => <option key={c}>{c}</option>)}
                            </select>
                        )}
                    </div>
                </div>

                <div style={{ flex: "1 1 35%" }}>
                    <div style={card}>
                        <h3>Order Summary</h3>
                        <p ref={priceRef}>₹{total}</p>

                        <div style={payBtn} onClick={() => {
                            if (!validate()) return;
                            alert("Payment gateway coming soon! We will contact you.");
                        }}>
                            PROCEED TO PAYMENT →
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

const card = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "1.5rem"
};

const input = {
    width: "100%",
    marginBottom: "1rem",
    padding: "0.8rem",
    background: "#0f0f17",
    border: "1px solid var(--border)",
    color: "var(--text)"
};

const payBtn = {
    width: "100%",
    background: "var(--accent)",
    padding: "1rem",
    marginTop: "1rem",
    textAlign: "center",
    cursor: "pointer",
    borderRadius: "6px",
    color: "white",
    fontFamily: "Bebas Neue",
    letterSpacing: "0.1em"
};
