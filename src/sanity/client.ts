import { createClient, type ClientConfig } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import {
  defaultCategories,
  defaultHeroSlides,
  defaultProducts,
  defaultSiteSettings,
  defaultTestimonials,
} from './defaultData';
import { Category, HeroSlide, Product, SiteSettings, Testimonial } from '../types';

// Helper to safely format project ID (Sanity requires only a-z, 0-9 and dashes)
function sanitizeProjectId(rawId: any): string {
  if (typeof rawId === 'string') {
    const cleaned = rawId
      .trim()
      .toLowerCase()
      .replace(/_/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    if (cleaned.length > 0 && cleaned !== 'your-project-id') {
      return cleaned;
    }
  }
  return 'a8ha3p9y';
}

// Helper to safely format API version (Sanity requires '1' or 'YYYY-MM-DD')
function sanitizeApiVersion(rawVersion: any): string {
  if (typeof rawVersion === 'string') {
    const trimmed = rawVersion.trim();
    if (trimmed === '1' || /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }
  return '2024-03-01';
}

// Helper to safely format dataset name (Sanity requires only a-z, 0-9, dash, underscore)
function sanitizeDataset(rawDataset: any): string {
  if (typeof rawDataset === 'string') {
    const cleaned = rawDataset
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '');
    if (cleaned.length > 0) {
      return cleaned;
    }
  }
  return 'production';
}

// Environment variables
const env = (import.meta as any).env || {};
const rawProjectId = env.VITE_SANITY_PROJECT_ID || 'a8ha3p9y';
const rawDataset = env.VITE_SANITY_DATASET || 'production';
const rawApiVersion = env.VITE_SANITY_API_VERSION || '2024-03-01';
const token = env.VITE_SANITY_TOKEN;

const projectId = sanitizeProjectId(rawProjectId);
const dataset = sanitizeDataset(rawDataset);
const apiVersion = sanitizeApiVersion(rawApiVersion);

const clientConfig: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
};

let clientInstance: any = null;
try {
  clientInstance = createClient(clientConfig);
} catch (err) {
  console.warn('Fallback initializing safe Sanity client:', err);
  try {
    clientInstance = createClient({
      projectId: 'a8ha3p9y',
      dataset: 'production',
      apiVersion: '2024-03-01',
      useCdn: true,
    });
  } catch (fallbackErr) {
    console.error('Failed to create Sanity client fallback:', fallbackErr);
  }
}

export const sanityClient = clientInstance;

let builder: any = null;
if (sanityClient) {
  try {
    builder = imageUrlBuilder(sanityClient);
  } catch (e) {
    console.warn('Could not initialize imageUrlBuilder:', e);
  }
}

export function urlFor(source: any) {
  if (typeof source === 'string') return { url: () => source };
  if (!source) return { url: () => '' };
  try {
    if (builder) {
      return builder.image(source);
    }
    return { url: () => (source?.asset?.url || source?.url || '') };
  } catch (e) {
    return { url: () => (source?.asset?.url || source?.url || '') };
  }
}

// Local Storage Keys for offline / demo and studio real-time sync
const STORAGE_KEYS = {
  PRODUCTS: 'livora_sanity_products_v1',
  CATEGORIES: 'livora_sanity_categories_v1',
  HERO_SLIDES: 'livora_sanity_hero_v1',
  TESTIMONIALS: 'livora_sanity_testimonials_v1',
  SITE_SETTINGS: 'livora_sanity_settings_v1',
  CUSTOM_SANITY_CONFIG: 'livora_sanity_custom_config_v1',
};

// Data Store with Subscribers for instant live reactivity across components and /studeo
class SanityDataStore {
  private products: Product[] = [];
  private categories: Category[] = [];
  private heroSlides: HeroSlide[] = [];
  private testimonials: Testimonial[] = [];
  private siteSettings: SiteSettings = defaultSiteSettings;
  private listeners: Set<() => void> = new Set();
  private isConfiguredWithRealSanity: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      this.products = savedProducts ? JSON.parse(savedProducts) : defaultProducts;

      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = savedCategories ? JSON.parse(savedCategories) : defaultCategories;

