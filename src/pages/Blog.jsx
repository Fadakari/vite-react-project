import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import JobDetailModal from '../components/JobDetailModal';
import { fetchJobs, fetchJobCategories } from '../services/api';
import { Search, Tag, Filter, RefreshCw, Briefcase, Store } from 'lucide-react';
import img1 from '../assets/5093763060974947300.jpg';
import img2 from '../assets/5093763060974947301.jpg';
import img3 from '../assets/5093763060974947302.jpg';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('job');

  const defaultJobs = [
    {
      id: 1,
      title: 'خانه لوستر',
      category_name: 'دکوراسیون و روشنایی',
      description: 'فروش انواع لوستر مدرن و کلاسیک، آباژور و چراغ‌های تزیینی برای منازل و ادارات با بالاترین کیفیت.',
      phone: '09133510620',
      instagram: 'khanehluster',
      address: 'یزد، بلوار جمهوری اسلامی، روبروی امامزاده جعفر',
      image: img1,
      is_featured: true,
    },
    {
      id: 2,
      title: 'فروشگاه چهارسو',
      category_name: 'موبایل و دیجیتال',
      description: 'عرضه جدیدترین گوشی‌های هوشمند، تبلت و لوازم جانبی اورجینال به همراه خدمات تخصصی تعمیرات نرم‌افزاری و سخت‌افزاری.',
      phone: '09132562066',
      instagram: 'chaharsou_store',
      address: 'یزد، خیابان کاشانی، پاساژ ولیعصر، طبقه همکف',
      image: img2,
      is_featured: true,
    },
    {
      id: 3,
      title: 'تعمیرگاه تخصصی رجبی',
      category_name: 'خدمات خودرو',
      description: 'کلیه خدمات تخصصی تنظیم موتور، جلوبندی، عیب‌یابی با دستگاه دیاگ و تعمیر گیربکس خودروهای ایرانی و خارجی.',
      phone: '09132744015',
      instagram: '',
      address: 'یزد، بلوار آزادگان، بعد از کوچه ۲۲',
      image: img3,
      is_featured: true,
    },
  ];

  const [jobsData, setJobsData] = useState(defaultJobs);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // دریافت لیست دسته‌بندی‌ها و مشاغل از سرور
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsRes, catsRes] = await Promise.all([
          fetchJobs(),
          fetchJobCategories(),
        ]);

        if (jobsRes && jobsRes.length > 0) {
          setJobsData(jobsRes);
          // اگر در آدرس پارامتر job=id آمده بود، مودال همان شغل باز شود
          if (initialJobId) {
            const matched = jobsRes.find((j) => String(j.id) === String(initialJobId));
            if (matched) setSelectedJob(matched);
          }
        } else if (initialJobId) {
          const matched = defaultJobs.find((j) => String(j.id) === String(initialJobId));
          if (matched) setSelectedJob(matched);
        }

        if (catsRes && catsRes.length > 0) {
          setCategories(catsRes);
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialJobId]);

  // فیلتر کردن لیست بر اساس جستجو و دسته‌بندی
  const filteredJobs = jobsData.filter((job) => {
    const matchesCat = 
      selectedCategory === 'all' || 
      String(job.category) === String(selectedCategory) || 
      job.category_name === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query || 
      job.title?.toLowerCase().includes(query) || 
      job.description?.toLowerCase().includes(query) || 
      job.address?.toLowerCase().includes(query) || 
      job.phone?.toLowerCase().includes(query);

    return matchesCat && matchesSearch;
  });

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    if (job?.id) {
      setSearchParams({ job: job.id });
    }
  };

  const handleCloseJob = () => {
    setSelectedJob(null);
    setSearchParams({});
  };

  return (
    <div className="pt-24 md:pt-[13rem] w-full container mx-auto px-4 max-w-6xl pb-24" dir="rtl">
      
      {/* سربرگ صفحه */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1e3a8a] text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-blue-100">
          <Briefcase size={14} />
          <span>بانک اطلاعات جامع مشاغل و اصناف</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1e3a8a] mb-3">
          معرفی کسب‌وکارها و خدمات برتر
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">
          مشاهده مشخصات کامل، راه‌های ارتباطی، نشانی و خدمات اصناف و مشاغل معتبر همشهریان گرامی
        </p>
        <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full mt-4"></div>
      </div>

      {/* بخش جستجو و فیلترها */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* اینپوت جستجو */}
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی عنوان، خدمات، آدرس یا تلفن..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white transition-all"
            />
            <Search size={18} className="absolute right-4 top-3.5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-3 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* آمار نتایج */}
          <div className="text-xs text-gray-500 font-medium">
            تعداد مشاغل یافت‌شده: <span className="font-bold text-[#1e3a8a] text-sm">{filteredJobs.length}</span> مورد
          </div>

        </div>

        {/* تب‌های دسته‌بندی */}
        {categories.length > 0 && (
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 flex-shrink-0">
              <Filter size={13} />
              دسته‌ها:
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#1e3a8a] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              همه مشاغل
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                  String(selectedCategory) === String(cat.id)
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* وضعیت بارگذاری یا نتایج خالی */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={32} className="animate-spin text-[#1e3a8a]" />
          <p className="text-sm text-gray-500 font-bold">در حال بارگذاری اطلاعات مشاغل...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">موردی یافت نشد</h3>
          <p className="text-xs text-gray-500 mb-5">
            هیچ کسب‌وکاری مطابق با جستجو یا فیلتر انتخابی شما پیدا نشد.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="bg-[#1e3a8a] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md hover:bg-blue-900 transition-all"
          >
            پاک کردن فیلترها و مشاهده همه
          </button>
        </div>
      ) : (
        /* گرید کارت‌های مشاغل */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredJobs.map((job) => (
            <PostCard 
              key={job.id}
              job={job}
              onClick={() => handleOpenJob(job)}
            />
          ))}
        </div>
      )}

      {/* مودال جزئیات کامل شغل انتخابی */}
      {selectedJob && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={handleCloseJob} 
        />
      )}
      
    </div>
  );
};

export default Blog;