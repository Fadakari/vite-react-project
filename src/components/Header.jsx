import React, { useState } from 'react';
import { User, Phone, Info, Home, Briefcase, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // لیست منوها برای جلوگیری از تکرار کد
  const menuItems = [
    { text: 'صفحه اصلی', icon: <Home size={20} />, link: '/' },
    { text: 'معرفی مشاغل', icon: <Briefcase size={20} />, link: '/blog' },
    { text: 'تماس با ما', icon: <Phone size={20} />, link: '/contact' },
    { text: 'درباره ما', icon: <Info size={20} />, link: '/about' },
  ];

  return (
    <>
      {/* ================= نسخه موبایل (زیر ۷۶۸ پیکسل) ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white shadow-md flex justify-between items-center" dir="rtl">
         {/* دکمه باز کردن منو */}
         <button onClick={() => setIsMenuOpen(true)} className="text-primary">
            <Menu size={28} />
         </button>

         {/* لوگوی وسط در موبایل */}
         <div className="flex flex-col items-center">
             <span className="text-2xl font-serif font-bold text-[#1e3a8a]">G</span>
         </div>

         {/* دکمه پروفایل موبایل */}
         <div className="bg-gray-100 p-2 rounded-full">
            <User size={20} className="text-gray-600" />
         </div>
      </div>

      {/* منوی کشویی موبایل (Overlay) */}
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()} dir="rtl">
            
            {/* سربرگ منوی موبایل */}
            <div className="p-5 border-b flex justify-between items-center bg-[#1e3a8a] text-white">
                <span className="font-bold">منوی گره‌گشا</span>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
            </div>

            {/* لینک‌های موبایل */}
            <div className="flex flex-col p-4 gap-4">
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.link} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50 p-2 rounded-lg transition">
                        {item.icon}
                        <span className="font-medium">{item.text}</span>
                    </Link>
                ))}
                 <Link to="/dashboard" className="flex items-center gap-3 text-white bg-[#1e3a8a] p-3 rounded-lg mt-4 justify-center shadow-lg">
                    <User size={20} />
                    <span>ورود / عضویت</span>
                </Link>
            </div>
        </div>
      </div>


      {/* ================= نسخه دسکتاپ (بالای ۷۶۸ پیکسل) ================= */}
      <header className="hidden md:flex absolute top-20 left-0 right-0 z-50 px-4 justify-center">
        
        <div className="relative w-full max-w-5xl drop-shadow-2xl" dir="rtl">
          
          {/* نوار سفید */}
          <div className="login-dashboard bg-white rounded-[5rem] px-8 py-2 flex justify-start items-center relative z-20 mx-0 shadow-xl/30">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-900 transition-colors font-bold text-sm">
              <div className="bg-gray-100 p-1.5 rounded-full"><User size={16} /></div>
              <span>ورود / عضویت</span>
            </Link>
          </div>

          {/* نوار آبی */}
          <div className="bg-[#1e3a8a] text-white rounded-b-full rounded-t-[0px] px-12 py-3 flex items-center justify-between relative z-10 mx-0 -mt-1 w-[80%] mr-[10%]">
            <nav className="flex items-center gap-10 w-1/3 justify-start">
              <Link to="/" className="hover:text-yellow-400 transition font-bold text-sm">صفحه اصلی</Link>
              <Link to="/blog" className="hover:text-yellow-400 transition font-bold text-sm">معرفی مشاغل</Link>
            </nav>

            <div className="w-1/3"></div>

            <nav className="flex items-center gap-10 w-1/3 justify-end">
              <Link to="/contact" className="hover:text-yellow-400 transition font-bold text-sm">تماس با ما</Link>
              <Link to="/about" className="hover:text-yellow-400 transition font-bold text-sm">درباره ما</Link>
            </nav>
          </div>

          {/* لوگو */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[-3.5rem] z-20">
            <div className="bg-blue-100 w-[170px] h-[170px] rounded-full relative flex items-center justify-center border-[8px] border-white">
                <span className="text-8xl font-serif leading-none absolute left-[3%] top-[11%]">G</span>
                <span className="text-[25px] absolute right-[22%] top-[22%]">erah</span>
                <span className="text-[25px] absolute right-[18%] top-[43%]">osha</span>
                <span className="text-[12px] absolute right-[20%] top-[70%]">gerahgosha.com</span>
            </div>
          </div>

        </div>
      </header>
    </>
  );
};

export default Header;