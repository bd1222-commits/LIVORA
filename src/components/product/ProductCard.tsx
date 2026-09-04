import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Heart, ShoppingBag, Eye, Star, Flame, Sparkles, MessageCircle, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { createProductWhatsAppMessage, formatPrice, openWhatsApp } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    navigateTo,
    siteSettings,
    triggerConfetti,
    showToast,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.mainImage);

  const inWishlist = isInWishlist(product._id);
  const secondaryImage = product.additionalImages?.[0];

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = createProductWhatsAppMessage(product);
    triggerConfetti();
    showToast('جارٍ فتح الواتساب لطلب المنتج...', undefined, 'gold');
    openWhatsApp(siteSettings?.whatsappNumber || '', message);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleNavigateDetails = () => {
    navigateTo('product-detail', { slug: product.slug?.current || product._id });
  };

  if (layout === 'list') {
    return (
      <div
        onClick={handleNavigateDetails}
        className="group relative bg-[#FAF7F2] rounded-2xl p-3 sm:p-4 border border-[#171717]/10 hover:border-[#C8A96B]/50 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col sm:flex-row gap-3.5 sm:gap-5 cursor-pointer"
      >
        {/* Image */}
        <div className="relative w-full sm:w-48 aspect-[1080/1442] rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Badges */}
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1 z-10">
            {product.isOnSale && product.discountPercentage && (
              <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#C8A96B] text-[#171717] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                الأكثر طلباً
              </span>
            )}
            {product.isGlobalBrand && (
              <span className="bg-[#171717] text-[#DEC593] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-[#DEC593]/30 flex items-center gap-1">
                <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DEC593]" />
                براند عالمي
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#C8A96B] uppercase tracking-wider">
                  {product.category?.name || 'مجموعة ليفورا'}
                </span>
                <img src="/livora-watermark.png" alt="LIVORA" className="h-2.5 sm:h-3 w-auto opacity-75 shrink-0" />
              </div>
              <button
                onClick={handleToggleWishlist}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  inWishlist ? 'text-red-500 bg-red-50' : 'text-stone-400 hover:text-red-500 hover:bg-stone-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#171717] group-hover:text-[#A58645] transition-colors mt-0.5 sm:mt-1">
              {product.name}
            </h3>

            <p className="text-[11px] sm:text-xs text-stone-600 line-clamp-2 mt-1 sm:mt-2 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="flex items-baseline gap-2 sm:gap-3 mt-2.5 sm:mt-4">
              <span className="text-base sm:text-lg font-extrabold text-[#171717]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] sm:text-xs text-stone-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-200/80">
            <button
              onClick={handleAddToCart}
              className="py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl bg-[#171717] text-[#F6F0E8] hover:bg-[#C8A96B] hover:text-[#171717] text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>إضافة للسلة</span>
            </button>
            <button
              onClick={handleWhatsAppQuickOrder}
              className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>طلب واتساب</span>
            </button>
            <button
              onClick={handleOpenQuickView}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#171717] hover:border-[#C8A96B] transition-colors"
              title="نظرة سريعة"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigateDetails}
      className="group relative bg-[#FAF7F2] rounded-2xl border border-[#171717]/10 hover:border-[#C8A96B]/60 transition-all duration-300 shadow-xs hover:shadow-xl overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[1080/1442] w-full bg-[#FAF7F2] overflow-hidden">
        {/* Main/Hover Image */}
        <img
          src={isHovered && secondaryImage ? secondaryImage : product.mainImage}
          alt={product.name}
          className="w-full h-full object-contain p-1 transition-all duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Badges Stack */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isOnSale && product.discountPercentage && (
            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full shadow-md">
              خصم {product.discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#171717] text-[#DEC593] text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full shadow-md border border-[#DEC593]/30">
              جديد
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C8A96B] text-[#171717] text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5 sm:gap-1">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              الأكثر طلباً
            </span>
          )}
          {product.isGlobalBrand && (
            <span className="bg-[#171717] text-[#DEC593] text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full shadow-md border border-[#DEC593]/30 flex items-center gap-0.5 sm:gap-1">
              <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DEC593]" />
              براند عالمي
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product._id}`}
          onClick={handleToggleWishlist}
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
            inWishlist
              ? 'bg-white text-red-500 shadow-md'
              : 'bg-white/80 text-stone-600 hover:bg-white hover:text-red-500 hover:scale-110 shadow-sm'
          }`}
          title="أضف للمفضلة"
          aria-label="أضف للمفضلة"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* LIVORA Logo directly below Wishlist Button */}
        <div className="absolute top-10 left-2 sm:top-13 sm:left-3 z-10 pointer-events-none">
          <img
            src="/livora-watermark.png"
            alt="LIVORA"
            className="h-2.5 sm:h-3.5 w-auto opacity-85 filter drop-shadow-xs"
          />
        </div>

        {/* Hover Action Overlay (Visible on desktop hover) */}
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 z-10 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl bg-[#171717] text-[#F6F0E8] hover:bg-[#C8A96B] hover:text-[#171717] text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all duration-200"
            title="إضافة للسلة"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>أضيفي للسلة</span>
          </button>

          <button
            onClick={handleOpenQuickView}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/90 backdrop-blur-md text-[#171717] hover:bg-white hover:text-[#C8A96B] flex items-center justify-center shadow-lg transition-all shrink-0"
            title="نظرة سريعة"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#C8A96B] font-bold mb-0.5 sm:mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="truncate">{product.category?.name || 'مجموعة ليفورا'}</span>
              <img src="/livora-watermark.png" alt="LIVORA" className="h-2 sm:h-2.5 w-auto opacity-70 shrink-0" />
            </div>
            {product.rating && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-stone-600 font-medium shrink-0">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-[#171717] group-hover:text-[#A58645] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-[11px] text-stone-500 line-clamp-1 mt-0.5 sm:mt-1 hidden sm:block">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Mobile Quick Action */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-stone-200/70 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-[#171717]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[9px] sm:text-[10px] text-stone-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {product.displayStockCount && product.displayStockCount <= 5 && (
              <span className="text-[9px] sm:text-[10px] text-amber-700 font-medium">
                متبقي {product.displayStockCount} فقط
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Add to Cart (Mobile) */}
            <button
              onClick={handleAddToCart}
              className="sm:hidden w-7 h-7 rounded-full bg-[#171717] text-[#F6F0E8] hover:bg-[#C8A96B] hover:text-[#171717] flex items-center justify-center transition-all"
              title="إضافة للسلة"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C8A96B]" />
            </button>

            {/* Quick WhatsApp Order */}
            <button
              onClick={handleWhatsAppQuickOrder}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all"
              title="اطلب مباشرة عبر الواتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
