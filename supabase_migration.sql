-- =====================================================================
-- MEDORA AI FUTURISTIC HEALTHCARE PLATFORM - DATABASE SCHEMA MIGRATION
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    heart_rate INT DEFAULT 72,
    health_score INT DEFAULT 92,
    sleep_quality INT DEFAULT 75,
    email TEXT
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    section_name TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- 4. FEATURES TABLE (Services & Platform capabilities)
CREATE TABLE IF NOT EXISTS public.features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- 5. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    experience TEXT,
    rating NUMERIC(3,2) DEFAULT 5.0,
    consultation_fee NUMERIC DEFAULT 0,
    image_url TEXT,
    availability TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 7. PRICING PLANS TABLE
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    period TEXT DEFAULT 'month',
    is_popular BOOLEAN DEFAULT false,
    cta_text TEXT DEFAULT 'Get Started',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- 8. PRICING FEATURES TABLE
CREATE TABLE IF NOT EXISTS public.pricing_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_id UUID REFERENCES public.pricing_plans(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pricing_features ENABLE ROW LEVEL SECURITY;

-- 9. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author_name TEXT,
    author_avatar TEXT,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 10. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 11. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 12. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    reply_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 13. CHAT MESSAGES TABLE (AI Chat history)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 14. CHATBOT KNOWLEDGE TABLE (Admin QA configuration)
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    keyword TEXT NOT NULL UNIQUE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- 15. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- 16. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- =====================================================================
-- ADMINISTRATIVE & HELPER FUNCTIONS
-- =====================================================================

-- Helper to check if user has admin role
CREATE OR REPLACE FUNCTION public.check_is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN (user_role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public Read-Only Content Tables (Settings, Sections, Features, Doctors, Testimonials, Pricing, Blogs, FAQs, Knowledge)
CREATE POLICY "Anyone can select site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can select homepage sections" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Anyone can select features" ON public.features FOR SELECT USING (true);
CREATE POLICY "Anyone can select active doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Anyone can select testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Anyone can select pricing plans" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can select pricing features" ON public.pricing_features FOR SELECT USING (true);
CREATE POLICY "Anyone can select published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published' OR check_is_admin(auth.uid()));
CREATE POLICY "Anyone can select FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Anyone can select chatbot knowledge" ON public.chatbot_knowledge FOR SELECT USING (true);

-- Admin Write Policies for Core Site Content
CREATE POLICY "Admins can modify site settings" ON public.site_settings FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify homepage sections" ON public.homepage_sections FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify features" ON public.features FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify doctors" ON public.doctors FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify testimonials" ON public.testimonials FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify pricing plans" ON public.pricing_plans FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify pricing features" ON public.pricing_features FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify blog posts" ON public.blog_posts FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify FAQs" ON public.faqs FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify chatbot knowledge" ON public.chatbot_knowledge FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can modify media assets" ON public.media_assets FOR ALL USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (check_is_admin(auth.uid()));
CREATE POLICY "Admins can write audit logs" ON public.audit_logs FOR INSERT WITH CHECK (check_is_admin(auth.uid()));

-- Appointments Policies
CREATE POLICY "Users can view their own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id OR check_is_admin(auth.uid()));

CREATE POLICY "Users can create their own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = user_id OR check_is_admin(auth.uid()));

CREATE POLICY "Admins can delete appointments" ON public.appointments
    FOR DELETE USING (check_is_admin(auth.uid()));

-- Contact Messages Policies
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view/modify contact messages" ON public.contact_messages
    FOR ALL USING (check_is_admin(auth.uid()));

-- Chat Messages Policies
CREATE POLICY "Users can view their own chats" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id OR check_is_admin(auth.uid()));

CREATE POLICY "Users can insert their own chats" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can delete chats" ON public.chat_messages
    FOR DELETE USING (check_is_admin(auth.uid()));


-- =====================================================================
-- PROFILE AUTO-CREATION TRIGGER ON AUTH SIGNUP
-- =====================================================================

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Medora Member'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    'user',
    new.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run handle_new_user() on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
