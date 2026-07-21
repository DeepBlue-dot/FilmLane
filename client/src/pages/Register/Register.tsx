import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Input } from '../../components/ui/input.js';
import { Button } from '../../components/ui/button.js';
import {
  RiMovie2Line,
  RiUser3Line,
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldCheckLine,
  RiBookmarkLine,
  RiArrowRightLine,
  RiCheckLine,
} from 'react-icons/ri';

interface FeaturedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [featured, setFeatured] = useState<FeaturedMovie[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await api.get('/discover/movie', { params: { sortBy: 'popularity.desc', page: 1 } });
        const results = response.data?.results || response.data || [];
        setFeatured(results.slice(0, 4));
      } catch (e) {
        console.error('Failed to fetch register backdrop posters', e);
      }
    };
    fetchPosters();
  }, []);

  // Compute password strength (0 to 3)
  const getPasswordStrength = (): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-800' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 10) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});

    let hasClientErrors = false;
    const newFieldErrors: Record<string, string> = {};

    if (password.length < 8) {
      newFieldErrors.password = 'Password must be at least 8 characters long';
      hasClientErrors = true;
    }

    if (password !== confirmPassword) {
      newFieldErrors.confirmPassword = 'Passwords do not match';
      hasClientErrors = true;
    }

    if (hasClientErrors) {
      setFieldErrors(newFieldErrors);
      setErrorMsg('Please fix the errors below.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });

      if (response.data?.status === 'success') {
        setSuccessMsg('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setErrorMsg(msg);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const extracted: Record<string, string> = {};
        for (const key in errors) {
          extracted[key] = errors[key].msg;
        }
        setFieldErrors(extracted);
      }
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 overflow-hidden text-white select-none">
      {/* VIBRANT AMBIENT GLOW & MOTION BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/35 to-indigo-600/25 rounded-full blur-[140px] animate-orb1" />
        <div className="absolute -bottom-40 -left-40 w-[650px] h-[650px] bg-gradient-to-tl from-pink-600/30 to-rose-600/20 rounded-full blur-[150px] animate-orb2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[160px] animate-glow-pulse" />
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />
      </div>

      {/* SPLIT / CARD CONTAINER */}
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT DISPLAY PANEL (Desktop Feature Showcase) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
          <div className="space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 text-3xl font-extrabold tracking-wider text-white group">
              <div className="p-2 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 group-hover:scale-105 transition-transform">
                <RiMovie2Line className="w-7 h-7 text-purple-400" />
              </div>
              <span>
                FILM<span className="text-purple-400">LANE</span>
              </span>
            </Link>
            <p className="text-xl font-bold text-gray-200 leading-tight">
              Create your free account and start streaming.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Unlock personalized watchlists, track watched seasons and episodes, and enjoy seamless streaming access across all your devices.
            </p>
          </div>

          {/* Floating Poster Cards Fan */}
          <div className="relative w-full h-44 flex items-center justify-center my-2">
            {featured.map((movie, idx) => {
              const offset = idx - 1.5;
              const rotateDeg = offset * -10;
              const translateX = offset * 42;
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=185&auto=format&fit=crop';

              return (
                <div
                  key={movie.id}
                  style={{
                    transform: `translateX(${translateX}px) rotate(${rotateDeg}deg)`,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  className="absolute w-28 aspect-[2/3] rounded-xl overflow-hidden border border-purple-500/40 shadow-2xl transition-all duration-300 hover:scale-110 hover:!z-30 hover:!rotate-0"
                >
                  <img src={posterUrl} alt="" className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <RiBookmarkLine className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Custom Watchlists</p>
                <p className="text-[10px] text-gray-400">Organize Favorites</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <RiShieldCheckLine className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Free & Safe</p>
                <p className="text-[10px] text-gray-400">No Payment Required</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT / MAIN REGISTER FORM CARD */}
        <div className="col-span-1 lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile Brand Header */}
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-white">
              <RiMovie2Line className="w-7 h-7 text-purple-400" />
              <span>
                FILM<span className="text-purple-400">LANE</span>
              </span>
            </Link>
            <p className="text-gray-400 mt-1 text-xs">Your personal cinema library navigator</p>
          </div>

          {/* Glassmorphic Form Card */}
          <div className="bg-slate-900/75 backdrop-blur-2xl border border-slate-800/90 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-left">
            <div className="mb-5 space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h2>
              <p className="text-xs text-gray-400">Join FilmLane to start building your cinema library</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                <span className="font-bold text-red-400">✕</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
                <RiCheckLine className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) {
                        setFieldErrors((prev) => ({ ...prev, username: undefined }));
                      }
                    }}
                    placeholder="john_doe"
                    required
                    disabled={submitting}
                    className={`bg-slate-950/80 text-white pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all ${
                      fieldErrors.username
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/20'
                    }`}
                  />
                  <RiUser3Line className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                </div>
                {fieldErrors.username && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="name@example.com"
                    required
                    disabled={submitting}
                    className={`bg-slate-950/80 text-white pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all ${
                      fieldErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/20'
                    }`}
                  />
                  <RiMailLine className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="•••••••• (min 8 chars)"
                    required
                    disabled={submitting}
                    className={`bg-slate-950/80 text-white pl-10 pr-10 py-2.5 text-sm rounded-xl transition-all ${
                      fieldErrors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/20'
                    }`}
                  />
                  <RiLockPasswordLine className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1.5 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                    </div>
                    {strength.label && (
                      <p className="text-[10px] text-gray-400 font-medium text-right">
                        Strength: <span className="font-bold text-gray-200">{strength.label}</span>
                      </p>
                    )}
                  </div>
                )}
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    placeholder="••••••••"
                    required
                    disabled={submitting}
                    className={`bg-slate-950/80 text-white pl-10 pr-10 py-2.5 text-sm rounded-xl transition-all ${
                      fieldErrors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/20'
                    }`}
                  />
                  <RiLockPasswordLine className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center text-xs py-1">
                <label className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    disabled={submitting}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500/20 mr-2 h-4 w-4 cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="pt-3 border-t border-slate-800/80 text-center text-xs text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
                  Sign in here
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RegisterPage;
