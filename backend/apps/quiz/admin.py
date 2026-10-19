import random
from django.contrib import admin, messages
from django.utils.html import format_html
from .models import QuizQuestion, QuizOption, QuizSubmission

class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 2
    fields = ('order', 'text', 'is_correct')
    verbose_name = "گزینه"
    verbose_name_plural = "گزینه‌های این سوال (هر تعداد مایلید اضافه کنید)"


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'options_count', 'correct_option_preview', 'is_active', 'total_count', 'correct_count')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title',)
    list_editable = ('is_active',)
    inlines = [QuizOptionInline]

    def options_count(self, obj):
        return obj.options.count()
    options_count.short_description = "تعداد گزینه‌ها"

    def correct_option_preview(self, obj):
        correct = obj.options.filter(is_correct=True).first()
        if correct:
            return format_html('<span style="color: #15803d; font-weight: bold;">{}</span>', correct.text)
        return format_html('<span style="color: #dc2626;">تعیین نشده!</span>')
    correct_option_preview.short_description = "گزینه صحیح تعیین‌شده"

    def total_count(self, obj):
        return obj.submissions.count()
    total_count.short_description = "تعداد کل شرکت‌کنندگان"

    def correct_count(self, obj):
        count = obj.submissions.filter(is_correct=True).count()
        return format_html('<b style="color: #1e3a8a;">{} نفر</b>', count)
    correct_count.short_description = "واجدین شرایط قرعه‌کشی"


@admin.register(QuizSubmission)
class QuizSubmissionAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'national_code', 'question', 'selected_option_display', 'status_badge', 'ip_address', 'created_at')
    list_filter = ('is_correct', 'question', 'created_at')
    search_fields = ('phone_number', 'national_code', 'ip_address', 'device_fingerprint')
    readonly_fields = ('created_at', 'ip_address', 'device_fingerprint')
    actions = ['pick_random_winner']

    def selected_option_display(self, obj):
        return obj.selected_option.text if obj.selected_option else "—"
    selected_option_display.short_description = "گزینه کاربر"

    def status_badge(self, obj):
        if obj.is_correct:
            return format_html('<span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 8px; font-weight: bold;">✅ برنده قرعه‌کشی (صحیح)</span>')
        return format_html('<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 8px;">❌ نادرست</span>')
    status_badge.short_description = "وضعیت قرعه‌کشی"

    @admin.action(description="🎁 انتخاب تصادفی یک برنده از بین پاسخ‌های صحیح انتخاب شده")
    def pick_random_winner(self, request, queryset):
        eligible = queryset.filter(is_correct=True)
        if not eligible.exists():
            self.message_user(request, "هیچ شرکت‌کننده‌ای با پاسخ صحیح در موارد انتخابی وجود ندارد!", level=messages.WARNING)
            return

        winner = random.choice(list(eligible))
        self.message_user(
            request, 
            f"🎉 برنده خوش‌شانس قرعه‌کشی مشخص شد! شماره تماس: {winner.phone_number} (تاریخ ثبت: {winner.created_at.strftime('%Y/%m/%d %H:%M')})",
            level=messages.SUCCESS
        )
