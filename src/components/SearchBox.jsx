import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, AlertCircle, Phone, CreditCard, Sparkles, Gift } from 'lucide-react';
import { fetchActiveQuiz, submitQuizAnswer, startQuizPayment } from '../services/api';
import QuizParticipationModal from './QuizParticipationModal';
import GoldenCardModal from './GoldenCardModal';

// تولید یا بازیابی شناسه یکتای دستگاه/مرورگر جهت جلوگیری از تقلب حتی با تغییر آی‌پی یا سیم‌کارت
function getDeviceFingerprint() {
  try {
    let fp = localStorage.getItem('__gerahgosha_dev_fp');
    if (!fp) {
      const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const navInfo = `${navigator.hardwareConcurrency || 2}_${navigator.language || ''}`;
      const randomPart = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      fp = `dev_${btoa(`${screenInfo}_${tz}_${navInfo}_${randomPart}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 48)}`;
      localStorage.setItem('__gerahgosha_dev_fp', fp);
    }
    return fp;
  } catch (e) {
    return 'fallback_' + Math.random().toString(36).substring(2, 15);
  }
}

const SearchBox = () => {
  // سوال و گزینه‌های پیش‌فرض در صورت آفلاین بودن سرور
  const [quiz, setQuiz] = useState({
    id: 1,
    title: 'مهمترین آثار تاریخی جهان در ایران چه نام دارد؟',
    options: [
      { id: 1, text: 'تخت جمشید (پرسپولیس)' },
      { id: 2, text: 'میدان نقش جهان' },
    ],
  });

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  // وضعیت‌های مودال‌ها
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false);
  const [isGoldenCardModalOpen, setIsGoldenCardModalOpen] = useState(false);
  const [issuedCard, setIssuedCard] = useState(null);

  // بازیابی کارت قبلی کاربر از حافظه مرورگر در صورت وجود
  useEffect(() => {
    try {
      const savedCard = localStorage.getItem('__gerahgosha_saved_card');
      if (savedCard) {
        setIssuedCard(JSON.parse(savedCard));
      }
    } catch (e) {}
  }, []);

  // تبدیل خودکار اعداد فارسی و عربی به انگلیسی
  const toEnglishDigits = (str) => {
    const persian = '۰۱۲۳۴۵۶۷۸۹';
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    let output = String(str || '');
    for (let i = 0; i < 10; i++) {
      output = output.replace(new RegExp(persian[i], 'g'), i);
      output = output.replace(new RegExp(arabic[i], 'g'), i);
    }
    return output;
  };

  // دریافت سوال فعال مسابقه و گزینه‌های پویای آن از سرور
  useEffect(() => {
    async function loadQuiz() {
      const data = await fetchActiveQuiz();
      if (data && data.active && data.quiz && data.quiz.options && data.quiz.options.length > 0) {
        setQuiz(data.quiz);
      }
    }
    loadQuiz();
  }, []);

  // اعتبارسنجی زنده شماره تماس
  const handlePhoneChange = (e) => {
    let val = toEnglishDigits(e.target.value).replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    setPhoneNumber(val);

    if (!val) {
      setPhoneError('');
      return;
    }

    if (!val.startsWith('09')) {
      setPhoneError('شماره تماس حتماً باید با 09 شروع شود (از وارد کردن +98 خودداری کنید).');
    } else if (val.length < 11) {
      setPhoneError(`شماره باید ۱۱ رقم باشد (${val.length} از ۱۱ رقم وارد شده)`);
    } else {
      setPhoneError('');
    }
  };

  // کلیک اولیه روی ثبت: اعتبارسنجی فرم و باز کردن مودال تایید و پرداخت
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setResultMessage(null);

    // ۱. بررسی انتخاب گزینه
    if (!selectedOptionId) {
      setResultMessage({
        type: 'error',
        text: 'لطفاً یکی از گزینه‌ها را برای پاسخ به سوال مسابقه انتخاب کنید.',
      });
      return;
    }

    // ۲. بررسی شماره تماس
    const cleanPhone = toEnglishDigits(phoneNumber).trim();
    if (!/^09\d{9}$/.test(cleanPhone)) {
      setPhoneError('شماره تماس باید دقیقاً ۱۱ رقم و با 09 شروع شود (مثال: 09123456789)');
      setResultMessage({
        type: 'error',
        text: 'شماره تماس وارد شده معتبر نیست.',
      });
      return;
    }

    // باز کردن مودال تایید نهایی و پرداخت
    setIsParticipationModalOpen(true);
  };

  // پرداخت دونیت و ثبت پاسخ در درگاه
  const handleDonateAndPay = async (amountInRials) => {
    setLoading(true);
    setResultMessage(null);
    try {
      const fingerprint = getDeviceFingerprint();
      const res = await startQuizPayment({
        question_id: quiz.id,
        option_id: selectedOptionId,
        phone_number: toEnglishDigits(phoneNumber).trim(),
        device_fingerprint: fingerprint,
        amount: amountInRials,
      });

      if (res.payment_type === 'sep' && res.token && res.payment_url) {
        // ایجاد فرم خودکار انتقال به درگاه سامان
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = res.payment_url;
        
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'Token';
        tokenInput.value = res.token;
        form.appendChild(tokenInput);

        const getMethodInput = document.createElement('input');
        getMethodInput.type = 'hidden';
        getMethodInput.name = 'GetMethod';
        getMethodInput.value = 'true';
        form.appendChild(getMethodInput);

        document.body.appendChild(form);
        form.submit();
      } else if (res.redirect_url) {
        // انتقال به شبیه‌ساز پرداخت تستی یا آدرس مستقیم
        const fullUrl = res.redirect_url.startsWith('http') 
          ? res.redirect_url 
          : `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${res.redirect_url}`;
        window.location.href = fullUrl;
      }
    } catch (err) {
      setLoading(false);
      setIsParticipationModalOpen(false);
      setResultMessage({
        type: 'error',
        text: err.message || 'خطا در اتصال به درگاه پرداخت.',
      });
    }
  };

  const selectedOptionText = quiz.options.find(o => o.id === selectedOptionId)?.text || '';

  return (
    <div className="w-full flex justify-center px-2 sm:px-4" dir="rtl">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-5 sm:p-8 transition-all">
        
        {/* سربرگ مسابقه */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3 text-right w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-amber-200 flex-shrink-0">
              <Trophy size={24} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Sparkles size={12} />
                  مسابقه و قرعه‌کشی جوایز ویژه
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#1e3a8a] mt-1 leading-snug">
                {quiz.title}
              </h3>
            </div>
          </div>

          {/* اگر کاربر قبلاً کارت گرفته، دکمه مشاهده سریع کارت */}
          {issuedCard && (
            <button
              type="button"
              onClick={() => setIsGoldenCardModalOpen(true)}
              className="bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-xs font-extrabold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-amber-300 shadow-sm"
            >
              <Gift size={15} className="text-amber-700" />
              <span>مشاهده کارت طلایی من ({issuedCard.code})</span>
            </button>
          )}
        </div>

        {/* فرم شرکت در مسابقه */}
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          
          {/* لیست گزینه‌های پویا */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3">
              گزینه صحیح را انتخاب کنید:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quiz.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 flex items-center justify-between group ${
                      isSelected
                        ? 'border-[#1e3a8a] bg-blue-50/70 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 bg-gray-50/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        isSelected 
                          ? 'bg-[#1e3a8a] text-white shadow-sm' 
                          : 'bg-white text-gray-500 border border-gray-200 group-hover:border-blue-300'
                      }`}>
                        {(idx + 1).toLocaleString('fa-IR')}
                      </span>
                      <span className={`text-xs sm:text-sm font-bold ${
                        isSelected ? 'text-[#1e3a8a]' : 'text-gray-700'
                      }`}>
                        {option.text}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#1e3a8a] bg-[#1e3a8a]' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* فیلد شماره تماس */}
          <div className="max-w-md mx-auto sm:mx-0">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
              شماره همراه شرکت‌کننده (جهت قرعه‌کشی و صدور کارت):
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                inputMode="numeric"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="09123456789"
                maxLength={11}
                className={`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 pr-11 text-xs sm:text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                  phoneError ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-[#1e3a8a]'
                }`}
              />
              <Phone size={18} className="absolute right-3.5 top-3.5 text-gray-400" />
            </div>
            {phoneError ? (
              <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={13} />
                {phoneError}
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">
                شماره باید حتماً با <span className="font-bold text-gray-600">09</span> شروع شود (۱۱ رقم کامل).
              </p>
            )}
          </div>

          {/* پیام نتیجه یا خطا */}
          {resultMessage && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-in fade-in ${
              resultMessage.type === 'success' 
                ? 'bg-green-50 text-green-900 border border-green-200' 
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              {resultMessage.type === 'success' ? (
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-6">{resultMessage.text}</span>
            </div>
          )}

          {/* دکمه ارسال پاسخ و باز کردن مرحله بعد */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <span className="text-[11px] text-gray-400 text-center sm:text-right">
              🎁 با پرداخت آنلاین حمایت مالی ۱۵,۰۰۰ تومان، در قرعه‌کشی رسمی شرکت کرده و کارت طلایی تخفیف ۱ ساله دریافت کنید.
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-blue-900 text-white font-extrabold py-3.5 px-8 rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Trophy size={16} className="text-yellow-400 group-hover:scale-110 transition-transform" />
              <span>ثبت پاسخ و ادامه</span>
            </button>
          </div>

        </form>

      </div>

      {/* ۱. مودال تایید و پرداخت */}
      {isParticipationModalOpen && (
        <QuizParticipationModal
          questionTitle={quiz.title}
          selectedOptionText={selectedOptionText}
          phoneNumber={phoneNumber}
          loading={loading}
          onDonateAndPay={handleDonateAndPay}
          onClose={() => setIsParticipationModalOpen(false)}
        />
      )}

      {/* ۲. مودال کارت طلایی تخفیف اختصاصی */}
      {isGoldenCardModalOpen && issuedCard && (
        <GoldenCardModal
          card={issuedCard}
          onClose={() => setIsGoldenCardModalOpen(false)}
        />
      )}

    </div>
  );
};

export default SearchBox;
