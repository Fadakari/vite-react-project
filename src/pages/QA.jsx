import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Send, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { fetchFaqs, fetchQuestions, submitQuestion } from '../services/api';

const QA = () => {
  const [faqs, setFaqs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [loading, setLoading] = useState(true);

  // فرم ثبت سوال
  const [formData, setFormData] = useState({
    full_name: '',
    contact_info: '',
    subject: '',
    question: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  // سوالات پیش‌فرض برای زمانی که بک‌اند در دسترس نیست
  const defaultFaqs = [
    {
      id: 1,
      question: 'چگونه می‌توانم کسب‌وکار خود را در گره‌گشا ثبت کنم؟',
      answer: 'کافیست از طریق فرم تماس با ما یا تماس تلفنی با شماره ۰۳۵۳۵۲۲۸۰۴۹ با کارشناسان ما تماس بگیرید تا مشخصات و تصاویر کسب‌وکار شما در سریع‌ترین زمان ثبت شود.',
    },
    {
      id: 2,
      question: 'آیا معرفی و درج اطلاعات مشاغل هزینه دارد؟',
      answer: 'معرفی اولیه مشاغل در جهت حمایت از کسب‌وکارهای بومی رایگان است. بسته‌های ویژه تبلیغاتی و جایگاه‌های اختصاصی نیز طبق تعرفه‌های مصوب ارائه می‌شوند.',
    },
    {
      id: 3,
      question: 'ساعات کاری و پاسخگویی تلفنی موسسه به چه صورت است؟',
      answer: 'کارشناسان ما در روزهای کاری از ساعت ۸ صبح الی ۱۴ و عصرها از ۱۷ الی ۲۰ پاسخگوی سوالات شما هستند.',
    },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [faqsData, questionsData] = await Promise.all([
        fetchFaqs(),
        fetchQuestions(),
      ]);

      if (faqsData && faqsData.length > 0) {
        setFaqs(faqsData);
      } else {
        setFaqs(defaultFaqs);
      }

      if (questionsData && questionsData.length > 0) {
        setQuestions(questionsData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess('');
    setSubmitError('');

    if (!formData.full_name || !formData.contact_info || !formData.question) {
      setSubmitError('لطفاً نام، شماره تماس و متن سوال را وارد کنید.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitQuestion(formData);
      setSubmitSuccess(res.message || 'پرسش شما با موفقیت ثبت شد!');
      setFormData({ full_name: '', contact_info: '', subject: '', question: '' });
    } catch (err) {
      setSubmitError(err.message || 'خطا در برقراری ارتباط با سرور.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 md:pt-[13rem] w-full container mx-auto px-4 max-w-5xl pb-24" dir="rtl">
      
      {/* سربرگ صفحه */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1e3a8a] text-xs md:text-sm font-bold px-4 py-1.5 rounded-full mb-3 border border-blue-100 shadow-sm">
          <Sparkles size={16} />
          مرکز پاسخگویی و مشاوره
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#1e3a8a] mb-3">سوال و جواب و مشاوره</h1>
        <div className="w-20 h-1.5 bg-yellow-400 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          پاسخ به سوالات پرتکرار و امکان مطرح کردن سوالات اختصاصی شما از کارشناسان موسسه گره‌گشا
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ستون راست: سوالات متداول و سوالات کاربران */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* بخش سوالات متداول */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                <HelpCircle size={22} />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">سوالات متداول (FAQ)</h2>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, index) => {
                const isOpen = activeAccordion === index;
                return (
                  <div
                    key={faq.id || index}
                    className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => setActiveAccordion(isOpen ? null : index)}
                      className="w-full text-right p-4 flex justify-between items-center gap-4 bg-gray-50/70 hover:bg-blue-50/50 transition"
                    >
                      <span className="font-semibold text-gray-800 text-sm md:text-base leading-6">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="text-[#1e3a8a] flex-shrink-0" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-gray-600 text-sm leading-7 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* بخش سوالات عمومی تایید شده کاربران */}
          {questions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                  <MessageSquare size={22} />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">پرسش و پاسخ‌های کاربران</h2>
              </div>

              <div className="flex flex-col gap-4">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="font-bold text-gray-700">{q.full_name}</span>
                      {q.subject && <span className="bg-white px-2 py-0.5 rounded-md border text-gray-500">{q.subject}</span>}
                    </div>
                    <p className="text-sm font-medium text-gray-800 leading-6">❓ {q.question}</p>
                    {q.answer && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-[#1e3a8a] bg-blue-50/60 p-3 rounded-xl leading-6">
                        <span className="font-bold block text-xs mb-1">پاسخ کارشناس گره‌گشا:</span>
                        {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ستون چپ: فرم ارسال سوال به ادمین */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-blue-100 sticky top-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
              <Send size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">طرح پرسش یا درخواست مشاوره</h2>
              <p className="text-xs text-gray-500">پاسخ مستقیماً برای شما ارسال خواهد شد</p>
            </div>
          </div>

          {submitSuccess && (
            <div className="mb-4 p-4 rounded-2xl bg-green-50 text-green-700 border border-green-200 text-sm flex items-center gap-2">
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-sm flex items-center gap-2">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">نام و نام خانوادگی *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="مثال: علی محمدی"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">شماره موبایل یا ایمیل *</label>
              <input
                type="text"
                required
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">موضوع (اختیاری)</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="مثال: سوال درباره ثبت شغل"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">متن پرسش شما *</label>
              <textarea
                required
                rows={4}
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="سوال یا پیام خود را بنویسید..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm leading-6"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              <span>{submitting ? 'در حال ارسال...' : 'ارسال پرسش به کارشناسان'}</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default QA;
