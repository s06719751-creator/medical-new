import React from 'react';
import { ShieldAlert, Award, Shield, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      title: "Clinical Accuracy First",
      desc: "Our neural graphs are continuously trained against double-blind peer-reviewed medical data frameworks to guarantee diagnostic precision.",
      icon: <Shield className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "Patient Secrecy (HIPPA)",
      desc: "All health profiles, scan details, and consult records are strictly locked inside cryptographically encrypted databases using Row Level Security.",
      icon: <ShieldAlert className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Expedited Doctor Matching",
      desc: "No general practice bottlenecks. We bridge patient triage profiles directly to matching certified specialist physician schedules.",
      icon: <Award className="w-5 h-5 text-fuchsia-400" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background glow spot */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-0 left-10" />

      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <Heart className="w-3.5 h-3.5" />
          Platform Science
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Empowering Health Longevity <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Through Medical AI
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Medora AI was established in 2026 by a joint coalition of bio-medical AI architects, board physicians, and digital security engineers. Our mission is to democratize preventive diagnostics, remove clinical bottlenecks, and calibrate personal health baselines.
        </p>
      </div>

      {/* Philosophy cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {values.map((item, i) => (
          <div 
            key={i}
            className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Transparency Segment */}
      <div className="glass-panel border-white/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row gap-10 items-center">
        <div className="flex-grow space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Scientific Principles</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Medora AI operates on transparent medical logic. All diagnostic triage runs through trained classifiers before offering guidance. We strictly reject third-party advertisement cookies on health logs and compile detailed clinical summaries that users can export to their personal local healthcare databases at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
