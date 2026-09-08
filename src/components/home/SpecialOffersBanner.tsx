import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft } from 'lucide-react';

export const SpecialOffersBanner: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="py-10 sm:py-20 bg-[#F6F0E8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#171717] text-[#F6F0E8] overflow-hidden border border-[#C8A96B]/30 shadow-2xl">
          {/* Background Ambient Image */}
          <div className="absolute inset-0 z-0 opacity-50">
            <img
              src="/hero-banner-1.jpg"
              alt="لمسة فخامة في كل تفصيل"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/85 to-transparent" />
          </div>

          <div className="relative z-10 p-5 sm:p-14 lg:p-16 max-w-2xl space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-4xl lg:text-5xl font-black text-[#F6F0E8] leading-snug">
              لمسة فخامة في كل تفصيل
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              اكتشفي تشكيلتنا المختارة بعناية من التفاصيل التي تضيف لمسة استثنائية إلى أناقتك.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => navigateTo('products')}
                className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all transform active:scale-95 cursor-pointer"
              >
                <span>اكتشفي التشكيلة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
