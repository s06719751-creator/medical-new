import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { AnimatedBody } from '../components/AnimatedBody';
import { GlowingCard } from '../components/GlowingCard';
import { 
  Heart, Sparkles, Activity, ShieldCheck, ChevronRight, MessageSquare, 
  Star, HelpCircle, ChevronDown, Calendar, BrainCircuit, 
  FileText, UserCheck, Clock, ShieldAlert
} from 'lucide-react';

interface HomeProps {
  onTabChange: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onTabChange }) => {
  const { settings, features, doctors, faqs } = useDb();
  
  // States for FAQs accordion
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const activeDoctors = doctors.filter(d => d.status === 'active').slice(0, 3);
  
  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'BrainCircuit': return <BrainCircuit className="w-6 h-6 text-cyan-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-purple-400" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-fuchsia-400" />;
      case 'Clock': return <Clock className="w-6 h-6 text-indigo-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-pink-400" />;
      default: return <ShieldAlert className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none overflow-x-hidden pb-16">
      
      {/* =====================================================================
          1. HERO SECTION (Neon anatomies, clinical triage HUD)
          ===================================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center tech-dot-grid rounded-3xl border border-white/5 bg-[#030014]/30 my-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glow blur backdrops */}
        <div className="glow-spot w-[450px] h-[450px] bg-purple-900/10 top-[-50px] left-[-50px]" />
        <div className="glow-spot w-[350px] h-[350px] bg-cyan-900/10 bottom-[-50px] right-[-50px]" />

        {/* Hero Left Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-8 text-left z-10 animate-[fadeIn_0.8s_ease-out]">
          {/* Advanced Glass Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-purple-500/30 bg-purple-950/20 text-purple-200 text-xs font-semibold uppercase tracking-widest font-mono shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI-POWERED PREVENTIVE Longevity PLATFORM</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-sans">
            Predictive Clinical Triage
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 text-glow leading-none pt-2">
              Is Formally Here.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl text-glow-subtle">
            {settings.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <button
              onClick={() => onTabChange('book-appointment')}
              className="px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              {settings.heroCtaText}
            </button>
            
            {/* Quick assistant dialog trigger */}
            <button
              onClick={() => {
                const chatTrigger = document.querySelector('button[class*="fixed bottom-6 right-6"]');
                if (chatTrigger) (chatTrigger as HTMLButtonElement).click();
              }}
              className="px-8 py-4 rounded-full text-sm font-bold text-slate-200 hover:text-white glass-panel border-white/10 hover:border-purple-500/30 hover:bg-purple-950/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-95 duration-300"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400 animate-pulse" />
              Talk to AI Assistant
            </button>
          </div>

          {/* Core Capabilities highlights ticker (Replacing the old trust avatars layout) */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xl mt-4 border-t border-white/5 pt-8 z-10 select-none">
            <div className="glass-panel border-purple-500/10 bg-purple-950/5 p-3.5 rounded-2xl flex flex-col items-start gap-1.5 font-mono hover:border-purple-500/30 hover:bg-purple-950/15 transition-all duration-300">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">01. BIOMETRICS</span>
              <span className="text-xs text-slate-300 font-semibold leading-tight">Continuous Triage</span>
            </div>
            <div className="glass-panel border-cyan-500/10 bg-cyan-950/5 p-3.5 rounded-2xl flex flex-col items-start gap-1.5 font-mono hover:border-cyan-500/30 hover:bg-cyan-950/15 transition-all duration-300">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">02. CLINICAL LOGS</span>
              <span className="text-xs text-slate-300 font-semibold leading-tight">Secure EHR Ledger</span>
            </div>
            <div className="glass-panel border-fuchsia-500/10 bg-fuchsia-950/5 p-3.5 rounded-2xl flex flex-col items-start gap-1.5 font-mono hover:border-fuchsia-500/30 hover:bg-fuchsia-950/15 transition-all duration-300">
              <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">03. EXPERTISE</span>
              <span className="text-xs text-slate-300 font-semibold leading-tight">Board Specialists</span>
            </div>
          </div>
        </div>

        {/* Hero Right Visual Column (Unified Biometric HUD Panel) */}
        <div className="lg:col-span-5 relative flex items-center justify-center z-10 py-10">
          {/* Main Anatomical Glowing Body Illustration */}
          <AnimatedBody />

          {/* Dynamic HUD Vitals Overlay */}
          
          {/* Card 1: Pulse Triage (Heart Rate + Live ECG line) */}
          <div className="absolute top-[4%] left-[-8%] glass-panel neon-border-purple rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-center gap-4 hud-card-interactive select-none">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/25 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <Heart className="w-5.5 h-5.5 text-rose-500 animate-[pulse_0.75s_infinite]" />
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block leading-tight">Heart Rate</span>
              <span className="text-base font-black text-white leading-none">72 <span className="text-[10px] text-rose-400 font-medium">bpm</span></span>
            </div>
            {/* Pulsing ECG line sparkline */}
            <svg className="w-16 h-8 text-rose-500 shrink-0 opacity-80" viewBox="0 0 100 30" fill="none">
              <path d="M0 15 L30 15 L35 5 L40 25 L45 15 L50 15 L80 15 L85 5 L90 25 L95 15 L100 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ecg-animate" />
            </svg>
          </div>

          {/* Card 2: Neural Synapse Triage (Dynamic Sine Wave Activity) */}
          <div className="absolute top-[44%] right-[-10%] glass-panel neon-border-cyan rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-center gap-4 hud-card-interactive select-none">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <BrainCircuit className="w-5.5 h-5.5 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block leading-tight">Neural State</span>
              <span className="text-base font-black text-white leading-none">SYNCED</span>
            </div>
            {/* Animated Cyan Neural Wave */}
            <svg className="w-16 h-8 text-cyan-400 shrink-0 overflow-hidden opacity-80" viewBox="0 0 100 30" fill="none">
              <path d="M0 15 Q12.5 5 25 15 T50 15 T75 15 T100 15 T125 15 T150 15 T175 15 T200 15" stroke="currentColor" strokeWidth="2" fill="none" className="wave-animate" />
            </svg>
          </div>

          {/* Card 3: Longevity Index Gauge (Circular SVG progress percentage) */}
          <div className="absolute bottom-[8%] left-[-4%] glass-panel neon-border-magenta rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-center gap-4 hud-card-interactive select-none">
            {/* Circular score gauge */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0 bg-fuchsia-500/5 rounded-full border border-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.15)]">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-fuchsia-500" strokeDasharray="88, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[10px] font-black font-mono text-fuchsia-300">88%</span>
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block leading-tight">Longevity score</span>
              <span className="text-base font-black text-white leading-none">OPTIMIZED</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FEATURE CARDS GRID (Symptom analysis, risk projections)
          ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Futuristic Clinical Technology Features
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Medora AI fuses continuous diagnostics, automatic EHR reports summaries, and digital specialist consult queues to safeguard your longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, 6).map((feat, i) => (
            <GlowingCard 
              key={feat.id}
              glowColor={i % 3 === 0 ? 'purple' : i % 3 === 1 ? 'blue' : 'magenta'}
              className="relative p-7 text-left flex flex-col items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {getFeatureIcon(feat.iconName)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            </GlowingCard>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. TRUST STATS BAR
          ===================================================================== */}
      <section className="w-full bg-[#05041a]/60 border-y border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">100K+</span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold font-mono">Happy Patients</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">98%</span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold font-mono">Satisfaction Rate</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">500+</span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold font-mono">Expert Doctors</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-400">24/7</span>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold font-mono">AI Support</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. AI HEALTHCARE EXPERIENCE SECTION
          ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Graphics */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="absolute w-[240px] h-[240px] bg-cyan-900/10 rounded-full blur-[60px] pointer-events-none -z-10" />
          <GlowingCard glowColor="blue" className="w-full p-8 flex flex-col gap-6 text-left max-w-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">Digital Care Synthesis</span>
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">AI Diagnostic Confidence</span>
                <span className="text-white font-semibold font-mono">94.6%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '94.6%' }} />
              </div>
              
              <div className="flex justify-between items-center text-xs pt-2">
                <span className="text-slate-400">Physician Match Correlation</span>
                <span className="text-white font-semibold font-mono">99.1%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '99.1%' }} />
              </div>
            </div>

            <div className="glass-panel border-cyan-500/10 p-3.5 rounded-xl bg-cyan-950/5 text-xs text-slate-300 leading-relaxed font-mono">
              ★ Active Triage: Symptom metrics filtered. Recommended specialty: Neurology diagnostics.
            </div>
          </GlowingCard>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            How Medora AI Transforms Your Health Experience
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            By merging high-speed diagnostic models with direct human expert access, we completely eliminate patient triage friction. You no longer need to navigate vague, scary search queries or wait weeks for general physician references.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 mt-1">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm mb-1">Secure & HIPPA Compliant</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Your chats and reports are sealed with absolute cryptographic credentials.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 mt-1">
                <UserCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm mb-1">Board-Certified Doctors</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Direct channels to verified active primary care and specialist physicians.</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onTabChange('how-it-works')}
            className="mt-4 text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group transition-colors"
          >
            Learn more about our clinical science
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          5. EXPERT DOCTORS SHOWCASE
          ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-white mb-2">Meet Our Certified Medical Specialists</h2>
            <p className="text-slate-400 text-sm max-w-xl">Consult online with verified practitioners across neurology, cardiology, triage, and internal diagnostics.</p>
          </div>
          <button
            onClick={() => onTabChange('doctors')}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white border border-white/10 hover:border-purple-500/30 hover:bg-purple-950/10 transition-all shrink-0"
          >
            Browse All Specialists
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDoctors.map((doc) => (
            <GlowingCard 
              key={doc.id}
              className="flex flex-col p-0 overflow-hidden relative"
              glowColor="purple"
            >
              {/* Image Frame */}
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-slate-900">
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-500"
                />
                {/* Specialty tag overlay */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg glass-panel border-white/10 text-[10px] font-bold text-purple-300 uppercase tracking-wider font-mono">
                  {doc.specialization}
                </div>
              </div>
              
              {/* Info Frame */}
              <div className="p-5 text-left flex flex-col gap-3 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-base">{doc.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>{doc.rating.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-white/5 pt-3">
                  <span>Experience: <strong className="text-slate-200">{doc.experience}</strong></span>
                  <span>Fee: <strong className="text-purple-400">${doc.consultationFee}</strong></span>
                </div>

                <button
                  onClick={() => onTabChange('book-appointment')}
                  className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 hover:border-transparent text-xs font-bold transition-all mt-2 flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Call slot
                </button>
              </div>
            </GlowingCard>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. FAQ SECTION
          ===================================================================== */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20 border-t border-white/5 text-left">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Answers to critical questions regarding clinical safety, privacy compliance, and doctor reference queues.</p>
        </div>

        <div className="space-y-4">
          {faqs.slice(0, 5).map((faq) => (
            <div 
              key={faq.id}
              className="glass-panel rounded-2xl border-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 flex items-center justify-between text-left text-sm font-semibold text-slate-100 hover:text-white transition-colors gap-4"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                  openFaq === faq.id ? 'transform rotate-180 text-purple-400' : ''
                }`} />
              </button>
              
              {openFaq === faq.id && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs sm:text-sm text-slate-400 leading-relaxed animate-[slideIn_0.25s_ease-out]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7. CONTACT CTA CARD & NEWSLETTER
          ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/40 via-[#0a052e]/90 to-cyan-950/30 p-10 border border-white/10 text-center select-none">
          <div className="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] -top-10 -left-10 pointer-events-none -z-10" />
          <div className="absolute w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[60px] -bottom-10 -right-10 pointer-events-none -z-10" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight font-sans">
            Take Control of Your Longevity Journey Today
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            Access automated diagnostics, custom capsule schedules, and active consultation channels to pre-empt vital risks before they arise.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onTabChange('book-appointment')}
              className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment slot
            </button>
            <button
              onClick={() => onTabChange('contact')}
              className="px-8 py-3.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white glass-panel border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all flex items-center justify-center gap-1"
            >
              Contact Support Channels
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
