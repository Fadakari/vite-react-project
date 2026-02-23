import React from 'react';
import CountDown from '../components/CountDown';
import { FaUser, FaTicketAlt, FaTrophy, FaEdit, FaSignOutAlt, FaThList } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="pt-24 md:pt-60 w-full container mx-auto px-4 max-w-6xl pb-20">
      
      {/* بخش ۱: تایمر (بالای صفحه) */}
      <div className="mb-8">
        <CountDown />
      </div>

      {/* بخش اصلی: گرید دو ستونه (سایدبار و محتوا) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* ---------------- سایدبار (سمت راست) ---------------- */}
        {/* در دسکتاپ ۱ ستون از ۴ ستون را می‌گیرد */}
        <div className="lg:col-span-1 bg-white rounded-[30px] p-6 shadow-sm flex flex-col items-center">
            
            {/* عکس پروفایل */}
            <div className="w-24 h-24 bg-black rounded-full mb-6 border-4 border-gray-200"></div>
            
            {/* منو */}
            <div className="w-full flex flex-col gap-2">
                <MenuItem icon={<FaThList />} text="داشبورد" active />
                <MenuItem icon={<FaEdit />} text="ویرایش حساب" />
                <MenuItem icon={<FaTrophy />} text="کارت طلایی" />
                <MenuItem icon={<FaTicketAlt />} text="نتایج قرعه کشی" />
                <MenuItem icon={<FaUser />} text="تیکت های من" />
                <MenuItem icon={<FaSignOutAlt />} text="خروج" red />
            </div>
        </div>


        {/* ---------------- محتوای اصلی (سمت چپ) ---------------- */}
        {/* در دسکتاپ ۳ ستون از ۴ ستون را می‌گیرد */}
        <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* باکس ۱: خوش‌آمدگویی */}
            <div className="bg-white rounded-[20px] p-4 px-6 shadow-sm flex items-center justify-between">
                <span className="font-bold text-gray-700">امین حیدری خوش آمدید به گره گشا</span>
            </div>

            {/* باکس ۲: آخرین نتایج قرعه کشی (جدول) */}
            <div className="bg-white rounded-[30px] p-6 shadow-sm min-h-[200px]">
                <h3 className="font-bold text-right mb-4 text-gray-800 border-b pb-2">آخرین نتایج قرعه کشی</h3>
                {/* هدر جدول */}
                <div className="grid grid-cols-3 text-xs font-bold text-gray-500 mb-4 px-2">
                    <div className="text-right">شماره قرعه کشی</div>
                    <div className="text-center">تاریخ</div>
                    <div className="text-left">وضعیت</div>
                </div>
                {/* اگر دیتایی بود اینجا مپ میزنیم، فعلا خالی مثل عکس */}
                <div className="flex items-center justify-center h-24 text-gray-300 text-sm">
                    هنوز نتیجه‌ای ثبت نشده است
                </div>
            </div>

            {/* باکس ۳: کارت های طلایی من (جدول) */}
            <div className="bg-white rounded-[30px] p-6 shadow-sm min-h-[200px]">
                <h3 className="font-bold text-right mb-4 text-gray-800 border-b pb-2">کارت های طلایی من</h3>
                <div className="grid grid-cols-4 text-xs font-bold text-gray-500 mb-4 px-2">
                    <div className="text-right">شماره کارت</div>
                    <div className="text-center">تاریخ</div>
                    <div className="text-center">تاریخ انقضا</div>
                    <div className="text-left">وضعیت</div>
                </div>
                 <div className="flex items-center justify-center h-24 text-gray-300 text-sm">
                    کارتی یافت نشد
                </div>
            </div>

            {/* باکس ۴: تیکت های من */}
            <div className="bg-white rounded-[30px] p-6 shadow-sm">
                <h3 className="font-bold text-right mb-4 text-gray-800">تیکت های من</h3>
                
                {/* یک نمونه تیکت */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 leading-6 text-justify mb-4">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.
                    </p>
                    <div className="flex justify-between items-center text-[10px] md:text-xs">
                        <span className="text-accent font-bold cursor-pointer hover:underline">مشاهده کامل تیکت ›</span>
                        <div className="flex gap-3 text-gray-400">
                            <span>وضعیت تیکت: <span className="text-green-500">پاسخ داده شده</span></span>
                            <span>1402/01/01</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

// کامپوننت کمکی برای آیتم‌های منو
const MenuItem = ({ icon, text, active, red }) => {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold
            ${active ? 'bg-gray-100 text-slate-900' : 'text-gray-500 hover:bg-gray-50 hover:text-slate-800'}
            ${red ? 'text-red-500 hover:text-red-600 hover:bg-red-50 mt-4' : ''}
        `}>
            <span className="text-lg">{icon}</span>
            <span>{text}</span>
        </button>
    );
}

export default Dashboard;