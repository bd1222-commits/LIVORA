import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, ShoppingBag, MessageCircle, Sparkles, Check, Flame, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createProductWhatsAppMessage, formatPrice, openWhatsApp } from '../../utils/whatsapp';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    siteSettings,
    triggerConfetti,
    showToast,
    navigateTo,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const images = [
    quickViewProduct.mainImage,
    ...(quickViewProduct.additionalImages || []),
  ];

  const inWishlist = isInWishlist(quickViewProduct._id);

  const activeColor = selectedColor || (quickViewProduct.colors?.[0]?.name);
  const activeSize = selectedSize || (quickViewProduct.sizes?.[0]);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, {
      color: activeColor,
      size: activeSize,
    });
    closeQuickView();
  };

  const handleWhatsAppOrder = () => {
    const message = createProductWhatsAppMessage(
      quickViewProduct,
      undefined,
      activeColor,
      activeSize
    );
    triggerConfetti();
    showToast('جارٍ فتح محادثة الواتساب لطلب المنتج...', undefined, 'gold');
    openWhatsApp(siteSettings.whatsappNumber, message);
    closeQuickView();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C8A96B]/30 overflow-hidden z-10 my-8"
        >
          {/* Close Button */}
          <button
            id="close-quickview-btn"
            onClick={closeQuickView}
            className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-[#171717]/60 text-white hover:bg-[#171717] flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Column */}
            <div className="p-6 bg-[#F6F0E8] flex flex-col justify-between border-b md:border-b-0 md:border-l border-[#171717]/10">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-200 shadow-inner">
                <img
                  src={images[selectedImageIndex] || quickViewProduct.mainImage}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                  {quickViewProduct.isOnSale && quickViewProduct.discountPercentage && (
                    <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      خصم {quickViewProduct.discountPercentage}%
                    </span>
                  )}
                  {quickViewProduct.isBestSeller && (
                    <span className="bg-[#C8A96B] text-[#171717] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-current" />
                      الأكثر طلباً
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#C8A96B] shadow-md scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Column */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#C8A96B] uppercase tracking-wider">
                    {quickViewProduct.category?.name || 'ليفورا كولكشن'}
                  </span>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className={`p-2 rounded-full transition-colors ${
                      inWishlist
                        ? 'text-red-500 bg-red-50'
                        : 'text-stone-400 hover:text-red-500 hover:bg-stone-100'
                    }`}
                    title="المفضلة"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#171717] mt-1 line-clamp-2">
                  {quickViewProduct.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-xl font-extrabold text-[#171717]">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.oldPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPrice(quickViewProduct.oldPrice)}
                    </span>
                  )}
                </div>

                {/* Stock Left */}
                {quickViewProduct.displayStockCount && quickViewProduct.displayStockCount < 8 && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mt-2 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>متبقي {quickViewProduct.displayStockCount} قطع فقط في المخزون</span>
                  </div>
                )}

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {quickViewProduct.shortDescription}
                </p>

                {/* Color Selection */}
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-stone-700 block mb-2">
                      اللون: {activeColor}
                    </span>
                    <div className="flex gap-2">
                      {quickViewProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            activeColor === c.name
                              ? 'border-[#171717] scale-110 shadow-sm'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {activeColor === c.name && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                c.hex.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-stone-700 block mb-2">
                      المقاس / السعة:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                            activeSize === s
                              ? 'border-[#C8A96B] bg-[#C8A96B]/15 text-[#171717] font-bold'
                              : 'border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-[#171717]/10">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 px-4 rounded-xl bg-[#171717] text-[#F6F0E8] hover:bg-[#C8A96B] hover:text-[#171717] font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة للسلة</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>طلب عبر واتساب</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    closeQuickView();
                    navigateTo('product-detail', {
                      slug: quickViewProduct.slug?.current || quickViewProduct._id,
                    });
                  }}
                  className="w-full text-center text-xs text-[#A58645] hover:underline font-bold py-1"
                >
                  عرض كافة تفاصيل المنتج والمواصفات ←
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
