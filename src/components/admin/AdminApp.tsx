import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './LoginPage';
import { DashboardHome } from './DashboardHome';
import { ProductsList } from './ProductsList';
import { ProductForm } from './ProductForm';
import { CategoriesList } from './CategoriesList';
import { CategoryForm } from './CategoryForm';
import { BannersList } from './BannersList';
import { BannerForm } from './BannerForm';
import { SettingsForm } from './SettingsForm';

export const AdminApp: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { routeParams, navigateTo } = useStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#C8A96B]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A96B]"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#141414] text-[#F6F0E8] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">غير مصرح لك بالدخول</h2>
        <p className="text-stone-400 mb-8">حسابك لا يملك صلاحيات الإدارة.</p>
        <div className="flex gap-4">
          <button onClick={() => navigateTo('home')} className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">العودة للمتجر</button>
          <button onClick={signOut} className="px-6 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">تسجيل الخروج</button>
        </div>
      </div>
    );
  }

  const path = routeParams.adminPath || '/';

  const renderContent = () => {
    if (path === '/') return <DashboardHome />;
    if (path === '/products') return <ProductsList />;
    if (path === '/products/new') return <ProductForm />;
    if (path.startsWith('/products/')) return <ProductForm productId={path.split('/')[2]} />;
    if (path === '/categories') return <CategoriesList />;
    if (path === '/categories/new') return <CategoryForm />;
    if (path.startsWith('/categories/')) return <CategoryForm categoryId={path.split('/')[2]} />;
    if (path === '/banners') return <BannersList />;
    if (path === '/banners/new') return <BannerForm />;
    if (path.startsWith('/banners/')) return <BannerForm bannerId={path.split('/')[2]} />;
    if (path === '/settings') return <SettingsForm />;
    return <DashboardHome />;
  };

  return <AdminLayout>{renderContent()}</AdminLayout>;
};
