from django.db import models

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
        verbose_name="پاسخ صحیح (واجد شرایط قرعه‌کشی)",
        db_index=True
    )
    ip_address = models.GenericIPAddressField(
        null=True, 
        blank=True, 
        verbose_name="آدرس آی‌پی کاربر"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="زمان ارسال پاسخ"
    )

    class Meta:
        verbose_name = "شرکت‌کننده قرعه‌کشی"
        verbose_name_plural = "لیست شرکت‌کنندگان در قرعه‌کشی"
        unique_together = [
            ('question', 'phone_number'),
            ('question', 'national_code'),
        ]
        ordering = ['-created_at']

    def __str__(self):
        status = "صحیح (قرعه‌کشی)" if self.is_correct else "نادرست"
        return f"{self.phone_number} ({self.national_code}) - {self.selected_option.text} [{status}]"
