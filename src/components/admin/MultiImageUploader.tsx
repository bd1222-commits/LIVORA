import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  label?: string;
  isProductImage?: boolean;
}

const processProductImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const targetWidth = 1080;
      const targetHeight = 1442;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const imgRatio = img.width / img.height;
      const targetRatio = targetWidth / targetHeight;

      let drawWidth = targetWidth;
      let drawHeight = targetHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        drawWidth = targetHeight * imgRatio;
        drawHeight = targetHeight;
        offsetX = (targetWidth - drawWidth) / 2;
      } else {
        drawWidth = targetWidth;
        drawHeight = targetWidth / imgRatio;
        offsetY = (targetHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(processedFile);
        },
        'image/jpeg',
        0.92
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
};

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ values = [], onChange, bucket = 'livora-storage', label = 'صور إضافية', isProductImage = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const newUrls: string[] = [];

      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        if (isProductImage) {
          file = await processProductImage(file);
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        
        if (data && data.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }
      
      onChange([...values, ...newUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert('فشل رفع بعض الصور: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-stone-400 font-medium">{label}</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {values.map((url, idx) => (
          <div key={idx} className="relative aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden group">
            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => removeImage(idx)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        <div className="relative aspect-square bg-white/5 rounded-xl border-2 border-dashed border-white/10 hover:border-[#C8A96B]/50 transition-colors overflow-hidden flex flex-col items-center justify-center text-stone-400">
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-[#C8A96B]" />
          ) : (
            <>
              <Upload size={24} className="opacity-50" />
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
