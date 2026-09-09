import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { ImageUploader } from './ImageUploader';

export const BannerForm: React.FC<{ bannerId?: string }> = ({ bannerId }) => {
  const { heroSlides, navigateTo, refreshAllData, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState(false);

  const runDiagnostic = async () => {
    if (!bannerId) return alert('يرجى حفظ البانر كجديد أولاً أو تعديل بانر موجود لتشغيل الفحص.');
    try {
      setDiagnosticMode(true);
      const log = [];
      log.push('=== بدء تشخيص مسار التعديل ===');
      
      // 1. Get Auth Session
      const { data: authData, error: authError } = await supabase.auth.getUser();
      log.push('\n[1] فحص جلسة الأدمن:');
      log.push('User ID: ' + (authData?.user?.id || 'لا يوجد'));
      log.push('User Email: ' + (authData?.user?.email || 'لا يوجد'));
      if (authError) log.push('Auth Error: ' + authError.message);

      // 2. Select Record
      log.push('\n[2] تجربة SELECT لنفس البانر (' + bannerId + '):');
      const { data: selData, error: selError } = await supabase.from('hero_slides').select('*').eq('id', bannerId);
      if (selError) log.push('SELECT Error: ' + selError.message);
      else log.push('SELECT Result: ' + (selData?.length || 0) + ' صفوف وجدت');

      // 3. Attempt Update
      log.push('\n[3] تجربة UPDATE لنفس البانر:');
      const dummyUpdate = { title: formData.title + ' (اختبار)' };
      const { data: upData, error: upError, count } = await supabase
        .from('hero_slides')
        .update(dummyUpdate)
        .eq('id', bannerId)
        .select('*');

      if (upError) {
        log.push('UPDATE Error: ' + upError.message + ' (الكود: ' + upError.code + ')');
      } else {
        log.push('UPDATE Success (No Errors thrown)');
        log.push('الصفوف التي تم تعديلها فعلياً: ' + (upData?.length || 0));
        if (!upData || upData.length === 0) {
          log.push('النتيجة: 0 صفوف. هذا يعني أن RLS (UPDATE Policy) منع العملية بالرغم من عدم وجود خطأ، أو أن ID غير موجود.');
        } else {
          log.push('النتيجة: تم التعديل بنجاح! السجل الجديد عنوانه: ' + upData[0].title);
          // Revert the update
          await supabase.from('hero_slides').update({ title: formData.title }).eq('id', bannerId);
        }
      }

      alert(log.join('\n'));
    } catch (e: any) {
      alert('خطأ أثناء التشخيص: ' + e.message);
    } finally {
      setDiagnosticMode(false);
    }
  };
  const [fetchingData, setFetchingData] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    badge: '',
    order: 0,
    active: true,
  });

  useEffect(() => {
    const loadBannerData = async () => {
      if (!bannerId) return;

      setFetchingData(true);

      // 1. Try finding in context first
      const contextSlide = heroSlides.find((b) => b._id === bannerId || (b as any).id === bannerId);
      if (contextSlide) {
        setFormData({
          title: contextSlide.title || '',
          subtitle: contextSlide.subtitle || '',
          description: contextSlide.description || '',
          image: contextSlide.image || '',
          ctaText: contextSlide.ctaText || '',
          ctaLink: contextSlide.ctaLink || '',
          badge: contextSlide.badge || '',
          order: contextSlide.order ?? (contextSlide as any).displayOrder ?? 0,
          active: contextSlide.active ?? true,
        });
      }

      // 2. Fetch directly from Supabase to guarantee exact current content
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('id', bannerId)
          .single();

        if (data && !error) {
          setFormData({
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            image: data.image || '',
            ctaText: data.cta_text || '',
            ctaLink: data.cta_link || '',
            badge: data.badge || '',
            order: data.display_order ?? 0,
            active: data.active ?? true,
          });
        }
      } catch (err) {
        console.error('Error loading banner from Supabase:', err);
      } finally {
        setFetchingData(false);
      }
    };

    loadBannerData();
  }, [bannerId, heroSlides]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dbData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      image: formData.image,
      cta_text: formData.ctaText,
      cta_link: formData.ctaLink,
      badge: formData.badge,
      display_order: Number(formData.order) || 0,
      active: formData.active,
    };

    try {
      if (bannerId) {
        const updateResult = await supabase
          .from('hero_slides')
          .update(dbData)
          .eq('id', bannerId)
          .select('*'); // Select all to see what is returned
        
        console.log('Update Result for ID', bannerId, ':', updateResult);
        
        const { data, error, count } = updateResult;

        if (error) {
          console.error('Supabase Update Error:', error);
          throw new Error('خطأ في قاعدة البيانات: ' + error.message);
        }
        
        if (!data || data.length === 0) {
          console.warn('Update returned 0 rows for ID:', bannerId);
          throw new Error('لم يتم تعديل السجل في Supabase. تحديث 0 صفوف. (قد يكون RLS يمنع التحديث أو أن الـ ID غير موجود)');
        }
        showToast('تم التعديل', 'تم حفظ التعديلات على البانر بنجاح', 'success');
      } else {
        const newId = 'hero-' + Date.now();
        const { data, error } = await supabase
          .from('hero_slides')
          .insert([{ id: newId, ...dbData }])
          .select();

        if (error) throw error;
        showToast('تمت الإضافة', 'تمت إضافة البانر بنجاح', 'success');
      }
      await refreshAllData();
      navigateTo('admin', { adminPath: '/banners' });
    } catch (err: any) {
      showToast('خطأ', err.message || 'فشلت عملية الحفظ', 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigateTo('admin', { adminPath: '/banners' })}
          className="p-2 bg-white/5 text-stone-300 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          title="رجوع للقائمة"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">
          {bannerId ? 'تعديل بيانات ومحتوى البانر' : 'إضافة بانر جديد'}
        </h2>
        {fetchingData && (
          <div className="flex items-center gap-1.5 text-xs text-[#C8A96B] animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري تحميل المحتوى الحالي...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1F1F1F] rounded-2xl p-6 border border-white/10 shadow-lg space-y-6">
        <ImageUploader 
          label="صورة البانر الرئيسية *" 
          value={formData.image} 
          onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
        />

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">الشارة العلويـة (Badge)</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="مثال: تخفيضات موسمية حصرية"
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">النص الفرعي (Subtitle)</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="مثال: تشكيلة ليفورا الجديدة لعام 2026"
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">العنوان الرئيسي (Headline / Title)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="مثال: لمسة فخامة في كل تفصيل"
            required
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">الوصف التفصيلي (Description)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="اكتشفي تشكيلتنا المختارة بعناية..."
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">نص الزر (CTA Text)</label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="مثال: اكتشفي التشكيلة"
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">رابط الزر (CTA Link)</label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              placeholder="/products"
              dir="ltr"
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">ترتيب العرض (Order)</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div className="flex items-center pt-2 sm:pt-7">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/5 border border-white/10 w-full">
              <input 
                type="checkbox" 
                name="active" 
                checked={formData.active} 
                onChange={handleChange} 
                className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" 
              />
              <span className="text-sm font-bold text-stone-300">تفعيل البانر (نشط في المتجر)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigateTo('admin', { adminPath: '/banners' })}
            className="flex-1 bg-[#1C1C1C] border border-white/10 hover:bg-white/5 text-white py-3 rounded-xl font-bold transition-colors"
          >
            إلغاء
          </button>
          {bannerId && (
            <button
              type="button"
              onClick={runDiagnostic}
              disabled={diagnosticMode}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors"
            >
              {diagnosticMode ? 'جاري التشخيص...' : 'تشخيص حفظ البانر'}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
