/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, no-useless-assignment */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDb } from '../context/DbContext';
import { supabase } from '../services/supabase';
import { GlowingCard } from '../components/GlowingCard';
import type {
  Doctor, BlogPost, FAQ, ChatbotKnowledge, Feature, PricingPlan
} from '../context/DbContext';
import {
  ShieldCheck, ShieldAlert, Settings, Users, Calendar, BookOpen, HelpCircle,
  Plus, Trash2, Edit2, Check, X, Mail, Activity, Layout, Sliders,
  Stethoscope, CreditCard, MessageSquare, Bot, Image, Search, Filter,
  Loader2, LogOut, Copy, ExternalLink, AlertCircle, CheckCircle, AlertTriangle
} from 'lucide-react';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

export const Admin: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const {
    isDemo, settings, updateSettings, doctors, upsertDoctor, deleteDoctor,
    features, upsertFeature, deleteFeature, plans, upsertPlan, deletePlan,
    appointments, updateAppointmentStatus, contactMessages, markContactMessageRead, deleteContactMessage,
    blogs, upsertBlog, deleteBlog, faqs, upsertFAQ, deleteFAQ, knowledge, upsertKnowledge, deleteKnowledge
  } = useDb();

  // SaaS Navigation controller
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Custom Local State for non-core Supabase synced tables (Services, Testimonials, Media bucket, Audits)
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [mediaAssetsList, setMediaAssetsList] = useState<any[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [chatLogsList, setChatLogsList] = useState<any[]>([]);

  // Search, Filters & Local UI state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Self-contained Toast Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (text: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Editing Modals State Managers
  const [editingDoc, setEditingDoc] = useState<Partial<Doctor> | null>(null);
  const [editingFeature, setEditingFeature] = useState<Partial<Feature> | null>(null);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingPlan, setEditingPlan] = useState<Partial<PricingPlan> | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQ> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [editingKnowledge, setEditingKnowledge] = useState<Partial<ChatbotKnowledge> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  // Direct login parameters
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Fetch local sync lists based on tab activations
  const fetchLocalTabRecords = async (tabName: string) => {
    try {
      if (isDemo || !supabase) {
        // DEMO Fallback Local Persisted Store
        if (tabName === 'services') {
          const saved = localStorage.getItem('medora_services');
          setServicesList(saved ? JSON.parse(saved) : [
            { id: 's1', title: 'Cardiology AI Analytics', description: 'Advanced remote ECG and vitals diagnostics.', icon: 'Heart', imageUrl: '', sortOrder: 1, isActive: true },
            { id: 's2', title: 'Neuro-Cognitive Diagnostics', description: 'Brain-aging and early decline warnings.', icon: 'Brain', imageUrl: '', sortOrder: 2, isActive: true },
            { id: 's3', title: 'Genetic Longevity Profiling', description: 'Full genome longevity assessments.', icon: 'Dna', imageUrl: '', sortOrder: 3, isActive: true }
          ]);
        } else if (tabName === 'testimonials') {
          const saved = localStorage.getItem('medora_testimonials');
          setTestimonialsList(saved ? JSON.parse(saved) : [
            { id: 't1', name: 'Cassandra Reynolds', role: 'Venture Partner', message: 'Medora AI caught my micro-thyroid fluctuation six months early.', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', isActive: true },
            { id: 't2', name: 'Jonathan Pierce', role: 'Full-Stack Lead', message: 'Getting cardiologist matching at 2 AM was an absolute game changer.', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', isActive: true }
          ]);
        } else if (tabName === 'media') {
          const saved = localStorage.getItem('medora_media');
          setMediaAssetsList(saved ? JSON.parse(saved) : [
            { id: 'm1', file_name: 'hero_anatomy.png', file_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400', file_type: 'image/png' },
            { id: 'm2', file_name: 'doctor_vance.png', file_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', file_type: 'image/png' }
          ]);
        } else if (tabName === 'chatbot') {
          setChatLogsList([
            { id: 'cl1', message: 'How clinically accurate is Medora AI?', sender: 'user', created_at: new Date(Date.now() - 3600000).toISOString() },
            { id: 'cl2', message: 'The checker utilizes clinical triage protocols developed by physicians, achieving a high 94.6% correlation to initial primary triage recommendations.', sender: 'ai', created_at: new Date(Date.now() - 3590000).toISOString() }
          ]);
        } else if (tabName === 'overview') {
          setAuditLogsList([
            { id: 'a1', action: 'INSERT', table_name: 'doctors', record_id: 'd1', created_at: new Date(Date.now() - 60000).toISOString() },
            { id: 'a2', action: 'UPDATE', table_name: 'site_settings', record_id: 'contact_info', created_at: new Date(Date.now() - 120000).toISOString() }
          ]);
        }
      } else {
        // Active Supabase Cloud Queries
        if (tabName === 'services') {
          const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
          if (!error && data) setServicesList(data);
        } else if (tabName === 'testimonials') {
          const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
          if (!error && data) setTestimonialsList(data);
        } else if (tabName === 'media') {
          const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
          if (!error && data) setMediaAssetsList(data);
        } else if (tabName === 'chatbot') {
          const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: false }).limit(40);
          if (!error && data) setChatLogsList(data);
        } else if (tabName === 'overview') {
          const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
          if (!error && data) setAuditLogsList(data);
        }
      }
    } catch (err) {
      console.error(`Local sync tab error (${tabName}):`, err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchLocalTabRecords(activeTab);
      // Reset filter and search queries on tab switch
      setSearchQuery('');
      setFilterStatus('all');
    }
  }, [activeTab, user]);

  // Handle Supabase Storage upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'doctor' | 'blog' | 'testimonial' | 'media') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validation size (limit 4MB)
    if (file.size > 4 * 1024 * 1024) {
      showToast('File size must be below 4MB', 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      let finalUrl = '';
      if (isDemo || !supabase) {
        // simulated demo upload returning browser local asset
        finalUrl = URL.createObjectURL(file);
        showToast('Demo Image uploaded successfully');
      } else {
        const bucketName = targetField === 'doctor' ? 'doctors' : targetField === 'blog' ? 'blogs' : 'media';
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from(bucketName).upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (error) throw new Error(error.message);

        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        finalUrl = publicUrl;

        // Register media asset record
        await supabase.from('media_assets').insert({
          file_name: file.name,
          file_url: finalUrl,
          file_type: file.type,
          bucket: bucketName,
          uploaded_by: user?.id
        });

        showToast('Image uploaded and registered successfully');
      }

      // Map upload url to editing coordinates
      if (targetField === 'doctor' && editingDoc) {
        setEditingDoc({ ...editingDoc, imageUrl: finalUrl });
      } else if (targetField === 'blog' && editingBlog) {
        setEditingBlog({ ...editingBlog, coverImage: finalUrl });
      } else if (targetField === 'testimonial' && editingTestimonial) {
        setEditingTestimonial({ ...editingTestimonial, imageUrl: finalUrl });
      }

      // Refresh media assets list if media tab is active
      if (activeTab === 'media') {
        fetchLocalTabRecords('media');
      }
    } catch (err: any) {
      showToast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Safe Deletion Coordinator
  const executeDeleteAction = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    let ok = false;
    try {
      if (type === 'doctor') {
        ok = await deleteDoctor(id);
      } else if (type === 'feature') {
        ok = await deleteFeature(id);
      } else if (type === 'blog') {
        ok = await deleteBlog(id);
      } else if (type === 'plan') {
        ok = await deletePlan(id);
      } else if (type === 'faq') {
        ok = await deleteFAQ(id);
      } else if (type === 'knowledge') {
        ok = await deleteKnowledge(id);
      } else if (type === 'contact') {
        ok = await deleteContactMessage(id);
      } else if (type === 'service') {
        const updated = servicesList.filter(s => s.id !== id);
        setServicesList(updated);
        if (isDemo || !supabase) {
          localStorage.setItem('medora_services', JSON.stringify(updated));
          ok = true;
        } else {
          const { error } = await supabase.from('services').delete().eq('id', id);
          ok = !error;
        }
      } else if (type === 'testimonial') {
        const updated = testimonialsList.filter(t => t.id !== id);
        setTestimonialsList(updated);
        if (isDemo || !supabase) {
          localStorage.setItem('medora_testimonials', JSON.stringify(updated));
          ok = true;
        } else {
          const { error } = await supabase.from('testimonials').delete().eq('id', id);
          ok = !error;
        }
      } else if (type === 'media') {
        const updated = mediaAssetsList.filter(m => m.id !== id);
        setMediaAssetsList(updated);
        if (isDemo || !supabase) {
          localStorage.setItem('medora_media', JSON.stringify(updated));
          ok = true;
        } else {
          const { error } = await supabase.from('media_assets').delete().eq('id', id);
          ok = !error;
        }
      }

      if (ok) {
        showToast('Record deleted successfully');
      } else {
        showToast('Deletion failed. Check RLS policies.', 'error');
      }
    } catch (err: any) {
      showToast(`Delete Error: ${err.message}`, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await signIn(authForm.email, authForm.password);
    if (!res.success) {
      setAuthError(res.error || 'Authentication rejected. Email/password mismatch.');
    }
  };

  const handleQuickAdmin = async () => {
    setAuthError('');
    const res = await signIn('admin@medora.ai', 'admin');
    if (!res.success) {
      setAuthError('Quick login failed.');
    }
  };

  // Render Admin Login if session role is not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="w-full max-w-md mx-auto px-6 py-20 text-left animate-[fadeIn_0.4s_ease-out]">
        <GlowingCard glowColor="purple" className="p-8 shadow-2xl relative border-purple-500/10">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mx-auto mb-3 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]">
              <ShieldAlert className="w-7 h-7 text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin SaaS Dashboard</h2>
            <p className="text-xs text-slate-400 mt-1">This console is restricted to authenticated managers.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs sm:text-sm">
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="admin@medora.ai"
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-slate-200 placeholder-slate-500 bg-[#080721]/90 focus:border-purple-500/50 outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-semibold font-mono text-[9px] uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••"
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-slate-200 placeholder-slate-500 bg-[#080721]/90 focus:border-purple-500/50 outline-none transition-colors"
              />
            </div>

            {authError && (
              <p className="text-rose-400 text-xs font-semibold font-mono flex items-center gap-1">✕ {authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold transition-all shadow-lg text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-purple-500/20 hover:scale-[1.01]"
            >
              Verify Credentials
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative px-3 text-[9px] text-slate-500 bg-[#030014] font-mono">Review shortcut</span>
          </div>

          <button
            onClick={handleQuickAdmin}
            className="w-full py-3 rounded-xl border border-purple-500/20 hover:border-purple-500/40 text-purple-300 bg-purple-500/5 hover:bg-purple-500/10 font-bold transition-colors text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Bypass admin login
          </button>
        </GlowingCard>
      </div>
    );
  }

  // Sidebar item configuration
  const sidebarTabs = [
    { id: 'overview', name: 'Dashboard', icon: Activity, group: 'Core' },
    { id: 'appointments', name: 'Appointments', icon: Calendar, group: 'Operations' },
    { id: 'contacts', name: 'Contact Inquiries', icon: Mail, group: 'Operations' },

    { id: 'website_content', name: 'Website Content', icon: Layout, group: 'Content' },
    { id: 'features', name: 'Features Manager', icon: Sliders, group: 'Content' },
    { id: 'services', name: 'Services Manager', icon: Stethoscope, group: 'Content' },
    { id: 'doctors', name: 'Doctors Manager', icon: Users, group: 'Content' },
    { id: 'blogs', name: 'Blog Manager', icon: BookOpen, group: 'Content' },
    { id: 'pricing', name: 'Pricing Manager', icon: CreditCard, group: 'Content' },
    { id: 'faqs', name: 'FAQ Manager', icon: HelpCircle, group: 'Content' },
    { id: 'testimonials', name: 'Testimonials', icon: MessageSquare, group: 'Content' },

    { id: 'chatbot', name: 'Chatbot Manager', icon: Bot, group: 'System' },
    { id: 'media', name: 'Media Library', icon: Image, group: 'System' },
    { id: 'settings', name: 'System Settings', icon: Settings, group: 'System' },
  ];

  // Helper groupings
  const groups = ['Core', 'Operations', 'Content', 'System'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-left animate-[fadeIn_0.5s_ease-out]">

      {/* Top Navigation Bar with Profile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/5 pb-5 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_10px_-2px_rgba(168,85,247,0.4)]">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
              Medora AI SaaS Admin
            </h1>
            <span className="text-[10px] text-slate-400 font-mono">
              Status: {isDemo ? (
                <span className="text-amber-400 font-semibold">✦ Demo Persisted Mode (Offline)</span>
              ) : (
                <span className="text-emerald-400 font-semibold">✦ Supabase Live Active</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 shadow-sm">
            <img
              src={user.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'}
              alt="avatar"
              className="w-6 h-6 rounded-full border border-purple-500/30 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 leading-none">{user.fullName}</span>
              <span className="text-[8px] text-slate-500 font-mono tracking-widest leading-none uppercase mt-0.5">{user.role}</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shadow-md"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main SaaS Sidebar Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

        {/* SIDEBAR */}
        <div className="lg:col-span-3 flex flex-col gap-5 p-4 rounded-2xl glass-panel border-white/5">
          {groups.map(group => (
            <div key={group} className="flex flex-col gap-1 text-left">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono px-3 mb-1.5">{group} Hubs</span>
              <div className="flex flex-col gap-0.5">
                {sidebarTabs
                  .filter(tab => tab.group === group)
                  .map(tab => {
                    const IconComp = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 font-mono cursor-pointer ${isActive
                            ? 'text-purple-400 bg-purple-500/10 font-bold border-l-2 border-purple-500 shadow-sm shadow-purple-500/5'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                      >
                        <IconComp className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                        {tab.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* WORKSPACE AREA */}
        <div className="lg:col-span-9 space-y-6">

          {/* =================================================================== */}
          {/* TAB 1: DASHBOARD TELEMETRY */}
          {/* =================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                <GlowingCard className="p-4 flex flex-col gap-1 border-white/5" glowColor="none">
                  <span className="text-2xl font-black text-white">1,250</span>
                  <span className="text-[8px] uppercase text-slate-500 font-bold tracking-widest">Total Users</span>
                </GlowingCard>
                <GlowingCard className="p-4 flex flex-col gap-1 border-white/5" glowColor="none">
                  <span className="text-2xl font-black text-white">{doctors.length}</span>
                  <span className="text-[8px] uppercase text-slate-500 font-bold tracking-widest">Total Doctors</span>
                </GlowingCard>
                <GlowingCard className="p-4 flex flex-col gap-1 border-white/5 shadow-md shadow-purple-500/5" glowColor="purple">
                  <span className="text-2xl font-black text-white">{appointments.length}</span>
                  <span className="text-[8px] uppercase text-purple-400 font-bold tracking-widest">Bookings</span>
                </GlowingCard>
                <GlowingCard className="p-4 flex flex-col gap-1 border-white/5" glowColor="none">
                  <span className="text-2xl font-black text-white">
                    {appointments.filter(a => a.status === 'pending').length}
                  </span>
                  <span className="text-[8px] uppercase text-slate-500 font-bold tracking-widest">Pending Appts</span>
                </GlowingCard>
              </div>

              {/* Grid with Recent Appointments, Messages & Audits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Recent Bookings Panel */}
                <GlowingCard glowColor="none" className="p-5 border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-400" /> Recent Bookings Queue
                    </h3>
                    <button onClick={() => setActiveTab('appointments')} className="text-[9px] text-purple-400 font-mono uppercase hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {appointments.slice(0, 4).map(appt => (
                      <div key={appt.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-200">{appt.userName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{appt.date} at {appt.time}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${appt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            appt.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                          {appt.status}
                        </span>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-slate-500 text-center text-xs py-6">No recent bookings recorded.</p>
                    )}
                  </div>
                </GlowingCard>

                {/* Recent Inbox Messages */}
                <GlowingCard glowColor="none" className="p-5 border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-purple-400" /> Inbox Feed
                    </h3>
                    <button onClick={() => setActiveTab('contacts')} className="text-[9px] text-purple-400 font-mono uppercase hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {contactMessages.slice(0, 4).map(msg => (
                      <div key={msg.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-200">{msg.name}</p>
                          <span className={`text-[8px] font-bold uppercase ${msg.isRead ? 'text-slate-500' : 'text-purple-400 animate-pulse'}`}>
                            {msg.isRead ? 'read' : 'new'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-1">{msg.message}</p>
                      </div>
                    ))}
                    {contactMessages.length === 0 && (
                      <p className="text-slate-500 text-center text-xs py-6">Inboxes are completely empty.</p>
                    )}
                  </div>
                </GlowingCard>
              </div>

              {/* System Audit Logs */}
              <GlowingCard glowColor="purple" className="p-5 border-white/5">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest flex items-center gap-1.5 mb-4">
                  <Activity className="w-4 h-4 text-purple-400" /> Platform Security System Audit logs
                </h3>
                <div className="w-full bg-[#050414] rounded-xl p-4 font-mono text-[10px] sm:text-xs text-purple-400/90 leading-relaxed border border-white/5 max-h-[200px] overflow-y-auto">
                  {auditLogsList.map(log => (
                    <p key={log.id} className="mb-1 text-slate-400 truncate">
                      <span className="text-slate-500">[{new Date(log.created_at).toLocaleString()}]</span>{' '}
                      <span className="text-purple-400">[{log.action}]</span> table{' '}
                      <span className="text-slate-200 font-bold">{log.table_name}</span> (ID: {log.recordId || log.id})
                    </p>
                  ))}
                  {auditLogsList.length === 0 && (
                    <p className="text-slate-500 italic">No system audit events logged in this session.</p>
                  )}
                </div>
              </GlowingCard>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: WEBSITE CONTENT MANAGER */}
          {/* =================================================================== */}
          {activeTab === 'website_content' && (
            <GlowingCard className="p-6 border-white/5 space-y-6">
              <h2 className="text-sm font-bold font-mono tracking-widest text-slate-200 flex items-center gap-2 border-b border-white/5 pb-3">
                <Layout className="w-4.5 h-4.5 text-purple-400" /> Website Content editor
              </h2>

              <form onSubmit={async (e) => {
                e.preventDefault();
                await updateSettings(settings);
                showToast('Website content configurations updated successfully');
              }} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Hero Title</label>
                    <input
                      type="text"
                      value={settings.heroTitle || ''}
                      onChange={(e) => updateSettings({ heroTitle: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Hero Badge / Highlight Text</label>
                    <input
                      type="text"
                      value={settings.logoText || ''}
                      onChange={(e) => updateSettings({ logoText: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Hero Subtitle</label>
                  <textarea
                    value={settings.heroSubtitle || ''}
                    onChange={(e) => updateSettings({ heroSubtitle: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Primary CTA Text</label>
                    <input
                      type="text"
                      value={settings.heroCtaText || ''}
                      onChange={(e) => updateSettings({ heroCtaText: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">SEO Meta Title</label>
                    <input
                      type="text"
                      value={settings.seoTitle || ''}
                      onChange={(e) => updateSettings({ seoTitle: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Theme Accent Code</label>
                    <select
                      value={settings.themeColor || 'purple'}
                      onChange={(e) => updateSettings({ themeColor: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    >
                      <option value="purple">Futuristic Purple Accent</option>
                      <option value="blue">Electric Blue Accent</option>
                      <option value="magenta">Neon Magenta Accent</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">SEO Meta Description</label>
                  <textarea
                    value={settings.seoDescription || ''}
                    onChange={(e) => updateSettings({ seoDescription: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                  />
                </div>

                <div className="flex justify-end mt-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </GlowingCard>
          )}

          {/* =================================================================== */}
          {/* TAB 3: FEATURES MANAGER */}
          {/* =================================================================== */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={() => setEditingFeature({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Feature
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Sort</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Icon Name</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {features
                      .filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(f => (
                        <tr key={f.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-400">{f.sortOrder}</td>
                          <td className="p-4 font-bold text-white">{f.title}</td>
                          <td className="p-4 text-slate-400 max-w-xs truncate">{f.description}</td>
                          <td className="p-4 font-mono text-[10px] text-purple-400">{f.iconName}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingFeature(f)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'feature', id: f.id, name: f.title })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {features.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No features registered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: SERVICES MANAGER */}
          {/* =================================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={() => setEditingService({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Sort</th>
                      <th className="p-4">Service Title</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Icon Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {servicesList
                      .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(s => (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-400">{s.sortOrder || 1}</td>
                          <td className="p-4 font-bold text-white">{s.title}</td>
                          <td className="p-4 text-slate-400 max-w-xs truncate">{s.description}</td>
                          <td className="p-4 font-mono text-[10px] text-purple-400">{s.icon || 'Heart'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${s.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                              }`}>
                              {s.isActive ? 'active' : 'inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingService(s)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'service', id: s.id, name: s.title })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {servicesList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No services registered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: DOCTORS MANAGER */}
          {/* =================================================================== */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={() => setEditingDoc({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Physician
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Physician</th>
                      <th className="p-4">Specialization</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Fee (INR)</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {doctors
                      .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(d => (
                        <tr key={d.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={d.imageUrl || 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=physician'} alt="dr" className="w-7 h-7 rounded-full border border-purple-500/20 object-cover" />
                            <span className="font-bold text-white">{d.name}</span>
                          </td>
                          <td className="p-4 text-slate-300">{d.specialization}</td>
                          <td className="p-4 font-mono text-slate-400">{d.experience}</td>
                          <td className="p-4 font-mono font-bold text-white">₹{d.consultationFee}</td>
                          <td className="p-4 font-mono text-amber-400">★ {d.rating}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${d.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                              }`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingDoc(d)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'doctor', id: d.id, name: d.name })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {doctors.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">No doctors registered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 6: BLOG MANAGER */}
          {/* =================================================================== */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={() => setEditingBlog({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Article
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Cover Image</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {blogs
                      .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(b => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <img src={b.coverImage || 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=80'} alt="cover" className="w-12 h-8 rounded-lg border border-white/5 object-cover" />
                          </td>
                          <td className="p-4 font-bold text-white max-w-xs truncate">{b.title}</td>
                          <td className="p-4 text-slate-300">{b.authorName}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${b.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                              }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingBlog(b)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'blog', id: b.id, name: b.title })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {blogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No blog posts registered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 7: PRICING PLANS */}
          {/* =================================================================== */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase">Pricing Tier Matrix</h3>
                <button
                  onClick={() => setEditingPlan({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Plan
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Sort</th>
                      <th className="p-4">Plan Name</th>
                      <th className="p-4">Pricing</th>
                      <th className="p-4">Billing Period</th>
                      <th className="p-4">Popular</th>
                      <th className="p-4">Features Count</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {plans
                      .map(p => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-400">{p.sortOrder}</td>
                          <td className="p-4 font-bold text-white">{p.name}</td>
                          <td className="p-4 font-mono text-emerald-400 font-bold">₹{p.price}</td>
                          <td className="p-4 font-mono text-slate-400 uppercase tracking-widest text-[10px]">/{p.period}</td>
                          <td className="p-4">
                            {p.isPopular ? (
                              <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-[0_0_10px_-2px_rgba(217,70,239,0.3)]">
                                POPULAR
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="p-4 font-mono text-purple-400 font-bold">{p.features.length} features</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingPlan(p)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'plan', id: p.id, name: p.name })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {plans.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">No pricing plans registered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 8: FAQ LISTS */}
          {/* =================================================================== */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={() => setEditingFAQ({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Order</th>
                      <th className="p-4">Question</th>
                      <th className="p-4">Answer Summary</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {faqs
                      .filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(f => (
                        <tr key={f.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-400">{f.sortOrder}</td>
                          <td className="p-4 font-bold text-white max-w-xs truncate">{f.question}</td>
                          <td className="p-4 text-slate-400 max-w-md truncate">{f.answer}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingFAQ(f)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'faq', id: f.id, name: f.question })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {faqs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">No FAQ lists registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 9: TESTIMONIALS MANAGER */}
          {/* =================================================================== */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase">Efficacy Reviews</h3>
                <button
                  onClick={() => setEditingTestimonial({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Patient</th>
                      <th className="p-4">Role/Diagnosis</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {testimonialsList
                      .map(t => (
                        <tr key={t.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={t.imageUrl || 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' + t.id} alt="t" className="w-8 h-8 rounded-full border border-purple-500/20 object-cover" />
                            <span className="font-bold text-white">{t.name}</span>
                          </td>
                          <td className="p-4 text-slate-300">{t.role}</td>
                          <td className="p-4 text-slate-400 max-w-sm truncate">{t.message}</td>
                          <td className="p-4 font-mono text-amber-400">★ {t.rating}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingTestimonial(t)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'testimonial', id: t.id, name: t.name })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {testimonialsList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No testimonials registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 10: APPOINTMENTS BOOKINGS QUEUE */}
          {/* =================================================================== */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center gap-4">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending Queue</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Patient Details</th>
                      <th className="p-4">Requested Schedule</th>
                      <th className="p-4">Assigned Specialist</th>
                      <th className="p-4">Notes / Reason</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {appointments
                      .filter(a => {
                        const matchesSearch = a.userName.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesFilter = filterStatus === 'all' || a.status === filterStatus;
                        return matchesSearch && matchesFilter;
                      })
                      .map(appt => (
                        <tr key={appt.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white">{appt.userName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Patient ID: {appt.userId}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-mono text-purple-400">{appt.date}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{appt.time}</p>
                          </td>
                          <td className="p-4 text-slate-300 font-bold">
                            {appt.doctor ? appt.doctor.name : <span className="text-amber-500 text-[10px] font-mono">Unassigned</span>}
                          </td>
                          <td className="p-4 text-slate-400 max-w-xs truncate">{appt.notes || 'No reason provided.'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${appt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                appt.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            {appt.status === 'pending' && (
                              <>
                                <button
                                  onClick={async () => {
                                    await updateAppointmentStatus(appt.id, 'confirmed');
                                    showToast('Appointment approved successfully');
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                                  title="Approve Booking"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    await updateAppointmentStatus(appt.id, 'cancelled');
                                    showToast('Appointment marked as cancelled');
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                                  title="Cancel Booking"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                // Trigger edit dialog to assign doctor or leave admin notes
                                const notes = prompt('Enter Administrative Notes:', appt.notes || '');
                                if (notes !== null) {
                                  updateAppointmentStatus(appt.id, appt.status, notes);
                                  showToast('Administrative notes synchronized');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                              title="Add Admin Notes"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">No appointments logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 11: CONTACT MESSAGES FEED */}
          {/* =================================================================== */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase">Inbox Messages</h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>

              {/* Messages Table */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Sender Details</th>
                      <th className="p-4">Message Body</th>
                      <th className="p-4">Reply Note</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {contactMessages
                      .filter(m => {
                        if (filterStatus === 'all') return true;
                        if (filterStatus === 'unread') return !m.isRead;
                        if (filterStatus === 'read') return m.isRead;
                        return true;
                      })
                      .map(msg => (
                        <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white">{msg.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{msg.email}</p>
                          </td>
                          <td className="p-4 text-slate-300 max-w-sm whitespace-pre-wrap">{msg.message}</td>
                          <td className="p-4 text-slate-400 italic">{msg.replyNotes || <span className="text-slate-600">None yet</span>}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${msg.isRead ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_-2px_rgba(168,85,247,0.3)] animate-pulse'
                              }`}>
                              {msg.isRead ? 'read' : 'new'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            {!msg.isRead && (
                              <button
                                onClick={async () => {
                                  await markContactMessageRead(msg.id, true);
                                  showToast('Message marked as read');
                                }}
                                className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                                title="Mark Read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const rep = prompt('Type Reply / Notes for this message:', msg.replyNotes || '');
                                if (rep !== null) {
                                  markContactMessageRead(msg.id, true, rep);
                                  showToast('Reply notes added');
                                }
                              }}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                              title="Add Reply Notes"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'contact', id: msg.id, name: msg.name })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {contactMessages.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">Inbox is empty.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 12: CHATBOT KNOWLEDGE & LOGS */}
          {/* =================================================================== */}
          {activeTab === 'chatbot' && (
            <div className="space-y-6">

              {/* Chatbot Config Cards */}
              <GlowingCard className="p-5 border-white/5">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase mb-4">Chatbot Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">AI Assistant Welcome Greeting</label>
                    <textarea
                      rows={2}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                      defaultValue="Hello! I am the Medora AI Digital Care Assistant. I can assist in symptom assessments, summarize reports, or configure reminders. What guidance can I provide?"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Safety Clinical Disclaimer Banner</label>
                    <textarea
                      rows={2}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                      defaultValue="DISCLAIMER: Cognitive AI guidelines are educational. Dial 911 immediately in severe clinical emergencies."
                    />
                  </div>
                </div>
              </GlowingCard>

              {/* Knowledge Base Keywords Matrix */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase">Semantic Knowledge Graph</h3>
                <button
                  onClick={() => setEditingKnowledge({})}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Keyword
                </button>
              </div>

              {/* Table List */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#05041a] text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Semantic Keyword Trigger</th>
                      <th className="p-4">Response Instruction / Copy</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {knowledge
                      .map(k => (
                        <tr key={k.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-purple-400">"{k.keyword}"</td>
                          <td className="p-4 text-slate-300 max-w-lg truncate">{k.responseText}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingKnowledge(k)}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'knowledge', id: k.id, name: k.keyword })}
                              className="p-2 rounded-lg bg-white/5 border border-white/5 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {knowledge.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-500">No knowledge entries mapped.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Chat Message Logs */}
              <GlowingCard className="p-5 border-white/5">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase mb-4">Patient Interactive Chat logs</h3>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {chatLogsList.map(log => (
                    <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${log.sender === 'user' ? 'bg-purple-500/15 text-purple-300' : 'bg-cyan-500/15 text-cyan-300'
                          }`}>
                          {log.sender}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{new Date(log.created_at || log.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300 mt-2">{log.message}</p>
                    </div>
                  ))}
                  {chatLogsList.length === 0 && (
                    <p className="text-slate-500 text-center py-6">No chat events logged in the database.</p>
                  )}
                </div>
              </GlowingCard>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 13: MEDIA LIBRARY */}
          {/* =================================================================== */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-200 font-mono tracking-widest uppercase">Registered Media library</h3>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, 'media')}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Upload Image
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Grid Gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mediaAssetsList.map(media => (
                  <div key={media.id} className="glass-panel border-white/5 rounded-2xl overflow-hidden group relative p-3">
                    <img
                      src={media.file_url || media.fileUrl}
                      alt="media"
                      className="w-full h-28 object-cover rounded-xl border border-white/5 bg-[#05041a]"
                    />
                    <div className="p-2 text-xs">
                      <p className="font-bold text-slate-200 truncate text-[10px]">{media.file_name || media.fileName}</p>
                      <div className="flex justify-between items-center mt-2.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(media.file_url || media.fileUrl || '');
                            showToast('Asset CDN URL copied to clipboard');
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/10 text-purple-400 transition-colors cursor-pointer border border-white/5"
                          title="Copy Asset URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={media.file_url || media.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-cyan-400 transition-colors border border-white/5"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'media', id: media.id, name: media.file_name || media.fileName })}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer border border-white/5"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {mediaAssetsList.length === 0 && (
                  <div className="col-span-4 p-12 text-center text-slate-500 glass-panel border-white/5 rounded-2xl">
                    No images registered. Try uploading your first specialist photo or blog cover.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 14: SYSTEM SETTINGS */}
          {/* =================================================================== */}
          {activeTab === 'settings' && (
            <GlowingCard className="p-6 border-white/5 space-y-6">
              <h2 className="text-sm font-bold font-mono tracking-widest text-slate-200 flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings className="w-4.5 h-4.5 text-purple-400" /> Platform System Settings
              </h2>

              <form onSubmit={async (e) => {
                e.preventDefault();
                await updateSettings(settings);
                showToast('Clinical settings synchronized');
              }} className="space-y-4 text-xs sm:text-sm">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Clinic Brand Name</label>
                    <input
                      type="text"
                      value={settings.logoText || 'Medora AI'}
                      onChange={(e) => updateSettings({ logoText: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Support Care Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail || ''}
                      onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Clinical Tele-Support</label>
                    <input
                      type="text"
                      value={settings.phone || ''}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">WhatsApp Business Link</label>
                    <input
                      type="text"
                      value={settings.whatsapp || ''}
                      onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-mono text-[9px] uppercase">Platform Mode</label>
                    <select
                      value={settings.maintenanceMode ? 'true' : 'false'}
                      onChange={(e) => updateSettings({ maintenanceMode: e.target.value === 'true' })}
                      className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                    >
                      <option value="false">Active (Online)</option>
                      <option value="true">Clinical Maintenance Mode</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Headquarters HQ Address</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Emergency Medical Liability Disclaimer Banner</label>
                  <textarea
                    value={settings.emergencyNotice || ''}
                    onChange={(e) => updateSettings({ emergencyNotice: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]/90"
                  />
                </div>

                <div className="flex justify-end mt-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </GlowingCard>
          )}

        </div>

      </div>

      {/* =================================================================== */}
      {/* GLOBAL TOAST ARRAY VIEW */}
      {/* =================================================================== */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded-xl border flex items-center gap-2.5 shadow-xl text-xs font-mono font-bold uppercase transition-all duration-300 pointer-events-auto animate-[slideIn_0.3s_ease-out] ${t.type === 'success' ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/20' :
                t.type === 'error' ? 'bg-rose-950/90 text-rose-400 border-rose-500/20' :
                  'bg-blue-950/90 text-blue-400 border-blue-500/20'
              }`}
          >
            {t.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* DELETION CONFIRMATION MODAL GUARD */}
      {/* =================================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-rose-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center animate-[scaleUp_0.25s_ease-out]">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-black text-white tracking-tight">Security Deletion Guard</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Are you absolutely certain you want to permanently delete <strong className="text-white">"{deleteConfirm.name}"</strong>? This action will remove the record from public data clusters immediately.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-colors text-xs font-mono uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteAction}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs font-mono uppercase tracking-wider cursor-pointer shadow-lg shadow-rose-600/15"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DYNAMIC EDITING DIALOG MODALS FOR CRUD */}
      {/* =================================================================== */}

      {/* 1. DOCTOR MODAL */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingDoc.id ? 'Edit Specialist Profile' : 'Register New Specialist'}
              </h3>
              <button onClick={() => setEditingDoc(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // Validation checks
              if (!editingDoc.name || !editingDoc.specialization) {
                showToast('Physician name and specialization are required fields', 'error');
                return;
              }
              const ok = await upsertDoctor(editingDoc);
              if (ok) {
                showToast('Physician catalog record saved successfully');
                setEditingDoc(null);
              } else {
                showToast('Failed saving physician record', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Physician Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.name || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Specialization / Department</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.specialization || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, specialization: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Years of Experience</label>
                  <input
                    type="text"
                    value={editingDoc.experience || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, experience: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Consultation Fee (INR)</label>
                  <input
                    type="number"
                    value={editingDoc.consultationFee || 0}
                    onChange={(e) => setEditingDoc({ ...editingDoc, consultationFee: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Rating Index</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={editingDoc.rating || 5.0}
                    onChange={(e) => setEditingDoc({ ...editingDoc, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Professional Medical Avatar URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingDoc.imageUrl || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, imageUrl: e.target.value })}
                    placeholder="https://"
                    className="flex-grow rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="doc-avatar-file"
                    onChange={(e) => handleFileUpload(e, 'doctor')}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('doc-avatar-file')?.click()}
                    disabled={isUploadingImage}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-bold hover:bg-white/10 text-xs font-mono uppercase cursor-pointer disabled:opacity-50"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDoc.status === 'active'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.checked ? 'active' : 'inactive' })}
                    className="rounded border-white/10 bg-[#080721] text-purple-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Specialist Active / Online</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FEATURE MODAL */}
      {editingFeature && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingFeature.id ? 'Edit Platform Feature' : 'Register New Feature'}
              </h3>
              <button onClick={() => setEditingFeature(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingFeature.title || !editingFeature.description) {
                showToast('Feature title and description are required fields', 'error');
                return;
              }
              const ok = await upsertFeature(editingFeature);
              if (ok) {
                showToast('Platform feature synchronized successfully');
                setEditingFeature(null);
              } else {
                showToast('Failed saving platform feature', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Feature Title</label>
                <input
                  type="text"
                  required
                  value={editingFeature.title || ''}
                  onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Description</label>
                <textarea
                  required
                  value={editingFeature.description || ''}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={editingFeature.iconName || 'BrainCircuit'}
                    onChange={(e) => setEditingFeature({ ...editingFeature, iconName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Sort Order / Index</label>
                  <input
                    type="number"
                    value={editingFeature.sortOrder || 1}
                    onChange={(e) => setEditingFeature({ ...editingFeature, sortOrder: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingService.id ? 'Edit Clinical Service' : 'Add Medical Service'}
              </h3>
              <button onClick={() => setEditingService(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingService.title || !editingService.description) {
                showToast('Service title and description are required fields', 'error');
                return;
              }

              let ok = false;
              let updated: any[];
              if (!editingService.id) {
                const newService = {
                  id: 's_' + Math.random().toString(36).substring(2, 9),
                  title: editingService.title,
                  description: editingService.description,
                  icon: editingService.icon || 'Heart',
                  sortOrder: editingService.sortOrder || servicesList.length + 1,
                  isActive: editingService.isActive !== undefined ? editingService.isActive : true
                };
                updated = [...servicesList, newService].sort((a, b) => a.sortOrder - b.sortOrder);
                setServicesList(updated);

                if (isDemo || !supabase) {
                  localStorage.setItem('medora_services', JSON.stringify(updated));
                  ok = true;
                } else {
                  const { error } = await supabase.from('services').insert({
                    title: newService.title,
                    description: newService.description,
                    icon: newService.icon,
                    sort_order: newService.sortOrder,
                    is_active: newService.isActive
                  });
                  ok = !error;
                }
              } else {
                updated = servicesList.map(s => s.id === editingService.id ? { ...s, ...editingService } : s).sort((a, b) => a.sortOrder - b.sortOrder);
                setServicesList(updated);

                if (isDemo || !supabase) {
                  localStorage.setItem('medora_services', JSON.stringify(updated));
                  ok = true;
                } else {
                  const { error } = await supabase.from('services').update({
                    title: editingService.title,
                    description: editingService.description,
                    icon: editingService.icon,
                    sort_order: editingService.sortOrder,
                    is_active: editingService.isActive
                  }).eq('id', editingService.id);
                  ok = !error;
                }
              }

              if (ok) {
                showToast('Clinical service synchronized successfully');
                setEditingService(null);
              } else {
                showToast('Failed saving service', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Description</label>
                <textarea
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Icon Trigger</label>
                  <input
                    type="text"
                    value={editingService.icon || 'Heart'}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Sort Order</label>
                  <input
                    type="number"
                    value={editingService.sortOrder || 1}
                    onChange={(e) => setEditingService({ ...editingService, sortOrder: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.isActive !== false}
                    onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                    className="rounded border-white/10 bg-[#080721] text-purple-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Service Active / Enabled</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. BLOG MODAL */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingBlog.id ? 'Edit Research Article' : 'Draft New Research Article'}
              </h3>
              <button onClick={() => setEditingBlog(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingBlog.title || !editingBlog.content) {
                showToast('Title and content are required fields', 'error');
                return;
              }
              const ok = await upsertBlog(editingBlog);
              if (ok) {
                showToast('Research article synchronized successfully');
                setEditingBlog(null);
              } else {
                showToast('Failed saving article', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={(e) => {
                    setEditingBlog({ ...editingBlog, title: e.target.value });
                  }}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Excerpt / Summary Description</label>
                <input
                  type="text"
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Full Clinical Advisory Content</label>
                <textarea
                  required
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Author Name</label>
                  <input
                    type="text"
                    value={editingBlog.authorName || 'Medora Advisory Board'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, authorName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Status Option</label>
                  <select
                    value={editingBlog.status || 'draft'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as 'draft' | 'published' })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  >
                    <option value="draft">Draft Setup</option>
                    <option value="published">Publish Globally</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Cover Image CDN URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingBlog.coverImage || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                    placeholder="https://"
                    className="flex-grow rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="blog-cover-file"
                    onChange={(e) => handleFileUpload(e, 'blog')}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('blog-cover-file')?.click()}
                    disabled={isUploadingImage}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-bold hover:bg-white/10 text-xs font-mono uppercase cursor-pointer disabled:opacity-50"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PRICING PLAN MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingPlan.id ? 'Edit Membership Plan' : 'Add Membership Plan'}
              </h3>
              <button onClick={() => setEditingPlan(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingPlan.name || editingPlan.price === undefined) {
                showToast('Plan name and price are required fields', 'error');
                return;
              }
              const ok = await upsertPlan(editingPlan);
              if (ok) {
                showToast('Membership plan catalog updated successfully');
                setEditingPlan(null);
              } else {
                showToast('Failed saving plan details', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Pricing Rate (INR)</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.price || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Billing Cycle</label>
                  <select
                    value={editingPlan.period || 'month'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, period: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  >
                    <option value="month">Monthly Billing</option>
                    <option value="year">Annual Billing</option>
                    <option value="forever">Lifetime / Forever</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Sorting Position</label>
                  <input
                    type="number"
                    value={editingPlan.sortOrder || 1}
                    onChange={(e) => setEditingPlan({ ...editingPlan, sortOrder: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Plan Action Call CTA</label>
                <input
                  type="text"
                  value={editingPlan.ctaText || 'Get Started'}
                  onChange={(e) => setEditingPlan({ ...editingPlan, ctaText: e.target.value })}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular || false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                    className="rounded border-white/10 bg-[#080721] text-purple-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Mark Popular tier</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. FAQ MODAL */}
      {editingFAQ && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingFAQ.id ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </h3>
              <button onClick={() => setEditingFAQ(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingFAQ.question || !editingFAQ.answer) {
                showToast('Question and answer details are required fields', 'error');
                return;
              }
              const ok = await upsertFAQ(editingFAQ);
              if (ok) {
                showToast('FAQ guidelines updated successfully');
                setEditingFAQ(null);
              } else {
                showToast('Failed saving FAQ', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">FAQ Question</label>
                <input
                  type="text"
                  required
                  value={editingFAQ.question || ''}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">FAQ Answer Guidelines</label>
                <textarea
                  required
                  value={editingFAQ.answer || ''}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Ordering Index</label>
                  <input
                    type="number"
                    value={editingFAQ.sortOrder || 1}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, sortOrder: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFAQ(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. TESTIMONIAL MODAL */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingTestimonial.id ? 'Edit Efficacy Review' : 'Add Efficacy Review'}
              </h3>
              <button onClick={() => setEditingTestimonial(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingTestimonial.name || !editingTestimonial.message) {
                showToast('Patient name and message are required fields', 'error');
                return;
              }

              let ok = false;
              let updated: any[];
              if (!editingTestimonial.id) {
                const newTestimonial = {
                  id: 't_' + Math.random().toString(36).substring(2, 9),
                  name: editingTestimonial.name,
                  role: editingTestimonial.role || 'Patient',
                  message: editingTestimonial.message,
                  rating: editingTestimonial.rating || 5,
                  imageUrl: editingTestimonial.imageUrl || '',
                  isActive: true
                };
                updated = [newTestimonial, ...testimonialsList];
                setTestimonialsList(updated);

                if (isDemo || !supabase) {
                  localStorage.setItem('medora_testimonials', JSON.stringify(updated));
                  ok = true;
                } else {
                  const { error } = await supabase.from('testimonials').insert({
                    name: newTestimonial.name,
                    role: newTestimonial.role,
                    message: newTestimonial.message,
                    rating: newTestimonial.rating,
                    image_url: newTestimonial.imageUrl,
                    is_active: true
                  });
                  ok = !error;
                }
              } else {
                updated = testimonialsList.map(t => t.id === editingTestimonial.id ? { ...t, ...editingTestimonial } : t);
                setTestimonialsList(updated);

                if (isDemo || !supabase) {
                  localStorage.setItem('medora_testimonials', JSON.stringify(updated));
                  ok = true;
                } else {
                  const { error } = await supabase.from('testimonials').update({
                    name: editingTestimonial.name,
                    role: editingTestimonial.role,
                    message: editingTestimonial.message,
                    rating: editingTestimonial.rating,
                    image_url: editingTestimonial.imageUrl
                  }).eq('id', editingTestimonial.id);
                  ok = !error;
                }
              }

              if (ok) {
                showToast('Review synchronized successfully');
                setEditingTestimonial(null);
              } else {
                showToast('Failed saving testimonial', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Role / Clinical Diagnosis</label>
                  <input
                    type="text"
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Review Message Body</label>
                <textarea
                  required
                  value={editingTestimonial.message || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, message: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-mono text-[9px] uppercase">Rating Index</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Patient Avatar CDN URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingTestimonial.imageUrl || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, imageUrl: e.target.value })}
                    placeholder="https://"
                    className="flex-grow rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="testimonial-avatar-file"
                    onChange={(e) => handleFileUpload(e, 'testimonial')}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('testimonial-avatar-file')?.click()}
                    disabled={isUploadingImage}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-bold hover:bg-white/10 text-xs font-mono uppercase cursor-pointer disabled:opacity-50"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. CHATBOT KNOWLEDGE MODAL */}
      {editingKnowledge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-purple-500/10 shadow-2xl animate-[scaleUp_0.25s_ease-out]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-widest uppercase">
                {editingKnowledge.id ? 'Edit Semantic Keyword' : 'Add Semantic Keyword'}
              </h3>
              <button onClick={() => setEditingKnowledge(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingKnowledge.keyword || !editingKnowledge.responseText) {
                showToast('Keyword trigger and response copy are required fields', 'error');
                return;
              }
              const ok = await upsertKnowledge(editingKnowledge);
              if (ok) {
                showToast('Knowledge graph keyword trigger synchronized successfully');
                setEditingKnowledge(null);
              } else {
                showToast('Failed saving knowledge item', 'error');
              }
            }} className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Semantic Keyword Trigger</label>
                <input
                  type="text"
                  required
                  value={editingKnowledge.keyword || ''}
                  onChange={(e) => setEditingKnowledge({ ...editingKnowledge, keyword: e.target.value })}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono text-[9px] uppercase">Response Instruction Copy</label>
                <textarea
                  required
                  value={editingKnowledge.responseText || ''}
                  onChange={(e) => setEditingKnowledge({ ...editingKnowledge, responseText: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-slate-200 bg-[#080721]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingKnowledge(null)}
                  className="px-5 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 font-bold text-xs font-mono uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Save Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
