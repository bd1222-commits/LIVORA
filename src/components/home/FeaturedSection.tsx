import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { Flame, Sparkles, Zap, Tag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FeaturedSection: React.FC = () => {
  const { products, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'featured' | 'new' | 'offers'>('bestseller');

  // Filter products according to requirements
  const bestSellers = products.filter((p) => p.isBestSeller);
  const featured = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNew);
  const onSaleOffers = products.filter((p) => p.isOnSale);

  const getActiveList = () => {
    switch (activeTab) {
      case 'bestseller':
        return bestSellers;
      case 'featured':
        return featured;
      case 'new':
        return newArrivals;
      case 'offers':
        return onSaleOffers;
      default:
        return bestSellers;
    }
  };

  const activeProducts = getActiveList();

  const tabs = [
    {
      id: 'bestseller',
      label: 'الأكثر طلباً (Crowd Favorites)',
      icon: Flame,
      count: bestSellers.length,
    },
    {
      id: 'featured',
      label: 'منتجات مختارة (Featured)',
      icon: Sparkles,
      count: featured.length,
    },
    {
      id: 'new',
      label: 'وصل حديثاً (New Arrivals)',
      icon: Zap,
      count: newArrivals.length,
    },
    {
      id: 'offers',
      label: 'العروض الحصرية (Offers)',
      icon: Tag,
      count: onSaleOffers.length,
    },
  ];

  return (
    <section className="py-10 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-[#171717]/10">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#C8A96B] tracking-wider uppercase mb-1 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>مختارات ليفورا الفاخرة</span>
            </div>
            <h2 className="text-xl sm:text-4xl font-extrabold text-[#171717]">
              تشكيلات تأسر الحواس
            </h2>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#171717] text-[#F6F0E8] shadow-md'
                      : 'bg-white/80 text-stone-600 hover:bg-white hover:text-[#171717] border border-[#171717]/10'
                  }`}
                >
                  <Icon
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      isActive ? 'text-[#C8A96B]' : 'text-stone-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid with Animated Switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6"
          >
            {activeProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => navigateTo('products', { filter: activeTab })}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#171717] hover:bg-[#C8A96B] text-[#F6F0E8] hover:text-[#171717] font-bold text-xs shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer group"
          >
            <span>استعراض كافة منتجات {tabs.find((t) => t.id === activeTab)?.label.split('(')[0]}</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
