export const productSchema = {
  name: 'product',
  title: 'المنتج (Product)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'اسم المنتج',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'المعرف الفريد (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'الصورة الرئيسية',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'additionalImages',
      title: 'صور إضافية للمنتج',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'price',
      title: 'السعر الحالي (ر.ي)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'oldPrice',
      title: 'السعر السابق قبل الخصم (ر.ي)',
      type: 'number',
    },
    {
      name: 'discountPercentage',
      title: 'نسبة الخصم %',
      type: 'number',
    },
    {
      name: 'shortDescription',
      title: 'وصف قصير',
      type: 'text',
      rows: 2,
    },
    {
      name: 'description',
      title: 'الوصف الكامل والتفاصيل',
      type: 'text',
      rows: 5,
    },
    {
      name: 'category',
      title: 'التصنيف',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'colors',
      title: 'الألوان المتاحة',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'اسم اللون', type: 'string' },
            { name: 'hex', title: 'كود اللون (Hex)', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'sizes',
      title: 'المقاسات المتاحة',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'sku',
      title: 'رمز المنتج (SKU)',
      type: 'string',
    },
    {
      name: 'displayStockCount',
      title: 'العدد المتبقي في المخزون',
      type: 'number',
      initialValue: 5,
    },
    {
      name: 'isFeatured',
      title: 'منتج مميز (Featured)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isBestSeller',
      title: 'الأكثر طلباً (Crowd Favorite / Best Seller)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isNew',
      title: 'وصل حديثاً (New Arrival)',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'isOnSale',
      title: 'عليه عرض وتخفيض (On Sale)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'createdAt',
      title: 'تاريخ الإضافة',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
};
