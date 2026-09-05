import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent mobile browser pinch zoom on storefront while allowing full admin controls
if (typeof window !== 'undefined') {
  document.addEventListener('gesturestart', function (e) {
    // Allow gestures inside admin panel or range inputs
    const target = e.target as HTMLElement | null;
    if (target?.closest('.admin-panel') || target?.tagName === 'INPUT') {
      return;
    }
    e.preventDefault();
  }, { passive: false });

  // Prevent double-tap zoom on storefront interactive elements
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (e) {
    const now = Date.now();
    const target = e.target as HTMLElement | null;
    if (target?.closest('.admin-panel') || target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT') {
      return;
    }
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
