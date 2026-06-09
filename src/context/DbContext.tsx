/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../services/supabase';

const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// =====================================================================
// DATA MODELS & INTERFACES
// =====================================================================

export interface SiteSettings {
  logoText: string;
  themeColor: string;
  contactEmail: string;
  phone: string;
  address: string;
  whatsapp: string;
  emergencyNotice: string;
  maintenanceMode: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  sortOrder: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  consultationFee: number;
  imageUrl: string;
  availability: string[];
  status: 'active' | 'inactive';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  isPopular: boolean;
  ctaText: string;
  features: string[];
  sortOrder: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  doctor: Doctor | null;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  replyNotes: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  sender: 'user' | 'ai';
  createdAt: string;
  sessionId?: string;
  metadata?: any;
}

export interface ChatbotKnowledge {
  id: string;
  keyword: string;
  responseText: string;
}

// =====================================================================
// DEFAULT / MOCK DATA FOR DEMO MODE
// =====================================================================

const DEFAULT_SETTINGS: SiteSettings = {
  logoText: "Medora AI",
  themeColor: "purple",
  contactEmail: "support@medora.ai",
  phone: "+1 (555) 843-2479",
  address: "Quantum Health Park, Suite 404, San Francisco, CA",
  whatsapp: "+15558432479",
  emergencyNotice: "CRITICAL: For immediate life-threatening medical emergencies, please dial 911 or visit the nearest emergency department.",
  maintenanceMode: false,
  heroTitle: "The Future of Healthcare is Here",
  heroSubtitle: "AI-driven insights, expert doctors, and personalized care — anytime, anywhere.",
  heroCtaText: "Start Free Assessment",
  seoTitle: "Medora AI - Premium Futuristic Healthcare AI Platform",
  seoDescription: "Get instant AI symptom checking, consult board-certified physicians, analyze report results, and track daily wellness metrics."
};

const DEFAULT_FEATURES: Feature[] = [
  { id: 'f1', title: 'AI Symptom Checker', description: 'Analyze symptoms and get instant triage guidelines powered by predictive clinical diagnostics.', iconName: 'BrainCircuit', sortOrder: 1 },
  { id: 'f2', title: 'Report Analysis', description: 'Upload lab reports, blood panels, or scan summaries to receive clear, automated explanations.', iconName: 'FileText', sortOrder: 2 },
  { id: 'f3', title: 'Doctor Consultation', description: 'Connect directly with verified medical professionals via premium encrypted digital portals.', iconName: 'UserCheck', sortOrder: 3 },
  { id: 'f4', title: 'Medication Reminders', description: 'Interactive schedules, capsule alerts, and safety triggers customized to your treatment plan.', iconName: 'Clock', sortOrder: 4 },
  { id: 'f5', title: 'Wellness Tracking', description: 'Monitor physical stats, vital metrics, and sleep efficiency logs within a unified database.', iconName: 'Activity', sortOrder: 5 },
  { id: 'f6', title: 'Health Risk Prediction', description: 'Review genetic indicators, lifestyle choices, and body metrics to forecast preventative health alerts.', iconName: 'ShieldAlert', sortOrder: 6 }
];

