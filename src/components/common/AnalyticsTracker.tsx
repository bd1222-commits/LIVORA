import { useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

export const AnalyticsTracker = () => {
  useEffect(() => {
    // 1. Skip tracking if in admin panel
    if (window.location.pathname.startsWith('/admin')) return;

    // 2. Session deduplication: Only record ONE visit per browser session
    const sessionActiveKey = 'livora_session_active_v1';
    if (sessionStorage.getItem(sessionActiveKey)) {
      return; // Already recorded for this session; prevent duplicate tracking
    }
    sessionStorage.setItem(sessionActiveKey, Date.now().toString());

    // 3. Non-blocking background tracking execution
    const timer = setTimeout(async () => {
      try {
        // Persistent Visitor ID per browser/device
        let vid = localStorage.getItem('livora_visitor_id');
        if (!vid) {
          vid = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('livora_visitor_id', vid);
        }

        const todayStr = new Date().toISOString().split('T')[0];

        // A. Insert real visit record into visits table
        try {
          await supabase.from('visits').insert([
            {
              path: window.location.pathname,
              session_id: vid,
              visited_at: new Date().toISOString(),
            },
          ]);
        } catch {
          // Silent catch if RLS or table schema requires fallback
        }

        // B. Update real stats in site_settings as fallback
        try {
          const { data } = await supabase.from('site_settings').select('id, shipping_info').limit(1);
          if (data && data.length > 0) {
            const row = data[0];
            let stats: any = {};
            try {
              stats = JSON.parse(row.shipping_info || '{}');
            } catch {
              stats = {};
            }

            const uniqueSet = new Set(Array.isArray(stats.uniqueVids) ? stats.uniqueVids : []);
            const isNewGlobalVisitor = !uniqueSet.has(vid);
            uniqueSet.add(vid);

            const todayVidsSet = new Set(stats.lastDate === todayStr && Array.isArray(stats.todayVids) ? stats.todayVids : []);
            const isNewTodayVisitor = !todayVidsSet.has(vid);
            todayVidsSet.add(vid);

            const newStats = {
              ...stats,
              totalVisits: isNewGlobalVisitor ? (stats.totalVisits || 0) + 1 : (stats.totalVisits || 0),
              todayVisits: stats.lastDate === todayStr ? (stats.todayVisits || 0) + (isNewTodayVisitor ? 1 : 0) : 1,
              last7Days: (stats.last7Days || 0) + (isNewTodayVisitor ? 1 : 0),
              last30Days: (stats.last30Days || 0) + (isNewTodayVisitor ? 1 : 0),
              lastDate: todayStr,
              uniqueVids: Array.from(uniqueSet).slice(-2000),
              todayVids: Array.from(todayVidsSet),
            };

            await supabase
              .from('site_settings')
              .update({ shipping_info: JSON.stringify(newStats) })
              .eq('id', row.id);
          }
        } catch {
          // Silent fallback
        }
      } catch (err) {
        console.error('Analytics tracking error:', err);
      }
    }, 800); // 800ms delay to ensure page load is completely uninterrupted

    return () => clearTimeout(timer);
  }, []);

  return null;
};
