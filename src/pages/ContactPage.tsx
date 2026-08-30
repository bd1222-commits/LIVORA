import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Instagram, MapPin, Phone, Mail, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { siteSettings, triggerConfetti, showToast } = useStore();

  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('صنعاء');
  const [formType, setFormType] = useState('طلب منتج خاص');
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      showToast('يرجى كتابة اسمكِ ورسالتكِ', undefined, 'info');
      return;
    }

    const formatted = `السلام عليكم ورحمة الله،
أنا: ${formName} من مدينة ${formCity}
نوع الاستفسار: ${formType}

الرسالة:
${formMessage}`;

    triggerConfetti();
    showToast('جارٍ فتح محادثة الواتساب مع خدمة عملاء ليفورا...', undefined, 'gold');
    openWhatsApp(siteSettings.whatsappNumber, formatted);
  };

  return (
    <div className="py-16 bg-[#F6F0E8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C8A96B] uppercase tracking-wider mb-2">
            <MessageCircle className="w-4 h-4 text-[#C8A96B]" />
            <span>تواصل مباشر مع LIVORA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#171717]">
            يسعدنا دائماً الاستماع إليكِ
          </h1>
          <p className="text-sm text-stone-600 mt-3">
            سواء كان لديكِ استفسار عن منتج، مقاس، أو ترغبين في تجهيز هدية خاصة، فريقنا في خدمتكِ على مدار الساعة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Contact Cards Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Main Card */}
            <div className="bg-[#171717] text-[#F6F0E8] rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/40 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold">المحادثة الفورية عبر الواتساب</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                أسرع طريقة للحصول على إجابة فورية، الاستفسار عن المخزون وتأكيد الطلبات.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span className="dir-ltr">{siteSettings.whatsappNumber}</span>
                </a>
              </div>
            </div>

            {/* Social & Location Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171717]/10 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-[#171717] pb-2 border-b border-stone-100">
                حسابات التواصل والتغطية
              </h4>

              <div className="flex items-center gap-3 text-xs text-stone-700">
                <Instagram className="w-4 h-4 text-[#C8A96B]" />
                <a
                  href={siteSettings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#A58645] font-medium"
                >
                  @livora.store على إنستغرام
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-700">
                <MapPin className="w-4 h-4 text-[#C8A96B]" />
                <span>{siteSettings.contactInformation.address}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-700">
                <Mail className="w-4 h-4 text-[#C8A96B]" />
                <span>{siteSettings.contactInformation.email}</span>
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#171717]/10 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#171717]">أرسلي رسالتكِ مباشرة</h3>
                <p className="text-xs text-stone-500 mt-1">
                  سيتم تحويل محتوى الرسالة إلى محادثة واتساب جاهزة للإرسال بضغطة زر
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      الاسم الكريم *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="مثال: سارة محمد"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#171717] outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1.5">
                      المدينة / المحافظة
                    </label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#171717] outline-none focus:border-[#C8A96B]"
                    >
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="حضرموت - المكلا">حضرموت - المكلا</option>
                      <option value="حضرموت - سيئون">حضرموت - سيئون</option>
                      <option value="إب">إب</option>
                      <option value="الحديدة">الحديدة</option>
                      <option value="مأرب">مأرب</option>
                      <option value="ذمار">ذمار</option>
                      <option value="محافظة أخرى">محافظة أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    موضوع الاستفسار
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#171717] outline-none focus:border-[#C8A96B]"
                  >
                    <option value="طلب منتج خاص">طلب منتج خاص وتأكيد توفره</option>
                    <option value="استفسار عن المقاسات والخامات">استفسار عن المقاسات والخامات</option>
                    <option value="تجهيز وتغليف هدية">تجهيز وتغليف هدية مناسبة</option>
                    <option value="الاستفسار عن التوصيل والشحن">الاستفسار عن التوصيل والشحن</option>
                    <option value="ملاحظة أو اقتراح">ملاحظة أو اقتراح</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1.5">
                    نص الرسالة *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="اكتبي تفاصيل استفساركِ هنا..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#171717] outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال عبر الواتساب الآن</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
