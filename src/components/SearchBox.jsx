import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, AlertCircle, Phone, CreditCard, Sparkles } from 'lucide-react';
import { fetchActiveQuiz, submitQuizAnswer } from '../services/api';

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

// بررسی صحت الگوریتم ریاضی کد ملی ایران
function isValidNationalCode(code) {
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false; // ارقام یکسان مثل ۱۱۱۱۱۱۱۱۱۱
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code.charAt(i), 10) * (10 - i);
  }
  const remainder = sum % 11;
  const lastDigit = parseInt(code.charAt(9), 10);
  return remainder < 2 ? lastDigit === remainder : lastDigit === (11 - remainder);
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
  const [nationalCode, setNationalCode] = useState('');
  const [nationalCodeError, setNationalCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null); // { type: 'success' | 'error', text: '' }

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
    let val = toEnglishDigits(e.target.value).replace(/\D/g, ''); // فقط ارقام انگلیسی
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

  // اعتبارسنجی زنده کد ملی
  const handleNationalCodeChange = (e) => {
    let val = toEnglishDigits(e.target.value).replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    setNationalCode(val);

    if (!val) {
      setNationalCodeError('');
      return;
    }

    if (val.length < 10) {
      setNationalCodeError(`کد ملی باید ۱۰ رقم باشد (${val.length} از ۱۰ رقم وارد شده)`);
    } else if (!isValidNationalCode(val)) {
      setNationalCodeError('کد ملی وارد شده با فرمول استاندارد همخوانی ندارد.');
    } else {
      setNationalCodeError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultMessage(null);

    // ۱. بررسی انتخاب گزینه
    if (!selectedOptionId) {
      setResultMessage({
        type: 'error',
        text: 'لطفاً یکی از گزینه‌ها را برای پاسخ به سوال انتخاب کنید.',
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

    // ۳. بررسی کد ملی
    const cleanNationalCode = toEnglishDigits(nationalCode).trim();
    if (!isValidNationalCode(cleanNationalCode)) {
      setNationalCodeError('لطفاً کد ملی ۱۰ رقمی معتبر را وارد کنید.');
      setResultMessage({
        type: 'error',
        text: 'کد ملی وارد شده نامعتبر است.',
      });
      return;
    }

    setLoading(true);
    try {
      const fingerprint = getDeviceFingerprint();
      const res = await submitQuizAnswer({
        question_id: quiz.id,
        option_id: selectedOptionId,
        phone_number: cleanPhone,
        national_code: cleanNationalCode,
        device_fingerprint: fingerprint,
      });

      // پیام بی‌طرفانه بدون فاش کردن درستی یا نادرستی پاسخ
      setResultMessage({
        type: 'success',
        text: res.message || 'پاسخ شما با موفقیت ثبت شد. در صورت صحت پاسخ، اطلاعات شما در لیست قرعه‌کشی قرار خواهد گرفت.',
      });
    } catch (err) {
      setResultMessage({
        type: 'error',
        text: err.message || 'امکان ثبت پاسخ وجود ندارد. لطفاً اطلاعات ارسالی را بررسی کنید.',
      });
    } finally {
      setLoading(false);
    }
  };

  const optionsList = quiz.options && quiz.options.length > 0 ? quiz.options : [];

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 w-full max-w-3xl mx-auto shadow-xl border border-blue-50 transition-all duration-300" dir="rtl">
      
      {/* سربرگ مسابقه */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="bg-yellow-400/20 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-yellow-300">
          <Trophy size={14} className="text-yellow-600" />
          مسابقه و قرعه‌کشی هفتگی
        </span>
      </div>

      <h2 className="text-center text-lg md:text-2xl font-extrabold text-[#1e3a8a] mb-6 leading-relaxed">
        {quiz.title}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* گزینه‌های پویا (هر تعداد که ادمین تعیین کرده باشد) */}
        <div className={`grid gap-3.5 ${optionsList.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {optionsList.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => { setSelectedOptionId(option.id); setResultMessage(null); }}
                className={`p-4 rounded-2xl border-2 text-right transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'border-[#1e3a8a] bg-blue-50/80 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isSelected ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-bold text-sm md:text-base text-gray-800">
                    {option.text}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-[#1e3a8a] bg-[#1e3a8a]' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* فیلدهای شماره موبایل و کد ملی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* فیلد شماره موبایل */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Phone size={14} className="text-[#1e3a8a]" />
              <span>شماره موبایل (الزامی):</span>
            </label>
            
            <input 
              type="text" 
              inputMode="numeric"
              required
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="09123456789"
              className={`w-full bg-white rounded-xl px-4 py-3 text-left font-mono text-base tracking-wider outline-none transition border shadow-sm ${
                phoneError 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100'
              }`}
              dir="ltr"
            />

            {phoneError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle size={13} className="flex-shrink-0" />
                <span>{phoneError}</span>
              </p>
            )}
          </div>

          {/* فیلد کد ملی */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#1e3a8a]" />
              <span>کد ملی ۱۰ رقمی (جهت احراز قرعه‌کشی):</span>
            </label>
            
            <input 
              type="text" 
              inputMode="numeric"
              required
              value={nationalCode}
              onChange={handleNationalCodeChange}
              placeholder="0012345678"
              className={`w-full bg-white rounded-xl px-4 py-3 text-left font-mono text-base tracking-wider outline-none transition border shadow-sm ${
                nationalCodeError 
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100'
              }`}
              dir="ltr"
            />

            {nationalCodeError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle size={13} className="flex-shrink-0" />
                <span>{nationalCodeError}</span>
              </p>
            )}
          </div>

        </div>

        {/* هشدار مهم شرایط مسابقه */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-xs leading-5">
          <strong>⚠️ توجه:</strong> شماره تماس حتماً باید با <strong>09</strong> شروع شود و کد ملی باید متعلق به شرکت‌کننده باشد. در زمان اهدای جایزه، کارت ملی فرد برنده استعلام و تطبیق داده خواهد شد. هر کاربر تنها یک‌بار مجاز به ثبت پاسخ در این دوره مسابقه است.
        </div>

        {/* نمایش پیام نتیجه ثبت */}
        {resultMessage && (
          <div className={`p-4 rounded-2xl text-sm leading-6 flex items-start gap-2.5 transition-all ${
            resultMessage.type === 'success'
              ? 'bg-blue-50 text-[#1e3a8a] border border-blue-200 shadow-sm'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {resultMessage.type === 'success' ? (
              <CheckCircle2 size={20} className="text-[#1e3a8a] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}

        {/* دکمه ارسال پاسخ */}
        <div className="flex justify-center mt-1">
          <button 
            type="submit"
            disabled={loading || !selectedOptionId || !!phoneError || phoneNumber.length !== 11 || !!nationalCodeError || nationalCode.length !== 10}
            className={`w-full sm:w-auto min-w-[220px] rounded-xl px-10 py-3.5 font-bold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              loading || !selectedOptionId || !!phoneError || phoneNumber.length !== 11 || !!nationalCodeError || nationalCode.length !== 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-[#1e3a8a] hover:bg-blue-800 text-white hover:shadow-xl active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span>در حال ثبت...</span>
            ) : (
              <>
                <Sparkles size={18} />
                <span>ثبت پاسخ و شرکت در قرعه‌کشی</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default SearchBox;