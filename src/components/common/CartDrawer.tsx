import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createCartWhatsAppMessage, formatPrice, openWhatsApp } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    totalCartItems,
    navigateTo,
    siteSettings,
    triggerConfetti,
    showToast,
  } = useStore();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const message = createCartWhatsAppMessage(cart, cartSubtotal);
    triggerConfetti();
    showToast('جارٍ فتح محادثة الواتساب لتأكيد طلبكِ...', undefined, 'gold');
    openWhatsApp(siteSettings.whatsappNumber, message);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#FAF7F2] z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#171717]/10 flex items-center justify-between bg-[#F6F0E8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#171717] text-[#C8A96B] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#171717]">حقيبة التسوق</h3>
                  <p className="text-xs text-stone-500">
                    {totalCartItems} {totalCartItems === 1 ? 'منتج' : 'منتجات'} مختارة
                  </p>
                </div>
              </div>

              <button
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[#171717]/5 text-[#171717] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[#C8A96B]/15 border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mb-4">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#171717] mb-1">حقيبة التسوق فارغة</h4>
                  <p className="text-xs text-stone-500 max-w-xs mb-6">
                    استكشفي تشكيلات ليفورا الفاخرة وأضيفي لمستكِ الخاصة من الأناقة
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo('products');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#171717] text-[#F6F0E8] text-xs font-bold hover:bg-[#C8A96B] hover:text-[#171717] transition-all duration-300 shadow-md flex items-center gap-2"
                  >
                    <span>تصفحي المنتجات الآن</span>
                    <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl p-3 border border-[#171717]/10 shadow-xs flex gap-3 group relative hover:border-[#C8A96B]/40 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        setIsCartOpen(false);
                        navigateTo('product-detail', { slug: item.product.slug?.current || item.product._id });
                      }}
                      className="w-20 h-24 rounded-lg bg-stone-100 overflow-hidden shrink-0 cursor-pointer relative"
                    >
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => {
                              setIsCartOpen(false);
                              navigateTo('product-detail', { slug: item.product.slug?.current || item.product._id });
                            }}
                            className="text-xs font-bold text-[#171717] line-clamp-2 hover:text-[#C8A96B] cursor-pointer transition-colors"
                          >
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-1"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Options Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-stone-500">
                          {item.selectedColor && (
                            <span className="bg-[#F6F0E8] px-2 py-0.5 rounded border border-[#171717]/5 text-stone-700">
                              اللون: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="bg-[#F6F0E8] px-2 py-0.5 rounded border border-[#171717]/5 text-stone-700">
                              المقاس: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Quantity Selector */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        <div className="text-xs font-extrabold text-[#171717]">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>

                        <div className="flex items-center border border-[#171717]/15 rounded-lg bg-[#FAF7F2] p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#171717] hover:bg-white rounded transition-colors"
                            aria-label="إنقاص"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#171717]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#171717] hover:bg-white rounded transition-colors"
                            aria-label="زيادة"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & WhatsApp Order CTA */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-[#171717]/10 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-sm font-bold text-stone-600">الإجمالي التقريبي:</span>
                  <span className="text-lg font-extrabold text-[#171717] text-[#A58645]">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {/* Delivery Note */}
                <div className="flex items-center gap-2 bg-[#F6F0E8] p-2.5 rounded-lg text-xs text-stone-600 border border-[#C8A96B]/20">
                  <ShieldCheck className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>توصيل لجميع مناطق اليمن • الدفع عند الاستلام</span>
                </div>

                {/* WhatsApp Checkout Button */}
                <button
                  id="whatsapp-checkout-btn"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-300 transform active:scale-[0.99] cursor-pointer group"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>اطلب الآن عبر WhatsApp</span>
                  <Sparkles className="w-4 h-4 opacity-80 group-hover:scale-125 transition-transform" />
                </button>

                <p className="text-[11px] text-center text-stone-400">
                  سيتم تجهيز رسالة تحتوي على تفاصيل المنتجات وإرسالها مباشرة لواتساب المتجر الرسمي.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
