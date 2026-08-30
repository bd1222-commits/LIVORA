export const categorySchema = {
  name: 'category',
  title: 'التصنيف (Category)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'اسم التصنيف',
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
      name: 'image',
      title: 'صورة التصنيف',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: 'وصف التصنيف',
      type: 'text',
      rows: 3,
    },
    {
      name: 'order',
      title: 'ترتيب العرض',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'active',
      title: 'مفعّل ونشط',
      type: 'boolean',
      initialValue: true,
    },
  ],
};
