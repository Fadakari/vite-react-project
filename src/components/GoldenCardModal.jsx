import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Download, Share2, Sparkles, Store, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import cardTemplateImg from '../assets/card_clean_template.png';

const GoldenCardModal = ({ card, onClose, isLotteryWinner = false }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef(null);

  // بستن مودال با کلید Escape و قفل کردن اسکرول صفحه
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

  if (!card) return null;

  const cardCode = card.code || 'GK-7283-4F9D';
  const createdJalali = card.created_jalali || card.created_at_jalali || '۱۴۰۵/۰۸/۰۹';
  const expiresJalali = card.expires_jalali || card.expires_at_jalali || '۱۴۰۶/۰۸/۰۹';

  const handleCopy = () => {
    navigator.clipboard.writeText(cardCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = cardTemplateImg;

    img.onload = () => {
      ctx.clearRect(0, 0, 1024, 640);
      ctx.drawImage(img, 0, 0, 1024, 640);

      // رسم کد کارت طلایی اختصاصی
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 34px monospace, Vazirmatn, Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cardCode, 380, 335);

      // رسم تاریخ ایجاد شمسی
      ctx.font = 'bold 24px Vazirmatn, Tahoma, Arial';
      ctx.fillText(createdJalali, 262, 435);

      // رسم تاریخ انقضا شمسی
      ctx.fillText(expiresJalali, 530, 435);

      // تولید لینک دانلود تصویر کارت
      const link = document.createElement('a');
      link.download = `Golden-Card-${cardCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloading(false);
    };

    img.onerror = () => {
      setDownloading(false);
      alert('خطا در دانلود تصویر کارت. لطفاً کد را کپی نمایید.');
    };
  };

  const handleShare = async () => {
    const shareData = {
      title: 'کارت طلایی گره‌گشا',
      text: `کارت طلایی تخفیف گره‌گشا با کد اختصاصی: ${cardCode}`,
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-yellow-200/80 p-5 sm:p-7 text-center transform transition-all animate-in zoom-in-95 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن گوشه */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 p-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          title="بستن"
          aria-label="بستن"
        >
          <X size={20} />
        </button>

        {/* سربرگ کارت و نشان تبریک */}
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-100 text-amber-900 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-sm">
            <Sparkles size={14} className="text-amber-600" />
            {isLotteryWinner ? 'واجد شرایط رسمی قرعه‌کشی + دارنده کارت طلایی' : 'کارت طلایی تخفیف گره‌گشا'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
          {isLotteryWinner ? '🎉 تبریک! در قرعه‌کشی ثبت شدید' : '🎁 هدیه ویژه شما آماده شد!'}
        </h2>
        
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4 leading-6">
          {isLotteryWinner 
            ? 'پاسخ شما صحیح بود و حمایت مالی شما ثبت شد. شماره شما در لیست قرعه‌کشی قرار گرفت و کارت طلایی زیر نیز به شما اهدا شد.'
            : 'یک نسخه اختصاصی از کارت طلایی تخفیف با مشخصات زیر به شما اختصاص یافت. با ارائه این کد از تخفیف‌های ویژه اصناف بهره‌مند شوید.'}
        </p>

        {/* کارت طلایی شکیل با المان‌های داینامیک */}
        <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400 aspect-[1024/640] my-2 bg-slate-900 select-none">
          <img 
            src={cardTemplateImg} 
            alt="کارت طلایی گره گشا" 
            className="w-full h-full object-cover"
          />
          
          {/* متن کد داینامیک روی کارت */}
          <div 
            className="absolute top-[51.5%] left-[37%] -translate-x-1/2 -translate-y-1/2 font-mono font-black text-slate-900 tracking-wider text-xs sm:text-base md:text-lg select-all"
            dir="ltr"
          >
            {cardCode}
          </div>

          {/* تاریخ ایجاد شمسی */}
          <div 
            className="absolute top-[67%] left-[25.5%] -translate-y-1/2 font-bold text-slate-900 text-[10px] sm:text-xs md:text-sm"
            dir="rtl"
          >
            {createdJalali}
          </div>

          {/* تاریخ انقضا شمسی */}
          <div 
            className="absolute top-[67%] left-[52%] -translate-y-1/2 font-bold text-slate-900 text-[10px] sm:text-xs md:text-sm"
            dir="rtl"
          >
            {expiresJalali}
          </div>
        </div>

        {/* باکس نمایش برجسته کد اختصاصی */}
        <div className="w-full max-w-[480px] bg-amber-50/70 border border-amber-200 rounded-2xl p-3 sm:p-4 my-3 flex items-center justify-between gap-2">
          <div className="text-right">
            <span className="block text-[11px] text-amber-800 font-bold">کد تخفیف اختصاصی شما:</span>
            <span className="font-mono text-base sm:text-lg font-black text-amber-950 tracking-wider" dir="ltr">
              {cardCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>کپی شد!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>کپی کد</span>
              </>
            )}
          </button>
        </div>

        {/* دکمه‌های اقدام: دانلود، اشتراک‌گذاری، بستن */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-[480px] mt-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 min-w-[150px]"
          >
            <Download size={16} />
            <span>{downloading ? 'در حال آماده‌سازی...' : 'دانلود تصویر باکیفیت کارت'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
            title="اشتراک‌گذاری"
          >
            <Share2 size={16} />
            <span>اشتراک</span>
          </button>

          <Link
            to="/blog"
            onClick={onClose}
            className="bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 border border-blue-200"
          >
            <Store size={16} />
            <span>مشاهده مشاغل دارای تخفیف</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xs font-medium mt-4 hover:underline"
        >
          بستن این پنجره
        </button>

        {/* بوم مخفی Canvas برای تولید خروجی عکس با رزولوشن بالا ۱۰۲۴ در ۶۴۰ */}
        <canvas ref={canvasRef} width="1024" height="640" style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default GoldenCardModal;
