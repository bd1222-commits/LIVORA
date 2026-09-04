import React, { useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../../utils/whatsapp';
import { ProductImage } from './ProductImage';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    categories,
    navigateTo,
    openQuickView,
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.shortDescription?.toLowerCase().includes(query) ||
          p.category?.name?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C8A96B]/40 overflow-hidden z-10"
        >
          {/* Input Bar */}
          <div className="p-4 sm:p-5 border-b border-[#171717]/10 flex items-center gap-3 bg-white">
            <Search className="w-5 h-5 text-[#C8A96B] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن حقيبة، عقد ذهبي، أحمر شفاه، سيروم، إكسسوار شعر..."
              className="flex-1 bg-transparent border-none outline-none text-base text-[#171717] placeholder:text-stone-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-stone-400 hover:text-[#171717]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs font-bold text-stone-500 hover:text-[#171717] bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              إلغاء [ESC]
            </button>
          </div>

          {/* Quick Suggestions / Filter Chips */}
          {!searchQuery && (
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#C8A96B] block mb-2.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  أقسام وتصنيفات شائعة:
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSearchQuery(cat.name);
                      }}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#171717]/10 text-xs text-stone-700 hover:border-[#C8A96B] hover:text-[#A58645] transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setSearchQuery('ذهب')}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#171717]/10 text-xs text-stone-700 hover:border-[#C8A96B] hover:text-[#A58645] transition-colors"
                  >
                    مجوهرات مطلية بالذهب
                  </button>
                  <button
                    onClick={() => setSearchQuery('سيروم')}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#171717]/10 text-xs text-stone-700 hover:border-[#C8A96B] hover:text-[#A58645] transition-colors"
                  >
                    سيرومات نضارة
                  </button>
                </div>
              </div>

              {/* Popular Products Mini Strip */}
              <div>
                <span className="text-xs font-bold text-stone-500 block mb-2.5">
                  المنتجات الأكثر طلباً في ليفورا:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {products.slice(0, 4).map((prod) => (
                    <div
                      key={prod._id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('product-detail', { slug: prod.slug?.current || prod._id });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-white border border-stone-100 hover:border-[#C8A96B] cursor-pointer group transition-all"
                    >
                      <div className="w-12 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F2]">
                        <ProductImage
                          src={prod.mainImage}
                          alt={prod.name}
                          transform={prod.imageTransform}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-[#171717] truncate group-hover:text-[#C8A96B]">
                          {prod.name}
                        </h5>
                        <span className="text-xs text-[#A58645] font-extrabold">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {searchQuery && (
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              <div className="text-xs text-stone-500 pb-2 border-b border-stone-200">
                نتائج البحث عن "{searchQuery}": ({filteredProducts.length} منتج)
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-stone-500 space-y-2">
                  <p className="text-sm font-bold text-stone-700">لم يتم العثور على نتائج مطابقة</p>
                  <p className="text-xs">جربي البحث بكلمات أخرى مثل: حقيبة، روج، لؤلؤ، عقد</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-stone-200/80 hover:border-[#C8A96B] transition-all group"
                  >
                    <div
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('product-detail', {
                          slug: product.slug?.current || product._id,
                        });
                      }}
                      className="flex items-center gap-3.5 flex-1 cursor-pointer"
                    >
                      <div className="w-14 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F2]">
                        <ProductImage
                          src={product.mainImage}
                          alt={product.name}
                          transform={product.imageTransform}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#C8A96B] uppercase">
                          {product.category?.name}
                        </span>
                        <h4 className="text-xs font-bold text-[#171717] group-hover:text-[#A58645] transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-[#171717]">
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[10px] text-stone-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        openQuickView(product);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#F6F0E8] hover:bg-[#C8A96B] hover:text-[#171717] text-xs font-bold text-[#171717] transition-colors shrink-0"
                    >
                      نظرة سريعة
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