const DEFAULT_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Evelyn Vance', specialization: 'Neurology & AI Diagnostics', experience: '14 Years', rating: 4.95, consultationFee: 149, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400', availability: ['Monday', 'Wednesday', 'Friday'], status: 'active' },
  { id: 'd2', name: 'Dr. Marcus Reyes', specialization: 'Cardiology & Preventative Care', experience: '18 Years', rating: 4.98, consultationFee: 175, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', availability: ['Tuesday', 'Thursday'], status: 'active' },
  { id: 'd3', name: 'Dr. Sarah Jenkins', specialization: 'Internal Medicine & Triage', experience: '9 Years', rating: 4.87, consultationFee: 95, imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400', availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], status: 'active' },
  { id: 'd4', name: 'Dr. Liam Thorne', specialization: 'Pediatrics & Developmental Health', experience: '12 Years', rating: 4.92, consultationFee: 120, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', availability: ['Wednesday', 'Friday'], status: 'active' }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Cassandra Reynolds', role: 'Venture Partner', content: 'Medora AI caught my micro-thyroid fluctuation six months before my annual lab appointment. The triage guidelines are unmatched.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: 't2', name: 'Jonathan Pierce', role: 'Full-Stack Lead', content: 'As a developer working odd hours, getting a diagnostic summary of my sleep disturbances and matching neurologist contacts at 2 AM was an absolute game changer.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
  { id: 't3', name: 'Dr. Julian Foster', role: 'Chief of Medicine', content: 'Having worked in standard health clinics for 20 years, seeing how Medora bridges client diagnostics with active clinical queues is highly impressive.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
  { id: 't4', name: 'Elena Rostova', role: 'Wellness Director', content: 'The glassmorphic dashboard tracking my cardiac patterns, medicine calendar, and expert consults makes maintaining longevity exceptionally easy.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120' }
];

const DEFAULT_PLANS: PricingPlan[] = [
  { id: 'p1', name: 'Basic Care', price: '0', period: 'forever', isPopular: false, ctaText: 'Activate Free', sortOrder: 1, features: ['Unlimited Symptom Checker', 'Standard Health Profile', 'Basic Medication Logging', '24/7 AI Assistance (Ad-Supported)'] },
  { id: 'p2', name: 'Smart Health Plus', price: '29', period: 'month', isPopular: true, ctaText: 'Start Plus Trial', sortOrder: 2, features: ['Unlimited Symptom Checker', 'Instant Automated Report Uploads & Interpretations', 'Priority 24/7 AI Triage (Ad-Free)', 'Custom Wellness Score Diagnostics', '1 Discounted Monthly Doctor Consultation'] },
  { id: 'p3', name: 'Premium Care', price: '79', period: 'month', isPopular: false, ctaText: 'Subscribe to Premium', sortOrder: 3, features: ['Everything in Smart Health Plus', 'Unlimited Detailed Lab Interpretations', '2 Free Monthly Video Consultations', '24/7 Priority Emergency Triage Queue', 'Premium Dedicated AI Care Coordinator', 'Free Family Health Sharing Link (up to 3)'] }
];

const DEFAULT_BLOGS: BlogPost[] = [
  { id: 'b1', title: 'Understanding Preventive Healthcare', excerpt: 'How shift-based health models and automated micro-tracking are replacing standard clinical reactions.', content: 'Preventive healthcare is rapidly transitioning from generic annual checkups to dynamic continuous monitoring. By leverage medical AI technologies and sensor tracking, individuals can detect metabolic, vascular, or neurologist anomalies long before standard physical indicators present themselves. This article details clinical strategies for proactive living, optimized dietary baselines, and early heart anomaly checks.', authorName: 'Dr. Sarah Jenkins', authorAvatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=120', coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', tags: ['Preventive', 'Longevity', 'AI Triage'], publishedAt: '2026-05-15T08:00:00Z', status: 'published' },
  { id: 'b2', title: 'How AI Supports Early Health Awareness', excerpt: 'Deep diving into neural network triage systems and safe clinical checks that enhance diagnostics.', content: 'Large diagnostic models and medical NLP engines are empowering patients with automated triage insights. Rather than typing vague queries into commercial search engines, Medora AI utilizes predictive health graphs that assess risk profiles, age variables, and exact symptom timelines. This reduces clinical friction, filters out alarmist assumptions, and directs patients to actual relevant doctors immediately.', authorName: 'Dr. Evelyn Vance', authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120', coverImage: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600', tags: ['AI Medicine', 'Diagnostics', 'Innovation'], publishedAt: '2026-05-24T10:30:00Z', status: 'published' },
  { id: 'b3', title: 'When Should You Consult a Doctor?', excerpt: 'Filtering out mild transient cases from severe red-flag conditions using diagnostic logic.', content: 'Symptom confusion can create either chronic neglect or panic-driven clinical visits. Our neuro-diagnostic graphs help categorize conditions into green (observe and rest), yellow (consult virtual doctor within 24 hours), and red (seek immediate local emergency rooms). Learn the key biological indicators that call for immediate in-person professional review.', authorName: 'Dr. Marcus Reyes', authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120', coverImage: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=600', tags: ['Clinical Care', 'Guidance', 'Triage'], publishedAt: '2026-05-29T14:15:00Z', status: 'published' },
  { id: 'b4', title: 'Digital Health Records Explained', excerpt: 'The security behind portable EHR profiles and how encrypted clouds are transforming client storage.', content: 'Decentralized Electronic Health Records (EHR) allow immediate portable clinic synchronization. Under modern encryptions, Medora AI enables secure, patient-owned data vaults. You hold full control over when to release logs to a consulting physician, ensuring maximum medical privacy under HIPPA and GDPR regulations.', authorName: 'Medora AI Tech Team', authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=medora', coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=600', tags: ['EHR', 'Privacy', 'Blockchain'], publishedAt: '2026-05-30T17:00:00Z', status: 'published' }
];

const DEFAULT_FAQS: FAQ[] = [
  { id: 'q1', question: 'How accurate is the Medora AI Symptom Checker?', answer: 'The Medora AI checker utilizes clinical triage protocols developed by board-certified physicians and trained neural networks. It operates with a 94.6% correlation to initial primary triage recommendations. However, it provides educational diagnostic guidance only, not a replacement for legal medical treatment.', sortOrder: 1 },
  { id: 'q2', question: 'Is my personal health data encrypted and private?', answer: 'Yes. Medora AI utilizes point-to-point end-to-end data encryption. All records are stored securely in Supabase tables utilizing Row-Level Security (RLS), meaning neither other users nor third-party trackers can access your appointments, chat histories, or uploaded medical records.', sortOrder: 2 },
  { id: 'q3', question: 'How do virtual doctor consultations work?', answer: 'Once you select an expert doctor from the directory, you choose an available time slot and submit a booking form. You will receive an encrypted video link in your Dashboard. Sessions are fully encrypted and confidential.', sortOrder: 3 },
  { id: 'q4', question: 'Can I upload standard PDF lab reports for analysis?', answer: 'Yes. Our Smart Health plan enables you to upload blood panels, urine tests, or radiology summaries. Medora’s parsing engine extracts values, matches them against standard biological thresholds, and writes clear, understandable summaries in plain language.', sortOrder: 4 },
  { id: 'q5', question: 'What is the refund or cancellation policy for appointments?', answer: 'Appointments can be rescheduled or cancelled via your User Dashboard with full refunds up to 12 hours before the scheduled time slot.', sortOrder: 5 }
];

const DEFAULT_KNOWLEDGE: ChatbotKnowledge[] = [
  { id: 'k1', keyword: 'headache', responseText: 'Headaches are commonly caused by dehydration, stress, lack of sleep, or sinus tension. Try drinking water, resting in a dim room, and checking if you have associated symptoms like neck stiffness or vision loss (which are clinical warning signs).' },
  { id: 'k2', keyword: 'fever', responseText: 'A fever typically indicates your body is fighting off an infection. Adults should seek clinical advice if a fever exceeds 103°F (39.4°C) or lasts more than 3 days. Ensure hydration and record temperature spikes.' },
  { id: 'k3', keyword: 'appointment', responseText: 'You can book an appointment directly with any of our verified doctors by navigating to the Doctors page, filtering by specialty, and selecting a schedule. Our booking forms are fully secure.' },
  { id: 'k4', keyword: 'report', responseText: 'To analyze a medical report, upload it inside the User Dashboard under the Reports tab. Our system will summarize key indicators like hemoglobin levels, cholesterol indexes, or blood pressure thresholds.' },
  { id: 'k5', keyword: 'reminder', responseText: 'You can configure medicine calendars and pill notifications under the Reminders tab in your dashboard, helping you stay compliant with your customized clinical prescriptions.' }
];

// =====================================================================
// CONTEXT INTERFACE
// =====================================================================

interface DbContextType {
  isDemo: boolean;
  settings: SiteSettings;
  features: Feature[];
  doctors: Doctor[];
  testimonials: Testimonial[];
  plans: PricingPlan[];
  blogs: BlogPost[];
  faqs: FAQ[];
  appointments: Appointment[];
  contactMessages: ContactMessage[];
  chatMessages: ChatMessage[];
  knowledge: ChatbotKnowledge[];
  
  // Update Functions (supports both real Supabase update & mock state persistence)
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  upsertDoctor: (doctor: Partial<Doctor>) => Promise<boolean>;
  deleteDoctor: (id: string) => Promise<boolean>;
  upsertFeature: (feature: Partial<Feature>) => Promise<boolean>;
  deleteFeature: (id: string) => Promise<boolean>;
  upsertBlog: (blog: Partial<BlogPost>) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  upsertPlan: (plan: Partial<PricingPlan>) => Promise<boolean>;
  deletePlan: (id: string) => Promise<boolean>;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: Appointment['status'], notes?: string) => Promise<boolean>;
  createContactMessage: (msg: { name: string; email: string; message: string }) => Promise<boolean>;
  markContactMessageRead: (id: string, isRead: boolean, notes?: string) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  saveChatMessage: (userId: string, message: string, sender: 'user' | 'ai', sessionId?: string, metadata?: any) => Promise<ChatMessage>;
  getChatHistory: (userId: string) => ChatMessage[];
  clearChatHistory: (userId: string) => void;
  upsertFAQ: (faq: Partial<FAQ>) => Promise<boolean>;
  deleteFAQ: (id: string) => Promise<boolean>;
  upsertKnowledge: (entry: Partial<ChatbotKnowledge>) => Promise<boolean>;
  deleteKnowledge: (id: string) => Promise<boolean>;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

// =====================================================================
// DATABASE CONTEXT PROVIDER
// =====================================================================

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State declaration ---
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);
  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [knowledge, setKnowledge] = useState<ChatbotKnowledge[]>(DEFAULT_KNOWLEDGE);
  const [knowledgeSchema, setKnowledgeSchema] = useState<'legacy' | 'complete'>('complete');

  const fetchFromSupabase = async () => {
    if (!supabase) return;
    try {
      // Load public configurations reactively
      const { data: sData } = await supabase.from('site_settings').select('*');
      if (sData && sData.length > 0) {
        const settingsMap: any = {};
        sData.forEach((row: any) => { settingsMap[row.key] = row.value; });
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }

      const { data: fData } = await supabase.from('features').select('*').order('sort_order', { ascending: true });
      if (fData) setFeatures(fData.map((f: any) => ({ id: f.id, title: f.title, description: f.description, iconName: f.icon_name, sortOrder: f.sort_order })));

      const { data: dData } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
      if (dData) setDoctors(dData.map((d: any) => ({ id: d.id, name: d.name, specialization: d.specialization, experience: d.experience, rating: Number(d.rating), consultationFee: Number(d.consultation_fee), imageUrl: d.image_url, availability: d.availability, status: d.status })));

      const { data: tData } = await supabase.from('testimonials').select('*');
      if (tData) setTestimonials(tData);

      const { data: pData } = await supabase.from('pricing_plans').select('*, pricing_features(*)').order('sort_order', { ascending: true });
      if (pData) {
        setPlans(pData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          period: p.period,
          isPopular: p.is_popular,
          ctaText: p.cta_text,
          sortOrder: p.sort_order,
          features: p.pricing_features?.map((f: any) => f.feature) || []
        })));
      }

      const { data: bData } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
      if (bData) {
        setBlogs(bData.map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          authorName: b.author_name,
          authorAvatar: b.author_avatar,
          coverImage: b.cover_image,
          tags: b.tags,
          publishedAt: b.published_at || b.created_at,
          status: b.status
        })));
      }

      const { data: faqData } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
      if (faqData) setFaqs(faqData);

      const { data: kData } = await supabase.from('chatbot_knowledge').select('*');
      if (kData) {
        if (kData.length > 0 && 'keyword' in kData[0]) {
          setKnowledgeSchema('legacy');
        } else {
          setKnowledgeSchema('complete');
        }
        setKnowledge(kData.map((k: any) => ({
          id: k.id,
          keyword: k.keyword || k.title || '',
          responseText: k.response_text || k.content || ''
        })));
      }

      // Load appointments & contact requests if logged-in auth user is admin
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Fetch appointments
        const { data: apptData } = await supabase.from('appointments').select('*, doctors(*)');
        if (apptData) {
          setAppointments(apptData.map((a: any) => ({
            id: a.id,
            userId: a.user_id,
            userName: a.profiles?.full_name || 'Patient',
            doctor: a.doctors ? {
              id: a.doctors.id,
              name: a.doctors.name,
              specialization: a.doctors.specialization,
              experience: a.doctors.experience,
              rating: Number(a.doctors.rating),
              consultationFee: Number(a.doctors.consultation_fee),
              imageUrl: a.doctors.image_url,
              availability: a.doctors.availability,
              status: a.doctors.status
            } : null,
            date: a.date,
            time: a.time,
            status: a.status,
            notes: a.notes || '',
            createdAt: a.created_at
          })));
        }

        // Fetch contact messages (Admin role will pass RLS rules)
        const { data: cData } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (cData) {
          setContactMessages(cData.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            message: c.message,
            isRead: c.is_read,
            replyNotes: c.reply_notes || '',
            createdAt: c.created_at
          })));
        }

        // Fetch chat messages for this user
        if (isValidUuid(userData.user.id)) {
          const { data: chatData } = await supabase.from('chat_messages')
            .select('*')
            .eq('user_id', userData.user.id)
            .order('created_at', { ascending: true });
          
          if (chatData) {
            const dbChats = chatData.map((c: any) => ({
              id: c.id,
              userId: c.user_id,
              message: c.message,
              sender: c.sender,
              createdAt: c.created_at,
              sessionId: c.session_id,
              metadata: c.metadata
            }));
            setChatMessages(prev => {
              const nonUserChats = prev.filter(x => x.userId !== userData.user.id);
              return [...nonUserChats, ...dbChats];
            });
          }
        }
      } else {
        // Clean out any authenticated chats from React state, keep only guest/local chats
        setChatMessages(prev => prev.filter(c => !isValidUuid(c.userId)));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, continuing in static mode:', err);
    }
  };

  // --- Initial load & local storage sync ---
  useEffect(() => {
    // Load local storage chats first in all modes to recover guest history
    const savedChats = localStorage.getItem('medora_chats');
    if (savedChats) {
      try {
        setChatMessages(JSON.parse(savedChats));
      } catch (e) {
        console.warn('Failed to parse local chats:', e);
      }
    }

    if (isDemoMode) {
      // Sync with localStorage to keep demo experience continuous and fully interactive
      const savedSettings = localStorage.getItem('medora_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedDoctors = localStorage.getItem('medora_doctors');
      if (savedDoctors) setDoctors(JSON.parse(savedDoctors));

      const savedFeatures = localStorage.getItem('medora_features');
      if (savedFeatures) setFeatures(JSON.parse(savedFeatures));

      const savedBlogs = localStorage.getItem('medora_blogs');
      if (savedBlogs) setBlogs(JSON.parse(savedBlogs));

      const savedPlans = localStorage.getItem('medora_plans');
      if (savedPlans) setPlans(JSON.parse(savedPlans));

      const savedFaqs = localStorage.getItem('medora_faqs');
      if (savedFaqs) setFaqs(JSON.parse(savedFaqs));

      const savedAppointments = localStorage.getItem('medora_appointments');
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

      const savedContacts = localStorage.getItem('medora_contacts');
      if (savedContacts) setContactMessages(JSON.parse(savedContacts));

      const savedKnowledge = localStorage.getItem('medora_knowledge');
      if (savedKnowledge) setKnowledge(JSON.parse(savedKnowledge));
    } else {
      // Fetch dynamic contents from active Supabase server
      fetchFromSupabase();

      // Listen for auth state changes to reload data reactively
      if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
          fetchFromSupabase();
        });
        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, []);

  // =====================================================================
  // ACTIONS / METHODS (DUPLEX FLOW: PERSISTS EITHER TO SUPABASE OR LOCALSTORAGE)
  // =====================================================================

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_settings', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      // Loop keys and update setting entries in Supabase
      for (const [key, val] of Object.entries(newSettings)) {
        await supabase.from('site_settings').upsert({ key, value: val, updated_at: new Date().toISOString() });
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const upsertDoctor = async (doc: Partial<Doctor>): Promise<boolean> => {
    let updatedList: Doctor[];
    if (!doc.id) {
      // Insert
      const newDoc: Doctor = {
        id: 'doc_' + Math.random().toString(36).substr(2, 9),
        name: doc.name || 'Dr. Unknown',
        specialization: doc.specialization || 'General Practitioner',
        experience: doc.experience || '1 Year',
        rating: doc.rating || 5.0,
        consultationFee: doc.consultationFee || 50,
        imageUrl: doc.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        availability: doc.availability || ['Monday', 'Friday'],
        status: doc.status || 'active'
      };
      updatedList = [newDoc, ...doctors];
    } else {
      // Update
      updatedList = doctors.map(d => d.id === doc.id ? { ...d, ...doc } as Doctor : d);
    }
    setDoctors(updatedList);

    if (isDemoMode) {
      localStorage.setItem('medora_doctors', JSON.stringify(updatedList));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload = {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        experience: doc.experience,
        rating: doc.rating,
        consultation_fee: doc.consultationFee,
        image_url: doc.imageUrl,
        availability: doc.availability,
        status: doc.status
      };
      const { error } = await supabase.from('doctors').upsert(payload);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteDoctor = async (id: string): Promise<boolean> => {
    const updated = doctors.filter(d => d.id !== id);
    setDoctors(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_doctors', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('doctors').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const upsertFeature = async (feat: Partial<Feature>): Promise<boolean> => {
    let updatedList: Feature[];
    if (!feat.id) {
      const newFeat: Feature = {
        id: 'feat_' + Math.random().toString(36).substr(2, 9),
        title: feat.title || 'New AI Core',
        description: feat.description || '',
        iconName: feat.iconName || 'Activity',
        sortOrder: feat.sortOrder || features.length + 1
      };
      updatedList = [...features, newFeat].sort((a,b) => a.sortOrder - b.sortOrder);
    } else {
      updatedList = features.map(f => f.id === feat.id ? { ...f, ...feat } as Feature : f).sort((a,b) => a.sortOrder - b.sortOrder);
    }
    setFeatures(updatedList);

    if (isDemoMode) {
      localStorage.setItem('medora_features', JSON.stringify(updatedList));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload = {
        id: feat.id,
        title: feat.title,
        description: feat.description,
        icon_name: feat.iconName,
        sort_order: feat.sortOrder
      };
      const { error } = await supabase.from('features').upsert(payload);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteFeature = async (id: string): Promise<boolean> => {
    const updated = features.filter(f => f.id !== id);
    setFeatures(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_features', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('features').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const upsertBlog = async (blog: Partial<BlogPost>): Promise<boolean> => {
    let updatedList: BlogPost[];
    if (!blog.id) {
      const newBlog: BlogPost = {
        id: 'blog_' + Math.random().toString(36).substr(2, 9),
        title: blog.title || 'Untitled Article',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        authorName: blog.authorName || 'Medora Clinician',
        authorAvatar: blog.authorAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=doctor',
        coverImage: blog.coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
        tags: blog.tags || ['Wellness'],
        publishedAt: new Date().toISOString(),
        status: blog.status || 'published'
      };
      updatedList = [newBlog, ...blogs];
    } else {
      updatedList = blogs.map(b => b.id === blog.id ? { ...b, ...blog } as BlogPost : b);
    }
    setBlogs(updatedList);

    if (isDemoMode) {
      localStorage.setItem('medora_blogs', JSON.stringify(updatedList));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload = {
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author_name: blog.authorName,
        author_avatar: blog.authorAvatar,
        cover_image: blog.coverImage,
        tags: blog.tags,
        status: blog.status,
        published_at: blog.status === 'published' ? new Date().toISOString() : null
      };
      const { error } = await supabase.from('blog_posts').upsert(payload);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteBlog = async (id: string): Promise<boolean> => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_blogs', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const upsertPlan = async (plan: Partial<PricingPlan>): Promise<boolean> => {
    let updatedList: PricingPlan[];
    if (!plan.id) {
      const newPlan: PricingPlan = {
        id: 'plan_' + Math.random().toString(36).substr(2, 9),
        name: plan.name || 'Care Tier',
        price: plan.price || '9.99',
        period: plan.period || 'month',
        isPopular: plan.isPopular || false,
        ctaText: plan.ctaText || 'Get Started',
        features: plan.features || ['Premium Support'],
        sortOrder: plan.sortOrder || plans.length + 1
      };
      updatedList = [...plans, newPlan].sort((a,b) => a.sortOrder - b.sortOrder);
    } else {
      updatedList = plans.map(p => p.id === plan.id ? { ...p, ...plan } as PricingPlan : p).sort((a,b) => a.sortOrder - b.sortOrder);
    }
    setPlans(updatedList);

    if (isDemoMode) {
      localStorage.setItem('medora_plans', JSON.stringify(updatedList));
      return true;
    }

    if (!supabase) return false;
    try {
      // First upsert base plan details
      const payload = {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: plan.period,
        is_popular: plan.isPopular,
        cta_text: plan.ctaText,
        sort_order: plan.sortOrder
      };
      const { data: savedPlan, error } = await supabase.from('pricing_plans').upsert(payload).select().single();
      
      if (!error && savedPlan && plan.features) {
        // Clear old pricing features and insert fresh ones
        await supabase.from('pricing_features').delete().eq('plan_id', savedPlan.id);
        const featurePayloads = plan.features.map(f => ({ plan_id: savedPlan.id, feature: f }));
        await supabase.from('pricing_features').insert(featurePayloads);
      }
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deletePlan = async (id: string): Promise<boolean> => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_plans', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const createAppointment = async (appt: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const newAppt: Appointment = {
      ...appt,
      id: 'appt_' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newAppt, ...appointments];
    setAppointments(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_appointments', JSON.stringify(updated));
      return true;
    }

    if (!supabase || !isValidUuid(appt.userId)) return false;
    try {
      const payload = {
        user_id: appt.userId,
        doctor_id: appt.doctor?.id || null,
        date: appt.date,
        time: appt.time,
        status: 'pending',
        notes: appt.notes
      };
      const { error } = await supabase.from('appointments').insert(payload);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status'], notes?: string): Promise<boolean> => {
    const updated = appointments.map(a => a.id === id ? { ...a, status, notes: notes !== undefined ? notes : a.notes } : a);
    setAppointments(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_appointments', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload: any = { status };
      if (notes !== undefined) payload.notes = notes;
      const { error } = await supabase.from('appointments').update(payload).eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const createContactMessage = async (msg: { name: string; email: string; message: string }): Promise<boolean> => {
    const newMsg: ContactMessage = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      name: msg.name,
      email: msg.email,
      message: msg.message,
      isRead: false,
      replyNotes: '',
      createdAt: new Date().toISOString()
    };
    const updated = [newMsg, ...contactMessages];
    setContactMessages(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_contacts', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        message: msg.message
      });
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const markContactMessageRead = async (id: string, isRead: boolean, notes?: string): Promise<boolean> => {
    const updated = contactMessages.map(c => c.id === id ? { ...c, isRead, replyNotes: notes !== undefined ? notes : c.replyNotes } : c);
    setContactMessages(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_contacts', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload: any = { is_read: isRead };
      if (notes !== undefined) payload.reply_notes = notes;
      const { error } = await supabase.from('contact_messages').update(payload).eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    const updated = contactMessages.filter(c => c.id !== id);
    setContactMessages(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_contacts', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const saveChatMessage = async (userId: string, message: string, sender: 'user' | 'ai', sessionId?: string, metadata?: any): Promise<ChatMessage> => {
    const newChat: ChatMessage = {
      id: 'chat_' + Math.random().toString(36).substr(2, 9),
      userId,
      message,
      sender,
      createdAt: new Date().toISOString(),
      sessionId,
      metadata
    };
    
    setChatMessages(prev => [...prev, newChat]);

    if (isDemoMode || !isValidUuid(userId)) {
      try {
        const savedChats = localStorage.getItem('medora_chats');
        const chatsList = savedChats ? JSON.parse(savedChats) : [];
        chatsList.push(newChat);
        localStorage.setItem('medora_chats', JSON.stringify(chatsList));
      } catch (e) {
        console.warn('Failed saving local chat:', e);
      }
      return newChat;
    }

    if (!supabase) return newChat;
    try {
      const { data, error } = await supabase.from('chat_messages').insert({
        user_id: userId,
        message,
        sender,
        session_id: sessionId || null,
        metadata: metadata || {}
      }).select().single();
      
      if (!error && data) {
        const dbChat: ChatMessage = {
          id: data.id,
          userId: data.user_id,
          message: data.message,
          sender: data.sender,
          createdAt: data.created_at,
          sessionId: data.session_id,
          metadata: data.metadata
        };
        setChatMessages(prev => prev.map(c => c.id === newChat.id ? dbChat : c));
        return dbChat;
      } else {
        console.error('Supabase error inserting chat message:', error);
      }
    } catch (err) {
      console.error('Failed saving chat:', err);
    }
    return newChat;
  };

  const getChatHistory = (userId: string): ChatMessage[] => {
    return chatMessages.filter(c => c.userId === userId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const clearChatHistory = (userId: string) => {
    setChatMessages(prev => prev.filter(c => c.userId !== userId));
    if (isDemoMode || !isValidUuid(userId)) {
      try {
        const savedChats = localStorage.getItem('medora_chats');
        if (savedChats) {
          const chatsList = JSON.parse(savedChats) as ChatMessage[];
          const filtered = chatsList.filter(c => c.userId !== userId);
          localStorage.setItem('medora_chats', JSON.stringify(filtered));
        }
      } catch (e) {
        console.warn('Failed clearing local chat:', e);
      }
    } else if (supabase && isValidUuid(userId)) {
      supabase.from('chat_messages').delete().eq('user_id', userId).then();
    }
  };

  const upsertFAQ = async (faq: Partial<FAQ>): Promise<boolean> => {
    let updatedList: FAQ[];
    if (!faq.id) {
      const newFAQ: FAQ = {
        id: 'faq_' + Math.random().toString(36).substr(2, 9),
        question: faq.question || 'New FAQ Question',
        answer: faq.answer || 'Answer details here',
        sortOrder: faq.sortOrder || faqs.length + 1
      };
      updatedList = [...faqs, newFAQ].sort((a,b) => a.sortOrder - b.sortOrder);
    } else {
      updatedList = faqs.map(f => f.id === faq.id ? { ...f, ...faq } as FAQ : f).sort((a,b) => a.sortOrder - b.sortOrder);
    }
    setFaqs(updatedList);

    if (isDemoMode) {
      localStorage.setItem('medora_faqs', JSON.stringify(updatedList));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload = {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        sort_order: faq.sortOrder
      };
      const { error } = await supabase.from('faqs').upsert(payload);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteFAQ = async (id: string): Promise<boolean> => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_faqs', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const upsertKnowledge = async (entry: Partial<ChatbotKnowledge>): Promise<boolean> => {
    let updatedList: ChatbotKnowledge[];
    if (!entry.id) {
      const newEntry: ChatbotKnowledge = {
        id: 'k_' + Math.random().toString(36).substr(2, 9),
        keyword: (entry.keyword || 'keyword').toLowerCase(),
        responseText: entry.responseText || 'Response text'
      };
      updatedList = [newEntry, ...knowledge];
    } else {
      updatedList = knowledge.map(k => k.id === entry.id ? { ...k, ...entry, keyword: entry.keyword ? entry.keyword.toLowerCase() : k.keyword } as ChatbotKnowledge : k);
    }
    setKnowledge(updatedList);

    if (isDemoMode) {
      localStorage.setItem('medora_knowledge', JSON.stringify(updatedList));
      return true;
    }

    if (!supabase) return false;
    try {
      const payload: any = { id: entry.id };
      if (knowledgeSchema === 'legacy') {
        payload.keyword = entry.keyword?.toLowerCase();
        payload.response_text = entry.responseText;
      } else {
        payload.title = entry.keyword;
        payload.content = entry.responseText;
        payload.is_active = true;
      }
      const { error } = await supabase.from('chatbot_knowledge').upsert(payload);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteKnowledge = async (id: string): Promise<boolean> => {
    const updated = knowledge.filter(k => k.id !== id);
    setKnowledge(updated);

    if (isDemoMode) {
      localStorage.setItem('medora_knowledge', JSON.stringify(updated));
      return true;
    }

    if (!supabase) return false;
    try {
      const { error } = await supabase.from('chatbot_knowledge').delete().eq('id', id);
      return !error;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <DbContext.Provider value={{
      isDemo: isDemoMode,
      settings,
      features,
      doctors,
      testimonials,
      plans,
      blogs,
      faqs,
      appointments,
      contactMessages,
      chatMessages,
      knowledge,
      updateSettings,
      upsertDoctor,
      deleteDoctor,
      upsertFeature,
      deleteFeature,
      upsertBlog,
      deleteBlog,
      upsertPlan,
      deletePlan,
      createAppointment,
      updateAppointmentStatus,
      createContactMessage,
      markContactMessageRead,
      deleteContactMessage,
      saveChatMessage,
      getChatHistory,
      clearChatHistory,
      upsertFAQ,
      deleteFAQ,
      upsertKnowledge,
      deleteKnowledge
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) throw new Error('useDb must be used within a DbProvider');
  return context;
};
