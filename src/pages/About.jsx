import React from 'react';
import { Target, Star, Gift, Info } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 md:pt-[14rem] w-full container mx-auto px-4 max-w-5xl pb-20">
      
      {/* هدر صفحه */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a] mb-4">درباره ما - گره‌گشا ایساتیس</h1>
        <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full mb-6 shadow-sm"></div>
        <p className="text-gray-700 md:text-lg font-medium bg-white/60 inline-block px-8 py-3 rounded-full shadow-sm backdrop-blur-sm border border-gray-100">
          موسسه گره‌گشا ایساتیس؛ فراتر از یک خرید، مسیری به سوی رونق و کشف ایران
        </p>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* بخش ۱: داستان ما */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#1e3a8a]"></div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-5 flex items-center gap-3">
            <Info className="text-yellow-500" size={28} />
            بخش ۱: داستان ما و تولد یک ایده
          </h2>
          <p className="text-gray-600 leading-9 text-justify md:text-lg">
            در اسفند ماه سال ۱۴۰۳ ایده شکل‌گیری موسسه گره‌گشا ایساتیس متولد شد؛ با این باور که خرید خوب، توسعه کسب و کار و شناخت زیبایی‌های ایران باید برای همه آسان‌تر و لذت‌بخش‌تر باشد. ما فعالیت رسمی خود را از اسفند ماه ۱۴۰۴ آغاز کردیم تا یک پل ارتباطی قدرتمند میان مصرف‌کننده هوشمند، کسب و کارهای پرتوان و جاذبه‌های پنهان ایران بسازیم. ما در اینجا هستیم تا گره‌های مسیر خرید و توسعه شما را بگشاییم.
          </p>
        </div>

        {/* بخش ۲: مأموریت */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center gap-3">
            <Target className="text-yellow-500" size={28} />
            بخش ۲: مأموریت سه‌گانه ما
          </h2>
          <p className="text-gray-600 leading-8 text-justify mb-8 md:text-lg">
            مأموریت ما در ایساتیس در سه ستون اصلی استوار است:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100 hover:-translate-y-1 transition-transform duration-300">
              <h3 className="font-bold text-[#1e3a8a] mb-3 flex items-center gap-2 text-lg">
                <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></span>
                تجربه خرید بهینه
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-8 text-justify">
                فراهم کردن امکان خرید بهتر و بیشتر در کوتاه‌ترین زمان ممکن با دسترسی انحصاری به تخفیفات ویژه برای اعضای ما.
              </p>
            </div>
            <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100 hover:-translate-y-1 transition-transform duration-300">
              <h3 className="font-bold text-[#1e3a8a] mb-3 flex items-center gap-2 text-lg">
                <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></span>
                توانمندسازی کسب و کار
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-8 text-justify">
                کمک به گسترش کسب و کارهای کوچک و بزرگ از طریق معرفی هدفمند به جامعه کاربران ما و ایجاد فرصت‌های جدید اشتغال‌زایی.
              </p>
            </div>
            <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-100 hover:-translate-y-1 transition-transform duration-300">
              <h3 className="font-bold text-[#1e3a8a] mb-3 flex items-center gap-2 text-lg">
                <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></span>
                ایران‌گردی هوشمند
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-8 text-justify">
                اشتراک‌گذاری اطلاعات کاربردی و مکان‌های دیدنی ایران تا هر سفری به کشف تجربه‌ای نو بدل شود.
              </p>
            </div>
          </div>
        </div>

        {/* بخش ۳: کارت طلایی (طراحی متمایز برای جلب توجه) */}
        <div className="bg-[#1e3a8a] text-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden hover:shadow-blue-900/50 transition-shadow duration-500">
          {/* افکت پس‌زمینه */}
          <div className="absolute top-[-50%] left-[-10%] w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3 relative z-10">
            <Star className="text-yellow-400" size={28} />
            بخش ۳: کارت طلایی؛ کلید ورود به دنیای تخفیف‌ها
          </h2>
          <p className="text-gray-100 leading-9 text-justify mb-5 md:text-lg relative z-10">
            قلب تپنده خدمات ما، <strong className="text-yellow-200">کارت طلایی اعتباری ۷ روزه</strong> است. این کارت نه یک هزینه، بلکه سرمایه‌گذاری کوچک شما برای دسترسی به دنیای تخفیف‌هاست.
          </p>
          <p className="text-gray-100 leading-9 text-justify mb-8 md:text-lg relative z-10">
            تنها با یک آزمون دانش‌محور ساده بر اساس اطلاعاتی که در کانال تلگرام <span className="text-yellow-400 font-bold bg-white/10 px-2 py-1 rounded-md mx-1" dir="ltr">@gerahgosha</span> به اشتراک گذاشته‌ایم، می‌توانید این کارت را دریافت کنید. با پاسخ صحیح، شما می‌توانید در پنل معرفی مشاغل به میزان یک فاکتور خرید از تخفیف هر فروشگاه بسته به نوع تخفیف آن بهره‌مند شوید.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-6 border border-white/20 relative z-10 shadow-inner">
            <h4 className="font-bold text-yellow-400 mb-4 text-lg">نحوه محاسبه مزیت تخفیف:</h4>
            <p className="text-sm md:text-base text-gray-100 leading-8 text-justify mb-6">
              اگر میانگین درصد تخفیف دریافتی شما در طول ۷ روز برابر با <strong className="text-[#1e3a8a] bg-yellow-400 px-2.5 py-0.5 rounded shadow-sm mx-1">D</strong> باشد و مبلغ فاکتور خرید شما <strong className="text-[#1e3a8a] bg-yellow-400 px-2.5 py-0.5 rounded shadow-sm mx-1">P</strong>، ارزش ریالی صرفه‌جویی شما برابر است با:
            </p>
            <div className="flex justify-center mb-6">
               <div className="bg-white text-[#1e3a8a] px-8 py-4 rounded-xl shadow-lg font-mono text-xl md:text-2xl font-extrabold tracking-wider" dir="ltr">
                 S = P × (D / 100)
               </div>
            </div>
            <p className="text-sm md:text-base text-center text-white font-medium bg-black/20 p-4 rounded-xl border border-white/10">
              هدف ما این است که ارزش صرفه‌جویی شما از هزینه دریافت کارت در صورت وجود بیشتر باشد.
            </p>
          </div>
        </div>

        {/* بخش ۴: هیجان و فرصت ها */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-5 flex items-center gap-3">
            <Gift className="text-yellow-500" size={28} />
            بخش ۴: هیجان و فرصت‌های بیشتر
          </h2>
          <p className="text-gray-600 leading-9 text-justify mb-8 md:text-lg">
            در ایساتیس ما به دنبال ایجاد شور و هیجان هستیم. اگر کارت طلایی را دریافت کردید و پیج اینستاگرام ما را دنبال نمودید، وارد قرعه‌کشی هفتگی ما می‌شوید. پیش از هر قرعه‌کشی، جوایز و کمک‌هزینه‌های خرید به طور شفاف اعلام خواهد شد تا فرصت‌های بیشتری برای شما فراهم شود.
          </p>
          
          <div className="bg-purple-50/70 rounded-2xl p-8 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
             <p className="text-purple-900 font-bold text-lg text-center md:text-right">مراحل بعدی برای دریافت کارت طلایی و بهره‌مندی از این مزایا:</p>
             <a href="https://t.me/gerahgosha" target="_blank" rel="noreferrer" className="bg-[#1e3a8a] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-xl flex items-center gap-3 w-full md:w-auto justify-center">
                عضویت در کانال تلگرام
                <span dir="ltr" className="text-yellow-300">@gerahgosha</span>
             </a>
          </div>
        </div>

        {/* فوتر کوچیک درباره ما */}
        <div className="text-center mt-4 bg-white/60 backdrop-blur-md py-6 rounded-[2rem] shadow-sm border border-gray-100">
           <p className="text-lg md:text-2xl font-extrabold text-[#1e3a8a]">موسسه گره‌گشا ایساتیس - همراه شما در مسیر توسعه و کشف.</p>
        </div>

      </div>
    </div>
  );
};

export default About;