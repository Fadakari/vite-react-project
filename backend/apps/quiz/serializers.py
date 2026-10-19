import re
from rest_framework import serializers
from .models import QuizQuestion, QuizOption, QuizSubmission

def normalize_digits(raw_str: str) -> str:
    """تبدیل ارقام فارسی و عربی به انگلیسی و پاکسازی کاراکترهای نامعتبر"""
    if not raw_str:
        return ""
    persian_digits = "۰۱۲۳۴۵۶۷۸۹"
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    cleaned = str(raw_str).strip()
    for i in range(10):
        cleaned = cleaned.replace(persian_digits[i], str(i))
        cleaned = cleaned.replace(arabic_digits[i], str(i))
    
    return re.sub(r'[\s\-_+]', '', cleaned)


def is_valid_national_code(code: str) -> bool:
    """الگوریتم اعتبارسنجی فرمول ریاضی رقم کنترلی کد ملی ایران"""
    if not re.match(r'^\d{10}$', code):
        return False
    if len(set(code)) == 1:
        return False
    check = int(code[9])
    total = sum(int(code[i]) * (10 - i) for i in range(9))
    remainder = total % 11
    if remainder < 2:
        return check == remainder
    else:
        return check == (11 - remainder)


class QuizOptionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'text', 'order']


class QuizQuestionPublicSerializer(serializers.ModelSerializer):
    options = QuizOptionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ['id', 'title', 'options']


class QuizSubmissionCreateSerializer(serializers.Serializer):
    question_id = serializers.IntegerField(required=True)
    option_id = serializers.IntegerField(required=True)
    phone_number = serializers.CharField(max_length=20, required=True)
    national_code = serializers.CharField(max_length=20, required=True)
    device_fingerprint = serializers.CharField(max_length=128, required=False, allow_blank=True, default='')

    def validate_phone_number(self, value):
        phone = normalize_digits(value)
        if not re.match(r"^09\d{9}$", phone):
            raise serializers.ValidationError(
                "شماره تماس نامعتبر است. شماره حتماً باید ۱۱ رقم بوده و با 09 شروع شود (مانند 09123456789)."
            )
        return phone

    def validate_national_code(self, value):
        code = normalize_digits(value)
        if not is_valid_national_code(code):
            raise serializers.ValidationError(
                "کد ملی وارد شده نامعتبر است. لطفاً کد ملی ۱۰ رقمی صحیح را وارد کنید."
            )
        return code

    def validate(self, attrs):
        question_id = attrs.get('question_id')
        option_id = attrs.get('option_id')
        phone = attrs.get('phone_number')
        national_code = attrs.get('national_code')
        device_fingerprint = attrs.get('device_fingerprint', '').strip()

        # ۱. بررسی وجود و فعال بودن سوال مسابقه
        try:
            question = QuizQuestion.objects.get(id=question_id, is_active=True)
        except QuizQuestion.DoesNotExist:
            raise serializers.ValidationError({"question_id": "سوال مسابقه یافت نشد یا مسابقه به اتمام رسیده است."})

        # ۲. بررسی اینکه گزینه مربوط به این سوال باشد
        try:
            option = question.options.get(id=option_id)
        except QuizOption.DoesNotExist:
            raise serializers.ValidationError({"option_id": "گزینه انتخاب شده نامعتبر است."})

        # ۳. جلوگیری از تکرار کد ملی
        if QuizSubmission.objects.filter(question=question, national_code=national_code).exists():
            raise serializers.ValidationError({
                "national_code": "امکان ثبت پاسخ وجود ندارد؛ این کد ملی قبلاً در این دوره مسابقه ثبت شده است."
            })

        # ۴. جلوگیری از تکرار شماره تماس
        if QuizSubmission.objects.filter(question=question, phone_number=phone).exists():
            raise serializers.ValidationError({
                "phone_number": "امکان ثبت پاسخ وجود ندارد؛ این شماره تماس قبلاً در این دوره مسابقه ثبت شده است."
            })

        # ۵. جلوگیری از شرکت یک دستگاه با سیم‌کارت‌های مختلف (حتی در صورت تغییر آی‌پی)
        # پیام به صورت کاملاً گنگ و مبهم تنظیم شده تا کاربر متوجه نحوه شناسایی نشود
        if device_fingerprint:
            if QuizSubmission.objects.filter(question=question, device_fingerprint=device_fingerprint).exists():
                raise serializers.ValidationError({
                    "device_fingerprint": "امکان ثبت پاسخ وجود ندارد. اطلاعات هویتی یا مشخصات این نشست قبلاً در سامانه ثبت شده و هر کاربر تنها یک‌بار مجاز به ارسال پاسخ است."
                })

        attrs['question_obj'] = question
        attrs['option_obj'] = option
        return attrs
