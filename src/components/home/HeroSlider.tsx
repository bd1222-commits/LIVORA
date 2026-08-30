import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroSlider: React.FC = () => {
  const { heroSlides, navigateTo } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlides = heroSlides.length > 0 ? heroSlides : [];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentSlideIndex];

  return (
    <section className="relative w-full bg-[#171717] overflow-hidden min-h-[460px] sm:min-h-[560px] lg:min-h-[660px] flex items-center">
      {/* Background Image Carousel with Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide._id || currentSlideIndex}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center brightness-[0.62]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="max-w-2xl text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide._id || currentSlideIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-3.5 sm:space-y-6"
            >
              {/* Badge */}
              {currentSlide.badge && (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#C8A96B]/20 backdrop-blur-md border border-[#C8A96B]/40 text-[#DEC593] text-[11px] sm:text-xs font-bold shadow-lg">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C8A96B]" />
                  <span>{currentSlide.badge}</span>
                </div>
              )}

              {/* Subtitle */}
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-base font-semibold text-[#C8A96B] tracking-wide">
                  {currentSlide.subtitle}
                </p>
              )}

              {/* Main Title */}
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-[#F6F0E8] leading-[1.25] tracking-tight">
                {currentSlide.title}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-base text-stone-300 leading-relaxed max-w-xl font-normal line-clamp-3 sm:line-clamp-none">
                {currentSlide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
                <button
                  id="hero-primary-cta"
                  onClick={() => {
                    if (currentSlide.ctaLink?.includes('?category=')) {
                      const cat = currentSlide.ctaLink.split('?category=')[1];
                      navigateTo('products', { category: cat });
                    } else {
                      navigateTo('products');
                    }
                  }}
                  className="px-5 sm:px-8 py-2.5 sm:py-4 rounded-full bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-extrabold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2.5 shadow-xl shadow-[#C8A96B]/20 transition-all duration-300 transform active:scale-95 cursor-pointer group"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{currentSlide.ctaText || 'تسوقي الآن'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigateTo('products', { filter: 'offers' })}
                  className="px-4 sm:px-7 py-2.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#F6F0E8] backdrop-blur-md border border-white/20 font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer"
                >
                  العروض الحصرية
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Nav Arrows */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-6 z-20 hidden sm:flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePrev}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#C8A96B] text-white hover:text-[#171717] border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer"
            aria-label="السابق"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#C8A96B] text-white hover:text-[#171717] border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-sm cursor-pointer"
            aria-label="التالي"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* Slide Dots Indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 right-1/2 translate-x-1/2 sm:right-8 sm:translate-x-0 z-20 flex items-center gap-1.5 sm:gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentSlideIndex === idx ? 'w-6 sm:w-8 bg-[#C8A96B]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`شريحة ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
