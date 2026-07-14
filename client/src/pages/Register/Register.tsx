import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Input } from '../../components/ui/input.js';
import { Button } from '../../components/ui/button.js';
import { RiMovie2Line } from 'react-icons/ri';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic password matches validation
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
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
        setSuccessMsg('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setErrorMsg(axiosError.response?.data?.message || 'Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 overflow-hidden">
      {/* Background radial gradients */}
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

        {/* Register Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-800 text-red-200 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-900/40 border border-emerald-800 text-emerald-200 text-sm rounded-lg">
              {successMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <Input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                required
                disabled={submitting}
                className="bg-gray-950/80 border-gray-800 focus:border-indigo-500 text-white placeholder-gray-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 8 chars)"
                required
                disabled={submitting}
                className="bg-gray-950/80 border-gray-800 focus:border-indigo-500 text-white placeholder-gray-600"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={submitting}
                className="bg-gray-950/80 border-gray-800 focus:border-indigo-500 text-white placeholder-gray-600"
              />
            </div>

            <div className="flex items-start text-sm py-2">
              <label className="flex items-start text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  disabled={submitting}
                  className="rounded bg-gray-950 border-gray-800 text-indigo-600 focus:ring-indigo-500/20 mr-2 mt-0.5 h-4 w-4"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-indigo-400 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-400 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-sm font-light text-gray-400 text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:underline hover:text-indigo-300">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
