import React from 'react';
import SearchBox from '../components/SearchBox';
import PostCard from '../components/PostCard';
import { FaPhone } from "react-icons/fa";
import { Link } from 'react-router-dom';
import img1 from '../assets/5093763060974947300.jpg';
import img2 from '../assets/5093763060974947301.jpg';
import img3 from '../assets/5093763060974947302.jpg';
import img4 from '../assets/photo-1476514525535-07fb3b4ae5f1.jpeg';


const Home = () => {

  const jobsData = [
    {
      id: 1,
      title: 'خانه لوستر',
      desc: 'شماره تماس: 09133510620 \n اینستاگرام: khanehluster',
      image: img1 // آدرس عکس را اینجا بگذارید، مثلا: '/images/job1.jpg'
    },
    {
      id: 2,
      title: 'فروشگاه چهارسو',
      desc: 'موبایل، لوازم جانبی، تعمیرات\n شماره تماس: 09132562066',
      image: img2
    },
    {
      id: 3,
      title: 'تعمیرگاه تخصصی رجبی',
      desc: 'تعمیر موتور، جلو بندی، گیربکس و...\n شماره تماس: 09132744015',
      image: img3
    },
    // می توانید آیتم های بیشتری اضافه کنید...
  ];

  return (
    <div className="pt-24 md:pt-60 w-full transition-all duration-300"> 
      
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* باکس سفید بالا: در موبایل ارتفاع کمتر و گوشه ها کمی تیزتر */}
        {/* باکس گردشگری ویژه (جایگزین دیویژن خالی) */}
        <div className="bg-white rounded-tl-[5rem] rounded-br-[5rem] md:rounded-tl-[5rem] md:rounded-br-[5rem] w-full min-h-[22rem] md:h-80 shadow-lg mb-8 md:mb-12 overflow-hidden flex flex-col md:flex-row" dir="rtl">
            
            {/* بخش متن و محتوا */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-start gap-3 bg-gradient-to-br from-white to-blue-50">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-yellow-400 text-[#1e3a8a] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm">پیشنهاد فصل</span>
                    <span className="text-gray-400 text-xs md:text-sm font-medium">تخفیف ویژه تورها</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a] leading-tight">
                    کشف زیبایی‌های پنهان طبیعت
                </h2>
                
                <p className="text-gray-600 text-xs md:text-sm leading-6 md:leading-7 text-justify">
                    سفری به یادماندنی به بکرترین نقاط گردشگری را تجربه کنید. از جنگل‌های سرسبز شمال تا کویرهای پرستاره، ما همراه لحظات شاد شما هستیم.
                </p>

                <div className="mt-3 flex items-center gap-4 w-full">
                    <div className="mt-3 flex items-center gap-4 w-full">
                        <Link to="/blog" className="bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 group">
                            <span>مشاهده مشاغل</span>
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        </Link>
                        <Link to="/about" className="text-[#1e3a8a] text-xs font-bold cursor-pointer hover:underline">اطلاعات بیشتر</Link>
                    </div>
                </div>
            </div>

            {/* بخش تصویر */}
            <div className="w-full md:w-1/2 h-48 md:h-full relative group">
                 {/* تصویر از Unsplash */}
                 <img 
                    src={img4}
                    alt="طبیعت گردی" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 
                 {/* افکت سایه روی عکس برای زیبایی بیشتر */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/40 to-transparent mix-blend-multiply pointer-events-none"></div>
            </div>

        </div>

        <div className="mb-12 md:mb-16">
            <SearchBox />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {jobsData.map((job) => (
                      <PostCard 
                        key={job.id}
                        title={job.title}
                        description={job.desc}
                        image={job.image}
                      />
                    ))}
        </div>

      </div>

      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40">
        <a href="tel:03535228049" className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40">
          <button className="bg-primary text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center">
              <FaPhone className="text-xl md:text-2xl transform scale-x-[-1]" />
          </button>
        </a>
      </div>

    </div>
  );
};

export default Home;