from django.contrib import admin
from django.utils.html import format_html
from .models import Job, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'jobs_count')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

    def jobs_count(self, obj):
        return obj.jobs.count()
    jobs_count.short_description = "تعداد مشاغل"


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'image_preview',
        'title',
        'category',
        'phone',
        'is_featured',
        'is_active',
        'order',
        'created_at',
    )
    list_filter = ('is_active', 'is_featured', 'category')
    search_fields = ('title', 'description', 'phone', 'address')
    list_editable = ('is_active', 'is_featured', 'order')
    list_per_page = 20

    fieldsets = (
        ('اطلاعات اصلی شغل', {
            'fields': ('title', 'category', 'description', 'image')
        }),
        ('اطلاعات تماس و آدرس', {
            'fields': ('phone', 'address', 'instagram', 'website')
        }),
        ('تنظیمات نمایش', {
            'fields': ('is_featured', 'is_active', 'order')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 8px;" />', obj.image.url)
        return "بدون تصویر"
    image_preview.short_description = "تصویر"
