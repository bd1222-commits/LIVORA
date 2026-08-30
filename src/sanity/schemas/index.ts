import { productSchema } from './product';
import { categorySchema } from './category';

export { productSchema, categorySchema };

export const heroSchema = {
  name: 'heroSlide',
  title: 'واجهة البنر الرئيسي (Hero Slider)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'العنوان الرئيسي',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'العنوان الفرعي / الشعار',
      type: 'string',
    },
    {
      name: 'description',
      title: 'النص الوصفي',
      type: 'text',
      rows: 2,
    },
    {
      name: 'image',
      title: 'صورة البنر عالية الدقة',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ctaText',
      title: 'نص زر التفاعل (CTA)',
      type: 'string',
      initialValue: 'تسوقي الآن',
    },
    {
      name: 'ctaLink',
      title: 'رابط الزر',
      type: 'string',
      initialValue: '/products',
    },
    {
      name: 'badge',
      title: 'شارة خاصة (Badge)',
      type: 'string',
    },
    {
      name: 'active',
      title: 'مفعل في الواجهة',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'الترتيب',
      type: 'number',
      initialValue: 0,
    },
  ],
};

export const bannerSchema = {
  name: 'banner',
  title: 'العروض والبامرات الترويجية (Banners)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'عنوان العرض',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'الوصف الترويجي',
      type: 'string',
    },
    {
      name: 'image',
      title: 'صورة العرض',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'link',
      title: 'رابط العرض',
      type: 'string',
    },
    {
      name: 'discountText',
      title: 'نص الخصم (مثال: خصم حتى 40%)',
      type: 'string',
    },
    {
      name: 'active',
      title: 'مفعل',
      type: 'boolean',
      initialValue: true,
    },
  ],
};

export const testimonialSchema = {
  name: 'testimonial',
  title: 'آراء وتقييمات العميلات (Testimonials)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'اسم العميلة',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'text',
      title: 'نص التقييم والتجربة',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'التقييم (من 5 نجوم)',
      type: 'number',
      initialValue: 5,
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'city',
      title: 'المدينة (صنعاء، عدن، تعز...)',
      type: 'string',
    },
    {
      name: 'active',
      title: 'مفعل',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'ترتيب الظهور',
      type: 'number',
      initialValue: 0,
    },
  ],
};

export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'إعدادات المتجر والهوية (Site Settings)',
  type: 'document',
  fields: [
    {
      name: 'storeName',
      title: 'اسم المتجر بالعربي',
      type: 'string',
      initialValue: 'ليفورا | LIVORA',
    },
    {
      name: 'whatsappNumber',
      title: 'رقم الواتساب الرسمي للطلبات',
      type: 'string',
      initialValue: '967737462144',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'instagram',
      title: 'حساب الإنستغرام',
      type: 'string',
      initialValue: 'https://instagram.com/livora.ye',
    },
    {
      name: 'tiktok',
      title: 'حساب التيك توك',
      type: 'string',
      initialValue: 'https://tiktok.com/@livora.ye',
    },
    {
      name: 'storeDescription',
      title: 'الوصف العام للمتجر',
      type: 'text',
      rows: 3,
    },
    {
      name: 'footerText',
      title: 'نص التذييل وحقوق النشر',
      type: 'string',
    },
  ],
};

export const schemas = [
  productSchema,
  categorySchema,
  heroSchema,
  bannerSchema,
  testimonialSchema,
  siteSettingsSchema,
];
