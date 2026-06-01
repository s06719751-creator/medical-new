import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { Calendar, Clock, UserCheck, ShieldAlert, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface BookAppointmentProps {
  onSuccess: () => void;
}

export const BookAppointment: React.FC<BookAppointmentProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { doctors, createAppointment } = useDb();

  const activeDoctors = doctors.filter(d => d.status === 'active');

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must establish an active login session first.');
      return;
    }
    if (!doctorId || !date || !time) {
      setError('Please select a physician, date, and schedule.');
      return;
    }

    setError('');
    setLoading(true);

    const selectedDoc = activeDoctors.find(d => d.id === doctorId) || null;

    try {
      const ok = await createAppointment({
        userId: user.id,
        userName: user.fullName,
        doctor: selectedDoc,
        date,
        time,
        notes
      });

      if (ok) {
        setSuccess(true);
      } else {
        setError('Database connection error. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Booking submission error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const matchedDoc = activeDoctors.find(d => d.id === doctorId);
    return (
      <div className="w-full max-w-xl mx-auto px-6 py-16 text-center animate-[fadeIn_0.4s_ease-out]">
        <GlowingCard glowColor="purple" className="p-8 flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-[bounce_1s_infinite]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none">Appointment Scheduled!</h2>
            <p className="text-slate-400 text-xs leading-normal">
              Your digital slot has been recorded in our physician diagnostic queue.
            </p>
          </div>

          {/* Details */}
          <div className="w-full glass-panel border-white/5 p-5 rounded-2xl text-left text-xs sm:text-sm font-mono text-slate-300 space-y-3 bg-slate-950/20">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-200">{user?.fullName}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Physician Specialist:</span>
              <strong className="text-slate-200">{matchedDoc?.name}</strong>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Scheduled Date:</span>
              <strong className="text-cyan-300">{date}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Video Schedule Slot:</span>
              <strong className="text-purple-400">{time}</strong>
            </div>
          </div>

          <button
            onClick={onSuccess}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 shadow-lg select-none active:scale-[0.98]"
          >
            Go to User Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </GlowingCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background glow spot */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-1/4 left-1/4 -z-10" />

      {/* Header */}
      <div className="max-w-3xl mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
          <Calendar className="w-3.5 h-3.5" />
          Telehealth Booking Queue
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2 leading-tight">
          Request Diagnostic Schedule
        </h1>
        <p className="text-slate-400 text-xs">
          Select your specialist, date, and schedule. Secure video coordinates will sync directly to your dashboard logs.
        </p>
      </div>

      <GlowingCard glowColor="purple" className="p-8">
        {!user ? (
          <div className="text-center py-6 flex flex-col items-center gap-4">
            <ShieldAlert className="w-10 h-10 text-purple-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">Login Session Required</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please log into your health account first to sync diagnostic calendars and register scheduled physician slots.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            
            {/* Physician Select */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                Select Specialist Physician
              </label>
              <select
                required
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 bg-[#080721] focus:outline-none focus:border-purple-500/50"
              >
                <option value="" className="bg-[#030014] text-slate-500">-- Choose practitioner --</option>
                {activeDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id} className="bg-[#030014] text-slate-200">
                    {doc.name} ({doc.specialization}) — ${doc.consultationFee}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Select Schedule Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                  Select Video Schedule Time
                </label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 bg-[#080721] focus:outline-none focus:border-purple-500/50"
                >
                  <option value="" className="bg-[#030014] text-slate-500">-- Choose time slot --</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot} className="bg-[#030014] text-slate-200">{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Health Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Symptoms / Health Concerns notes (Optional)
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention primary symptoms, onset timelines, cardiovascular logs, or prior clinical details..."
                className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            {error && (
              <p className="text-rose-400 text-xs font-semibold font-mono">
                ✕ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 select-none active:scale-[0.98] cursor-pointer"
            >
              {loading ? 'Transmitting Schedule request...' : 'Transmit Secure Request'}
            </button>

          </form>
        )}
      </GlowingCard>
    </div>
  );
};
