import { CartItem, Product } from '../types';

export const DEFAULT_WHATSAPP_NUMBER = '967737462144';

/**
 * Format currency in Yemeni Rial
 */
export function formatPrice(price: number, currency: string = 'ر.ي'): string {
  return `${price.toLocaleString('ar-YE')} ${currency}`;
}

/**
 * Format single product order message for WhatsApp
 */
export function createProductWhatsAppMessage(
  product: Product,
  selectedVariant?: string,
  selectedColor?: string,
  selectedSize?: string,
  currentUrl?: string
): string {
  const chosenOption = [
    selectedVariant ? `النوع: ${selectedVariant}` : '',
    selectedColor ? `اللون: ${selectedColor}` : '',
    selectedSize ? `المقاس: ${selectedSize}` : '',
  ]
    .filter(Boolean)
    .join(' - ') || 'الافتراضي';

  const productUrl = currentUrl || `${window.location.origin}/product/${product.slug?.current || product._id}`;

  const message = `السلام عليكم، أرغب في طلب:

اسم المنتج: ${product.name}
السعر: ${formatPrice(product.price)}
الخيار: ${chosenOption}
الرابط: ${productUrl}`;

  return message;
}

/**
 * Format Cart items order message for WhatsApp
 */
export function createCartWhatsAppMessage(items: CartItem[], totalAmount: number): string {
  const itemsList = items
    .map((item, index) => {
      const options = [
        item.selectedColor ? `لون ${item.selectedColor}` : '',
        item.selectedSize ? `مقاس ${item.selectedSize}` : '',
        item.selectedVariant ? item.selectedVariant : '',
      ]
        .filter(Boolean)
        .join(' - ');

      const optionText = options ? ` (${options})` : '';
      return `${index + 1}. ${item.product.name}${optionText} × ${item.quantity} [${formatPrice(item.product.price * item.quantity)}]`;
    })
    .join('\n');

  const message = `السلام عليكم، أرغب في طلب المنتجات التالية:

${itemsList}

الإجمالي: ${formatPrice(totalAmount)}`;

  return message;
}

/**
 * Open WhatsApp with a custom message
 */
export function openWhatsApp(phone: string = DEFAULT_WHATSAPP_NUMBER, message: string): void {
  // Normalize phone number (strip + and spaces)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