      const savedHero = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      this.heroSlides = savedHero ? JSON.parse(savedHero) : defaultHeroSlides;

      const savedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      this.testimonials = savedTestimonials ? JSON.parse(savedTestimonials) : defaultTestimonials;

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
      this.siteSettings = savedSettings ? JSON.parse(savedSettings) : defaultSiteSettings;

      // Check if real sanity project id was set in env or custom config
      if (projectId && projectId !== 'livora-store' && projectId !== 'demo-livora-project') {
        this.isConfiguredWithRealSanity = true;
      }
    } catch (e) {
      console.warn('Failed to load saved Sanity local cache, using defaults:', e);
      this.products = defaultProducts;
      this.categories = defaultCategories;
      this.heroSlides = defaultHeroSlides;
      this.testimonials = defaultTestimonials;
      this.siteSettings = defaultSiteSettings;
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Products CRUD ---
  public getProducts(): Product[] {
    return this.products;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug?.current === slug || p._id === slug);
  }

  public saveProduct(product: Product) {
    const index = this.products.findIndex((p) => p._id === product._id);
    if (index >= 0) {
      this.products[index] = { ...product };
    } else {
      this.products.unshift(product);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    this.notify();
  }

  public deleteProduct(id: string) {
    this.products = this.products.filter((p) => p._id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    this.notify();
  }

  // --- Categories CRUD ---
  public getCategories(): Category[] {
    return this.categories;
  }

  public saveCategory(category: Category) {
    const index = this.categories.findIndex((c) => c._id === category._id);
    if (index >= 0) {
      this.categories[index] = { ...category };
    } else {
      this.categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
    this.notify();
  }

  public deleteCategory(id: string) {
    this.categories = this.categories.filter((c) => c._id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
    this.notify();
  }

  // --- Hero Slides CRUD ---
  public getHeroSlides(): HeroSlide[] {
    return this.heroSlides.filter((h) => h.active);
  }

  public getAllHeroSlides(): HeroSlide[] {
    return this.heroSlides;
  }

  public saveHeroSlide(slide: HeroSlide) {
    const index = this.heroSlides.findIndex((h) => h._id === slide._id);
    if (index >= 0) {
      this.heroSlides[index] = { ...slide };
    } else {
      this.heroSlides.push(slide);
    }
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(this.heroSlides));
    this.notify();
  }

  public deleteHeroSlide(id: string) {
    this.heroSlides = this.heroSlides.filter((h) => h._id !== id);
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(this.heroSlides));
    this.notify();
  }

  // --- Testimonials CRUD ---
  public getTestimonials(): Testimonial[] {
    return this.testimonials.filter((t) => t.active);
  }

  public getAllTestimonials(): Testimonial[] {
    return this.testimonials;
  }

  public saveTestimonial(testimonial: Testimonial) {
    const index = this.testimonials.findIndex((t) => t._id === testimonial._id);
    if (index >= 0) {
      this.testimonials[index] = { ...testimonial };
    } else {
      this.testimonials.push(testimonial);
    }
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(this.testimonials));
    this.notify();
  }

  public deleteTestimonial(id: string) {
    this.testimonials = this.testimonials.filter((t) => t._id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(this.testimonials));
    this.notify();
  }

  // --- Site Settings ---
  public getSiteSettings(): SiteSettings {
    return this.siteSettings;
  }

  public saveSiteSettings(settings: SiteSettings) {
    this.siteSettings = { ...settings };
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(this.siteSettings));
    this.notify();
  }

  // Reset to factory defaults
  public resetToDefaults() {
    this.products = defaultProducts;
    this.categories = defaultCategories;
    this.heroSlides = defaultHeroSlides;
    this.testimonials = defaultTestimonials;
    this.siteSettings = defaultSiteSettings;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(defaultHeroSlides));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(defaultTestimonials));
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(defaultSiteSettings));
    this.notify();
  }

  public getIsConfiguredWithRealSanity(): boolean {
    return this.isConfiguredWithRealSanity;
  }
}

export const sanityStore = new SanityDataStore();
