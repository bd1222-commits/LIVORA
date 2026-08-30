import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { sanityStore } from '../sanity/client';
import { Product, Category, HeroSlide, Testimonial, SiteSettings } from '../types';
import {
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Sliders,
  Database,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check,
  RefreshCw,
  ExternalLink,
  Code,
  Lock,
  Unlock,
  Eye,
  Key,
  Flame,
  Tag,
  Zap,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { formatPrice } from '../utils/whatsapp';

export const SanityStudioPage: React.FC = () => {
  const {
    products,
    categories,
    heroSlides,
    testimonials,
    siteSettings,
    updateProduct,
    createProduct,
    deleteProduct,
    updateCategory,
    createCategory,
    deleteCategory,
    updateHeroSlide,
    createHeroSlide,
    deleteHeroSlide,
    updateTestimonial,
    createTestimonial,
    deleteTestimonial,
    updateSiteSettings,
    refreshAllData,
    resetToDefaultData,
    showToast,
    navigateTo,
  } = useStore();

  // Authentication State for Studio
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Studio Active Tab
  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'hero' | 'testimonials' | 'settings' | 'groq' | 'config'
  >('products');

  // Active Modals / Edit states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingHero, setEditingHero] = useState<Partial<HeroSlide> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [newAdditionalImageUrl, setNewAdditionalImageUrl] = useState('');

  // GROQ Query runner state
  const [groqQuery, setGroqQuery] = useState(`*[_type == "product" && isBestSeller == true] {
  _id,
  name,
  price,
  oldPrice,
  category->{ name, slug }
}`);
  const [groqResult, setGroqResult] = useState<any>(null);

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'livora2026' || pinInput === 'admin' || pinInput === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('تم تسجيل الدخول إلى Sanity Studio بنجاح', undefined, 'success');
    } else {
      setAuthError('رمز الدخول غير صحيح. يمكنك استخدام الرمز الافتراضي: livora2026');
    }
  };

  // Run GROQ simulation
  const handleRunGroq = () => {
    try {
      if (groqQuery.includes('_type == "product"')) {
        let res = [...products];
        if (groqQuery.includes('isBestSeller == true')) {
          res = res.filter((p) => p.isBestSeller);
        }
        if (groqQuery.includes('isOnSale == true')) {
          res = res.filter((p) => p.isOnSale);
        }
        setGroqResult(res);
      } else if (groqQuery.includes('_type == "category"')) {
        setGroqResult(categories);
      } else if (groqQuery.includes('_type == "heroSlide"')) {
        setGroqResult(heroSlides);
      } else if (groqQuery.includes('_type == "siteSettings"')) {
        setGroqResult(siteSettings);
      } else {
        setGroqResult({ productsCount: products.length, categoriesCount: categories.length });
      }
      showToast('تم تنفيذ استعلام GROQ بنجاح', undefined, 'gold');
    } catch (err: any) {
      setGroqResult({ error: err.message });
    }
  };

  // Product Save Handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || editingProduct.price === undefined || editingProduct.price === null || isNaN(Number(editingProduct.price))) {
      showToast('يرجى ملء اسم المنتج والسعر بشكل صحيح', undefined, 'info');
      return;
    }

    const prodData: Product = {
      _id: editingProduct._id || `prod_${Date.now()}`,
      _type: 'product',
      name: editingProduct.name,
      slug: { current: editingProduct.slug?.current || `prod-${Date.now()}` },
      price: Number(editingProduct.price),
      oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : undefined,
      discountPercentage: editingProduct.discountPercentage
        ? Number(editingProduct.discountPercentage)
        : undefined,
      mainImage:
        editingProduct.mainImage ||
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
      shortDescription: editingProduct.shortDescription || '',
      description: editingProduct.description || '',
      sku: editingProduct.sku || `LIV-${Math.floor(1000 + Math.random() * 9000)}`,
      displayStockCount: Number(editingProduct.displayStockCount ?? 10),
      isFeatured: Boolean(editingProduct.isFeatured),
      isBestSeller: Boolean(editingProduct.isBestSeller),
      isNew: Boolean(editingProduct.isNew),
      isOnSale: Boolean(editingProduct.isOnSale),
      inStock: Number(editingProduct.displayStockCount ?? 10) > 0,
      category: editingProduct.category,
      additionalImages: editingProduct.additionalImages || [],
    };

    sanityStore.saveProduct(prodData);
    showToast('تم حفظ المنتج في Sanity بنجاح', undefined, 'success');
    setEditingProduct(null);
    setNewAdditionalImageUrl('');
  };

  // Category Save Handler
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) {
      showToast('يرجى ملء اسم التصنيف', undefined, 'info');
      return;
    }

    const catData: Category = {
      _id: editingCategory._id || `cat_${Date.now()}`,
      _type: 'category',
      name: editingCategory.name,
      slug: { current: editingCategory.slug?.current || `cat-${Date.now()}` },
      description: editingCategory.description || '',
      image:
        editingCategory.image ||
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
      order: Number(editingCategory.order || categories.length + 1),
      active: true,
    };

    sanityStore.saveCategory(catData);
    showToast('تم حفظ التصنيف في Sanity بنجاح', undefined, 'success');
    setEditingCategory(null);
  };

  // Hero Save Handler
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHero?.title) {
      showToast('يرجى ملء عنوان البنر', undefined, 'info');
      return;
    }

    const heroData: HeroSlide = {
      _id: editingHero._id || `hero_${Date.now()}`,
      _type: 'heroSlide',
      title: editingHero.title,
      subtitle: editingHero.subtitle || '',
      description: editingHero.description || '',
      ctaText: editingHero.ctaText || 'تصفحي الآن',
      ctaLink: editingHero.ctaLink || '/products',
      image: editingHero.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
      active: editingHero.active !== undefined ? editingHero.active : true,
      order: Number(editingHero.order || heroSlides.length + 1),
      badge: editingHero.badge || 'تشكيلة 2026',
    };

    sanityStore.saveHeroSlide(heroData);
    showToast('تم حفظ البنر الرئيسي في Sanity بنجاح', undefined, 'success');
    setEditingHero(null);
  };

  // Testimonial Save Handler
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.name || !editingTestimonial.text) {
      showToast('يرجى ملء اسم العميلة ونص التقييم', undefined, 'info');
      return;
    }

    const testData: Testimonial = {
      _id: editingTestimonial._id || `testimonial_${Date.now()}`,
      _type: 'testimonial',
      name: editingTestimonial.name,
      text: editingTestimonial.text,
      rating: Number(editingTestimonial.rating || 5),
      city: editingTestimonial.city || 'صنعاء',
      image: editingTestimonial.image || '',
      active: editingTestimonial.active !== undefined ? editingTestimonial.active : true,
      order: Number(editingTestimonial.order || testimonials.length + 1),
      date: editingTestimonial.date || 'منذ يومين',
    };

    sanityStore.saveTestimonial(testData);
    showToast('تم حفظ رأي العميلة في Sanity بنجاح', undefined, 'success');
    setEditingTestimonial(null);
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(siteSettings);
    showToast('تم حفظ إعدادات المتجر ورقم الواتساب بنجاح', undefined, 'success');
  };

  // If not authenticated (PIN gate)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FAF7F2] rounded-3xl p-8 shadow-2xl border border-[#C8A96B]/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#171717] text-[#C8A96B] flex items-center justify-center mx-auto border-2 border-[#C8A96B]/30">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="font-['Cinzel'] font-bold text-2xl tracking-widest text-[#171717] block">
              SANITY STUDIO
            </span>
            <p className="text-xs text-stone-500 mt-1">لوحة إدارة المحتوى والمنتجات لمتجر LIVORA</p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div className="text-right">
              <label className="block text-xs font-bold text-[#171717] mb-1">
                أدخلي رمز المرور (PIN)
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="الرمز الافتراضي: livora2026"
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-sm text-[#171717] outline-none focus:border-[#C8A96B]"
              />
              {authError && <p className="text-xs text-red-600 mt-1">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#171717] hover:bg-[#C8A96B] text-[#F6F0E8] hover:text-[#171717] font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              دخول Sanity Studio
            </button>
          </form>

          <div className="pt-2 border-t border-stone-200 text-xs text-stone-400">
            رمز المرور الافتراضي للإدارة: <span className="font-bold text-[#171717]">livora2026</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#F6F0E8] flex flex-col">
      {/* Studio Top Header */}
      <header className="bg-[#1f1f1f] border-b border-[#C8A96B]/20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F6F0E8] text-[#171717] px-3 py-1 rounded-lg font-bold text-xs">
            <Database className="w-3.5 h-3.5 text-[#A58645]" />
            <span>SANITY STUDIO</span>
          </div>
          <span className="text-stone-500">/</span>
          <span className="text-xs text-stone-300 font-medium">LIVORA Content Management</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshAllData()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>مزامنة</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة المتجر الحقيقي</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body: Sidebar Navigation + Content Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#141414] border-l md:border-l-0 md:border-r border-white/5 p-4 space-y-1">
          <div className="text-[11px] font-bold text-[#C8A96B] uppercase tracking-wider px-3 py-2">
            مخططات Sanity (Schemas)
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'products'
                ? 'bg-[#C8A96B] text-[#171717]'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>المنتجات (product)</span>
            </div>
            <span className="text-[10px] opacity-80">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'categories'
                ? 'bg-[#C8A96B] text-[#171717]'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>التصنيفات (category)</span>
            </div>
            <span className="text-[10px] opacity-80">{categories.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'hero'
                ? 'bg-[#C8A96B] text-[#171717]'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>البنر الرئيسي (hero)</span>
            </div>
            <span className="text-[10px] opacity-80">{heroSlides.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'testimonials'
                ? 'bg-[#C8A96B] text-[#171717]'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>آراء العميلات (testimonial)</span>
            </div>
            <span className="text-[10px] opacity-80">{testimonials.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'settings'
                ? 'bg-[#C8A96B] text-[#171717]'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>إعدادات المتجر (settings)</span>
            </div>
          </button>

          <div className="text-[11px] font-bold text-[#C8A96B] uppercase tracking-wider px-3 pt-6 pb-2">
            أدوات Sanity المتقدمة
          </div>

          <button
            onClick={() => setActiveTab('groq')}
            className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'groq'
                ? 'bg-[#C8A96B] text-[#171717]'
                : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>GROQ Explorer</span>
            </div>
          </button>
        </aside>

        {/* Workspace Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#1a1a1a]">
          {/* TAB 1: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-[#F6F0E8] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#C8A96B]" />
                    <span>إدارة المنتجات في Sanity</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    إضافة وتعديل المنتجات والأسعار ونسب الخصومات والصور وتصنيفات الأكثر طلباً
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingProduct({
                      name: '',
                      price: 15000,
                      oldPrice: 19000,
                      discountPercentage: 20,
                      shortDescription: '',
                      mainImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
                      isBestSeller: true,
                      isNew: true,
                      inStock: true,
                      displayStockCount: 5,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد (New Document)</span>
                </button>
              </div>

              {/* Products Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-[#242424] rounded-2xl p-4 border border-white/10 hover:border-[#C8A96B]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover bg-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        <span className="text-[10px] text-[#C8A96B] font-bold block">
                          {prod.category?.name || 'بدون تصنيف'}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                        <div className="text-xs text-[#DEC593] font-bold mt-1">
                          {formatPrice(prod.price)}
                          {prod.oldPrice && (
                            <span className="text-[10px] text-stone-400 line-through mr-2">
                              {formatPrice(prod.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-[10px]">
                      {prod.isBestSeller && (
                        <span className="bg-[#C8A96B]/20 text-[#C8A96B] px-2 py-0.5 rounded">
                          الأكثر طلباً
                        </span>
                      )}
                      {prod.isOnSale && (
                        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                          خصم {prod.discountPercentage}%
                        </span>
                      )}
                      {prod.isNew && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          جديد
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2">
                      <span className="text-[10px] text-stone-400">
                        مخزون: {prod.displayStockCount ?? 10} {prod.additionalImages?.length ? `• ${prod.additionalImages.length + 1} صور` : ''}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A96B] hover:text-[#171717] text-stone-300 transition-colors"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكدة من حذف "${prod.name}"؟`)) {
                              deleteProduct(prod._id);
                              showToast('تم حذف المنتج', undefined, 'info');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-stone-300 transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES CRUD */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-[#F6F0E8] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#C8A96B]" />
                    <span>إدارة التصنيفات (Category Schema)</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">إضافة وتعديل الأقسام والصور والترتيب</p>
                </div>

                <button
                  onClick={() =>
                    setEditingCategory({
                      name: '',
                      description: '',
                      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
                      order: categories.length + 1,
                      active: true,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تصنيف جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-[#242424] rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                        <span className="text-[10px] text-stone-400">ترتيب العرض: {cat.order || 1}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A96B] hover:text-[#171717] text-stone-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`حذف تصنيف "${cat.name}"؟`)) {
                            deleteCategory(cat._id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-stone-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HERO SLIDES CRUD */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-[#F6F0E8] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C8A96B]" />
                    <span>إدارة البنر الرئيسي (Hero Schema)</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">إضافة وتعديل شرائح العرض الرئيسية بالصفحة الأولى والصور والعناوين</p>
                </div>

                <button
                  onClick={() =>
                    setEditingHero({
                      title: '',
                      subtitle: '',
                      description: '',
                      ctaText: 'تسوقي الآن',
                      ctaLink: '/products',
                      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800',
                      badge: 'تشكيلة حصرية',
                      active: true,
                      order: heroSlides.length + 1,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة بنر جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroSlides.map((hero) => (
                  <div
                    key={hero._id}
                    className="bg-[#242424] rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-3 items-start">
                      <img
                        src={hero.image}
                        alt={hero.title}
                        className="w-20 h-20 rounded-xl object-cover bg-stone-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        {hero.badge && (
                          <span className="text-[10px] bg-[#C8A96B]/20 text-[#C8A96B] px-2 py-0.5 rounded font-bold inline-block mb-1">
                            {hero.badge}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-white truncate">{hero.title}</h4>
                        {hero.subtitle && <p className="text-xs text-[#DEC593] font-medium">{hero.subtitle}</p>}
                        <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">{hero.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                      <span className="text-[10px] text-stone-400">ترتيب: {hero.order || 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingHero(hero)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A96B] hover:text-[#171717] text-stone-300 transition-colors"
                          title="تعديل البنر"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`حذف البنر "${hero.title}"؟`)) {
                              deleteHeroSlide(hero._id);
                              showToast('تم حذف البنر', undefined, 'info');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-stone-300 transition-colors"
                          title="حذف البنر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS CRUD */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-[#F6F0E8] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C8A96B]" />
                    <span>إدارة آراء العميلات (Testimonial Schema)</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">إضافة وتعديل تقييمات وآراء العميلات والمدينة والنجمات</p>
                </div>

                <button
                  onClick={() =>
                    setEditingTestimonial({
                      name: '',
                      text: '',
                      rating: 5,
                      city: 'صنعاء',
                      date: 'منذ يومين',
                      active: true,
                      order: testimonials.length + 1,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة رأي عميلة جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((test) => (
                  <div
                    key={test._id}
                    className="bg-[#242424] rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#C8A96B]/20 text-[#C8A96B] flex items-center justify-center font-bold text-xs">
                            {test.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{test.name}</h4>
                            <span className="text-[10px] text-stone-400">{test.city || 'اليمن'}</span>
                          </div>
                        </div>
                        <div className="flex text-[#C8A96B] text-xs">
                          {'★'.repeat(test.rating || 5)}
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed italic">"{test.text}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                      <span className="text-[10px] text-stone-400">{test.date || 'حديثاً'}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingTestimonial(test)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A96B] hover:text-[#171717] text-stone-300 transition-colors"
                          title="تعديل الرأي"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`حذف رأي "${test.name}"؟`)) {
                              deleteTestimonial(test._id);
                              showToast('تم حذف رأي العميلة', undefined, 'info');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500 hover:text-white text-stone-300 transition-colors"
                          title="حذف الرأي"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SITE SETTINGS (WhatsApp & Brand) */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-[#242424] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#C8A96B]" />
                  <span>إعدادات المتجر العامة (SiteSettings Schema)</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  تعديل رقم الواتساب الرسمي المعتمد وحسابات التواصل ونصوص المتجر
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#DEC593] mb-1">
                    رقم الواتساب الرسمي لطلبات المتجر (مع مفتاح الدولة) *
                  </label>
                  <input
                    type="text"
                    required
                    value={siteSettings.whatsappNumber}
                    onChange={(e) =>
                      updateSiteSettings({ whatsappNumber: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-white/15 text-xs text-white dir-ltr font-mono"
                  />
                  <span className="text-[10px] text-stone-400 block mt-1">
                    الرقم الحالي: +967737462144
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    اسم المتجر
                  </label>
                  <input
                    type="text"
                    value={siteSettings.storeName}
                    onChange={(e) => updateSiteSettings({ storeName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    وصف المتجر (SEO & Footer)
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.storeDescription}
                    onChange={(e) =>
                      updateSiteSettings({ storeDescription: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-white/15 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      رابط إنستغرام
                    </label>
                    <input
                      type="text"
                      value={siteSettings.instagram}
                      onChange={(e) => updateSiteSettings({ instagram: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-300 mb-1">
                      رابط تيك توك
                    </label>
                    <input
                      type="text"
                      value={siteSettings.tiktok}
                      onChange={(e) => updateSiteSettings({ tiktok: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات في Sanity</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('استعادة الإعدادات الافتراضية؟')) {
                        resetToDefaultData();
                      }
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    استعادة الإعدادات الأولية
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: GROQ EXPLORER */}
          {activeTab === 'groq' && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#C8A96B]" />
                  <span>Sanity Vision & GROQ Query Runner</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  اكتبي استعلامات GROQ لمعاينة البيانات المجلوبة من المخططات
                </p>
              </div>

              <div className="bg-[#141414] rounded-2xl p-4 border border-white/10 space-y-3">
                <textarea
                  rows={5}
                  value={groqQuery}
                  onChange={(e) => setGroqQuery(e.target.value)}
                  className="w-full bg-[#171717] text-[#DEC593] font-mono text-xs p-3 rounded-xl border border-white/10 outline-none"
                />
                <button
                  onClick={handleRunGroq}
                  className="px-5 py-2 rounded-xl bg-[#C8A96B] text-[#171717] font-bold text-xs flex items-center gap-1.5"
                >
                  <span>تشغيل الاستعلام (Run Query)</span>
                </button>
              </div>

              {groqResult && (
                <div className="bg-[#141414] rounded-2xl p-4 border border-white/10">
                  <span className="text-xs font-bold text-stone-400 block mb-2">
                    النتيجة المعادة (JSON Output):
                  </span>
                  <pre className="bg-[#171717] text-stone-300 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-96">
                    {JSON.stringify(groqResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit Product Modal Form */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#171717] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C8A96B]/50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#171717] mb-4 pb-3 border-b border-stone-200">
              {editingProduct._id ? 'تعديل وثيقة منتج (Edit Document)' : 'إنشاء منتج جديد في Sanity'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">السعر (ر.ي) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">السعر السابق</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        oldPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نسبة الخصم %</label>
                  <input
                    type="number"
                    value={editingProduct.discountPercentage || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountPercentage: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الكمية المتوفرة في المخزون (عدد القطع) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingProduct.displayStockCount ?? 10}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        displayStockCount: Number(e.target.value),
                        inStock: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رمز المنتج (SKU)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  صورة المنتج الرئيسية (رابط أو رفع من معرض الصور) *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <input
                    type="text"
                    placeholder="رابط الصورة أو اضغطي رفع من المعرض..."
                    value={editingProduct.mainImage || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mainImage: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                  <label className="shrink-0 px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all w-full sm:w-auto">
                    <Upload className="w-4 h-4" />
                    <span>تحميل من المعرض</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditingProduct((prev) => (prev ? { ...prev, mainImage: res } : null));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {editingProduct.mainImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={editingProduct.mainImage}
                      alt="معاينة الصورة"
                      className="w-16 h-16 rounded-xl object-cover border border-[#C8A96B]/40 shadow-sm"
                    />
                    <span className="text-[10px] text-stone-500">معاينة صورة المنتج الرئيسية</span>
                  </div>
                )}
              </div>

              {/* Additional Product Images Section */}
              <div className="pt-3 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  صور المنتج الإضافية (معرض صور المنتج - Multiple Gallery Images)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-3">
                  <input
                    type="text"
                    placeholder="أدخلي رابط صورة إضافية..."
                    value={newAdditionalImageUrl}
                    onChange={(e) => setNewAdditionalImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAdditionalImageUrl.trim()) {
                        setEditingProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                additionalImages: [...(prev.additionalImages || []), newAdditionalImageUrl.trim()],
                              }
                            : null
                        );
                        setNewAdditionalImageUrl('');
                      }
                    }}
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-[#171717] text-[#F6F0E8] font-bold text-xs hover:bg-[#C8A96B] hover:text-[#171717] transition-all w-full sm:w-auto cursor-pointer"
                  >
                    إضافة رابط
                  </button>

                  <label className="shrink-0 px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all w-full sm:w-auto">
                    <Upload className="w-4 h-4" />
                    <span>رفع صور متعددة من المعرض</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach((file) => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditingProduct((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      additionalImages: [...(prev.additionalImages || []), res],
                                    }
                                  : null
                              );
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </label>
                </div>

                {/* Display Thumbnails of all additional images */}
                {editingProduct.additionalImages && editingProduct.additionalImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 p-3 rounded-2xl bg-stone-100 border border-stone-200">
                    {editingProduct.additionalImages.map((imgUrl, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-300 bg-white">
                        <img
                          src={imgUrl}
                          alt={`صورة فرعية ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    additionalImages: (prev.additionalImages || []).filter((_, i) => i !== index),
                                  }
                                : null
                            );
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity shadow-md"
                          title="حذف هذه الصورة"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-400 italic">لم تُمضَف صور إضافية لهذا المنتج بعد.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              {/* Flags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isBestSeller)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })
                    }
                    className="accent-[#C8A96B]"
                  />
                  <span>الأكثر طلباً</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                    }
                    className="accent-[#C8A96B]"
                  />
                  <span>منتج مميز</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isOnSale)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isOnSale: e.target.checked })
                    }
                    className="accent-[#C8A96B]"
                  />
                  <span>في التخفيضات</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isNew)}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                    }
                    className="accent-[#C8A96B]"
                  />
                  <span>جديد 2026</span>
                </label>
              </div>

              <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#C8A96B] text-white hover:text-[#171717] text-xs font-bold transition-all shadow-md"
                >
                  حفظ في Sanity DataStore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal Form */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-[#FAF7F2] text-[#171717] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C8A96B]/50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#171717] mb-4 pb-3 border-b border-stone-200">
              {editingCategory._id ? 'تعديل تصنيف' : 'إضافة تصنيف جديد في Sanity'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">وصف التصنيف</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  صورة التصنيف (رابط أو رفع من معرض الصور) *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <input
                    type="text"
                    placeholder="رابط الصورة أو ارفعي صورة..."
                    value={editingCategory.image || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                  <label className="shrink-0 px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all w-full sm:w-auto">
                    <Upload className="w-4 h-4" />
                    <span>تحميل من المعرض</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditingCategory((prev) => (prev ? { ...prev, image: res } : null));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {editingCategory.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={editingCategory.image}
                      alt="معاينة الصورة"
                      className="w-14 h-14 rounded-xl object-cover border border-[#C8A96B]/40 shadow-sm"
                    />
                    <span className="text-[10px] text-stone-500">معاينة صورة التصنيف</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#C8A96B] text-white hover:text-[#171717] text-xs font-bold transition-all shadow-md"
                >
                  حفظ التصنيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hero Slide Modal */}
      {editingHero && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-[#FAF7F2] text-[#171717] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C8A96B]/50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#171717] mb-4 pb-3 border-b border-stone-200">
              {editingHero._id ? 'تعديل بنر رئيسي' : 'إنشاء بنر رئيسي جديد'}
            </h3>

            <form onSubmit={handleSaveHero} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">العنوان الرئيسي *</label>
                <input
                  type="text"
                  required
                  value={editingHero.title || ''}
                  onChange={(e) => setEditingHero({ ...editingHero, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">العنوان الفرعي</label>
                <input
                  type="text"
                  value={editingHero.subtitle || ''}
                  onChange={(e) => setEditingHero({ ...editingHero, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الوصف التفصيلي</label>
                <textarea
                  rows={2}
                  value={editingHero.description || ''}
                  onChange={(e) => setEditingHero({ ...editingHero, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  صورة البنر الرئيسي (رابط أو رفع من معرض الصور) *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <input
                    type="text"
                    placeholder="رابط الصورة أو ارفعي صورة..."
                    value={editingHero.image || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                  <label className="shrink-0 px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all w-full sm:w-auto">
                    <Upload className="w-4 h-4" />
                    <span>تحميل من المعرض</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditingHero((prev) => (prev ? { ...prev, image: res } : null));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {editingHero.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={editingHero.image}
                      alt="معاينة الصورة"
                      className="w-20 h-14 rounded-xl object-cover border border-[#C8A96B]/40 shadow-sm"
                    />
                    <span className="text-[10px] text-stone-500">معاينة صورة البنر</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نص الزر (CTA Text)</label>
                  <input
                    type="text"
                    value={editingHero.ctaText || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, ctaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">شارة البنر (Badge)</label>
                  <input
                    type="text"
                    value={editingHero.badge || ''}
                    onChange={(e) => setEditingHero({ ...editingHero, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHero(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#C8A96B] text-white hover:text-[#171717] text-xs font-bold transition-all shadow-md"
                >
                  حفظ البنر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-[#FAF7F2] text-[#171717] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C8A96B]/50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#171717] mb-4 pb-3 border-b border-stone-200">
              {editingTestimonial._id ? 'تعديل رأي عميلة' : 'إضافة رأي عميلة جديد'}
            </h3>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">اسم العميلة *</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.name || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">المدينة (صنعاء، عدن، تعز...)</label>
                <input
                  type="text"
                  value={editingTestimonial.city || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">نص التقييم / الرأي *</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.text || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">التقييم بالنجمات (1-5)</label>
                <select
                  value={editingTestimonial.rating || 5}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-[#171717]"
                >
                  <option value={5}>★★★★★ (5 نجمات)</option>
                  <option value={4}>★★★★ (4 نجمات)</option>
                  <option value={3}>★★★ (3 نجمات)</option>
                  <option value={2}>★★ (نجمتان)</option>
                  <option value={1}>★ (نجمة واحدة)</option>
                </select>
              </div>

              <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#C8A96B] text-white hover:text-[#171717] text-xs font-bold transition-all shadow-md"
                >
                  حفظ الرأي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
