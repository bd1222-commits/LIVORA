import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { ImageUploader } from './ImageUploader';

export const BannerForm: React.FC<{ bannerId?: string }> = ({ bannerId }) => {
  const { heroSlides, navigateTo, refreshAllData, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  
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
    if (bannerId) {
      const banner = heroSlides.find((b) => b.id === bannerId);
      if (banner) {
        setFormData({
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          description: banner.description || '',
          image: banner.image || '',
          ctaText: banner.ctaText || '',
          ctaLink: banner.ctaLink || '',
          badge: banner.badge || '',
          order: banner.displayOrder || 0,
          active: banner.active ?? true,
        });
      }
    }
  }, [bannerId, heroSlides]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
      display_order: formData.order,
      active: formData.active,
    };

    try {
      if (bannerId) {
        const { error } = await supabase.from('hero_slides').update(dbData).eq('id', bannerId);
        if (error) throw error;
        showToast('تم التعديل', 'تم تعديل البانر بنجاح', 'success');
      } else {
        const { error } = await supabase.from('hero_slides').insert([dbData]);
        if (error) throw error;
        showToast('تمت الإضافة', 'تمت إضافة البانر بنجاح', 'success');
      }
      refreshAllData();
      navigateTo('admin', { adminPath: '/banners' });
    } catch (err: any) {
      showToast('خطأ', err.message || 'فشلت العملية', 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigateTo('admin', { adminPath: '/banners' })}
          className="p-2 bg-white/5 text-stone-300 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">
          {bannerId ? 'تعديل البانر' : 'إضافة بانر جديد'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1F1F1F] rounded-2xl p-6 border border-white/10 shadow-lg space-y-6">
        <ImageUploader 
          label="صورة البانر *" 
          value={formData.image} 
          onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
        />

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">العنوان الرئيسي</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">النص الفرعي</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">الوصف</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">نص الزر</label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">رابط الزر</label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">الشارة (Badge)</label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">الترتيب</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
            />
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" />
              <span className="text-sm font-bold text-stone-300">مفعل</span>
            </label>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
