import React from 'react';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { BrainCircuit, FileText, UserCheck, Clock, Activity, ShieldAlert, Sparkles, Zap, Shield, Microscope } from 'lucide-react';

interface FeaturesProps {
  onTabChange: (tab: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onTabChange }) => {
  const { features } = useDb();

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'BrainCircuit': return <BrainCircuit className="w-8 h-8 text-cyan-400" />;
      case 'FileText': return <FileText className="w-8 h-8 text-purple-400" />;
      case 'UserCheck': return <UserCheck className="w-8 h-8 text-fuchsia-400" />;
      case 'Clock': return <Clock className="w-8 h-8 text-indigo-400" />;
      case 'Activity': return <Activity className="w-8 h-8 text-pink-400" />;
      default: return <ShieldAlert className="w-8 h-8 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background radial glow */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-20 left-10" />

      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <Microscope className="w-3.5 h-3.5" />
          Platform Capabilities
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Futuristic AI Clinical <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Healthcare Diagnostics
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore the clinical frameworks that power Medora AI. Our platform leverages trained diagnostics neural graphs, large language medical parsers, and direct doctor matching keys to pre-empt risk vectors.
        </p>
      </div>

      {/* Core Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feat, i) => (
          <GlowingCard
            key={feat.id}
            glowColor={i % 3 === 0 ? 'purple' : i % 3 === 1 ? 'blue' : 'magenta'}
            className="flex flex-col gap-5 p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              {getFeatureIcon(feat.iconName)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-2.5 flex items-center gap-2">
                {feat.title}
                {i < 2 && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[9px] font-bold font-mono uppercase tracking-wider border border-purple-500/20">
                    AI Core
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          </GlowingCard>
        ))}
      </div>

      {/* Interactive Science Framework Segment */}
      <div className="glass-panel rounded-3xl p-8 lg:p-12 border-white/10 relative overflow-hidden flex flex-col lg:flex-row gap-10 items-center">
        <div className="absolute w-[200px] h-[200px] bg-purple-600/10 rounded-full blur-[60px] top-[-50px] right-[-50px] pointer-events-none -z-10" />
        
        <div className="flex-grow space-y-6 max-w-xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <Zap className="w-4 h-4" />
            Adaptive Triage Science
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Predictive Clinical Risk Projection & Diagnostics
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Unlike commercial health checkers that create alarmist scenarios by matching queries against static databases, Medora utilizes adaptive triage logic. The model factors in biological age, cardiac patterns, genetic baselines, and environmental triggers to provide calibrated observation tags.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel bg-white/5 border-white/10">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              94.6% Diagnostic Match
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel bg-white/5 border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Encrypted EHR Storage
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto shrink-0 flex justify-center">
          <button
            onClick={() => onTabChange('book-appointment')}
            className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform active:scale-95"
          >
            Start Digital Triage Check
          </button>
        </div>
      </div>
    </div>
  );
};
