-- ==============================================================================
-- SQL Fix for Banner Saving (hero_slides table RLS policies)
-- ==============================================================================
-- قم بتشغيل هذا النص في Supabase SQL Editor لتمكين لوحة الأدمن من تعديل البانرات
-- ==============================================================================

-- 1. إسقاط السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Allow public read access on hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow public write access on hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow public all access on hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can manage hero_slides" ON public.hero_slides;

-- 2. إضافة سياسة كاملة (SELECT, INSERT, UPDATE, DELETE) لجميع المستخدمين والأدمن
CREATE POLICY "Allow public all access on hero_slides" 
ON public.hero_slides 
FOR ALL 
TO public, anon, authenticated 
USING (true) 
WITH CHECK (true);
