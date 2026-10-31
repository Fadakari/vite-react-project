import uuid
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import IntegrityError
from django.conf import settings
from django.urls import reverse

from .models import QuizQuestion, QuizOption, QuizSubmission
from .serializers import QuizQuestionPublicSerializer, QuizSubmissionCreateSerializer
from apps.payment.views import get_sep_callback_url

# تنظیمات درگاه پرداخت سامان
SEP_TERMINAL_ID = getattr(settings, 'SEP_TERMINAL_ID', '21689219')
SEP_TOKEN_URL   = "https://sep.shaparak.ir/onlinepg/onlinepg"
SEP_PAYMENT_URL = "https://sep.shaparak.ir/OnlinePG/OnlinePG"

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class ActiveQuizAPIView(APIView):
    """دریافت جدیدترین مسابقه فعال به همراه لیست گزینه‌های پویا"""
    permission_classes = [AllowAny]

    def get(self, request):
        active_quiz = QuizQuestion.objects.filter(is_active=True).prefetch_related('options').first()
        if not active_quiz:
            return Response({
                "active": False,
                "message": "در حال حاضر مسابقه‌ای فعال نیست."
            }, status=status.HTTP_200_OK)

        serializer = QuizQuestionPublicSerializer(active_quiz)
        return Response({
            "active": True,
            "quiz": serializer.data
        }, status=status.HTTP_200_OK)


