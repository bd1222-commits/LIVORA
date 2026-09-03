-- 1. Create Visits Table for Analytics
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  path TEXT,
  session_id TEXT
);

-- Enable RLS on visits
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT visits (so tracking works for normal users)
CREATE POLICY "Public can insert visits" ON public.visits
FOR INSERT TO public, anon, authenticated
WITH CHECK (true);

-- Only admins can SELECT visits
CREATE POLICY "Admins can view visits" ON public.visits
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 2. Create Storage Bucket for Images (If it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('livora-storage', 'livora-storage', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow public to read images
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT TO public, anon, authenticated 
USING (bucket_id = 'livora-storage');

-- Allow admins to insert/upload images
CREATE POLICY "Admin Upload" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'livora-storage' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Allow admins to update images
CREATE POLICY "Admin Update" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'livora-storage' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Allow admins to delete images
CREATE POLICY "Admin Delete" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'livora-storage' AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 3. Add Global Brand Column to Products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_global_brand BOOLEAN DEFAULT false;
