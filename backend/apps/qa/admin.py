from django.contrib import admin
from .models import FAQ, UserQuestion

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'order', 'is_published', 'created_at')
    list_filter = ('category', 'is_published')
    search_fields = ('question', 'answer')
    list_editable = ('order', 'is_published')
    list_per_page = 20


@admin.register(UserQuestion)
class UserQuestionAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'contact_info', 'subject', 'is_answered', 'is_public', 'created_at')
    list_filter = ('is_answered', 'is_public', 'created_at')
    search_fields = ('full_name', 'contact_info', 'subject', 'question', 'answer')
    list_editable = ('is_public',)
    readonly_fields = ('created_at', 'answered_at')
    list_per_page = 20

    fieldsets = (
        ('مشخصات ارسال‌کننده پرسش', {
            'fields': ('full_name', 'contact_info', 'created_at')
        }),
        ('متن پرسش', {
            'fields': ('subject', 'question')
        }),
        ('پاسخ کارشناس موسسه و تنظیمات نمایش', {
            'fields': ('answer', 'is_answered', 'is_public', 'answered_at'),
            'description': 'با وارد کردن پاسخ، وضعیت پرسش به حالت "پاسخ داده شده" تغییر می‌کند. برای نمایش در سایت تیک "نمایش عمومی" را بزنید.'
        }),
    )
