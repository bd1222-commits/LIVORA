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
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { AdminApp } from './components/admin/AdminApp';
import { AnalyticsTracker } from './components/common/AnalyticsTracker';

const AppContent: React.FC = () => {
  const { currentRoute, loading } = useStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F0E8] text-[#C8A96B]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A96B]"></div>
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

      {/* 2. Main Dynamic Page Content with Animated Transition */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            {currentRoute === 'home' && <HomePage />}
            {currentRoute === 'products' && <ProductsPage />}
            {currentRoute === 'product-detail' && <ProductDetailsPage />}
            {currentRoute === 'wishlist' && <WishlistPage />}
            {currentRoute === 'about' && <AboutPage />}
            {currentRoute === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
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
