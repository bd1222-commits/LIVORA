import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { LayoutDashboard, Package, Tags, Settings, LogOut, Store, Grid, Image } from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut } = useAuth();
  const { navigateTo, routeParams } = useStore();
  const currentPath = routeParams.adminPath || '/';

  const isActive = (id: string) => {
    if (id === '/') return currentPath === '/';
    return currentPath.startsWith(id);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#F6F0E8] flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F1F1F] border-l border-[#C8A96B]/20 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-[#C8A96B]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center border border-[#C8A96B]/40">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-['Cinzel'] font-bold text-lg text-[#C8A96B]">LIVORA</h1>
            <p className="text-xs text-stone-400">لوحة التحكم</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
            { id: '/products', label: 'المنتجات', icon: Package },
            { id: '/categories', label: 'التصنيفات', icon: Grid },
            { id: '/banners', label: 'البانرات', icon: Image },
            { id: '/settings', label: 'الإعدادات', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo('admin', { adminPath: item.id })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.id)
                  ? 'bg-[#C8A96B] text-[#171717] font-bold shadow-lg shadow-[#C8A96B]/20'
                  : 'text-stone-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#C8A96B]/20 space-y-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-stone-400 hover:bg-white/5 hover:text-white"
          >
            <Store className="w-5 h-5" />
            <span>عرض المتجر</span>
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
