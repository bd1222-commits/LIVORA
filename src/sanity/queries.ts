// GROQ Queries for Sanity CMS Integration

export const allProductsQuery = `*[_type == "product"] | order(createdAt desc) {
  _id,
  name,
  slug,
  mainImage,
  additionalImages,
  price,
  oldPrice,
  discountPercentage,
  shortDescription,
  description,
  category->{
    _id,
    name,
    slug
  },
  colors,
  sizes,
  sku,
  displayStockCount,
  isFeatured,
  isBestSeller,
  isNew,
  isOnSale,
  createdAt
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  mainImage,
  additionalImages,
  price,
  oldPrice,
  discountPercentage,
  shortDescription,
  description,
  category->{
    _id,
    name,
    slug
  },
  colors,
  sizes,
  sku,
  displayStockCount,
  isFeatured,
  isBestSeller,
  isNew,
  isOnSale,
  createdAt
}`;

export const featuredProductsQuery = `*[_type == "product" && isFeatured == true] | order(createdAt desc) [0...12] {
  _id,
  name,
  slug,
  mainImage,
  additionalImages,
  price,
  oldPrice,
  discountPercentage,
  shortDescription,
  category->{
    _id,
    name,
    slug
  },
  sku,
  displayStockCount,
  isFeatured,
  isBestSeller,
  isNew,
  isOnSale
}`;

export const bestSellersQuery = `*[_type == "product" && isBestSeller == true] | order(createdAt desc) [0...12] {
  _id,
  name,
  slug,
  mainImage,
  additionalImages,
  price,
  oldPrice,
  discountPercentage,
  shortDescription,
  category->{
    _id,
    name,
    slug
  },
  sku,
  displayStockCount,
  isFeatured,
  isBestSeller,
  isNew,
  isOnSale
}`;

export const newArrivalsQuery = `*[_type == "product" && isNew == true] | order(createdAt desc) [0...12] {
  _id,
  name,
  slug,
  mainImage,
  additionalImages,
  price,
  oldPrice,
  discountPercentage,
  shortDescription,
  category->{
    _id,
    name,
    slug
  },
  sku,
  displayStockCount,
  isFeatured,
  isBestSeller,
  isNew,
  isOnSale
}`;

export const offersQuery = `*[_type == "product" && isOnSale == true] | order(discountPercentage desc) [0...12] {
  _id,
  name,
  slug,
  mainImage,
  additionalImages,
  price,
  oldPrice,
  discountPercentage,
  shortDescription,
  category->{
    _id,
    name,
    slug
  },
  sku,
  displayStockCount,
  isFeatured,
  isBestSeller,
  isNew,
  isOnSale
}`;

export const categoriesQuery = `*[_type == "category" && active == true] | order(order asc) {
  _id,
  name,
  slug,
  image,
  description,
  order,
  active,
  "itemCount": count(*[_type == "product" && references(^._id)])
}`;

export const heroSlidesQuery = `*[_type == "heroSlide" && active == true] | order(order asc) {
  _id,
  title,
  subtitle,
  description,
  image,
  ctaText,
  ctaLink,
  badge,
  active,
  order
}`;

export const testimonialsQuery = `*[_type == "testimonial" && active == true] | order(order asc) {
  _id,
  name,
  text,
  rating,
  image,
  city,
  active,
  order
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  storeName,
  storeNameEn,
  tagline,
  logo,
  whatsappNumber,
  instagram,
  tiktok,
  storeDescription,
  contactInformation,
  footerText,
  defaultSEO
}`;
