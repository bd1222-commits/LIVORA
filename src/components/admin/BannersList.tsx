import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit3, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export const BannersList: React.FC = () => {
  const { heroSlides, navigateTo, refreshAllData, showToast } = useStore();

  const mainSlides = heroSlides.filter(s => String(s._id || s.id).startsWith('hero-'));
  const promoSlide = heroSlides.find(s => String(s._id || s.id) === 'promo-1');

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البانر؟')) {
      try {
        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) throw error;
        showToast('تم الحذف', 'تم حذف البانر بنجاح', 'success');
        refreshAllData();
      } catch (err: any) {
        showToast('خطأ', 'فشل حذف البانر: ' + err.message, 'info');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">إدارة البانرات (الرئيسية)</h2>
        <button
          onClick={() => navigateTo('admin', { adminPath: '/banners/new' })}
          className="bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة بانر</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainSlides.map((slide) => (
          <div key={slide._id || slide.id} className="bg-[#1C1C1C] border border-white/5 rounded-2xl overflow-hidden group">
            <div className="h-48 relative">
              {slide.image ? (
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-stone-500" />
                </div>
              )}
              {!slide.active && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  غير مفعل
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1 truncate">{slide.title}</h3>
              <p className="text-sm text-stone-400 mb-4 truncate">{slide.subtitle}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-stone-500">الترتيب: {slide.displayOrder}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateTo('admin', { adminPath: `/banners/${slide._id || slide.id}` })}
                    className="p-2 bg-white/5 text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#171717] rounded-lg transition-colors cursor-pointer"
                    title="تعديل البانر"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id || slide.id)}
                    className="p-2 bg-white/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="حذف البانر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">بانر العروض الخاصة (الثابت)</h2>
            <p className="text-sm text-stone-400 mt-1">يظهر هذا البانر في قسم مستقل أسفل المنتجات في الصفحة الرئيسية.</p>
          </div>
          {!promoSlide && (
            <button
              onClick={() => navigateTo('admin', { adminPath: '/banners/promo-1' })}
              className="bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إنشاء بانر العروض</span>
            </button>
          )}
        </div>

        {promoSlide && (
          <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl overflow-hidden group max-w-2xl">
            <div className="h-64 relative">
              {promoSlide.image ? (
                <img src={promoSlide.image} alt={promoSlide.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-stone-500" />
                </div>
              )}
              {!promoSlide.active && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  غير مفعل
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1 truncate">{promoSlide.title}</h3>
              <p className="text-sm text-stone-400 mb-4 truncate">{promoSlide.description || promoSlide.subtitle}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xs text-stone-500">بانر ثابت واحد</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateTo('admin', { adminPath: '/banners/promo-1' })}
                    className="p-2 bg-white/5 text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#171717] rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-bold">تعديل</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
