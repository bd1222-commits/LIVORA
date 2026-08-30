import React, { createContext, useContext, useEffect, useState } from 'react';
import { sanityStore } from '../sanity/client';
import { CartItem, Category, HeroSlide, Product, SiteSettings, Testimonial } from '../types';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'gold';
}

interface StoreContextType {
  // Store Data from Sanity
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  siteSettings: SiteSettings;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: { color?: string; size?: string; variant?: string }) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  totalCartItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  totalWishlistItems: number;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Routing / Navigation
  currentRoute: string;
  routeParams: Record<string, string>;
  navigateTo: (route: string, params?: Record<string, string>) => void;

  // Sanity Store Mutators (Real-time CRUD)
  createProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  createHeroSlide: (hero: HeroSlide) => void;
  updateHeroSlide: (id: string, hero: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  createTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  refreshAllData: () => void;
  resetToDefaultData: () => void;

  // Feedback Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'gold') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'livora_cart_items_v1';
const WISHLIST_STORAGE_KEY = 'livora_wishlist_ids_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sanity Data States
  const [products, setProducts] = useState<Product[]>(() => sanityStore.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => sanityStore.getCategories());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => sanityStore.getHeroSlides());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => sanityStore.getTestimonials());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => sanityStore.getSiteSettings());

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search Modal
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Routing
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Listen for Sanity Store Updates (reactive when edited in /studeo)
  useEffect(() => {
    const unsubscribe = sanityStore.subscribe(() => {
      setProducts([...sanityStore.getProducts()]);
      setCategories([...sanityStore.getCategories()]);
      setHeroSlides([...sanityStore.getHeroSlides()]);
      setTestimonials([...sanityStore.getTestimonials()]);
      setSiteSettings({ ...sanityStore.getSiteSettings() });
    });
    return () => unsubscribe();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Handle URL changes & Browser Back/Forward buttons
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      searchParams.forEach((val, key) => {
        params[key] = val;
      });

      if (path === '/studio' || path === '/studio/' || path === '/studeo' || path === '/studeo/') {
        setCurrentRoute('studio');
        setRouteParams(params);
      } else if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '').replace(/\/$/, '');
        setCurrentRoute('product-detail');
        setRouteParams({ slug, ...params });
      } else if (path === '/products' || path === '/products/') {
        setCurrentRoute('products');
        setRouteParams(params);
      } else if (path === '/about' || path === '/about/') {
        setCurrentRoute('about');
        setRouteParams(params);
      } else if (path === '/contact' || path === '/contact/') {
        setCurrentRoute('contact');
        setRouteParams(params);
      } else if (path === '/wishlist' || path === '/wishlist/') {
        setCurrentRoute('wishlist');
        setRouteParams(params);
      } else {
        setCurrentRoute('home');
        setRouteParams(params);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = (route: string, params: Record<string, string> = {}) => {
    let url = '/';
    if (route === 'studeo' || route === 'studio') {
      url = '/studio';
    } else if (route === 'products') {
      const q = new URLSearchParams(params).toString();
      url = q ? `/products?${q}` : '/products';
    } else if (route === 'product-detail' && params.slug) {
      url = `/product/${params.slug}`;
    } else if (route === 'about') {
      url = '/about';
    } else if (route === 'contact') {
      url = '/contact';
    } else if (route === 'wishlist') {
      url = '/wishlist';
    }

    window.history.pushState({}, '', url);
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Function
  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C8A96B', '#F6F0E8', '#171717', '#DEC593'],
      });
    } catch {
      // safe fallback
    }
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity: number = 1,
    variant?: { color?: string; size?: string; variant?: string }
  ) => {
    const color = variant?.color || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const size = variant?.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const variantName = variant?.variant;

    const cartItemId = `${product._id}-${color || 'default'}-${size || 'default'}-${variantName || 'default'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            quantity,
            selectedColor: color,
            selectedSize: size,
            selectedVariant: variantName,
          },
        ];
      }
    });

    showToast('تمت الإضافة إلى السلة بنجاح', `${product.name} (×${quantity})`, 'gold');
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast('تم حذف المنتج من السلة', undefined, 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = (product: Product) => {
    setWishlistIds((prevIds) => {
      const exists = prevIds.includes(product._id);
      if (exists) {
        showToast('تمت الإزالة من المفضلة', product.name, 'info');
        return prevIds.filter((id) => id !== product._id);
      } else {
        showToast('تم الحفظ في قائمتكِ المفضلة', product.name, 'gold');
        return [...prevIds, product._id];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p._id));
  const totalWishlistItems = wishlistIds.length;

  // Quick View Functions
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Sanity Store Mutators (Real-time sync to LocalStorage & Subscribers)
  const createProduct = (product: Product) => {
    sanityStore.saveProduct(product);
  };
  const updateProduct = (id: string, updated: Partial<Product>) => {
    const existing = products.find((p) => p._id === id);
    if (existing) {
      sanityStore.saveProduct({ ...existing, ...updated } as Product);
    }
  };
  const deleteProduct = (id: string) => {
    sanityStore.deleteProduct(id);
  };

  const createCategory = (category: Category) => {
    sanityStore.saveCategory(category);
  };
  const updateCategory = (id: string, updated: Partial<Category>) => {
    const existing = categories.find((c) => c._id === id);
    if (existing) {
      sanityStore.saveCategory({ ...existing, ...updated } as Category);
    }
  };
  const deleteCategory = (id: string) => {
    sanityStore.deleteCategory(id);
  };

  const createHeroSlide = (hero: HeroSlide) => {
    sanityStore.saveHeroSlide(hero);
  };
  const updateHeroSlide = (id: string, updated: Partial<HeroSlide>) => {
    const existing = heroSlides.find((h) => h._id === id);
    if (existing) {
      sanityStore.saveHeroSlide({ ...existing, ...updated } as HeroSlide);
    }
  };
  const deleteHeroSlide = (id: string) => {
    sanityStore.deleteHeroSlide(id);
  };

  const createTestimonial = (testimonial: Testimonial) => {
    sanityStore.saveTestimonial(testimonial);
  };
  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    const existing = testimonials.find((t) => t._id === id);
    if (existing) {
      sanityStore.saveTestimonial({ ...existing, ...updated } as Testimonial);
    }
  };
  const deleteTestimonial = (id: string) => {
    sanityStore.deleteTestimonial(id);
  };

  const updateSiteSettings = (updated: Partial<SiteSettings>) => {
    sanityStore.saveSiteSettings({ ...siteSettings, ...updated });
  };

  const refreshAllData = () => {
    setProducts([...sanityStore.getProducts()]);
    setCategories([...sanityStore.getCategories()]);
    setHeroSlides([...sanityStore.getAllHeroSlides()]);
    setTestimonials([...sanityStore.getAllTestimonials()]);
    setSiteSettings({ ...sanityStore.getSiteSettings() });
  };

  const resetToDefaultData = () => {
    sanityStore.resetToDefaults();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        heroSlides,
        testimonials,
        siteSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        totalCartItems,
        isCartOpen,
        setIsCartOpen,
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        totalWishlistItems,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        currentRoute,
        routeParams,
        navigateTo,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        createHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateSiteSettings,
        refreshAllData,
        resetToDefaultData,
        toasts,
        showToast,
        removeToast,
        triggerConfetti,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
