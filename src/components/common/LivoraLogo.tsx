import React from 'react';

interface LivoraLogoProps {
  variant?: 'full' | 'monogram' | 'horizontal' | 'badge';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: 'light' | 'dark' | 'gold';
}

export const LivoraLogo: React.FC<LivoraLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  theme = 'light',
}) => {
  // Size presets
  const sizeMap = {
    sm: { box: 'w-16 h-16', mono: 'w-10 h-10', text: 'text-xs', arText: 'text-[9px]' },
    md: { box: 'w-28 h-28', mono: 'w-16 h-16', text: 'text-sm', arText: 'text-xs' },
    lg: { box: 'w-48 h-48', mono: 'w-24 h-24', text: 'text-lg', arText: 'text-sm' },
    xl: { box: 'w-64 h-64', mono: 'w-32 h-32', text: 'text-2xl', arText: 'text-base' },
    '2xl': { box: 'w-80 h-80', mono: 'w-44 h-44', text: 'text-3xl', arText: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  // SVG Monogram (Interlocking Black L and Brushed Gold V with flourishes)
  const MonogramSVG = ({ width = 120, height = 120 }: { width?: number; height?: number }) => (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className="overflow-visible drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Luxury Gold Linear Gradient */}
        <linearGradient id="livoraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBA73" />
          <stop offset="35%" stopColor="#C8A96B" />
          <stop offset="70%" stopColor="#EAD8AA" />
          <stop offset="100%" stopColor="#A48243" />
        </linearGradient>

        {/* Gold Texture Shimmer */}
        <linearGradient id="livoraGoldAccent" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#B38F48" />
          <stop offset="50%" stopColor="#F3E5C2" />
          <stop offset="100%" stopColor="#9C7736" />
        </linearGradient>

        {/* Soft Drop Shadow for 3D luxury look */}
        <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#171717" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Monogram Graphic Group */}
      <g filter="url(#logoShadow)">
        {/* The Black 'L' - Classic Bodoni/Didot Serif Stem */}
        <path
          d="M 68 35 
             L 94 35 
             L 94 40 
             L 86 40 
             L 86 142 
             L 125 142 
             C 135 142 140 137 142 128
             L 146 128
             L 144 148
             L 68 148
             L 68 142
             L 76 142
             L 76 40
             L 68 40
             Z"
          fill="#171717"
        />

        {/* The Gold Flourished Ribbon Swoop of V passing across the L */}
        <path
          d="M 62 120
             C 75 110, 95 115, 110 135
             C 118 145, 126 153, 138 153
             C 146 153, 150 148, 152 140
             C 152 140, 149 146, 142 147
             C 133 147, 124 140, 115 128
             C 98 106, 80 102, 62 120
             Z"
          fill="url(#livoraGoldAccent)"
        />

        {/* The Elegant Gold 'V' Main Left-to-Right Diagonal */}
        <path
          d="M 90 64
             C 98 64, 108 72, 118 90
             L 124 102
             L 122 147
             L 115 136
             L 90 70
             Z"
          fill="url(#livoraGoldGrad)"
          opacity="0.95"
        />

        {/* The Right Ascender of the Gold 'V' with Serif */}
        <path
          d="M 122 146
             L 155 60
             L 148 60
             L 148 57
             L 165 57
             L 165 60
             L 158 60
             L 126 146
             Z"
          fill="url(#livoraGoldGrad)"
        />

        {/* Top Left Wing of V with organic luxury serif flourish */}
        <path
          d="M 90 60
             C 105 60, 118 75, 124 95
             L 120 146
             C 115 130, 102 70, 88 64
             L 88 60
             Z"
          fill="url(#livoraGoldGrad)"
        />

        {/* Delicate right serif hook */}
        <path
          d="M 160 58
             C 164 58, 168 62, 168 68
             C 168 64, 163 60, 158 60
             Z"
          fill="url(#livoraGoldAccent)"
        />
      </g>
    </svg>
  );

  // Horizontal variant (for navbar/header)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="w-10 h-10 shrink-0">
          <MonogramSVG width={40} height={40} />
        </div>
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className="font-['Cinzel'] font-bold text-lg sm:text-xl tracking-[0.25em] text-[#171717]">
              LIVORA
            </span>
            <span className="text-[#C8A96B] font-light text-base">|</span>
            <span className="font-bold text-base sm:text-lg text-[#171717] tracking-wide font-sans">
              ليفورا
            </span>
          </div>
          <span className="text-[8px] tracking-[0.3em] uppercase text-[#C8A96B] font-medium -mt-0.5">
            Haute Féminité & Luxury
          </span>
        </div>
      </div>
    );
  }

  // Monogram only
  if (variant === 'monogram') {
    return (
      <div className={`flex items-center justify-center ${currentSize.mono} ${className}`}>
        <MonogramSVG />
      </div>
    );
  }

  // Full luxury emblem with logo text and arabic calligraphy (Matches uploaded image exactly)
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center select-none ${
        theme === 'light'
          ? 'bg-[#FAF7F2] text-[#171717]'
          : theme === 'dark'
          ? 'bg-[#171717] text-[#F6F0E8]'
          : 'bg-gradient-to-b from-[#FAF7F2] to-[#F1E8DC] text-[#171717]'
      } ${className}`}
    >
      {/* 1. Interlocking LV Monogram */}
      <div className="mb-3 relative">
        <MonogramSVG width={size === 'xl' ? 140 : size === 'lg' ? 105 : 80} height={size === 'xl' ? 140 : size === 'lg' ? 105 : 80} />
      </div>

      {/* 2. English Brand Name */}
      <h2
        className={`font-['Cinzel'] font-extrabold tracking-[0.3em] text-[#171717] uppercase mb-2 ${
          size === 'xl' ? 'text-2xl sm:text-3xl' : size === 'lg' ? 'text-xl' : 'text-base'
        }`}
      >
        L I V O R A
      </h2>

      {/* 3. Gold Star Divider: ── ✦ ── */}
      <div className="flex items-center justify-center gap-3 w-40 max-w-full my-1.5 opacity-85">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C8A96B] to-[#C8A96B]" />
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 text-[#C8A96B] fill-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C8A96B] to-[#C8A96B]" />
      </div>

      {/* 4. Arabic Brand Name in Golden Script */}
      <div
        className={`font-bold tracking-[0.45em] text-[#A58645] mt-1 pr-1 ${
          size === 'xl' ? 'text-xl sm:text-2xl' : size === 'lg' ? 'text-lg' : 'text-sm'
        }`}
      >
        لـ يـ فـ و ر ا
      </div>
    </div>
  );
};
