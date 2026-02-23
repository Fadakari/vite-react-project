import React from 'react';
import { Phone, MapPin, Calendar, AtSign } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-24 md:pt-[14rem] w-full container mx-auto px-4 max-w-5xl pb-20">
      
      {/* هدر صفحه */}
      <div className="text-center mb-16">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a] mb-4">تماس با ما</h1>
        <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full mb-6 shadow-sm"></div>
        <p className="text-gray-700 md:text-lg font-medium bg-white/60 inline-block px-8 py-3 rounded-full shadow-sm backdrop-blur-sm border border-gray-100">
          موسسه گره‌گشا ایساتیس؛ پاسخگوی سوالات و همراه همیشگی شما
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* کارت آدرس */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
          <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
            <MapPin className="text-[#1e3a8a]" size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">آدرس مراجعه حضوری</h3>
          <p className="text-gray-600 leading-8 mb-4">
            یزد، یزد، ۵۲ متری امامشهر، خیابان ابن سینا
          </p>
          <div className="bg-gray-50 border border-gray-100 px-6 py-2.5 rounded-xl text-sm text-gray-600 font-mono shadow-inner">
            کد پستی: <span className="font-bold text-gray-800">۸۹۱۷۷۳۴۶۶۳</span>
          </div>
        </div>

        {/* کارت شماره‌های تماس */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
          <div className="bg-green-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
            <Phone className="text-green-600" size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">شماره‌های تماس</h3>
          <p className="text-gray-600 leading-8 mb-5">
            برای دریافت راهنمایی و پشتیبانی با ما در ارتباط باشید:
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[220px]">
            <a href="tel:03535228049" className="bg-gray-50 border border-gray-100 hover:bg-green-50 hover:text-green-700 hover:border-green-200 text-gray-700 py-3 rounded-xl font-bold transition-all" dir="ltr">035 3522 8049</a>
            <a href="tel:09138518836" className="bg-gray-50 border border-gray-100 hover:bg-green-50 hover:text-green-700 hover:border-green-200 text-gray-700 py-3 rounded-xl font-bold transition-all" dir="ltr">0913 851 8836</a>
          </div>
        </div>

        {/* کارت شبکه‌های اجتماعی */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group">
          <div className="bg-yellow-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
            <AtSign className="text-yellow-600" size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">شبکه‌های اجتماعی</h3>
          <p className="text-gray-600 leading-8 mb-6">
            ما را در شبکه‌های اجتماعی (تلگرام، ایتا و اینستاگرام) دنبال کنید:
          </p>
          <a href="https://t.me/gerahgosha" target="_blank" rel="noreferrer" className="bg-[#1e3a8a] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-xl flex items-center gap-2" dir="ltr">
            @gerahgosha
          </a>
        </div>

        {/* کارت تاریخچه موسسه */}
        <div className="bg-[#1e3a8a] rounded-[2rem] p-8 shadow-sm border border-blue-800 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group">
          {/* افکت پس‌زمینه */}
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 relative z-10 border border-white/20">
            <Calendar className="text-yellow-400" size={36} />
          </div>
          <h3 className="text-xl font-bold text-white mb-4 relative z-10">اطلاعات فعالیت موسسه</h3>
          <div className="w-full flex flex-col gap-4 text-blue-50 mt-2 relative z-10">
             <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="font-medium">سال تاسیس:</span>
                <span className="font-bold text-yellow-400">اسفندماه ۱۴۰۳</span>
             </div>
             <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="font-medium">آغاز فعالیت:</span>
                <span className="font-bold text-yellow-400">اسفند ماه ۱۴۰۴</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;