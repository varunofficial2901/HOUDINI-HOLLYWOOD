/**
 * src/components/Navbar.jsx  ← REPLACE your existing Navbar.jsx
 *
 * Changes from your original:
 *   1. Import useAuth from context
 *   2. Add loginEmail, loginPassword, loginError, loginLoading state
 *   3. Add handleSignIn async function → calls backend login
 *   4. Email input replaces Username input (backend uses email)
 *   5. Sign In button shows loading state
 *   6. Error message shown on wrong credentials
 *   7. When logged in: shows "Hi, {firstName}" + Sign Out button
 *   8. Everything else (scroll hide, animations, mobile menu) unchanged
 */
import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Menu, X, User, Lock, Eye, EyeOff, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   // ← NEW

export default function Navbar() {
  const { user, isAuthenticated, login, logout } = useAuth(); // ← NEW

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── NEW: login form state ─────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError,    setLoginError]    = useState("");
  const [loginLoading,  setLoginLoading]  = useState(false);
  // ─────────────────────────────────────────────────────

  const [isVisible,   setIsVisible]   = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHasScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  // ── NEW: close modal and reset form when it closes ────
  const closeModal = () => {
    setIsModalOpen(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setLoginLoading(false);
  };
  // ─────────────────────────────────────────────────────

  // ── NEW: sign in handler ──────────────────────────────
  const handleSignIn = async (e) => {
    e?.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginError("");
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      closeModal();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setLoginError(
        typeof detail === "string"
          ? detail
          : "Invalid email or password. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────

  const navLinks = [
    { name: "Home",       path: "/" },
    { name: "Courses",    path: "/courses" },
    { name: "Community",  path: "/community" },
    { name: "Enroll Now", path: "/enroll" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 glass ${hasScrolled ? 'shadow-lg shadow-black/20' : ''} ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ transition: 'transform 0.4s ease, box-shadow 0.3s ease' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                <PlayCircle className="w-8 h-8 text-blue-500" />
              </motion.div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
                Creative India School
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop auth button ────────────────────────── */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                /* ── Logged in: show name + sign out ── */
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-300 font-medium">
                    Hi, {user?.first_name} 👋
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                /* ── Not logged in: Sign In button ── */
                <>
                  <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes gradientRotate {
                      0%   { background-position: 0% 50% }
                      50%  { background-position: 100% 50% }
                      100% { background-position: 0% 50% }
                    }
                  `}} />
                  <div
                    className="relative inline-flex rounded-full p-[1.5px] cursor-pointer group transition-transform duration-100 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95 will-change-transform"
                    style={{ background: 'linear-gradient(135deg, var(--accent, #8b5cf6), var(--accent2, #ffbe00))' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundSize = '200% 200%';
                      e.currentTarget.style.animation = 'gradientRotate 2s ease infinite';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundSize = '100% 100%';
                      e.currentTarget.style.animation = 'none';
                    }}
                  >
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-slate-950 rounded-full px-[1.4rem] py-[0.52rem] flex items-center gap-[0.5rem] font-[700] text-[0.8rem] tracking-[0.06em] text-slate-50 transition-colors duration-250 border-none outline-none group-hover:bg-transparent group-hover:text-white cursor-pointer w-full"
                    >
                      <User className="w-[14px] h-[14px] text-violet-500 group-hover:text-white transition-colors duration-250" />
                      Sign In
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* ─────────────────────────────────────────────── */}

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-slate-700/50 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/5 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700/50"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile: show sign in or sign out */}
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-center mt-4 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign Out ({user?.first_name})
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                    className="w-full text-center mt-4 bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Sign In Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>

              {/* Google button (UI only — wire OAuth separately if needed) */}
              <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-medium py-2.5 rounded-lg transition-colors mb-6">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-sm text-slate-400">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* ── NEW: real login form ──────────────────── */}
              <form onSubmit={handleSignIn} className="space-y-4 mb-6">
                {/* Error message */}
                {loginError && (
                  <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                    {loginError}
                  </div>
                )}

                {/* Email (was Username) */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
              {/* ─────────────────────────────────────────── */}

              <p className="text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/enroll"
                  onClick={closeModal}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Enroll Now
                </Link>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
