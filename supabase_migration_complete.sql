-- =====================================================================
-- MEDORA AI FUTURISTIC HEALTHCARE PLATFORM - COMPLETE DATABASE MIGRATION
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. BASE TABLE DEFINITIONS
-- =====================================================================

-- 1. PROFILES TABLE (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    content JSONB,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FEATURES TABLE
CREATE TABLE IF NOT EXISTS public.features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    bio TEXT,
    experience_years INT DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.00,
    consultation_fee NUMERIC DEFAULT 0,
    image_url TEXT,
    availability JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    message TEXT NOT NULL,
    rating INT DEFAULT 5,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PRICING PLANS TABLE
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    billing_period TEXT DEFAULT 'month',
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PRICING FEATURES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_id UUID REFERENCES public.pricing_plans(id) ON DELETE CASCADE NOT NULL,
    feature TEXT NOT NULL,
    included BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

-- 10. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    sender TEXT CHECK (sender IN ('user', 'ai')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. CHATBOT KNOWLEDGE BASE TABLE
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    bucket TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 2. SYSTEM FUNCTIONS & PROCEDURES
-- =====================================================================

-- Trigger Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function: Automatic Profile Creation on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Patient'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=' || NEW.id),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper Function: Check if user is Administrator
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS boolean AS $$
DECLARE
    is_admin_user boolean;
BEGIN
    SELECT (role = 'admin') INTO is_admin_user
    FROM public.profiles
    WHERE id = user_id;
    RETURN COALESCE(is_admin_user, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Function: Action auditing
CREATE OR REPLACE FUNCTION public.log_action()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, metadata)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        jsonb_build_object(
            'old', COALESCE(to_jsonb(OLD), '{}'::jsonb),
            'new', COALESCE(to_jsonb(NEW), '{}'::jsonb)
        )
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 3. BINDING TRIGGERS
-- =====================================================================

-- updated_at triggers
CREATE OR REPLACE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_features_updated_at BEFORE UPDATE ON public.features FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE OR REPLACE TRIGGER update_chatbot_knowledge_updated_at BEFORE UPDATE ON public.chatbot_knowledge FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();

-- signup trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- audit triggers (Critical systems only)
CREATE OR REPLACE TRIGGER audit_site_settings AFTER INSERT OR UPDATE OR DELETE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE public.log_action();
CREATE OR REPLACE TRIGGER audit_doctors AFTER INSERT OR UPDATE OR DELETE ON public.doctors FOR EACH ROW EXECUTE PROCEDURE public.log_action();
CREATE OR REPLACE TRIGGER audit_pricing_plans AFTER INSERT OR UPDATE OR DELETE ON public.pricing_plans FOR EACH ROW EXECUTE PROCEDURE public.log_action();
CREATE OR REPLACE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE public.log_action();
CREATE OR REPLACE TRIGGER audit_faqs AFTER INSERT OR UPDATE OR DELETE ON public.faqs FOR EACH ROW EXECUTE PROCEDURE public.log_action();

-- =====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by owner and admin" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner and admin" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Profiles can be updated by owner and admin" ON public.profiles;
CREATE POLICY "Profiles can be updated by owner and admin" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin(auth.uid())) WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));

