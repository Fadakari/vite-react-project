import React, { useState } from 'react';
import { User, Phone, Info, Home, Briefcase, Menu, X, FileText, Smartphone, KeyRound, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  // State های مربوط به مودال ورود
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState(1); // 1: phone, 2: code
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // شبیه‌سازی ارسال کد پیامکی
  const handleSendCode = (e) => {
    e.preventDefault();
    if(phoneNumber.length < 10) return alert('لطفاً شماره موبایل معتبر وارد کنید.');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginStep(2);
    }, 1500); // تاخیر ۱.۵ ثانیه‌ای سرور
  };

  // شبیه‌سازی تایید کد و ورود به داشبورد
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoginModalOpen(false); // بستن مودال
      setLoginStep(1); // ریست کردن فرم
      setPhoneNumber('');
      alert("کد تایید اشتباه است، در صورت ارسال نشدن کد، دقایقی بعد امتحان کنید.")
    }, 1500);
  };

  // لیست منوها برای جلوگیری از تکرار کد
  const menuItems = [
    { text: 'صفحه اصلی', icon: <Home size={20} />, link: '/' },
    { text: 'معرفی مشاغل', icon: <Briefcase size={20} />, link: '/blog' },
    { text: 'تماس با ما', icon: <Phone size={20} />, link: '/contact' },
    { text: 'درباره ما', icon: <Info size={20} />, link: '/about' },
    { text: 'قوانین و مقررات', icon: <FileText size={20} />, link: '/terms' },
    
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
                 <button onClick={() => {setIsMenuOpen(false); setIsLoginModalOpen(true);}} className="flex items-center gap-3 text-white bg-[#1e3a8a] p-3 w-full rounded-lg mt-4 justify-center shadow-lg">
                    <User size={20} />
                    <span>ورود / عضویت</span>
                </button>
            </div>
        </div>
      </div>


      {/* ================= نسخه دسکتاپ (بالای ۷۶۸ پیکسل) ================= */}
      <header className="hidden md:flex absolute top-20 left-0 right-0 z-50 px-4 justify-center">
        
        <div className="relative w-full max-w-5xl drop-shadow-2xl" dir="rtl">
          
          {/* نوار سفید */}
          <div className="login-dashboard bg-white rounded-[5rem] px-8 py-2 flex justify-start items-center relative z-20 mx-0 shadow-xl/30">
            <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 text-gray-700 hover:text-blue-900 transition-colors font-bold text-sm cursor-pointer">
              <div className="bg-gray-100 p-1.5 rounded-full"><User size={16} /></div>
              <span>ورود / عضویت</span>
            </button>
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

      {/* مودال ورود / ثبت‌نام */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-all duration-300 ${isLoginModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => { setIsLoginModalOpen(false); setLoginStep(1); }}>
        <div className={`bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative transform transition-all duration-300 ${isLoginModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`} onClick={e => e.stopPropagation()} dir="rtl">
            
            {/* دکمه بستن */}
            <button onClick={() => { setIsLoginModalOpen(false); setLoginStep(1); }} className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full p-2">
                <X size={20} />
            </button>

            {/* هدر مودال */}
            <div className="text-center mb-8 mt-2">
                <h2 className="text-2xl font-extrabold text-[#1e3a8a] mb-2">ورود / ثبت‌نام</h2>
                <div className="w-12 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            {/* فرم مرحله ۱: دریافت شماره موبایل */}
            {loginStep === 1 && (
                <form onSubmit={handleSendCode} className="flex flex-col gap-5 transition-all">
                    <p className="text-sm text-gray-600 text-center mb-2 font-medium">برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید.</p>
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <Smartphone className="text-[#1e3a8a]/50" size={20} />
                        </div>
                        <input 
                            type="tel" 
                            dir="ltr"
                            placeholder="09123456789"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] transition-all text-center tracking-widest font-mono"
                            autoFocus
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-[#1e3a8a] text-white font-bold text-base py-3.5 rounded-2xl hover:bg-blue-900 transition-all shadow-md flex justify-center items-center mt-2 h-[52px]">
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'ارسال کد تایید'}
                    </button>
                </form>
            )}

            {/* فرم مرحله ۲: ورود کد تایید */}
            {loginStep === 2 && (
                <form onSubmit={handleVerifyCode} className="flex flex-col gap-5 transition-all">
                    <p className="text-sm text-gray-600 text-center mb-2 font-medium leading-6">
                        کد تایید پیامک شده به شماره <br/><span className="font-bold text-[#1e3a8a] mx-1 font-mono text-base" dir="ltr">{phoneNumber}</span> را وارد کنید.
                    </p>
                    
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <KeyRound className="text-[#1e3a8a]/50" size={20} />
                        </div>
                        <input 
                            type="text" 
                            dir="ltr"
                            maxLength="5"
                            placeholder="- - - - -"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-2xl rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:border-[#1e3a8a] transition-all text-center tracking-[0.7em] font-mono"
                            autoFocus
                        />
                    </div>
                    
                    <p className="text-xs text-orange-600 text-center mt-[-10px] bg-orange-50 py-2 rounded-xl border border-orange-100 font-medium">
                        در صورتی که کد ارسال نشد، چند دقیقه بعد امتحان کنید.
                    </p>

                    <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold text-base py-3.5 rounded-2xl hover:bg-green-700 transition-all shadow-md flex justify-center items-center mt-2 h-[52px]">
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'تایید و ورود'}
                    </button>
                    
                    <button type="button" onClick={() => setLoginStep(1)} className="text-sm text-gray-400 hover:text-[#1e3a8a] transition-colors mt-2 underline underline-offset-4 text-center">
                        اصلاح شماره موبایل
                    </button>
                </form>
            )}
        </div>
      </div>
    </>
  );
};

export default Header;