import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';

const Signup = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stylized wave logo
  const LogoSvg = () => (
    <svg className="h-6 w-6 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 70C30 50 40 40 50 65C60 90 75 55 85 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <circle cx="35" cy="40" r="8" fill="currentColor" />
      <circle cx="53" cy="45" r="8" fill="currentColor" />
      <circle cx="72" cy="30" r="8" fill="currentColor" />
      <path d="M10 80C30 85 60 85 80 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, role);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9] px-4 py-12 sm:px-6 lg:px-8 select-none">
      
      <div className="w-full max-w-md space-y-8 glass p-8 rounded border border-[#e2e2e2] shadow-sm bg-white">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-black text-white shadow-sm">
            <LogoSvg />
          </div>
          <h2 className="mt-6 text-center text-xl font-bold text-[#1a1c1c] tracking-tight font-sans">
            CrewFlow
          </h2>
          <span className="text-[10px] text-[#777777] font-semibold tracking-wider uppercase mt-1">
            Create your account
          </span>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#777777]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="glass-input block w-full rounded py-2.5 pl-10 pr-4 text-xs placeholder-[#a0a0a0] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5e5e5e] mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#777777]">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="glass-input block w-full rounded py-2.5 pl-10 pr-4 text-xs placeholder-[#a0a0a0] focus:outline-none"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="rounded border border-[#e2e2e2] bg-[#f9f9f9] p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1a1c1c]">
                <ShieldCheck className="h-3.5 w-3.5" /> Initial System Role
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`rounded py-1.5 text-[10px] font-bold border transition-all uppercase tracking-wider ${
                    role === 'Admin' 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#eeeeee]'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Member')}
                  className={`rounded py-1.5 text-[10px] font-bold border transition-all uppercase tracking-wider ${
                    role === 'Member' 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'border-[#c6c6c6] text-[#5e5e5e] hover:bg-[#eeeeee]'
                  }`}
                >
                  Member
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center btn-black py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#777777]">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-bold text-black hover:underline transition-all"
            >
              Sign in instead
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
