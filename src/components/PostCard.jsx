import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = () => {
  return (
    <div className="bg-white rounded-[30px] p-4 pb-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
      
      {/* محل عکس (طوسی) */}
      <div className="w-full aspect-square bg-slate-500 rounded-[20px] mb-4"></div>
      
      {/* عنوان */}
      <h3 className="font-bold text-slate-800 text-sm mb-2">
        متن ساختگی برای دمو نوشته های بلاگ
      </h3>
      
      {/* متن کوتاه */}
      <p className="text-[10px] text-gray-400 mb-4 px-2 leading-5">
        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
      </p>
      
      {/* لینک ادامه مطلب */}
      <Link to="#" className="text-primary text-xs font-bold hover:text-blue-800 transition">
        ادامه مطلب
      </Link>

    </div>
  );
};

export default PostCard;