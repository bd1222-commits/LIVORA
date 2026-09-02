import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Heart, Award, Gem, CheckCircle, ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="py-16 bg-[#F6F0E8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Intro */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C8A96B] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#C8A96B]" />
            <span>قصة وهوية LIVORA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#171717]">
            فخامة تليق بالأنوثة اليمنية
          </h1>
          <p className="text-sm text-stone-600 mt-4 leading-relaxed">
            انطلقت ليفورا برؤية طموحة تسعى لإعادة تعريف تجربة التسوق الفاخر للإكسسوارات ومستحضرات الجمال في اليمن.
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C8A96B]/30 h-[380px] sm:h-[450px]">
          <img
            src="/livora-about-logo.jpg"
            alt="LIVORA Story"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-transparent" />
          <div className="absolute bottom-8 right-8 left-8 text-right max-w-xl">
            <span className="font-['Cinzel'] text-2xl font-bold tracking-[0.2em] text-[#C8A96B] block mb-2">
              LIVORA ELEGANCE
            </span>
            <p className="text-sm text-[#F6F0E8] leading-relaxed">
              كل قطعة نختارها تمر بمعايير تدقيق صارمة لضمان بقاء بريقها وجودتها ومناسبتها للإطلالة اليومية والمناسبات الخاصة.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-[#171717]/10 shadow-sm text-right space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center">
              <Gem className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#171717]">أصالة وفخامة معتمدة</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              نختار تصاميم مجوهرات مطلية بذهب حقيقي عيار 18 قيراط ومستحضرات تجميل أصلية آمنة للبشرة.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#171717]/10 shadow-sm text-right space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#171717]">توصيل موثوق وشامل</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              تصل شحناتنا الفاخرة لكافة محافظات الجمهورية اليمنية مع خدمة الطلب والتنسيق المباشر عبر الواتساب.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#171717]/10 shadow-sm text-right space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#171717]">عناية استثنائية بالعميلات</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              فريق دعم ليفورا متواجد دوماً لتقديم المشورة، اختيار المقاسات، وترتيب هدايا المناسبات بتغليف ملكي.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#171717] rounded-3xl p-10 text-center text-[#F6F0E8] border border-[#C8A96B]/30 space-y-4">
          <h2 className="text-2xl font-bold">جاهزة لاكتشاف إطلالتكِ القادمة؟</h2>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            تصفحي تشكيلة ليفورا الآن واحصلي على تجربة تسوق راقية لا تُنسى.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="px-8 py-3 rounded-full bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-extrabold text-xs transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span>تصفحي المتجر</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
