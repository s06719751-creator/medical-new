import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const { settings } = useDb();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSuccess(true);
    setTimeout(() => {
      setEmail('');
      setSuccess(false);
    }, 3000);
  };

  return (
    <footer className="relative w-full border-t border-white/5 bg-[#030014] pt-16 pb-8 px-6 overflow-hidden">
      {/* Background glow node */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 cursor-pointer select-none group w-fit"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#030014] rounded-[11px] flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21 C16 17 20 14.2 20 10.2 C20 6.2 16.5 4 12 4 C7.5 4 4 6.2 4 10.2 C4 14.2 8 17 12 21 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold text-white">{settings.logoText}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Empowering global longevity through predictive diagnostics, instant health triage models, and verified specialist care networks.
          </p>
          {/* Contact Details */}
          <div className="flex flex-col gap-2 mt-2 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>{settings.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="truncate max-w-[240px]">{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Services & Core Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4 font-sans">Platform Services</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><button onClick={() => onTabChange('features')} className="hover:text-purple-400 transition-colors">AI Symptom Checker</button></li>
            <li><button onClick={() => onTabChange('features')} className="hover:text-purple-400 transition-colors">Report Analysis</button></li>
            <li><button onClick={() => onTabChange('doctors')} className="hover:text-purple-400 transition-colors">Telemedicine Consultation</button></li>
            <li><button onClick={() => onTabChange('features')} className="hover:text-purple-400 transition-colors">Wellness Tracking</button></li>
            <li><button onClick={() => onTabChange('features')} className="hover:text-purple-400 transition-colors">Risk Prediction Graph</button></li>
          </ul>
        </div>

        {/* Navigation Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><button onClick={() => onTabChange('home')} className="hover:text-cyan-400 transition-colors">Home Landing</button></li>
            <li><button onClick={() => onTabChange('how-it-works')} className="hover:text-cyan-400 transition-colors">How It Works</button></li>
            <li><button onClick={() => onTabChange('pricing')} className="hover:text-cyan-400 transition-colors">Membership Pricing</button></li>
            <li><button onClick={() => onTabChange('blog')} className="hover:text-cyan-400 transition-colors">Clinical Resources</button></li>
            <li><button onClick={() => onTabChange('about')} className="hover:text-cyan-400 transition-colors">About Our Science</button></li>
            <li><button onClick={() => onTabChange('contact')} className="hover:text-cyan-400 transition-colors">Get In Touch</button></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Newsletter</h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Subscribe to our bi-weekly medical research digests and predictive diagnostics updates.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clinical@email.com"
              className="flex-grow glass-panel rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors shadow-lg flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {success && (
            <p className="text-[11px] text-emerald-400 mt-2 font-mono">
              ✓ Successfully subscribed to newsletters
            </p>
          )}

          {/* Social Icons row */}
          <div className="flex items-center gap-3 mt-6">
            <a href={`https://wa.me/${settings.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass-panel border-white/5 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Critical Medical Disclaimer Banner inside footer */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 mt-8">
        <div className="glass-panel border-rose-500/20 rounded-xl p-4 bg-rose-950/5 mb-6 text-center max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 font-mono">Medical Disclaimer Notice</p>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            “Medora AI provides general health information and digital care support. It does not replace diagnosis, treatment, or emergency medical care from licensed professionals.”
          </p>
        </div>

        {/* Trademark and Legal terms */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <span>© {new Date().getFullYear()} Medora AI Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#/privacy" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#/terms" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
