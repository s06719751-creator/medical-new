import React from 'react';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { Check, Award, AlertCircle, Sparkles } from 'lucide-react';

interface PricingProps {
  onTabChange: (tab: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onTabChange }) => {
  const { plans } = useDb();

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background blurs */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-0 left-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <Award className="w-3.5 h-3.5" />
          Platform Membership
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Flexible Care Memberships
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Select a subscription level tailored to your long-term preventative health requirements. Active tiers unlock secure clinical report analysis, priority triage, and virtual consult credits.
        </p>
      </div>

      {/* Plans Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-start">
        {plans.map((tier) => (
          <GlowingCard
            key={tier.id}
            glowColor={tier.isPopular ? 'purple' : 'none'}
            className={`flex flex-col p-8 relative rounded-3xl ${
              tier.isPopular 
                ? 'border-purple-500/40 bg-purple-950/5 ring-1 ring-purple-500/20 shadow-[0_0_35px_-5px_rgba(168,85,247,0.15)] md:scale-105' 
                : 'border-white/5'
            }`}
          >
            {/* Popular ribbon */}
            {tier.isPopular && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 border border-purple-400/20 text-[9px] font-bold text-white uppercase tracking-widest font-mono flex items-center gap-1 shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                Popular Plan
              </div>
            )}

            <div className="flex flex-col gap-1 text-left">
              <span className="text-slate-100 font-extrabold text-lg">{tier.name}</span>
              <div className="flex items-baseline gap-1 mt-2.5 mb-1.5">
                <span className="text-3xl font-black text-white font-mono">${tier.price}</span>
                <span className="text-xs text-slate-400 font-mono">/ {tier.period === 'forever' ? 'one-time' : tier.period}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                {tier.name === 'Basic Care' 
                  ? 'Essential tools to observe physical symptoms and start baseline data calendars.' 
                  : tier.name === 'Smart Health Plus'
                  ? 'Advanced diagnostics and automated interpretation charts for active wellness support.'
                  : 'Total preventative care and physician consulting credits for premium longevity.'}
              </p>
            </div>

            {/* Feature lists */}
            <div className="flex-grow border-t border-white/5 pt-6 my-6 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 font-mono block mb-4">Features Included</span>
              <ul className="space-y-3 text-xs text-slate-400">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <button
              onClick={() => onTabChange('book-appointment')}
              className={`w-full py-3 rounded-xl text-xs font-extrabold tracking-wider transition-all select-none uppercase font-mono ${
                tier.isPopular
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {tier.ctaText}
            </button>
          </GlowingCard>
        ))}
      </div>

      {/* Triage Notice Info Box */}
      <div className="glass-panel rounded-2xl p-4 max-w-xl mx-auto border-white/5 bg-slate-950/20 text-center flex items-center justify-center gap-3">
        <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
        <span className="text-xs text-slate-400 font-medium">
          Note: Consultation fees are covered under Smart Health and Premium credits, and can be refunded up to 12 hours prior to schedules.
        </span>
      </div>
    </div>
  );
};
