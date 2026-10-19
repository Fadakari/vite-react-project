from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام دسته‌بندی")
    slug = models.SlugField(max_length=100, unique=True, allow_unicode=True, verbose_name="شناسه لاتین / اسلاگ")

    class Meta:
        verbose_name = "دسته‌بندی شغلی"
        verbose_name_plural = "دسته‌بندی‌های مشاغل"
        ordering = ['name']

    def __str__(self):
        return self.name


class Job(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان شغل / کسب‌وکار")
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="jobs", 
        verbose_name="دسته‌بندی"
    )
    description = models.TextField(verbose_name="توضیحات و مشخصات خدمات")
    phone = models.CharField(max_length=100, blank=True, verbose_name="شماره تماس")
    address = models.CharField(max_length=255, blank=True, verbose_name="آدرس مراجعه حضوری")
    instagram = models.CharField(max_length=100, blank=True, verbose_name="شناسه اینستاگرام (بدون @)")
    website = models.URLField(blank=True, verbose_name="آدرس وبسایت")
    image = models.ImageField(upload_to='jobs/', blank=True, null=True, verbose_name="تصویر یا لوگو")
    is_featured = models.BooleanField(default=False, verbose_name="نمایش در صفحه اصلی (ویژه)")
    is_active = models.BooleanField(default=True, verbose_name="فعال و قابل نمایش")
    order = models.PositiveIntegerField(default=0, verbose_name="اولویت ترتیب نمایش")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین بروزرسانی")

    class Meta:
        verbose_name = "معرفی شغل"
        verbose_name_plural = "لیست مشاغل"
        ordering = ['order', '-id']

    def __str__(self):
        return self.title
