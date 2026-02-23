import React from 'react';
import PostCard from '../components/PostCard';
import img1 from '../assets/5093763060974947300.jpg';
import img2 from '../assets/5093763060974947301.jpg';
import img3 from '../assets/5093763060974947302.jpg';


const Blog = () => {
  // این آرایه داده‌های شماست که می‌تواند از API بیاید یا دستی وارد شود
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
    <div className="pt-24 md:pt-[14rem] w-full container mx-auto px-4 max-w-6xl pb-20">
      
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-2">معرفی مشاغل</h1>
        <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full"></div>
      </div>

      {/* گرید کارت ها - مشابه عکس ارسالی ۴ ستونه در دسکتاپ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
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
  );
};

export default Blog;