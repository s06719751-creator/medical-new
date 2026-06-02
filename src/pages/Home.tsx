import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import {
  Heart, Sparkles, Activity, ShieldCheck, ChevronRight, MessageSquare,
  Star, HelpCircle, ChevronDown, Calendar, BrainCircuit,
  FileText, UserCheck, Clock, ShieldAlert, Zap, TrendingUp,
  Award, CheckCircle2, ArrowRight
} from 'lucide-react';
import heroImg from '../assets/hero_medical.png';

const CountUpStat: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 1500
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

interface HomeProps {
  onTabChange: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onTabChange }) => {
  const { settings, features, doctors, faqs } = useDb();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const activeDoctors = doctors.filter(d => d.status === 'active').slice(0, 3);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'BrainCircuit': return <BrainCircuit className="w-6 h-6 text-teal-500" />;
      case 'FileText': return <FileText className="w-6 h-6 text-emerald-500" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-sky-500" />;
      case 'Clock': return <Clock className="w-6 h-6 text-teal-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-emerald-400" />;
      default: return <ShieldAlert className="w-6 h-6 text-teal-500" />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none overflow-x-hidden">

      {/* =====================================================================
          1. HERO SECTION
          ===================================================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 min-h-[92vh] flex items-center">

        {/* Background decorative elements */}
        <div className="absolute inset-0 tech-dot-grid opacity-30" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-sky-400/8 rounded-full blur-[80px]" />

        {/* Animated teal rings */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-teal-500/10 animate-[spin_30s_linear_infinite]" />
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-emerald-400/15 animate-[spin_20s_linear_infinite_reverse]" />

        {/* Ambient floating bubbles */}
        <div className="absolute top-[20%] left-[10%] w-4 h-4 rounded-full bg-teal-300/20 blur-[1px] animate-float-bubble" />
        <div className="absolute top-[60%] left-[15%] w-6 h-6 rounded-full bg-emerald-300/10 blur-[2px] animate-float-bubble delay-200" />
        <div className="absolute top-[40%] right-[30%] w-3.5 h-3.5 rounded-full bg-sky-300/25 blur-[1px] animate-float-bubble delay-300" />
        <div className="absolute bottom-[20%] right-[10%] w-5 h-5 rounded-full bg-teal-300/15 blur-[2px] animate-float-bubble delay-100" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full">

          {/* LEFT — Content */}
          <div className="flex flex-col gap-8 animate-[slideUp_0.8s_ease-out]">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-teal-100 text-xs font-semibold uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5 relative z-10" />
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>AI-Powered Clinical Intelligence Platform</span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.04] font-sans">
                Your Health,{' '}
                <span className="relative">
                  <span className="text-shimmer">Intelligently</span>
                </span>
                <br />
                <span className="text-teal-300">Protected.</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg text-teal-100/80 leading-relaxed max-w-lg">
              {settings.heroSubtitle || 'Medora AI combines real-time diagnostics, board-certified physicians, and predictive health analytics into one seamless platform.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onTabChange('book-appointment')}
                className="px-8 py-4 rounded-2xl text-sm font-bold text-teal-900 bg-white hover:bg-teal-50 shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {settings.heroCtaText || 'Book Free Consultation'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const chatTrigger = document.querySelector('button[class*="fixed bottom-6 right-6"]');
                  if (chatTrigger) (chatTrigger as HTMLButtonElement).click();
                }}
                className="px-8 py-4 rounded-2xl text-sm font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-95 duration-300"
              >
                <MessageSquare className="w-4 h-4 text-teal-300" />
                Talk to AI Doctor
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                500+ Doctors
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                24/7 AI Support
              </div>
            </div>
          </div>

          {/* RIGHT — Hero Visual */}
          <div className="relative flex items-center justify-center">
            {/* Main hero image */}
            <div className="relative w-full max-w-[520px] animate-[floatSlow_7s_ease-in-out_infinite]">
              <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-white/10">
                <img
                  src={heroImg}
                  alt="Medora AI — Clinical Health Intelligence"
                  className="w-full h-auto object-cover rounded-3xl"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent rounded-3xl" />
              </div>

              {/* HUD Overlay Card: Heart Rate */}
              <div className="absolute top-[6%] left-[-14%] bg-white/95 backdrop-blur-md neon-border-purple rounded-2xl p-3.5 shadow-xl flex items-center gap-3 hud-card-interactive select-none animate-float-medium">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0">
                  <Heart className="w-4.5 h-4.5 text-rose-500 animate-[pulse_0.75s_infinite]" />
                </div>
                <div className="font-mono text-left">
                  <span className="text-[9px] text-slate-400 block leading-tight uppercase tracking-wider">Heart Rate</span>
                  <span className="text-sm font-black text-slate-800">72 <span className="text-[10px] text-rose-400 font-medium">bpm</span></span>
                </div>
                <svg className="w-14 h-7 text-rose-400 shrink-0 opacity-90" viewBox="0 0 100 30" fill="none">
                  <path d="M0 15 L30 15 L35 5 L40 25 L45 15 L50 15 L80 15 L85 5 L90 25 L95 15 L100 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ecg-animate" />
                </svg>
              </div>

              {/* HUD Overlay Card: AI Diagnosis */}
              <div className="absolute top-[42%] right-[-14%] bg-white/95 backdrop-blur-md neon-border-cyan rounded-2xl p-3.5 shadow-xl flex items-center gap-3 hud-card-interactive select-none animate-float-slow delay-200">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0">
                  <BrainCircuit className="w-4.5 h-4.5 text-teal-600 animate-pulse" />
                </div>
                <div className="font-mono text-left">
                  <span className="text-[9px] text-slate-400 block leading-tight uppercase tracking-wider">AI Analysis</span>
                  <span className="text-sm font-black text-slate-800 text-teal-700">98.4%</span>
                </div>
              </div>

              {/* HUD Overlay Card: Health Score */}
              <div className="absolute bottom-[6%] left-[-10%] bg-white/95 backdrop-blur-md neon-border-magenta rounded-2xl p-3.5 shadow-xl flex items-center gap-3 hud-card-interactive select-none animate-float-medium delay-400">
                <div className="relative w-9 h-9 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-teal-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-teal-500" strokeDasharray="92, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black font-mono text-teal-700">92</span>
                </div>
                <div className="font-mono text-left">
                  <span className="text-[9px] text-slate-400 block leading-tight uppercase tracking-wider">Health Score</span>
                  <span className="text-sm font-black text-emerald-600">EXCELLENT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,50 C360,80 1080,20 1440,50 L1440,80 L0,80 Z" fill="#f0fdfa"/>
          </svg>
        </div>
      </section>

      {/* =====================================================================
          2. STATS BAR
          ===================================================================== */}
      <section className="w-full bg-white border-b border-teal-100 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { end: 100, suffix: 'K+', label: 'Happy Patients', icon: <Heart className="w-5 h-5 text-rose-400" /> },
            { end: 98, suffix: '%', label: 'Satisfaction Rate', icon: <Star className="w-5 h-5 text-amber-400" /> },
            { end: 500, suffix: '+', label: 'Expert Doctors', icon: <UserCheck className="w-5 h-5 text-teal-500" /> },
            { end: 24, suffix: '/7', label: 'AI Support', icon: <Zap className="w-5 h-5 text-emerald-500" /> },
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 ${i > 0 ? 'border-l border-teal-100' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-black font-mono bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                <CountUpStat end={stat.end} suffix={stat.suffix} />
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. FEATURES GRID
          ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full teal-badge text-xs font-bold uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Clinical Technology
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-teal-900 mb-5 leading-tight">
            Built for the Future of{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">Healthcare</span>
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Medora AI fuses continuous diagnostics, automatic EHR summaries, and digital specialist queues to safeguard your longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, 6).map((feat, i) => (
            <GlowingCard
              key={feat.id}
              glowColor={i % 3 === 0 ? 'teal' : i % 3 === 1 ? 'emerald' : 'sky'}
              className="p-7 text-left flex flex-col items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                {getFeatureIcon(feat.iconName)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </GlowingCard>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. AI EXPERIENCE SECTION
          ===================================================================== */}
      <section className="w-full bg-gradient-to-br from-teal-50 via-white to-emerald-50 border-y border-teal-100 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left — Visual Card */}
          <div className="lg:col-span-5 relative">
            <GlowingCard glowColor="teal" className="w-full p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-teal-100 pb-4">
                <div>
                  <span className="text-xs font-bold font-mono text-teal-600 uppercase tracking-widest">Live Care Synthesis</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping absolute" />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full relative" />
                    <span className="text-[10px] text-emerald-600 font-semibold">Active Monitoring</span>
                  </div>
                </div>
                <Activity className="w-6 h-6 text-teal-500 animate-pulse" />
              </div>

              <div className="space-y-5">
                {[
                  { label: 'AI Diagnostic Confidence', value: '94.6%', width: '94.6', color: 'bg-teal-500' },
                  { label: 'Physician Match Correlation', value: '99.1%', width: '99.1', color: 'bg-emerald-500' },
                  { label: 'Recovery Prediction Score', value: '87.3%', width: '87.3', color: 'bg-sky-500' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-500">{metric.label}</span>
                      <span className="text-teal-700 font-bold font-mono">{metric.value}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-teal-50 overflow-hidden border border-teal-100">
                      <div className={`h-full ${metric.color} rounded-full transition-all`} style={{ width: `${metric.width}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl text-xs text-teal-700 leading-relaxed font-mono">
                ✦ Active Triage: Symptom metrics analyzed. Recommended specialty: Internal Medicine & Cardiology.
              </div>
            </GlowingCard>
          </div>

          {/* Right — Content */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full teal-badge text-xs font-bold uppercase tracking-widest w-fit">
              <TrendingUp className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="text-4xl font-black text-teal-900 leading-tight">
              How Medora AI Transforms<br />
              <span className="text-shimmer">Your Health Experience</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              By merging high-speed AI diagnostic models with direct human expert access, we completely eliminate patient triage friction. No more vague search results or week-long wait times.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-teal-600" />, title: 'HIPAA Compliant & Secure', desc: 'Your data is sealed with AES-256 encryption and zero-knowledge architecture.', bg: 'bg-teal-50', border: 'border-teal-100' },
                { icon: <UserCheck className="w-5 h-5 text-emerald-600" />, title: 'Board-Certified Doctors', desc: 'Direct access to verified specialists in cardiology, neurology, and internal medicine.', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { icon: <BrainCircuit className="w-5 h-5 text-sky-600" />, title: 'GPT-4 Powered AI', desc: 'Restricted strictly to medical guidance — accurate, safe, and evidence-based answers.', bg: 'bg-sky-50', border: 'border-sky-100' },
                { icon: <Award className="w-5 h-5 text-teal-600" />, title: 'Longevity Optimized', desc: 'Predictive algorithms monitor 40+ biomarkers to identify risks before they arise.', bg: 'bg-teal-50', border: 'border-teal-100' },
              ].map((item, i) => (
                <div key={i} className={`flex gap-3 p-4 rounded-2xl ${item.bg} border ${item.border}`}>
                  <div className={`w-10 h-10 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onTabChange('how-it-works')}
              className="mt-2 text-sm font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1.5 group transition-colors w-fit"
            >
              Explore our clinical science
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. DOCTORS SHOWCASE
          ===================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full teal-badge text-xs font-bold uppercase tracking-widest mb-4">
              <UserCheck className="w-3.5 h-3.5" />
              Expert Team
            </div>
            <h2 className="text-4xl font-black text-teal-900">Meet Our Certified Specialists</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">Consult verified practitioners across neurology, cardiology, and internal diagnostics.</p>
          </div>
          <button
            onClick={() => onTabChange('doctors')}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-teal-700 border border-teal-200 hover:border-teal-400 hover:bg-teal-50 transition-all shrink-0"
          >
            Browse All Specialists →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDoctors.map((doc) => (
            <GlowingCard key={doc.id} className="flex flex-col p-0 overflow-hidden" glowColor="teal">
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-teal-50">
                <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-500" />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-teal-100 text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                  {doc.specialization}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-teal-900 text-base">{doc.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    {doc.rating.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-teal-50 pt-3">
                  <span>Experience: <strong className="text-slate-600">{doc.experience}</strong></span>
                  <span>Fee: <strong className="text-teal-600">${doc.consultationFee}</strong></span>
                </div>
                <button
                  onClick={() => onTabChange('book-appointment')}
                  className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Consultation
                </button>
              </div>
            </GlowingCard>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. FAQ SECTION
          ===================================================================== */}
      <section className="w-full bg-gradient-to-b from-white to-teal-50 border-t border-teal-100 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full teal-badge text-xs font-bold uppercase tracking-widest mb-5">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-4xl font-black text-teal-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm">Answers about clinical safety, privacy compliance, and how to get started.</p>
          </div>

          <div className="space-y-3">
            {faqs.slice(0, 5).map((faq) => (
              <div key={faq.id} className="bg-white border border-teal-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 flex items-center justify-between text-left text-sm font-semibold text-teal-900 hover:text-teal-700 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-teal-400 transition-transform shrink-0 ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === faq.id && (
                  <div className="px-5 pb-5 pt-1 border-t border-teal-50 text-sm text-slate-500 leading-relaxed animate-[slideIn_0.2s_ease-out]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. CTA SECTION
          ===================================================================== */}
      <section className="w-full px-6 py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700 p-12 text-center shadow-[0_25px_60px_rgba(13,148,136,0.3)]">
            {/* Background decoration */}
            <div className="absolute inset-0 tech-dot-grid opacity-20" />
            <div className="absolute top-[-20%] right-[-5%] w-[350px] h-[350px] bg-white/5 rounded-full blur-[60px]" />
            <div className="absolute bottom-[-20%] left-[-5%] w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-teal-100 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Start Your Journey
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                Take Control of Your<br />
                <span className="text-teal-200">Longevity Today</span>
              </h2>
              <p className="text-teal-100 text-base leading-relaxed max-w-2xl mx-auto mb-10">
                Access automated diagnostics, personalized health plans, and expert consultations to prevent health risks before they arise.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => onTabChange('book-appointment')}
                  className="px-10 py-4 rounded-2xl text-sm font-bold text-teal-800 bg-white hover:bg-teal-50 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Free Consultation
                </button>
                <button
                  onClick={() => onTabChange('contact')}
                  className="px-10 py-4 rounded-2xl text-sm font-semibold text-white border border-white/25 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Contact Our Team
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
