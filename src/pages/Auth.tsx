import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlowingCard } from '../components/GlowingCard';
import { Lock, Mail, User, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const { signIn, signUp, isDemo } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      setError('Please complete all inputs.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await signIn(email, password);
        if (res.success) {
          onSuccess();
        } else {
          setError(res.error || 'Authentication credentials rejected.');
        }
      } else {
        const res = await signUp(email, password, fullName);
        if (res.success) {
          setSuccessMsg('Profile created! Logging in...');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setError(res.error || 'Failed creating credentials.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Network auth error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'patient') => {
    setLoading(true);
    setError('');
    
    const testEmail = role === 'admin' ? 'admin@medora.ai' : 'patient@medora.ai';
    const testPass = role === 'admin' ? (isDemo ? 'admin' : 'adminPassword123') : 'patient';
    
    try {
      const res = await signIn(testEmail, testPass);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Quick credentials failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Auth failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-16 text-left animate-[fadeIn_0.4s_ease-out]">
      {/* Glow ambient background spot */}
      <div className="glow-spot w-[250px] h-[250px] bg-purple-900/10 top-1/4 left-1/3 -z-10" />

      <GlowingCard glowColor="purple" className="p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mx-auto mb-3">
            <Lock className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none mb-2">
            {isLogin ? 'Access Clinical Portal' : 'Register Health Account'}
          </h2>
          <p className="text-slate-400 text-xs">
            {isLogin ? 'Enter credentials to access dashboards & schedules.' : 'Establish your preventative health monitoring profile.'}
          </p>
        </div>

        {/* Form Submission */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Evelyn Vance"
                  className="w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="physician@domain.com"
                className="w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider">Secure Access Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-panel rounded-xl pl-10 pr-10 py-2.5 text-slate-800 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-rose-400 text-xs font-semibold font-mono">
              ✕ {error}
            </p>
          )}

          {successMsg && (
            <div className="glass-panel border-emerald-500/20 rounded-xl p-3.5 bg-emerald-950/10 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-semibold font-mono text-xs">
                ✓ {successMsg}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 select-none active:scale-[0.98] cursor-pointer"
          >
            {loading ? 'Processing...' : isLogin ? 'Authenticate Access' : 'Create Profile'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <span className="relative px-3 text-[10px] text-slate-500 font-mono bg-[#05041a] uppercase select-none">Quick Demonstration Logins</span>
        </div>

        {/* Quick Review Login Buttons */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => handleQuickLogin('patient')}
            disabled={loading}
            className="py-2.5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 text-purple-300 bg-purple-500/5 hover:bg-purple-500/10 transition-colors font-semibold font-mono flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Patient demo
          </button>
          
          <button
            onClick={() => handleQuickLogin('admin')}
            disabled={loading}
            className="py-2.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 transition-colors font-semibold font-mono flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin demo
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <div className="text-center mt-6">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-slate-400 hover:text-purple-400 transition-colors font-medium cursor-pointer"
          >
            {isLogin ? "Don't have a health account? Register" : 'Already established profile? Login'}
          </button>
        </div>
      </GlowingCard>
    </div>
  );
};
