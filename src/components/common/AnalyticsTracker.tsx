import { useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

export const AnalyticsTracker = () => {
  useEffect(() => {
    // Only track if we are not in the admin panel
    if (window.location.pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      try {
        // Get or create unique anonymous visitor ID in localStorage
        let vid = localStorage.getItem('livora_vid');
        if (!vid) {
          vid = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('livora_vid', vid);
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const sessionKey = `visited_today_${todayStr}`;

        // Prevent multiple visit logs in the same session on page navigation
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, 'true');

        // 1. Insert into visits table with session_id = vid
        try {
          await supabase.from('visits').insert([
            {
              path: window.location.pathname,
              session_id: vid,
              visited_at: new Date().toISOString()
            }
          ]);
        } catch (e) {
          // Silent fallback if visits table missing or restricted
        }

        // 2. Real fallback in site_settings (No mock/fake numbers)
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
              todayVisits: isNewTodayVisitor ? todayVidsSet.size : 1,
              last7Days: (stats.last7Days || 0) + (isNewTodayVisitor ? 1 : 0),
              last30Days: (stats.last30Days || 0) + (isNewTodayVisitor ? 1 : 0),
              lastDate: todayStr,
              uniqueVids: Array.from(uniqueSet).slice(-1000),
              todayVids: Array.from(todayVidsSet)
            };

            await supabase.from('site_settings').update({
              shipping_info: JSON.stringify(newStats)
            }).eq('id', row.id);
          }
        } catch (e) {
          // Silent fallback
        }
      } catch (err) {
        console.error('Analytics error:', err);
      }
    };

    trackVisit();
  }, []);

  return null;
};
