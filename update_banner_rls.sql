-- 1. إسقاط السياسة الحالية (إذا كانت موجودة) التي تمنع الأدمن من التعديل بسبب جدول admins
DROP POLICY IF EXISTS "Admins can manage hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow public all access on hero_slides" ON public.hero_slides;

-- 2. إنشاء سياسة تسمح للأدمن (بناءً على بريده الإلكتروني) بإدارة البنرات (UPDATE, INSERT, DELETE)
CREATE POLICY "Admins can manage hero_slides" 
ON public.hero_slides 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'bdallhdkyk22@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'bdallhdkyk22@gmail.com');
