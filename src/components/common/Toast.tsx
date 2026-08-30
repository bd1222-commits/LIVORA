import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="pointer-events-auto bg-[#171717] text-[#F6F0E8] rounded-xl p-3.5 shadow-2xl border border-[#C8A96B]/50 flex items-start gap-3 relative overflow-hidden backdrop-blur-md"
          >
            {/* Gold Accent Bar */}
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-[#DEC593] via-[#C8A96B] to-[#A58645]" />

            {toast.type === 'gold' ? (
              <div className="w-8 h-8 rounded-full bg-[#C8A96B]/20 text-[#C8A96B] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            ) : toast.type === 'success' ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
            )}

            <div className="flex-1 pr-1">
              <h5 className="text-xs font-bold text-[#F6F0E8]">{toast.title}</h5>
              {toast.description && (
                <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-1">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