class QuizSubmissionAPIView(APIView):
    """
    ثبت پاسخ مسابقه بدون پرداخت (دریافت کارت طلایی هدیه):
    - بررسی فرمت 09 شماره
    - بررسی صحت کد ملی با فرمول ثبت احوال
    - بررسی یکتایی شماره، کد ملی و اثر انگشت دستگاه
    - صدور فوری کارت طلایی تخفیف گره‌گشا با کد و تاریخ‌های شمسی
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizSubmissionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return Response({
                "status": "error",
                "message": str(first_error),
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        question = validated_data['question_obj']
        option = validated_data['option_obj']
        phone = validated_data['phone_number']
        national_code = validated_data.get('national_code', '')
        device_fingerprint = validated_data.get('device_fingerprint', '')

        is_correct = option.is_correct
        client_ip = get_client_ip(request)

        try:
            submission = QuizSubmission.objects.create(
                question=question,
                selected_option=option,
                phone_number=phone,
                national_code=national_code,
                device_fingerprint=device_fingerprint or None,
                is_correct=is_correct,
                has_donated=False,
                donation_amount=0,
                is_eligible_for_lottery=False,
                payment_status='none',
                ip_address=client_ip
            )
        except IntegrityError:
            return Response({
                "status": "error",
                "message": "اطلاعات هویتی شما قبلاً در این مسابقه ثبت شده است."
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "status": "success",
            "mode": "free_golden_card",
            "has_donated": False,
            "is_eligible_for_lottery": False,
            "card": {
                "code": submission.golden_card_code,
                "created_jalali": submission.golden_card_created_jalali,
                "expires_jalali": submission.golden_card_expires_jalali,
                "phone": submission.phone_number,
                "national_code": submission.national_code
            },
            "message": "پاسخ شما با موفقیت ثبت شد و کارت طلایی تخفیف گره‌گشا به شما تعلق گرفت."
        }, status=status.HTTP_201_CREATED)


class QuizStartPaymentAPIView(APIView):
    """
    شروع فرآیند حمایت مالی (دونیت) و ورود به قرعه‌کشی:
    - اعتبارسنجی مشخصات شرکت‌کننده
    - ذخیره اطلاعات به صورت در انتظار پرداخت (pending)
    - دریافت توکن از درگاه شاپرک سامان (SEP)
    - در صورت در دسترس نبودن شاپرک در لوکال، انتقال به شبیه‌ساز پرداخت تستی
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizSubmissionCreateSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return Response({
                "status": "error",
                "message": str(first_error),
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        question = validated_data['question_obj']
        option = validated_data['option_obj']
        phone = validated_data['phone_number']
        national_code = validated_data.get('national_code', '')
        device_fingerprint = validated_data.get('device_fingerprint', '')

        # دریافت مبلغ دونیت (پیش‌فرض ۱۵,۰۰۰ تومان / ۱۵۰,۰۰۰ ریال)
        amount = int(request.data.get('amount', 150000))
        if amount < 10000:
            amount = 150000

        is_correct = option.is_correct
        client_ip = get_client_ip(request)
        res_num = uuid.uuid4().hex[:20]

        # بررسی اینکه آیا قبلاً ثبت شده یا در حالت pending است
        existing = QuizSubmission.objects.filter(
            question=question, 
            phone_number=phone
        ).first()

        if existing:
            if existing.payment_status in ['paid', 'none']:
                return Response({
                    "status": "error",
                    "message": "امکان ثبت مجدد وجود ندارد؛ این شماره قبلاً در سامانه ثبت شده است."
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                # به‌روزرسانی رکورد pending
                submission = existing
                submission.selected_option = option
                submission.national_code = national_code
                submission.is_correct = is_correct
                submission.donation_amount = amount
                submission.payment_res_num = res_num
                submission.payment_status = 'pending'
                submission.save()
        else:
            try:
                submission = QuizSubmission.objects.create(
                    question=question,
                    selected_option=option,
                    phone_number=phone,
                    national_code=national_code,
                    device_fingerprint=device_fingerprint or None,
                    is_correct=is_correct,
                    has_donated=False,
                    donation_amount=amount,
                    is_eligible_for_lottery=False,
                    payment_status='pending',
                    payment_res_num=res_num,
                    ip_address=client_ip
                )
            except IntegrityError:
                return Response({
                    "status": "error",
                    "message": "اطلاعات هویتی شما قبلاً در این مسابقه ثبت شده است."
                }, status=status.HTTP_400_BAD_REQUEST)

        callback_url = get_sep_callback_url(request)

        payload = {
            "action": "token",
            "TerminalId": int(SEP_TERMINAL_ID),
            "Amount": amount,
            "ResNum": res_num,
            "RedirectUrl": callback_url,
        }

        # تلاش برای دریافت توکن از درگاه شاپرک
        try:
            resp = requests.post(SEP_TOKEN_URL, json=payload, timeout=4)
            data = resp.json()
            if data.get("status") == 1 and data.get("token"):
                token = data.get("token")
                return Response({
                    "status": "success",
                    "payment_type": "sep",
                    "token": token,
                    "payment_url": SEP_PAYMENT_URL,
                    "res_num": res_num,
                    "amount": amount
                }, status=status.HTTP_200_OK)
        except Exception as e:
            print("SEP gateway unreachable from current network, using local fallback simulator:", e)

        # در محیط توسعه لوکال یا مواقع قطع بودن اتصال شاپرک، به شبیه‌ساز هدایت می‌شود
        simulator_url = f"/payment/simulator/?res_num={res_num}&amount={amount}"
        return Response({
            "status": "success",
            "payment_type": "simulator",
            "redirect_url": simulator_url,
            "res_num": res_num,
            "amount": amount
        }, status=status.HTTP_200_OK)


import io
import os
from PIL import Image, ImageDraw, ImageFont
from django.http import HttpResponse

class CardImageGeneratorAPIView(APIView):
    """
    تولید مستقیم تصویر کارت طلایی با درج کد و تاریخ‌های شمسی روی خود پیکسل‌های عکس
    """
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('code', 'GK-7283-4F9D').strip()
        created = request.GET.get('created', '۱۴۰۵/۰۸/۰۹').strip()
        expires = request.GET.get('expires', '۱۴۰۶/۰۸/۰۹').strip()

        template_path = os.path.join(settings.BASE_DIR, 'static', 'card_clean_template.png')
        if not os.path.exists(template_path):
            return HttpResponse("قالب کارت یافت نشد", status=404)

        try:
            img = Image.open(template_path).convert('RGBA')
            draw = ImageDraw.Draw(img)

            try:
                font_code = ImageFont.truetype('arialbd.ttf', 38)
                font_date = ImageFont.truetype('tahoma.ttf', 24)
            except Exception:
                font_code = ImageFont.load_default()
                font_date = ImageFont.load_default()

            # درج کد اختصاصی شما در باکس اول
            draw.text((380, 328), code, fill=(15, 23, 42), font=font_code, anchor='mm')
            # درج تاریخ ایجاد شمسی در باکس دوم (چپ)
            draw.text((262, 432), created, fill=(15, 23, 42), font=font_date, anchor='mm')
            # درج تاریخ انقضا شمسی در باکس دوم (راست)
            draw.text((530, 432), expires, fill=(15, 23, 42), font=font_date, anchor='mm')

            buf = io.BytesIO()
            img.save(buf, format='PNG')
            buf.seek(0)
            return HttpResponse(buf.getvalue(), content_type='image/png')
        except Exception as e:
            return HttpResponse(f"Error: {e}", status=500)

