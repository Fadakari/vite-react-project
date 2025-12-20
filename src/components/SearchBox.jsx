import React from 'react';

const SearchBox = () => {
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
            <button className="bg-primary text-white rounded-xl px-12 py-2 font-bold hover:bg-blue-900 transition shadow-md">
            ارسال پاسخ
            </button>
        </div>
      </div>

    </div>
  );
};

export default SearchBox;