import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { openWhatsApp } from '../../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const { siteSettings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDirectChat = (customText?: string) => {
    const text = customText || 'السلام عليكم، أود الاستفسار عن منتجات متجر ليفورا وخدمة التوصيل في اليمن.';
    openWhatsApp(siteSettings?.whatsappNumber || '', text);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="mb-2 sm:mb-3 w-64 sm:w-72 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C8A96B]/40 p-3 sm:p-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#171717]/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717]">خدمة عملاء LIVORA</h4>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    متواجدون لخدمتكِ
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-[#171717] p-1"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-600 my-2.5 sm:my-3 leading-relaxed">
              أهلاً بكِ في ليفورا! كيف يمكننا مساعدتكِ اليوم؟ يمكنكِ الطلب المباشر أو الاستفسار عن أي منتج.
            </p>

            <div className="space-y-1 sm:space-y-1.5">
              <button
                onClick={() => handleOpenDirectChat('السلام عليكم، أريد الاستفسار عن توفر منتج')}
                className="w-full text-right text-[11px] sm:text-xs p-2 rounded-lg bg-white border border-stone-200 hover:border-[#C8A96B] hover:text-[#A58645] transition-colors"
              >
                💬 استفسار عن توفر منتج ومقاسات
              </button>
              <button
                onClick={() => handleOpenDirectChat('السلام عليكم، هل التوصيل متوفر لمحافظتي؟')}
                className="w-full text-right text-[11px] sm:text-xs p-2 rounded-lg bg-white border border-stone-200 hover:border-[#C8A96B] hover:text-[#A58645] transition-colors"
              >
                🚚 الاستفسار عن مدة ومناطق التوصيل
              </button>
            </div>

            <button
              onClick={() => handleOpenDirectChat()}
              className="mt-2.5 sm:mt-3 w-full py-2 sm:py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>محادثة واتساب مباشرة</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#20bd5a] to-[#25D366] text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
        aria-label="تواصل عبر الواتساب"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A96B] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-[#C8A96B]" />
        </span>
        <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
      </button>
    </div>
  );
};
