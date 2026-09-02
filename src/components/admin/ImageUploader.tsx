import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, bucket = 'livora-storage', label = 'صورة' }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('يجب اختيار صورة');
      }

      const file = event.target.files[0];
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
        onChange(data.publicUrl);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('فشل رفع الصورة: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-stone-400 font-medium">{label}</label>
      
      {value ? (
        <div className="relative w-full h-40 bg-white/5 rounded-xl border border-white/10 overflow-hidden group">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={removeImage}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-40 bg-white/5 rounded-xl border-2 border-dashed border-white/10 hover:border-[#C8A96B]/50 transition-colors overflow-hidden flex flex-col items-center justify-center text-stone-400">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-[#C8A96B]" />
              <span className="text-sm">جاري الرفع...</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="mb-2 opacity-50" />
              <span className="text-sm">اضغط هنا لاختيار صورة من جهازك</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
