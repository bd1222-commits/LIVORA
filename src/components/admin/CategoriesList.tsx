import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export const CategoriesList: React.FC = () => {
  const { categories, navigateTo, refreshAllData, showToast } = useStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع.')) return;
    
    setDeletingId(id);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      showToast('تم الحذف', 'تم حذف التصنيف بنجاح', 'success');
      refreshAllData();
    } catch (e: any) {
      showToast('خطأ', e.message || 'فشل حذف التصنيف', 'info');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B]">إدارة التصنيفات</h2>
        <button
          onClick={() => navigateTo('admin', { adminPath: '/categories/new' })}
          className="bg-[#C8A96B] text-[#171717] px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#DEC593] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة تصنيف</span>
        </button>
      </div>

      <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-white/10 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-stone-400 bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-bold">التصنيف</th>
                <th className="px-4 py-3 font-bold">الترتيب</th>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={category.image} alt={category.name} className="w-12 h-12 rounded-xl object-cover bg-white/5" />
                    <div>
                      <p className="font-bold text-white">{category.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono" dir="ltr">{category.slug.current}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">{category.order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      category.active ? 'bg-green-500/10 text-green-400' : 'bg-stone-500/10 text-stone-400'
                    }`}>
                      {category.active ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('admin', { adminPath: `/categories/${category._id}` })}
                        className="p-1.5 bg-white/5 text-stone-300 hover:bg-[#C8A96B] hover:text-[#171717] rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        disabled={deletingId === category._id}
                        className="p-1.5 bg-white/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                    لا يوجد تصنيفات حالياً.
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
