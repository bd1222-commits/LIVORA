import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { LayoutDashboard, Package, Tags, Settings, LogOut, Store, Grid, Image, Menu, X } from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut } = useAuth();
  const { navigateTo, routeParams } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPath = routeParams.adminPath || '/';

  const isActive = (id: string) => {
    if (id === '/') return currentPath === '/';
    return currentPath.startsWith(id);
  };

  const navItems = [
    { id: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: '/products', label: 'المنتجات', icon: Package },
    { id: '/categories', label: 'التصنيفات', icon: Grid },
    { id: '/banners', label: 'البانرات', icon: Image },
    { id: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    navigateTo('admin', { adminPath: id });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#F6F0E8] flex flex-col lg:flex-row" dir="rtl">
      {/* Mobile Top Navigation Header (visible on screens < lg) */}
      <header className="lg:hidden bg-[#1F1F1F] border-b border-[#C8A96B]/20 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center border border-[#C8A96B]/40">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-['Cinzel'] font-bold text-base text-[#C8A96B]">LIVORA</h1>
            <p className="text-[10px] text-stone-400">لوحة التحكم</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C8A96B] transition-colors"
          aria-label="القائمة"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Navigation (Fixed on Desktop lg, Sliding Drawer on Mobile) */}
      <aside
        className={`bg-[#1F1F1F] border-l border-[#C8A96B]/20 flex flex-col fixed top-0 bottom-0 right-0 w-64 z-50 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[#C8A96B]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A96B]/15 text-[#C8A96B] flex items-center justify-center border border-[#C8A96B]/40">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-['Cinzel'] font-bold text-lg text-[#C8A96B]">LIVORA</h1>
              <p className="text-xs text-stone-400">لوحة التحكم</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded-lg text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
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
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('home');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-stone-400 hover:bg-white/5 hover:text-white"
          >
            <Store className="w-5 h-5" />
            <span>عرض المتجر</span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              signOut();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:mr-64 mr-0 min-w-0 max-w-full overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
