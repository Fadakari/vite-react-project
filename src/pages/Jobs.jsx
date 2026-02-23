import React from 'react';
import JobCard from '../components/JobCard';

const Jobs = () => {
  // این آرایه داده‌های شماست که می‌تواند از API بیاید یا دستی وارد شود
  const jobsData = [
    {
      id: 1,
      title: 'متن ساختگی برای دمو نوشته های بلاگ',
      desc: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.',
      image: null // آدرس عکس را اینجا بگذارید، مثلا: '/images/job1.jpg'
    },
    {
      id: 2,
      title: 'طراحی رابط کاربری',
      desc: 'طراحان گرافیک و چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.',
      image: null
    },
    {
      id: 3,
      title: 'برنامه نویسی فرانت‌اند',
      desc: 'برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.',
      image: null
    },
    {
      id: 4,
      title: 'دیجیتال مارکتینگ',
      desc: 'کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد.',
      image: null
    },
    // می توانید آیتم های بیشتری اضافه کنید...
  ];

  return (
    <div className="pt-24 md:pt-44 w-full container mx-auto px-4 max-w-6xl pb-20">
      
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-2">معرفی مشاغل</h1>
        <div className="w-16 h-1 bg-yellow-400 mx-auto rounded-full"></div>
      </div>

      {/* گرید کارت ها - مشابه عکس ارسالی ۴ ستونه در دسکتاپ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {jobsData.map((job) => (
          <JobCard 
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

export default Jobs;