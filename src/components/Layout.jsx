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
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-600">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p>© ۱۴۰۴ گره‌گشا ایساتیس. تمامی حقوق محفوظ است.</p>
            <div className="flex gap-6">
               <Link to="/qa" className="hover:text-[#1e3a8a] hover:underline font-medium transition">سوال و جواب</Link>
               <Link to="/terms" className="hover:text-[#1e3a8a] hover:underline font-medium transition">قوانین و مقررات</Link>
               <Link to="/about" className="hover:text-[#1e3a8a] hover:underline font-medium transition">درباره ما</Link>
            </div>
          </div>
          
          <div 
            className="bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex-shrink-0"
            dangerouslySetInnerHTML={{
              __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=620421&Code=usSMKYAOCVAqBmlYF5eKUiF9FuWljLQH'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=620421&Code=usSMKYAOCVAqBmlYF5eKUiF9FuWljLQH' alt='' style='cursor:pointer' code='usSMKYAOCVAqBmlYF5eKUiF9FuWljLQH'></a>`
            }}
          />
        </div>
      </footer>
    </div>
  );
};

export default Layout;