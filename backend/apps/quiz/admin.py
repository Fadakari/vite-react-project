import random
from django.contrib import admin, messages
from django.utils.html import format_html
from django.db.models import Sum
from .models import QuizQuestion, QuizOption, QuizSubmission

class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 2
    fields = ('order', 'text', 'is_correct')
    verbose_name = "گزینه"
    verbose_name_plural = "گزینه‌های این سوال (هر تعداد مایلید اضافه کنید)"


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = (
        'title', 
        'options_count', 
        'correct_option_preview', 
        'is_active', 
        'total_count', 
        'eligible_lottery_count',
        'total_donations_display'
    )
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
    total_count.short_description = "کل شرکت‌کنندگان"

    def eligible_lottery_count(self, obj):
        count = obj.submissions.filter(is_eligible_for_lottery=True).count()
        return format_html('<b style="color: #15803d; font-size: 13px;">🎯 {} نفر (پاسخ صحیح + دونیت)</b>', count)
    eligible_lottery_count.short_description = "واجدین شرایط قرعه‌کشی"

    def total_donations_display(self, obj):
        total = obj.submissions.filter(has_donated=True).aggregate(s=Sum('donation_amount'))['s'] or 0
        toman = total // 10
        return format_html('<span style="color: #b45309; font-weight: bold;">{} تومان</span>', f"{toman:,}")
    total_donations_display.short_description = "مجموع دونیت‌ها"


@admin.register(QuizSubmission)
class QuizSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        'phone_number', 
        'national_code', 
        'card_code_badge',
        'selected_option_display', 
        'donation_badge',
        'status_badge', 
        'payment_ref_num',
        'created_at'
    )
    list_filter = (
        'is_eligible_for_lottery', 
        'has_donated', 
        'is_correct', 
        'payment_status', 
        'question', 
        'created_at'
    )
    search_fields = (
        'phone_number', 
        'national_code', 
        'golden_card_code', 
        'payment_ref_num', 
        'payment_res_num', 
        'ip_address', 
        'device_fingerprint'
    )
    readonly_fields = (
        'created_at', 
        'golden_card_code', 
        'golden_card_created_jalali', 
        'golden_card_expires_jalali',
        'payment_res_num',
        'payment_ref_num',
        'payment_trace_no',
        'payment_card_pan',
        'ip_address', 
        'device_fingerprint'
    )
    actions = ['pick_random_winner']

    def card_code_badge(self, obj):
        if obj.golden_card_code:
            return format_html(
                '<span style="background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-weight: bold; border: 1px solid #fde68a;">{}</span>',
                obj.golden_card_code
            )
        return "—"
    card_code_badge.short_description = "کد کارت طلایی"

    def selected_option_display(self, obj):
        text = obj.selected_option.text if obj.selected_option else "—"
        if obj.is_correct:
            return format_html('<span style="color: #15803d; font-weight: bold;">{} (صحیح)</span>', text)
        return format_html('<span style="color: #6b7280;">{} (نادرست)</span>', text)
    selected_option_display.short_description = "گزینه انتخابی"

    def donation_badge(self, obj):
        if obj.has_donated:
            toman = obj.donation_amount // 10
            return format_html(
                '<span style="background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 6px; font-weight: bold;">💳 {} تومان</span>',
                f"{toman:,}"
            )
        return format_html('<span style="color: #9ca3af;">بدون پرداخت (رایگان)</span>')
    donation_badge.short_description = "وضعیت دونیت"

    def status_badge(self, obj):
        if obj.is_eligible_for_lottery:
            return format_html(
                '<span style="background: #15803d; color: white; padding: 4px 10px; border-radius: 8px; font-weight: bold;">🎯 واجد شرایط قرعه‌کشی</span>'
            )
        elif obj.has_donated and not obj.is_correct:
            return format_html(
                '<span style="background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 8px; font-weight: bold;">🎟️ دارنده کارت طلایی (دونیت)</span>'
            )
        return format_html(
            '<span style="background: #f3f4f6; color: #4b5563; padding: 4px 10px; border-radius: 8px;">🎟️ دارنده کارت طلایی (رایگان)</span>'
        )
    status_badge.short_description = "وضعیت نهایی"

    @admin.action(description="🎁 انتخاب تصادفی یک برنده از بین شرکت‌کنندگان واجد شرایط (پاسخ صحیح + پرداخت دونیت)")
    def pick_random_winner(self, request, queryset):
        # قانون رسمی: فقط کاربرانی که پاسخ صحیح داده‌اند و دونیت پرداخت کرده‌اند واجد شرایط قرعه‌کشی هستند
        eligible = queryset.filter(is_eligible_for_lottery=True)
        if not eligible.exists():
            self.message_user(
                request, 
                "⚠️ هیچ کاربری با شرط «پاسخ صحیح + پرداخت حمایت مالی (دونیت)» در موارد انتخابی وجود ندارد!", 
                level=messages.WARNING
            )
            return

        winner = random.choice(list(eligible))
        toman = winner.donation_amount // 10
        self.message_user(
            request, 
            f"🎉 برنده خوش‌شانس قرعه‌کشی مشخص شد! | شماره تماس: {winner.phone_number} | کد ملی: {winner.national_code} | کد کارت طلایی: {winner.golden_card_code} | مبلغ دونیت: {toman:,} تومان | تاریخ ثبت: {winner.created_at.strftime('%Y/%m/%d %H:%M')}",
            level=messages.SUCCESS
        )
