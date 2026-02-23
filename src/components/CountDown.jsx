import React, { useState, useEffect } from 'react';

const CountDown = () => {
  // تنظیم زمان اولیه (مثلاً ۱۵ ساعت و ۳۸ دقیقه و ۷ ثانیه)
  const [time, setTime] = useState({
    hours: 15,
    minutes: 38,
    seconds: 7
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              // زمان تمام شد (می‌توانید اینجا کاری انجام دهید)
              clearInterval(timer);
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // تابع کمکی برای نمایش دو رقمی (مثلاً ۰۵)
  const formatNumber = (num) => num.toString().padStart(2, '0');

  // کامپوننت کوچک برای هر باکس عدد
  const TimeBox = ({ val }) => (
    <div className="bg-[#2d2d2d] text-white text-xl md:text-2xl font-mono font-bold py-2 px-3 rounded-md shadow-inner border border-gray-600">
      {val}
    </div>
  );

  return (
    <>
      {/* تایمر سمت چپ */}
      <div className="flex items-center gap-4 justify-center py-6 absolute -top-[1%] left-[16%]" dir="ltr">
          {/* ساعت */}
          <div className="flex gap-1">
              <TimeBox val={formatNumber(time.hours)[0]} />
              <TimeBox val={formatNumber(time.hours)[1]} />
          </div>
          
          <span className="text-3xl font-bold text-slate-700 pb-2">:</span>

          {/* دقیقه */}
          <div className="flex gap-1">
              <TimeBox val={formatNumber(time.minutes)[0]} />
              <TimeBox val={formatNumber(time.minutes)[1]} />
          </div>

          <span className="text-3xl font-bold text-slate-700 pb-2">:</span>

          {/* ثانیه */}
          <div className="flex gap-1">
              <TimeBox val={formatNumber(time.seconds)[0]} />
              <TimeBox val={formatNumber(time.seconds)[1]} />
          </div>
      </div>

      {/* تایمر سمت راست (کپی شده با تغییر پوزیشن به right) */}
      <div className="hidden lg:flex items-center gap-4 justify-center py-6 absolute -top-[1%] right-[16%]" dir="ltr">
          {/* ساعت */}
          <div className="flex gap-1">
              <TimeBox val={formatNumber(time.hours)[0]} />
              <TimeBox val={formatNumber(time.hours)[1]} />
          </div>
          
          <span className="text-3xl font-bold text-slate-700 pb-2">:</span>

          {/* دقیقه */}
          <div className="flex gap-1">
              <TimeBox val={formatNumber(time.minutes)[0]} />
              <TimeBox val={formatNumber(time.minutes)[1]} />
          </div>

          <span className="text-3xl font-bold text-slate-700 pb-2">:</span>

          {/* ثانیه */}
          <div className="flex gap-1">
              <TimeBox val={formatNumber(time.seconds)[0]} />
              <TimeBox val={formatNumber(time.seconds)[1]} />
          </div>
      </div>
    </>
  );
};

export default CountDown;