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
      icon: <User className="w-6 h-6 text-teal-600" />
    },
    {
      step: 2,
      title: "Ask AI or Upload Reports",
      description: "Consult the 24/7 digital care bot about sudden symptoms, or upload standard blood charts and scans for automatic explanation parser review.",
      icon: <BrainCircuit className="w-6 h-6 text-emerald-600" />
    },
    {
      step: 3,
      title: "Get Personalized Insights",
      description: "Receive dynamic triage observation scores categorizing indicators into safe green tiers or warning yellow clinical recommendations.",
      icon: <Sparkles className="w-6 h-6 text-sky-600" />
    },
    {
      step: 4,
      title: "Consult Verified Doctors",
      description: "Directly match with certified specialist physicians. Share diagnostic briefs, select schedules, and open secure video calls.",
      icon: <UserCheck className="w-6 h-6 text-teal-500" />
    },
    {
      step: 5,
      title: "Track Your Health Journey",
      description: "Access your dashboard to verify appointment logs, capsules calendar schedules, new diagnostics, and sleep efficiency reports.",
      icon: <Activity className="w-6 h-6 text-emerald-500" />
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.6s_ease-out]">
      {/* Background blurs */}
      <div className="glow-spot w-[300px] h-[300px] bg-teal-500/5 top-10 left-1/3" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 animate-[slideUp_0.7s_ease-out]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Clinical Framework Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-900 mb-4">
          The Medora Care Framework
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Five intuitive steps designed to elevate diagnostics precision, eliminate clinical waiting times, and keep you securely connected to physician answers.
        </p>
      </div>

      {/* Steps Timeline Wrapper */}
      <div className="relative space-y-8 pl-8 border-l border-teal-100/50 max-w-2xl mx-auto">
        {/* Glow indicator line */}
        <div className="absolute left-[-1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-teal-500 via-emerald-500 to-sky-400 pointer-events-none" />

        {steps.map((item, i) => (
          <div
            key={item.step}
            className={`relative animate-[slideUp_0.6s_ease-out_both] opacity-0 ${
              i === 0 ? 'delay-100' : i === 1 ? 'delay-200' : i === 2 ? 'delay-300' : i === 3 ? 'delay-400' : 'delay-500'
            }`}
          >
            {/* Circular Step Badge Marker */}
            <div className="absolute left-[-42px] top-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 p-[1px] flex items-center justify-center shadow-[0_0_12px_rgba(13,148,136,0.2)]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-black text-teal-800 font-mono">
                {item.step}
              </div>
            </div>

            <GlowingCard 
              className="p-6 text-left flex gap-4 items-start border-teal-100/40"
              glowColor={item.step % 2 === 0 ? 'emerald' : 'teal'}
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50/60 border border-teal-100/80 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-grow space-y-1">
                <h3 className="font-bold text-teal-900 text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </GlowingCard>
          </div>
        ))}
      </div>

      {/* Call To Action Box */}
      <div className="bg-white shadow-[0_10px_40px_rgba(13,148,136,0.06)] border border-teal-100/80 rounded-3xl p-8 max-w-2xl mx-auto mt-16 text-center relative overflow-hidden animate-[slideUp_0.8s_ease-out_both] opacity-0 delay-300">
        <h3 className="font-extrabold text-teal-900 text-lg mb-2">Ready to Start Your Assessment?</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-md mx-auto">
          Establish your profile baseline today, upload test pdfs, or initiate secure video consult bookings with board specialists.
        </p>
        <button
          onClick={() => onTabChange('book-appointment')}
          className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-[0_4px_18px_rgba(13,148,136,0.35)] transition-all active:scale-95 duration-200 cursor-pointer"
        >
          Start Digital Triage Check
        </button>
      </div>
    </div>
  );
};
