import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, Lock, Eye, EyeOff, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);

  const { user, isAuthenticated, login, logout, register } = useAuth();

  const [isVisible, setIsVisible] = useState(true);
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSignup(false);
    setShowPassword(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setLoginLoading(false);
    setSignUpData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    });
    setSignUpError("");
    setSignUpLoading(false);
  };

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
      const detail = err?.response?.data?.detail;
      setLoginError(
        typeof detail === "string"
          ? detail
          : "Invalid email or password. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    if (!signUpData.firstName || !signUpData.email || !signUpData.password) {
      setSignUpError("Please fill all required fields.");
      return;
    }
    setSignUpError("");
    setSignUpLoading(true);
    try {
      await register({
        first_name: signUpData.firstName,
        last_name: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        phone: signUpData.phone || null,
      });
      closeModal();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setSignUpError(
        typeof detail === "string"
          ? detail
          : "Sign up failed. Please try again."
      );
    } finally {
      setSignUpLoading(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Community", path: "/community" },
    { name: "Contact Us", path: "/contact" },
    { name: "Enroll Now", path: "/enroll" },  // keeps /enroll for the form page
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 glass ${
          hasScrolled ? "shadow-lg shadow-black/20" : ""
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        style={{ transition: "transform 0.4s ease, box-shadow 0.3s ease" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <img
                  src="/photos/logonew.jpeg"
                  alt="Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
              </motion.div>
              <span className="text-sm sm:text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 truncate">
                Creative India School
              </span>
            </Link>

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

            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer text-white font-bold text-sm select-none">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </div>
                  <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <div className="p-4 text-center border-b border-white/10">
                      <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </div>
                      <p className="text-white font-semibold">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                        @keyframes gradientRotate {
                          0%   { background-position: 0% 50% }
                          50%  { background-position: 100% 50% }
                          100% { background-position: 0% 50% }
                        }
                      `,
                    }}
                  />
                  <div
                    className="relative inline-flex rounded-full p-[1.5px] cursor-pointer group transition-transform duration-100 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95 will-change-transform"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent, #8b5cf6), var(--accent2, #ffbe00))",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundSize = "200% 200%";
                      e.currentTarget.style.animation =
                        "gradientRotate 2s ease infinite";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundSize = "100% 100%";
                      e.currentTarget.style.animation = "none";
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setLoginError("");
                      }}
                      className="bg-slate-950 rounded-full px-[1.4rem] py-[0.52rem] flex items-center gap-[0.5rem] font-[700] text-[0.8rem] tracking-[0.06em] text-slate-50 transition-colors duration-250 border-none outline-none group-hover:bg-transparent group-hover:text-white cursor-pointer w-full"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      <User className="w-[14px] h-[14px] text-violet-500 group-hover:text-white transition-colors duration-250" />
                      Sign In
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-slate-700/50 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
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

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center mt-4 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign Out ({user?.first_name})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsModalOpen(true);
                    }}
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

              <h2 className="text-2xl font-bold text-center mb-6 text-white">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>

              {!isSignup && (
                <>
                  <div
                    ref={(el) => {
                      if (el && window.google) {
                        window.google.accounts.id.initialize({
                          client_id:
                            "632273202115-8t4nelqmq8f2l08meqm81me0gk7894si.apps.googleusercontent.com",
                          callback: async (response) => {
                            try {
                              const { googleAuthApi } = await import("../api/client");
                              const res = await googleAuthApi.login(response.credential);
                              const { access_token, refresh_token, user: u } = res.data;
                              localStorage.setItem("cis_token", access_token);
                              localStorage.setItem("cis_refresh_token", refresh_token);
                              localStorage.setItem("cis_user", JSON.stringify(u));
                              closeModal();
                              window.location.reload();
                            } catch (err) {
                              setLoginError("Google sign-in failed. Please try again.");
                            }
                          },
                        });
                        window.google.accounts.id.renderButton(el, {
                          theme: "outline",
                          size: "large",
                          width: "400",
                          text: "continue_with",
                        });
                      }
                    }}
                    className="mb-6"
                  />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-sm text-slate-400">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                </>
              )}

              {isSignup ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="First Name"
                      value={signUpData.firstName}
                      onChange={(e) =>
                        setSignUpData((p) => ({ ...p, firstName: e.target.value }))
                      }
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                    <input
                      placeholder="Last Name"
                      value={signUpData.lastName}
                      onChange={(e) =>
                        setSignUpData((p) => ({ ...p, lastName: e.target.value }))
                      }
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData((p) => ({ ...p, password: e.target.value }))
                    }
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                  <input
                    placeholder="Phone (optional)"
                    value={signUpData.phone}
                    onChange={(e) =>
                      setSignUpData((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                  {signUpError && (
                    <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                      {signUpError}
                    </div>
                  )}
                  <button
                    onClick={handleSignUp}
                    disabled={signUpLoading}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {signUpLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <p className="text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <button
                      onClick={() => { setIsSignup(false); setSignUpError(""); }}
                      className="text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                  {loginError && (
                    <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
                      {loginError}
                    </div>
                  )}
                  <button
                    onClick={handleSignIn}
                    disabled={loginLoading}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loginLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                  <p className="text-center text-sm text-slate-400">
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => { setIsSignup(true); setLoginError(""); }}
                      className="text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}















// import React, { useState, useEffect, useRef } from "react";
// import { Menu, X, User, Lock, Eye, EyeOff, LogOut } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSignup, setIsSignup] = useState(false);

//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginError, setLoginError] = useState("");
//   const [loginLoading, setLoginLoading] = useState(false);

//   const [signUpData, setSignUpData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phone: "",
//   });
//   const [signUpError, setSignUpError] = useState("");
//   const [signUpLoading, setSignUpLoading] = useState(false);

//   const { user, isAuthenticated, login, logout, register } = useAuth();

//   const [isVisible, setIsVisible] = useState(true);
//   const [hasScrolled, setHasScrolled] = useState(false);
//   const lastScrollY = useRef(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setHasScrolled(currentScrollY > 50);

//       if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
//         setIsVisible(false);
//       } else {
//         setIsVisible(true);
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") closeModal();
//     };

//     if (isModalOpen) {
//       window.addEventListener("keydown", handleEsc);
//     }

//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [isModalOpen]);

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIsSignup(false);
//     setShowPassword(false);

//     setLoginEmail("");
//     setLoginPassword("");
//     setLoginError("");
//     setLoginLoading(false);

//     setSignUpData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       phone: "",
//     });
//     setSignUpError("");
//     setSignUpLoading(false);
//   };

//   const handleSignIn = async (e) => {
//     e?.preventDefault();

//     if (!loginEmail || !loginPassword) {
//       setLoginError("Please enter your email and password.");
//       return;
//     }

//     setLoginError("");
//     setLoginLoading(true);

//     try {
//       await login(loginEmail, loginPassword);
//       closeModal();
//     } catch (err) {
//       const detail = err?.response?.data?.detail;
//       setLoginError(
//         typeof detail === "string"
//           ? detail
//           : "Invalid email or password. Please try again."
//       );
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e?.preventDefault();

//     if (!signUpData.firstName || !signUpData.email || !signUpData.password) {
//       setSignUpError("Please fill all required fields.");
//       return;
//     }

//     setSignUpError("");
//     setSignUpLoading(true);

//     try {
//       await register({
//         first_name: signUpData.firstName,
//         last_name: signUpData.lastName,
//         email: signUpData.email,
//         password: signUpData.password,
//         phone: signUpData.phone || null,
//       });
//       closeModal();
//     } catch (err) {
//       const detail = err?.response?.data?.detail;
//       setSignUpError(
//         typeof detail === "string"
//           ? detail
//           : "Sign up failed. Please try again."
//       );
//     } finally {
//       setSignUpLoading(false);
//     }
//   };

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Courses", path: "/courses" },
//     { name: "Community", path: "/community" },
//     { name: "Contact Us", path: "/contact" },
//     { name: "Enroll Now", path: "/enroll" },
//   ];

//   return (
//     <>
//       <nav
//         className={`fixed w-full z-50 glass ${
//           hasScrolled ? "shadow-lg shadow-black/20" : ""
//         } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
//         style={{ transition: "transform 0.4s ease, box-shadow 0.3s ease" }}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             <Link
//               to="/"
//               className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0"
//             >
//               <motion.div
//                 whileHover={{ rotate: 90 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex-shrink-0"
//               >
//                 <img
//                   src="/photos/logonew.jpeg"
//                   alt="Logo"
//                   className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
//                 />
//               </motion.div>
//               <span className="text-sm sm:text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 truncate">
//                 Creative India School
//               </span>
//             </Link>

//             <div className="hidden md:block">
//               <div className="flex items-baseline space-x-8">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.name}
//                     to={link.path}
//                     className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                   >
//                     {link.name}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             <div className="hidden md:block">
//               {isAuthenticated ? (
//                 <div className="relative group">
//                   <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer text-white font-bold text-sm select-none">
//                     {user?.first_name?.[0]}
//                     {user?.last_name?.[0]}
//                   </div>

//                   <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
//                     <div className="p-4 text-center border-b border-white/10">
//                       <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
//                         {user?.first_name?.[0]}
//                         {user?.last_name?.[0]}
//                       </div>
//                       <p className="text-white font-semibold">
//                         {user?.first_name} {user?.last_name}
//                       </p>
//                       <p className="text-slate-400 text-xs mt-0.5">
//                         {user?.email}
//                       </p>
//                     </div>

//                     <div className="p-2">
//                       <button
//                         onClick={logout}
//                         className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         Sign Out
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <style
//                     dangerouslySetInnerHTML={{
//                       __html: `
//                         @keyframes gradientRotate {
//                           0%   { background-position: 0% 50% }
//                           50%  { background-position: 100% 50% }
//                           100% { background-position: 0% 50% }
//                         }
//                       `,
//                     }}
//                   />
//                   <div
//                     className="relative inline-flex rounded-full p-[1.5px] cursor-pointer group transition-transform duration-100 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95 will-change-transform"
//                     style={{
//                       background:
//                         "linear-gradient(135deg, var(--accent, #8b5cf6), var(--accent2, #ffbe00))",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundSize = "200% 200%";
//                       e.currentTarget.style.animation =
//                         "gradientRotate 2s ease infinite";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundSize = "100% 100%";
//                       e.currentTarget.style.animation = "none";
//                     }}
//                   >
//                     <button
//                       onClick={() => {
//                         setIsModalOpen(true);
//                         setLoginError("");
//                       }}
//                       className="bg-slate-950 rounded-full px-[1.4rem] py-[0.52rem] flex items-center gap-[0.5rem] font-[700] text-[0.8rem] tracking-[0.06em] text-slate-50 transition-colors duration-250 border-none outline-none group-hover:bg-transparent group-hover:text-white cursor-pointer w-full"
//                       style={{ fontFamily: "Arial, sans-serif" }}
//                     >
//                       <User className="w-[14px] h-[14px] text-violet-500 group-hover:text-white transition-colors duration-250" />
//                       Sign In
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-slate-700/50 focus:outline-none"
//               >
//                 {isOpen ? (
//                   <X className="h-6 w-6" />
//                 ) : (
//                   <Menu className="h-6 w-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden glass border-t border-white/5 overflow-hidden"
//             >
//               <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.name}
//                     to={link.path}
//                     onClick={() => setIsOpen(false)}
//                     className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700/50"
//                   >
//                     {link.name}
//                   </Link>
//                 ))}

//                 {isAuthenticated ? (
//                   <button
//                     onClick={() => {
//                       logout();
//                       setIsOpen(false);
//                     }}
//                     className="w-full text-center mt-4 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
//                   >
//                     Sign Out ({user?.first_name})
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setIsOpen(false);
//                       setIsModalOpen(true);
//                     }}
//                     className="w-full text-center mt-4 bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-md font-medium transition-colors"
//                   >
//                     Sign In
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>

//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeModal}
//               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             />

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="relative w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl"
//             >
//               <button
//                 onClick={closeModal}
//                 className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               <h2 className="text-2xl font-bold text-center mb-6 text-white">
//                 {isSignup ? "Create Account" : "Welcome Back"}
//               </h2>

//               {!isSignup && (
//                 <>
//                   <div
//                     ref={(el) => {
//                       if (el && window.google) {
//                         window.google.accounts.id.initialize({
//                           client_id:
//                             "632273202115-8t4nelqmq8f2l08meqm81me0gk7894si.apps.googleusercontent.com",
//                           callback: async (response) => {
//                             try {
//                               const { googleAuthApi } = await import("../api/client");
//                               const res = await googleAuthApi.login(
//                                 response.credential
//                               );
//                               const {
//                                 access_token,
//                                 refresh_token,
//                                 user: u,
//                               } = res.data;

//                               localStorage.setItem("cis_token", access_token);
//                               localStorage.setItem(
//                                 "cis_refresh_token",
//                                 refresh_token
//                               );
//                               localStorage.setItem(
//                                 "cis_user",
//                                 JSON.stringify(u)
//                               );

//                               closeModal();
//                               window.location.reload();
//                             } catch (err) {
//                               setLoginError(
//                                 "Google sign-in failed. Please try again."
//                               );
//                             }
//                           },
//                         });

//                         window.google.accounts.id.renderButton(el, {
//                           theme: "outline",
//                           size: "large",
//                           width: "400",
//                           text: "continue_with",
//                         });
//                       }
//                     }}
//                     className="mb-6"
//                   />

//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="flex-1 h-px bg-white/10" />
//                     <span className="text-sm text-slate-400">or</span>
//                     <div className="flex-1 h-px bg-white/10" />
//                   </div>
//                 </>
//               )}

//               {isSignup ? (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <input
//                       placeholder="First Name"
//                       value={signUpData.firstName}
//                       onChange={(e) =>
//                         setSignUpData((p) => ({
//                           ...p,
//                           firstName: e.target.value,
//                         }))
//                       }
//                       className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
//                     />
//                     <input
//                       placeholder="Last Name"
//                       value={signUpData.lastName}
//                       onChange={(e) =>
//                         setSignUpData((p) => ({
//                           ...p,
//                           lastName: e.target.value,
//                         }))
//                       }
//                       className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
//                     />
//                   </div>

//                   <input
//                     type="email"
//                     placeholder="Email address"
//                     value={signUpData.email}
//                     onChange={(e) =>
//                       setSignUpData((p) => ({ ...p, email: e.target.value }))
//                     }
//                     className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
//                   />

//                   <input
//                     type="password"
//                     placeholder="Password (min 6 characters)"
//                     value={signUpData.password}
//                     onChange={(e) =>
//                       setSignUpData((p) => ({
//                         ...p,
//                         password: e.target.value,
//                       }))
//                     }
//                     className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
//                   />

//                   <input
//                     placeholder="Phone (optional)"
//                     value={signUpData.phone}
//                     onChange={(e) =>
//                       setSignUpData((p) => ({ ...p, phone: e.target.value }))
//                     }
//                     className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500"
//                   />

//                   {signUpError && (
//                     <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
//                       {signUpError}
//                     </div>
//                   )}

//                   <button
//                     onClick={handleSignUp}
//                     disabled={signUpLoading}
//                     className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
//                   >
//                     {signUpLoading ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         Creating Account...
//                       </>
//                     ) : (
//                       "Create Account"
//                     )}
//                   </button>

//                   <p className="text-center text-sm text-slate-400">
//                     Already have an account?{" "}
//                     <button
//                       onClick={() => {
//                         setIsSignup(false);
//                         setSignUpError("");
//                       }}
//                       className="text-violet-400 hover:text-violet-300 transition-colors"
//                     >
//                       Sign In
//                     </button>
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                     <input
//                       type="email"
//                       placeholder="Email address"
//                       value={loginEmail}
//                       onChange={(e) => setLoginEmail(e.target.value)}
//                       className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
//                     />
//                   </div>

//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       value={loginPassword}
//                       onChange={(e) => setLoginPassword(e.target.value)}
//                       className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-4 h-4" />
//                       ) : (
//                         <Eye className="w-4 h-4" />
//                       )}
//                     </button>
//                   </div>

//                   {loginError && (
//                     <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
//                       {loginError}
//                     </div>
//                   )}

//                   <button
//                     onClick={handleSignIn}
//                     disabled={loginLoading}
//                     className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
//                   >
//                     {loginLoading ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         Signing In...
//                       </>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </button>

//                   <p className="text-center text-sm text-slate-400">
//                     Don&apos;t have an account?{" "}
//                     <button
//                       onClick={() => {
//                         setIsSignup(true);
//                         setLoginError("");
//                       }}
//                       className="text-violet-400 hover:text-violet-300 transition-colors"
//                     >
//                       Sign Up
//                     </button>
//                   </p>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


































