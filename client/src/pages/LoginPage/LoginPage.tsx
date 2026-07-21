import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Input } from '../../components/ui/input.js';
import { Button } from '../../components/ui/button.js';
import { api } from '../../services/api.js';
import {
  RiMovie2Line,
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldCheckLine,
  RiFilmLine,
  RiArrowRightLine,
} from 'react-icons/ri';

interface FeaturedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [featured, setFeatured] = useState<FeaturedMovie[]>([]);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const response = await api.get('/discover/movie', { params: { sortBy: 'popularity.desc', page: 1 } });
        const results = response.data?.results || response.data || [];
        setFeatured(results.slice(0, 4));
      } catch (e) {
        console.error('Failed to fetch login backdrop posters', e);
      }
    };
    fetchPosters();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      await login(email, password);
      const state = location.state as { from?: string } | null;
      const from = state?.from || '/home';
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setErrorMsg(msg);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const extracted: Record<string, string> = {};
        for (const key in errors) {
          extracted[key] = errors[key].msg;
        }
        setFieldErrors(extracted);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 overflow-hidden text-white select-none">
      {/* VIBRANT AMBIENT GLOW & MOTION BACKDROP */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/35 to-purple-600/25 rounded-full blur-[140px] animate-orb1" />
        <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-gradient-to-tl from-pink-600/30 to-rose-600/20 rounded-full blur-[150px] animate-orb2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[160px] animate-glow-pulse" />
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />
      </div>

      {/* SPLIT / CARD CONTAINER */}
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT DISPLAY PANEL (Desktop Feature Showcase) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
          <div className="space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 text-3xl font-extrabold tracking-wider text-white group">
              <div className="p-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
                <RiMovie2Line className="w-7 h-7 text-indigo-400" />
              </div>
              <span>
                FILM<span className="text-indigo-500">LANE</span>
              </span>
            </Link>
            <p className="text-xl font-bold text-gray-200 leading-tight">
              Welcome back to your ultimate streaming universe.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Log in to sync your watch history, access personalized watchlists, and stream in ultra-high resolution across devices.
            </p>
          </div>

          {/* Floating Poster Cards Fan */}
          <div className="relative w-full h-44 flex items-center justify-center my-2">
            {featured.map((movie, idx) => {
              const offset = idx - 1.5;
              const rotateDeg = offset * 10;
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
                  className="absolute w-28 aspect-[2/3] rounded-xl overflow-hidden border border-indigo-500/40 shadow-2xl transition-all duration-300 hover:scale-110 hover:!z-30 hover:!rotate-0"
                >
                  <img src={posterUrl} alt="" className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <RiFilmLine className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Multi-Server Streams</p>
                <p className="text-[10px] text-gray-400">Fast 1080p / 4K Servers</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <RiShieldCheckLine className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant Watch History</p>
                <p className="text-[10px] text-gray-400">Synced Across Devices</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT / MAIN LOGIN FORM CARD */}
        <div className="col-span-1 lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile Brand Header */}
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-white">
              <RiMovie2Line className="w-7 h-7 text-indigo-500" />
              <span>
                FILM<span className="text-indigo-500">LANE</span>
              </span>
            </Link>
            <p className="text-gray-400 mt-1 text-xs">Your personal cinema library navigator</p>
          </div>

          {/* Glassmorphic Form Card */}
          <div className="bg-slate-900/75 backdrop-blur-2xl border border-slate-800/90 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-left">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to FilmLane</h2>
              <p className="text-xs text-gray-400">Enter your credentials to access your account</p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800/80 text-red-200 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
                <span className="font-bold text-red-400">✕</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
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
                    className={`bg-slate-950/80 text-white pl-10 pr-4 py-3 text-sm rounded-xl transition-all ${
                      fieldErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                  <RiMailLine className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
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
                    placeholder="••••••••"
                    required
                    disabled={submitting}
                    className={`bg-slate-950/80 text-white pl-10 pr-10 py-3 text-sm rounded-xl transition-all ${
                      fieldErrors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                  <RiLockPasswordLine className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500/20 mr-2 h-4 w-4 cursor-pointer"
                  />
                  Remember me
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <RiArrowRightLine className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-gray-400">
                Don’t have an account?{' '}
                <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LoginPage;