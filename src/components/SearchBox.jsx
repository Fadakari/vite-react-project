import React, { useState } from 'react';

const SearchBox = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setSuccess(false);
    // شبیه‌سازی تاخیر ۱.۵ ثانیه‌ای سرور
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // بعد از ۳ ثانیه پیام محو شود
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-8 w-full max-w-3xl mx-auto shadow-sm">
      
      <h2 className="text-center text-lg md:text-xl font-bold text-slate-800 mb-6">
        مهمترین آثار تاریخی جهان در ایران چه نام دارد؟
      </h2>

      <div className="flex flex-col gap-4">
        {/* ورودی اول */}
        <input 
          type="text" 
          className="w-full bg-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition shadow-sm"
        />
        
        {/* ورودی دوم */}
        <input 
          type="text" 
          className="w-full bg-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition shadow-sm"
        />

        {/* دکمه ارسال */}
        <div className="flex justify-center mt-2">
            <div className="flex flex-col items-center mt-2 gap-3">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className={`${loading ? 'bg-gray-400' : 'bg-primary hover:bg-blue-900'} text-white rounded-xl px-12 py-2 font-bold transition shadow-md flex items-center gap-2`}
              >
                {loading ? 'در حال ارسال...' : 'ارسال پاسخ'}
              </button>

              {/* پیام موفقیت فیک */}
              {success && (
                <span className="text-green-600 text-sm font-bold bg-green-50 px-4 py-2 rounded-lg">
                  پاسخ شما با موفقیت ثبت شد و در حال بررسی است.
                </span>
              )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SearchBox;