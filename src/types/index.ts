export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  sku?: string;
  inStock?: boolean;
}

export interface Product {
  _id: string;
  _type?: string;
  name: string;
  slug: {
    current: string;
  };
  mainImage: string;
  additionalImages?: string[];
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  shortDescription: string;
  description: string;
  category?: {
    _ref?: string;
    _type?: 'reference' | string;
    name?: string;
    slug?: string;
  };
  inStock?: boolean;
  variants?: ProductVariant[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  sku: string;
  displayStockCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isGlobalBrand?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  details?: {
    material?: string;
    origin?: string;
    careInstructions?: string;
    warranty?: string;
  };
}

export interface Category {
  _id: string;
  _type?: string;
  name: string;
  slug: {
    current: string;
  };
  image: string;
  description: string;
  order: number;
  active: boolean;
  itemCount?: number;
}

export interface HeroSlide {
  _id: string;
  _type?: string;
  image: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
  badge?: string;
}

export interface Banner {
  _id: string;
  _type?: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  discountText: string;
  active: boolean;
}

export interface Testimonial {
  _id: string;
  _type?: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
  city?: string;
  active: boolean;
  order: number;
  date?: string;
}

export interface StudioUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor';
  createdAt?: string;
}

export interface SiteSettings {
  _type?: string;
  storeName: string;
  storeNameEn: string;
  tagline: string;
  logo: string;
  whatsappNumber: string;
  instagram: string;
  tiktok: string;
  snapchat?: string;
  storeDescription: string;
  contactInformation: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
  footerText: string;
  favicon?: string;
  defaultSEO: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  currency: {
    symbol: string;
    code: string;
    exchangeRateToUSD?: number;
  };
  users?: StudioUser[];
  adminCredentials?: {
    email: string;
    password: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariant?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'discount';
