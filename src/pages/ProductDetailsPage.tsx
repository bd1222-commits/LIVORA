import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Check,
  Flame,
  Globe,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Share2,
  Plus,
  Minus,
} from 'lucide-react';
import { createProductWhatsAppMessage, formatPrice, openWhatsApp } from '../utils/whatsapp';
import { motion } from 'motion/react';
import { ProductImage } from '../components/common/ProductImage';

export const ProductDetailsPage: React.FC = () => {
  const {
    products,
    routeParams,
    addToCart,
    toggleWishlist,
    isInWishlist,
    siteSettings,
    triggerConfetti,
    showToast,
    navigateTo,
  } = useStore();

  const slug = routeParams.slug;
  const product = products.find((p) => p.slug?.current === slug || p._id === slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<'desc' | 'specs' | 'delivery' | null>('desc');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <div className="py-24 text-center bg-[#F6F0E8] min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-[#171717] mb-2">عذراً، المنتج غير موجود</h2>
        <p className="text-xs text-stone-500 mb-6">قد يكون تم تغيير الرابط أو أن المنتج غير متاح حالياً.</p>
        <button
          onClick={() => navigateTo('products')}
          className="px-6 py-2.5 rounded-full bg-[#171717] text-[#F6F0E8] text-xs font-bold hover:bg-[#C8A96B] hover:text-[#171717] transition-all"
        >
          العودة لكافة المنتجات
        </button>
      </div>
    );
  }

  const images = [product.mainImage, ...(product.additionalImages || [])];
  const inWishlist = isInWishlist(product._id);
  const activeColor = selectedColor || (product.colors?.[0]?.name);
  const activeSize = selectedSize || (product.sizes?.[0]);

  // Similar Products in the same category
  const similarProducts = products
    .filter(
      (p) =>
        p._id !== product._id &&
        (p.category?._ref === product.category?._ref || p.category?.slug === product.category?.slug)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      color: activeColor,
      size: activeSize,
    });
  };

  const handleWhatsAppOrder = () => {
    const currentUrl = window.location.href;
    const message = createProductWhatsAppMessage(
      product,
      undefined,
      activeColor,
      activeSize,
      currentUrl
    );
    triggerConfetti();
    showToast('جارٍ فتح محادثة الواتساب لتأكيد طلبكِ...', undefined, 'gold');
    openWhatsApp(siteSettings?.whatsappNumber || '', message);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المنتج للمشاركة', undefined, 'info');
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#F6F0E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 mb-4 sm:mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button onClick={() => navigateTo('home')} className="hover:text-[#C8A96B] transition-colors whitespace-nowrap">
            الرئيسية
          </button>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180 text-stone-400 shrink-0" />
          <button onClick={() => navigateTo('products')} className="hover:text-[#C8A96B] transition-colors whitespace-nowrap">
            جميع المنتجات
          </button>
          {product.category?.name && (
            <>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180 text-stone-400 shrink-0" />
              <button
                onClick={() =>
                  navigateTo('products', {
                    category: product.category.slug || product.category._ref,
                  })
                }
                className="hover:text-[#C8A96B] transition-colors whitespace-nowrap"
              >
                {product.category.name}
              </button>
            </>
          )}
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rotate-180 text-stone-400 shrink-0" />
          <span className="text-[#171717] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-[#171717]/10 shadow-xl mb-10 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14">
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              {/* Main Active Image with Zoom effect */}
              <div className="relative aspect-[1080/1442] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#171717]/10 shadow-inner group">
                <ProductImage
                  src={images[selectedImageIndex] || product.mainImage}
                  alt={product.name}
                  loading="eager"
                  transform={
                    product.imageTransforms?.[images[selectedImageIndex]] ||
                    (selectedImageIndex === 0 ? product.imageTransform : undefined)
                  }
                  showWatermark={true}
                  watermarkPosition="details"
                />

                {/* Badges Stack */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-1.5 sm:gap-2 z-10">
                  {product.isOnSale && product.discountPercentage && (
                    <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                      خصم {product.discountPercentage}%
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-[#C8A96B] text-[#171717] text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      الأكثر طلباً
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-[#171717] text-[#DEC593] text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md border border-[#DEC593]/30">
                      جديد 2026
                    </span>
                  )}
                  {product.isGlobalBrand && (
                    <span className="bg-[#171717] text-[#DEC593] text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md border border-[#DEC593]/30 flex items-center gap-1">
                      <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DEC593]" />
                      براند عالمي
                    </span>
                  )}
                </div>

                {/* Quick Share Button */}
                <button
                  onClick={handleShare}
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-all"
                  title="مشاركة المنتج"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-[1080/1442] rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-[#C8A96B] shadow-md ring-2 ring-[#C8A96B]/20'
                          : 'border-transparent opacity-65 hover:opacity-100'
                      }`}
                    >
                      <ProductImage
                        src={img}
                        alt={`thumb-${index}`}
                        transform={
                          product.imageTransforms?.[img] ||
                          (index === 0 ? product.imageTransform : undefined)
                        }
                        containerClassName="bg-[#FAF7F2]"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Column (7 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-[#C8A96B] uppercase tracking-wider">
                    {product.category?.name || 'مجموعة ليفورا'}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-stone-600 font-bold">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span>({product.reviewsCount || 24} تقييم)</span>
                  </div>
                </div>

                {/* Product Name */}
                <h1 className="text-xl sm:text-3xl font-extrabold text-[#171717] mt-1.5 sm:mt-2 leading-snug">
                  {product.name}
                </h1>

                {/* SKU */}
                {product.sku && (
                  <div className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5 sm:mt-1 font-mono">
                    رمز المنتج: {product.sku}
                  </div>
                )}

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 sm:gap-4 mt-3 sm:mt-5 p-3 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#171717]/5">
                  <span className="text-xl sm:text-3xl font-black text-[#171717]">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm sm:text-base text-stone-400 line-through font-medium">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-[10px] sm:text-xs font-extrabold text-red-600 bg-red-100 px-2 sm:px-2.5 py-0.5 rounded-full">
                      وفرتي {product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Stock Countdown Alert */}
                {product.displayStockCount && (
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50/80 p-2.5 sm:p-3 rounded-xl border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>
                      سارعي بالطلب! متبقي {product.displayStockCount} قطع فقط في مخزون ليفورا.
                    </span>
                  </div>
                )}

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-stone-600 mt-3 sm:mt-4 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Colors Option */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs font-bold text-[#171717]">
                        اللون المختار: <span className="text-[#A58645]">{activeColor}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                            activeColor === c.name
                              ? 'border-[#171717] scale-105 shadow-md ring-2 ring-[#C8A96B]/40'
                              : 'border-stone-200 hover:scale-105'
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

                {/* Sizes Option */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4 sm:mt-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs font-bold text-[#171717]">المقاس / السعة:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-xl border font-bold transition-all ${
                            activeSize === s
                              ? 'border-[#C8A96B] bg-[#C8A96B]/15 text-[#171717] shadow-xs'
                              : 'border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-4 sm:mt-5 flex items-center gap-3 sm:gap-4">
                  <span className="text-xs font-bold text-[#171717]">الكمية:</span>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF7F2] p-0.5 sm:p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-600 hover:text-[#171717] hover:bg-white rounded-lg transition-colors"
                      aria-label="إنقاص"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="w-8 sm:w-10 text-center text-xs font-bold text-[#171717]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-stone-600 hover:text-[#171717] hover:bg-white rounded-lg transition-colors"
                      aria-label="زيادة"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Direct Order + Add to Cart + Wishlist */}
              <div className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6 border-t border-stone-100">
                {/* 1. Primary WhatsApp Order Button (Direct Ordering) */}
                <button
                  id="whatsapp-product-order-btn"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-emerald-500/25 transition-all duration-300 transform active:scale-[0.99] cursor-pointer group"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span>اطلب الآن عبر WhatsApp</span>
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-90 group-hover:scale-125 transition-transform" />
                </button>

                {/* 2. Add to Cart & Wishlist */}
                <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="col-span-4 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-[#171717] hover:bg-[#C8A96B] text-[#F6F0E8] hover:text-[#171717] font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>إضافة إلى حقيبة التسوق</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`col-span-1 py-2.5 sm:py-3.5 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
                      inWishlist
                        ? 'border-red-300 bg-red-50 text-red-500'
                        : 'border-stone-200 text-stone-600 hover:border-red-300 hover:text-red-500'
                    }`}
                    title="المفضلة"
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Accordion Tabs for description, specs, and delivery note */}
              <div className="pt-4 sm:pt-6 border-t border-stone-100 space-y-2">
                {/* Description Accordion */}
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'desc' ? null : 'desc')}
                    className="w-full text-right p-3 sm:p-3.5 bg-[#FAF7F2] text-xs font-bold text-[#171717] flex items-center justify-between"
                  >
                    <span>الوصف الكامل والتفاصيل</span>
                    <span className="text-stone-400">{activeAccordion === 'desc' ? '−' : '+'}</span>
                  </button>
                  {activeAccordion === 'desc' && (
                    <div className="p-3.5 sm:p-4 text-xs text-stone-600 leading-relaxed bg-white border-t border-stone-100">
                      {product.description || product.shortDescription}
                    </div>
                  )}
                </div>

                {/* Product Features ("مميزات المنتج") */}
                {((product.features && product.features.length > 0) || (product.details?.features && product.details.features.length > 0) || product.details?.material || product.details?.origin) && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')}
                      className="w-full text-right p-3 sm:p-3.5 bg-[#FAF7F2] text-xs font-bold text-[#171717] flex items-center justify-between"
                    >
                      <span>مميزات المنتج</span>
                      <span className="text-stone-400">{activeAccordion === 'specs' ? '−' : '+'}</span>
                    </button>
                    {activeAccordion === 'specs' && (
                      <div className="p-3.5 sm:p-4 text-xs text-stone-600 leading-relaxed bg-white border-t border-stone-100 space-y-2">
                        {((product.features && product.features.length > 0) ? product.features : (product.details?.features && product.details.features.length > 0) ? product.details.features : []).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 border-b border-stone-50 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-[#C8A96B] font-bold shrink-0">•</span>
                            <span className="text-[#171717] font-medium">{feature}</span>
                          </div>
                        ))}
                        {(!product.features || product.features.length === 0) && (!product.details?.features || product.details.features.length === 0) && (
                          <>
                            {product.details?.material && (
                              <div className="flex justify-between border-b border-stone-50 pb-1">
                                <span className="font-bold text-[#171717]">الخامة:</span>
                                <span>{product.details.material}</span>
                              </div>
                            )}
                            {product.details?.origin && (
                              <div className="flex justify-between border-b border-stone-50 pb-1">
                                <span className="font-bold text-[#171717]">بلد المنشأ والتصميم:</span>
                                <span>{product.details.origin}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Note */}
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'delivery' ? null : 'delivery')}
                    className="w-full text-right p-3 sm:p-3.5 bg-[#FAF7F2] text-xs font-bold text-[#171717] flex items-center justify-between"
                  >
                    <span>الشحن والتوصيل في اليمن</span>
                    <span className="text-stone-400">{activeAccordion === 'delivery' ? '−' : '+'}</span>
                  </button>
                  {activeAccordion === 'delivery' && (
                    <div className="p-3.5 sm:p-4 text-xs text-stone-600 leading-relaxed bg-white border-t border-stone-100 space-y-2">
                      <p>
                        • نخدم جميع محافظات ومناطق الجمهورية اليمنية.
                      </p>
                      <p>
                        • يتم التنسيق وتأكيد تفاصيل التوصيل مباشرة عبر محادثة الواتساب مع خدمة عملاء ليفورا.
                      </p>
                      <p>
                        • تغليف فاخر ملكي مناسب لتقديم الهدايا.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-10 sm:mt-16">
            <div className="flex items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-[#171717]/10">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-[#C8A96B] uppercase tracking-wider">
                  قد يعجبكِ أيضاً
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#171717]">
                  منتجات مشابهة من نفس التشكيلة
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
