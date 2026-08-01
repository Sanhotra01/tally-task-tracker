import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2c2416] rounded-2xl mb-4 shadow-lg">
            <BookOpen className="text-[#e8d9b5]" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-[#2c2416] tracking-widest font-serif">TALLY</h1>
          <p className="text-xs text-[#8c7a5e] tracking-widest mt-1 uppercase">A Ledger for the Work You Mean to Do</p>
        </div>

        {/* Card */}
        <div className="bg-[#fdfaf4] border border-[#ddd0b5] rounded-2xl shadow-xl p-8">
          <div className="flex rounded-xl bg-[#ede8dc] p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#2c2416] text-[#e8d9b5] shadow-sm'
                  : 'text-[#6b5c42] hover:text-[#2c2416]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#2c2416] text-[#e8d9b5] shadow-sm'
                  : 'text-[#6b5c42] hover:text-[#2c2416]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6b5c42] tracking-widest uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#ddd0b5] bg-[#fdfaf4] text-[#2c2416] placeholder-[#b8a98a] focus:outline-none focus:ring-2 focus:ring-[#2c2416]/20 focus:border-[#2c2416] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6b5c42] tracking-widest uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#ddd0b5] bg-[#fdfaf4] text-[#2c2416] placeholder-[#b8a98a] focus:outline-none focus:ring-2 focus:ring-[#2c2416]/20 focus:border-[#2c2416] transition-all text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7a5e] hover:text-[#2c2416] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2c2416] text-[#e8d9b5] font-semibold rounded-xl hover:bg-[#3d3020] transition-colors disabled:opacity-60 text-sm tracking-wide"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In to Your Ledger' : 'Open Your Ledger'}
            </button>
          </form>

          <p className="text-center text-xs text-[#8c7a5e] mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#2c2416] font-semibold hover:underline"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-[#a89878] mt-6">Small progress is still progress.</p>
      </div>
    </div>
  );
}
