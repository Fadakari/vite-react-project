import React from 'react';
import { Phone, Instagram, ArrowLeft, Tag, Sparkles } from 'lucide-react';

const PostCard = ({ job, title, description, image, onClick }) => {
  // پشتیبانی همزمان از پاس دادن مستقیم آبجکت job یا پراپ‌های تکی
  const currentTitle = job?.title || title || 'عنوان کسب‌وکار';
  const currentDesc = job?.description || description || '';
  const currentImage = job?.image_url || job?.image || image || null;
  const currentCategory = job?.category_name || null;
  const currentPhone = job?.phone || null;
  const currentInstagram = job?.instagram ? job.instagram.replace(/^@/, '') : null;
  const isFeatured = job?.is_featured || false;

  const handleClick = () => {
    if (onClick) {
      onClick(job || { title: currentTitle, description: currentDesc, image: currentImage });
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group flex flex-col items-center w-full cursor-pointer transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
      dir="rtl"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      {/* بخش تصویر */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-3xl overflow-hidden shadow-md">
        {currentImage ? (
          <img 
            src={currentImage} 
            alt={currentTitle} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a]/20 to-[#31306b]/40 flex items-center justify-center text-gray-400">
            <span className="text-xs font-medium text-gray-500">تصویر ثبت نشده</span>
          </div>
        )}

        {/* سایه روی عکس در هاور */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

        {/* برچسب دسته‌بندی روی عکس */}
        {currentCategory && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-[#1e3a8a]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm flex items-center gap-1">
              <Tag size={10} className="text-yellow-400" />
              {currentCategory}
            </span>
          </div>
        )}

        {/* برچسب ویژه */}
        {isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-yellow-400 text-[#1e3a8a] text-[10px] font-black px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles size={11} />
              ویژه
            </span>
          </div>
        )}
      </div>

      {/* بخش باکس آبی (عنوان) - با مارجین منفی به سمت بالا کشیده شده */}
      <div className="relative -mt-6 z-10 w-[88%] bg-[#31306b] group-hover:bg-[#1e3a8a] text-white py-3 px-3 rounded-2xl text-center shadow-lg transition-colors duration-300 border border-white/20">
        <h3 className="text-sm md:text-base font-bold truncate">
          {currentTitle}
        </h3>
      </div>

      {/* بخش توضیحات، اطلاعات تماس سریع و دکمه */}
      <div className="w-full bg-white group-hover:bg-blue-50/30 pt-9 pb-5 px-4 -mt-6 rounded-b-[2rem] shadow-md group-hover:shadow-xl text-center border border-gray-100 flex flex-col items-center justify-between gap-3 min-h-[145px] transition-all duration-300">
        
        {/* خلاصه متن */}
        <p className="text-xs text-gray-600 leading-6 px-1 line-clamp-2 text-justify w-full">
          {currentDesc || 'جهت مشاهده اطلاعات تکمیلی و راه‌های ارتباطی کلیک کنید.'}
        </p>

        {/* نشان‌های سریع تماس و اینستا */}
        <div className="flex items-center justify-center gap-3 w-full text-[11px] text-gray-500 pt-1 border-t border-gray-100">
          {currentPhone && (
            <span className="flex items-center gap-1 text-green-700 font-medium">
              <Phone size={12} className="text-green-600" />
              <span dir="ltr">{currentPhone.slice(0, 11)}</span>
            </span>
          )}
          {currentInstagram && (
            <span className="flex items-center gap-1 text-pink-700 font-medium">
              <Instagram size={12} className="text-pink-600" />
              <span>اینستاگرام</span>
            </span>
          )}
        </div>

        {/* دکمه باز کردن جزئیات */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full mt-1 bg-gray-50 group-hover:bg-[#1e3a8a] text-[#1e3a8a] group-hover:text-white text-xs font-bold py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md"
        >
          <span>مشاهده مشخصات و تماس</span>
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default PostCard;