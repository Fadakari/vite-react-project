import React from 'react';
import { Shield, BookOpen, AlertCircle, Scale, FileText, CheckCircle, RefreshCw } from 'lucide-react';

const Terms = () => {
  return (
    <div className="pt-24 md:pt-[14rem] w-full container mx-auto px-4 max-w-4xl pb-20">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a] mb-4">شرایط استفاده از خدمات گره‌گشا ایساتیس</h1>
        <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full mb-6 shadow-sm"></div>
        <p className="text-gray-700 md:text-lg font-medium bg-white/60 inline-block px-8 py-3 rounded-full shadow-sm backdrop-blur-sm border border-gray-100 leading-8">
          این سند شرایط و قوانین استفاده از خدمات موسسه گره گشا ایساتیس شامل کارت طلایی اعتباری خدمات تخفیف قرعه کشی و اطلاعات گردشگری را مشخص میکند.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Section 1 */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
            <BookOpen className="text-yellow-500" size={24} /> ۱.تعاریف و مقدمه
          </h2>
          <ul className="space-y-4 text-gray-600 leading-8">
            <li><strong className="text-gray-800">موسسه:</strong> ما موسسه گره گشا ایساتیس فعال در زمینه توسعه کسب و کار اشتغال زایی و ارائه خدمات اطلاعاتی / تخفیفی</li>
            <li><strong className="text-gray-800">کاربر / شما:</strong> هر شخص حقیقی یا حقوقی که از خدمات کارت اعتباری یا شرکت در قرعه کشیهای موسسه استفاده میکند.</li>
            <li><strong className="text-gray-800">کارت طلایی اعتباری (کارت):</strong> کارت اعتباری ۷ روزه که به کاربر اجازه دریافت تخفیف ویژه از مشاغل همکار را میدهد.</li>
            <li><strong className="text-gray-800">مشاغل همکار (پنل):</strong> کسب و کارهایی که با موسسه قرارداد داشته و متعهد به ارائه تخفیف به دارندگان کارت هستند.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
            <CheckCircle className="text-yellow-500" size={24} /> ۲. شرایط عمومی استفاده از خدمات
          </h2>
          <ul className="space-y-3 text-gray-600 leading-8 list-disc list-inside">
            <li>کاربر با استفاده از هر یک از خدمات موسسه این شرایط و قوانین را پذیرفته و متعهد به رعایت آنها است.</li>
            <li>استفاده از خدمات به معنای تایید صحت اطلاعات هویتی ارائه شده توسط کاربر است.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
            <FileText className="text-yellow-500" size={24} /> ۳.کارت طلایی اعتباری ۷ روزه
          </h2>
          <ul className="space-y-4 text-gray-600 leading-8">
            <li><strong className="text-gray-800">مدت اعتبار:</strong> کارت تنها به مدت ۷ روز متوالی از تاریخ فعال سازی یا خرید معتبر بوده و پس از آن فاقد هرگونه ارزش تخفیفی خواهد بود.</li>
            <li><strong className="text-gray-800">میزان تخفیف:</strong> میزان تخفیف ارائه شده توسط هر یک از مشاغل همکار، صرفاً مطابق با توافق آن کسب و کار با موسسه است و ممکن است متغیر باشد موسسه در قبال عدم ارائه تخفیف یا ارائه تخفیف کمتر از حد انتظار توسط مشاغل همکار مسئولیتی ندارد.</li>
            <li><strong className="text-gray-800">انتقال:</strong> کارت طلایی اعتباری شخصی بوده و قابل انتقال به غیر نمی باشد.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-[#1e3a8a] mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
            <AlertCircle className="text-yellow-500" size={24} /> ۴. قرعه‌کشی‌ها و جوایز
          </h2>
          <ul className="space-y-4 text-gray-600 leading-8 list-disc list-inside">
            <li><strong className="text-gray-800">شرایط شرکت:</strong> تنها کاربرانی که به سؤالی که در چارچوب مسابقات آنلاین مطرح میشود پاسخ صحیح دهند مجاز به شرکت در قرعه کشی هستند.</li>
            <li><strong className="text-gray-800">نحوه برگزاری:</strong> قرعه کشیها به صورت آنلاین و تصادفی (رندوم) در صفحه اینستاگرام موسسه به آدرس gerahgosha و در زمان مقرر اعلام شده انجام خواهد شد.</li>
            <li><strong className="text-gray-800">اعطای جوایز:</strong> جوایز و کمک هزینه های اعلام شده در هر مسابقه به برندگان اهدا خواهد شد.</li>
            <li><strong className="text-gray-800">مهلت استفاده:</strong> برندگان موظف هستند ظرف مدت ۵ روز پس از اعلام نتایج برای دریافت یا استفاده از جایزه خود اقدام نمایند در صورت عدم مراجعه در این مهلت جایزه مسقطه تلقی شده و حق اعتراض برای برنده وجود نخواهد داشت.</li>
            <li>موسسه حق تغییر زمان یا شرایط قرعه کشی را با اطلاع رسانی قبلی در کانالهای رسمی خود محفوظ می دارد.</li>
          </ul>
        </div>

        {/* Section 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50/60 rounded-[2rem] p-8 shadow-sm border border-blue-100 hover:-translate-y-1 transition-transform">
                <h2 className="text-lg font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
                    <Shield className="text-blue-500" size={20} /> ۵. اطلاعات گردشگری
                </h2>
                <p className="text-gray-600 leading-8 text-justify text-sm">
                    موسسه اطلاعاتی در مورد تاریخ و مکانهای دیدنی ایران را گردآوری و منتشر مینماید.اگرچه ما تلاش میکنیم تا حد امکان دقیق باشیم اما این اطلاعات صرفاً جنبه عمومی و ترویجی داشته و نباید به عنوان مرجع قطعی و علمی تلقی گردند موسسه مسئولیتی در قبال صحت مطلق و کامل تاریخی اطلاعات ارائه شده ندارد.
                </p>
            </div>

            <div className="bg-blue-50/60 rounded-[2rem] p-8 shadow-sm border border-blue-100 hover:-translate-y-1 transition-transform">
                <h2 className="text-lg font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
                    <Shield className="text-blue-500" size={20} /> ۶. محدودیت‌ها
                </h2>
                <ul className="space-y-3 text-gray-600 leading-8 text-sm list-disc list-inside">
                    <li>موسسه صرفاً نقش تسهیل کننده پلی میان خریدار و مشاغل را ایفا میکند.مسئولیت کیفیت ایمنی یا انطباق کالا / خدمات ارائه شده توسط مشاغل همکار کاملاً بر عهده همان مشاغل است.</li>
                    <li>موسسه تضمینی برای اشتغال زایی یا موفقیت کسب و کار کاربرانی که از خدمات مشاوره موسسه استفاده میکنند ارائه نمی دهد.</li>
                </ul>
            </div>
        </div>

        {/* Section 7 - Footer of terms */}
        <div className="bg-[#1e3a8a] text-white rounded-[2rem] p-8 shadow-xl mt-4 relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
               <div>
                  <h2 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                     <RefreshCw size={20} /> تغییرات در قوانین
                  </h2>
                  <p className="text-gray-100 leading-8 text-justify text-sm">
                     موسسه حق دارد در هر زمان این قوانین را اصلاح نماید اعمال تغییرات با انتشار نسخه به روز شده در وب سایت موسسه صورت میگیرد و استفاده مستمر کاربر به معنای پذیرش تغییرات است.
                  </p>
               </div>
               <div>
                  <h2 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                     <Scale size={20} /> قانون حاکم
                  </h2>
                  <p className="text-gray-100 leading-8 text-justify text-sm">
                     قوانین جمهوری اسلامی ایران حاکم بر این قرارداد بوده و در صورت بروز هرگونه اختلاف مرجع رسیدگی صالح مراجع ذی صلاح ایران خواهند بود.
                  </p>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;