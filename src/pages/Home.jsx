import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import PostCard from '../components/PostCard';
import JobDetailModal from '../components/JobDetailModal';
import { FaPhone } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import img1 from '../assets/5093763060974947300.jpg';
import img2 from '../assets/5093763060974947301.jpg';
import img3 from '../assets/5093763060974947302.jpg';
import img4 from '../assets/photo-1476514525535-07fb3b4ae5f1.jpeg';

const Home = () => {
  const defaultJobs = [
    {
      id: 1,
      title: 'خانه لوستر',
      category_name: 'دکوراسیون و روشنایی',
      description: 'فروش انواع لوستر مدرن و کلاسیک، آباژور و چراغ‌های تزیینی برای منازل و ادارات با بالاترین کیفیت.',
      phone: '09133510620',
      instagram: 'khanehluster',
      address: 'یزد، بلوار جمهوری اسلامی، روبروی امامزاده جعفر',
      image: img1,
      is_featured: true,
    },
    {
      id: 2,
      title: 'فروشگاه چهارسو',
      category_name: 'موبایل و دیجیتال',
      description: 'عرضه جدیدترین گوشی‌های هوشمند، تبلت و لوازم جانبی اورجینال به همراه خدمات تخصصی تعمیرات نرم‌افزاری و سخت‌افزاری.',
      phone: '09132562066',
      instagram: 'chaharsou_store',
      address: 'یزد، خیابان کاشانی، پاساژ ولیعصر، طبقه همکف',
      image: img2,
      is_featured: true,
    },
    {
      id: 3,
      title: 'تعمیرگاه تخصصی رجبی',
      category_name: 'خدمات خودرو',
      description: 'کلیه خدمات تخصصی تنظیم موتور، جلوبندی، عیب‌یابی با دستگاه دیاگ و تعمیر گیربکس خودروهای ایرانی و خارجی.',
      phone: '09132744015',
      instagram: '',
      address: 'یزد، بلوار آزادگان، بعد از کوچه ۲۲',
      image: img3,
      is_featured: true,
    },
  ];

  const [jobsData, setJobsData] = useState(defaultJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      const data = await fetchJobs({ featured: 'true' });
      if (data && data.length > 0) {
        setJobsData(data);
      }
    }
    loadJobs();
  }, []);

  return (
    <div className="pt-24 md:pt-60 w-full transition-all duration-300"> 
      
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* باکس گردشگری ویژه */}
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
                    <Link to="/blog" className="bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 group">
                        <span>مشاهده همه مشاغل</span>
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    </Link>
                    <Link to="/about" className="text-[#1e3a8a] text-xs font-bold cursor-pointer hover:underline">اطلاعات بیشتر</Link>
                </div>
            </div>

            {/* بخش تصویر */}
            <div className="w-full md:w-1/2 h-48 md:h-full relative group">
                 <img 
                    src={img4}
                    alt="طبیعت گردی" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/40 to-transparent mix-blend-multiply pointer-events-none"></div>
            </div>

        </div>

        {/* بخش مسابقه و قرعه‌کشی */}
        <div className="mb-12 md:mb-16">
            <SearchBox />
        </div>

        {/* عنوان بخش مشاغل برگزیده */}
        <div className="flex items-center justify-between mb-8" dir="rtl">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a8a] mb-1">
              کسب‌وکارهای برگزیده و منتخب
            </h2>
            <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
          </div>
          <Link 
            to="/blog" 
            className="text-xs md:text-sm font-bold text-[#1e3a8a] hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>مشاهده همه مشاغل</span>
            <span>←</span>
          </Link>
        </div>

        {/* گرید کارت‌های مشاغل */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {jobsData.map((job) => (
              <PostCard 
                key={job.id}
                job={job}
                onClick={(selected) => setSelectedJob(selected)}
              />
            ))}
        </div>

      </div>

      {/* دکمه شناور تماس پشتیبانی */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40">
        <a href="tel:03535228049" title="تماس با پشتیبانی">
          <button className="bg-primary text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center">
              <FaPhone className="text-xl md:text-2xl transform scale-x-[-1]" />
          </button>
        </a>
      </div>

      {/* مودال جزئیات کامل شغل انتخابی */}
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

    </div>
  );
};

export default Home;