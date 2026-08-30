import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Instagram, Sparkles, MapPin, Phone, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, categories, siteSettings } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#171717] text-[#F6F0E8] border-t border-[#C8A96B]/20 pt-10 sm:pt-16 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-12 mb-8 sm:mb-12 border-b border-white/10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#C8A96B]/15 border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mb-2 sm:mb-3">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#F6F0E8]">أصالة وجودة مضمونة</h4>
            <p className="text-[10px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">منتجات مختارة بعناية فائقة وتصاميم حصرية</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#C8A96B]/15 border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mb-2 sm:mb-3">
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#F6F0E8]">توصيل لكافة مناطق اليمن</h4>
            <p className="text-[10px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">صنعاء، عدن، تعز، حضرموت وبقية المدن</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#C8A96B]/15 border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mb-2 sm:mb-3">
              <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#F6F0E8]">طلب مباشر وسريع عبر واتساب</h4>
            <p className="text-[10px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">تأكيد فوري وتجربة تسوق مريحة</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#C8A96B]/15 border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mb-2 sm:mb-3">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-[#F6F0E8]">تغليف هدايا فاخر</h4>
            <p className="text-[10px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">علب ليفورا الأنيقة مع بطاقات إهداء</p>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-white/10">
          {/* Column 1: Brand Info (2 spans on lg) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div
                onClick={() => navigateTo('home')}
                className="cursor-pointer inline-flex items-center gap-2 mb-3 sm:mb-4 group"
              >
                <span className="font-['Cinzel'] text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#F6F0E8] group-hover:text-[#C8A96B] transition-colors">
                  LIVORA
                </span>
                <span className="text-[#C8A96B] text-lg sm:text-xl font-light">|</span>
                <span className="text-lg sm:text-xl font-bold text-[#F6F0E8]">ليفورا</span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-md mb-4 sm:mb-6">
                {siteSettings.storeDescription}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#171717] flex items-center justify-center transition-all duration-300"
                title="واتساب ليفورا"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href={siteSettings.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#171717] flex items-center justify-center transition-all duration-300"
                title="إنستغرام"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href={siteSettings.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#171717] flex items-center justify-center transition-all duration-300"
                title="تيك توك"
              >
                <span className="font-bold text-[10px] sm:text-xs">TikTok</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-[#C8A96B] text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
              <span>روابط سريعة</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#C8A96B] transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="hover:text-[#C8A96B] transition-colors"
                >
                  جميع المنتجات
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', { filter: 'bestseller' })}
                  className="hover:text-[#C8A96B] transition-colors"
                >
                  الأكثر طلباً
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', { filter: 'offers' })}
                  className="hover:text-[#C8A96B] transition-colors"
                >
                  العروض الحصرية
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#C8A96B] transition-colors"
                >
                  قصة LIVORA
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-[#C8A96B] transition-colors"
                >
                  قائمة المفضلة
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="font-bold text-[#C8A96B] text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
              التصنيفات
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => navigateTo('products', { category: cat.slug?.current || cat._id })}
                    className="hover:text-[#C8A96B] transition-colors text-right"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & WhatsApp */}
          <div>
            <h4 className="font-bold text-[#C8A96B] text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
              خدمة العملاء
            </h4>
            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] sm:text-xs text-stone-400">الواتساب الرسمي:</div>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F6F0E8] font-bold dir-ltr hover:text-[#C8A96B] transition-colors inline-block text-xs sm:text-sm"
                  >
                    {siteSettings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs leading-relaxed text-stone-400">
                  {siteSettings.contactInformation.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright + Scroll to top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-stone-400">
          <p className="text-center sm:text-right">
            {siteSettings.footerText}
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-stone-400 hover:text-[#C8A96B] transition-colors cursor-pointer py-1 px-2.5 rounded-full hover:bg-white/5"
          >
            <span>للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
