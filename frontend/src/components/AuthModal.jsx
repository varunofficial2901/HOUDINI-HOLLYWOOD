import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { login, googleLogin, register } = useAuth();
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-8 shadow-2xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-white text-center uppercase tracking-widest mb-6">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* Google Login — uses GoogleLogin component, gives ID token your backend needs */}
        <div className="mb-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setError('');
              try {
                await googleLogin(credentialResponse.credential);
                onClose();
              } catch {
                setError('Google sign-in failed. Please try again.');
              }
            }}
            onError={() => setError('Google sign-in failed. Please try again.')}
            width="100%"
            text="continue_with"
            shape="rectangular"
            theme="filled_black"
            size="large"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-500 text-sm">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">👤</span>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={set('email')}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={set('firstName')}
                required
                minLength={2}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
              <input
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={set('lastName')}
                required
                minLength={2}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
            </div>

            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set('email')}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-sm transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            <p className="text-center text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}