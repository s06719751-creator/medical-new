import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck } from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings, createContactMessage } = useDb();
  
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please complete all inputs.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const ok = await createContactMessage(form);
      if (ok) {
        setSuccess(true);
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError('Network submission failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Error occurred during submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background blurs */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-0 left-20" />

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          Contact Support Channels
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Get In Touch With <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Our Triage Team
          </span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed font-sans">
          Have diagnostic questions, membership queries, or developer partnership requests? Drop a message in the secure queue, and our care coordinators will follow up shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact details & Map frame */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlowingCard glowColor="blue" className="p-6 flex flex-col gap-5">
            <h3 className="font-extrabold text-white text-base">Direct Channels</h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-mono">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">General Email Support</span>
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-purple-400 transition-colors">{settings.contactEmail}</a>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Phone Consultation</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-cyan-400 transition-colors">{settings.phone}</a>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-fuchsia-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Physical Headquarters</span>
                  <span className="text-slate-200">{settings.address}</span>
                </div>
              </div>
            </div>
          </GlowingCard>

          {/* Futuristic stylized SVGs Maps representation */}
          <div className="glass-panel rounded-2xl p-2 border-white/5 bg-slate-950/40 relative overflow-hidden select-none">
            <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl opacity-60">
              <g stroke="rgba(124, 58, 237, 0.15)" strokeWidth="0.8">
                {/* Lat/Long Lines */}
                <line x1="0" y1="40" x2="400" y2="40" />
                <line x1="0" y1="80" x2="400" y2="80" />
                <line x1="0" y1="120" x2="400" y2="120" />
                <line x1="0" y1="160" x2="400" y2="160" />
                <line x1="100" y1="0" x2="100" y2="200" />
                <line x1="200" y1="0" x2="200" y2="200" />
                <line x1="300" y1="0" x2="300" y2="200" />
              </g>
              {/* Futuristic Vector Road Graphs */}
              <path d="M50 0 C 120 70, 240 50, 320 200 M350 0 C 300 120, 100 150, 0 100" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" />
              {/* Highlight Target Node */}
              <circle cx="210" cy="80" r="14" fill="rgba(168, 85, 247, 0.25)" className="animate-pulse" />
              <circle cx="210" cy="80" r="4" fill="#a855f7" className="drop-shadow-[0_0_8px_#a855f7]" />
            </svg>
            <div className="absolute top-4 left-4 glass-panel py-1 px-2 rounded border-cyan-400/20 text-[9px] font-mono text-cyan-300">
              HQ RADAR SYNCED
            </div>
          </div>
        </div>

        {/* Contact Form column */}
        <div className="lg:col-span-7">
          <GlowingCard glowColor="purple" className="p-8">
            <h3 className="font-extrabold text-slate-100 text-lg mb-6 flex items-center gap-1.5">
              <Send className="w-5 h-5 text-purple-400" />
              Secure Message Submission
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-semibold font-mono text-[10px] uppercase">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Evelyn Vance"
                    className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-semibold font-mono text-[10px] uppercase">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="evelyn@domain.com"
                    className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 font-semibold font-mono text-[10px] uppercase">Your Clinical / Support Request</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Details of your symptom checking experience, billing issue, or physician matching parameters..."
                  className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              {error && (
                <p className="text-rose-400 text-xs font-semibold font-mono">
                  ✕ {error}
                </p>
              )}

              {success && (
                <div className="glass-panel border-emerald-500/20 rounded-xl p-3.5 bg-emerald-950/10 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-semibold font-mono text-xs">
                    ✓ Request logged in the triage databases!
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 select-none active:scale-[0.98]"
              >
                {loading ? 'Submitting Form...' : 'Transmit Secure Request'}
              </button>
            </form>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};
