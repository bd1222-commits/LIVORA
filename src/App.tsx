/**
 * LIVORA | ليفورا
 * Luxury E-Commerce for Accessories, Makeup & Skincare in Yemen
 * WhatsApp Ordering & Sanity CMS (/studeo)
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
import { SanityStudioPage } from './pages/SanityStudioPage';
import { motion, AnimatePresence } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentRoute } = useStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  // If in Sanity Studio, render dedicated studio environment
  if (currentRoute === 'studeo' || currentRoute === 'studio') {
    return (
      <div className="min-h-screen bg-[#171717] font-['Tajawal'] text-right" dir="rtl">
        <SanityStudioPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E8] text-[#171717] font-['Tajawal'] antialiased selection:bg-[#C8A96B] selection:text-[#171717]" dir="rtl">
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
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
