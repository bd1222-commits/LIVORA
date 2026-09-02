import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { SpecialOffersBanner } from '../components/home/SpecialOffersBanner';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LivoraLogo } from '../components/common/LivoraLogo';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Heart, Sparkles, Truck, CheckCircle2, ArrowLeft } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Slider */}
      <HeroSlider />

      {/* 2. Categories Showcase */}
      <CategorySection />

      {/* 3. Crowd Favorites & Dynamic Featured Tabs */}
      <FeaturedSection />

      {/* 4. Luxury Promotional Offers Banner */}
      <SpecialOffersBanner />

      {/* 5. Brand Heritage & Story Feature */}
      <section className="py-16 sm:py-20 bg-[#F6F0E8] border-t border-[#171717]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Official LIVORA Logo Image Display (Girl photo completely removed) */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-[#C8A96B]/40 bg-[#FAF7F2] relative group">
                <img
                  src="/livora-logo.jpg"
                  alt="شعار ليفورا - LIVORA Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="bg-[#171717] text-[#F6F0E8] p-5 sm:p-6 rounded-2xl border border-[#C8A96B]/40 shadow-lg">
                <span className="font-['Cinzel'] text-[#C8A96B] font-bold text-xl sm:text-2xl tracking-widest block mb-1">
                  LIVORA
                </span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  أناقة أنثوية خالدة صنعت لتلهم حضورك في كل مناسبة.
                </p>
              </div>
            </div>

            {/* Story Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C8A96B] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                <span>عن متجر ليفورا</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#171717] leading-tight">
                فخامة تروي تفاصيل أنوثتكِ في كل لحظة
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                تأسست ليفورا لتكون الوجهة الأولى للمرأة اليمنية الباحثة عن التميز والفرادة. ننتقي أدق تفاصيل الإكسسوارات والمجوهرات المطلية بالذهب، ومستحضرات التجميل الأصلية من أرقى المصادر العالمية، مع خدمة توصيل سريعة وموثوقة لكافة المحافظات والمدن.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#171717]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>مجوهرات مقاومة للماء والبهتان</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#171717]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>مكياج أصلي وعناية معتمدة 100%</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#171717]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>توصيل لكافة المحافظات اليمنية</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#171717]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>طلب مباشر وسهل عبر الواتساب</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigateTo('about')}
                  className="px-7 py-3.5 rounded-full bg-[#171717] hover:bg-[#C8A96B] text-[#F6F0E8] hover:text-[#171717] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer group"
                >
                  <span>اقرئي قصة ليفورا الكاملة</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <TestimonialsSection />
    </div>
  );
};
