import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Sparkles,
  Flame,
  Zap,
  Tag,
} from 'lucide-react';
import { SortOption, ViewMode } from '../types';

export const ProductsPage: React.FC = () => {
  const { products, categories, routeParams, navigateTo } = useStore();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecialFilter, setSelectedSpecialFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(50000);

  // Sync with URL parameters
  useEffect(() => {
    if (routeParams.category) {
      setSelectedCategory(routeParams.category);
    } else {
      setSelectedCategory('all');
    }

    if (routeParams.filter) {
      setSelectedSpecialFilter(routeParams.filter);
    } else {
      setSelectedSpecialFilter('all');
    }

    if (routeParams.q) {
      setSearchKeyword(routeParams.q);
    }
  }, [routeParams]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const matchCategory =
            product.category?._ref === selectedCategory ||
            product.category?.slug === selectedCategory ||
            product.category?.name === selectedCategory;
          if (!matchCategory) return false;
        }

        // Special tag filter
        if (selectedSpecialFilter === 'bestseller' && !product.isBestSeller) return false;
        if (selectedSpecialFilter === 'featured' && !product.isFeatured) return false;
        if (selectedSpecialFilter === 'new' && !product.isNew) return false;
        if (selectedSpecialFilter === 'offers' && !product.isOnSale) return false;

        // Price filter
        if (product.price > priceRange) return false;

        // Keyword filter
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.shortDescription?.toLowerCase().includes(q) ||
            product.description?.toLowerCase().includes(q) ||
            product.sku?.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popular') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        if (sortBy === 'discount') {
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        }
        // default newest
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
  }, [products, selectedCategory, selectedSpecialFilter, searchKeyword, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSpecialFilter('all');
    setSearchKeyword('');
    setPriceRange(50000);
    setSortBy('newest');
    navigateTo('products');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSpecialFilter !== 'all' ||
    searchKeyword !== '' ||
    priceRange < 50000;

  return (
    <div className="py-6 sm:py-10 bg-[#F6F0E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#171717]/10 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#C8A96B] uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>كتالوج LIVORA الكامل</span>
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold text-[#171717]">
              جميع المنتجات والتشكيلات
            </h1>
            <p className="text-[11px] sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
              عرض {filteredProducts.length} من أصل {products.length} قطعة فاخرة
            </p>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedSpecialFilter('all');
                navigateTo('products', { category: selectedCategory !== 'all' ? selectedCategory : undefined });
              }}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                selectedSpecialFilter === 'all'
                  ? 'bg-[#171717] text-[#F6F0E8]'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#C8A96B]'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => {
                setSelectedSpecialFilter('bestseller');
                navigateTo('products', { filter: 'bestseller' });
              }}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                selectedSpecialFilter === 'bestseller'
                  ? 'bg-[#C8A96B] text-[#171717]'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#C8A96B]'
              }`}
            >
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              الأكثر طلباً
            </button>
            <button
              onClick={() => {
                setSelectedSpecialFilter('offers');
                navigateTo('products', { filter: 'offers' });
              }}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                selectedSpecialFilter === 'offers'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-red-400'
              }`}
            >
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              العروض والتخفيضات
            </button>
            <button
              onClick={() => {
                setSelectedSpecialFilter('new');
                navigateTo('products', { filter: 'new' });
              }}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                selectedSpecialFilter === 'new'
                  ? 'bg-[#171717] text-[#DEC593]'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#C8A96B]'
              }`}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              وصل حديثاً
            </button>
          </div>
        </div>

        {/* Toolbar (Mobile Filter toggle, Sort selector, View Mode) */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#171717]/10 shadow-xs mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
            <button
              id="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-[11px] sm:text-xs font-bold text-[#171717]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>الفلاتر والتصنيفات</span>
            </button>

            {/* In-page keyword search */}
            <div className="relative hidden sm:block w-64">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="تصفية بالاسم أو الرمز..."
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#171717] outline-none focus:border-[#C8A96B]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">الترتيب:</span>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#FAF7F2] border border-stone-200 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#171717] outline-none focus:border-[#C8A96B] cursor-pointer"
              >
                <option value="newest">الأحدث وصولاً</option>
                <option value="price-asc">السعر: من الأقل</option>
                <option value="price-desc">السعر: من الأعلى</option>
                <option value="popular">الأكثر طلباً</option>
                <option value="discount">أعلى نسبة خصم</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center border border-stone-200 rounded-xl bg-[#FAF7F2] p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-[#171717]' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="عرض شبكي"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-[#171717]' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="عرض قائمة"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            <span className="text-[11px] sm:text-xs font-bold text-stone-500">الفلاتر المطبقة:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#171717] text-[#DEC593] text-[11px] sm:text-xs font-medium">
                قسم: {categories.find((c) => c.slug?.current === selectedCategory || c._id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}
            {selectedSpecialFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#C8A96B] text-[#171717] text-[11px] sm:text-xs font-bold">
                {selectedSpecialFilter === 'bestseller'
                  ? 'الأكثر طلباً'
                  : selectedSpecialFilter === 'offers'
                  ? 'العروض'
                  : 'وصل حديثاً'}
                <button onClick={() => setSelectedSpecialFilter('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchKeyword && (
              <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-stone-200 text-stone-800 text-[11px] sm:text-xs font-medium">
                بحث: "{searchKeyword}"
                <button onClick={() => setSearchKeyword('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] sm:text-xs text-red-600 hover:underline font-bold mr-1"
            >
              إعادة ضبط الكل
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-4 sm:space-y-6`}>
            {/* Categories Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#171717]/10 shadow-xs">
              <h4 className="font-bold text-xs sm:text-sm text-[#171717] pb-2 sm:pb-3 border-b border-stone-100 flex items-center justify-between">
                <span>أقسام المتجر</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
              </h4>

              <div className="space-y-1 mt-2.5 sm:mt-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-right px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-[#171717] text-[#DEC593]'
                      : 'text-stone-700 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>جميع الأقسام</span>
                  <span className="text-[11px] opacity-70">{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const isCatActive =
                    selectedCategory === cat.slug?.current || selectedCategory === cat._id;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.slug?.current || cat._id)}
                      className={`w-full text-right px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isCatActive
                          ? 'bg-[#171717] text-[#DEC593]'
                          : 'text-stone-700 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] opacity-70">{cat.itemCount || ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#171717]/10 shadow-xs">
              <h4 className="font-bold text-xs sm:text-sm text-[#171717] pb-2 sm:pb-3 border-b border-stone-100">
                السعر الأقصى
              </h4>
              <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C8A96B] cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>حتى: {priceRange.toLocaleString('ar-YE')} ر.ي</span>
                  <span className="text-stone-400">50,000 ر.ي</span>
                </div>
              </div>
            </div>

            {/* Delivery Notice Card */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#C8A96B]/30 text-xs space-y-1.5 sm:space-y-2">
              <h5 className="font-bold text-[#171717]">خدمة التوصيل الشاملة</h5>
              <p className="text-stone-600 leading-relaxed text-[11px] sm:text-xs">
                نقوم بالتوصيل لجميع مناطق اليمن دون استثناء، مع إمكانية تأكيد الطلب الفوري عبر تطبيق الواتساب.
              </p>
            </div>
          </aside>

          {/* Product Grid / List Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#171717]/10 space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] mx-auto">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#171717]">لا توجد منتجات تطابق الفلاتر المحددة</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  جربي تغيير خيارات الفلترة أو إعادة تعيين الفلاتر لعرض جميع التشكيلات.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#171717] text-[#F6F0E8] text-xs font-bold hover:bg-[#C8A96B] hover:text-[#171717] transition-all"
                >
                  إلغاء جميع الفلاتر
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6'
                    : 'space-y-3 sm:space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    layout={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
