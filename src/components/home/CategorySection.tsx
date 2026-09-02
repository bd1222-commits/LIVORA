import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const CategorySection: React.FC = () => {
  const { categories, navigateTo } = useStore();

  const activeCategories = categories.filter((c) => c.active);

  return (
    <section className="py-10 sm:py-20 bg-[#F6F0E8] border-b border-[#171717]/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#C8A96B] tracking-wider uppercase mb-1 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>مجموعات ليفورا الحصرية</span>
            </div>
            <h2 className="text-xl sm:text-4xl font-extrabold text-[#171717]">
              تسوقي حسب التصنيف
            </h2>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#A58645] hover:text-[#171717] transition-colors group cursor-pointer self-start sm:self-auto"
          >
            <span>عرض كافة الأقسام</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-6">
          {activeCategories.map((category, idx) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => navigateTo('products', { category: category.slug?.current || category._id })}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Circular / Rounded Image with Gold Ring */}
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-stone-200 border border-[#171717]/10 group-hover:border-[#C8A96B] shadow-xs group-hover:shadow-xl transition-all duration-500">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Subtle Inner Border Glow */}
                <div className="absolute inset-0 border border-white/20 rounded-xl sm:rounded-2xl pointer-events-none" />
              </div>

              {/* Title & Count */}
              <h3 className="text-[11px] sm:text-sm font-bold text-[#171717] group-hover:text-[#A58645] transition-colors mt-2 sm:mt-3 line-clamp-1">
                {category.name}
              </h3>
              <span className="text-[9px] sm:text-[11px] text-stone-500 mt-0.5">
                {category.itemCount ? `${category.itemCount} منتج` : 'تشكيلة راقية'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
