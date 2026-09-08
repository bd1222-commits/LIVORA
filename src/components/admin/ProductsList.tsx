import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Edit3, Trash2, GripVertical, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { Product } from '../../types';

export const ProductsList: React.FC = () => {
  const { products, categories, navigateTo, refreshAllData, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Drag and Drop State
  const [productList, setProductList] = useState<Product[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync state when store products change
  useEffect(() => {
    const sorted = [...products].sort((a, b) => {
      const orderA = a.allSortOrder ?? a.details?.all_sort_order ?? a.details?.allSortOrder ?? 999999;
      const orderB = b.allSortOrder ?? b.details?.all_sort_order ?? b.details?.allSortOrder ?? 999999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    });
    setProductList(sorted);
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = productList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.current.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.category?._ref === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const saveOrderToSupabase = async (newList: Product[]) => {
    setIsSavingOrder(true);
    try {
      await Promise.all(
        newList.map(async (product, idx) => {
          const newOrder = idx + 1;
          const existingDetails = (typeof product.details === 'object' && product.details !== null) ? product.details : {};
          const dbData = {
            details: {
              ...existingDetails,
              all_sort_order: newOrder,
              allSortOrder: newOrder,
              home_sort_order: product.homeSortOrder ?? existingDetails.home_sort_order ?? newOrder,
              homeSortOrder: product.homeSortOrder ?? existingDetails.homeSortOrder ?? newOrder,
              category_sort_order: product.categorySortOrder ?? existingDetails.category_sort_order ?? newOrder,
              categorySortOrder: product.categorySortOrder ?? existingDetails.categorySortOrder ?? newOrder,
            }
          };
          await supabase.from('products').update(dbData).eq('id', product._id);
        })
      );
      showToast('تم حفظ الترتيب الجديد بنجاح', undefined, 'success');
      refreshAllData();
    } catch (err: any) {
      showToast('خطأ أثناء حفظ الترتيب', err.message || 'حدث خطأ', 'info');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= productList.length) return;
    const updated = [...productList];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setProductList(updated);
    saveOrderToSupabase(updated);
  };

  const moveUp = (index: number) => {
    if (index > 0) handleReorder(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index < productList.length - 1) handleReorder(index, index + 1);
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      handleReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch Drag Support for Mobile
  const touchStartY = useRef<number | null>(null);
  const touchStartIndex = useRef<number | null>(null);

  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartIndex.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartIndex.current === null) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - touchStartY.current;
    
    // Threshold of 40px for row reorder on touch
    if (Math.abs(diffY) > 40) {
      const direction = diffY > 0 ? 1 : -1;
      const targetIndex = touchStartIndex.current + direction;
      if (targetIndex >= 0 && targetIndex < productList.length) {
        handleReorder(touchStartIndex.current, targetIndex);
        touchStartIndex.current = targetIndex;
        touchStartY.current = currentY;
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    touchStartIndex.current = null;
    setDraggedIndex(null);
  };

  const handleToggleVisibility = async (product: any) => {
    const nextVal = !(product.isVisible !== false);
    try {
      const existingDetails = (typeof product.details === 'object' && product.details !== null) ? product.details : {};
      const dbData = {
        is_visible: nextVal,
        details: {
          ...existingDetails,
          is_visible: nextVal,
          isVisible: nextVal,
        }
      };

      let { error: saveError } = await supabase.from('products').update(dbData).eq('id', product._id);
      if (saveError && saveError.message?.includes('is_visible')) {
        delete (dbData as any).is_visible;
        const retryRes = await supabase.from('products').update(dbData).eq('id', product._id);
        saveError = retryRes.error;
      }

      if (saveError) throw saveError;

      showToast(nextVal ? 'تم إظهار المنتج في المتجر' : 'تم إخفاء المنتج من المتجر', product.name, nextVal ? 'success' : 'info');
      refreshAllData();
    } catch (err: any) {
      showToast('خطأ', err.message || 'فشل تغيير حالة الظهور', 'info');
    }
  };

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

  const isFilterActive = Boolean(searchTerm.trim() || filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">إدارة المنتجات</h2>
          {isSavingOrder && (
            <div className="flex items-center gap-1.5 text-xs text-[#C8A96B] bg-[#C8A96B]/10 px-3 py-1 rounded-full border border-[#C8A96B]/30 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>جارٍ حفظ الترتيب...</span>
            </div>
          )}
        </div>
        <button
          onClick={() => navigateTo('admin', { adminPath: '/products/new' })}
          className="bg-[#C8A96B] text-[#171717] px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#DEC593] transition-colors shadow-md text-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      <div className="bg-[#1F1F1F] rounded-2xl p-4 sm:p-6 border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
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

        {!isFilterActive && (
          <div className="mb-4 p-2.5 bg-[#C8A96B]/10 border border-[#C8A96B]/20 rounded-xl text-xs text-[#DEC593] flex items-center justify-between">
            <span>💡 <strong>إعادة الترتيب بالسحب والإفلات (Drag & Drop):</strong> اضغط مع السحب على أيقونة الترتيب لإعادة ترتيب المنتج بالسحب للثواني أو استخدم أسهم الترتيب.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-stone-400 bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-3 py-3 font-bold text-center w-24">الترتيب</th>
                <th className="px-4 py-3 font-bold">المنتج</th>
                <th className="px-4 py-3 font-bold">السعر</th>
                <th className="px-4 py-3 font-bold">التصنيف</th>
                <th className="px-4 py-3 font-bold">المخزون</th>
                <th className="px-4 py-3 font-bold">الظهور في المتجر</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product, idx) => {
                const catName = categories.find(c => c._id === product.category?._ref)?.name || 'غير محدد';
                const isVis = product.isVisible !== false;
                const globalIndex = productList.findIndex(p => p._id === product._id);
                const isDragging = draggedIndex === globalIndex;
                const isOver = dragOverIndex === globalIndex;

                return (
                  <tr
                    key={product._id}
                    draggable={!isFilterActive}
                    onDragStart={(e) => handleDragStart(globalIndex, e)}
                    onDragOver={(e) => handleDragOver(globalIndex, e)}
                    onDrop={(e) => handleDrop(globalIndex, e)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all duration-150 ${
                      isDragging ? 'opacity-30 bg-[#C8A96B]/20' : 'hover:bg-white/5'
                    } ${isOver ? 'border-t-2 border-[#C8A96B] bg-[#C8A96B]/10' : ''}`}
                  >
                    {/* Reorder Handle Column */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1 text-stone-400">
                        <span className="text-[11px] font-mono font-bold text-[#C8A96B] bg-[#141414] px-2 py-0.5 rounded-md border border-white/10">
                          {globalIndex + 1}
                        </span>
                        {!isFilterActive && (
                          <>
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white"
                              title="اضغط واسحب لتغيير الترتيب"
                              onTouchStart={(e) => handleTouchStart(globalIndex, e)}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => moveUp(globalIndex)}
                                disabled={globalIndex === 0}
                                className="p-0.5 rounded hover:bg-white/10 text-stone-400 hover:text-[#C8A96B] disabled:opacity-20 cursor-pointer"
                                title="تحريك لأعلى"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveDown(globalIndex)}
                                disabled={globalIndex === productList.length - 1}
                                className="p-0.5 rounded hover:bg-white/10 text-stone-400 hover:text-[#C8A96B] disabled:opacity-20 cursor-pointer"
                                title="تحريك لأسفل"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={product.mainImage} alt={product.name} className="w-10 aspect-[1080/1442] rounded-lg object-contain bg-[#FAF7F2] p-0.5" />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono" dir="ltr">{product.slug.current}</p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <div className="text-white font-bold">{product.price} ر.ي</div>
                      {product.oldPrice && <div className="text-stone-500 line-through text-xs">{product.oldPrice} ر.ي</div>}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-stone-300">{catName}</td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.displayStockCount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {product.displayStockCount > 0 ? `${product.displayStockCount} متوفر` : 'نفذ الكمية'}
                      </span>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleVisibility(product)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                          isVis
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-stone-500/20 text-stone-400 border border-stone-500/30 hover:bg-stone-500/30'
                        }`}
                        title="انقر لتغيير إظهار أو إخفاء المنتج من المتجر"
                      >
                        <span className={`w-2 h-2 rounded-full ${isVis ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
                        <span>{isVis ? 'ظاهر [ ON ]' : 'مخفي [ OFF ]'}</span>
                      </button>
                    </td>

                    {/* Badges */}
                    <td className="px-4 py-3 space-y-1">
                      {product.isFeatured && <span className="inline-block px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] rounded mr-1">مميز</span>}
                      {product.isNew && <span className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded mr-1">جديد</span>}
                      {product.isOnSale && <span className="inline-block px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded mr-1">تخفيض</span>}
                      {product.isGlobalBrand && <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] rounded mr-1">براند عالمي</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateTo('admin', { adminPath: `/products/${product._id}` })}
                          className="p-1.5 bg-white/5 text-stone-300 hover:bg-[#C8A96B] hover:text-[#171717] rounded-lg transition-colors cursor-pointer"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-1.5 bg-white/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
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
                  <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
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
