import React from 'react';
import { X, CreditCard, Sparkles, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const QuizParticipationModal = ({ 
  questionTitle, 
  selectedOptionText, 
  phoneNumber, 
  onDonateAndPay, 
  onClose,
  loading 
}) => {
  // مبلغ ثابت دونیت دقیقاً طبق سورس کد درگاه سامان: ۱۵۰,۰۰۰ ریال (معادل ۱۵,۰۰۰ تومان)
  const EXACT_DONATE_AMOUNT_TOMAN = 15000;
  const EXACT_DONATE_AMOUNT_RIALS = 150000;

  const handlePayClick = () => {
    onDonateAndPay(EXACT_DONATE_AMOUNT_RIALS);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[94vh] overflow-y-auto border border-gray-100 p-5 sm:p-7 text-right transform transition-all animate-in zoom-in-95 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 left-4 z-20 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 p-2.5 rounded-full transition-all duration-200"
          title="انصراف"
          aria-label="بستن"
        >
          <X size={18} />
        </button>

        {/* سربرگ مودال */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-2.5 shadow-inner">
            <Sparkles size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1e3a8a] mb-1">
            تأیید پاسخ و شرکت در مسابقه
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            جهت ثبت پاسخ، شرکت در قرعه‌کشی و دریافت کارت طلایی تخفیف
          </p>
        </div>

        {/* جعبه خلاصه اطلاعات شرکت‌کننده */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-gray-500">پاسخ انتخابی شما:</span>
            <span className="font-bold text-[#1e3a8a]">«{selectedOptionText}»</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-gray-500">شماره همراه شرکت‌کننده:</span>
            <span className="font-mono font-bold text-gray-800" dir="ltr">{phoneNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold">مبلغ حمایت مالی (دونیت):</span>
            <span className="font-black text-green-700 text-base">
              {EXACT_DONATE_AMOUNT_TOMAN.toLocaleString('fa-IR')} تومان
              <span className="text-[11px] text-gray-400 font-normal mr-1">({EXACT_DONATE_AMOUNT_RIALS.toLocaleString('fa-IR')} ریال)</span>
            </span>
          </div>
        </div>

        {/* قوانین و مزایای بعد از پرداخت */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-5 space-y-2.5">
          <div className="text-xs font-black text-amber-900 mb-1 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-amber-700" />
            <span>نحوه محاسبه و شرایط دریافت جوایز:</span>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-gray-700 leading-5">
            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <b className="text-green-800">در صورت پاسخ صحیح:</b> نام شما رسماً در لیست قرعه‌کشی جوایز ویژه ثبت شده و <b>کارت طلایی تخفیف ۱ ساله</b> نیز تقدیم شما خواهد شد.
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-700 leading-5">
            <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <b className="text-amber-800">در صورت پاسخ نادرست:</b> در قرعه‌کشی شرکت داده نمی‌شوید اما به پاس حمایت شما، <b>کارت طلایی تخفیف ۱ ساله</b> به شما اهدا می‌گردد.
            </span>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-gray-500 leading-4 pt-1 border-t border-amber-200/60">
            <AlertCircle size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span>در صورت عدم پرداخت، هیچ‌گونه اطلاعاتی ثبت نمی‌شود و کارتی صادر نخواهد شد.</span>
          </div>
        </div>

        {/* دکمه‌های اقدام: پرداخت آنلاین و انصراف */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={handlePayClick}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold py-3.5 px-5 rounded-2xl text-sm shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>در حال انتقال به درگاه شاپرک سامان...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} />
                <span>پرداخت آنلاین ۱۵,۰۰۰ تومان و ثبت نهایی</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all text-center"
          >
            انصراف و بازگشت
          </button>
        </div>

        {/* نشان امنیت */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-gray-400" />
            <span>اتصال مستقیم و امن به درگاه رسمی شاپرک (بانک سامان)</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default QuizParticipationModal;
