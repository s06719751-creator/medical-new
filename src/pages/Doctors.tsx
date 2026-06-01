import React, { useState } from 'react';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { Search, Filter, Star, Calendar, ShieldAlert, Award, Clock, ArrowRight } from 'lucide-react';

interface DoctorsProps {
  onTabChange: (tab: string) => void;
}

export const Doctors: React.FC<DoctorsProps> = ({ onTabChange }) => {
  const { doctors } = useDb();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  const specialties = ['All', 'Neurology & AI Diagnostics', 'Cardiology & Preventative Care', 'Internal Medicine & Triage', 'Pediatrics & Developmental Health'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
    
    return doc.status === 'active' && matchesSearch && matchesSpecialty;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background glow spot */}
      <div className="glow-spot w-[350px] h-[350px] bg-purple-900/10 top-0 right-10" />

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <Award className="w-3.5 h-3.5" />
          Verified Clinical Team
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Meet Our Certified <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Medical Specialists
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Consult directly with verified board-certified practitioners. All our doctors operate in conjunction with Medora’s AI diagnostics graphs to maximize medical precision.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor names, specialties..."
            className="w-full glass-panel rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Specialty selection */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                selectedSpecialty === spec 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'glass-panel text-slate-400 hover:text-slate-200 border-white/10 hover:bg-white/5'
              }`}
            >
              {spec === 'All' ? 'All Specializations' : spec.split(' & ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <GlowingCard 
              key={doc.id}
              className="flex flex-col p-0 overflow-hidden relative"
              glowColor="purple"
            >
              {/* Doctor image frame */}
              <div className="w-full aspect-[4/3] bg-slate-900 relative overflow-hidden">
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg glass-panel border-white/10 text-[9px] font-bold text-cyan-300 tracking-wider uppercase font-mono">
                  {doc.specialization}
                </div>
              </div>

              {/* Doctor details */}
              <div className="p-6 text-left flex flex-col gap-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-100 text-base">{doc.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>{doc.rating.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Verified specialist operating under joint digital check queues. Available for video telehealth consults.
                </p>

                {/* Info parameters */}
                <div className="flex flex-col gap-2 border-t border-b border-white/5 py-4 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Clinical Experience:</span>
                    <strong className="text-slate-200">{doc.experience}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultation Pricing:</span>
                    <strong className="text-purple-400">${doc.consultationFee} / session</strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Availability:
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[160px]">
                      {doc.availability.map((day) => (
                        <span key={day} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-semibold text-slate-300 uppercase tracking-wide border border-white/5">{day.substr(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Trigger */}
                <button
                  onClick={() => onTabChange('book-appointment')}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] group"
                >
                  <Calendar className="w-4 h-4" />
                  Request Booking slot
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </GlowingCard>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto border-white/5 flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-bold text-white">No Physicians Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            There are no medical team members matching your search query or specialty selection. Adjust your tags and filters.
          </p>
        </div>
      )}
    </div>
  );
};
