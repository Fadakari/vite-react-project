import React, { useEffect, useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Instagram, 
  Globe, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Navigation, 
  Calendar,
  Tag,
  Store
} from 'lucide-react';

const JobDetailModal = ({ job, onClose }) => {
  const [copiedType, setCopiedType] = useState(null); // 'phone' | 'address' | 'link' | null

  // بستن مودال با فشردن کلید Escape و قفل کردن اسکرول صفحه
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!job) return null;

  const jobImage = job.image_url || job.image || null;

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: job.title,
      text: `مشاهده مشخصات ${job.title} در سامانه گره‌گشا ایساتیس`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      handleCopy(window.location.href, 'link');
    }
  };

  const cleanInsta = job.instagram ? job.instagram.replace(/^@/, '').trim() : '';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-gray-100 transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن گوشه */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-200/50"
          title="بستن"
          aria-label="بستن"
        >
          <X size={20} />
        </button>

        {/* تصویر بالای مودال */}
        <div className="relative w-full h-52 sm:h-64 bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#31306b] flex-shrink-0 overflow-hidden">
          {jobImage ? (
            <>
              <img 
                src={jobImage} 
                alt={job.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/90 p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner border border-white/20">
                <Store size={36} className="text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-blue-100">سامانه خدمات و مشاغل گره‌گشا</span>
            </div>
          )}

          {/* نشان‌های روی تصویر */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
            {job.category_name && (
              <span className="bg-[#1e3a8a]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                <Tag size={12} className="text-yellow-400" />
                {job.category_name}
              </span>
            )}
            {job.is_featured && (
              <span className="bg-yellow-400 text-[#1e3a8a] text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <Sparkles size={13} />
                پیشنهاد ویژه
              </span>
            )}
          </div>

          {/* عنوان شغل روی بنر (پایین تصویر) */}
          <div className="absolute bottom-4 right-4 left-4 z-10 text-white">
            <h2 className="text-xl sm:text-2xl font-black drop-shadow-md leading-tight text-white mb-1">
              {job.title}
            </h2>
            <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* محتوای داخلی مودال */}
        <div className="p-5 sm:p-7 space-y-6 flex-1 bg-white">

          {/* ۱. بخش توضیحات کامل کسب‌وکار */}
          <div className="bg-blue-50/50 rounded-2xl p-4 sm:p-5 border border-blue-100/70">
            <h3 className="text-sm font-extrabold text-[#1e3a8a] mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
              معرفی و شرح خدمات
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-7 sm:leading-8 whitespace-pre-line text-justify">
              {job.description || 'توضیحات تکمیلی برای این کسب‌وکار درج نشده است.'}
            </p>
          </div>

          {/* ۲. بخش اطلاعات تماس و راه‌های ارتباطی */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
              اطلاعات تماس و دسترسی سریع
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* دکمه تماس مستقیم */}
              {job.phone ? (
                <div className="bg-green-50 hover:bg-green-100/80 transition-colors border border-green-200/80 rounded-2xl p-4 flex flex-col justify-between gap-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-800 flex items-center gap-1.5">
                      <Phone size={15} className="text-green-600" />
                      شماره تماس
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(job.phone, 'phone')}
                      className="text-xs text-green-700 hover:text-green-900 bg-white/80 px-2 py-1 rounded-lg border border-green-200 flex items-center gap-1 transition-all"
                      title="کپی شماره"
                    >
                      {copiedType === 'phone' ? (
                        <>
                          <Check size={13} className="text-green-600" />
                          <span className="font-bold">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>کپی</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a 
                    href={`tel:${job.phone.replace(/[^0-9+]/g, '')}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                    dir="ltr"
                  >
                    <Phone size={16} className="animate-pulse" />
                    <span>{job.phone}</span>
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center text-xs text-gray-500 flex items-center justify-center">
                  شماره تماس مستقیم ثبت نشده است
                </div>
              )}

              {/* دکمه اینستاگرام */}
              {cleanInsta ? (
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border border-pink-200/70 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                      <Instagram size={16} className="text-pink-600" />
                      پیج اینستاگرام
                    </span>
                    <span className="text-[11px] text-gray-500" dir="ltr">@{cleanInsta}</span>
                  </div>

                  <a 
                    href={`https://instagram.com/${cleanInsta}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Instagram size={17} />
                    <span>مشاهده صفحه اینستاگرام</span>
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center text-xs text-gray-500 flex items-center justify-center">
                  صفحه اینستاگرام ثبت نشده است
                </div>
              )}
            </div>

            {/* نشانی و آدرس حضوری */}
            {job.address && (
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <MapPin size={16} className="text-amber-600" />
                    نشانی و آدرس مراجعه حضوری
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(job.address, 'address')}
                    className="text-xs text-amber-800 hover:text-amber-950 bg-white/80 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1 transition-all"
                    title="کپی آدرس"
                  >
                    {copiedType === 'address' ? (
                      <>
                        <Check size={13} className="text-green-600" />
                        <span className="font-bold text-green-700">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>کپی آدرس</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-gray-800 text-xs sm:text-sm leading-6">
                  {job.address}
                </p>

                {/* دکمه باز کردن نقشه و مسیریابی */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.title + ' ' + job.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300/80 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Navigation size={13} />
                  <span>مسیریابی در نقشه</span>
                </a>
              </div>
            )}

            {/* آدرس وبسایت */}
            {job.website && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Globe size={16} className="text-blue-600" />
                  <span>وبسایت رسمی:</span>
                </div>
                <a 
                  href={job.website.startsWith('http') ? job.website : `https://${job.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  dir="ltr"
                >
                  <span>{job.website.replace(/^https?:\/\//, '')}</span>
                  <Globe size={13} />
                </a>
              </div>
            )}
          </div>

          {/* ۳. بخش فوتر مودال: اشتراک‌گذاری و دکمه بستن */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-700 bg-gray-100 hover:bg-blue-50 px-3.5 py-2.5 rounded-xl transition-all border border-gray-200/60"
            >
              {copiedType === 'link' ? (
                <>
                  <Check size={15} className="text-green-600" />
                  <span className="text-green-700 font-bold">لینک کپی شد</span>
                </>
              ) : (
                <>
                  <Share2 size={15} />
                  <span>اشتراک‌گذاری این کسب‌وکار</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-xl shadow-md transition-all"
            >
              بستن پنجره
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
