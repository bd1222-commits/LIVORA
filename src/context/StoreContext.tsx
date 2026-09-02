import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { CartItem, Category, HeroSlide, Product, SiteSettings, Testimonial } from '../types';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'gold';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  siteSettings: SiteSettings | null;
  loading: boolean;

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

  // Data Fetching
  refreshAllData: () => void;

  // Feedback Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'gold') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'livora_cart_items_v2';
const WISHLIST_STORAGE_KEY = 'livora_wishlist_ids_v2';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Supabase Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>({
    storeName: 'LIVORA',
    storeNameEn: 'LIVORA',
    tagline: '',
    logo: '/logo.svg',
    whatsappNumber: '0000',
    instagram: '',
    tiktok: '',
    storeDescription: '',
    contactInformation: { address: '', phone: '', email: '', workingHours: '' },
    footerText: '',
    defaultSEO: { metaTitle: '', metaDescription: '' },
    currency: { symbol: 'ر.ي', code: 'YER' },
  });
  const [loading, setLoading] = useState(true);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: catsData },
        { data: prodsData },
        { data: heroData },
        { data: testData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        supabase.from('products').select('*'),
        supabase.from('hero_slides').select('*').order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').order('display_order', { ascending: true }),
        supabase.from('site_settings').select('*').limit(1)
      ]);

      const mappedCategories = (catsData || []).map((c: any) => ({
        _id: String(c.id),
        name: c.name,
        slug: { current: c.slug },
        image: c.image,
        description: c.description,
        order: c.display_order,
        active: c.active,
      }));

      const mappedProducts = (prodsData || []).map((p: any) => ({
        _id: String(p.id),
        name: p.name,
        slug: { current: p.slug },
        mainImage: p.main_image,
        additionalImages: p.additional_images,
        price: p.price,
        oldPrice: p.old_price,
        discountPercentage: p.discount_percentage,
        shortDescription: p.short_description,
        description: p.description,
        category: { _ref: p.category_id ? String(p.category_id) : undefined },
        colors: p.colors,
        sizes: p.sizes,
        sku: p.sku,
        displayStockCount: p.display_stock_count,
        isFeatured: p.is_featured,
        isBestSeller: p.is_best_seller,
        isNew: p.is_new,
        isOnSale: p.is_on_sale,
        rating: p.rating,
        reviewsCount: p.reviews_count,
        createdAt: p.created_at,
        details: p.details,
      }));

      const mappedHeroSlides = (heroData || []).map((h: any) => ({
        _id: h.id,
        image: h.image,
        title: h.title,
        subtitle: h.subtitle,
        description: h.description,
        ctaText: h.cta_text,
        ctaLink: h.cta_link,
        badge: h.badge,
        active: h.active,
        order: h.display_order,
      }));

      const mappedTestimonials = (testData || []).map((t: any) => ({
        _id: t.id,
        name: t.name,
        city: t.city,
        text: t.text,
        rating: t.rating,
        image: t.image,
        active: t.active,
        order: t.display_order,
        date: t.date,
      }));

      let mappedSettings = null;
      if (settingsData && settingsData.length > 0) {
        const s = settingsData[0];
        mappedSettings = {
          storeName: s.store_name,
          storeNameEn: s.store_name_en,
          tagline: s.tagline,
          logo: s.logo,
          whatsappNumber: s.whatsapp || s.phone,
          instagram: s.instagram,
          tiktok: s.tiktok,
          snapchat: s.snapchat,
          storeDescription: s.description,
          contactInformation: s.phone,
          footerText: s.footer_text,
          defaultSEO: s.default_seo,
          currency: s.currency,
        };
      }

      setCategories(mappedCategories);
      setProducts(mappedProducts);
      setHeroSlides(mappedHeroSlides.filter(h => h.active));
      setTestimonials(mappedTestimonials.filter(t => t.active));
      if (mappedSettings) setSiteSettings(mappedSettings);
    } catch (e) {
      console.error('Error fetching data from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

      if (path.startsWith('/admin')) {
        setCurrentRoute('admin');
        const adminPath = path.replace('/admin', '');
        setRouteParams({ adminPath: adminPath || '/', ...params });
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
    if (route === 'admin') {
      url = `/admin${params.adminPath || ''}`;
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

  const refreshAllData = () => {
    fetchData();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        heroSlides,
        testimonials,
        siteSettings: siteSettings as SiteSettings,
        loading,
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
        refreshAllData,
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
