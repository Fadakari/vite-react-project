import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen relative bg-main-gradient flex flex-col items-center">
      {/* هدر ثابت */}
      <Header />
      
      {/* محتویات متغیر صفحات در اینجا نمایش داده می‌شود */}
      <main className="w-full max-w-6xl px-4 pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;