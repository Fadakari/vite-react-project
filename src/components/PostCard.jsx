import React from 'react';

const PostCard = ({ title, description, image }) => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* بخش تصویر */}
      <div className="w-full h-48 bg-gray-500 rounded-t-3xl overflow-hidden shadow-md">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          // اگر عکسی نباشد، یک باکس طوسی نمایش داده می‌شود (مثل طرح شما)
          <div className="w-full h-full bg-gray-500 animate-pulse"></div>
        )}
      </div>

      {/* بخش باکس آبی (عنوان) - با مارجین منفی به سمت بالا کشیده شده */}
      <div className="relative -mt-6 z-10 w-[85%] bg-[#31306b] text-white py-3 px-2 rounded-xl text-center shadow-lg">
        <h3 className="text-sm md:text-base truncate">
          {title}
        </h3>
      </div>

      {/* بخش توضیحات و دکمه */}
      <div className="w-full bg-gray-50 pt-10 pb-6 px-4 -mt-6 rounded-b-[2rem] shadow-sm text-center border border-gray-100 flex flex-col items-center gap-4">
        <p className="text-xs text-gray-500 leading-6 px-2 line-clamp-3 whitespace-pre-line">
          {description}
        </p>
        
        {/* <button onClick={() => alert('جزئیات تکمیلی این فروشگاه/کسب و کار به‌زودی در سامانه قرار می‌گیرد.')} className="text-[#31306b] text-sm font-bold hover:underline">
          ادامه مطلب
        </button> */}
      </div>
    </div>
  );
};

export default PostCard;