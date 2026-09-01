-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can read the admins table (and the user themselves)
CREATE POLICY "Admins can read admins" ON public.admins FOR SELECT TO authenticated USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- 2. Update RLS on Products and Categories
-- First, drop any existing ALL/INSERT/UPDATE/DELETE policies that might be open
-- (We assume SELECT is already public, so we don't drop SELECT policies unless needed, but let's be explicit)

-- Products
DROP POLICY IF EXISTS "Allow authenticated full access on products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Categories
DROP POLICY IF EXISTS "Allow authenticated full access on categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Hero Slides
DROP POLICY IF EXISTS "Allow authenticated full access on hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can manage hero_slides" ON public.hero_slides;
CREATE POLICY "Admins can manage hero_slides" ON public.hero_slides
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Testimonials
DROP POLICY IF EXISTS "Allow authenticated full access on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Site Settings
DROP POLICY IF EXISTS "Allow authenticated full access on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site_settings" ON public.site_settings;
CREATE POLICY "Admins can manage site_settings" ON public.site_settings
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 3. Storage Policies (Assuming bucket is called 'livora-images')
-- You must manually create the bucket 'livora-images' in Supabase dashboard.
-- Then these policies will secure it.
-- Note: Replace 'livora-images' with your actual bucket name if different.
/*
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'livora-images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'livora-images' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'livora-images' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'livora-images' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
*/
