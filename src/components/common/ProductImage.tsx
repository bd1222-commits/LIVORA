import React, { memo } from 'react';
import { ImageTransform } from '../../types';

interface ProductImageProps {
  src: string;
  alt: string;
  transform?: ImageTransform;
  className?: string;
  containerClassName?: string;
  showWatermark?: boolean;
  watermarkPosition?: 'card' | 'details';
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = memo(({
  src,
  alt,
  transform,
  className = '',
  containerClassName = '',
  showWatermark = false,
  watermarkPosition = 'card',
  aspectRatio = '1080 / 1442',
  loading = 'lazy',
  onClick,
}) => {
  const zoom = transform?.zoom ?? 1;
  const x = transform?.positionX ?? 0;
  const y = transform?.positionY ?? 0;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden w-full ${containerClassName}`}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        className={`w-full h-full object-contain pointer-events-none transition-transform duration-75 ${className}`}
        style={{
          transform: `scale(${zoom}) translate(${x}%, ${y}%)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />

      {showWatermark && (
        <div
          className={
            watermarkPosition === 'details'
              ? 'absolute bottom-3 left-3 pointer-events-none z-10'
              : 'absolute bottom-2 left-2 pointer-events-none z-10'
          }
        >
          <img
            src="/livora-watermark.png"
            alt="LIVORA"
            loading="lazy"
            decoding="async"
            className={
              watermarkPosition === 'details'
                ? 'h-6 sm:h-8 w-auto opacity-75 object-contain'
                : 'h-4 sm:h-5 w-auto opacity-75 object-contain'
            }
          />
        </div>
      )}
    </div>
  );
});

ProductImage.displayName = 'ProductImage';
