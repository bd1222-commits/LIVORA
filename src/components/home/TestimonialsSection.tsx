import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, Quote, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useStore();

  const activeTestimonials = testimonials.filter((t) => t.active);

  return (
    <section className="py-10 sm:py-24 bg-[#FAF7F2] border-t border-[#171717]/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#C8A96B] tracking-wider uppercase mb-1 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>آراء عميلاتنا في اليمن</span>
          </div>
          <h2 className="text-xl sm:text-4xl font-extrabold text-[#171717]">
            تجارب حقيقية تعكس ثقتكن بـ LIVORA
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 sm:mt-2">
            نسعى دائماً لتقديم أقصى درجات الفخامة والرضا في كل تفصيلة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {activeTestimonials.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-[#171717]/10 shadow-xs hover:shadow-xl hover:border-[#C8A96B]/40 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-5 h-5 sm:w-8 sm:h-8 text-[#C8A96B]/25 mb-2 sm:mb-3" />

              <p className="text-xs text-stone-700 leading-relaxed italic mb-4 sm:mb-6">
                "{item.text}"
              </p>

              <div className="pt-3 sm:pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-[#C8A96B]/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#C8A96B]/20 text-[#A58645] font-bold text-xs flex items-center justify-center">
                      {item.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-[#171717]">{item.name}</h4>
                    {item.city && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#C8A96B]" />
                        {item.city}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
