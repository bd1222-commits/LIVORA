import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, Phone, ShieldCheck, ChevronDown, SlidersHorizontal, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    totalCartItems,
    totalWishlistItems,
    setIsCartOpen,
    setIsSearchOpen,
    categories,
    siteSettings,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', route: 'home' },
    { label: 'جميع المنتجات', route: 'products' },
    { label: 'الأكثر طلباً', route: 'products', params: { filter: 'bestseller' } },
    { label: 'العروض الحصرية', route: 'products', params: { filter: 'offers' } },
    { label: 'قصة LIVORA', route: 'about' },
    { label: 'تواصل معنا', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#171717] text-[#F6F0E8] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#C8A96B]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C8A96B] animate-pulse" />
            <span className="hidden sm:inline font-medium">
              توصيل لجميع مناطق اليمن • منتجات أصلية مختارة بعناية
            </span>
            <span className="sm:hidden font-medium text-[10px]">
              توصيل لكافة مناطق اليمن
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <a
              href={siteSettings?.whatsappNumber ? `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}` : '#'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#C8A96B] hover:text-[#DEC593] transition-colors"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="dir-ltr text-[10px] sm:text-xs">{siteSettings?.whatsappNumber || ''}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#F6F0E8]/95 backdrop-blur-md shadow-md border-[#C8A96B]/30 py-2 sm:py-3'
            : 'bg-[#F6F0E8] border-[#171717]/10 py-2.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu & Search Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 sm:p-2 rounded-lg text-[#171717] hover:bg-[#171717]/5 transition-colors"
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              id="mobile-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 rounded-lg text-[#171717] hover:bg-[#171717]/5 transition-colors"
              aria-label="البحث"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer group flex flex-col items-center select-none"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-['Cinzel'] text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#171717] group-hover:text-[#C8A96B] transition-colors">
                LIVORA
              </span>
              <span className="text-[#C8A96B] text-base sm:text-xl font-light">|</span>
              <span className="text-base sm:text-xl lg:text-2xl font-bold text-[#171717] tracking-wider">
                ليفورا
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C8A96B] font-medium mt-0.5">
              Haute Féminité & Luxury
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === link.route &&
                (!link.params || Object.keys(link.params).length === 0);
              return (
                <button
                  key={link.label}
                  id={`nav-link-${link.route}`}
                  onClick={() => navigateTo(link.route, link.params)}
                  className={`relative py-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#C8A96B] font-bold'
                      : 'text-[#171717] hover:text-[#C8A96B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A96B] rounded-full"
                    />
                  )}
                </button>
              );
            })}

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                id="categories-dropdown-btn"
                className="flex items-center gap-1 py-1 text-[#171717] hover:text-[#C8A96B] transition-colors cursor-pointer"
              >
                <span>التصنيفات</span>
                <ChevronDown className="w-4 h-4 text-[#C8A96B]" />
              </button>

              <AnimatePresence>
                {categoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full pt-2 w-64 z-50"
                  >
                    <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-xl shadow-xl p-2">
                      <div className="text-xs font-bold text-[#C8A96B] px-3 py-1.5 border-b border-[#171717]/5 mb-1 flex items-center justify-between">
                        <span>أقسام المتجر</span>
                        <Sparkles className="w-3 h-3 text-[#C8A96B]" />
                      </div>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => {
                            navigateTo('products', { category: cat.slug?.current || cat._id });
                            setCategoriesDropdownOpen(false);
                          }}
                          className="w-full text-right px-3 py-2 rounded-lg text-sm text-[#171717] hover:bg-[#C8A96B]/15 hover:text-[#A58645] transition-colors flex items-center justify-between group"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <span className="text-[11px] text-[#171717]/50 group-hover:text-[#A58645]">
                            {cat.itemCount || ''}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Desktop Search Button */}
            <button
              id="desktop-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717]/5 hover:bg-[#171717]/10 text-xs text-[#171717] transition-all cursor-pointer border border-[#171717]/10"
              title="بحث في المتجر"
            >
              <Search className="w-4 h-4 text-[#C8A96B]" />
              <span className="text-stone-500">ابحثي عن منتج...</span>
              <kbd className="bg-[#F6F0E8] px-1.5 py-0.5 rounded text-[10px] text-[#171717]/60 border border-[#171717]/10">
                ⌘K
              </kbd>
            </button>

            {/* Admin Button */}
            <button
              onClick={() => navigateTo('admin')}
              className="relative p-2 sm:p-2.5 rounded-full text-[#171717] hover:bg-[#C8A96B]/10 hover:text-[#C8A96B] transition-colors cursor-pointer"
              aria-label="لوحة التحكم"
              title="لوحة التحكم"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 sm:p-2.5 rounded-full text-[#171717] hover:bg-[#C8A96B]/10 hover:text-[#C8A96B] transition-colors cursor-pointer"
              aria-label="المفضلة"
              title="قائمة المفضلة"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-[#C8A96B] text-[#171717] text-[9px] sm:text-[11px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalWishlistItems}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#171717] text-[#F6F0E8] hover:bg-[#C8A96B] hover:text-[#171717] transition-all duration-300 shadow-md cursor-pointer group"
              aria-label="حقيبة التسوق"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A96B] group-hover:text-[#171717] transition-colors" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-[#C8A96B] text-[#171717] text-[9px] sm:text-[10px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center ring-2 ring-[#171717]">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">السلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[#FAF7F2] z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
                  <div className="flex items-center gap-2">
                    <span className="font-['Cinzel'] text-lg font-bold tracking-widest text-[#171717]">
                      LIVORA
                    </span>
                    <span className="text-[#C8A96B] font-light">|</span>
                    <span className="font-bold text-base">ليفورا</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-[#171717]/5 text-[#171717]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="py-5 flex flex-col gap-1.5">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        navigateTo(link.route, link.params);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-right py-2 px-3 rounded-lg text-sm font-semibold text-[#171717] hover:bg-[#C8A96B]/15 hover:text-[#A58645] transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}

                  <div className="pt-3 mt-2 border-t border-[#171717]/10">
                    <div className="text-xs font-bold text-[#C8A96B] px-3 mb-2">التصنيفات الرئيسية</div>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          navigateTo('products', { category: cat.slug?.current || cat._id });
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-right py-2 px-3 text-xs text-[#171717]/80 hover:text-[#C8A96B] transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-[#171717]/40">{cat.itemCount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Footer Links */}
              <div className="pt-5 border-t border-[#171717]/10 flex flex-col gap-2.5">
                <a
                  href={siteSettings?.whatsappNumber ? `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}` : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl border border-[#C8A96B] text-[#171717] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#C8A96B]/10 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>طلب مباشر عبر الواتساب</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
