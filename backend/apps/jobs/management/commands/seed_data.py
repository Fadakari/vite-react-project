from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.jobs.models import Category, Job
from apps.qa.models import FAQ, UserQuestion

User = get_user_model()

class Command(BaseCommand):
    help = 'ایجاد داده‌های اولیه نمونه و کاربر ادمین برای تست سامانه'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("در حال ایجاد کاربر ادمین..."))
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123456')
            self.stdout.write(self.style.SUCCESS("کاربر ادمین با موفقیت ایجاد شد: نام کاربری: admin / رمز عبور: admin123456"))
        else:
            self.stdout.write(self.style.WARNING("کاربر admin از قبل وجود دارد."))

        self.stdout.write(self.style.NOTICE("در حال ایجاد دسته‌بندی‌ها و مشاغل اولیه..."))
        
        cat_luster, _ = Category.objects.get_or_create(name='لوازم خانگی و لوستر', slug='home-luster')
        cat_mobile, _ = Category.objects.get_or_create(name='موبایل و دیجیتال', slug='mobile-digital')
        cat_car, _ = Category.objects.get_or_create(name='تعمیرات و خدمات خودرو', slug='car-service')

        jobs_data = [
            {
                'title': 'خانه لوستر',
                'category': cat_luster,
                'description': 'ارائه زیباترین لوسترها، چراغ‌های تزئینی و ملزومات روشنایی برای منازل و محیط‌های اداری با ضمانت کیفیت.',
                'phone': '09133510620',
                'instagram': 'khanehluster',
                'address': 'یزد، بلوار جمهوری، جنب فروشگاه مرکزی',
                'is_featured': True,
                'is_active': True,
                'order': 1,
            },
            {
                'title': 'فروشگاه چهارسو',
                'category': cat_mobile,
                'description': 'فروش انواع گوشی‌های هوشمند، لوازم جانبی اورجینال، قاب و گلس و ارائه خدمات تخصصی تعمیرات نرم‌افزاری و سخت‌افزاری.',
                'phone': '09132562066',
                'address': 'یزد، خیابان کاشانی، پاساژ چهارسو',
                'is_featured': True,
                'is_active': True,
                'order': 2,
            },
            {
                'title': 'تعمیرگاه تخصصی رجبی',
                'category': cat_car,
                'description': 'تعمیرات تخصصی انواع موتورهای ایرانی و خارجی، سیستم جلوبندی، تنظیم زاویه چرخ، تعمیر گیربکس اتوماتیک و دستی.',
                'phone': '09132744015',
                'address': 'یزد، ۵۲ متری امامشهر، بعد از تقاطع',
                'is_featured': True,
                'is_active': True,
                'order': 3,
            },
        ]

        for item in jobs_data:
            job, created = Job.objects.get_or_create(title=item['title'], defaults=item)
            if created:
                self.stdout.write(self.style.SUCCESS(f"شغل '{job.title}' ثبت شد."))

        self.stdout.write(self.style.NOTICE("در حال ایجاد سوالات متداول (FAQ)..."))
        faqs_data = [
            {
                'question': 'چگونه می‌توانم کسب‌وکار خود را در گره‌گشا ثبت کنم؟',
                'answer': 'کافیست از طریق فرم تماس با ما یا تماس تلفنی با شماره ۰۳۵۳۵۲۲۸۰۴۹ با کارشناسان ما تماس بگیرید تا مشخصات و تصاویر کسب‌وکار شما در سریع‌ترین زمان ثبت شود.',
                'category': 'ثبت شغل',
                'order': 1,
            },
            {
                'question': 'آیا معرفی و درج اطلاعات مشاغل هزینه دارد؟',
                'answer': 'معرفی اولیه مشاغل در جهت حمایت از کسب‌وکارهای بومی رایگان است. بسته‌های ویژه تبلیغاتی و جایگاه‌های اختصاصی نیز طبق تعرفه‌های مصوب ارائه می‌شوند.',
                'category': 'هزینه‌ها',
                'order': 2,
            },
            {
                'question': 'ساعات کاری و پاسخگویی تلفنی موسسه به چه صورت است؟',
                'answer': 'کارشناسان ما در روزهای کاری از ساعت ۸ صبح الی ۱۴ و عصرها از ۱۷ الی ۲۰ پاسخگوی سوالات شما هستند.',
                'category': 'پشتیبانی',
                'order': 3,
            }
        ]

        for f in faqs_data:
            faq, created = FAQ.objects.get_or_create(question=f['question'], defaults=f)
            if created:
                self.stdout.write(self.style.SUCCESS(f"سوال متداول '{faq.question[:30]}...' ثبت شد."))

        # نمونه سوال عمومی پاسخ‌داده‌شده کاربر
        if not UserQuestion.objects.filter(full_name='رضا رضایی').exists():
            UserQuestion.objects.create(
                full_name='رضا رضایی',
                contact_info='09130000000',
                subject='استعلام ثبت چند شعبه',
                question='آیا امکان ثبت همزمان چند شعبه برای یک فروشگاه زنجیره‌ای وجود دارد؟',
                answer='بله، شما می‌توانید برای هر شعبه آدرس و شماره تماس مجزا با عنوان همان برند در سامانه تعریف نمایید.',
                is_answered=True,
                is_public=True
            )
            self.stdout.write(self.style.SUCCESS("یک نمونه سوال و جواب عمومی کاربر ایجاد شد."))

        # ایجاد سوال پیش‌فرض مسابقه با گزینه‌های پویا
        from apps.quiz.models import QuizQuestion, QuizOption
        quiz_q = QuizQuestion.objects.first()
        if not quiz_q:
            quiz_q = QuizQuestion.objects.create(
                title='مهمترین آثار تاریخی جهان در ایران چه نام دارد؟',
                is_active=True
            )
        if not quiz_q.options.exists():
            QuizOption.objects.create(
                question=quiz_q,
                text='تخت جمشید (پرسپولیس)',
                is_correct=True,
                order=1
            )
            QuizOption.objects.create(
                question=quiz_q,
                text='میدان نقش جهان',
                is_correct=False,
                order=2
            )
            self.stdout.write(self.style.SUCCESS("سوال و گزینه‌های پیش‌فرض مسابقه ایجاد شدند."))

        self.stdout.write(self.style.SUCCESS("عملیات با موفقیت پایان یافت!"))
