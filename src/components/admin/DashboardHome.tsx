import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, Grid, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export const DashboardHome: React.FC = () => {
  const { products, categories } = useStore();
  const [visitsStats, setVisitsStats] = useState({
    total: 0,
    today: 0,
    last7Days: 0,
    last30Days: 0
  });

  const availableProducts = products.filter(p => (p.displayStockCount || 0) > 0);
  const lowStockProducts = products.filter(p => (p.displayStockCount || 0) > 0 && (p.displayStockCount || 0) <= 5);
  const outOfStockProducts = products.filter(p => (p.displayStockCount || 0) === 0);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOf7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const startOf30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        let totalC = 0;
        let todayC = 0;
        let last7C = 0;
        let last30C = 0;

        // Fetch visits from table to calculate Unique Visitors (distinct session_id)
        const { data: visitsData, error: visitsErr } = await supabase
          .from('visits')
          .select('session_id, visited_at');

        if (!visitsErr && visitsData && visitsData.length > 0) {
          const allUnique = new Set<string>();
          const todayUnique = new Set<string>();
          const last7DaysUnique = new Set<string>();
          const last30DaysUnique = new Set<string>();

          visitsData.forEach((row: any) => {
            const sid = row.session_id || 'anon';
            const dateStr = row.visited_at || row.created_at || '';
            
            allUnique.add(sid);
            if (dateStr >= startOfToday) todayUnique.add(sid);
            if (dateStr >= startOf7Days) last7DaysUnique.add(sid);
            if (dateStr >= startOf30Days) last30DaysUnique.add(sid);
          });

          totalC = allUnique.size;
          todayC = todayUnique.size;
          last7C = last7DaysUnique.size;
          last30C = last30DaysUnique.size;
        } else {
          // Read from site_settings fallback (NO mock/fake numbers)
          const { data: settingsData } = await supabase.from('site_settings').select('shipping_info').limit(1);
          if (settingsData && settingsData.length > 0 && settingsData[0].shipping_info) {
            let stats: any = {};
            try {
              stats = JSON.parse(settingsData[0].shipping_info || '{}');
            } catch {
              stats = {};
            }
            totalC = stats.totalVisits || stats.totalUniqueVisitors || 0;
            todayC = stats.todayVisits || stats.todayUniqueVisitors || 0;
            last7C = stats.last7Days || 0;
            last30C = stats.last30Days || 0;
          }
        }

        setVisitsStats({
          total: totalC,
          today: todayC,
          last7Days: last7C,
          last30Days: last30C
        });
      } catch (e) {
        console.error('Error fetching visits', e);
      }
    };
    
    fetchVisits();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-['Cinzel'] text-[#C8A96B] mb-6">نظرة عامة على المتجر</h2>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-[#1C1C1C] border border-blue-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -z-10" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-stone-400 font-bold text-xs sm:text-sm">زوار اليوم</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white font-['Cinzel']">{visitsStats.today}</p>
        </div>
        
        <div className="bg-[#1C1C1C] border border-green-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -z-10" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-stone-400 font-bold text-xs sm:text-sm">آخر 7 أيام</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white font-['Cinzel']">{visitsStats.last7Days}</p>
        </div>

        <div className="bg-[#1C1C1C] border border-purple-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -z-10" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-stone-400 font-bold text-xs sm:text-sm">آخر 30 يوماً</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white font-['Cinzel']">{visitsStats.last30Days}</p>
        </div>

        <div className="bg-[#1C1C1C] border border-[#C8A96B]/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A96B]/5 rounded-bl-full -z-10" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-stone-400 font-bold text-xs sm:text-sm">إجمالي الزيارات</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C8A96B]/10 flex items-center justify-center text-[#C8A96B]">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white font-['Cinzel']">{visitsStats.total}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-stone-400 font-bold text-xs sm:text-sm">إجمالي المنتجات</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center text-stone-300">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white font-['Cinzel']">{products.length}</p>
        </div>

        <div className="bg-[#1C1C1C] border border-emerald-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-emerald-400 font-bold text-xs sm:text-sm">منتجات متاحة</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-emerald-400 font-['Cinzel']">{availableProducts.length}</p>
        </div>

        <div className="bg-[#1C1C1C] border border-orange-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-orange-400 font-bold text-xs sm:text-sm">مخزون منخفض</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-orange-400 font-['Cinzel']">{lowStockProducts.length}</p>
        </div>

        <div className="bg-[#1C1C1C] border border-red-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-red-400 font-bold text-xs sm:text-sm">نفدت الكمية</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-red-400 font-['Cinzel']">{outOfStockProducts.length}</p>
        </div>
      </div>
    </div>
  );
};

