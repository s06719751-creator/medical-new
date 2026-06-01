import React from 'react';
import { GlowingCard } from '../components/GlowingCard';
import { User, Sparkles, BrainCircuit, UserCheck, ShieldCheck, Activity } from 'lucide-react';

interface HowItWorksProps {
  onTabChange: (tab: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onTabChange }) => {
  const steps = [
    {
      step: 1,
      title: "Create Your Health Profile",
      description: "Sign up and establish your continuous health baseline profile. Input physical indicators, cardiovascular records, age variables, and lifestyle baselines.",
      icon: <User className="w-6 h-6 text-purple-400" />
    },
    {
      step: 2,
      title: "Ask AI or Upload Reports",
      description: "Consult the 24/7 digital care bot about sudden symptoms, or upload standard blood charts and scans for automatic explanation parser review.",
      icon: <BrainCircuit className="w-6 h-6 text-cyan-400" />
    },
    {
      step: 3,
      title: "Get Personalized Insights",
      description: "Receive dynamic triage observation scores categorizing indicators into safe green tiers or warning yellow clinical recommendations.",
      icon: <Sparkles className="w-6 h-6 text-fuchsia-400" />
    },
    {
      step: 4,
      title: "Consult Verified Doctors",
      description: "Directly match with certified specialist physicians. Share diagnostic briefs, select schedules, and open secure video calls.",
      icon: <UserCheck className="w-6 h-6 text-indigo-400" />
    },
    {
      step: 5,
      title: "Track Your Health Journey",
      description: "Access your dashboard to verify appointment logs, capsules calendar schedules, new diagnostics, and sleep efficiency reports.",
      icon: <Activity className="w-6 h-6 text-emerald-400" />
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background blurs */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-10 left-1/3" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Clinical Framework Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          The Medora Care Framework
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Five intuitive steps designed to elevate diagnostics precision, eliminate clinical waiting times, and keep you securely connected to physician answers.
        </p>
      </div>

      {/* Steps Timeline Wrapper */}
      <div className="relative space-y-8 pl-8 border-l border-white/5 max-w-2xl mx-auto">
        {/* Glow indicator line */}
        <div className="absolute left-[-1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-purple-500 via-fuchsia-500 to-cyan-400 pointer-events-none" />

        {steps.map((item) => (
          <div key={item.step} className="relative">
            {/* Circular Step Badge Marker */}
            <div className="absolute left-[-42px] top-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.4)]">
              <div className="w-full h-full bg-[#030014] rounded-full flex items-center justify-center text-[10px] font-black text-white font-mono">
                {item.step}
              </div>
            </div>

            <GlowingCard 
              className="p-6 text-left flex gap-4 items-start border-white/5"
              glowColor={item.step % 2 === 0 ? 'blue' : 'purple'}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-grow space-y-1">
                <h3 className="font-bold text-slate-100 text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </GlowingCard>
          </div>
        ))}
      </div>

      {/* Call To Action Box */}
      <div className="glass-panel border-purple-500/15 rounded-3xl p-8 max-w-2xl mx-auto mt-16 text-center bg-purple-950/5 relative overflow-hidden">
        <h3 className="font-extrabold text-white text-lg mb-2">Ready to Start Your Assessment?</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-md mx-auto">
          Establish your profile baseline today, upload test pdfs, or initiate secure video consult bookings with board specialists.
        </p>
        <button
          onClick={() => onTabChange('book-appointment')}
          className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all active:scale-95"
        >
          Book Initial Consultation
        </button>
      </div>
    </div>
  );
};
