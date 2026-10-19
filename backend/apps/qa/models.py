from django.db import models
from django.utils import timezone

class FAQ(models.Model):
    """سوالات متداول که توسط مدیریت تعریف می‌شوند"""
    question = models.CharField(max_length=300, verbose_name="پرسش")
    answer = models.TextField(verbose_name="پاسخ کامل")
    category = models.CharField(max_length=100, blank=True, default="عمومی", verbose_name="دسته‌بندی پرسش")
    order = models.PositiveIntegerField(default=0, verbose_name="ترتیب اولویت")
    is_published = models.BooleanField(default=True, verbose_name="منتشر شده در سایت")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "سوال متداول"
        verbose_name_plural = "سوالات متداول (FAQ)"
        ordering = ['order', '-id']

    def __str__(self):
        return self.question


class UserQuestion(models.Model):
    """پرسش و پاسخ تعاملی کاربران سایت با کارشناسان موسسه"""
    full_name = models.CharField(max_length=100, verbose_name="نام و نام خانوادگی")
    contact_info = models.CharField(max_length=100, verbose_name="شماره تماس یا ایمیل")
    subject = models.CharField(max_length=200, blank=True, verbose_name="موضوع سوال")
    question = models.TextField(verbose_name="متن پرسش کاربر")
    answer = models.TextField(blank=True, null=True, verbose_name="پاسخ کارشناس / مدیریت")
    is_answered = models.BooleanField(default=False, verbose_name="پاسخ داده شده")
    is_public = models.BooleanField(
        default=False, 
        verbose_name="نمایش عمومی در سایت",
        help_text="در صورت تیک خوردن، این سوال و پاسخ آن در بخش سوالات کاربران سایت نمایش داده می‌شود."
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت سوال")
    answered_at = models.DateTimeField(blank=True, null=True, verbose_name="تاریخ پاسخ")

    class Meta:
        verbose_name = "پرسش کاربر"
        verbose_name_plural = "پرسش‌های کاربران و مشاوره"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name}: {self.question[:40]}..."

    def save(self, *args, **kwargs):
        # اگر پاسخی درج شد، وضعیت به پاسخ داده شده تغییر کند و زمان ثبت شود
        if self.answer and not self.is_answered:
            self.is_answered = True
            if not self.answered_at:
                self.answered_at = timezone.now()
        super().save(*args, **kwargs)
