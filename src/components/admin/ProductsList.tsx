import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export const ProductsList: React.FC = () => {
  const { products, categories, navigateTo, refreshAllData, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.current.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.category?._ref === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    setDeletingId(id);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showToast('تم الحذف', 'تم حذف المنتج بنجاح', 'success');
      refreshAllData();
    } catch (e: any) {
      showToast('خطأ', e.message || 'فشل حذف المنتج', 'info');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">إدارة المنتجات</h2>
        <button
          onClick={() => navigateTo('admin', { adminPath: '/products/new' })}
          className="bg-[#C8A96B] text-[#171717] px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#DEC593] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 pr-11 text-white focus:outline-none focus:border-[#C8A96B]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#141414] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#C8A96B] md:w-64"
          >
            <option value="">جميع التصنيفات</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-stone-400 bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-bold">المنتج</th>
                <th className="px-4 py-3 font-bold">السعر</th>
                <th className="px-4 py-3 font-bold">التصنيف</th>
                <th className="px-4 py-3 font-bold">المخزون</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => {
                const catName = categories.find(c => c._id === product.category?._ref)?.name || 'غير محدد';
                return (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={product.mainImage} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono" dir="ltr">{product.slug.current}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white font-bold">{product.price} ر.ي</div>
                      {product.oldPrice && <div className="text-stone-500 line-through text-xs">{product.oldPrice} ر.ي</div>}
                    </td>
                    <td className="px-4 py-3 text-stone-300">{catName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.displayStockCount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {product.displayStockCount > 0 ? `${product.displayStockCount} متوفر` : 'نفذ الكمية'}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      {product.isFeatured && <span className="inline-block px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] rounded mr-1">مميز</span>}
                      {product.isNew && <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded mr-1">جديد</span>}
                      {product.isOnSale && <span className="inline-block px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded mr-1">تخفيض</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateTo('admin', { adminPath: `/products/${product._id}` })}
                          className="p-1.5 bg-white/5 text-stone-300 hover:bg-[#C8A96B] hover:text-[#171717] rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-1.5 bg-white/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    لا يوجد منتجات تطابق بحثك.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
