import random
from django.db import models
import jdatetime

def generate_golden_card_code():
    """تولید کد اختصاصی کارت طلایی با الگوی مشابه تصویر: GK-XXXX-XXXX"""
    chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    part1 = ''.join(random.choices(chars, k=4))
    part2 = ''.join(random.choices(chars, k=4))
    return f"GK-{part1}-{part2}"

def to_persian_digits(text):
    """تبدیل اعداد انگلیسی به فارسی"""
    if not text:
        return ""
    persian_digits = "۰۱۲۳۴۵۶۷۸۹"
    english_digits = "0123456789"
    res = str(text)
    for en, fa in zip(english_digits, persian_digits):
        res = res.replace(en, fa)
    return res

def get_current_and_expiry_jalali():
    """محاسبه تاریخ امروز و تاریخ انقضا (دقیقاً ۱ سال بعد) به شمسی"""
    try:
        now = jdatetime.datetime.now()
        created_str = now.strftime('%Y/%m/%d')
        try:
            expires = now.replace(year=now.year + 1)
        except ValueError:
            # مدیریت سال کبیسه (مثلاً ۳۰ اسفند)
            expires = now + jdatetime.timedelta(days=365)
        expires_str = expires.strftime('%Y/%m/%d')
        return to_persian_digits(created_str), to_persian_digits(expires_str)
    except Exception:
        return "۱۴۰۵/۰۸/۰۹", "۱۴۰۶/۰۸/۰۹"


class QuizQuestion(models.Model):
    title = models.CharField(
        max_length=300, 
        verbose_name="متن سوال مسابقه",
        default="مهمترین آثار تاریخی جهان در ایران چه نام دارد؟"
    )
    is_active = models.BooleanField(
        default=True, 
        verbose_name="مسابقه فعال است (نمایش در سایت)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "سوال مسابقه"
        verbose_name_plural = "سوالات مسابقه و قرعه‌کشی"
        ordering = ['-id']

    def __str__(self):
        return f"{self.title[:60]}"


class QuizOption(models.Model):
    question = models.ForeignKey(
        QuizQuestion,
        on_delete=models.CASCADE,
        related_name="options",
        verbose_name="سوال مربوطه"
    )
    text = models.CharField(max_length=255, verbose_name="متن گزینه")
    is_correct = models.BooleanField(
        default=False, 
        verbose_name="گزینه صحیح است (واجد شرایط قرعه‌کشی)"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش")

    class Meta:
        verbose_name = "گزینه سوال"
        verbose_name_plural = "گزینه‌های سوال"
        ordering = ['order', 'id']

    def __str__(self):
        status = "✅ صحیح" if self.is_correct else ""
        return f"{self.text} {status}".strip()


class QuizSubmission(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('none', 'بدون پرداخت (رایگان)'),
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت موفق'),
        ('failed', 'پرداخت ناموفق یا لغوشده'),
    ]

    question = models.ForeignKey(
        QuizQuestion, 
        on_delete=models.CASCADE, 
        related_name="submissions", 
        verbose_name="سوال مسابقه"
    )
    selected_option = models.ForeignKey(
        QuizOption,
        on_delete=models.CASCADE,
        related_name="submissions",
        verbose_name="گزینه انتخابی کاربر"
    )
    phone_number = models.CharField(
        max_length=11, 
        verbose_name="شماره موبایل",
        db_index=True
    )
    national_code = models.CharField(
        max_length=10, 
        verbose_name="کد ملی",
        db_index=True,
        blank=True,
        null=True
    )
    device_fingerprint = models.CharField(
        max_length=128, 
        blank=True, 
        null=True, 
        verbose_name="شناسه اثر انگشت دستگاه/مرورگر",
        db_index=True,
        help_text="جهت شناسایی افرادی که با چند سیم‌کارت از یک گوشی شرکت می‌کنند"
    )
    is_correct = models.BooleanField(
        default=False, 
        verbose_name="پاسخ به سوال صحیح است",
        db_index=True
    )
    
    # فیلدهای پرداخت و دونیت
    has_donated = models.BooleanField(
        default=False, 
        db_index=True, 
        verbose_name="حمایت مالی (دونیت) پرداخت شده"
    )
    donation_amount = models.PositiveIntegerField(
        default=0, 
        verbose_name="مبلغ دونیت (ریال)"
    )
    is_eligible_for_lottery = models.BooleanField(
        default=False, 
        db_index=True, 
        verbose_name="واجد شرایط قطعی قرعه‌کشی (پاسخ صحیح + پرداخت دونیت)"
    )
    
    # فیلدهای کارت طلایی تخفیف
    golden_card_code = models.CharField(
        max_length=32, 
        blank=True, 
        db_index=True, 
        verbose_name="کد اختصاصی کارت طلایی"
    )
    golden_card_created_jalali = models.CharField(
        max_length=20, 
        blank=True, 
        verbose_name="تاریخ ایجاد کارت (شمسی)"
    )
    golden_card_expires_jalali = models.CharField(
        max_length=20, 
        blank=True, 
        verbose_name="تاریخ انقضا کارت (شمسی)"
    )

    # اطلاعات درگاه پرداخت بانکی
    payment_status = models.CharField(
        max_length=20, 
        default='none', 
        choices=PAYMENT_STATUS_CHOICES, 
        verbose_name="وضعیت پرداخت"
    )
    payment_res_num = models.CharField(
        max_length=64, 
        blank=True, 
        db_index=True, 
        verbose_name="شناسه ارجاع درگاه (ResNum)"
    )
    payment_ref_num = models.CharField(
        max_length=64, 
        blank=True, 
        db_index=True, 
        verbose_name="شماره مرجع بانکی (RefNum)"
    )
    payment_trace_no = models.CharField(
        max_length=64, 
        blank=True, 
        verbose_name="کد رهگیری تراکنش (TraceNo)"
    )
    payment_card_pan = models.CharField(
        max_length=32, 
        blank=True, 
        verbose_name="شماره کارت ماسک‌شده"
    )

    ip_address = models.GenericIPAddressField(
        null=True, 
        blank=True, 
        verbose_name="آدرس آی‌پی کاربر"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="زمان ثبت"
    )

    class Meta:
        verbose_name = "شرکت‌کننده / دارنده کارت طلایی"
        verbose_name_plural = "لیست شرکت‌کنندگان و کارت‌های طلایی"
        unique_together = [
            ('question', 'phone_number'),
        ]
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # تولید خودکار کد کارت طلایی در صورت خالی بودن
        if not self.golden_card_code:
            self.golden_card_code = generate_golden_card_code()
        # تنظیم خودکار تاریخ‌های شمسی ایجاد و انقضا
        if not self.golden_card_created_jalali or not self.golden_card_expires_jalali:
            c_date, e_date = get_current_and_expiry_jalali()
            self.golden_card_created_jalali = c_date
            self.golden_card_expires_jalali = e_date
        
        # محاسبه واجد شرایط بودن قرعه‌کشی: شرط قطعی = پاسخ صحیح + دونیت پرداخت شده
        if self.is_correct and self.has_donated:
            self.is_eligible_for_lottery = True
        else:
            self.is_eligible_for_lottery = False

        super().save(*args, **kwargs)

    def __str__(self):
        lottery_status = "🎯 واجد شرایط قرعه‌کشی" if self.is_eligible_for_lottery else "🎟️ دارنده کارت طلایی"
        return f"{self.phone_number} ({self.national_code}) - {self.golden_card_code} [{lottery_status}]"
