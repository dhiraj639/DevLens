import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the terms of service.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Glow shapes */}
      <div className="absolute w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-md glass-card p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Create Account
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Build your professional developer intelligence board
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.mercer@devlens.ai"
                className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-500 font-mono mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4.5 h-4.5 bg-slate-900 border-white/10 rounded-md focus:ring-indigo-500 focus:ring-offset-slate-900 text-indigo-600 focus:ring-2"
              />
            </div>
            <label htmlFor="terms" className="ml-3 text-xs text-slate-400 leading-snug">
              I agree to the <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary rounded-xl py-3.5 text-sm font-bold text-white shadow-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating profile...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
