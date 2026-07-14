import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Input } from '../../components/ui/input.js';
import { Button } from '../../components/ui/button.js';
import { RiMovie2Line } from 'react-icons/ri';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await login(email, password);
      const state = location.state as { from?: string } | null;
      const from = state?.from || '/home';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { message?: string };
      setErrorMsg(axiosError.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 overflow-hidden">
      {/* Background radial gradients for dynamic look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_45%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(219,39,119,0.1),transparent_40%)]"></div>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff11_1px,#00091d_1px)] bg-[size:20px_20px]"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold tracking-wider text-white">
            <RiMovie2Line className="w-9 h-9 text-indigo-500 animate-pulse" />
            <span>
              FILM<span className="text-indigo-500">LANE</span>
            </span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Your personal cinema library navigator</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-800 text-red-200 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Your Email Address
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={submitting}
                className="bg-gray-950/80 border-gray-800 focus:border-indigo-500 text-white placeholder-gray-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={submitting}
                className="bg-gray-950/80 border-gray-800 focus:border-indigo-500 text-white placeholder-gray-600"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded bg-gray-950 border-gray-800 text-indigo-600 focus:ring-indigo-500/20 mr-2 h-4 w-4"
                />
                Remember me
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <p className="text-sm font-light text-gray-400 text-center mt-4">
              Don’t have an account yet?{' '}
              <Link to="/register" className="font-semibold text-indigo-400 hover:underline hover:text-indigo-300">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;