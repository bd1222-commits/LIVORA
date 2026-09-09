-- 1. إسقاط السياسة الحالية (إذا كانت موجودة) لتجنب التعارض
DROP POLICY IF EXISTS "Admins can manage hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow public all access on hero_slides" ON public.hero_slides;

-- 2. إنشاء السياسة النهائية القاطعة باستخدام المعرف الفريد للأدمن
CREATE POLICY "Admins can manage hero_slides" 
ON public.hero_slides 
FOR ALL 
TO authenticated 
USING (auth.uid() = '4613146c-3168-48ad-9644-fd10c9fd2a62')
WITH CHECK (auth.uid() = '4613146c-3168-48ad-9644-fd10c9fd2a62');
