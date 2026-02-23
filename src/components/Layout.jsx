import React from 'react';
import Header from './Header';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen relative bg-main-gradient flex flex-col items-center">
      {/* هدر ثابت */}
      <Header />
      
      {/* محتویات متغیر صفحات در اینجا نمایش داده می‌شود */}
      <main className="w-full max-w-6xl px-4 pb-10 flex-grow">
        <Outlet />
      </main>

      <footer className="w-full bg-white/50 backdrop-blur-sm border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© ۱۴۰۴ گره‌گشا ایساتیس. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-6">
             <Link to="/terms" className="hover:text-[#1e3a8a] hover:underline font-medium transition">قوانین و مقررات</Link>
             <Link to="/about" className="hover:text-[#1e3a8a] hover:underline font-medium transition">درباره ما</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;