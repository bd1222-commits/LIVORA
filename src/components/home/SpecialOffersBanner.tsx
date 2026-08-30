import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, MessageCircle, ArrowLeft, ShieldCheck, Gift } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';

export const SpecialOffersBanner: React.FC = () => {
  const { navigateTo, siteSettings, triggerConfetti } = useStore();

  const handleWhatsAppInquiry = () => {
    triggerConfetti();
    openWhatsApp(
      siteSettings.whatsappNumber,
      'السلام عليكم، أود الاستفسار عن كود الخصم والعروض الخاصة لمتجر ليفورا.'
    );
  };

  return (
    <section className="py-10 sm:py-20 bg-[#F6F0E8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#171717] text-[#F6F0E8] overflow-hidden border border-[#C8A96B]/30 shadow-2xl">
          {/* Background Ambient Image */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop"
              alt="Luxury jewelry"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/90 to-transparent" />
          </div>

          <div className="relative z-10 p-5 sm:p-14 lg:p-16 max-w-2xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A96B]/20 border border-[#C8A96B]/40 text-[#DEC593] text-[11px] sm:text-xs font-bold">
              <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C8A96B]" />
              <span>عرض خاص ومحدود</span>
            </div>

            <h3 className="text-xl sm:text-4xl lg:text-5xl font-black text-[#F6F0E8] leading-snug">
              تألقي بخصومات تصل إلى <span className="text-[#C8A96B]">30%</span> على تشكيلة المجوهرات الذهبية
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              إكسسوارات مطلية بذهب عيار 18 قيراط ومجموعة العناية المختارة بعناية فائقة. التوصيل متوفر لجميع المحافظات اليمنية مع تغليف هدايا ملكي مجاني.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => navigateTo('products', { filter: 'offers' })}
                className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all transform active:scale-95 cursor-pointer"
              >
                <span>تسوقي العروض الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>استفسار عبر واتساب</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
