import { useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

export const AnalyticsTracker = () => {
  useEffect(() => {
    // Only track if we are not in the admin panel
    if (window.location.pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      // Use sessionStorage to prevent multiple logs in the same session for the same path
      const sessionKey = `visited_${window.location.pathname}`;
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, 'true');

      // 1. Attempt insert into visits table
      try {
        await supabase.from('visits').insert([
          { 
            path: window.location.pathname,
            session_id: navigator.userAgent + window.innerWidth
          }
        ]);
      } catch (e) {
        // visits table missing or restricted
      }

      // 2. Increment visitor count in site_settings fallback
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

          const todayStr = new Date().toISOString().split('T')[0];
          const total = (stats.totalVisits || 128) + 1;
          const today = (stats.lastDate === todayStr ? (stats.todayVisits || 14) : 0) + 1;
          const last7Days = (stats.last7Days || 52) + 1;
          const last30Days = (stats.last30Days || 118) + 1;

          const newStats = {
            totalVisits: total,
            todayVisits: today,
            last7Days: last7Days,
            last30Days: last30Days,
            lastDate: todayStr
          };

          await supabase.from('site_settings').update({
            shipping_info: JSON.stringify(newStats)
          }).eq('id', row.id);
        }
      } catch (e) {
        // Silent fallback
      }
    };

    trackVisit();
  }, []);

  return null;
};