-- 2. Site Settings Policies
DROP POLICY IF EXISTS "Allow public read for site_settings" ON public.site_settings;
CREATE POLICY "Allow public read for site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full manage for site_settings" ON public.site_settings;
CREATE POLICY "Allow admin full manage for site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 3. Homepage Sections Policies
DROP POLICY IF EXISTS "Allow public read for homepage_sections" ON public.homepage_sections;
CREATE POLICY "Allow public read for homepage_sections" ON public.homepage_sections FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for homepage_sections" ON public.homepage_sections;
CREATE POLICY "Allow admin full manage for homepage_sections" ON public.homepage_sections FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 4. Features Policies
DROP POLICY IF EXISTS "Allow public read for features" ON public.features;
CREATE POLICY "Allow public read for features" ON public.features FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for features" ON public.features;
CREATE POLICY "Allow admin full manage for features" ON public.features FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 5. Doctors Policies
DROP POLICY IF EXISTS "Allow public read for doctors" ON public.doctors;
CREATE POLICY "Allow public read for doctors" ON public.doctors FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for doctors" ON public.doctors;
CREATE POLICY "Allow admin full manage for doctors" ON public.doctors FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 6. Services Policies
DROP POLICY IF EXISTS "Allow public read for services" ON public.services;
CREATE POLICY "Allow public read for services" ON public.services FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for services" ON public.services;
CREATE POLICY "Allow admin full manage for services" ON public.services FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 7. Testimonials Policies
DROP POLICY IF EXISTS "Allow public read for testimonials" ON public.testimonials;
CREATE POLICY "Allow public read for testimonials" ON public.testimonials FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for testimonials" ON public.testimonials;
CREATE POLICY "Allow admin full manage for testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 8. Pricing Plans Policies
DROP POLICY IF EXISTS "Allow public read for pricing_plans" ON public.pricing_plans;
CREATE POLICY "Allow public read for pricing_plans" ON public.pricing_plans FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for pricing_plans" ON public.pricing_plans;
CREATE POLICY "Allow admin full manage for pricing_plans" ON public.pricing_plans FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 9. Pricing Features Policies
DROP POLICY IF EXISTS "Allow public read for pricing_features" ON public.pricing_features;
CREATE POLICY "Allow public read for pricing_features" ON public.pricing_features FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full manage for pricing_features" ON public.pricing_features;
CREATE POLICY "Allow admin full manage for pricing_features" ON public.pricing_features FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 10. Blog Posts Policies
DROP POLICY IF EXISTS "Allow public read for blog_posts" ON public.blog_posts;
CREATE POLICY "Allow public read for blog_posts" ON public.blog_posts FOR SELECT USING (status = 'published' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for blog_posts" ON public.blog_posts;
CREATE POLICY "Allow admin full manage for blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 11. FAQs Policies
DROP POLICY IF EXISTS "Allow public read for faqs" ON public.faqs;
CREATE POLICY "Allow public read for faqs" ON public.faqs FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for faqs" ON public.faqs;
CREATE POLICY "Allow admin full manage for faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 12. Appointments Policies
DROP POLICY IF EXISTS "Users can read own appointments, admin all" ON public.appointments;
CREATE POLICY "Users can read own appointments, admin all" ON public.appointments FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
CREATE POLICY "Users can create own appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own appointments, admin all" ON public.appointments;
CREATE POLICY "Users can update own appointments, admin all" ON public.appointments FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid())) WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;
CREATE POLICY "Admins can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- 13. Contact Messages Policies
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Only admin can view/manage contact messages" ON public.contact_messages;
CREATE POLICY "Only admin can view/manage contact messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 14. Chat Messages Policies
DROP POLICY IF EXISTS "Users can read own chat messages, admin all" ON public.chat_messages;
CREATE POLICY "Users can read own chat messages, admin all" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can insert own chat messages" ON public.chat_messages;
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own chat messages, admin all" ON public.chat_messages;
CREATE POLICY "Users can delete own chat messages, admin all" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 15. Chatbot Knowledge Policies
DROP POLICY IF EXISTS "Allow public read for chatbot_knowledge" ON public.chatbot_knowledge;
CREATE POLICY "Allow public read for chatbot_knowledge" ON public.chatbot_knowledge FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow admin full manage for chatbot_knowledge" ON public.chatbot_knowledge;
CREATE POLICY "Allow admin full manage for chatbot_knowledge" ON public.chatbot_knowledge FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 16. Media Assets Policies
DROP POLICY IF EXISTS "Allow public select of media assets" ON public.media_assets;
CREATE POLICY "Allow public select of media assets" ON public.media_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can upload their own media assets" ON public.media_assets;
CREATE POLICY "Users can upload their own media assets" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update/delete media assets" ON public.media_assets;
CREATE POLICY "Admins can update/delete media assets" ON public.media_assets FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 17. Audit Logs Policies
DROP POLICY IF EXISTS "Admin full manage for audit_logs" ON public.audit_logs;
CREATE POLICY "Admin full manage for audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================================
-- 5. STORAGE BUCKETS & SECURITY POLICIES
-- =====================================================================

-- Register buckets inside Supabase Storage schema
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('doctors', 'doctors', true, null, null),
  ('blogs', 'blogs', true, null, null),
  ('website', 'website', true, null, null),
  ('reports', 'reports', false, null, null),
  ('media', 'media', true, null, null)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for select/read operations
DROP POLICY IF EXISTS "Allow public read access to public buckets" ON storage.objects;
CREATE POLICY "Allow public read access to public buckets" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('doctors', 'blogs', 'website', 'media'));

-- Secure reports uploading and select (HIPAA Compliant Folders per auth.uid())
DROP POLICY IF EXISTS "Users can upload their own medical reports" ON storage.objects;
CREATE POLICY "Users can upload their own medical reports" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'reports' AND auth.uid()::text = split_part(name, '/', 1));

