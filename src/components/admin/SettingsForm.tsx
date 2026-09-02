import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export const SettingsForm: React.FC = () => {
  const { siteSettings, refreshAllData, showToast } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    storeNameEn: '',
    tagline: '',
    whatsappNumber: '',
    instagram: '',
    tiktok: '',
    snapchat: '',
    storeDescription: '',
    footerText: '',
    address: '',
    email: '',
    phone: '',
    workingHours: '',
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        storeName: siteSettings.storeName || '',
        storeNameEn: siteSettings.storeNameEn || '',
        tagline: siteSettings.tagline || '',
        whatsappNumber: siteSettings.whatsappNumber || '',
        instagram: siteSettings.instagram || '',
        tiktok: siteSettings.tiktok || '',
        snapchat: siteSettings.snapchat || '',
        storeDescription: siteSettings.storeDescription || '',
        footerText: siteSettings.footerText || '',
        address: siteSettings.contactInformation?.address || '',
        email: siteSettings.contactInformation?.email || '',
        phone: siteSettings.contactInformation?.phone || '',
        workingHours: siteSettings.contactInformation?.workingHours || '',
      });
    }
  }, [siteSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dbData = {
      store_name: formData.storeName,
      store_name_en: formData.storeNameEn,
      tagline: formData.tagline,
      whatsapp_number: formData.whatsappNumber,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      snapchat: formData.snapchat,
      store_description: formData.storeDescription,
      footer_text: formData.footerText,
      contact_information: {
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        workingHours: formData.workingHours,
      }
    };

    try {
      const { error } = await supabase.from('site_settings').update(dbData).eq('id', 'main_settings');
      if (error) throw error;
      showToast('تم الحفظ', 'تم تحديث إعدادات المتجر بنجاح', 'success');
      refreshAllData();
    } catch (err: any) {
      showToast('خطأ', 'فشل حفظ الإعدادات: ' + err.message, 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B] mb-6">إعدادات المتجر</h2>

      <form onSubmit={handleSubmit} className="bg-[#1F1F1F] rounded-2xl p-6 border border-white/10 shadow-lg space-y-8">
        
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">المعلومات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">اسم المتجر (بالعربية)</label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">اسم المتجر (بالإنجليزية)</label>
              <input type="text" name="storeNameEn" value={formData.storeNameEn} onChange={handleChange} dir="ltr" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-300 mb-2">الوصف المختصر (Tagline)</label>
              <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">روابط التواصل الاجتماعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رقم الواتساب (بدون أصفار)</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} dir="ltr" placeholder="967737462144" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رابط الانستجرام</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} dir="ltr" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رابط التيك توك</label>
              <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} dir="ltr" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رابط السناب شات</label>
              <input type="text" name="snapchat" value={formData.snapchat} onChange={handleChange} dir="ltr" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">معلومات التواصل والتذييل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">العنوان</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رقم هاتف إضافي</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} dir="ltr" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} dir="ltr" className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">أوقات العمل</label>
              <input type="text" name="workingHours" value={formData.workingHours} onChange={handleChange} className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-300 mb-2">نص حقوق النشر (Footer)</label>
              <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]" />
            </div>
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
