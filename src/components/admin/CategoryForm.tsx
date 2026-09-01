import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Save, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { ImageUploader } from './ImageUploader';

export const CategoryForm: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
  const { categories, navigateTo, refreshAllData, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    description: '',
    order: 0,
    active: true,
  });

  useEffect(() => {
    if (categoryId) {
      const cat = categories.find((c) => c._id.toString() === categoryId.toString());
      if (cat) {
        setFormData({
          name: cat.name,
          slug: cat.slug.current,
          image: cat.image,
          description: cat.description || '',
          order: cat.order || 0,
          active: cat.active ?? true,
        });
      }
    }
  }, [categoryId, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => {
        const updates: any = { [name]: value };
        if (name === 'name' && !categoryId) {
          updates.slug = value.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '').trim().replace(/\s+/g, '-');
        }
        return { ...prev, ...updates };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dbData = {
      name: formData.name,
      slug: formData.slug,
      image: formData.image,
      description: formData.description,
      display_order: formData.order,
      active: formData.active,
    };

    try {
      if (categoryId) {
        const { error } = await supabase.from('categories').update(dbData).eq('id', categoryId);
        if (error) throw error;
        showToast('تم التعديل', 'تم تعديل التصنيف بنجاح', 'success');
      } else {
        const { error } = await supabase.from('categories').insert([dbData]);
        if (error) throw error;
        showToast('تمت الإضافة', 'تمت إضافة التصنيف بنجاح', 'success');
      }
      refreshAllData();
      navigateTo('admin', { adminPath: '/categories' });
    } catch (err: any) {
      showToast('خطأ', err.message || 'فشلت العملية', 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('admin', { adminPath: '/categories' })}
            className="p-2 bg-white/5 text-stone-300 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">
            {categoryId ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1F1F1F] rounded-2xl p-6 border border-white/10 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">اسم التصنيف *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">الرابط (Slug) *</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            dir="ltr"
            className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <ImageUploader 
          label="صورة التصنيف *" 
          value={formData.image} 
          onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
        />

        <div>
          <label className="block text-sm font-bold text-stone-300 mb-2">وصف التصنيف</label>
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
              <span className="text-sm font-bold text-stone-300">تصنيف فعّال (ظاهر للعملاء)</span>
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