DROP POLICY IF EXISTS "Users can read their own medical reports" ON storage.objects;
CREATE POLICY "Users can read their own medical reports" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'reports' AND auth.uid()::text = split_part(name, '/', 1));

DROP POLICY IF EXISTS "Users can delete their own medical reports" ON storage.objects;
CREATE POLICY "Users can delete their own medical reports" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'reports' AND auth.uid()::text = split_part(name, '/', 1));

-- Full control for Administrators on all storage objects
DROP POLICY IF EXISTS "Admin full control of all storage" ON storage.objects;
CREATE POLICY "Admin full control of all storage" 
ON storage.objects FOR ALL 
TO authenticated 
USING (public.is_admin(auth.uid())) 
WITH CHECK (public.is_admin(auth.uid()));

-- =====================================================================
-- 6. PREMIUM HEALTHCARE SEED DATA
-- =====================================================================

-- A. SITE SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES
  ('contact_info', '{"phone": "+91 80 4950 2000", "email": "care@medora.ai", "address": "Medora AI Headquarters, Outer Ring Road, Bengaluru, Karnataka, 560103"}'::jsonb),
  ('site_metadata', '{"title": "Medora AI - Futuristic Clinical Care", "description": "An premium AI-powered clinical diagnostics and digital care ecosystem bridging advanced symptoms analysis and worldwide clinical experts."}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- B. HOMEPAGE SECTIONS
INSERT INTO public.homepage_sections (section_key, title, subtitle, content, image_url, sort_order, is_active)
VALUES
  ('hero', 'Cognitive Clinical AI. Immediate Human Healing.', 'Medora AI bridges advanced neural diagnosis with global specialist physicians, delivering high-end medical care 24/7.', '{"cta_primary": "Consult Now", "cta_secondary": "Check Symptoms", "stats": [{"label": "Clinical Accuracy", "value": "99.4%"}, {"label": "Active Physicians", "value": "250+"}, {"label": "Treated Patients", "value": "1.2M+"}]}'::jsonb, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80', 1, true)
ON CONFLICT (section_key) DO NOTHING;

-- C. FEATURES
INSERT INTO public.features (title, description, icon, sort_order, is_active)
VALUES
  ('Instant Cognitive Triage', 'Adaptive clinical symptoms analyzer mapping to thousands of clinical diagnoses within seconds.', 'Activity', 1, true),
  ('EHR Intelligent Extraction', 'Securely upload PDFs or laboratory reports to convert medical data into simple, actionable summaries.', 'FileText', 2, true),
  ('Capsule Tracking & Logistics', 'Micro-scheduled pharmacokinetics reminder engine keeping medicine compliance above 98%.', 'Clock', 3, true),
  ('Global Medical Tele-Presence', 'Secure video links connecting you with top-tier cardiologists, neurologists, and oncologists.', 'Video', 4, true)
ON CONFLICT DO NOTHING;

-- D. SERVICES
INSERT INTO public.services (title, description, icon, sort_order, is_active)
VALUES
  ('Cardiology AI Analytics', 'Advanced remote electrocardiogram diagnostics and dynamic micro-event monitoring.', 'Heart', 1, true),
  ('Neuro-Cognitive Diagnostics', 'AI-assisted brain-aging checks, sleep-architecture tracking, and early neurodegenerative risk assessments.', 'Brain', 2, true),
  ('Genetic Longevity Profiling', 'Full-genome maps highlighting personal cellular lifespan pathways, dietary adjustments, and preventative metrics.', 'Dna', 3, true)
ON CONFLICT DO NOTHING;

-- E. DOCTORS
INSERT INTO public.doctors (id, name, specialization, bio, experience_years, rating, consultation_fee, image_url, availability, is_active)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Dr. Sarah Vance', 'Oncology & Precision Medicine', 'Dr. Sarah Vance is a graduate of Johns Hopkins Medicine with over 15 years of oncology practice, specializing in personalized immunotherapies.', 15, 4.95, 2500, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80', '{"days": ["Monday", "Wednesday", "Friday"], "slots": ["09:00", "11:00", "14:00"]}'::jsonb, true),
  ('b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'Dr. Robert Chen', 'Cardiology & Vascular Health', 'Dr. Chen trained at the Stanford School of Medicine and focuses on non-invasive robotic surgery and predictive cardiovascular assessments.', 12, 4.91, 2200, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80', '{"days": ["Tuesday", "Thursday"], "slots": ["10:00", "13:00", "16:00"]}'::jsonb, true),
  ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Dr. Elena Rostova', 'Neurology & Neural Systems', 'Specializing in neuroplasticity and early cognitive protection, Dr. Rostova completed her fellowship at Heidelberg University.', 18, 4.98, 3000, 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=500&q=80', '{"days": ["Monday", "Tuesday", "Thursday"], "slots": ["09:30", "15:00"]}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- F. TESTIMONIALS
INSERT INTO public.testimonials (name, role, message, rating, image_url, is_active)
VALUES
  ('Marcus Aurelius', 'Chronic Hypertension Patient', 'The Cognitive Symptom Checker identified a high-risk micro-arrhythmia before any clinical signs showed. Dr. Chen set up a preventative plan that saved my life.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', true),
  ('Aria Thorne', 'Precision Longevity Enthusiast', 'My genomic lifespan plan on Medora AI helped resolve years of metabolic fatigue. The dashboard is spectacular and extremely advanced.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', true),
  ('Dr. Kenneth Cole', 'Independent Medical Auditor', 'As a clinician, I was highly skeptical of AI triage. However, Medora AI has demonstrated clinical accuracy and safety protocols that meet gold standards.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', true)
ON CONFLICT DO NOTHING;

-- G. PRICING PLANS & FEATURES
WITH new_plans AS (
  INSERT INTO public.pricing_plans (id, name, description, price, currency, billing_period, is_popular, is_active, sort_order)
  VALUES
    ('11111111-1111-1111-1111-111111111111', 'Care Essential', 'Advanced AI health tracking and initial symptoms triage checks.', 999, 'INR', 'month', false, true, 1),
    ('22222222-2222-2222-2222-222222222222', 'Care Premium', 'Complete diagnostic support and regular video calls with clinical specialists.', 2999, 'INR', 'month', true, true, 2),
    ('33333333-3333-3333-3333-333333333333', 'Care Elite', 'The ultimate precision longevity service combining full genetics and personal doctor routing.', 7999, 'INR', 'month', false, true, 3)
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
SELECT 1;

-- Seed pricing features for Essential Plan
INSERT INTO public.pricing_features (plan_id, feature, included, sort_order)
VALUES
  ('11111111-1111-1111-1111-111111111111', '24/7 AI Triage Assistant', true, 1),
  ('11111111-1111-1111-1111-111111111111', 'EHR Report Summary (Up to 3/mo)', true, 2),
  ('11111111-1111-1111-1111-111111111111', 'Capsule Logistics tracker', true, 3),
  ('11111111-1111-1111-1111-111111111111', 'Basic Wearable Sync', true, 4),
  ('11111111-1111-1111-1111-111111111111', 'Video Consultations', false, 5)
ON CONFLICT DO NOTHING;

-- Seed pricing features for Premium Plan
INSERT INTO public.pricing_features (plan_id, feature, included, sort_order)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Everything in Care Essential', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Unlimited EHR Report Summarization', true, 2),
  ('22222222-2222-2222-2222-222222222222', '2 Direct Video consultations/mo', true, 3),
  ('22222222-2222-2222-2222-222222222222', 'Personal Bio-Marker Alerts', true, 4),
  ('22222222-2222-2222-2222-222222222222', 'Priority Care Concierge', true, 5)
ON CONFLICT DO NOTHING;

-- Seed pricing features for Elite Plan
INSERT INTO public.pricing_features (plan_id, feature, included, sort_order)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Everything in Care Premium', true, 1),
  ('33333333-3333-3333-3333-333333333333', 'Monthly Video Consultations (Unlimited)', true, 2),
  ('33333333-3333-3333-3333-333333333333', 'Full Genetics Longevity Mapping', true, 3),
  ('33333333-3333-3333-3333-333333333333', 'Home Laboratory Blood Collection', true, 4),
  ('33333333-3333-3333-3333-333333333333', '24/7 Direct Physician Hotline', true, 5)
ON CONFLICT DO NOTHING;

-- H. FAQS
INSERT INTO public.faqs (question, answer, category, sort_order, is_active)
VALUES
  ('How clinically accurate is the Medora AI Symptom Checker?', 'The Medora AI Symptom Checker leverages a highly refined clinical knowledge graph cross-referenced with thousands of peer-reviewed diagnoses. While it achieves 99.4% clinical triage accuracy, it is designed for diagnostic navigation and should never replace final human clinical evaluations.', 'General', 1, true),
  ('How are my medical reports and health documents secured?', 'We employ strict HIPAA-aligned data segregation. All medical uploads, laboratory summaries, and health profile logs are protected via End-to-End Encryption and accessed only by your authorized physicians. We never sell or share user clinical files.', 'Security', 2, true),
  ('Can I link my smart wearable devices to the platform?', 'Absolutely. Medora AI seamlessly syncs metrics from Apple Health, Google Fit, Fitbit, Oura Ring, and WHOOP, monitoring cardiac variations, respiratory patterns, and sleep architectures in real-time to alert you of potential bio-marker dips.', 'Technical', 3, true),
  ('What is the response time for specialist consultations?', 'Under our Premium and Elite memberships, video link calls with general practitioners are initialized within 15 minutes. For specialist consultations (Cardiology, Neurology, Oncology), requests are booked and approved within 2-4 hours.', 'Services', 4, true)
ON CONFLICT DO NOTHING;

-- I. BLOG POSTS
INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image_url, author, tags, status, published_at)
VALUES
  ('Decoding Longevity: The Science of Cellular Autophagy', 'decoding-longevity-science-cellular-autophagy', 'Discover how dietary pacing and targeted sirtuin activators trigger autophagy to slow biological aging.', 'Cellular aging is governed by nutrient-sensing pathways that detect changes in glucose, amino acids, and energy stores. In this deep clinical study, we explore how fasting mimetics, lifestyle interventions, and precise caloric pacing stimulate autophagy—the body''s cellular waste removal mechanism. By cleaning out accumulated molecular debris, Autophagy supports mitochondrial density, reduces vascular inflammation, and enhances overall cognitive vitality. Read on to learn about specific longevity biomarkers and clinical interventions.', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80', 'Dr. Sarah Vance', ARRAY['Longevity', 'Autophagy', 'Cellular Health'], 'published', timezone('utc'::text, now() - INTERVAL '2 days')),
  ('Mitochondrial Health: The Powerhouse of Preventive Medicine', 'mitochondrial-health-powerhouse-preventive-medicine', 'Why optimizing your mitochondrial output is the single most important preventative shield against metabolic syndromes.', 'Mitochondria are far more than energy powerhouses; they are crucial signaling hubs that govern cellular apoptosis, calcium homeostasis, and immune-inflammatory cascades. As we age, mitochondrial respiration declines, leading to chronic oxidative stress and metabolic fatigue. This comprehensive medical guide provides a deep-dive analysis of clinical supplements (such as CoQ10, PQQ, and NAD+ precursors), high-intensity interval training (HIIT) protocols, and structural sleep optimizations engineered to preserve mitochondrial plasticity and prevent insulin resistance.', 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80', 'Dr. Robert Chen', ARRAY['Preventive Medicine', 'Metabolic Health', 'Mitochondria'], 'published', timezone('utc'::text, now() - INTERVAL '5 days'))
ON CONFLICT (slug) DO NOTHING;

-- J. CHATBOT KNOWLEDGE BASE
INSERT INTO public.chatbot_knowledge (title, content, category, is_active)
VALUES
  ('Autophagy & Longevity', 'Cellular autophagy is the body''s natural purification system that clears out damaged proteins and organelles. It is stimulated by: 1. Caloric pacing or fasting (16-18 hours). 2. High-intensity aerobic conditioning. 3. Sirtuin activators like Resveratrol or Spermidine. Optimizing autophagy supports vascular elastance and decreases cellular aging indicators.', 'Longevity', true),
  ('Symptom Triage Protocol', 'If you are experiencing acute chest discomfort, shortness of breath, sudden facial droop, or severe limb weakness, please call emergency services immediately. These signs suggest acute cardiovascular or neurological distress. For minor symptoms like low-grade fevers or digestive discomfort, ensure high hydration, rest, and log your temperature in the Care portal.', 'Clinical Triage', true),
  ('EHR Upload Assistance', 'To summarize a medical document, log in to your Medora AI Dashboard, navigate to the Health Reports page, and click "Upload Laboratory PDF". Our medical parser will instantly analyze and summarize your blood panels, liver markers, and lipid levels into clean, patient-friendly guidance.', 'Platform Navigation', true),
  ('Appointment Rescheduling', 'Appointments can be fully managed, rescheduled, or cancelled directly inside the Appointments tab of your User Dashboard. To prevent clinical queue delays, please request changes or cancellations at least 12 hours prior to your scheduled consultation slot.', 'Policy & Billing', true),
  ('Cardiovascular Risk Reduction', 'Maintaining a healthy cardiovascular shield relies on key metrics: 1. Keeping resting heart rate between 50-70 BPM. 2. Engaging in 150 minutes of zone-2 aerobic activity weekly. 3. Consuming omega-3 fatty acids and maintaining high soluble fiber intake. You can log smart wearable biometric records on your dashboard to map vascular aging.', 'Cardiology', true)
ON CONFLICT DO NOTHING;
