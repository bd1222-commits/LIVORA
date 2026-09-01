import React from 'react';
import { useStore } from '../context/StoreContext';
import { ExternalLink, Database, ShieldCheck, ArrowLeft } from 'lucide-react';

export const SanityStudioPage: React.FC = () => {
  const { navigateTo } = useStore();

  const env = (import.meta as any).env || {};
  const projectId = env.VITE_SANITY_PROJECT_ID || 'a8ha3p9y';
  const dataset = env.VITE_SANITY_DATASET || 'production';

  const SANITY_STUDIO_URL = 'https://manage.sanity.io';

  const handleRedirect = () => {
    window.open(SANITY_STUDIO_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#F6F0E8] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#1F1F1F] text-white rounded-3xl p-8 shadow-2xl border border-[#C8A96B]/40 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center mx-auto border border-[#C8A96B]/40 shadow-inner">
          <Database className="w-8 h-8" />
        </div>

        <div>
          <span className="font-['Cinzel'] font-bold text-2xl tracking-widest text-[#C8A96B] block">
            SANITY STUDIO
          </span>
          <h3 className="text-base font-bold text-white mt-1">Sanity CMS Management Console</h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            مرحباً بكِ في البوابة الرسمية لإدارة متجر ليفورا عبر Sanity CMS. يمكنكِ تسجيل الدخول وإدارة كافة المنتجات والأسعار والتصنيفات والمحتوى مباشرة من لوحة Sanity الرسمية.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleRedirect}
            className="w-full py-4 rounded-xl bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>الانتقال لـ Sanity Studio الرسمي</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>العودة إلى متجر ليفورا</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-4 border-t border-white/10 text-[11px] text-stone-400 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[#C8A96B]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold">Sanity CMS Integration Active</span>
          </div>
          <p className="text-[10px] text-stone-500">
            Project ID: <span className="font-mono text-stone-300">{projectId}</span> | Dataset: <span className="font-mono text-stone-300">{dataset}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
