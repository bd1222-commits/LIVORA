import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { supabase } from '../../lib/supabase/client';
import { ArrowRight, Save, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { MultiImageUploader } from './MultiImageUploader';

interface ProductFormProps {
  productId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const { navigateTo, products, categories, refreshAllData, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    price: 0,
    oldPrice: 0,
    discountPercentage: 0,
    displayStockCount: 10,
    sku: '',
    categoryId: '',
    mainImage: '',
    additionalImages: [] as string[],
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    isOnSale: false,
    isGlobalBrand: false,
  });

  useEffect(() => {
    if (productId) {
      const product = products.find(p => p._id === productId);
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug.current,
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          price: product.price,
          oldPrice: product.oldPrice || 0,
          discountPercentage: product.discountPercentage || 0,
          displayStockCount: product.displayStockCount || 0,
          sku: product.sku || '',
          categoryId: product.category?._ref || '',
          mainImage: product.mainImage,
          additionalImages: product.additionalImages || [],
          isFeatured: product.isFeatured || false,
          isBestSeller: product.isBestSeller || false,
          isNew: product.isNew || false,
          isOnSale: product.isOnSale || false,
          isGlobalBrand: product.isGlobalBrand || false,
        });
      }
    }
  }, [productId, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        
        // Auto-calculate discount if oldPrice and price are modified
        if (name === 'oldPrice' || name === 'price') {
          const oldP = parseFloat(name === 'oldPrice' ? value : prev.oldPrice) || 0;
          const currentP = parseFloat(name === 'price' ? value : prev.price) || 0;
          
          if (oldP > currentP && currentP > 0) {
            next.discountPercentage = Math.round(((oldP - currentP) / oldP) * 100);
          } else {
            next.discountPercentage = 0;
          }
        }
        
        return next;
      });
    } else {
      setFormData((prev) => {
        const updates: any = { [name]: value };
        if (name === 'name' && !productId) {
          updates.slug = value.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '').trim().replace(/\s+/g, '-');
        }
        return { ...prev, ...updates };
      });
    }
  };

  const handleMainImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, mainImage: url }));
  };

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, additionalImages: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dbData = {
        name: formData.name,
        slug: formData.slug,
        main_image: formData.mainImage,
        additional_images: formData.additionalImages,
        price: formData.price,
        old_price: formData.oldPrice,
        discount_percentage: formData.discountPercentage,
        short_description: formData.shortDescription,
        description: formData.description,
        category_id: formData.categoryId || null,
        sku: formData.sku,
        display_stock_count: formData.displayStockCount,
        is_featured: formData.isFeatured,
        is_best_seller: formData.isBestSeller,
        is_new: formData.isNew,
        is_on_sale: formData.isOnSale,
        is_global_brand: formData.isGlobalBrand,
      };

      let { error: saveError } = productId
        ? await supabase.from('products').update(dbData).eq('id', productId)
        : await supabase.from('products').insert([dbData]);

      if (saveError && saveError.message?.includes('is_global_brand')) {
        delete (dbData as any).is_global_brand;
        const retryRes = productId
          ? await supabase.from('products').update(dbData).eq('id', productId)
          : await supabase.from('products').insert([dbData]);
        saveError = retryRes.error;
      }

      if (saveError) throw saveError;

      refreshAllData();
      setSuccess('تم حفظ المنتج بنجاح');
      showToast('تم الحفظ بنجاح', 'تم حفظ المنتج بنجاح', 'success');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1C1C1C] rounded-2xl border border-white/5 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigateTo('admin', { adminPath: '/products' })}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#C8A96B] hover:text-[#171717] transition-all"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white">
          {productId ? 'تعديل منتج' : 'إضافة منتج جديد'}
        </h2>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">المعلومات الأساسية</h3>
            
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">اسم المنتج *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رابط المنتج (Slug) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                dir="ltr"
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">التصنيف</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
              >
                <option value="">بدون تصنيف</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">رمز المنتج (SKU)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                dir="ltr"
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">وصف مختصر</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">الوصف الكامل</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">الأسعار والمخزون</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-300 mb-2">السعر الحالي (ر.ي) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-300 mb-2">السعر القديم (ر.ي)</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-300 mb-2">نسبة الخصم % (تلقائي)</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  readOnly
                  className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-stone-500 outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-300 mb-2">الكمية (المخزون)</label>
                <input
                  type="number"
                  name="displayStockCount"
                  value={formData.displayStockCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mt-6">حالة المنتج</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" />
                <span className="text-sm font-bold text-stone-300">منتج مميز (Featured)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" />
                <span className="text-sm font-bold text-stone-300">الأكثر مبيعاً</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" />
                <span className="text-sm font-bold text-stone-300">وصل حديثاً</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleChange} className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" />
                <span className="text-sm font-bold text-stone-300">عليه عرض/تخفيض</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isGlobalBrand" checked={formData.isGlobalBrand} onChange={handleChange} className="w-5 h-5 accent-[#C8A96B] bg-[#141414] border-white/10 rounded" />
                <span className="text-sm font-bold text-stone-300">براند عالمي</span>
              </label>
            </div>
            
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mt-6">صور المنتج</h3>
            <div className="space-y-6">
              <ImageUploader 
                label="الصورة الرئيسية (المقاس المعتمد 1080 × 1442) *" 
                value={formData.mainImage} 
                onChange={handleMainImageChange} 
                isProductImage={true}
              />
              <MultiImageUploader 
                label="صور إضافية (المقاس المعتمد 1080 × 1442)" 
                values={formData.additionalImages} 
                onChange={handleAdditionalImagesChange} 
                isProductImage={true}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.mainImage}
            className="bg-[#C8A96B] hover:bg-[#DEC593] disabled:opacity-50 text-[#171717] font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
