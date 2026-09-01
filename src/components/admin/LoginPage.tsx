import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Lock, Store, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { navigateTo } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('بيانات الدخول غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#F6F0E8] flex items-center justify-center p-4 font-['Tajawal']" dir="rtl">
      <div className="max-w-md w-full bg-[#1F1F1F] rounded-3xl p-8 shadow-2xl border border-[#C8A96B]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96B]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DEC593]/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="relative text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-[#C8A96B]/15 rounded-2xl flex items-center justify-center mb-4 border border-[#C8A96B]/40 shadow-inner">
            <Lock className="w-8 h-8 text-[#C8A96B]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-['Cinzel']">LIVORA ADMIN</h2>
          <p className="text-stone-400 text-sm">تسجيل الدخول للوحة التحكم</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative">
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-3 px-4 pl-12 text-white focus:outline-none focus:border-[#C8A96B] transition-colors"
                required
                dir="ltr"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-300 mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141414] border border-white/10 rounded-xl py-3 px-4 pl-12 text-white focus:outline-none focus:border-[#C8A96B] transition-colors"
                required
                dir="ltr"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C8A96B] hover:bg-[#DEC593] text-[#171717] font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'دخول'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button
            onClick={() => navigateTo('home')}
            className="text-sm text-stone-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Store className="w-4 h-4" />
            العودة للمتجر
          </button>
        </div>
      </div>
    </div>
  );
};
