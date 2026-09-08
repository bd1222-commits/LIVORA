/**
 * LIVORA | ليفورا
 * Luxury E-Commerce for Accessories, Makeup & Skincare in Yemen
 * WhatsApp Ordering
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';
import { ToastContainer } from './components/common/Toast';
import { WhatsAppFloatingButton } from './components/common/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthProvider } from './context/AuthContext';
import { AdminApp } from './components/admin/AdminApp';
import { AnalyticsTracker } from './components/common/AnalyticsTracker';

const AppContent: React.FC = () => {
  const { currentRoute, loading } = useStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F6F0E8] z-50 flex items-center justify-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <img 
            src="/livora-logo.jpg" 
            alt="Loading..." 
            className="w-full h-full object-cover rounded-full animate-pulse shadow-xl border-2 border-[#C8A96B]/30"
          />
        </div>
      </div>
    );
  }

  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#171717] font-['Tajawal'] text-right" dir="rtl">
        <AdminApp />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E8] text-[#171717] font-['Tajawal'] antialiased selection:bg-[#C8A96B] selection:text-[#171717]" dir="rtl">
      <AnalyticsTracker />
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Dynamic Page Content */}
      <main className="flex-1 w-full">
        <div key={currentRoute} className="w-full">
          {currentRoute === 'home' && <HomePage />}
          {currentRoute === 'products' && <ProductsPage />}
          {currentRoute === 'product-detail' && <ProductDetailsPage />}
          {currentRoute === 'wishlist' && <WishlistPage />}
          {currentRoute === 'about' && <AboutPage />}
          {currentRoute === 'contact' && <ContactPage />}
        </div>
      </main>

      {/* 3. Luxury Onyx & Gold Footer */}
      <Footer />

      {/* 4. Overlays & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <ToastContainer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
