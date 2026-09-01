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

      try {
        await supabase.from('visits').insert([
          { 
            path: window.location.pathname,
            session_id: navigator.userAgent + window.innerWidth // Simple pseudo-session
          }
        ]);
        sessionStorage.setItem(sessionKey, 'true');
      } catch (e) {
        console.error('Failed to track visit', e);
      }
    };

    trackVisit();
  }, []);

  return null;
};
