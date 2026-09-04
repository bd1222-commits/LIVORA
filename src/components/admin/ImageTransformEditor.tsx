import React from 'react';
import { ImageTransform } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { RotateCcw, ZoomIn, MoveHorizontal, MoveVertical } from 'lucide-react';

interface ImageTransformEditorProps {
  imageUrl: string;
  title?: string;
  transform: ImageTransform;
  onChange: (newTransform: ImageTransform) => void;
}

export const ImageTransformEditor: React.FC<ImageTransformEditorProps> = ({
  imageUrl,
  title = 'تأطير وضبط أبعاد الصورة',
  transform,
  onChange,
}) => {
  const currentTransform: ImageTransform = {
    zoom: transform?.zoom ?? 1,
    positionX: transform?.positionX ?? 0,
    positionY: transform?.positionY ?? 0,
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...currentTransform,
      zoom: parseFloat(e.target.value),
    });
  };

  const handlePositionXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...currentTransform,
      positionX: parseInt(e.target.value, 10),
    });
  };

  const handlePositionYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...currentTransform,
      positionY: parseInt(e.target.value, 10),
    });
  };

  const handleReset = () => {
    onChange({
      zoom: 1,
      positionX: 0,
      positionY: 0,
    });
  };

  return (
    <div className="bg-[#171717] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#C8A96B] flex items-center gap-2">
          <ZoomIn className="w-4 h-4" />
          {title}
        </h4>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-stone-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all"
          title="إعادة ضبط الصورة للوضع الافتراضي"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة ضبط
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Live Preview Container (1080 x 1442 Aspect Ratio Frame) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <span className="text-[11px] text-stone-400 mb-1.5 font-mono">
            إطار العرض 1080 × 1442 px
          </span>
          <div className="w-48 sm:w-56 rounded-xl overflow-hidden border border-[#C8A96B]/30 shadow-lg bg-[#0F0F0F]">
            <ProductImage
              src={imageUrl}
              alt="معاينة التعديل"
              transform={currentTransform}
              showWatermark={true}
            />
          </div>
        </div>

        {/* Sliders and Controls */}
        <div className="md:col-span-7 space-y-4">
          {/* Zoom Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-300 font-medium flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#C8A96B]" />
                التكبير والتصغير (Zoom)
              </span>
              <span className="text-[#C8A96B] font-mono font-bold">
                {Math.round(currentTransform.zoom * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.05"
              value={currentTransform.zoom}
              onChange={handleZoomChange}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#C8A96B]"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>100% (طبيعي)</span>
              <span>200%</span>
              <span>300%</span>
            </div>
          </div>

          {/* Position X Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-300 font-medium flex items-center gap-1.5">
                <MoveHorizontal className="w-3.5 h-3.5 text-[#C8A96B]" />
                التحريك الأفقي (X)
              </span>
              <span className="text-stone-300 font-mono">
                {currentTransform.positionX > 0 ? `+${currentTransform.positionX}%` : `${currentTransform.positionX}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={currentTransform.positionX}
              onChange={handlePositionXChange}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#C8A96B]"
            />
          </div>

          {/* Position Y Control */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-300 font-medium flex items-center gap-1.5">
                <MoveVertical className="w-3.5 h-3.5 text-[#C8A96B]" />
                التحريك الرأسي (Y)
              </span>
              <span className="text-stone-300 font-mono">
                {currentTransform.positionY > 0 ? `+${currentTransform.positionY}%` : `${currentTransform.positionY}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={currentTransform.positionY}
              onChange={handlePositionYChange}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#C8A96B]"
            />
          </div>

          {/* Quick Presets */}
          <div className="pt-2 flex items-center gap-2">
            <span className="text-[11px] text-stone-400">إعدادات سريعة:</span>
            <button
              type="button"
              onClick={() => onChange({ zoom: 1, positionX: 0, positionY: 0 })}
              className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                currentTransform.zoom === 1 && currentTransform.positionX === 0 && currentTransform.positionY === 0
                  ? 'bg-[#C8A96B] text-[#171717] font-bold'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              100% افتراضي
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...currentTransform, zoom: 1.25 })}
              className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                currentTransform.zoom === 1.25
                  ? 'bg-[#C8A96B] text-[#171717] font-bold'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              125%
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...currentTransform, zoom: 1.5 })}
              className={`text-[11px] px-2.5 py-1 rounded-md transition-all ${
                currentTransform.zoom === 1.5
                  ? 'bg-[#C8A96B] text-[#171717] font-bold'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              150%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
