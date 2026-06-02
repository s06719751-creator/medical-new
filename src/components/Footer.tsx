import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Heart } from 'lucide-react';

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
    setTimeout(() => { setEmail(''); setSuccess(false); }, 3000);
  };

  return (
    <footer className="relative w-full border-t border-teal-100 bg-teal-900 pt-16 pb-8 px-6 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-teal-700/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute left-0 top-0 w-[200px] h-[200px] bg-emerald-700/10 rounded-full blur-[70px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div onClick={() => onTabChange('home')} className="flex items-center gap-2 cursor-pointer select-none group w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-400 p-[1px]">
              <div className="w-full h-full bg-teal-900 rounded-[11px] flex items-center justify-center">
                <Heart className="w-4 h-4 text-teal-300" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">{settings.logoText}</span>
          </div>
          <p className="text-sm text-teal-300/80 leading-relaxed max-w-sm">
            Empowering global longevity through predictive diagnostics, real-time health triage, and verified specialist care.
          </p>
          <div className="flex flex-col gap-2 mt-2 text-xs text-teal-400 font-mono">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-sky-400" /><span>{settings.contactEmail}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-teal-400" /><span>{settings.phone}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" /><span className="truncate max-w-[240px]">{settings.address}</span></div>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-sm font-semibold text-teal-200 uppercase tracking-wider mb-5">Platform Services</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-teal-400">
            {[['features', 'AI Symptom Checker'], ['features', 'Report Analysis'], ['doctors', 'Telemedicine Consult'], ['features', 'Wellness Tracking'], ['features', 'Risk Prediction']].map(([tab, label]) => (
              <li key={label}><button onClick={() => onTabChange(tab)} className="hover:text-teal-200 transition-colors">{label}</button></li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-teal-200 uppercase tracking-wider mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-teal-400">
            {[['home', 'Home'], ['how-it-works', 'How It Works'], ['pricing', 'Pricing'], ['blog', 'Resources'], ['about', 'About'], ['contact', 'Contact']].map(([tab, label]) => (
              <li key={label}><button onClick={() => onTabChange(tab)} className="hover:text-teal-200 transition-colors">{label}</button></li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold text-teal-200 uppercase tracking-wider mb-5">Newsletter</h4>
          <p className="text-xs text-teal-400 mb-4 leading-relaxed">Subscribe for bi-weekly medical research digests and health intelligence updates.</p>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-grow bg-teal-800/60 border border-teal-700 rounded-xl px-4 py-2.5 text-xs text-teal-100 placeholder-teal-500 focus:outline-none focus:border-teal-400"
            />
            <button type="submit" className="px-3.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white transition-colors shadow-sm flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {success && <p className="text-[11px] text-emerald-400 mt-2 font-mono">✓ Subscribed successfully!</p>}
          <div className="flex items-center gap-3 mt-5">
            <a href={`https://wa.me/${settings.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-teal-800 border border-teal-700 hover:border-emerald-500 text-teal-400 hover:text-emerald-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto border-t border-teal-800 pt-8 mt-8">
        <div className="bg-teal-800/50 border border-teal-700/50 rounded-xl p-4 mb-6 text-center max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 font-mono">Medical Disclaimer</p>
          <p className="text-xs text-teal-400 leading-relaxed">"Medora AI provides general health information and digital care support. It does not replace diagnosis, treatment, or emergency medical care from licensed professionals."</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-teal-600 font-mono gap-4">
          <span>© {new Date().getFullYear()} Medora AI Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#/privacy" className="hover:text-teal-300">Privacy Policy</a>
            <span>•</span>
            <a href="#/terms" className="hover:text-teal-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
