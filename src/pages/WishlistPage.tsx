import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo } = useStore();

  return (
    <div className="py-6 sm:py-12 bg-[#F6F0E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#C8A96B] uppercase tracking-wider mb-1 sm:mb-2">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>قائمتكِ المفضلة</span>
          </div>
          <h1 className="text-xl sm:text-4xl font-extrabold text-[#171717]">
            المختارات المحفوظة
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 sm:mt-2">
            لديكِ {wishlist.length} منتج محفوظ في قائمة أمنياتكِ
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center max-w-md mx-auto border border-[#171717]/10 shadow-md space-y-3 sm:space-y-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-400 mx-auto">
              <Heart className="w-7 h-7 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#171717]">قائمة المفضلة فارغة حالياً</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              تصفحي أحدث تشكيلات المجوهرات ومستحضرات التجميل، واضغطي على أيقونة القلب لحفظ القطع المفضلة لديكِ.
            </p>
            <button
              onClick={() => navigateTo('products')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#171717] hover:bg-[#C8A96B] text-[#F6F0E8] hover:text-[#171717] text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <span>استكشاف المنتجات</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
