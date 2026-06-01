import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { GlowingCard } from '../components/GlowingCard';
import { 
  User, Calendar, Clock, Activity, Heart, ShieldAlert, Award, FileText, 
  Trash2, Plus, Check, MessageSquare, Edit2, Upload, Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { appointments, updateAppointmentStatus, getChatHistory } = useDb();

  // Sub-tabs state
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'appointments' | 'reminders' | 'reports' | 'chats'>('profile');

  // Forms state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    heartRate: user?.heartRate || 72,
    healthScore: user?.healthScore || 92,
    sleepQuality: user?.sleepQuality || 75
  });

  // Reminders Checklist state
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Capsule A: Neurology Diagnostics (Morning)', done: false },
    { id: 2, text: 'Capsule B: Heart Preventative Pill (Night)', done: true },
    { id: 3, text: 'Hydration Intake: 3 Liters', done: false }
  ]);
  const [newReminder, setNewReminder] = useState('');

  // Medical Reports state
  const [reports, setReports] = useState([
    { id: 'rep1', name: 'Thyroid Blood Panel scan.pdf', size: '2.4 MB', date: '2026-05-12', status: 'Parsed - normal' },
    { id: 'rep2', name: 'Neurologist EEG summary.pdf', size: '4.1 MB', date: '2026-05-20', status: 'Parsed - observation' }
  ]);
  const [mockFileName, setMockFileName] = useState('');

  const myAppointments = appointments.filter((a) => a.userId === user?.id);
  const myChats = getChatHistory(user ? user.id : 'guest_session');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName) return;
    const ok = await updateProfile({
      fullName: profileForm.fullName,
      heartRate: Number(profileForm.heartRate),
      healthScore: Number(profileForm.healthScore),
      sleepQuality: Number(profileForm.sleepQuality)
    });
    if (ok) setEditingProfile(false);
  };

  const handleCancelAppointment = async (id: string) => {
    await updateAppointmentStatus(id, 'cancelled');
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    setReminders([...reminders, { id: Date.now(), text: newReminder, done: false }]);
    setNewReminder('');
  };

  const handleReportUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockFileName.trim()) return;
    setReports([
      {
        id: 'rep_' + Date.now(),
        name: mockFileName.endsWith('.pdf') ? mockFileName : mockFileName + '.pdf',
        size: '1.8 MB',
        date: new Date().toISOString().split('T')[0],
        status: 'Parsing AI review...'
      },
      ...reports
    ]);
    setMockFileName('');
  };

  if (!user) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 py-16 text-center">
        <GlowingCard glowColor="purple" className="p-8 flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-purple-400 animate-pulse" />
          <h3 className="text-lg font-bold text-white">Login Session Required</h3>
          <p className="text-xs text-slate-400">Please establish your portal login coordinates first to access this dashboard.</p>
        </GlowingCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-left animate-[fadeIn_0.5s_ease-out]">
      {/* Background radial glow */}
      <div className="glow-spot w-[300px] h-[300px] bg-purple-900/10 top-0 left-10" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <img src={user.avatarUrl} alt={user.fullName} className="w-14 h-14 rounded-full border border-purple-500/30 object-cover" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">{user.fullName}</h1>
            <span className="text-xs text-slate-400 font-mono">Patient EHR Coordinates: <strong className="text-purple-400">{user.id}</strong></span>
          </div>
        </div>

        {/* Demo badge indicator */}
        <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-300 font-mono uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          Local Demo Sandbox Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sub-tabs controls */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full text-left px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeSubTab === 'profile' 
                ? 'text-purple-400 bg-purple-500/10 border-l-4 border-purple-500' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            Health Profile
          </button>
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`w-full text-left px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeSubTab === 'appointments' 
                ? 'text-purple-400 bg-purple-500/10 border-l-4 border-purple-500' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4.5 h-4.5" />
            Appointments
            {myAppointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length > 0 && (
              <span className="ml-auto w-2 h-2 bg-purple-400 rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('reminders')}
            className={`w-full text-left px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeSubTab === 'reminders' 
                ? 'text-purple-400 bg-purple-500/10 border-l-4 border-purple-500' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Clock className="w-4.5 h-4.5" />
            Medicine Compliance
          </button>
          <button
            onClick={() => setActiveSubTab('reports')}
            className={`w-full text-left px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeSubTab === 'reports' 
                ? 'text-purple-400 bg-purple-500/10 border-l-4 border-purple-500' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            Medical Reports
          </button>
          <button
            onClick={() => setActiveSubTab('chats')}
            className={`w-full text-left px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 ${
              activeSubTab === 'chats' 
                ? 'text-purple-400 bg-purple-500/10 border-l-4 border-purple-500' 
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            Saved AI Chats
          </button>
        </div>

        {/* Right Active pane */}
        <div className="lg:col-span-9">
          
          {/* Sub-tab 1: Health Profile & metrics updates */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              {/* Metrics cards bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlowingCard glowColor="purple" className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Heart className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-500 block leading-tight">Cardio pulse</span>
                    <span className="text-base font-bold text-white">{user.heartRate} <span className="text-[10px] text-purple-400 font-normal">bpm</span></span>
                  </div>
                </GlowingCard>

                <GlowingCard glowColor="blue" className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-500 block leading-tight">Longevity score</span>
                    <span className="text-base font-bold text-white">{user.healthScore} <span className="text-[10px] text-cyan-400 font-semibold font-sans uppercase">Excellent</span></span>
                  </div>
                </GlowingCard>

                <GlowingCard glowColor="magenta" className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                    <Award className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-500 block leading-tight">Sleep Quality</span>
                    <span className="text-base font-bold text-white">{user.sleepQuality}% <span className="text-[10px] text-fuchsia-400 font-normal">Optimized</span></span>
                  </div>
                </GlowingCard>
              </div>

              {/* Profile Editor */}
              <GlowingCard glowColor="purple" className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-slate-100 text-base">Health Profile Coordinates</h3>
                  <button
                    onClick={() => { setEditingProfile(!editingProfile); setProfileForm({ fullName: user.fullName, heartRate: user.heartRate, healthScore: user.healthScore, sleepQuality: user.sleepQuality }); }}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    {editingProfile ? 'Cancel' : 'Edit profile'}
                  </button>
                </div>

                {editingProfile ? (
                  <form onSubmit={handleProfileSave} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 bg-[#080721]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase">Heart Rate (bpm)</label>
                        <input
                          type="number"
                          value={profileForm.heartRate}
                          onChange={(e) => setProfileForm({ ...profileForm, heartRate: Number(e.target.value) })}
                          className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 bg-[#080721]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase">Health score</label>
                        <input
                          type="number"
                          value={profileForm.healthScore}
                          onChange={(e) => setProfileForm({ ...profileForm, healthScore: Number(e.target.value) })}
                          className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 bg-[#080721]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase">Sleep quality index (%)</label>
                        <input
                          type="number"
                          value={profileForm.sleepQuality}
                          onChange={(e) => setProfileForm({ ...profileForm, sleepQuality: Number(e.target.value) })}
                          className="w-full glass-panel rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50 bg-[#080721]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest font-mono cursor-pointer"
                    >
                      Save details
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm font-mono text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Patient identity:</span>
                      <strong className="text-slate-200">{user.fullName}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">EmailCoordinates:</span>
                      <strong className="text-slate-200">{user.email}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">EHR Sync Status:</span>
                      <strong className="text-cyan-400">ACTIVE & SECURED</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Account Access:</span>
                      <strong className="text-purple-400 capitalize">{user.role}</strong>
                    </div>
                  </div>
                )}
              </GlowingCard>
            </div>
          )}

          {/* Sub-tab 2: Appointments logs list */}
          {activeSubTab === 'appointments' && (
            <GlowingCard glowColor="purple" className="p-8">
              <h3 className="font-extrabold text-slate-100 text-base mb-6">Upcoming Scheduled Slots</h3>
              
              {myAppointments.length > 0 ? (
                <div className="space-y-4">
                  {myAppointments.map((appt) => (
                    <div 
                      key={appt.id}
                      className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/20"
                    >
                      <div className="flex gap-3 text-left">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{appt.doctor ? appt.doctor.name : 'Verified Physician'}</h4>
                          <span className="text-xs text-slate-400 block font-mono mt-1">{appt.date} • {appt.time}</span>
                          {appt.notes && (
                            <span className="text-[10px] text-slate-500 font-mono block mt-1">Note: {appt.notes}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        {/* Status Label */}
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono uppercase tracking-wider ${
                          appt.status === 'confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : appt.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {appt.status}
                        </span>

                        {appt.status === 'pending' && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center gap-3">
                  <ShieldAlert className="w-10 h-10 text-purple-400 animate-pulse" />
                  <p className="text-xs text-slate-400">There are no upcoming scheduled physician video slots in your logs.</p>
                </div>
              )}
            </GlowingCard>
          )}

          {/* Sub-tab 3: Capsule schedules compliance checklist */}
          {activeSubTab === 'reminders' && (
            <GlowingCard glowColor="purple" className="p-8">
              <h3 className="font-extrabold text-slate-100 text-base mb-2">Medicine Reminder Calendars</h3>
              <p className="text-xs text-slate-400 mb-6">Tick off daily capsule schedules or add fresh prescriptions to your tracking calendar.</p>
              
              {/* Add form */}
              <form onSubmit={addReminder} className="flex gap-2 mb-6">
                <input
                  type="text"
                  required
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  placeholder="e.g., Capsule C: Neuro Diagnostics (After Lunch)"
                  className="flex-grow glass-panel rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* List */}
              <div className="space-y-3 text-xs sm:text-sm">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => toggleReminder(rem.id)}
                    className={`glass-panel p-4 rounded-xl border-white/5 flex items-center gap-3 cursor-pointer select-none transition-all ${
                      rem.done ? 'bg-purple-950/5 border-purple-500/10 opacity-60' : 'bg-slate-950/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      rem.done ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/20 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-left font-medium leading-none ${rem.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {rem.text}
                    </span>
                  </div>
                ))}
              </div>
            </GlowingCard>
          )}

          {/* Sub-tab 4: Medical report pdf parsers */}
          {activeSubTab === 'reports' && (
            <GlowingCard glowColor="purple" className="p-8">
              <h3 className="font-extrabold text-slate-100 text-base mb-2">My Electronic Health Records</h3>
              <p className="text-xs text-slate-400 mb-6">Upload blood panels or clinic scans in PDF format. Medora’s AI extracts values automatically.</p>

              {/* Upload simulation form */}
              <form onSubmit={handleReportUpload} className="glass-panel p-5 rounded-2xl border-white/10 mb-8 bg-slate-950/30 flex flex-col sm:flex-row items-center gap-4">
                <Upload className="w-8 h-8 text-cyan-400 shrink-0" />
                <div className="flex-grow w-full text-left">
                  <span className="text-[10px] font-bold font-mono text-slate-500 block mb-1 uppercase">Simulate PDF upload</span>
                  <input
                    type="text"
                    required
                    value={mockFileName}
                    onChange={(e) => setMockFileName(e.target.value)}
                    placeholder="e.g., Blood panel test.pdf"
                    className="w-full glass-panel rounded-xl px-4 py-2 text-xs text-slate-200 bg-[#080721] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 font-mono select-none"
                >
                  Upload & Analyze
                </button>
              </form>

              {/* Reports list */}
              <div className="space-y-4 font-mono text-xs text-left">
                {reports.map((rep) => (
                  <div key={rep.id} className="glass-panel p-4 rounded-xl border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/20">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-slate-200">{rep.name}</h4>
                        <span className="text-[10px] text-slate-500">{rep.size} • Uploaded {rep.date}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider ${
                      rep.status.includes('Parsing') 
                        ? 'text-cyan-400 animate-pulse' 
                        : rep.status.includes('observation')
                        ? 'text-fuchsia-400'
                        : 'text-purple-400'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlowingCard>
          )}

          {/* Sub-tab 5: Chat history records */}
          {activeSubTab === 'chats' && (
            <GlowingCard glowColor="purple" className="p-8">
              <h3 className="font-extrabold text-slate-100 text-base mb-6">Saved AI Chat logs</h3>
              
              {myChats.length > 0 ? (
                <div className="max-h-[360px] overflow-y-auto space-y-4 pr-2">
                  {myChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3.5 rounded-2xl text-xs max-w-[85%] text-left ${
                        chat.sender === 'user' 
                          ? 'bg-purple-600 text-white ml-auto rounded-tr-none' 
                          : 'glass-panel text-slate-200 border-white/5 rounded-tl-none'
                      }`}
                    >
                      <p className="font-sans leading-relaxed">{chat.message}</p>
                      <span className={`text-[8px] font-mono mt-1.5 block ${chat.sender === 'user' ? 'text-purple-300' : 'text-slate-500'}`}>
                        {new Date(chat.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center gap-3">
                  <MessageSquare className="w-10 h-10 text-purple-400 animate-pulse" />
                  <p className="text-xs text-slate-400">There are no archived care chat histories in your account folders.</p>
                </div>
              )}
            </GlowingCard>
          )}

        </div>
      </div>
    </div>
  );
};
